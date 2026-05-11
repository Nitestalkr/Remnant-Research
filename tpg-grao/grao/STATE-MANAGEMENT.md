# GRAO Loop State Management

## Overview

The GRAO loop state is the persistent memory of the optimization system. It tracks cycle history, active gradients, research priorities, and system health across iterations.

## State File

Location: `grao/grao-state.json`

## State Schema

```json
{
  "loop_id": "grao_state",
  "version": "1.0",
  "last_cycle": "ISO-8601",
  "last_trace_collection": "ISO-8601",
  "last_gradient_computation": "ISO-8601",
  "last_proposal_generation": "ISO-8601",
  "cycle_count": N,
  "active_gradients": [
    {
      "id": "grad_YYYY-MM-DD_type_hash",
      "direction": "research_domain",
      "magnitude": 0.0,
      "type": "directional|magnitude|temporal",
      "last_updated": "ISO-8601",
      "decay_rate": 0.02
    }
  ],
  "research_priorities": [
    {
      "priority": "high|medium|low",
      "direction": "research_domain",
      "source_gradient": "grad_id",
      "confidence": 0.0,
      "since": "ISO-8601"
    }
  ],
  "health_metrics": {
    "memory_integrity": 0.0,
    "cron_stability": 0.0,
    "agent_performance": 0.0,
    "research_quality": 0.0
  },
  "configuration": {
    "gradient_threshold": 0.50,
    "proposal_confidence_min": 0.60,
    "trace_retention_days": 90,
    "gradient_retention_days": 30,
    "max_active_gradients": 20,
    "max_active_proposals": 10,
    "decay_rate_daily": 0.02
  },
  "cycle_history": [
    {
      "cycle_number": N,
      "timestamp": "ISO-8601",
      "traces_collected": N,
      "gradients_computed": N,
      "proposals_generated": N,
      "proposals_activated": N,
      "proposals_rejected": N
    }
  ],
  "experiment_registry": [
    {
      "experiment_id": "exp_YYYY-MM-DD_NNN",
      "name": "experiment_name",
      "status": "active|completed|abandoned",
      "started": "ISO-8601",
      "parameters": {},
      "baseline": {}
    }
  ]
}
```

## State Update Protocol

### When to Update

| Event | State Updates |
|-------|--------------|
| Trace collection | `last_trace_collection`, `health_metrics.memory_integrity` |
| Gradient computation | `active_gradients` (add/update/decay), `last_gradient_computation` |
| Proposal generation | `research_priorities` (add/update), `last_proposal_generation` |
| Cycle completion | `cycle_count`, `cycle_history` (append), `last_cycle` |
| Proposal activation | `research_priorities` (update priority) |
| Proposal rejection | `research_priorities` (remove) |

### Gradient Decay

Active gradients decay daily:

```
new_magnitude = magnitude × (1 - decay_rate_daily)
```

Gradients below 0.10 after decay are removed from `active_gradients`.

### Priority Management

Research priorities are derived from active gradients:

1. Sort active gradients by magnitude (descending)
2. Take top N (max_active_proposals) as priorities
3. Assign priority level based on magnitude:
   - ≥ 0.8: high
   - ≥ 0.5: medium
   - < 0.5: low
4. Update `since` timestamp when priority changes

## State Persistence

- Written atomically (write to temp file, then rename)
- Backed up on each cycle completion
- Compressed after 30 days

## State Recovery

If state file is corrupted:

1. Load last known good state from backup
2. If no backup exists, initialize fresh state
3. Log recovery event to cycle history
4. Continue operation with recovered state

---

## Current System State (2026-05-11)

### Health Metrics Snapshot

| Metric | Value | Notes |
|--------|-------|-------|
| memory_integrity | 1.0 | 110 cognitive cycles complete, zero data loss |
| cron_stability | 1.0 | All cron jobs operational, boredom scan cycle active |
| agent_performance | 0.7 | 5-agent Telegram infrastructure deployed (Andi, Randi2, CB, Claude, Zero) |
| research_quality | 0.65 | 42 GRAO rounds completed, integration improving |

### Active Gradients

- **multi-agent systems** — magnitude ~0.45 (reinforcing, 15+ rounds)
- **agent safety** — magnitude ~0.35 (accelerating)
- **MoE+long context** — magnitude ~0.30 (stable)
- **KV cache breakthroughs** — magnitude ~0.25 (decaying)
- **autonomous coding** — magnitude ~0.20 (stable)
- **self-evolution mechanisms** — magnitude ~0.15 (new, emerging)

### Research Priorities

1. **High:** GRAO→GNW direct feedback validation (experience→drive-weight updates)
2. **Medium:** Cross-agent stability testing (Phase 6)
3. **Medium:** Drive health monitoring automation
4. **Low:** Convergence monitoring infrastructure

### Cycle History Summary

- Total GRAO rounds: 42 (round_42_2026-05-11 is latest)
- GRAO progression: r39→r42 (success ratio 83.3%→92.7%→100%)
- Policy saturation concern still active (cycles 97-109)
- Reinforcement-only mode detected in recent rounds
- Latest trace collection: 2026-05-11
- Latest gradient computation: 2026-05-11
- Proposals generated: 10+ today (prop_2026-05-11 series)
- Proposals activated: via agent workflow integration

### Configuration Notes

- gradient_threshold: 0.50 (no change)
- proposal_confidence_min: 0.60 (no change)
- trace_retention_days: 90 (no change)
- gradient_retention_days: 30 (no change)
- max_active_gradients: 20 (no change)
- decay_rate_daily: 0.02 (no change)

### Integration Status

GNW→GRAO traces: ✅ operational (110 cycles of trace data)
GRAO→GNW drive updates: 🟡 designed, pending real-agent validation
GRAO→GNW cron config: ✅ operational (proposal-generator.js active)
GRAO loop health: ✅ healthy (42 rounds, ~93% plateau)

### Stale Data Inventory

- round_13 (17d stale): early loop data, low relevance
- round_20 (15d stale): early loop data, low relevance
- round_38 (13d stale): intermediate loop data
- round_33 (11d stale): intermediate loop data
- exp_2026-04-23 series (18d stale): early experiments
- EXPERIMENT-FRAMEWORK.md (6d stale): foundational doc
- SIGNAL-RECONCILIATION.md (6d stale): TPG foundational
- architecture.md (6d stale): TPG foundational
- gradient-derivation.md (6d stale): GRAO foundational

---

*Remnant Research — GRAO state management.*
