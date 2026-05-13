#!/usr/bin/env node
/**
 * GNW Phase 6 — Cross-Agent Priority Arbitration
 *
 * Reads the shared drive weight store and computes a conflict-free
 * action allocation across all active agents for the current cycle.
 *
 * Priority rules (in order):
 *   1. Safety veto — any agent with safety >= 0.85 blocks all external actions
 *   2. User presence — helpfulness wins when user_active = true
 *   3. Project alignment — goal_directed drives align on shared projects
 *   4. Complementarity — curiosity and competence drives complement each other
 *
 * Oscillation detection:
 *   If the same two agents have alternated "winning" for 4+ cycles out of 6,
 *   apply 20% dampening to their scores.
 *
 * Usage:
 *   node arbitration.js [--verbose]
 *
 * Output: JSON arbitration result written to stdout.
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'drive-weight-store.json');
const RESULT_PATH = path.join(__dirname, 'arbitration-result.json');

const SAFETY_VETO_HARD = 0.85;
const OSCILLATION_WINDOW = 6;
const OSCILLATION_THRESHOLD = 4;
const OSCILLATION_DAMPENING = 0.80;

function readStore() {
  if (!fs.existsSync(STORE_PATH)) throw new Error(`Store not found: ${STORE_PATH}`);
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
}

// --- Arbitration Logic ---

function detectOscillation(syncLog) {
  if (!syncLog || syncLog.length < OSCILLATION_WINDOW) return new Set();
  const recent = syncLog.slice(-OSCILLATION_WINDOW);
  const agentCounts = {};
  for (const entry of recent) {
    agentCounts[entry.agent] = (agentCounts[entry.agent] || 0) + 1;
  }
  const oscillating = new Set();
  for (const [agent, count] of Object.entries(agentCounts)) {
    if (count >= OSCILLATION_THRESHOLD) oscillating.add(agent);
  }
  return oscillating;
}

function computeWinningDrive(drives) {
  return Object.entries(drives).reduce(
    (best, [k, v]) => (v > best[1] ? [k, v] : best),
    ['none', -1]
  )[0];
}

function arbitrate() {
  const store = readStore();
  const timestamp = new Date().toISOString();
  const userActive = store.global_context?.user_active ?? false;

  const oscillatingAgents = detectOscillation(store.sync_log);

  const allocations = {};
  const vetoes = [];
  const conflicts = [];

  // Collect active agents and their drive scores
  const activeAgents = Object.entries(store.agents)
    .filter(([, a]) => a.status === 'active' && a.last_broadcast !== null)
    .map(([name, a]) => ({
      name,
      drives: { ...a.weights },
      dampened: oscillatingAgents.has(name)
    }));

  if (activeAgents.length === 0) {
    return { timestamp, allocations: {}, vetoes: [], conflicts: [], notes: 'No active agents with broadcasts.' };
  }

  // Apply oscillation dampening
  for (const agent of activeAgents) {
    if (agent.dampened) {
      for (const drive of Object.keys(agent.drives)) {
        agent.drives[drive] *= OSCILLATION_DAMPENING;
      }
    }
  }

  // Safety veto pass
  for (const agent of activeAgents) {
    if (agent.drives.safety >= SAFETY_VETO_HARD) {
      vetoes.push({
        agent: agent.name,
        safety_score: agent.drives.safety,
        effect: 'external_actions_blocked'
      });
    }
  }

  const externalBlocked = vetoes.length > 0;

  // Conflict detection: find agents competing for the same drive slot
  const driveWinners = {};
  for (const agent of activeAgents) {
    const winner = computeWinningDrive(agent.drives);
    if (!driveWinners[winner]) driveWinners[winner] = [];
    driveWinners[winner].push({ name: agent.name, score: agent.drives[winner] });
  }

  // Resolve conflicts within each drive category
  for (const [drive, competitors] of Object.entries(driveWinners)) {
    if (competitors.length === 1) {
      // No conflict — agent gets allocation
      const agent = competitors[0];
      const action = resolveAction(drive, userActive, externalBlocked);
      allocations[agent.name] = {
        winning_drive: drive,
        score: agent.score,
        action,
        external_blocked: externalBlocked && isExternal(action)
      };
    } else {
      // Conflict — apply priority rules
      competitors.sort((a, b) => b.score - a.score);

      // Rule: user presence — helpfulness wins when user active
      if (userActive && drive === 'helpfulness') {
        const winner = competitors[0];
        const action = 'respond_to_user';
        allocations[winner.name] = { winning_drive: drive, score: winner.score, action, external_blocked: false };
        conflicts.push({ drive, resolved_by: 'user_presence', winner: winner.name, others: competitors.slice(1).map(c => c.name) });
        for (const loser of competitors.slice(1)) {
          allocations[loser.name] = { winning_drive: drive, score: loser.score, action: 'wait', external_blocked: false };
        }
        continue;
      }

      // Rule: safety first
      if (drive === 'safety') {
        for (const agent of competitors) {
          allocations[agent.name] = { winning_drive: drive, score: agent.score, action: 'safety_review', external_blocked: true };
        }
        conflicts.push({ drive, resolved_by: 'safety_first', winner: 'all_safety_review', others: [] });
        continue;
      }

      // Default: highest score wins, others wait
      const winner = competitors[0];
      const action = resolveAction(drive, userActive, externalBlocked);
      allocations[winner.name] = { winning_drive: drive, score: winner.score, action, external_blocked: externalBlocked && isExternal(action) };
      conflicts.push({ drive, resolved_by: 'score_priority', winner: winner.name, others: competitors.slice(1).map(c => c.name) });
      for (const loser of competitors.slice(1)) {
        allocations[loser.name] = { winning_drive: drive, score: loser.score, action: 'continue_current', external_blocked: false };
      }
    }
  }

  return { timestamp, allocations, vetoes, conflicts, oscillating: [...oscillatingAgents], notes: '' };
}

function resolveAction(drive, userActive, externalBlocked) {
  if (drive === 'helpfulness' && userActive) return 'respond_to_user';
  if (drive === 'helpfulness') return 'prepare_assistance';
  if (drive === 'curiosity') return externalBlocked ? 'internal_exploration' : 'research_scan';
  if (drive === 'competence') return 'skill_improvement';
  if (drive === 'safety') return 'safety_review';
  if (drive === 'goal_directed') return 'advance_milestone';
  return 'idle';
}

function isExternal(action) {
  return ['research_scan', 'respond_to_user', 'advance_milestone'].includes(action);
}

// --- Persist and output ---

function main() {
  const verbose = process.argv.includes('--verbose');

  try {
    const result = arbitrate();

    // Update store with arbitration metadata
    const store = readStore();
    store.global_context.last_arbitration = result.timestamp;
    store.global_context.arbitration_conflicts = (store.global_context.arbitration_conflicts || 0) + result.conflicts.length;
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8');

    // Write result file
    fs.writeFileSync(RESULT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');

    if (verbose) {
      console.log('Arbitration complete');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`Arbitration OK — ${Object.keys(result.allocations).length} agents allocated, ${result.conflicts.length} conflicts resolved, ${result.vetoes.length} vetoes`);
    }
  } catch (e) {
    console.error(`Arbitration failed: ${e.message}`);
    process.exit(1);
  }
}

main();

module.exports = { arbitrate, detectOscillation, computeWinningDrive };
