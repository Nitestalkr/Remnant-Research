#!/usr/bin/env node
/**
 * proposal-generator.js — Generates research proposals from gradient analysis.
 *
 * Usage:
 *   node proposal-generator.js [--gradients gradients/]
 *                              [--threshold 0.50]
 *                              [--output proposals/]
 *
 * Output: JSON proposal files in proposals/ directory
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Configuration ──────────────────────────────────────────────────────────

const BASE_DIR = path.resolve(__dirname, '..');
const GRADIENTS_DIR = path.join(BASE_DIR, 'gradients');
const PROPOSALS_DIR = path.join(BASE_DIR, 'proposals');
const GRAO_STATE = path.join(BASE_DIR, 'grao', 'grao-state.json');

const CONFIG = {
  gradientsDir: GRADIENTS_DIR,
  outputDir: PROPOSALS_DIR,
  threshold: 0.50,
  noveltyWindowDays: 30,
};

// Proposal templates by gradient type
const PROPOSAL_TEMPLATES = {
  directional: {
    hypothesis_prefix: 'Exploring whether',
    research_question_prefix: 'How does',
    methodology: ['literature-review', 'experiment', 'analysis'],
    expected_outcome: 'Identify actionable insight for research direction',
  },
  magnitude: {
    hypothesis_prefix: 'Determining the strength of',
    research_question_prefix: 'What is the magnitude of',
    methodology: ['measurement', 'comparison', 'benchmark'],
    expected_outcome: 'Quantify impact for resource allocation',
  },
  temporal: {
    hypothesis_prefix: 'Tracking the evolution of',
    research_question_prefix: 'How has',
    methodology: ['longitudinal-analysis', 'trend-extraction', 'forecasting'],
    expected_outcome: 'Identify trajectory for proactive adjustment',
  },
};

// ── CLI Parsing ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { ...CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--gradients':
        i++;
        if (i < args.length) parsed.gradientsDir = path.resolve(args[i]);
        break;
      case '--threshold':
        i++;
        if (i < args.length) parsed.threshold = parseFloat(args[i]);
        break;
      case '--output':
        i++;
        if (i < args.length) parsed.outputDir = path.resolve(args[i]);
        break;
      case '--novelty':
        i++;
        if (i < args.length) parsed.noveltyWindowDays = parseInt(args[i]);
        break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`
proposal-generator.js — Generate research proposals from gradients

Usage: node proposal-generator.js [options]

Options:
  --gradients <path>    Gradients directory (default: gradients/)
  --threshold <N>       Minimum gradient magnitude for proposal (default: 0.50)
  --output <path>       Output directory (default: proposals/)
  --novelty <N>         Days to check for novelty (default: 30)
  --help                Show this help

Examples:
  node proposal-generator.js                          # generate from all strong gradients
  node proposal-generator.js --threshold 0.60 --novelty 60
  node proposal-generator.js --gradients /tmp/gradients --output /tmp/proposals
`);
}

// ── Gradient Loading ───────────────────────────────────────────────────────

/**
 * Loads all gradients from the gradients directory.
 */
function loadGradients(gradientsDir) {
  const gradients = [];

  if (!fs.existsSync(gradientsDir)) {
    console.log(`No gradients directory found: ${gradientsDir}`);
    return gradients;
  }

  const entries = fs.readdirSync(gradientsDir);
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;

    // Skip archived gradients
    if (entry.includes('archive')) continue;

    const filepath = path.join(gradientsDir, entry);
    try {
      const gradient = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      gradients.push(gradient);
    } catch (e) {
      console.error(`Failed to parse gradient: ${filepath}`);
    }
  }

  return gradients;
}

// ── Novelty Check ──────────────────────────────────────────────────────────

/**
 * Checks if a gradient direction has been investigated recently.
 */
