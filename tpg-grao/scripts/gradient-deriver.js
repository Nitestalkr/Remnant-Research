#!/usr/bin/env node
/**
 * gradient-deriver.js — Computes gradients from collected traces using pattern analysis.
 *
 * Usage:
 *   node gradient-deriver.js [--traces traces/]
 *                           [--output gradients/]
 *                           [--window 7d]
 *                           [--threshold 0.30]
 *
 * Output: JSON gradient files in gradients/ directory
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Configuration ──────────────────────────────────────────────────────────

const BASE_DIR = path.resolve(__dirname, '..');
const TRACES_DIR = path.join(BASE_DIR, 'traces');
const GRADIENTS_DIR = path.join(BASE_DIR, 'gradients');
const GRAO_STATE = path.join(BASE_DIR, 'grao', 'grao-state.json');

const CONFIG = {
  tracesDir: TRACES_DIR,
  outputDir: GRADIENTS_DIR,
  windowDays: 7,
  threshold: 0.30,
  decayRate: 0.02, // daily decay for gradients
  saturationState: {
    reinforcementRounds: 0,
    lastRoundSuccessRatio: 0,
    detected: false,
    lastDetected: null,
  },
  explorationEnabled: false,
};

// Pattern strength thresholds
const PATTERN_THRESHOLDS = {
  strong: 0.7,
  moderate: 0.3,
  weak: 0.1,
};

// Saturation detection thresholds
const SATURATION_THRESHOLDS = {
  minReinforcementRounds: 15,
  plateauRatio: 0.90,
  minTracesForDetection: 20,
};

// ── CLI Parsing ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { ...CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--traces':
        i++;
        if (i < args.length) parsed.tracesDir = path.resolve(args[i]);
        break;
      case '--output':
        i++;
        if (i < args.length) parsed.outputDir = path.resolve(args[i]);
        break;
      case '--window':
        i++;
        if (i < args.length) {
          const match = args[i].match(/^(\d+)([dhw])?$/);
          if (match) {
            const val = parseInt(match[1]);
            const unit = match[2] || 'd';
            parsed.windowDays = unit === 'd' ? val : unit === 'h' ? val / 24 : unit === 'w' ? val * 7 : val / 360 / 24;
          }
        }
        break;
      case '--threshold':
        i++;
        if (i < args.length) parsed.threshold = parseFloat(args[i]);
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
gradient-deriver.js — Compute gradients from research traces

Usage: node gradient-deriver.js [options]

Options:
  --traces <path>       Traces directory (default: traces/)
  --output <path>       Output directory (default: gradients/)
  --window <N>[d|h|w]   Analysis window (default: 7d)
  --threshold <N>       Minimum gradient magnitude to output (default: 0.30)
  --help                Show this help

Examples:
  node gradient-deriver.js                          # analyze last 7 days
  node gradient-deriver.js --window 30d --threshold 0.50
  node gradient-deriver.js --traces /tmp/traces --output /tmp/gradients
`);
}

// ── Trace Loading ──────────────────────────────────────────────────────────

/**
 * Loads all traces from the traces directory within the time window.
 * Filters synthetic traces (action=unknown) that are artifacts of cycle initialization.
 */
function loadTraces(tracesDir, windowDays) {
  const allTraces = [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  if (!fs.existsSync(tracesDir)) {
    console.log(`No traces directory found: ${tracesDir}`);
    return allTraces;
  }

  // Load from date-subdirectories
  const entries = fs.readdirSync(tracesDir);
  for (const entry of entries) {
    const entryPath = path.join(tracesDir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Check if directory date is within window
      const dirDate = new Date(entry);
      if (dirDate >= cutoff) {
        const files = fs.readdirSync(entryPath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filepath = path.join(entryPath, file);
            try {
              const trace = JSON.parse(fs.readFileSync(filepath, 'utf8'));
              // Filter synthetic cycle-start traces: action=unknown is an artifact, not a real failure
              if (trace.action === 'unknown' && trace.signal_type === 'stability' && trace.metric_name === 'cycle_start') {
                console.log(`  Filtering synthetic trace: ${trace.trace_id}`);
                continue;
              }
              allTraces.push(trace);
            } catch (e) {
              console.error(`Failed to parse trace: ${filepath}`);
            }
          }
        }
      }
    }
  }

  return allTraces;
}

