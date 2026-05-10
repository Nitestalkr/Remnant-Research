#!/usr/bin/env node
/**
 * trace-collector.js — Collects and normalizes raw traces from all signal sources.
 *
 * Usage:
 *   node trace-collector.js [--sources all|agent|research|stability|experience|external_api|deployment|user_interaction]
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
  sources: ['agent', 'research', 'stability', 'experience', 'external_api', 'deployment', 'user_interaction'],
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
  external_api: {
    required: ['timestamp', 'source', 'endpoint', 'status_code'],
    optional: ['response_size', 'latency_ms', 'error', 'retry_count'],
  },
  deployment: {
    required: ['timestamp', 'source', 'event_type', 'target'],
    optional: ['status', 'duration_ms', 'error', 'rollback'],
  },
  user_interaction: {
    required: ['timestamp', 'source', 'action_type', 'context'],
    optional: ['channel', 'message_id', 'response_time_ms', 'sentiment'],
  },
};

// Known source patterns that previously produced unknown metadata
const KNOWN_SOURCE_PATTERNS = {
  'openclaw-cron': { signal_type: 'agent', tool_name: 'cron', outcome: 'success' },
  'openclaw-gateway': { signal_type: 'agent', tool_name: 'gateway', outcome: 'success' },
  'openclaw-sessions': { signal_type: 'agent', tool_name: 'sessions', outcome: 'success' },
  'arxiv-monitor': { signal_type: 'research', arxiv_id: 'scan', title: 'arXiv scan' },
  'system-health': { signal_type: 'stability', metric_name: 'system-metrics' },
  'disk-monitor': { signal_type: 'stability', metric_name: 'disk-usage' },
  'memory-monitor': { signal_type: 'stability', metric_name: 'memory-usage' },
  'nostr-relay': { signal_type: 'external_api', endpoint: 'relay-push' },
  'telegram-bot': { signal_type: 'agent', tool_name: 'telegram' },
  'discord-bot': { signal_type: 'agent', tool_name: 'discord' },
  'paperclip-api': { signal_type: 'external_api', endpoint: 'paperclip-health' },
  'umbrel-services': { signal_type: 'stability', metric_name: 'umbrel-health' },
  'docker-containers': { signal_type: 'stability', metric_name: 'container-status' },
  'file-system': { signal_type: 'stability', metric_name: 'file-operations' },
  'git-operations': { signal_type: 'agent', tool_name: 'git' },
  'node-connect': { signal_type: 'agent', tool_name: 'nodes' },
  'canvas': { signal_type: 'agent', tool_name: 'canvas' },
  'image-generation': { signal_type: 'agent', tool_name: 'image_generate' },
  'pdf-analysis': { signal_type: 'agent', tool_name: 'pdf' },
  'tts': { signal_type: 'agent', tool_name: 'tts' },
  'music-generation': { signal_type: 'agent', tool_name: 'music_generate' },
  'video-generation': { signal_type: 'agent', tool_name: 'video_generate' },
  'web-search': { signal_type: 'agent', tool_name: 'web_search' },
  'web-fetch': { signal_type: 'agent', tool_name: 'web_fetch' },
  'exec-commands': { signal_type: 'agent', tool_name: 'exec' },
  'process-management': { signal_type: 'agent', tool_name: 'process' },
  'cron-jobs': { signal_type: 'agent', tool_name: 'cron' },
  'message-sends': { signal_type: 'agent', tool_name: 'message' },
  'wiki-operations': { signal_type: 'agent', tool_name: 'wiki' },
  'gateway-config': { signal_type: 'agent', tool_name: 'gateway' },
  'agent-activation': { signal_type: 'deployment', event_type: 'agent-onboard' },
  'project-build': { signal_type: 'deployment', event_type: 'build-execution' },
  'system-restart': { signal_type: 'deployment', event_type: 'restart' },
  'user-message': { signal_type: 'user_interaction', action_type: 'incoming' },
  'user-response': { signal_type: 'user_interaction', action_type: 'outgoing' },
  'heartbeat-trigger': { signal_type: 'user_interaction', action_type: 'system-heartbeat' },
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
            parsed.sources = ['agent', 'research', 'stability', 'experience', 'external_api', 'deployment', 'user_interaction'];
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
  --sources all|agent,research,stability,experience,external_api,deployment,user_interaction
                        Signal types to collect (default: all)
  --output <path>       Output directory (default: traces/)
  --window <N>[h|m|s]   Time window for trace collection (default: 24h)
  --help                Show this help

Examples:
  node trace-collector.js                          # collect all 7 sources, 24h window
  node trace-collector.js --sources agent,stability,external_api --window 12h
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

/**
 * Collects external API traces (Nostr relays, Paperclip API, etc).
 * NOTE: Currently placeholder-backed. Would read from real API health/status data in production.
 */
