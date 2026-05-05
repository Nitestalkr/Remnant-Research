# GRAO Loop Specification

## Overview

The GRAO (Gradient-Driven Research Optimization) loop is the core optimization cycle that uses computed gradients to drive research direction. Each loop iteration processes traces, computes gradients, evaluates proposals, and updates research priorities.

## Loop Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Trace Input │────▶│ Gradient     │────▶│ Proposal     │
│  (traces/)  │     │ Derivation   │     │ Evaluation   │
└─────────────┘     └──────────────┘     └─────────────┘
                            │                    │
                            ▼                    ▼
                     ┌──────────────┐     ┌─────────────┐
                     │ Gradient     │────▶│ Proposal     │
                     │ Storage      │     │ Generation   │
                     └──────────────┘     └─────────────┘
                            │                    │
                            ▼                    ▼
                     ┌──────────────┐     ┌─────────────┐
                     │ Report       │◀────│ Proposal     │
                     │ Generation   │     │ Execution    │
                     └──────────────┘     └─────────────┘
```

## Loop Steps

### Step 1: Trace Ingestion
- Load all new traces from `traces/` since last cycle
- Deduplicate by content hash
- Classify by signal type (agent, research, stability, experience)
- Compute initial relevance scores

### Step 2: Pattern Analysis
- Cluster traces by signal type and content similarity
- Identify recurring patterns within each cluster
- Compute pattern strength (consistency across traces)
- Apply temporal decay to older traces

### Step 3: Gradient Computation
- For each pattern cluster, compute directional gradient
- Apply signal weighting from routing rules
- Compute magnitude from pattern strength and signal count
- Determine temporal factor (accelerating/stable/decaying)

### Step 4: Gradient Storage
- Store computed gradients in `gradients/`
- Update gradient decay rates
- Archive gradients older than 30 days if no longer relevant

### Step 5: Proposal Evaluation
- Load pending proposals from `proposals/`
- Cross-reference with new gradients
- Update proposal confidence based on gradient alignment
- Activate proposals with confidence ≥ 0.60
- Reject proposals where gradient support has decayed below 0.30

### Step 6: Proposal Generation
- Check if any gradient exceeds generation threshold (0.50)
- Verify novelty against existing proposals
- Generate proposal JSON for high-confidence gradients
- Route to `proposals/` with status "pending"

### Step 7: Research Direction Update
- Compute aggregate research direction from top gradients
- Update GRAO state with new priorities
- Log direction changes for trend tracking

### Step 8: Report Generation
- Compile cycle summary
- Compute system health metrics
- Generate gradient state snapshot
- Write report to `reports/`

### Step 9: Cleanup
- Archive old traces (90+ days)
- Compress archived data
- Update retention metadata

## Loop Scheduling

| Mode | Interval | Trigger |
|------|----------|---------|
| Standard | Every 30 minutes | Cron job |
| Boredom-triggered | Every 15 minutes | Boredom score ≥ 0.50 |
| Manual | On-demand | User request |
| Post-event | Immediate | System event (stability breach, etc.) |

## State Persistence

GRAO loop state is stored in `grao/` as JSON:
```json
{
  "loop_id": "grao_state",
  "last_cycle": "ISO-8601",
  "cycle_count": N,
  "active_gradients": [],
  "research_priorities": [],
  "health_metrics": {},
  "configuration": {
    "gradient_threshold": 0.50,
    "proposal_confidence_min": 0.60,
    "trace_retention_days": 90,
    "gradient_retention_days": 30
  }
}
```

## Experiment Integration

GRAO experiments are tracked in `grao/experiments/`. Each experiment:
1. Overrides one or more configuration parameters
2. Runs for N cycles
3. Compares results against baseline
4. Writes outcome to experiment JSON