// ── Pattern Analysis ───────────────────────────────────────────────────────

/**
 * Clusters traces by signal type and content similarity.
 */
function clusterTraces(traces) {
  const clusters = {};

  for (const trace of traces) {
    const type = trace.signal_type;
    if (!clusters[type]) {
      clusters[type] = [];
    }
    clusters[type].push(trace);
  }

  return clusters;
}

/**
 * Computes pattern strength for a cluster of traces.
 */
function computePatternStrength(traces) {
  if (traces.length === 0) return 0;

  // Count unique sources in cluster
  const sources = new Set(traces.map(t => t.source));
  const sourceDiversity = sources.size / traces.length;

  // Count traces with high confidence
  const highConfidence = traces.filter(t => (t.metadata?.confidence || 0) >= 0.7).length;
  const confidenceRatio = highConfidence / traces.length;

  // Compute temporal consistency (traces spread evenly over time)
  const timestamps = traces.map(t => new Date(t.timestamp).getTime()).sort();
  let consistency = 1;
  if (timestamps.length > 2) {
    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - meanInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / meanInterval; // coefficient of variation
    consistency = 1 - Math.min(cv, 1); // lower CV = higher consistency
  }

  // Weighted pattern strength
  const patternStrength = (sourceDiversity * 0.3 + confidenceRatio * 0.5 + consistency * 0.2);

  return Math.min(Math.max(patternStrength, 0), 1);
}

/**
 * Determines temporal factor for a pattern.
 */
function determineTemporalFactor(traces) {
  if (traces.length < 3) return 'stable';

  const timestamps = traces.map(t => new Date(t.timestamp).getTime()).sort();
  const now = Date.now();

  // Split traces into recent (last 25%) and older
  const splitPoint = Math.floor(timestamps.length * 0.75);
  const recent = timestamps.slice(splitPoint);
  const older = timestamps.slice(0, splitPoint);

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const ratio = (now - recentAvg) / (now - olderAvg);

  if (ratio < 0.8) return 'accelerating';
  if (ratio > 1.2) return 'decaying';
  return 'stable';
}

/**
 * Extracts key concepts from traces for gradient direction.
 */
