#!/usr/bin/env node
/**
 * trace-collector.js — Collects and normalizes raw traces from all signal sources.
 *
 * Usage:
 *   node trace-collector.js [--sources all|agent|research|stability|experience]
 *                           [--output traces/]
 *                           [--window 24h]
 *
 * Output: JSON trace files in traces/ directory
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Configuration ──────────────────────────────────────────────────────────

const BASE_DIR = path.resolve(__dirname, '..');
const TRACES_DIR = path.join(BASE_DIR, 'traces');
const GRAO_STATE = path.join(BASE_DIR, 'grao', 'grao-state.json');

// Default config
const CONFIG = {
  sources: ['agent', 'research', 'stability', 'experience'],
  outputDir: TRACES_DIR,
  windowHours: 24,
  dedupWindowMs: 60000, // 1 minute — avoid duplicate traces from same source
};

// Signal type schema
const SIGNAL_TYPES = {
  agent: {
    required: ['timestamp', 'source', 'tool_name', 'outcome'],
    optional: ['latency_ms', 'model_used', 'thinking_level', 'success', 'error'],
  },
  research: {
    required: ['timestamp', 'source', 'title', 'arxiv_id'],
    optional: ['authors', 'abstract', 'relevance_score', 'key_concepts', 'domain', 'confidence', 'novelty'],
  },
  stability: {
    required: ['timestamp', 'source', 'metric_name', 'value'],
    optional: ['baseline', 'delta', 'trend', 'severity', 'unit'],
  },
  experience: {
    required: ['timestamp', 'source', 'pattern', 'effectiveness'],
    optional: ['context', 'applicability', 'time_saved_ms', 'errors_avoided', 'source_trace_id'],
  },
};

// ── CLI Parsing ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { ...CONFIG };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--sources':
        i++;
        if (i < args.length) {
          const sources = args[i].split(',').map(s => s.trim().toLowerCase());
          if (sources[0] === 'all') {
            parsed.sources = ['agent', 'research', 'stability', 'experience'];
          } else {
            parsed.sources = sources.filter(s => Object.keys(SIGNAL_TYPES).includes(s));
          }
        }
        break;
      case '--output':
        i++;
        if (i < args.length) parsed.outputDir = path.resolve(args[i]);
        break;
      case '--window':
        i++;
        if (i < args.length) {
          const match = args[i].match(/^(\d+)([hms])?$/);
          if (match) {
            const val = parseInt(match[1]);
            const unit = match[2] || 'h';
            parsed.windowHours = unit === 'h' ? val : unit === 'm' ? val / 60 : val / 3600;
          }
        }
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
trace-collector.js — Collect and normalize research traces

Usage: node trace-collector.js [options]

Options:
  --sources all|agent,research,stability,experience
                        Signal types to collect (default: all)
  --output <path>       Output directory (default: traces/)
  --window <N>[h|m|s]   Time window for trace collection (default: 24h)
  --help                Show this help

Examples:
  node trace-collector.js                          # collect all sources, 24h window
  node trace-collector.js --sources agent,stability --window 12h
  node trace-collector.js --output /tmp/traces
`);
}

// ── Trace Generation ───────────────────────────────────────────────────────

/**
 * Generates a trace ID based on content hash for deduplication.
 */
function generateTraceId(content) {
  const hash = crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex').slice(0, 16);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return `trace_${ts}_${hash}`;
}

/**
 * Validates a trace against its signal type schema.
 */
function validateTrace(trace) {
  const schema = SIGNAL_TYPES[trace.signal_type];
  if (!schema) {
    console.error(`Unknown signal type: ${trace.signal_type}`);
    return false;
  }

  for (const field of schema.required) {
    if (!(field in trace) || trace[field] === null || trace[field] === undefined) {
      console.error(`Missing required field "${field}" for signal type "${trace.signal_type}"`);
      return false;
    }
  }

  return true;
}

/**
 * Enriches a trace with computed metadata.
 */
