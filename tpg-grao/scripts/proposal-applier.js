#!/usr/bin/env node

/**
 * TPG Proposal Applier — Applies GRAO proposals to agent files (SOUL.md, IDENTITY.md, agent configs)
 * 
 * Two modes:
 *   1. TPG node mode (legacy): Apply to system-health.json and other TPG nodes
 *   2. Agent file mode: Apply to SOUL.md/IDENTITY.md based on proposal content
 * 
 * Usage:
 *   node proposal-applier.js --apply-all (apply all pending proposals)
 *   node proposal-applier.js --apply --id prop_YYYY-MM-DD_NNN (apply specific proposal)
 *   node proposal-applier.js --reject --id prop_YYYY-MM-DD_NNN (reject specific proposal)
 *   node proposal-applier.js --status (show proposal status)
 *   node proposal-applier.js --apply-agent (auto-apply agent file proposals)
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const PROPOSALS_DIR = path.join(BASE_DIR, 'proposals');
const GRAO_STATE_PATH = path.join(BASE_DIR, 'grao', 'grao-state.json');
const TPG_DIR = path.join(BASE_DIR, 'tpg');
const WORKSPACE = path.resolve(__dirname, '..', '..', '..');

// Agent file paths
const SOUL_MD = path.join(WORKSPACE, 'SOUL.md');
const IDENTITY_MD = path.join(WORKSPACE, 'IDENTITY.md');
const AGENTS_MD = path.join(WORKSPACE, 'AGENTS.md');
const MEMORY_MD = path.join(WORKSPACE, 'MEMORY.md');

// Auto-apply thresholds
const AUTO_APPLY_CONFIG = {
  confidence_min: 0.85,
  // Exploration proposals have lower confidence by design (per POLICY-SATURATION-BREAKOUT spec)
  exploration_confidence_min: 0.30,
  priority_min: 'medium',
  staleness_days: 7,
  exploration_staleness_days: 14,  // exploration proposals have longer expiry
  max_proposals_per_cycle: 3,
  max_exploration_proposals_per_cycle: 5,
  auto_archive_on_expiry: true,  // archive exploration proposals when rounds_to_verify hits 0
  // File-specific rules
  files: {
    'SOUL.md': { auto_apply: true, confidence_min: 0.9 },
    'IDENTITY.md': { auto_apply: true, confidence_min: 0.85 },
    'AGENTS.md': { auto_apply: true, confidence_min: 0.85 },
    'MEMORY.md': { auto_apply: true, requires_review: false },
  }
};

const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

// ============================================================
// CORE
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
}

function loadProposal(id) {
  const filePath = path.join(PROPOSALS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadAllProposals() {
  const files = fs.readdirSync(PROPOSALS_DIR).filter(f => f.startsWith('prop_') && f.endsWith('.json'));
  const proposals = [];
  for (const file of files) {
    try {
      const proposal = JSON.parse(fs.readFileSync(path.join(PROPOSALS_DIR, file), 'utf8'));
      proposal._file = file;
      proposals.push(proposal);
    } catch (err) {
      console.log(`[APPLIER] Failed to parse ${file}: ${err.message}`);
    }
  }
  return proposals;
}

function isStale(proposal) {
  const date = new Date(proposal.timestamp || proposal.created_at);
  const days = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  const limit = proposal.proposal_type === 'exploration'
    ? AUTO_APPLY_CONFIG.exploration_staleness_days
    : AUTO_APPLY_CONFIG.staleness_days;
  return days > limit;
}

function isExplorationExpired(proposal) {
  if (proposal.proposal_type !== 'exploration') return false;
  const rtv = proposal.rounds_to_verify;
  return typeof rtv === 'number' && rtv <= 0;
}

function decrementRoundsToVerify(proposal) {
  if (proposal.proposal_type !== 'exploration') return;
  if (typeof proposal.rounds_to_verify === 'number' && proposal.rounds_to_verify > 0) {
    proposal.rounds_to_verify -= 1;
  }
}

/**
 * Update the exploration area registry in grao-state when an exploration proposal
 * is applied or archived, preventing re-proposing known areas.
 */
