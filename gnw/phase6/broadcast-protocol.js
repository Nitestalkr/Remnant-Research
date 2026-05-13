#!/usr/bin/env node
/**
 * GNW Phase 6 — Drive Score Broadcast Protocol
 *
 * Each agent calls this at the end of its cognitive cycle to:
 * 1. Validate its drive scores (bounds check)
 * 2. Write them to the shared drive weight store
 * 3. Append an entry to the sync log
 *
 * Usage:
 *   node broadcast-protocol.js --agent <name> --scores <json>
 *   node broadcast-protocol.js --agent andi --scores '{"curiosity":0.72,"helpfulness":0.65,"competence":0.58,"safety":0.45,"goal_directed":0.60}'
 *
 * The shared store lives at: gnw/phase6/drive-weight-store.json
 * This script is agent-agnostic; each agent passes its own identity.
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'drive-weight-store.json');
const VALID_AGENTS = ['andi', 'randi2', 'cb', 'claude', 'zero'];
const VALID_DRIVES = ['curiosity', 'helpfulness', 'competence', 'safety', 'goal_directed'];
const MAX_SYNC_LOG = 200;

// --- Validation ---

function validateScores(scores) {
  for (const drive of VALID_DRIVES) {
    if (!(drive in scores)) {
      throw new Error(`Missing drive score: ${drive}`);
    }
    const v = scores[drive];
    if (typeof v !== 'number' || v < 0.0 || v > 1.0) {
      throw new Error(`Drive score out of bounds [0,1]: ${drive} = ${v}`);
    }
  }
  const extra = Object.keys(scores).filter(k => !VALID_DRIVES.includes(k));
  if (extra.length > 0) {
    throw new Error(`Unknown drive keys: ${extra.join(', ')}`);
  }
}

// --- Store read / write ---

function readStore() {
  if (!fs.existsSync(STORE_PATH)) {
    throw new Error(`Shared store not found: ${STORE_PATH}`);
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
}

function writeStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8');
}

// --- Broadcast ---

function broadcast(agentName, scores, winner, action, confidence, cycleNumber) {
  if (!VALID_AGENTS.includes(agentName)) {
    throw new Error(`Unknown agent: ${agentName}. Valid agents: ${VALID_AGENTS.join(', ')}`);
  }
  validateScores(scores);

  const timestamp = new Date().toISOString();

  const payload = {
    agent_id: agentName,
    timestamp,
    drives: scores,
    winner: winner || null,
    action: action || null,
    confidence: confidence !== undefined ? confidence : null,
    version: '1.0'
  };

  const store = readStore();

  // Update agent entry
  store.agents[agentName] = {
    weights: { ...scores },
    last_broadcast: timestamp,
    cycle_count: cycleNumber !== undefined ? cycleNumber : (store.agents[agentName]?.cycle_count ?? 0),
    status: 'active'
  };

  // Update global sync metadata
  store._last_sync = timestamp;
  store._sync_agent = agentName;

  // Append sync log entry (cap at MAX_SYNC_LOG)
  if (!Array.isArray(store.sync_log)) store.sync_log = [];
  store.sync_log.push({ timestamp, agent: agentName, winner, action });
  if (store.sync_log.length > MAX_SYNC_LOG) {
    store.sync_log = store.sync_log.slice(-MAX_SYNC_LOG);
  }

  writeStore(store);

  return payload;
}

// --- CLI ---

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--agent') parsed.agent = args[++i];
    else if (args[i] === '--scores') parsed.scores = args[++i];
    else if (args[i] === '--winner') parsed.winner = args[++i];
    else if (args[i] === '--action') parsed.action = args[++i];
    else if (args[i] === '--confidence') parsed.confidence = parseFloat(args[++i]);
    else if (args[i] === '--cycle') parsed.cycle = parseInt(args[++i], 10);
    else if (args[i] === '--dry-run') parsed.dryRun = true;
  }
  return parsed;
}

function main() {
  const args = parseArgs();

  if (!args.agent) {
    console.error('Error: --agent is required');
    process.exit(1);
  }
  if (!args.scores) {
    console.error('Error: --scores is required (JSON string)');
    process.exit(1);
  }

  let scores;
  try {
    scores = JSON.parse(args.scores);
  } catch (e) {
    console.error(`Error: --scores must be valid JSON: ${e.message}`);
    process.exit(1);
  }

  try {
    if (args.dryRun) {
      validateScores(scores);
      console.log('Dry run OK — scores valid');
      console.log(JSON.stringify({ agent: args.agent, scores }, null, 2));
      return;
    }

    const payload = broadcast(
      args.agent,
      scores,
      args.winner,
      args.action,
      args.confidence,
      args.cycle
    );

    console.log('Broadcast OK');
    console.log(JSON.stringify(payload, null, 2));
  } catch (e) {
    console.error(`Broadcast failed: ${e.message}`);
    process.exit(1);
  }
}

main();

module.exports = { broadcast, validateScores, readStore };
