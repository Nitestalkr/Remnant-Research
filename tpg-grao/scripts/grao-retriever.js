#!/usr/bin/env node
/**
 * grao-retriever.js — Retrieves and analyzes GRAO loop history for trend analysis.
 *
 * Usage:
 *   node grao-retriever.js [--rounds N]
 *                          [--metrics all|gradients|proposals|health]
 *                          [--output reports/]
 *
 * Output: Trend analysis and comparison data
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Configuration ──────────────────────────────────────────────────────────

const BASE_DIR = path.resolve(__dirname, '..');
const GRAO_STATE = path.join(BASE_DIR, 'grao', 'grao-state.json');
const GRADIENTS_DIR = path.join(BASE_DIR, 'gradients');
const PROPOSALS_DIR = path.join(BASE_DIR, 'proposals');
const REPORTS_DIR = path.join(BASE_DIR, 'reports');
const LOOPS_DIR = path.join(BASE_DIR, 'grao', 'loops');

const CONFIG = {
  rounds: null, // null = all
  metrics: ['gradients', 'proposals', 'health'],
  outputDir: REPORTS_DIR,
  windowDays: 30,
};

// ── CLI Parsing ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { ...CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--rounds':
        i++;
        if (i < args.length) parsed.rounds = parseInt(args[i]);
        break;
      case '--metrics':
        i++;
        if (i < args.length) {
          const m = args[i].split(',').map(s => s.trim().toLowerCase());
          parsed.metrics = m[0] === 'all' ? ['gradients', 'proposals', 'health'] : m;
        }
        break;
      case '--output':
        i++;
        if (i < args.length) parsed.outputDir = path.resolve(args[i]);
        break;
      case '--window':
        i++;
        if (i < args.length) parsed.windowDays = parseInt(args[i]);
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
grao-retriever.js — Analyze GRAO loop history for trends

Usage: node grao-retriever.js [options]

Options:
  --rounds <N>          Number of recent rounds to analyze (default: all)
  --metrics <m1,m2,...> Metrics to analyze: gradients,proposals,health (default: all)
  --output <path>       Output directory (default: reports/)
  --window <N>          Days to look back (default: 30)
  --help                Show this help

Examples:
  node grao-retriever.js                          # analyze all rounds, all metrics
  node grao-retriever.js --rounds 10 --metrics gradients,proposals
  node grao-retriever.js --window 90 --output /tmp/reports
`);
}

// ── Loop Log Loading ───────────────────────────────────────────────────────

/**
 * Loads GRAO loop logs from the loops directory.
 */
function loadLoopLogs(loopsDir, maxRounds = null) {
  const logs = [];

  if (!fs.existsSync(loopsDir)) {
    console.log(`No loops directory found: ${loopsDir}`);
    return logs;
  }

  const entries = fs.readdirSync(loopsDir).filter(f => f.endsWith('.json'));

  // Sort by round number (embedded in filename)
  entries.sort((a, b) => {
    const roundA = parseInt(a.match(/round_(\d+)/)?.[1] || 0);
    const roundB = parseInt(b.match(/round_(\d+)/)?.[1] || 0);
    return roundB - roundA; // descending
  });

  const toLoad = maxRounds ? entries.slice(0, maxRounds) : entries;

  for (const entry of toLoad) {
    const filepath = path.join(loopsDir, entry);
    try {
      const log = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      logs.push(log);
    } catch (e) {
      console.error(`Failed to parse loop log: ${filepath}`);
    }
  }

  return logs;
}

// ── Gradient History ───────────────────────────────────────────────────────

/**
 * Loads gradient history for trend analysis.
 */
function loadGradientHistory(gradientsDir, windowDays) {
  const gradients = [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  if (!fs.existsSync(gradientsDir)) return gradients;

  const entries = fs.readdirSync(gradientsDir);
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;

    const filepath = path.join(gradientsDir, entry);
    const stat = fs.statSync(filepath);

    if (stat.mtime < cutoff) continue;

    try {
      const gradient = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      gradients.push(gradient);
    } catch (e) {
      // Skip corrupted files
    }
  }

  return gradients;
}

// ── Proposal History ───────────────────────────────────────────────────────

/**
 * Loads proposal history for analysis.
 */
function loadProposalHistory(proposalsDir, windowDays) {
  const proposals = [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  if (!fs.existsSync(proposalsDir)) return proposals;

  const entries = fs.readdirSync(proposalsDir);
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;

    const filepath = path.join(proposalsDir, entry);
    const stat = fs.statSync(filepath);

    if (stat.mtime < cutoff) continue;

    try {
      const proposal = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      proposals.push(proposal);
    } catch (e) {
      // Skip corrupted files
    }
  }

  return proposals;
}

// ── Trend Analysis ─────────────────────────────────────────────────────────

/**
 * Analyzes gradient trends over time.
 */