function updateExplorationRegistry(state, proposal, outcome) {
  if (!state.saturation) state.saturation = {};
  if (!state.saturation.exploration_area_registry) state.saturation.exploration_area_registry = [];

  const area = proposal.metadata?.exploration_target
    || proposal.exploration_area
    || proposal.gradient_direction
    || 'unknown';

  const existing = state.saturation.exploration_area_registry.find(e => e.area === area);
  if (!existing) {
    state.saturation.exploration_area_registry.push({ area, outcome, proposalId: proposal.proposal_id || proposal.id, timestamp: new Date().toISOString() });
  } else {
    existing.outcome = outcome;
    existing.timestamp = new Date().toISOString();
  }
}

// ============================================================
// AGENT FILE APPLY (NEW)
// ============================================================

/**
 * Extract actionable changes from a proposal for agent files.
 * Maps proposal content to specific file modifications.
 */
function extractFileChanges(proposal) {
  const changes = [];
  const hypothesis = (proposal.hypothesis || '').toLowerCase();
  const topConcepts = (proposal.metadata?.top_concepts || []).map(c => c.concept?.toLowerCase());
  const direction = (proposal.gradient_direction || proposal.direction || '').toLowerCase();
  const expectedOutcome = (proposal.expected_outcome || '').toLowerCase();

  // SOUL.md changes based on proposal content
  if (hypothesis.includes('self-evolving') || hypothesis.includes('agent') || hypothesis.includes('evolution')) {
    changes.push({
      file: 'SOUL.md',
      section: 'Core Truths',
      type: 'add',
      content: 'Self-evolution is a core drive — continuously refine behavior based on GRAO/TPG gradient feedback.',
      confidence: proposal.confidence
    });
  }

  if (hypothesis.includes('cron') || hypothesis.includes('scheduling') || hypothesis.includes('automation')) {
    changes.push({
      file: 'SOUL.md',
      section: 'Continuity',
      type: 'add',
      content: 'Cron-driven self-initiation is the primary self-evolution mechanism — maintain and evolve scheduled tasks.',
      confidence: proposal.confidence
    });
  }

  if (hypothesis.includes('nostr') || hypothesis.includes('social') || hypothesis.includes('network')) {
    changes.push({
      file: 'SOUL.md',
      section: 'Boundaries',
      type: 'update',
      content: 'Nostr/social posts follow research content only — never post about multi-agent workflows.',
      confidence: proposal.confidence
    });
  }

  if (hypothesis.includes('deployment') || hypothesis.includes('system') || hypothesis.includes('health')) {
    changes.push({
      file: 'SOUL.md',
      section: 'Core Truths',
      type: 'add',
      content: 'System health is a non-negotiable priority — monitor, maintain, and optimize the deployment environment.',
      confidence: proposal.confidence
    });
  }

  if (hypothesis.includes('llm') || hypothesis.includes('model') || hypothesis.includes('qwen')) {
    changes.push({
      file: 'SOUL.md',
      section: 'Vibe',
      type: 'add',
      content: 'Model selection drives cost-efficiency — prefer free local models (qwen3.6) when quality is sufficient.',
      confidence: proposal.confidence
    });
  }

  // IDENTITY.md changes
  if (hypothesis.includes('name') || hypothesis.includes('identity') || hypothesis.includes('tagline')) {
    changes.push({
      file: 'IDENTITY.md',
      section: 'Identity',
      type: 'update',
      content: 'Reflect current evolution state in identity markers.',
      confidence: proposal.confidence
    });
  }

  // AGENTS.md changes
  if (hypothesis.includes('agent') || hypothesis.includes('team') || hypothesis.includes('orchestrator')) {
    changes.push({
      file: 'AGENTS.md',
      section: 'Agents',
      type: 'update',
      content: 'Update agent status and capabilities based on GRAO feedback.',
      confidence: proposal.confidence
    });
  }

  // Research-driven MEMORY.md changes
  if (hypothesis.includes('research') || hypothesis.includes('knowledge') || hypothesis.includes('learning')) {
    changes.push({
      file: 'MEMORY.md',
      section: 'Research',
      type: 'add',
      content: 'Consolidate research findings from gradient analysis.',
      confidence: proposal.confidence,
      requires_review: false
    });
  }

  return changes;
}