function checkNovelty(direction, proposalsDir, windowDays) {
  if (!fs.existsSync(proposalsDir)) return true;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  // Check active proposals
  const activeProposals = loadProposals(proposalsDir, 'active');
  for (const proposal of activeProposals) {
    if (proposal.hypothesis?.toLowerCase().includes(direction.toLowerCase())) {
      return false; // Already being investigated
    }
  }

  // Check completed proposals
  const completedProposals = loadProposals(proposalsDir, 'completed');
  for (const proposal of completedProposals) {
    const completedDate = new Date(proposal.timestamp);
    if (completedDate >= cutoff) {
      if (proposal.hypothesis?.toLowerCase().includes(direction.toLowerCase())) {
        return false; // Recently investigated
      }
    }
  }

  // Check rejected proposals (less weight)
  const rejectedProposals = loadProposals(proposalsDir, 'rejected');
  for (const proposal of rejectedProposals) {
    const rejectedDate = new Date(proposal.timestamp);
    if (rejectedDate >= cutoff) {
      if (proposal.hypothesis?.toLowerCase().includes(direction.toLowerCase())) {
        return false; // Recently rejected
      }
    }
  }

  return true;
}

/**
 * Loads proposals from the proposals directory, optionally filtered by status.
 */
function loadProposals(proposalsDir, status = null) {
  const proposals = [];

  if (!fs.existsSync(proposalsDir)) return proposals;

  const entries = fs.readdirSync(proposalsDir);
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;

    const filepath = path.join(proposalsDir, entry);
    try {
      const proposal = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      if (status && proposal.status !== status) continue;
      proposals.push(proposal);
    } catch (e) {
      console.error(`Failed to parse proposal: ${filepath}`);
    }
  }

  return proposals;
}

// ── Proposal Generation ────────────────────────────────────────────────────

/**
 * Generates a proposal from a gradient.
 */
function generateProposal(gradient) {
  const template = PROPOSAL_TEMPLATES[gradient.type] || PROPOSAL_TEMPLATES.directional;

  // Generate proposal ID
  const dateStr = new Date().toISOString().slice(0, 10);
  const hash = crypto.createHash('sha256')
    .update(`${gradient.gradient_id}_${Date.now()}`)
    .digest('hex').slice(0, 4);
  const proposalId = `prop_${dateStr}_${hash}`;

  // Determine priority based on magnitude
  let priority;
  if (gradient.magnitude >= 0.8) {
    priority = 'high';
  } else if (gradient.magnitude >= 0.5) {
    priority = 'medium';
  } else {
    priority = 'low';
  }

  // Estimate completion time
  const estimatedDays = gradient.type === 'directional' ? 14 :
                        gradient.type === 'magnitude' ? 7 : 21;
  const estimatedCompletion = new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000);

  // Build hypothesis from gradient data
  const topConcept = gradient.top_concepts?.[0]?.concept || gradient.direction;
  const hypothesis = `${template.hypothesis_prefix} ${topConcept} has a significant impact on research outcomes.`;
  const researchQuestion = `${template.research_question_prefix} ${topConcept} evolve over the past ${gradient.contributing_traces_count || 0} cycles?`;

  // Resources needed based on gradient type
  let resourcesNeeded;
  switch (gradient.type) {
    case 'directional':
      resourcesNeeded = ['literature-review', 'pattern-analysis', 'concept-mapping'];
      break;
    case 'magnitude':
      resourcesNeeded = ['measurement-tools', 'baseline-data', 'comparison-framework'];
      break;
    case 'temporal':
      resourcesNeeded = ['time-series-analysis', 'trend-extraction', 'forecasting-model'];
      break;
    default:
      resourcesNeeded = ['analysis', 'documentation'];
  }

  return {
    proposal_id: proposalId,
    timestamp: new Date().toISOString(),
    status: 'pending',
    source_gradients: [gradient.gradient_id],
    hypothesis: hypothesis,
    research_question: researchQuestion,
    methodology: template.methodology,
    expected_outcome: template.expected_outcome,
    confidence: parseFloat(gradient.confidence.toFixed(2)),
    priority: priority,
    resources_needed: resourcesNeeded,
    timeline: {
      start: new Date().toISOString(),
      estimated_completion: estimatedCompletion.toISOString(),
    },
    results: null,
    lessons_learned: [],
    metadata: {
      pattern_strength: gradient.pattern_strength,
      temporal_factor: gradient.temporal_factor,
      contributing_traces_count: gradient.contributing_traces_count,
      top_concepts: gradient.top_concepts,
    },
  };
}

