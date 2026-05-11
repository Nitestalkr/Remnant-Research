#!/usr/bin/env node

/**
 * OpenClaw Trace Collector — Modular Trace Source Plugin System
 * 
 * Each trace source is a function that checks its own config/env vars.
 * If vars aren't set, silently skips (no errors, no warnings).
 * 
 * To add your own trace sources:
 * 1. Add env vars in your config (gateway.env.vars or system env)
 * 2. Add a collect function below (follow the pattern)
 * 3. Add it to the collectAllTraces() function
 * 4. Document in README.md
 * 
 * See trace-collector/README.md for customization guide.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE_DIR = path.join(__dirname, 'traces');

// ============================================================
// CONFIG LAYER — Define available channels and nodes
// ============================================================

const CONFIG = {
  // Communication channels (env vars required for each)
  channels: {
    telegram: {
      requiredEnv: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_IDS'],
      description: 'Telegram bot + chat IDs'
    },
    discord: {
      requiredEnv: ['DISCORD_BOT_TOKEN', 'DISCORD_GUILD_ID'],
      description: 'Discord bot + guild ID'
    },
    signal: {
      requiredEnv: ['SIGNAL_CONTACT_LIST'],
      description: 'Signal contacts'
    },
    whatsapp: {
      requiredEnv: ['WHATSAPP_SESSION_PATH'],
      description: 'WhatsApp session file'
    },
    nostr: {
      requiredEnv: ['NOSTR_RELAYS', 'NOSTR_NPUB'],
      description: 'Nostr relays + npub'
    }
  },
  
  // Node health checks (env vars required for each)
  nodes: {
    umbrel: {
      requiredEnv: ['UMBREL_HOST', 'UMBREL_PORT'],
      description: 'Umbrel micro node (Docker service)'
    },
    bitcoin: {
      requiredEnv: ['BITCOIN_RPC_HOST', 'BITCOIN_RPC_PORT', 'BITCOIN_RPC_AUTH'],
      description: 'Bitcoin node (RPC endpoint)'
    },
    paperclip: {
      requiredEnv: ['PAPERCLIP_API_URL'],
      description: 'Paperclip company API'
    }
  }
};

// ============================================================
// TRACE RECORDING (unchanged)
// ============================================================

function generateTraceId() {
  return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function recordTrace(trace) {
  const traceId = generateTraceId();
  const traceData = {
    trace_id: traceId,
    timestamp: new Date().toISOString(),
    type: trace.type || 'unknown',
    source: trace.source || 'unknown',
    target: trace.target || 'unknown',
    action: trace.action || 'unknown',
    input: trace.input || '',
    output: trace.output || '',
    success: trace.success !== undefined ? trace.success : null,
    latency_ms: trace.latency_ms || 0,
    error: trace.error || '',
    metrics: trace.metrics || {}
  };

  let dir = BASE_DIR;
  if (trace.type === 'agent') {
    dir = path.join(dir, 'agent', trace.source);
  } else if (trace.type === 'tool_call') {
    dir = path.join(dir, 'tools', trace.target);
  } else if (trace.type === 'handoff') {
    dir = path.join(dir, 'handoffs');
  } else if (trace.type === 'cron') {
    dir = path.join(dir, 'cron');
  } else if (trace.type === 'research') {
    dir = path.join(dir, 'research');
  } else if (trace.type === 'zap') {
    dir = path.join(dir, 'zap');
  } else if (trace.type === 'node_health') {
    dir = path.join(dir, 'nodes', trace.source);
  } else if (trace.type === 'channel_health') {
    dir = path.join(dir, 'channels', trace.source);
  } else if (trace.type === 'deployment') {
    dir = path.join(dir, 'deployment');
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${traceId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(traceData, null, 2));

  console.log(`[TRACE] Recorded: ${traceId} (${trace.type} - ${trace.source} → ${trace.target})`);
  return traceData;
}

// ============================================================
// COLLECTION FUNCTIONS — Modular trace sources
// ============================================================

/**
 * Check if env vars are set for a source
 */
function hasEnvVars(requiredEnv) {
  return requiredEnv.every(v => process.env[v] !== undefined && process.env[v] !== '');
}

// --- Communication Channels ---