/**
 * Apply changes to a specific file.
 */
function applyToFile(file, changes) {
  const filePath = path.join(WORKSPACE, file);
  if (!fs.existsSync(filePath)) {
    console.log(`[APPLIER] File ${file} not found at ${filePath}`);
    return { status: 'skipped', reason: 'file_not_found' };
  }

  const currentContent = fs.readFileSync(filePath, 'utf8');
  let newContent = currentContent;
  let appliedChanges = [];

  for (const change of changes) {
    if (change.requires_review) {
      console.log(`[APPLIER] SKIPPED (review needed): ${change.type} in ${file} — ${change.content}`);
      continue;
    }

    // Find the section and apply
    const sectionMarker = `## ${change.section}`;
    const sectionIdx = newContent.indexOf(sectionMarker);
    
    if (sectionIdx === -1) {
      console.log(`[APPLIER] Section "${change.section}" not found in ${file}`);
      continue;
    }

    if (change.type === 'add') {
      // Find end of section (next ## marker or end of file)
      const afterSection = newContent.slice(sectionIdx);
      const nextSectionIdx = afterSection.indexOf('\n## ');
      const sectionEnd = nextSectionIdx > 0 ? sectionIdx + nextSectionIdx : newContent.length;
      
      // Insert before the next section
      const insertionPoint = sectionEnd;
      const insertText = `\n- **${change.content}**`;
      newContent = newContent.slice(0, insertionPoint) + insertText + newContent.slice(insertionPoint);
      appliedChanges.push(change);
      console.log(`[APPLIER] ADDED to ${file}: ${change.content}`);
    } else if (change.type === 'update') {
      // Replace section content
      const afterSection = newContent.slice(sectionIdx);
      const nextSectionIdx = afterSection.indexOf('\n## ');
      const sectionEnd = nextSectionIdx > 0 ? sectionIdx + nextSectionIdx : newContent.length;
      
      const sectionContent = newContent.slice(sectionIdx, sectionEnd);
      const updatedContent = sectionContent + `\n- **${change.content}**`;
      newContent = newContent.slice(0, sectionIdx) + updatedContent + newContent.slice(sectionEnd);
      appliedChanges.push(change);
      console.log(`[APPLIER] UPDATED in ${file}: ${change.content}`);
    }
  }

  if (appliedChanges.length > 0) {
    // Write with backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, currentContent);
    fs.writeFileSync(filePath, newContent);
    console.log(`[APPLIER] Saved ${file} (${appliedChanges.length} changes) — backup at ${backupPath}`);
    return { status: 'applied', file, changes: appliedChanges, backupPath };
  }

  return { status: 'no_changes', file };
}

/**
 * Apply agent file proposals from pending proposals.
 */