function enrichTrace(trace) {
  // Compute confidence based on data completeness
  const schema = SIGNAL_TYPES[trace.signal_type];
  const requiredFields = schema.required.length;
  const presentFields = schema.required.filter(f => trace[f] !== null && trace[f] !== undefined).length;
  trace.metadata = trace.metadata || {};
  trace.metadata.confidence = presentFields / requiredFields;

  // Add timestamp if missing
  if (!trace.timestamp) {
    trace.timestamp = new Date().toISOString();
  }

  // Add trace_id if missing
  if (!trace.trace_id) {
    trace.trace_id = generateTraceId(trace);
  }

  return trace;
}

/**
 * Collects agent traces from system state.
 */
function collectAgentTraces() {
  const traces = [];
  const now = new Date();

  // Simulate agent trace collection from OpenClaw system state
  // In production, this would read from OpenClaw's internal logs
  console.log('Collecting agent traces...');

  // Example: cron execution trace
  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_agent_cron`,
    timestamp: now.toISOString(),
    source: 'openclaw-cron',
    signal_type: 'agent',
    tool_name: 'cron',
    outcome: 'success',
    latency_ms: 45,
    model_used: 'lmstudio/qwen/qwen3.6-35b-a3b',
    metadata: {
      confidence: 0.9,
      tags: ['cron', 'system'],
    },
    raw_data: {
      cron_job: 'GNW-Cognitive-Cycle',
      duration_ms: 45,
      exit_code: 0,
    },
  });

  return traces;
}

/**
 * Collects research traces from arXiv and research outputs.
 */
function collectResearchTraces() {
  const traces = [];
  const now = new Date();

  console.log('Collecting research traces...');

  // In production, this would:
  // 1. Read recent arXiv scan results from research_monitor/
  // 2. Read recent paper downloads from research/papers/
  // 3. Read deep dive outputs from research/deepdive/

  // Placeholder: simulate a research trace from recent scan
  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_research_arxiv`,
    timestamp: now.toISOString(),
    source: 'arxiv-monitor',
    signal_type: 'research',
    title: 'Recent arXiv Scan',
    arxiv_id: 'scan_' + now.toISOString().slice(0, 10),
    authors: ['automated-scan'],
    relevance_score: 0.5,
    key_concepts: ['LLM', 'agents', 'research'],
    domain: 'AI-Research',
    metadata: {
      confidence: 0.7,
      tags: ['arxiv', 'scan'],
    },
    raw_data: {
      papers_scanned: 0, // would be actual count
      papers_downloaded: 0,
      top_picks: [],
    },
  });

  return traces;
}

/**
 * Collects stability traces from system health metrics.
 */
function collectStabilityTraces() {
  const traces = [];
  const now = new Date();

  console.log('Collecting stability traces...');

  // In production, this would:
  // 1. Read memory usage
  // 2. Read disk usage
  // 3. Read gateway health
  // 4. Read cron status

  // Placeholder: simulate stability traces
  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_stability_memory`,
    timestamp: now.toISOString(),
    source: 'system-health',
    signal_type: 'stability',
    metric_name: 'memory_usage',
    value: 0.85, // 85% used
    baseline: 0.70,
    delta: 0.15,
    trend: 'stable',
    severity: 'info',
    unit: 'percentage',
    metadata: {
      confidence: 0.95,
      tags: ['memory', 'system'],
    },
    raw_data: {
      total_gb: 64,
      used_gb: 54.4,
      free_gb: 9.6,
    },
  });

  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_stability_storage`,
    timestamp: now.toISOString(),
    source: 'system-health',
    signal_type: 'stability',
    metric_name: 'd_drive_usage',
    value: 0.433,
    baseline: 0.873,
    delta: -0.44,
    trend: 'improving',
    severity: 'info',
    unit: 'percentage',
    metadata: {
      confidence: 0.95,
      tags: ['storage', 'system'],
    },
    raw_data: {
      total_gb: 500,
      used_gb: 216.5,
      freed_gb: 218,
    },
  });

  return traces;
}

/**
 * Collects experience traces from learned patterns.
 */
function collectExperienceTraces() {
  const traces = [];
  const now = new Date();

  console.log('Collecting experience traces...');

  // In production, this would:
  // 1. Read from experience store in research/experiences/
  // 2. Read from memory promotions
  // 3. Read from optimized workflow logs

  // Placeholder: no experiences yet
  // traces.push({...});

  return traces;
}