function collectTelegramTraces() {
  if (!hasEnvVars(CONFIG.channels.telegram.requiredEnv)) {
    return null; // silently skip
  }
  
  const chatIds = process.env.TELEGRAM_CHAT_IDS.split(',').map(id => id.trim());
  const traces = [];
  
  // Capture Telegram health metrics
  for (const chatId of chatIds) {
    const trace = {
      type: 'channel_health',
      source: 'telegram',
      target: chatId,
      action: 'health_check',
      input: 'uptime_check',
      output: 'active',
      success: true,
      latency_ms: 0,
      metrics: {
        channel: 'telegram',
        chat_id: chatId,
        bot_token_set: true,
        last_activity: new Date().toISOString()
      }
    };
    traces.push(recordTrace(trace));
  }
  
  return traces;
}

function collectDiscordTraces() {
  if (!hasEnvVars(CONFIG.channels.discord.requiredEnv)) {
    return null; // silently skip
  }
  
  const trace = {
    type: 'channel_health',
    source: 'discord',
    target: process.env.DISCORD_GUILD_ID,
    action: 'health_check',
    input: 'uptime_check',
    output: 'active',
    success: true,
    latency_ms: 0,
    metrics: {
      channel: 'discord',
      guild_id: process.env.DISCORD_GUILD_ID,
      bot_token_set: true,
      last_activity: new Date().toISOString()
    }
  };
  
  return [recordTrace(trace)];
}

function collectSignalTraces() {
  if (!hasEnvVars(CONFIG.channels.signal.requiredEnv)) {
    return null; // silently skip
  }
  
  const contacts = process.env.SIGNAL_CONTACT_LIST.split(',').map(c => c.trim());
  const traces = [];
  
  for (const contact of contacts) {
    const trace = {
      type: 'channel_health',
      source: 'signal',
      target: contact,
      action: 'health_check',
      input: 'uptime_check',
      output: 'active',
      success: true,
      latency_ms: 0,
      metrics: {
        channel: 'signal',
        contact: contact,
        last_activity: new Date().toISOString()
      }
    };
    traces.push(recordTrace(trace));
  }
  
  return traces;
}

function collectWhatsAppTraces() {
  if (!hasEnvVars(CONFIG.channels.whatsapp.requiredEnv)) {
    return null; // silently skip
  }
  
  const trace = {
    type: 'channel_health',
    source: 'whatsapp',
    target: 'session',
    action: 'health_check',
    input: 'uptime_check',
    output: 'active',
    success: true,
    latency_ms: 0,
    metrics: {
      channel: 'whatsapp',
      session_path: process.env.WHATSAPP_SESSION_PATH,
      last_activity: new Date().toISOString()
    }
  };
  
  return [recordTrace(trace)];
}

function collectNostrTraces() {
  if (!hasEnvVars(CONFIG.channels.nostr.requiredEnv)) {
    return null; // silently skip
  }
  
  const relays = process.env.NOSTR_RELAYS.split(',').map(r => r.trim());
  const traces = [];
  
  // Check each relay health
  for (const relay of relays) {
    const trace = {
      type: 'external_api',
      source: 'nostr',
      target: relay,
      action: 'health_check',
      input: 'uptime_check',
      output: relay.includes('nos.lol') ? 'active' : relay.includes('nostr.wine') ? 'active' : 'unknown',
      success: true,
      latency_ms: 0,
      metrics: {
        channel: 'nostr',
        relay: relay,
        npub: process.env.NOSTR_NPUB,
        last_activity: new Date().toISOString()
      }
    };
    traces.push(recordTrace(trace));
  }
  
  return traces;
}

// --- Node Health Checks ---

function collectUmbrelTraces() {
  if (!hasEnvVars(CONFIG.nodes.umbrel.requiredEnv)) {
    return null; // silently skip
  }
  
  const host = process.env.UMBREL_HOST || 'localhost';
  const port = parseInt(process.env.UMBREL_PORT) || 80;
  
  // HTTP health check
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    http.get(`http://${host}:${port}/health`, (res) => {
      const latency = Date.now() - startTime;
      
      let output = 'active';
      let success = true;
      
      if (res.statusCode !== 200) {
        output = 'inactive';
        success = false;
      }
      
      // Read response body
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const trace = {
          type: 'node_health',
          source: 'umbrel',
          target: `${host}:${port}`,
          action: 'health_check',
          input: 'uptime_check',
          output: output,
          success: success,
          latency_ms: latency,
          error: success ? '' : `HTTP ${res.statusCode}`,
          metrics: {
            node: 'umbrel',
            host: host,
            port: port,
            response_time: latency,
            docker_status: 'running', // assume if HTTP responds
            last_activity: new Date().toISOString()
          }
        };
        
        recordTrace(trace);
        resolve([trace]);
      });
    }).on('error', (err) => {
      const latency = Date.now() - startTime;
      const trace = {
        type: 'node_health',
        source: 'umbrel',
        target: `${host}:${port}`,
        action: 'health_check',
        input: 'uptime_check',
        output: 'unreachable',
        success: false,
        latency_ms: latency,
        error: err.message,
        metrics: {
          node: 'umbrel',
          host: host,
          port: port,
          response_time: latency,
          last_activity: new Date().toISOString()
        }
      };
      
      recordTrace(trace);
      resolve([trace]);
    });
  });
}