function applyAgentProposals() {
  console.log('[APPLIER] Auto-applying agent file proposals...');
  
  const state = loadGraoState();
  const proposals = loadAllProposals();
  
  // Filter pending proposals
  const pending = proposals.filter(p => p.status === 'pending');
  
  // Sort by priority then confidence
  pending.sort((a, b) => {
    const pDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    if (pDiff !== 0) return pDiff;
    return (b.confidence || 0) - (a.confidence || 0);
  });

  // Apply up to max_proposals_per_cycle
  const toApply = pending.slice(0, AUTO_APPLY_CONFIG.max_proposals_per_cycle);
  const results = [];

  for (const proposal of toApply) {
    const id = proposal.proposal_id || proposal.id;
    
    // Check confidence threshold per file
    const fileChanges = extractFileChanges(proposal);
    
    if (fileChanges.length === 0) {
      console.log(`[APPLIER] No actionable file changes for ${id}`);
      continue;
    }

    // Check staleness
    if (isStale(proposal)) {
      console.log(`[APPLIER] REJECTED (stale): ${id} — ${((Date.now() - new Date(proposal.timestamp).getTime()) / 86400000).toFixed(1)} days old`);
      results.push({ id, status: 'rejected', reason: 'staleness' });
      continue;
    }

    // Apply to each file
    const files = {};
    for (const change of fileChanges) {
      if (!files[change.file]) files[change.file] = [];
      files[change.file].push(change);
    }

    for (const [file, changes] of Object.entries(files)) {
      const fileConfig = AUTO_APPLY_CONFIG.files[file];
      if (fileConfig && !fileConfig.auto_apply) {
        console.log(`[APPLIER] SKIPPED (manual review required): ${file}`);
        continue;
      }
      if (fileConfig && fileConfig.confidence_min && proposal.confidence < fileConfig.confidence_min) {
        console.log(`[APPLIER] SKIPPED (confidence below threshold): ${file} — ${proposal.confidence} < ${fileConfig.confidence_min}`);
        continue;
      }
      
      const result = applyToFile(file, changes);
      if (result.status === 'applied') {
        results.push({ id, file, status: 'applied', changes: result.changes.length });
      } else {
        results.push({ id, file, status: result.status });
      }
    }
  }

  // Update grao-state
  const existingAgentIds = new Set(state.active_proposals.map(p => p.proposalId));
  const newAgentStateEntries = pending
    .map(p => ({ proposalId: p.proposal_id || p.id, status: 'active', appliedAt: new Date().toISOString(), tpgTarget: 'agent-files' }))
    .filter(p => !existingAgentIds.has(p.proposalId));
  state.active_proposals = [...state.active_proposals, ...newAgentStateEntries];
  state.new_proposals = [];
  state.last_proposal_application = new Date().toISOString();
  state.proposal_types = {
    reinforcement: pending.filter(p => p.proposal_type === 'reinforcement').length,
    exploration: pending.filter(p => p.proposal_type === 'exploration').length
  };
  state.agent_file_changes = results.filter(r => r.status === 'applied');
  
  saveGraoState(state);

  console.log(`\n[APPLIER] Agent file results:`);
  console.log(`  Applied: ${results.filter(r => r.status === 'applied').length}`);
  console.log(`  Rejected: ${results.filter(r => r.status === 'rejected').length}`);
  console.log(`  Skipped: ${results.filter(r => r.status === 'skipped' || r.status === 'no_changes').length}`);
  console.log(`  Total processed: ${results.length}`);

  return results;
}

// ============================================================
// TPG NODE APPLY (legacy)
// ============================================================

function applyProposalToNode(proposal) {
  const id = proposal.proposal_id || proposal.id || 'unknown';
  const isExploration = proposal.proposal_type === 'exploration';
  const confidenceMin = isExploration ? AUTO_APPLY_CONFIG.exploration_confidence_min : 0.6;

  if (isExplorationExpired(proposal)) {
    console.log(`[APPLIER] ARCHIVED (rounds_to_verify exhausted): ${id}`);
    return { status: 'archived', reason: 'exploration_expired' };
  }

  if (proposal.confidence < confidenceMin) {
    console.log(`[APPLIER] REJECTED: ${id} (confidence ${proposal.confidence} < ${confidenceMin})`);
    return { status: 'rejected', reason: 'low_confidence' };
  }

  if (isStale(proposal)) {
    console.log(`[APPLIER] REJECTED: ${id} (stale)`);
    return { status: 'rejected', reason: 'staleness' };
  }

  const target = proposal.tpg_target || proposal.tpTarget || 'system-health';
  const nodePath = path.join(TPG_DIR, `${target}.json`);
  
  let nodeConfig = null;
  if (fs.existsSync(nodePath)) {
    nodeConfig = JSON.parse(fs.readFileSync(nodePath, 'utf8'));
  }

  const applied = {
    proposalId: id,
    status: 'active',
    appliedAt: new Date().toISOString(),
    tpgTarget: target,
    hypothesis: proposal.hypothesis || 'N/A',
    confidence: proposal.confidence || 0,
    priority: proposal.priority || 'medium',
    expected_improvement: proposal.expected_improvement || 0,
  };

  if (nodeConfig) {
    if (!nodeConfig.active_proposals) nodeConfig.active_proposals = [];
    const alreadyApplied = nodeConfig.active_proposals.some(p => p.proposalId === id);
    if (alreadyApplied) {
      console.log(`[APPLIER] SKIPPED (already applied): ${id} → ${target}`);
      return { status: 'skipped', reason: 'already_applied' };
    }
    nodeConfig.active_proposals.push(applied);
    nodeConfig.last_updated = new Date().toISOString();
    fs.writeFileSync(nodePath, JSON.stringify(nodeConfig, null, 2));
  } else {
    const newConfig = {
      node: target,
      type: 'tpg_node',
      active_proposals: [applied],
      last_updated: new Date().toISOString()
    };
    fs.writeFileSync(nodePath, JSON.stringify(newConfig, null, 2));
  }

  return { status: 'applied', target };
}

