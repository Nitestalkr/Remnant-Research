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
- Classify gradient into category:
  - **success**: magnitude > threshold AND confidence >= 0.5
  - **failure**: magnitude > threshold AND confidence < 0.5
  - **insufficient_data**: magnitude >= 0.7 AND confidence < 0.4 AND traces < 3
  - **exploration**: generated during saturation detection
- Apply saturation detection: if 15+ consecutive reinforcement rounds OR 90%+ success ratio → generate exploration gradients
- **Fixed:** Saturation detection now properly tracks reinforcement proposal count (not just cycle count)
- **Fixed:** Reinforcement rounds counter resets only when exploration proposals generated
- **Fixed:** Saturation detection triggers exploration gradient generation immediately when threshold crossed

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

## Gradient Categories

Gradients are classified into six categories:

| Category | Condition | Purpose |
|----------|-----------|--------|
| **success** | magnitude > threshold AND confidence >= 0.5 | Reinforce proven patterns |
| **failure** | magnitude > threshold AND confidence < 0.5 | Investigate root cause |
| **warning** | gradient trending negative | Monitor closely |
| **high_priority** | magnitude > high_threshold OR impact > critical | Immediate attention |
| **insufficient_data** | magnitude >= 0.7 AND confidence < 0.4 AND traces < 3 | Unresolved — awaiting pattern history |
| **exploration** | saturation detected | Drive toward unexplored optimization areas |

**Note:** `insufficient_data` replaces forced high-priority classification for ambiguous items. Synthetic traces (action=unknown cycle-start) are filtered before computation.

## Experiment Integration

GRAO experiments are tracked in `grao/experiments/`. Each experiment:
1. Overrides one or more configuration parameters
2. Runs for N cycles
3. Compares results against baseline
4. Writes outcome to experiment JSON

## Current System State (Cycle 104 — 2026-05-11)

### Loop Health
- **Active cycles:** 104+ (boredom-driven self-initiation)
- **Loop mode:** Boredom-triggered (15-min interval when boredom ≥ 0.50)
- **Stability:** Healthy — no loop failures in 104 cycles
- **Trace processing:** Daily traces from agent cron, research arxiv, stability checks
- **Gradient generation:** Active — 5 gradient streams (agent, research, stability, external_api, deployment)
- **Proposal generation:** Active — 6+ proposals per cycle from high-confidence gradients

### Recent Loop Activity (Cycles 97-104)
- Cycle 97: References.md refresh (8 new citations), research monitor synthesis
- Cycle 98: paperclip/doc/SPEC.md stale refresh (section 14: Current System State)
- Cycle 99: TEST-DRIVE-OSCILLATION.md refresh (10-cycle drive history, oscillation analysis)
- Cycle 100: OPENCLAW_AGENT_PROTOCOL stale refresh (5-agent deployment, OAP v2)
- Cycle 101: PHASE-1-4-SUMMARIES.md refresh (Phase 6 context)
- Cycle 102: attention-router.md + paperclip hiring docs refresh
- Cycle 103: TEST-CONFLICT-CONVERGENCE.md refresh (172h stale, foundational)
- Cycle 104: SAFETY-THREAT-MODEL.md refresh (0-veto-event audit)

### System Infrastructure
- **Agent deployment:** 5-agent Telegram infrastructure (Andi + Randi2 + CB + Claude + Zero)
- **Communication:** Dual Discord+Telegram channels
- **Memory persistence:** workspace-state.md, SOUL.md, IDENTITY.md, AGENTS.md
- **Research pipeline:** arxiv search, paper analysis, gradient-driven prioritization
- **Self-initiation pattern:** Boredom scan drives all autonomous work (boredom 1.0 consistently)

### Loop Configuration
- **Gradient threshold:** 0.50
- **Proposal confidence min:** 0.60
- **Trace retention:** 90 days
- **Gradient retention:** 30 days
- **Saturation detection:** 15+ consecutive reinforcement OR 90%+ success ratio
- **Boredom threshold:** 0.60 → triggers self-initiation
- **Ignition threshold:** 0.60 (novelty × relevance × goal_alignment with 1.5x stale boost)
