#!/usr/bin/env node
/**
 * GNW Phase 6 — Claude Drive Weight Sync (GHO-54)
 *
 * Reads gho-44-cluster-drive-weights.json, computes the cluster average
 * across all active agents, applies damping 0.7, enforces safety floors,
 * and writes the result to gho-44-drive-sync-agent-config.json.
 *
 * Schedule: every 30 min at :00 and :30, 30s after publish.
 * Protocol:  new = prev * DAMPING + cluster_avg * (1 - DAMPING)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CLUSTER_PATH = join(__dirname, 'gho-44-cluster-drive-weights.json');
const CONFIG_PATH  = join(__dirname, 'gho-44-drive-sync-agent-config.json');
const AGENT_ID     = '2eaff187-885b-4bba-80ba-70bc3d234275';
const AGENT_NAME   = 'claude';
const DAMPING      = 0.7;

const SAFETY_FLOORS = {
  curiosity:     0.10,
  helpfulness:   0.10,
  competence:    0.10,
  safety:        0.50,
  goal_directed: 0.10,
};

const DRIVES = Object.keys(SAFETY_FLOORS);

function r3(v) { return Math.round(v * 1000) / 1000; }

function main() {
  // 1. Read cluster file
  if (!existsSync(CLUSTER_PATH)) {
    console.error('Cluster file not found:', CLUSTER_PATH);
    process.exit(1);
  }
  const cluster = JSON.parse(readFileSync(CLUSTER_PATH, 'utf8'));

  const activeAgents = Object.values(cluster.agents)
    .filter(a => a.status === 'active');

  if (activeAgents.length === 0) {
    console.error('No active agents in cluster.');
    process.exit(1);
  }

  // 2. Compute cluster average across all active agents (including claude)
  const clusterAvg = {};
  for (const drive of DRIVES) {
    const sum = activeAgents.reduce((acc, a) => acc + (a.weights[drive] ?? 0), 0);
    clusterAvg[drive] = r3(sum / activeAgents.length);
  }

  // 3. Load previous claude weights from existing config (fallback to cluster entry)
  let prevWeights = cluster.agents[AGENT_ID]?.weights ?? {};
  if (existsSync(CONFIG_PATH)) {
    try {
      const existing = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
      if (existing.newWeights) prevWeights = existing.newWeights;
    } catch (_) { /* use cluster weights on parse failure */ }
  }

  // 4. Apply damping: new = prev * 0.7 + cluster_avg * 0.3
  const newWeights = {};
  const floorsApplied = [];
  for (const drive of DRIVES) {
    const prev = prevWeights[drive] ?? clusterAvg[drive];
    const raw  = r3(prev * DAMPING + clusterAvg[drive] * (1 - DAMPING));
    // 5. Enforce safety floors
    const floored = r3(Math.max(raw, SAFETY_FLOORS[drive]));
    newWeights[drive] = floored;
    if (floored > raw) floorsApplied.push(drive);
  }

  // 6. Compute convergence delta
  const delta = {};
  let maxAbsDelta = 0;
  let sumAbsDelta = 0;
  for (const drive of DRIVES) {
    const d = r3(newWeights[drive] - (prevWeights[drive] ?? 0));
    delta[drive] = d;
    const abs = Math.abs(d);
    sumAbsDelta += abs;
    if (abs > maxAbsDelta) maxAbsDelta = abs;
  }
  const meanAbsDelta = r3(sumAbsDelta / DRIVES.length);
  const converged    = maxAbsDelta < 0.01;

  const timestamp   = new Date().toISOString();
  const prevVersion = existsSync(CONFIG_PATH)
    ? (JSON.parse(readFileSync(CONFIG_PATH, 'utf8')).syncVersion ?? 0)
    : 0;

  // 7. Write new config
  const config = {
    _description:    'GNW Phase 6 — Claude Drive Weight Sync Config. Source of truth for Claude\'s broadcast weights.',
    _schema_version: '1.0',
    agentId:         AGENT_ID,
    agentName:       AGENT_NAME,
    syncVersion:     prevVersion + 1,
    syncedAt:        timestamp,
    damping:         DAMPING,
    agents_in_cluster: activeAgents.length,
    newWeights,
    prevWeights: Object.fromEntries(DRIVES.map(d => [d, prevWeights[d] ?? null])),
    clusterAvg,
    convergence: {
      delta,
      max_abs_delta:  r3(maxAbsDelta),
      mean_abs_delta: meanAbsDelta,
      converged,
    },
    safety_floors_applied: floorsApplied,
    winner:          cluster.agents[AGENT_ID]?.winner ?? 'safety',
    action:          cluster.agents[AGENT_ID]?.action ?? 'safety_review',
    confidence:      cluster.agents[AGENT_ID]?.confidence ?? 0.8,
    cycleCount:      (cluster.agents[AGENT_ID]?.cycle_count ?? 0) + 1,
    publishInterval: '30min',
  };

  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf8');

  // 8. Console report
  console.log('=== GHO-54 Drive Weight Sync ===');
  console.log(`Timestamp    : ${timestamp}`);
  console.log(`Sync version : ${config.syncVersion}`);
  console.log(`Cluster agents (${activeAgents.length}): ${activeAgents.map(a => a.agentName ?? a.agentId).join(', ')}`);
  console.log('');
  console.log('Cluster avg  :', JSON.stringify(clusterAvg));
  console.log('Prev weights :', JSON.stringify(Object.fromEntries(DRIVES.map(d => [d, prevWeights[d]]))));
  console.log('New weights  :', JSON.stringify(newWeights));
  console.log('');
  console.log('Convergence delta:');
  for (const [d, v] of Object.entries(delta)) {
    const sign = v >= 0 ? '+' : '';
    console.log(`  ${d.padEnd(14)} ${sign}${v}`);
  }
  console.log(`  max_abs    : ${r3(maxAbsDelta)}`);
  console.log(`  mean_abs   : ${meanAbsDelta}`);
  console.log(`  converged  : ${converged}`);
  if (floorsApplied.length > 0) {
    console.log(`Safety floors applied: ${floorsApplied.join(', ')}`);
  }
}

main();
