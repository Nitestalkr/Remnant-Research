#!/usr/bin/env node

/**
 * TPG Proposal Applier — Applies GRAO proposals to TPG nodes
 * 
 * Reads proposals from the proposals directory, applies them to TPG nodes,
 * updates grao-state.json with active proposals, and logs the results.
 * 
 * Usage:
 *   node proposal-applier.js --apply-all (apply all pending proposals)
 *   node proposal-applier.js --apply --id prop_YYYY-MM-DD_NNN (apply specific proposal)
 *   node proposal-applier.js --reject --id prop_YYYY-MM-DD_NNN (reject specific proposal)
 *   node proposal-applier.js --status (show proposal status)
 * 
 * See README.md for details.
 */

const fs = require('fs');
const path = require('path');

const PROPOSALS_DIR = path.join(__dirname, '..', 'proposals');
const GRAO_STATE_PATH = path.join(__dirname, '..', 'grao', 'grao-state.json');
const TPG_DIR = path.join(__dirname, '..', 'tpg');

// ============================================================
// PROPOSAL APPLIER
// ============================================================

function loadGraoState() {
  if (!fs.existsSync(GRAO_STATE_PATH)) {
    return {
      loop_id: 'grao_state',
      last_cycle: new Date().toISOString(),
      cycle_count: 0,
      active_gradients: [],
      research_priorities: [],
      health_metrics: {},
      configuration: {
        gradient_threshold: 0.5,
        proposal_confidence_min: 0.6,
        trace_retention_days: 90,
        gradient_retention_days: 30
      },
      last_trace_collection: new Date().toISOString(),
      last_gradient_computation: new Date().toISOString(),
      saturation: { detected: false, reinforcementRounds: 0, lastRoundSuccessRatio: 1, reason: null },
      gradient_categories: { success: 0 },
      last_proposal_generation: new Date().toISOString(),
      new_proposals: [],
      proposal_types: { reinforcement: 0 },
      active_proposals: [],
      last_proposal_application: new Date().toISOString()
    };
  }
  
  return JSON.parse(fs.readFileSync(GRAO_STATE_PATH, 'utf8'));
}

function saveGraoState(state) {
  fs.writeFileSync(GRAO_STATE_PATH, JSON.stringify(state, null, 2));
  console.log(`[APPLIER] Saved grao-state.json`);
}