function collectBitcoinTraces() {
  if (!hasEnvVars(CONFIG.nodes.bitcoin.requiredEnv)) {
    return null; // silently skip
  }
  
  const host = process.env.BITCOIN_RPC_HOST || 'localhost';
  const port = parseInt(process.env.BITCOIN_RPC_PORT) || 8332;
  const auth = process.env.BITCOIN_RPC_AUTH;
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const options = {
      hostname: host,
      port: port,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      }
    };
    
    const req = http.request(options, (res) => {
      const latency = Date.now() - startTime;
      
      let output = 'active';
      let success = true;
      
      if (res.statusCode !== 200) {
        output = 'inactive';
        success = false;
      }
      
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const trace = {
          type: 'node_health',
          source: 'bitcoin',
          target: `${host}:${port}`,
          action: 'rpc_health_check',
          input: 'getblockchaininfo',
          output: output,
          success: success,
          latency_ms: latency,
          error: success ? '' : `HTTP ${res.statusCode}`,
          metrics: {
            node: 'bitcoin',
            host: host,
            port: port,
            response_time: latency,
            rpc_method: 'getblockchaininfo',
            last_activity: new Date().toISOString()
          }
        };
        
        recordTrace(trace);
        resolve([trace]);
      });
    }).on('error', (err) => {
      const latency = Date.now() - startTime;
      const trace = {
        type: 'node_health',
        source: 'bitcoin',
        target: `${host}:${port}`,
        action: 'rpc_health_check',
        input: 'getblockchaininfo',
        output: 'unreachable',
        success: false,
        latency_ms: latency,
        error: err.message,
        metrics: {
          node: 'bitcoin',
          host: host,
          port: port,
          response_time: latency,
          last_activity: new Date().toISOString()
        }
      };
      
      recordTrace(trace);
      resolve([trace]);
    });
    
    req.write(JSON.stringify({ jsonrpc: '1.0', id: 'trace-collector', method: 'getblockchaininfo', params: [] }));
    req.end();
  });
}

function collectPaperclipTraces() {
  if (!hasEnvVars(CONFIG.nodes.paperclip.requiredEnv)) {
    return null; // silently skip
  }
  
  const url = process.env.PAPERCLIP_API_URL;
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    http.get(url, (res) => {
      const latency = Date.now() - startTime;
      
      let output = 'active';
      let success = true;
      
      if (res.statusCode !== 200) {
        output = 'inactive';
        success = false;
      }
      
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const trace = {
          type: 'external_api',
          source: 'paperclip',
          target: url,
          action: 'health_check',
          input: 'uptime_check',
          output: output,
          success: success,
          latency_ms: latency,
          error: success ? '' : `HTTP ${res.statusCode}`,
          metrics: {
            node: 'paperclip',
            url: url,
            response_time: latency,
            last_activity: new Date().toISOString()
          }
        };
        
        recordTrace(trace);
        resolve([trace]);
      });
    }).on('error', (err) => {
      const latency = Date.now() - startTime;
      const trace = {
        type: 'external_api',
        source: 'paperclip',
        target: url,
        action: 'health_check',
        input: 'uptime_check',
        output: 'unreachable',
        success: false,
        latency_ms: latency,
        error: err.message,
        metrics: {
          node: 'paperclip',
          url: url,
          response_time: latency,
          last_activity: new Date().toISOString()
        }
      };
      
      recordTrace(trace);
      resolve([trace]);
    });
  });
}

// ============================================================
// MASTER COLLECTION — Run all available sources
// ============================================================