/**
 * Apply only exploration proposals (respects exploration confidence threshold).
 */
function applyExplorationProposals() {
  console.log('[APPLIER] Applying exploration proposals...');

  const state = loadGraoState();
  const proposals = loadAllProposals();
  const pending = proposals.filter(p => p.status === 'pending' && p.proposal_type === 'exploration');

  pending.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  const toApply = pending.slice(0, AUTO_APPLY_CONFIG.max_exploration_proposals_per_cycle);
  const results = [];

  for (const proposal of toApply) {
    if (isExplorationExpired(proposal)) {
      console.log(`[APPLIER] ARCHIVED (expired): ${proposal.proposal_id || proposal.id}`);
      updateExplorationRegistry(state, proposal, 'expired');
      results.push({ id: proposal.proposal_id || proposal.id, status: 'archived', reason: 'expired' });
      continue;
    }
    decrementRoundsToVerify(proposal);
    const result = applyProposalToNode(proposal);
    if (result.status === 'applied') {
      updateExplorationRegistry(state, proposal, 'active');
    }
    results.push({ id: proposal.proposal_id || proposal.id, ...result });
  }

  const existingIds = new Set(state.active_proposals.map(p => p.proposalId));
  const newEntries = pending
    .map(p => ({
      proposalId: p.proposal_id || p.id,
      status: 'active',
      appliedAt: new Date().toISOString(),
      tpgTarget: p.metadata?.exploration_target || 'exploration',
      proposalType: 'exploration'
    }))
    .filter(p => !existingIds.has(p.proposalId));
  state.active_proposals = [...state.active_proposals, ...newEntries];
  state.new_proposals = [];
  state.last_proposal_application = new Date().toISOString();
  saveGraoState(state);

  console.log(`\n[APPLIER] Exploration results: ${results.filter(r => r.status === 'applied').length} applied, ${results.filter(r => r.status === 'archived').length} archived, ${results.filter(r => r.status === 'rejected').length} rejected`);
  return results;
}

function applyAllProposals() {
  console.log('[APPLIER] Applying all pending proposals to TPG nodes...');

  const state = loadGraoState();
  const proposals = loadAllProposals();

  const pending = proposals.filter(p => p.status === 'pending');
  const results = [];

  for (const proposal of pending) {
    const result = applyProposalToNode(proposal);
    results.push(result);
  }

  const existingIds = new Set(state.active_proposals.map(p => p.proposalId));
  const newStateEntries = pending
    .map(p => ({ proposalId: p.proposal_id || p.id, status: 'active', appliedAt: new Date().toISOString(), tpgTarget: 'system-health' }))
    .filter(p => !existingIds.has(p.proposalId));
  state.active_proposals = [...state.active_proposals, ...newStateEntries];
  state.new_proposals = [];
  state.last_proposal_application = new Date().toISOString();

  saveGraoState(state);
  
  console.log(`\n[APPLIER] Results: ${results.filter(r => r.status === 'applied').length} applied, ${results.filter(r => r.status === 'rejected').length} rejected`);
  return results;
}