function loadProposal(id) {
  const filePath = path.join(PROPOSALS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadAllProposals() {
  const files = fs.readdirSync(PROPOSALS_DIR).filter(f => f.startsWith('prop_') && f.endsWith('.json'));
  const proposals = [];
  
  for (const file of files) {
    try {
      const proposal = JSON.parse(fs.readFileSync(path.join(PROPOSALS_DIR, file), 'utf8'));
      proposals.push(proposal);
    } catch (err) {
      console.log(`[APPLIER] Failed to parse ${file}: ${err.message}`);
    }
  }
  
  return proposals;
}

function applyProposal(proposal) {
  const id = proposal.proposal_id || proposal.id || 'unknown';
  
  // Check confidence threshold
  if (proposal.confidence < 0.6) {
    console.log(`[APPLIER] REJECTED: ${id} (confidence ${proposal.confidence} < 0.6 threshold)`);
    return { status: 'rejected', reason: 'low_confidence' };
  }
  
  // Check staleness (30 days)
  const proposalDate = new Date(proposal.timestamp || proposal.created_at);
  const now = new Date();
  const daysOld = (now - proposalDate) / (1000 * 60 * 60 * 24);
  
  if (daysOld > 30) {
    console.log(`[APPLIER] REJECTED: ${id} (${daysOld.toFixed(1)} days old, > 30 day threshold)`);
    return { status: 'rejected', reason: 'staleness' };
  }
  
  // Apply to TPG node
  const target = proposal.tpg_target || proposal.tpTarget || 'system-health';
  
  // Read TPG node config if exists
  const nodePath = path.join(TPG_DIR, `${target}.json`);
  let nodeConfig = null;
  if (fs.existsSync(nodePath)) {
    nodeConfig = JSON.parse(fs.readFileSync(nodePath, 'utf8'));
  }
  
  // Apply proposal to node
  const applied = {
    proposalId: id,
    status: 'active',
    appliedAt: new Date().toISOString(),
    tpgTarget: target,
    hypothesis: proposal.hypothesis || proposal.impact || 'N/A',
    confidence: proposal.confidence || 0,
    priority: proposal.priority || 'medium',
    expected_improvement: proposal.expected_improvement || 0,
    gradient_direction: proposal.gradient_direction || proposal.direction || 'N/A',
    gradient_magnitude: proposal.gradient_magnitude || proposal.magnitude || 0
  };
  
  // Update TPG node if exists
  if (nodeConfig) {
    if (!nodeConfig.active_proposals) nodeConfig.active_proposals = [];
    nodeConfig.active_proposals.push(applied);
    fs.writeFileSync(nodePath, JSON.stringify(nodeConfig, null, 2));
    console.log(`[APPLIER] Applied ${id} to TPG node ${target}`);
  } else {
    // Create TPG node if doesn't exist
    const newConfig = {
      node: target,
      type: 'tpg_node',
      active_proposals: [applied],
      last_updated: new Date().toISOString()
    };
    fs.writeFileSync(nodePath, JSON.stringify(newConfig, null, 2));
    console.log(`[APPLIER] Created TPG node ${target} with proposal ${id}`);
  }
  
  return { status: 'applied', target };
}

function rejectProposal(id) {
  console.log(`[APPLIER] Rejected ${id}`);
  return { status: 'rejected', reason: 'manual' };
}

function getStatus() {
  const proposals = loadAllProposals();
  const state = loadGraoState();
  
  const pending = proposals.filter(p => !state.active_proposals.find(a => a.proposalId === p.id));
  const active = state.active_proposals;
  
  console.log(`[APPLIER] Proposal Status:`);
  console.log(`  Pending: ${pending.length}`);
  console.log(`  Active: ${active.length}`);
  console.log(`  Total: ${proposals.length}`);
  
  if (pending.length > 0) {
    console.log(`\nPending proposals:`);
    for (const p of pending) {
      const daysOld = (new Date() - new Date(p.timestamp || p.created_at)) / (1000 * 60 * 60 * 24);
      console.log(`  ${p.id} — ${p.hypothesis || p.impact || 'N/A'} (conf: ${p.confidence || 'N/A'}, priority: ${p.priority || 'N/A'}, ${daysOld.toFixed(1)}d old)`);
    }
  }
  
  if (active.length > 0) {
    console.log(`\nActive proposals:`);
    for (const a of active) {
      console.log(`  ${a.proposalId} → ${a.tpgTarget} (applied: ${a.appliedAt})`);
    }
  }
}

function applyAllProposals() {
  console.log('[APPLIER] Applying all pending proposals...');
  
  const state = loadGraoState();
  const proposals = loadAllProposals();
  
  const pending = proposals.filter(p => !state.active_proposals.find(a => a.proposalId === (p.proposal_id || p.id)));
  const results = [];
  
  console.log(`[APPLIER] Found ${pending.length} pending proposals`);
  
  for (const proposal of pending) {
    const result = applyProposal(proposal);
    results.push(result);
  }
  
  // Update grao-state.json
  state.active_proposals = [...state.active_proposals, ...pending.map(p => ({
    proposalId: p.proposal_id || p.id,
    status: 'active',
    appliedAt: new Date().toISOString(),
    tpgTarget: p.tpg_target || p.tpTarget || 'system-health'
  }))];
  state.new_proposals = [];
  state.last_proposal_application = new Date().toISOString();
  state.proposal_types = { reinforcement: pending.filter(p => p.proposal_type === 'reinforcement').length };
  
  saveGraoState(state);
  
  console.log(`\n[APPLIER] Results:`);
  console.log(`  Applied: ${results.filter(r => r.status === 'applied').length}`);
  console.log(`  Rejected: ${results.filter(r => r.status === 'rejected').length}`);
  console.log(`  Total: ${results.length}`);
  
  return results;
}

// ============================================================
// CLI
// ============================================================

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--apply-all')) {
    applyAllProposals();
  } else if (args.includes('--apply') && args.includes('--id')) {
    const idIdx = args.indexOf('--id');
    const id = args[idIdx + 1];
    const proposal = loadProposal(id);
    if (proposal) {
      applyProposal(proposal);
    } else {
      console.log(`[APPLIER] Proposal ${id} not found`);
    }
  } else if (args.includes('--reject') && args.includes('--id')) {
    const idIdx = args.indexOf('--id');
    const id = args[idIdx + 1];
    rejectProposal(id);
  } else if (args.includes('--status')) {
    getStatus();
  } else if (args.includes('--help')) {
    console.log('TPG Proposal Applier');
    console.log('Usage:');
    console.log('  node proposal-applier.js --apply-all (apply all pending proposals)');
    console.log('  node proposal-applier.js --apply --id prop_YYYY-MM-DD_NNN (apply specific proposal)');
    console.log('  node proposal-applier.js --reject --id prop_YYYY-MM-DD_NNN (reject specific proposal)');
    console.log('  node proposal-applier.js --status (show proposal status)');
  } else {
    getStatus();
  }
}

main();
