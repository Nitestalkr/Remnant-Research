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
| Exploration triggered | **Stale round files refresh** (see Stale Data Refresh Protocol below) |

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

### Stale Data Refresh Protocol

**When:** Every time exploration proposals are generated (saturation triggered)

**Purpose:** Ensure the GNW Boredom Scan reads current GRAO state, not stale snapshots from outdated round files.

**Steps:**
1. Read current `grao-state.json` saturation status
2. Update all stale round files (`round_31`, `round_38`, `round_33`, etc.) with:
   - `saturation.exploration_triggered` current value
   - `saturation.exploration_count` current value
   - `proposal_types` current values (reinforcement vs exploration)
   - `last_exploration_timestamp` current timestamp
   - `refreshed_at` timestamp indicating this is a refreshed snapshot
   - `notes` indicating this is a stale file refreshed with current state
3. Write `current_vs_stale_YYYY-MM-DD.json` in `loops/`:
   - Compare current `grao-state.json` values vs stale round file values
   - Note any discrepancies
   - Confirm data freshness
4. Log refresh event in cycle history

**Rule:** Every exploration trigger MUST refresh stale round files. This prevents stale data from creating false saturation signals in the boredom scan.

**Previous Issue:** Stale round files (round_31, 14d stale) still showed "0 exploration proposals generated" after exploration was triggered. The boredom scan read these stale files and reported false saturation. Fixed: TPG-GRAO now refreshes stale files on every exploration trigger.

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
GRAO loop health: ✅ operational but ⚠️ saturation active (42 rounds)

### Policy Saturation Analysis (Cycle 117 → 118 — 2026-05-12)

| Finding | Before Fix | After Fix | Severity |
|---------|-----------|-----------|----------|
| Consecutive reinforcement-only rounds | 42+ (r31→r42) | 36 (grao-state.json) | ⚠️ |
| Exploration proposals generated | 0 (stale round_31) | 15 (grao-state.json) | ✅ resolved |
| Success gradient ratio | 100% (r42) vs 93.1% (r31) | 100% (r42) | ⚠️ |
| Policy saturation warning (r31) | Still active | ✅ refreshed with current state | ✅ resolved |
| Routing targets include meta-optimization | Yes, but no exploration proposals | Yes + 15 exploration proposals | ✅ resolved |

**Cross-reference round_31 vs current state:**
- Round 31 (14d stale, BEFORE fix): "Approaching policy saturation — all strong patterns already codified"
- Round 31 (AFTER fix): Refreshed with current grao-state.json saturation status
- grao-state.json: exploration_triggered=true, exploration_count=15, proposal_types={reinforcement:36, exploration:15}
- Gap resolved: stale data no longer creates false saturation signals

**Breakout Mechanism Status:**
1. saturation_detection added to grao-state.json ✅ DONE
2. GRAO loop spec updated with saturation detection step ✅ DONE (Step 10)
3. Exploration proposal override mechanism implemented ✅ DONE
4. First exploration cycle completed ✅ DONE (15 proposals generated)
5. Results monitored ✅ DONE (system stable, exploration mode active)

**Stale Data Fix (2026-05-12):**
- Boredom scan now reads grao-state.json directly (source=grao-state.json)
- TPG-GRAO refreshes stale round files on every exploration trigger
- cycle log format updated with graos_saturation field
- False saturation signals eliminated

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
- cross-ref_31_vs_42: ✅ written (cycle 117 analysis)

---

*Remnant Research — GRAO state management.*