// ── Main Collection Loop ───────────────────────────────────────────────────

/**
 * Collects traces from all configured sources.
 */
function collectAllTraces(config) {
  const allTraces = [];
  const collectorMap = {
    agent: collectAgentTraces,
    research: collectResearchTraces,
    stability: collectStabilityTraces,
    experience: collectExperienceTraces,
  };

  for (const source of config.sources) {
    if (collectorMap[source]) {
      const traces = collectorMap[source]();
      allTraces.push(...traces);
    } else {
      console.error(`Unknown source: ${source}`);
    }
  }

  return allTraces;
}

/**
 * Deduplicates traces by content hash within the dedup window.
 */
function deduplicateTraces(traces, dedupWindowMs = CONFIG.dedupWindowMs) {
  const seen = new Map();
  const now = Date.now();

  return traces.filter(trace => {
    const traceTime = new Date(trace.timestamp).getTime();
    if (now - traceTime > CONFIG.windowHours * 3600 * 1000) {
      // Outside time window
      return false;
    }

    const key = `${trace.signal_type}_${trace.source}_${trace.trace_id}`;
    const lastSeen = seen.get(key);

    if (lastSeen && (now - lastSeen) < dedupWindowMs) {
      // Duplicate within window
      return false;
    }

    seen.set(key, now);
    return true;
  });
}

/**
 * Writes traces to the output directory.
 */
function writeTraces(traces, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const dir = path.join(outputDir, dateStr);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let written = 0;
  for (const trace of traces) {
    const filename = `${trace.trace_id}.json`;
    const filepath = path.join(dir, filename);

    // Don't overwrite existing traces
    if (fs.existsSync(filepath)) {
      continue;
    }

    fs.writeFileSync(filepath, JSON.stringify(trace, null, 2));
    written++;
  }

  return written;
}

// ── Entry Point ────────────────────────────────────────────────────────────

function main() {
  const config = parseArgs(process.argv);

  console.log(`\nTrace Collector — ${new Date().toISOString()}`);
  console.log(`Sources: ${config.sources.join(', ')}`);
  console.log(`Window: ${config.windowHours}h`);
  console.log(`Output: ${config.outputDir}\n`);

  // Collect traces
  const rawTraces = collectAllTraces(config);
  console.log(`\nCollected ${rawTraces.length} raw traces`);

  // Deduplicate
  const dedupedTraces = deduplicateTraces(rawTraces);
  console.log(`After dedup: ${dedupedTraces.length} traces`);

  // Validate and enrich
  const validTraces = dedupedTraces.filter(t => validateTrace(t));
  const enrichedTraces = validTraces.map(t => enrichTrace(t));
  console.log(`Valid: ${enrichedTraces.length} traces`);

  // Write to disk
  const written = writeTraces(enrichedTraces, config.outputDir);
  console.log(`Written: ${written} traces\n`);

  // Summary
  const byType = {};
  for (const trace of enrichedTraces) {
    byType[trace.signal_type] = (byType[trace.signal_type] || 0) + 1;
  }
  console.log('By type:');
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }

  // Update GRAO state with collection timestamp
  updateGrAoState();

  console.log('\nDone.');
}

/**
 * Updates GRAO state with latest trace collection info.
 */
function updateGrAoState() {
  if (!fs.existsSync(GRAO_STATE)) {
    fs.writeFileSync(GRAO_STATE, JSON.stringify({
      loop_id: 'grao_state',
      last_cycle: new Date().toISOString(),
      cycle_count: 0,
      active_gradients: [],
      research_priorities: [],
      health_metrics: {},
      configuration: {
        gradient_threshold: 0.50,
        proposal_confidence_min: 0.60,
        trace_retention_days: 90,
        gradient_retention_days: 30,
      },
    }, null, 2));
    return;
  }

  const state = JSON.parse(fs.readFileSync(GRAO_STATE, 'utf8'));
  state.last_trace_collection = new Date().toISOString();
  fs.writeFileSync(GRAO_STATE, JSON.stringify(state, null, 2));
}

// ── Run ────────────────────────────────────────────────────────────────────

main();