function extractConcepts(traces) {
  const conceptCounts = {};

  for (const trace of traces) {
    // From research traces
    if (trace.key_concepts) {
      for (const concept of trace.key_concepts) {
        conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
      }
    }

    // From tags
    if (trace.metadata?.tags) {
      for (const tag of trace.metadata.tags) {
        conceptCounts[tag] = (conceptCounts[tag] || 0) + 0.5;
      }
    }

    // From raw_data context
    if (trace.raw_data?.domain) {
      conceptCounts[trace.raw_data.domain] = (conceptCounts[trace.raw_data.domain] || 0) + 0.3;
    }
  }

  // Sort by count
  const sorted = Object.entries(conceptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return sorted.map(([concept, count]) => ({ concept, weight: count }));
}

// ── Saturation Detection ───────────────────────────────────────────────────

/**
 * Detects policy saturation from GRAO state and live conditions.
 * Returns saturation state object.
 */
function detectSaturation(gradients, config) {
  const successCount = gradients.filter(g => g.category === 'success').length;
  const totalGradients = gradients.length;
  const successRatio = totalGradients > 0 ? successCount / totalGradients : 0;

  // Check saturation conditions
  const saturation = {
    detected: false,
    reinforcementRounds: config.saturationState.reinforcementRounds,
    lastRoundSuccessRatio: config.saturationState.lastRoundSuccessRatio,
    currentSuccessRatio: successRatio,
    traceCount: totalGradients,
    reason: null,
  };

  // Condition 1: 15+ consecutive reinforcement-only rounds
  if (saturation.reinforcementRounds >= SATURATION_THRESHOLDS.minReinforcementRounds) {
    saturation.detected = true;
    saturation.reason = 'consecutive_reinforcement_rounds';
  }

  // Condition 2: Success ratio plateau near 90%+
  if (successRatio >= SATURATION_THRESHOLDS.plateauRatio && totalGradients >= SATURATION_THRESHOLDS.minTracesForDetection) {
    saturation.detected = true;
    saturation.reason = saturation.reason || 'success_ratio_plateau';
  }

  // Condition 3: No high-priority or failure gradients (everything is success)
  const hasNonSuccess = gradients.some(g => g.category !== 'success');
  if (!hasNonSuccess && totalGradients >= SATURATION_THRESHOLDS.minTracesForDetection) {
    saturation.detected = true;
    saturation.reason = saturation.reason || 'pure_reinforcement';
  }

  if (saturation.detected) {
    saturation.reinforcementRounds++;
    saturation.lastDetected = new Date().toISOString();
    console.log(`  ⚠ SATURATION DETECTED: ${saturation.reason} (${saturation.reinforcementRounds} reinforcement rounds, success ratio: ${successRatio.toFixed(2)})`);
  } else {
    // Reset if saturation clears
    if (config.saturationState.detected && !saturation.detected) {
      saturation.reinforcementRounds = 0;
      console.log(`  ✅ Saturation cleared — fresh signal detected`);
    }
  }

  return saturation;
}

// ── Exploration Gradient Generation ─────────────────────────────────────────

/**
 * Generates exploration gradients when saturation is detected.
 * These drive toward unexplored TPG paths rather than reinforcing existing ones.
 */
function generateExplorationGradients(saturation, config) {
  if (!saturation.detected) return [];

  console.log(`\n  🧭 Generating exploration gradients (saturation: ${saturation.reason})`);

  // Exploration areas — unexplored TPG paths beyond current policy set
  const explorationAreas = [
    { direction: 'cross-cluster-pattern-discovery', magnitude: 0.65, type: 'exploration', hypothesis: 'Cross-cluster gradient comparison reveals optimization patterns not visible within single-cluster analysis' },
    { direction: 'non-reinforcement-proposal-testing', magnitude: 0.70, type: 'exploration', hypothesis: 'Non-reinforcement proposals (structural changes, new trace sources) may yield higher ROI than continued pattern reinforcement' },
    { direction: 'trace-source-expansion', magnitude: 0.55, type: 'exploration', hypothesis: 'Adding new trace source types (user-interaction, deployment-events, external-API-responses) increases gradient diversity' },
    { direction: 'gradient-weight-redistribution', magnitude: 0.50, type: 'exploration', hypothesis: 'Rebalancing impact/frequency/persistence weights may expose previously suppressed optimization areas' },
    { direction: 'experience-cluster-merging', magnitude: 0.45, type: 'exploration', hypothesis: 'Merging small experience clusters into broader clusters enables cross-cluster pattern discovery' },
  ];

  const explorationGradients = [];
  const dateStr = new Date().toISOString().slice(0, 10);

  for (const area of explorationAreas) {
    const hash = crypto.createHash('sha256')
      .update(`explore_${area.direction}_${Date.now()}`)
      .digest('hex').slice(0, 8);

    explorationGradients.push({
      gradient_id: `grad_${dateStr}_explore_${hash}`,
      timestamp: new Date().toISOString(),
      type: 'exploration',
      direction: area.direction,
      magnitude: area.magnitude,
      confidence: 0.40, // Lower confidence — exploration by definition
      category: 'exploration',
      pattern_strength: 0.0, // No pattern history yet
      temporal_factor: 'new',
      hypothesis: area.hypothesis,
      contributing_traces: [],
      contributing_traces_count: 0,
      top_concepts: [],
      decay_rate: CONFIG.decayRate,
      next_computation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      exploration_note: `Generated due to saturation (${saturation.reason}). This gradient drives toward unexplored optimization area.`,
    });
  }

  console.log(`  Generated ${explorationGradients.length} exploration gradients`);
  return explorationGradients;
}

// ── Gradient Computation ───────────────────────────────────────────────────

/**
 * Computes gradients from pattern analysis.
 * Adds insufficient_data category for high-priority gradients lacking pattern history.
 */
function computeGradients(clusters) {
  const gradients = [];

  for (const [type, traces] of Object.entries(clusters)) {
    const patternStrength = computePatternStrength(traces);

    // Skip patterns below threshold
    if (patternStrength < CONFIG.threshold) {
      continue;
    }

    const temporalFactor = determineTemporalFactor(traces);
    const concepts = extractConcepts(traces);

    // Compute magnitude
    let magnitude = patternStrength;

    // Apply temporal adjustment
    if (temporalFactor === 'accelerating') {
      magnitude *= 1.2;
    } else if (temporalFactor === 'decaying') {
      magnitude *= 0.8;
    }

    magnitude = Math.min(Math.max(magnitude, 0), 1);

    // Compute confidence from trace metadata
    const avgConfidence = traces.reduce((sum, t) => sum + (t.metadata?.confidence || 0), 0) / traces.length;

    // Determine gradient type based on signal type
    let gradientType;
    switch (type) {
      case 'research':
        gradientType = 'directional';
        break;
      case 'stability':
        gradientType = 'magnitude';
        break;
      case 'agent':
        gradientType = 'temporal';
        break;
      case 'experience':
        gradientType = 'directional';
        break;
      default:
        gradientType = 'directional';
    }

    // Determine direction
    let direction;
    switch (type) {
      case 'research':
        direction = concepts[0]?.concept || 'knowledge-acquisition';
        break;
      case 'stability':
        direction = 'system-health';
        break;
      case 'agent':
        direction = 'agent-optimization';
        break;
      case 'experience':
        direction = 'meta-optimization';
        break;
      default:
        direction = type;
    }

    // Determine category — check for insufficient_data
    let category;
    if (magnitude >= 0.7 && avgConfidence < 0.4 && traces.length < 3) {
      // High magnitude but insufficient pattern data — not a true failure
      category = 'insufficient_data';
      console.log(`  → insufficient_data: "${direction}" (magnitude: ${magnitude.toFixed(2)}, conf: ${avgConfidence.toFixed(2)}, traces: ${traces.length})`);
    } else if (avgConfidence >= 0.5) {
      category = 'success';
    } else {
      category = 'failure';
    }

    // Generate gradient ID
    const hash = crypto.createHash('sha256')
      .update(`${type}_${patternStrength}_${category}`)
      .digest('hex').slice(0, 8);
    const dateStr = new Date().toISOString().slice(0, 10);

    gradients.push({
      gradient_id: `grad_${dateStr}_${type}_${hash}`,
      timestamp: new Date().toISOString(),
      type: gradientType,
      direction: direction,
      magnitude: parseFloat(magnitude.toFixed(3)),
      confidence: parseFloat(avgConfidence.toFixed(3)),
      pattern_strength: parseFloat(patternStrength.toFixed(3)),
      temporal_factor: temporalFactor,
      category: category,
      contributing_traces: traces.map(t => t.trace_id),
      contributing_traces_count: traces.length,
      top_concepts: concepts,
      decay_rate: CONFIG.decayRate,
      next_computation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return gradients;
}

// ── Gradient Storage ───────────────────────────────────────────────────────

/**
 * Stores gradients to the output directory.
 */
function storeGradients(gradients, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let stored = 0;
  for (const gradient of gradients) {
    const filename = `${gradient.gradient_id}.json`;
    const filepath = path.join(outputDir, filename);

    // Don't overwrite existing gradients
    if (fs.existsSync(filepath)) {
      continue;
    }

    fs.writeFileSync(filepath, JSON.stringify(gradient, null, 2));
    stored++;
  }

  return stored;
}

/**
 * Archives old gradients (older than retention period).
 */
function archiveOldGradients(outputDir, retentionDays = 30) {
  if (!fs.existsSync(outputDir)) return 0;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  let archived = 0;

  const files = fs.readdirSync(outputDir);
  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const filepath = path.join(outputDir, file);
    const stat = fs.statSync(filepath);

    if (stat.mtime < cutoff) {
      // Move to archive
      const archiveDir = path.join(outputDir, 'archive');
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }

      const archivePath = path.join(archiveDir, file);
      fs.renameSync(filepath, archivePath);
      archived++;
    }
  }

  return archived;
}

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const config = parseArgs(process.argv);

  console.log(`\nGradient Deriver — ${new Date().toISOString()}`);
  console.log(`Traces: ${config.tracesDir}`);
  console.log(`Window: ${config.windowDays}d`);
  console.log(`Threshold: ${config.threshold}\n`);

  // Load traces
  const traces = loadTraces(config.tracesDir, config.windowDays);
  console.log(`Loaded ${traces.length} traces`);

  if (traces.length === 0) {
    console.log('No traces to analyze. Nothing to compute.\n');
    return;
  }

  // Cluster traces
  const clusters = clusterTraces(traces);
  console.log(`Clusters: ${Object.keys(clusters).length}`);

  // Compute gradients
  const gradients = computeGradients(clusters);
  console.log(`Computed ${gradients.length} gradients`);

  // Detect saturation
  const saturation = detectSaturation(gradients, config);

  // Generate exploration gradients if saturation detected
  let allGradients = gradients;
  if (saturation.detected) {
    const explorationGradients = generateExplorationGradients(saturation, config);
    allGradients = [...gradients, ...explorationGradients];
    console.log(`\n  Total gradients (incl. exploration): ${allGradients.length}`);
  }

  // Store gradients
  const stored = storeGradients(allGradients, config.outputDir);
  console.log(`Stored ${stored} new gradients`);

  // Archive old gradients
  const archived = archiveOldGradients(config.outputDir);
  if (archived > 0) {
    console.log(`Archived ${archived} old gradients`);
  }

  // Summary by category
  console.log('\nGradients by category:');
  const byCategory = {};
  for (const g of allGradients) {
    byCategory[g.category] = (byCategory[g.category] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log('\nGradients:');
  for (const g of allGradients) {
    const magBar = '█'.repeat(Math.round(g.magnitude * 10)) + '░'.repeat(10 - Math.round(g.magnitude * 10));
    const catTag = g.category === 'exploration' ? '🧭' : g.category === 'insufficient_data' ? '⏳' : '';
    console.log(`  ${catTag} ${g.direction.padEnd(30)} |${magBar}| ${g.magnitude.toFixed(2)} (${g.type}) [${g.category}]`);
  }

  // Update GRAO state
  updateGrAoState(allGradients, saturation);

  console.log('\nDone.');
}

/**
 * Updates GRAO state with latest gradient computation.
 */
function updateGrAoState(gradients, saturation) {
  if (!fs.existsSync(GRAO_STATE)) return;

  try {
    const state = JSON.parse(fs.readFileSync(GRAO_STATE, 'utf8'));
    state.last_gradient_computation = new Date().toISOString();
    state.active_gradients = gradients.map(g => ({
      id: g.gradient_id,
      direction: g.direction,
      magnitude: g.magnitude,
      type: g.type,
      category: g.category,
    }));

    // Update saturation tracking
    if (saturation) {
      state.saturation = {
        detected: saturation.detected,
        reinforcementRounds: saturation.reinforcementRounds,
        lastRoundSuccessRatio: saturation.currentSuccessRatio,
        lastDetected: saturation.lastDetected,
        reason: saturation.reason,
      };
    }

    // Count categories
    const categoryCounts = {};
    for (const g of gradients) {
      categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
    }
    state.gradient_categories = categoryCounts;

    fs.writeFileSync(GRAO_STATE, JSON.stringify(state, null, 2));
  } catch (e) {
    console.error('Failed to update GRAO state:', e.message);
  }
}

// ── Run ────────────────────────────────────────────────────────────────────

main();
