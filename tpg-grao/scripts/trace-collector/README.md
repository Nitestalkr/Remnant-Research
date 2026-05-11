# Trace Collector — Customization Guide

## Overview

The trace-collector.js script has a **modular trace source plugin system**. Each trace source checks its own environment variables, silently skips if unavailable, and records traces if available.

**Key design:** No errors or warnings when a channel/node isn't configured. Just silently skipped.

## Adding Your Own Trace Sources

### Step 1: Define Environment Variables

Add your config to `gateway.env.vars` (in `openclaw.json`) or your system environment:

```json
{
  "YOUR_CHANNEL_TOKEN": "your_token_here",
  "YOUR_CHANNEL_CONFIG": "your_config_here"
}
```

### Step 2: Add to CONFIG Section

In `trace-collector.js`, add your source to the CONFIG object:

```javascript
const CONFIG = {
  channels: {
    // ... existing channels
    myCustomChannel: {
      requiredEnv: ['MY_CUSTOM_TOKEN', 'MY_CUSTOM_CONFIG'],
      description: 'My custom channel'
    }
  },
  nodes: {
    // ... existing nodes
    myCustomNode: {
      requiredEnv: ['MY_NODE_HOST', 'MY_NODE_PORT'],
      description: 'My custom node'
    }
  }
};
```

### Step 3: Add Collection Function

Follow the pattern below:

#### For Communication Channels:

```javascript
function collectMyCustomChannelTraces() {
  if (!hasEnvVars(CONFIG.channels.myCustomChannel.requiredEnv)) {
    return null; // silently skip
  }
  
  // Your collection logic here
  // Check your channel's health/status
  
  const trace = {
    type: 'channel_health',
    source: 'myCustomChannel',
    target: 'your_target',
    action: 'health_check',
    input: 'uptime_check',
    output: 'active', // or 'inactive' based on check
    success: true, // or false based on check
    latency_ms: 0,
    metrics: {
      channel: 'myCustomChannel',
      your_config: 'your_value',
      last_activity: new Date().toISOString()
    }
  };
  
  return [recordTrace(trace)];
}
```

#### For Node Health Checks:

```javascript
function collectMyCustomNodeTraces() {
  if (!hasEnvVars(CONFIG.nodes.myCustomNode.requiredEnv)) {
    return null; // silently skip
  }
  
  const host = process.env.MY_NODE_HOST || 'localhost';
  const port = parseInt(process.env.MY_NODE_PORT) || 8332;
  
  // Your health check logic here
  // HTTP endpoint, Docker status, RPC call, etc.
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    // Your check logic (HTTP request, Docker check, etc.)
    // On success:
    const trace = {
      type: 'node_health',
      source: 'myCustomNode',
      target: `${host}:${port}`,
      action: 'health_check',
      input: 'uptime_check',
      output: 'active',
      success: true,
      latency_ms: Date.now() - startTime,
      metrics: {
        node: 'myCustomNode',
        host: host,
        port: port,
        response_time: Date.now() - startTime,
        last_activity: new Date().toISOString()
      }
    };
    
    recordTrace(trace);
    resolve([trace]);
  });
}
```

### Step 4: Add to collectAllTraces()

In the `collectAllTraces()` function, add your source:

```javascript
// Communication channels
const channelFunctions = {
  // ... existing channels
  myCustomChannel: collectMyCustomChannelTraces
};

// Node health checks
const nodeFunctions = {
  // ... existing nodes
  myCustomNode: collectMyCustomNodeTraces
};
```

### Step 5: Document

Add your source to this README under "Available Sources".

## Example: Adding Your Own Discord Setup

```bash
# Set env vars:
export DISCORD_BOT_TOKEN="your_discord_bot_token"
export DISCORD_GUILD_ID="your_discord_guild_id"

# The collectDiscordTraces() function will automatically:
# 1. Check env vars are set
# 2. Record a health trace
# 3. Skip silently if not set
```

## Example: Adding Your Own Bitcoin Node

```bash
# Set env vars:
export BITCOIN_RPC_HOST="your_bitcoin_host"
export BITCOIN_RPC_PORT="8332"
export BITCOIN_RPC_AUTH="your_basic_auth_token"

# The collectBitcoinTraces() function will automatically:
# 1. Check env vars are set
# 2. Send RPC getblockchaininfo
# 3. Record health trace
# 4. Skip silently if not set
```

## Example: Adding Your Own Umbrel Node

```bash
# Set env vars:
export UMBREL_HOST="your_umbrel_host"
export UMBREL_PORT="80"

# The collectUmbrelTraces() function will automatically:
# 1. Check env vars are set
# 2. HTTP check /health endpoint
# 3. Record health trace
# 4. Skip silently if not set
```

## Available Sources (Current)

### Communication Channels

| Channel | Env Vars | Description |
|---------|----------|-------------|
| telegram | TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_IDS | Telegram bot + chat IDs |
| discord | DISCORD_BOT_TOKEN, DISCORD_GUILD_ID | Discord bot + guild ID |
| signal | SIGNAL_CONTACT_LIST | Signal contacts |
| whatsapp | WHATSAPP_SESSION_PATH | WhatsApp session file |
| nostr | NOSTR_RELAYS, NOSTR_NPUB | Nostr relays + npub |

### Node Health Checks

| Node | Env Vars | Description |
|------|----------|-------------|
| umbrel | UMBREL_HOST, UMBREL_PORT | Umbrel micro node (Docker service) |
| bitcoin | BITCOIN_RPC_HOST, BITCOIN_RPC_PORT, BITCOIN_RPC_AUTH | Bitcoin node (RPC endpoint) |
| paperclip | PAPERCLIP_API_URL | Paperclip company API |

## Trace Types

| Type | Directory | Use Case |
|------|-----------|----------|
| channel_health | traces/channels/{source} | Communication channel health |
| node_health | traces/nodes/{source} | Node/service health checks |
| external_api | traces/external_api | API endpoint health |
| agent | traces/agent/{source} | Agent actions |
| research | traces/research | Research activities |
| cron | traces/cron | Cron job execution |
| deployment | traces/deployment | Deployment lifecycle |
| tool_call | traces/tools/{target} | Tool usage |
| handoff | traces/handoffs | Agent handoffs |
| zap | traces/zap | Zap events |

## Running

```bash
# Manual record:
node trace-collector.js --record --type node_health --source umbrel --action health_check --success true

# Auto-collect all configured sources:
node trace-collector.js --collect-all

# List existing traces:
node trace-collector.js --collect
```

## Customization Tips

1. **Don't hardcode values** — use env vars so others can adapt
2. **Silent skip** — if env vars aren't set, return null (no errors)
3. **Generic patterns** — use standard health check patterns (HTTP endpoint, Docker status, RPC call)
4. **Metrics-rich traces** — include response_time, host, port, etc. for meaningful cluster diversity
5. **Document your setup** — add to this README so others know how to adapt

## Cluster Diversity

The trace-collector's goal is to produce **meaningful cluster diversity** in GRAO:

- **User Interaction Cluster** — Telegram response patterns, idle vs active detection
- **Deployment Lifecycle Cluster** — Agent activation/deactivation patterns, gateway restart effects
- **External API Health Cluster** — Paperclip API uptime, Nostr relay health, arXiv monitoring
- **Node Health Cluster** — Umbrel/Bitcoin node uptime, Docker container status

Each source type contributes to different clusters. Add more sources to increase cluster diversity.

---

*Remnant Research — Trace Collector: modular trace source plugin system.*