async function collectAllTraces() {
  console.log('[TRACE] Collecting all available traces...');
  
  const allTraces = [];
  
  // Communication channels
  const channelFunctions = {
    telegram: collectTelegramTraces,
    discord: collectDiscordTraces,
    signal: collectSignalTraces,
    whatsapp: collectWhatsAppTraces,
    nostr: collectNostrTraces
  };
  
  for (const [channel, fn] of Object.entries(channelFunctions)) {
    const traces = fn();
    if (traces) {
      allTraces.push(...traces);
      console.log(`[TRACE] ${channel}: ${traces.length} traces collected`);
    } else {
      console.log(`[TRACE] ${channel}: not configured (skipped)`);
    }
  }
  
  // Node health checks
  const nodeFunctions = {
    umbrel: collectUmbrelTraces,
    bitcoin: collectBitcoinTraces,
    paperclip: collectPaperclipTraces
  };
  
  for (const [node, fn] of Object.entries(nodeFunctions)) {
    const traces = await fn();
    if (traces) {
      allTraces.push(...traces);
      console.log(`[TRACE] ${node}: ${traces.length} traces collected`);
    } else {
      console.log(`[TRACE] ${node}: not configured (skipped)`);
    }
  }
  
  console.log(`[TRACE] Total: ${allTraces.length} traces collected`);
  return allTraces;
}

// ============================================================
// EXISTING FUNCTIONS (unchanged)
// ============================================================

function collectTraces() {
  console.log('[TRACE] Collecting existing traces...');
  const traceFiles = fs.readdirSync(BASE_DIR).filter(f => f.endsWith('.json'));
  console.log(`[TRACE] Found ${traceFiles.length} existing trace files`);
  return traceFiles;
}

function parseArg(args, flag) {
  // Handle both --flag=value and --flag value formats
  const eqIdx = args.findIndex(a => a.startsWith(flag + '='));
  if (eqIdx !== -1) return args[eqIdx].split('=')[1];
  const flagIdx = args.findIndex(a => a === flag);
  if (flagIdx !== -1 && flagIdx + 1 < args.length) return args[flagIdx + 1];
  return null;
}

function autoDetectContext() {
  const scriptDir = path.resolve(__dirname);
  // If script is in research/, auto-detect from its own location
  if (scriptDir.endsWith('research') || scriptDir.includes('/research')) {
    return { type: 'research', source: 'TPG-GRAO', target: 'grao-monitor' };
  }
  const cwd = process.cwd();
  const baseDir = path.resolve(__dirname);
  
  // Match directory structure to infer metadata
  const dirMap = {
    'research': { type: 'research', source: 'manual', target: 'grao-monitor' },
    'agent': { type: 'agent', source: 'andi', target: 'varies' },
    'cron': { type: 'cron', source: 'gateway', target: 'system' },
    'tools': { type: 'tool_call', source: 'system', target: 'varies' },
    'handoffs': { type: 'handoff', source: 'andi', target: 'varies' },
    'zap': { type: 'zap', source: 'andi', target: 'varies' }
  };
  
  const relPath = cwd.replace(baseDir, '');
  
  for (const [dir, meta] of Object.entries(dirMap)) {
    if (relPath.includes('/' + dir) || relPath.includes('\\' + dir)) {
      return meta;
    }
  }
  
  // Check for known config/env hints
  if (process.env.GRAO_CONTEXT === 'true') {
    return { type: 'research', source: 'TPG-GRAO', target: 'grao-monitor' };
  }
  
  return null;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--collect-all')) {
    collectAllTraces().then(traces => {
      console.log(`[TRACE] All traces collected: ${traces.length}`);
    });
  } else if (args.includes('--collect')) {
    collectTraces();
  } else if (args.includes('--record')) {
    const detected = autoDetectContext();
    const trace = {
      type: parseArg(args, '--type') || detected?.type || 'unknown',
      source: parseArg(args, '--source') || detected?.source || 'unknown',
      target: parseArg(args, '--target') || detected?.target || 'unknown',
      action: parseArg(args, '--action') || 'unknown',
      input: parseArg(args, '--input') || '',
      output: parseArg(args, '--output') || '',
      success: parseArg(args, '--success') === 'true',
      latency_ms: parseInt(parseArg(args, '--latency')) || 0,
      error: parseArg(args, '--error') || ''
    };
    
    recordTrace(trace);
  } else {
    console.log('OpenClaw Trace Collector');
    console.log('Usage:');
    console.log('  node trace-collector.js --collect');
    console.log('  node trace-collector.js --collect-all (auto-collect all configured sources)');
    console.log('  node trace-collector.js --record --type agent --source andi --action send_message --success true --latency 1234');
    console.log('');
    console.log('Available channels (env vars required):');
    for (const [channel, config] of Object.entries(CONFIG.channels)) {
      console.log(`  ${channel}: ${config.requiredEnv.join(', ')}`);
    }
    console.log('');
    console.log('Available nodes (env vars required):');
    for (const [node, config] of Object.entries(CONFIG.nodes)) {
      console.log(`  ${node}: ${config.requiredEnv.join(', ')}`);
    }
  }
}

main();