function collectExternalAPITraces() {
  const traces = [];
  const now = new Date();

  console.log('Collecting external API traces (placeholder-backed)...');

  // Nostr relay health
  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_external_api_nostr`,
    timestamp: now.toISOString(),
    source: 'nostr-relay',
    signal_type: 'external_api',
    endpoint: 'relay-push',
    status_code: 200,
    latency_ms: 150,
    metadata: {
      confidence: 0.8,
      tags: ['nostr', 'relay', 'external-api'],
    },
    raw_data: {
      relays: ['nos.lol', 'nostr.wine', 'relay.nostr.info', 'nostr-pub.wellorder.net'],
      unreachable: ['relay.damus.io'],
      messages_pushed: 0,
    },
  });

  // Paperclip API health
  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_external_api_paperclip`,
    timestamp: now.toISOString(),
    source: 'paperclip-api',
    signal_type: 'external_api',
    endpoint: 'paperclip-health',
    status_code: 200,
    latency_ms: 80,
    metadata: {
      confidence: 0.9,
      tags: ['paperclip', 'api', 'health'],
    },
    raw_data: {
      url: 'http://127.0.0.1:3101',
      version: '2026.427.0',
      health: 'ok',
    },
  });

  return traces;
}

/**
 * Collects deployment event traces (agent activation, builds, restarts).
 * NOTE: Currently placeholder-backed. Would read from real deployment event data in production.
 */
function collectDeploymentTraces() {
  const traces = [];
  const now = new Date();

  console.log('Collecting deployment traces (placeholder-backed)...');

  // Agent activation events
  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_deployment_agent`,
    timestamp: now.toISOString(),
    source: 'agent-activation',
    signal_type: 'deployment',
    event_type: 'agent-onboard',
    target: 'dev-team',
    status: 'active',
    metadata: {
      confidence: 0.95,
      tags: ['deployment', 'agents', 'activation'],
    },
    raw_data: {
      agents: ['randi', 'randi2', 'claude', 'cb', 'zero'],
      status: 'all_active',
      activation_date: '2026-05-07',
    },
  });

  // System restart events
  traces.push({
    trace_id: `trace_${now.toISOString().replace(/[:.]/g, '-')}_deployment_restart`,
    timestamp: now.toISOString(),
    source: 'system-restart',
    signal_type: 'deployment',
    event_type: 'restart',
    target: 'gateway',
    status: 'completed',
    metadata: {
      confidence: 0.9,
      tags: ['deployment', 'restart', 'gateway'],
    },
    raw_data: {
      method: 'SIGUSR1',
      reason: 'plugin-config-changes',
      duration_ms: 3000,
    },
  });

  return traces;
}

/**
 * Collects user interaction traces (Telegram messages, etc).
 * NOTE: Currently placeholder-backed. Would read from real message log data in production.
 */
function collectUserInteractionTraces() {
  const traces = [];
  const now = new Date();

  console.log('Collecting user interaction traces (placeholder-backed)...');

  // Placeholder: would read from Telegram/Discord message logs
  // traces.push({...});

  return traces;
}

// ── Trace Source Auto-Detection ────────────────────────────────────────────

/**
 * Auto-detects signal type and fills in required metadata for traces
 * with unknown or incomplete metadata. This addresses Category D failures.
 */
function autoDetectTraceSource(trace) {
  if (!trace.source) return trace;

  const pattern = KNOWN_SOURCE_PATTERNS[trace.source];
  if (!pattern) return trace;

  // Fill in missing required fields
  if (!trace.signal_type) trace.signal_type = pattern.signal_type;
  if (pattern.signal_type === 'agent' && !trace.tool_name) trace.tool_name = pattern.tool_name;
  if (pattern.signal_type === 'research' && !trace.title) trace.title = pattern.title;
  if (pattern.signal_type === 'research' && !trace.arxiv_id) trace.arxiv_id = pattern.arxiv_id;
  if (pattern.signal_type === 'stability' && !trace.metric_name) trace.metric_name = pattern.metric_name;
  if (pattern.signal_type === 'external_api' && !trace.endpoint) trace.endpoint = pattern.endpoint;
  if (pattern.signal_type === 'deployment' && !trace.event_type) trace.event_type = pattern.event_type;
  if (pattern.signal_type === 'user_interaction' && !trace.action_type) trace.action_type = pattern.action_type;
  if (!trace.outcome && pattern.outcome) trace.outcome = pattern.outcome;

  return trace;
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
    external_api: collectExternalAPITraces,
    deployment: collectDeploymentTraces,
    user_interaction: collectUserInteractionTraces,
  };

  for (const source of config.sources) {
    if (collectorMap[source]) {
      const traces = collectorMap[source]();
      allTraces.push(...traces);
    } else {
      console.error(`Unknown source: ${source}`);
    }
  }

  // Auto-detect and fill metadata for traces with unknown source patterns
  const autoDetected = [];
  for (const trace of allTraces) {
    if (!trace.signal_type || !trace.source || trace.outcome === 'unknown') {
      const detected = autoDetectTraceSource(trace);
      if (detected !== trace) {
        autoDetected.push(trace);
      }
    }
  }

  if (autoDetected.length > 0) {
    console.log(`  Auto-detected ${autoDetected.length} traces with unknown metadata`);
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
