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
