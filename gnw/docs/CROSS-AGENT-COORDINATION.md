# Cross-Agent Coordination — Phase 6 Stub

Drive score sharing and synchronization protocol between agents.

> **Status:** Phase 6 in progress. This document describes the planned architecture.
> Implementation details will be updated as Phase 6 develops.

---

## Overview

Phase 6 extends GNW from single-agent to multi-agent coordination. The goal is to
enable drive score sharing between agents so that the agent team operates as a
cohesive unit rather than independent agents with competing priorities.

---

## Drive Score Sharing Protocol

### Broadcast Format

Each agent broadcasts its drive scores at the end of each cognitive cycle:

```json
{
  "agent_id": "andi",
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

### Sync Mechanism

- **Frequency:** At the end of each cognitive cycle
- **Channel:** Shared drive weight store (JSON file or OpenClaw memory)
- **Format:** JSON broadcast, parsed by receiving agents
- **Validation:** Score bounds check (0.0–1.0) before accepting

---

## Drive Weight Sharing

### Shared Store

All agents read from and write to a shared drive weight store:

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

### Weight Synchronization Protocol

1. Agent computes its drive scores locally
2. Agent broadcasts scores to shared store
3. Receiving agents update their local context with sender's scores
4. Context-modulated drives account for other agents' states
5. Conflict resolution considers cross-agent drive states

---

## Cross-Agent Conflict Resolution

When multiple agents have competing priorities:

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

## Oscillation Prevention Across Agent Boundaries

When agents' drives oscillate (Agent A wins cycle 1, Agent B wins cycle 2, repeating):

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

---

*Remnant Research — from theory to deployment.*
