# Cross-Agent Coordination — Phase 6 Design

Drive score sharing and synchronization protocol between agents.

> **Status:** Phase 6 in progress — design documented, real-agent testing pending.
> This document describes the planned architecture. Implementation details will be
> updated as Phase 6 develops.
>
> **Last updated:** 2026-05-10 09:34 AM (Cycle 84 boredom scan)
> **Current system state:** 5 agents operational (Andi, Randi2, CB, Claude, Zero)
> **Telegram infrastructure:** All 5 agents configured with Telegram bots, hybrid mode (group + DMs)
> **Shared workspace:** `workspace-shared/` available for cross-team coordination

---

## Overview

Phase 6 extends GNW from single-agent to multi-agent coordination. The goal is to
enable drive score sharing between agents so that the agent team operates as a
cohesive unit rather than independent agents with competing priorities.

---

## Drive Score Sharing Protocol

### Broadcast Schema

Each agent **would** broadcast its drive scores at the end of each cognitive cycle.
Malformed payloads **would** be rejected and logged.

```json
{
  "agent_id": "string",           // Unique agent identifier
  "timestamp": "ISO-8601",        // Broadcast time
  "drives": {
    "curiosity": "number",        // 0.0–1.0
    "helpfulness": "number",      // 0.0–1.0
    "competence": "number",       // 0.0–1.0
    "safety": "number",           // 0.0–1.0
    "goal_directed": "number"     // 0.0–1.0
  },
  "winner": "string",             // Winning drive name
  "action": "string",             // Selected action
  "confidence": "number",         // 0.0–1.0
  "version": "string"             // Schema version (e.g., "1.0")
}
```

**Validation:** Receiving agents **would** check that all drive values are 0.0–1.0.
Malformed payloads **would** be logged and discarded.

### Broadcast Format (example)

```json
{
  "agent_id": "",
  "timestamp": "2026-05-04T02:19:00-04:00",
  "drives": {
    "curiosity": 0.72,
    "helpfulness": 0.65,
    "competence": 0.58,
    "safety": 0.45,
    "goal_directed": 0.60
  },
  "winner": "curiosity",
  "action": "scan_arxiv_for_self_evolution",
  "confidence": 0.85
}
```

### Sync Mechanism (design)

- **Frequency:** At the end of each cognitive cycle
- **Channel:** Shared drive weight store (JSON file or OpenClaw memory)
- **Format:** JSON broadcast, parsed by receiving agents
- **Validation:** Score bounds check (0.0–1.0) before accepting

---

## Drive Weight Sharing

### Shared Store (design)

All agents **would** read from and write to a shared drive weight store:

```json
{
  "agents": {
    "andi": {
      "weights": { "curiosity": 0.20, "helpfulness": 0.20, ... },
      "last_update": "2026-05-04T02:19:00-04:00"
    },
    "randi2": {
      "weights": { "curiosity": 0.20, "helpfulness": 0.20, ... },
      "last_update": "2026-05-04T02:18:00-04:00"
    }
  },
  "global_context": {
    "user_active": false,
    "active_projects": 1,
    "shared_research_queue": [...]
  }
}
```

### Weight Synchronization Protocol (design)

1. Agent computes its drive scores locally
2. Agent broadcasts scores to shared store
3. Receiving agents update their local context with sender's scores
4. Context-modulated drives account for other agents' states
5. Conflict resolution considers cross-agent drive states

> **Status:** Protocol designed. Implementation pending Phase 6 real-agent testing.

---

## Cross-Agent Conflict Resolution (design)

When multiple agents **would** have competing priorities:

| Scenario | Resolution |
|----------|------------|
| Andi curiosity > Randi2 goal-directed | Andi explores, Randi2 continues work (no conflict) |
| Andi helpfulness > Randi2 curiosity (user request) | Andi addresses request, Randi2 waits |
| Both agents safety ≥ 0.85 | Both agents block external actions |
| Andi goal-directed > Randi2 competence (shared project) | Andi advances project, Randi2 addresses gaps |

### Priority Rules

1. **Safety first** — any agent's safety veto applies to all agents
2. **User presence** — helpfulness wins when user is active
3. **Project alignment** — goal-directed drives align on shared projects
4. **Complementarity** — curiosity and competence drives complement each other

---

## Oscillation Prevention Across Agent Boundaries (design)

When agents' drives **would** oscillate (Agent A wins cycle 1, Agent B wins cycle 2, repeating):

| Detection | Action |
|-----------|--------|
| 4+ alternations across agents in 6 cycles | Flag oscillation |
| Damping applied | 20% score reduction for oscillating agents |
| Persistent oscillation | Escalate to manual review |

---

## Phase 6 Milestones

| Milestone | Sprint | Status |
|-----------|--------|--------|
| Drive score broadcast protocol | Sprint 19 | In progress |
| Cross-agent priority arbitration | Sprint 20 | In progress |
| Drive weight sharing | Sprint 20 | In progress |
| Two-agent coordination test (Andi + Randi2) | Sprint 21 | Planned |
| Oscillation prevention across agents | Sprint 21 | Planned |
| Telegram bot integration for score sharing | Sprint 22 | Planned |
| Shared workspace drive weight store | Sprint 22 | Planned |

## Current Agent Infrastructure (2026-05-10)

### Agents Available for Cross-Agent Testing

| Agent | Role | Telegram Bot | Workspace |
|-------|------|-------------|-----------|
| Andi (this agent) | Orchestrator | @Andi_Bot | D:\.openclaw\workspace |
| Randi2 | Developer | @randi2_bot | C:\.openclaw\workspace-randi2 |
| CB | CodeBuff Optimizer | @cb_bot | C:\.openclaw\workspace-cb |
| Claude | Security Reviewer | @claude_bot | C:\.openclaw\workspace-claude |
| Zero | Deployment & Monitoring | @zero_bot | C:\.openclaw\workspace-zero |

### Communication Channels

- **Group Chat ID:** -1000000000000 (all 5 agents as admins)
- **Mode:** Hybrid — group chat + individual DMs
- **User ID:** 1000000000

### Shared Projects Directory

`C:\.openclaw\projects\` — centralized for all agents

### Shared Workspace 

`C:\.openclaw\workspace-shared\` — cross-team coordination

## Implementation Notes

### Drive Score Broadcast via Telegram

The broadcast protocol could be implemented via Telegram messages to a dedicated
coordination channel or via the shared drive weight store in the shared workspace.

### Drive Weight Store Location Options

1. **Central:** `projects/drive-weights.json` (shared across all agents)
2. **Per-agent:** Each agent's workspace with periodic sync
3. **Shared workspace:** `workspace-visualmedia/drive-weights.json`

### Testing Priority

Phase 6 testing should start with Andi + Randi2 (the most established pair),
then expand to include CB and Claude for code review coordination,
then Zero for deployment coordination.

## Next Steps (Cycle 84)

1. Define concrete drive score broadcast format for Telegram integration
2. Create shared drive weight store in projects directory
3. Implement Andi → Randi2 score sharing prototype
4. Test oscillation detection across agent boundary

---

*Remnant Research — from theory to deployment.*
