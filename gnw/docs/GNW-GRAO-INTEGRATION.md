# GNW ↔ GRAO Integration — Formal Feedback Loop

## Overview

GNW (Goals/Neural/Work) and GRAO (Gradient-Driven Research Optimization) are designed as a closed feedback loop. GNW generates traces through agent operation; GRAO derives gradients and proposals from those traces. The trace-generation and proposal pipeline is operational, while direct experience/proposal-driven GNW drive-weight updates remain a designed path pending fuller real-agent validation.

## The Feedback Loop

```
GNW Operation ──→ Traces ──→ GRAO Trace Collection
                                          │
                                          ▼
                                    Gradient Derivation
                                          │
                                          ▼
                                    Experience Store
                                          │
                                          ▼
                                    Proposal Generation
                                          │
                                          ▼
                          ┌───────────────┴───────────────┐
                          │                               │
                  Update GNW                          Update GNW
                  Drive Weights                       Cron Config
                          │                               │
                          ▼                               ▼
                  GNW Cognitive Cycle            GNW Cron Jobs
                          │                               │
                          └───────────────┬───────────────┘
                                          │
                                          ▼
                                  GNW Agent Operation
                                          │
                                          └──────────────→ (loop)
```

## Data Flow Details

### GNW → GRAO (Trace Generation)

GNW produces traces through every cognitive cycle:

| Trace Source | What Gets Traced | GRAO Receives |
|-------------|-----------------|---------------|
| Cron jobs | Job name, duration, outcome | type=cron, source=GNW |
| Tool calls | Tool name, input, result | type=tool_call, source=agent |
| Drive decisions | Winning drive, scores, action | type=drive_decision, source=GNW |
| User interactions | Message, response, quality | type=user_interaction, source=external |
| System health | RAM, disk, stability | type=system_health, source=monitor |

**Trace format:** JSON with fields `type`, `source`, `target`, `action`, `latency_ms`, `result`, `impact_score`.

### GRAO → GNW (Proposal Application)

GRAO produces proposals that update GNW:

| Proposal Type | What It Updates | Example |
|--------------|-----------------|---------|
| Reinforcement | Drive weights, thresholds | "Maintain current model policy" |
| Optimization | Cron config, thresholds | "Increase timeout for npx jobs" |
| Exploration | Drive weights (curiosity boost) | "Explore new model for task X" |
| Investigation | Safety thresholds | "Investigate trace collector gap" |

**Application mechanism:** Proposals are delivered via OpenClaw cron payload → agent processes proposal → updates GNW state files.

## Integration Status

| Direction | Status | Details |
|-----------|--------|---------|
| GNW → GRAO (traces) | ✅ Operational | Traces collected from all GNW sources (cron, tool calls, drive decisions, user interactions, system health) |
| GRAO gradient derivation | ✅ Operational | 42 rounds of gradient computation (r13→r42), ~93% plateau success ratio |
| GRAO → GNW (proposals) | ✅ Operational | Proposals generated via cron payload, applied through agent workflows |
| Experience → Drive weights | 🟡 Designed | Schema defined, real-agent testing in progress (5-agent deployment provides richer trace data) |
| Proposal → Drive weights | 🟡 Designed | Schema defined, real-agent testing in progress |
| GRAO pipeline health | ✅ Healthy | 42+ rounds, reinforcement-only mode active, policy saturation concern monitored |

> **Note:** The GNW→GRAO half is fully operational with 108+ cycles of trace data. The GRAO→GNW feedback path for direct experience/proposal → drive-weight updates is designed but not yet validated through real-agent testing. Current 5-agent deployment with dual comms (Discord+Telegram) provides richer trace diversity for future validation.

### GRAO Progression (r39→r42)

| Round | Success Ratio | Mode | Key Finding |
|-------|--------------|------|-------------|
| r39 | 83.3% | Mixed | 10 failure gradients identified |
| r40 | 92.7% | Reinforcement-only | Policy saturation concern |
| r41 | 100% | Reinforcement-only | Stable plateau |
| r42 | 100% | Reinforcement-only | Consistent |

> Policy saturation (pure reinforcement, no exploration) detected in r40+. This is a known risk — the loop may converge to suboptimal fixed point without exploration pressure.

## Drive Weight Update Mechanism (Design)

When GRAO produces a proposal that affects GNW drive weights:

1. **GRAO computes expected improvement** for each drive affected
2. **Proposal includes weight delta:** `{ "curiosity": +0.05, "safety": +0.02 }`
3. **GNW applies delta** as context modulation for the next cycle
4. **GNW logs the update** in cycle log with GRAO proposal ID
5. **Next cycle** uses updated weights for drive activation

**Weight delta bounds:**
- Maximum single-cycle delta: ±0.10 per drive
- Maximum cumulative delta: ±0.20 per drive (clamped)
- Safety drive: never decreased below base weight (0.20)

## Experience Retrieval → Drive Activation

When GRAO retrieves experiences relevant to GNW's current context:

1. **GRAO queries experience store** for relevant patterns
2. **Experiences with impact > 0.50** are fed to GNW as context signals
3. **GNW adds experience impact** to the relevant drive's raw score
4. **Example:** `exp_model_switch` (impact +80%) → boosts Competence drive

**Experience → Drive mapping:**

| Experience Type | Drive Boosted | Mechanism |
|----------------|---------------|-----------|
| Model optimization | Competence | Direct impact score |
| Trace quality | Curiosity | Novelty index |
| Coordination | Goal-Directed | Milestone proximity |
| Reliability | Safety | System stability |
| Exploration patterns | Curiosity | Research gap count |

## Key Architectural Claims

1. **GNW generates the data, GRAO analyzes it** — GNW is the sensor, GRAO is the analyst
2. **GRAO proposals are actionable** — They update GNW state, not just report findings
3. **The loop is self-reinforcing** — Better traces → better gradients → better proposals → better operation
4. **Experience feedback is the critical path** — Without experience → drive weight updates, the loop is incomplete

## Research Questions

1. **Does GRAO proposal application actually improve GNW behavior?** (pending real-agent testing)
2. **What is the optimal update frequency for drive weights?** (continuous vs. periodic)
3. **Can GRAO detect when GNW is in a degraded mode?** (via trace quality analysis)
4. **How does the loop behave under stress?** (high error rate, low trace quality)

---

*Remnant Research — GNW/GRAO integration architecture.*