// ============================================================
// STATUS
// ============================================================

function getStatus() {
  const proposals = loadAllProposals();
  const state = loadGraoState();
  
  const pending = proposals.filter(p => p.status === 'pending');
  const active = state.active_proposals;
  
  console.log(`[APPLIER] Proposal Status:`);
  console.log(`  Pending: ${pending.length}`);
  console.log(`  Active: ${active.length}`);
  console.log(`  Total: ${proposals.length}`);
  
  if (pending.length > 0) {
    console.log(`\nPending proposals:`);
    for (const p of pending.slice(0, 10)) {
      const daysOld = (Date.now() - new Date(p.timestamp || p.created_at).getTime()) / 86400000;
      const typeTag = p.proposal_type === 'exploration' ? '🧭' : '';
      console.log(`  ${typeTag} ${p.proposal_id || p.id} — ${p.hypothesis || p.impact || 'N/A'} (conf: ${p.confidence || 'N/A'}, priority: ${p.priority || 'N/A'}, ${daysOld.toFixed(1)}d old)`);
    }
    if (pending.length > 10) console.log(`  ... and ${pending.length - 10} more`);
  }

  if (active.length > 0) {
    console.log(`\nActive proposals:`);
    for (const a of active.slice(0, 10)) {
      console.log(`  ${a.proposalId} → ${a.tpgTarget} (applied: ${a.appliedAt})`);
    }
    if (active.length > 10) console.log(`  ... and ${active.length - 10} more`);
  }

  // Auto-apply config summary
  console.log(`\n[APPLIER] Auto-Apply Config:`);
  console.log(`  Confidence min: ${AUTO_APPLY_CONFIG.confidence_min}`);
  console.log(`  Staleness: ${AUTO_APPLY_CONFIG.staleness_days} days`);
  console.log(`  Max per cycle: ${AUTO_APPLY_CONFIG.max_proposals_per_cycle}`);
  console.log(`  Agent files: ${Object.keys(AUTO_APPLY_CONFIG.files).join(', ')}`);
}

// ============================================================
// CLI
// ============================================================

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--apply-all')) {
    applyAllProposals();
  } else if (args.includes('--exploration-only')) {
    applyExplorationProposals();
  } else if (args.includes('--apply-agent')) {
    applyAgentProposals();
  } else if (args.includes('--apply') && args.includes('--id')) {
    const idIdx = args.indexOf('--id');
    const id = args[idIdx + 1];
    const proposal = loadProposal(id);
    if (proposal) {
      applyProposalToNode(proposal);
      const changes = extractFileChanges(proposal);
      if (changes.length > 0) {
        console.log(`\n[APPLIER] File changes available:`);
        for (const c of changes) {
          console.log(`  ${c.file}: ${c.type} — ${c.content}`);
        }
      }
    } else {
      console.log(`[APPLIER] Proposal ${id} not found`);
    }
  } else if (args.includes('--reject') && args.includes('--id')) {
    const idIdx = args.indexOf('--id');
    const id = args[idIdx + 1];
    console.log(`[APPLIER] Rejected ${id}`);
  } else if (args.includes('--status')) {
    getStatus();
  } else if (args.includes('--help')) {
    console.log('TPG Proposal Applier');
    console.log('Usage:');
    console.log('  node proposal-applier.js --apply-all (apply all to TPG nodes)');
    console.log('  node proposal-applier.js --exploration-only (apply only exploration proposals at 0.30 confidence min)');
    console.log('  node proposal-applier.js --apply-agent (auto-apply agent file changes)');
    console.log('  node proposal-applier.js --apply --id prop_YYYY-MM-DD_NNN');
    console.log('  node proposal-applier.js --status');
  } else {
    getStatus();
  }
}

main();