/**
 * Generates proposals from gradients that exceed the threshold.
 */
function generateProposals(gradients, config) {
  const proposals = [];

  // Filter gradients by threshold
  const strongGradients = gradients.filter(g => g.magnitude >= config.threshold);

  for (const gradient of strongGradients) {
    // Check novelty
    const isNovel = checkNovelty(gradient.direction, config.outputDir, config.noveltyWindowDays);
    if (!isNovel) {
      console.log(`  Skipping: "${gradient.direction}" — recently investigated`);
      continue;
    }

    // Check confidence
    if (gradient.confidence < 0.3) {
      console.log(`  Skipping: low confidence (${gradient.confidence}) for "${gradient.direction}"`);
      continue;
    }

    // Generate proposal
    const proposal = generateProposal(gradient);
    proposals.push(proposal);
  }

  return proposals;
}

// ── Proposal Storage ───────────────────────────────────────────────────────

/**
 * Stores proposals to the output directory.
 */
function storeProposals(proposals, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let stored = 0;
  for (const proposal of proposals) {
    const filename = `${proposal.proposal_id}.json`;
    const filepath = path.join(outputDir, filename);

    // Don't overwrite existing proposals
    if (fs.existsSync(filepath)) {
      continue;
    }

    fs.writeFileSync(filepath, JSON.stringify(proposal, null, 2));
    stored++;
  }

  return stored;
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const config = parseArgs(process.argv);

  console.log(`\nProposal Generator — ${new Date().toISOString()}`);
  console.log(`Gradients: ${config.gradientsDir}`);
  console.log(`Threshold: ${config.threshold}`);
  console.log(`Novelty window: ${config.noveltyWindowDays}d\n`);

  // Load gradients
  const gradients = loadGradients(config.gradientsDir);
  console.log(`Loaded ${gradients.length} gradients`);

  if (gradients.length === 0) {
    console.log('No gradients to process. Nothing to generate.\n');
    return;
  }

  // Show gradient summary
  console.log('\nGradients:');
  for (const g of gradients) {
    const bar = '█'.repeat(Math.round(g.magnitude * 10)) + '░'.repeat(10 - Math.round(g.magnitude * 10));
    const threshold = g.magnitude >= config.threshold ? '✓' : '✗';
    console.log(`  [${threshold}] ${g.direction.padEnd(25)} |${bar}| ${g.magnitude.toFixed(2)} (conf: ${g.confidence})`);
  }

  // Generate proposals
  const proposals = generateProposals(gradients, config);
  console.log(`\nGenerated ${proposals.length} proposals`);

  // Store proposals
  const stored = storeProposals(proposals, config.outputDir);
  console.log(`Stored ${stored} new proposals`);

  // Show proposals
  if (proposals.length > 0) {
    console.log('\nProposals:');
    for (const p of proposals) {
      console.log(`  ${p.proposal_id}`);
      console.log(`    Hypothesis: ${p.hypothesis}`);
      console.log(`    Confidence: ${p.confidence} | Priority: ${p.priority}`);
      console.log(`    Timeline: ${p.timeline.estimated_completion.slice(0, 10)}`);
    }
  }

  // Update GRAO state
  updateGrAoState(proposals);

  console.log('\nDone.');
}

/**
 * Updates GRAO state with latest proposal generation.
 */
function updateGrAoState(proposals) {
  if (!fs.existsSync(GRAO_STATE)) return;

  try {
    const state = JSON.parse(fs.readFileSync(GRAO_STATE, 'utf8'));
    state.last_proposal_generation = new Date().toISOString();
    state.new_proposals = proposals.map(p => p.proposal_id);
    fs.writeFileSync(GRAO_STATE, JSON.stringify(state, null, 2));
  } catch (e) {
    console.error('Failed to update GRAO state:', e.message);
  }
}

// ── Run ────────────────────────────────────────────────────────────────────

main();