function analyzeGradientTrends(gradients) {
  if (gradients.length === 0) return { directions: [], trends: [] };

  // Group by direction
  const byDirection = {};
  for (const g of gradients) {
    const dir = g.direction;
    if (!byDirection[dir]) {
      byDirection[dir] = {
        direction: dir,
        gradients: [],
        avgMagnitude: 0,
        avgConfidence: 0,
        temporalFactor: 'stable',
        count: 0,
      };
    }
    byDirection[dir].gradients.push(g);
    byDirection[dir].count++;
  }

  // Compute aggregates
  for (const [dir, data] of Object.entries(byDirection)) {
    const magnitudes = data.gradients.map(g => g.magnitude);
    const confidences = data.gradients.map(g => g.confidence);

    data.avgMagnitude = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    data.avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;

    // Determine overall temporal factor
    const temporalFactors = data.gradients.map(g => g.temporal_factor);
    const counts = { accelerating: 0, stable: 0, decaying: 0 };
    for (const f of temporalFactors) {
      counts[f] = (counts[f] || 0) + 1;
    }
    data.temporalFactor = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  // Sort by average magnitude
  const sorted = Object.values(byDirection)
    .sort((a, b) => b.avgMagnitude - a.avgMagnitude);

  return {
    directions: sorted,
    totalGradients: gradients.length,
    uniqueDirections: Object.keys(byDirection).length,
  };
}

/**
 * Analyzes proposal trends over time.
 */
function analyzeProposalTrends(proposals) {
  if (proposals.length === 0) return { byStatus: {}, total: 0 };

  const byStatus = { pending: 0, active: 0, completed: 0, rejected: 0 };
  const byPriority = { high: 0, medium: 0, low: 0 };

  for (const p of proposals) {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    byPriority[p.priority] = (byPriority[p.priority] || 0) + 1;
  }

  const avgConfidence = proposals.reduce((sum, p) => sum + (p.confidence || 0), 0) / proposals.length;

  return {
    byStatus,
    byPriority,
    total: proposals.length,
    avgConfidence: parseFloat(avgConfidence.toFixed(2)),
  };
}

/**
 * Analyzes system health from GRAO state.
 */
function analyzeHealth() {
  if (!fs.existsSync(GRAO_STATE)) {
    return { cycleCount: 0, lastCycle: null, lastGradientComputation: null, lastProposalGeneration: null };
  }

  try {
    const state = JSON.parse(fs.readFileSync(GRAO_STATE, 'utf8'));
    return {
      cycleCount: state.cycle_count || 0,
      lastCycle: state.last_cycle,
      lastGradientComputation: state.last_gradient_computation,
      lastProposalGeneration: state.last_proposal_generation,
      activeGradients: (state.active_gradients || []).length,
      researchPriorities: (state.research_priorities || []).length,
    };
  } catch (e) {
    return { cycleCount: 0, lastCycle: null, lastGradientComputation: null, lastProposalGeneration: null };
  }
}

// ── Report Generation ──────────────────────────────────────────────────────

/**
 * Generates a trend analysis report.
 */
function generateReport(gradientTrends, proposalTrends, health, config) {
  const reportId = `rpt_${new Date().toISOString().slice(0, 10)}_analysis`;

  // Determine key findings
  const findings = [];
  const recommendations = [];
  const nextCycleFocus = [];

  // Gradient-based findings
  if (gradientTrends.directions.length > 0) {
    const topDirection = gradientTrends.directions[0];
    findings.push(`Top gradient direction: "${topDirection.direction}" (magnitude: ${topDirection.avgMagnitude.toFixed(2)})`);

    if (topDirection.temporalFactor === 'accelerating') {
      recommendations.push(`Investigate accelerating gradient: "${topDirection.direction}" — pattern gaining strength`);
      nextCycleFocus.push(topDirection.direction);
    }

    if (topDirection.temporalFactor === 'decaying') {
      recommendations.push(`Monitor decaying gradient: "${topDirection.direction}" — pattern losing relevance`);
    }

    if (gradientTrends.uniqueDirections > 5) {
      findings.push(`High gradient diversity: ${gradientTrends.uniqueDirections} unique directions detected`);
      recommendations.push('Consider consolidating research focus to reduce gradient noise');
    }
  }

  // Proposal-based findings
  if (proposalTrends.total > 0) {
    findings.push(`Proposal state: ${proposalTrends.byStatus.pending} pending, ${proposalTrends.byStatus.active} active, ${proposalTrends.byStatus.completed} completed`);

    if (proposalTrends.byStatus.pending > proposalTrends.byStatus.active * 2) {
      recommendations.push('High pending-to-active ratio — review and activate or reject pending proposals');
    }

    if (proposalTrends.avgConfidence < 0.4) {
      recommendations.push('Low average proposal confidence — increase gradient threshold');
    }
  }

  // Health-based findings
  if (health.lastCycle) {
    const lastCycleDate = new Date(health.lastCycle);
    const hoursSince = (Date.now() - lastCycleDate.getTime()) / (1000 * 60 * 60);
    if (hoursSince > 24) {
      findings.push(`Last cycle was ${Math.round(hoursSince)} hours ago — consider investigating`);
      recommendations.push('Check GRAO cron jobs and system health');
    }
  }

  // Default recommendations if none generated
  if (recommendations.length === 0) {
    recommendations.push('System operating normally — continue monitoring');
  }

  // Default next cycle focus
  if (nextCycleFocus.length === 0 && gradientTrends.directions.length > 0) {
    nextCycleFocus.push(gradientTrends.directions[0].direction);
  }

  return {
    report_id: reportId,
    cycle_number: health.cycleCount,
    timestamp: new Date().toISOString(),
    period: {
      start: new Date(Date.now() - config.windowDays * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
    summary: {
      gradients_analyzed: gradientTrends.totalGradients,
      unique_directions: gradientTrends.uniqueDirections,
      proposals_analyzed: proposalTrends.total,
      proposals_pending: proposalTrends.byStatus.pending,
      proposals_active: proposalTrends.byStatus.active,
      proposals_completed: proposalTrends.byStatus.completed,
    },
    gradient_state: {
      top_directions: gradientTrends.directions.slice(0, 5).map(d => ({
        direction: d.direction,
        magnitude: d.avgMagnitude,
        confidence: d.avgConfidence,
        temporal_factor: d.temporalFactor,
        count: d.count,
      })),
      emerging_patterns: gradientTrends.directions.filter(d => d.temporalFactor === 'accelerating').map(d => d.direction),
      decaying_patterns: gradientTrends.directions.filter(d => d.temporalFactor === 'decaying').map(d => d.direction),
    },
    system_health: health,
    key_findings: findings,
    recommendations: recommendations,
    next_cycle_focus: nextCycleFocus,
  };
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const config = parseArgs(process.argv);

  console.log(`\nGRAO Retriever — ${new Date().toISOString()}`);
  console.log(`Rounds: ${config.rounds || 'all'}`);
  console.log(`Metrics: ${config.metrics.join(', ')}`);
  console.log(`Window: ${config.windowDays}d\n`);

  // Load data
  const loopLogs = loadLoopLogs(LOOPS_DIR, config.rounds);
  console.log(`Loop logs: ${loopLogs.length}`);

  const gradients = loadGradientHistory(GRADIENTS_DIR, config.windowDays);
  console.log(`Gradients: ${gradients.length}`);

  const proposals = loadProposalHistory(PROPOSALS_DIR, config.windowDays);
  console.log(`Proposals: ${proposals.length}`);

  // Analyze
  let gradientTrends = { directions: [], trends: [], totalGradients: 0, uniqueDirections: 0 };
  let proposalTrends = { byStatus: {}, total: 0 };
  let health = { cycleCount: 0, lastCycle: null };

  if (config.metrics.includes('gradients')) {
    gradientTrends = analyzeGradientTrends(gradients);
    console.log(`\nGradient Trends:`);
    for (const dir of gradientTrends.directions.slice(0, 5)) {
      const bar = '█'.repeat(Math.round(dir.avgMagnitude * 10)) + '░'.repeat(10 - Math.round(dir.avgMagnitude * 10));
      console.log(`  ${dir.direction.padEnd(25)} |${bar}| ${dir.avgMagnitude.toFixed(2)} (${dir.temporalFactor})`);
    }
  }

  if (config.metrics.includes('proposals')) {
    proposalTrends = analyzeProposalTrends(proposals);
    console.log(`\nProposal Trends:`);
    console.log(`  Total: ${proposalTrends.total}`);
    console.log(`  Pending: ${proposalTrends.byStatus.pending}`);
    console.log(`  Active: ${proposalTrends.byStatus.active}`);
    console.log(`  Completed: ${proposalTrends.byStatus.completed}`);
    console.log(`  Avg Confidence: ${proposalTrends.avgConfidence}`);
  }

  if (config.metrics.includes('health')) {
    health = analyzeHealth();
    console.log(`\nSystem Health:`);
    console.log(`  Cycle count: ${health.cycleCount}`);
    console.log(`  Last cycle: ${health.lastCycle || 'never'}`);
    console.log(`  Last gradient computation: ${health.lastGradientComputation || 'never'}`);
    console.log(`  Last proposal generation: ${health.lastProposalGeneration || 'never'}`);
  }

  // Generate report
  const report = generateReport(gradientTrends, proposalTrends, health, config);

  console.log(`\nKey Findings:`);
  for (const finding of report.key_findings) {
    console.log(`  • ${finding}`);
  }

  console.log(`\nRecommendations:`);
  for (const rec of report.recommendations) {
    console.log(`  → ${rec}`);
  }

  // Save report
  if (config.outputDir) {
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    const filepath = path.join(config.outputDir, `${report.report_id}.json`);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved: ${filepath}`);
  }

  console.log('\nDone.');
}

// ── Run ────────────────────────────────────────────────────────────────────

main();
