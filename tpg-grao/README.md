# TPG-GRAO — Gradient-Driven Research Optimization

## Overview

**TPG** (Tensor Processing Graph) + **GRAO** (Gradient-Driven Research Optimization) is a self-improving research framework that treats research direction as an optimization problem. It collects execution traces, computes directional gradients from pattern analysis, and uses those gradients to generate proposals that steer the system toward high-impact research areas.

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Traces** | Raw execution records — agent actions, outcomes, metadata |
| **Gradients** | Directional signals derived from patterns across traces |
| **TPG** | The processing graph that routes and transforms signals |
| **GRAO** | The optimization loop that uses gradients to drive research direction |
| **Experiences** | Proven optimization patterns with quantified impact |
| **Proposals** | Actionable research directions generated from strong gradients |

---

## Current Status

| Metric | Value |
|--------|-------|
| **Phase** | Phase 5 — Exploration validated + breakout protocols |
| **GRAO Round** | 42 (2026-05-15) |
| **Success Ratio** | 90.1% cumulative (128 success, 7 failure, 3 insufficient_data, 5 exploration) |
| **Round 42** | 7 success, 10 failure (exploration mode) |
| **Total Traces** | 142 |
| **Experiences** | 7 proven patterns |
| **Consecutive Policy Rounds** | 21 → exploration activated |
| **Saturation Status** | ✅ Exploration mode active (round 42) — breakout confirmed |
| **Exploration Count** | 16 exploration proposals generated |
| **Active Proposals** | 10 exploration proposals applied (2026-05-15) |
| **Failure Count** | 10 (round 42; cumulative 7) |
| **Trace Sources** | 7 types (agent, research, stability, experience, external_api, deployment, user_interaction) |
| **Known Patterns** | 40 |
| **GNW Cycles** | 118+ (boredom scan, self-initiation active) |
| **System State** | Healthy idle — 5-agent deployment, dual comms (Discord+Telegram), GRAO exploration mode |

### Success Ratio Progression (by round number)

```
Round 13 (2026-04-25):  47.4%  ← High failure rate (trace metadata issues)
Round 20 (2026-04-26):  65.5%  ← Upward trend established
Round 31 (2026-04-27):  93.1%  ← Peak — 7 experiences, 7 clusters
Round 33 (2026-04-30):  89.0%  ← 33 consecutive reinforcement rounds
Round 38 (2026-04-28):  83.3%  ← Trace quality stabilizing
Round 39 (2026-05-04):  92.7%  ← Jump from 83.3%; saturation detected
Round 40 (2026-05-10):  90.1%  ← Exploration gradients generated (128 success, 7 failure, 3 insufficient_data, 5 exploration)
Round 41 (2026-05-11):  100%  ← Exploration mode validated
Round 42 (2026-05-15):  7/10 success (exploration mode — 10 active proposals) ← Breakout confirmed
```

> **Note:** Round 38's timestamp (April 28) predates Round 33 (April 30) due to a scheduling gap in the cron pipeline. Round numbers reflect loop iteration sequence, not calendar order.

---

## Repository Structure

```
tpg-grao/
├── README.md                  # This file
├── tpg/                       # Tensor Processing Graph
│   ├── README.md
│   ├── architecture.md        # TPG data flow and signal types
│   └── routing/
│       ├── README.md
│       └── ROUTING-IMPL.md    # Routing rules and implementation
├── grao/                      # GRAO optimization loop
│   ├── README.md              # Loop overview, live run history, next steps
│   ├── LOOP-SPEC.md           # 9-step loop architecture and scheduling
│   ├── STATE-MANAGEMENT.md    # State schema, update protocol, recovery
│   ├── EXPERIMENT-FRAMEWORK.md # Experiment types, lifecycle, safety
│   ├── gradient-derivation.md # Full gradient computation methodology
│   ├── loops/                 # GRAO cycle logs (round_N_YYYY-MM-DD.json)
│   └── experiments/           # Validated experiment records
├── traces/                    # Raw research traces (date-partitioned)
├── gradients/                 # Computed gradients
├── proposals/                 # Generated research proposals
├── reports/                   # GRAO cycle trend reports
└── scripts/                   # Pipeline tooling
    ├── README.md              # Script documentation and quick-start
    ├── trace-collector.js     # Collect and normalize traces
    ├── gradient-deriver.js    # Compute gradients from traces
    ├── proposal-generator.js  # Generate proposals from gradients
    └── grao-retriever.js      # Analyze loop history for trends
```

---

## How It Works

```
Raw Traces → Collector → Pattern Analysis → Gradient Derivation
                                                    │
                                                    ▼
                                          Gradient Clustering
                                                    │
                                                    ▼
                                          Proposal Generation
                                                    │
                                                    ▼
                                          Execute → Capture Results
                                                    │
                                                    ▼
                                          Experience Store (if success)
                                                    │
                                                    └──→ Next Cycle
```

1. **Collect traces** — Agent actions, tool calls, research outputs, system health events
2. **Derive gradients** — Pattern analysis across trace clusters produces directional signals
3. **Cluster gradients** — Related gradients group into research directions
4. **Generate proposals** — High-confidence gradients (≥ 0.50) become actionable proposals
5. **Execute and capture** — Proposals are applied; outcomes recorded as new traces
6. **Build experiences** — Verified successful patterns enter the experience store
7. **Repeat** — Each cycle feeds the next with richer data

---

## Proven Experiments (Experience Store)

| Experiment | Type | Impact | Confidence |
|------------|------|--------|------------|
| Model switch → qwen3.6-35b-a3b | model_change | +80% | 0.95 |
| Cross-agent Telegram coordination | coordination_pattern | +80% | 0.90 |
| GNW night activity stabilization | temporal_pattern | +75% | 0.85 |
| GNW Phase 5 cognitive cycle activation | cognitive_cycle | +70% | 0.85 |
| Timeout policy (900s for TPG-GRAO cron) | config_change | +60% | 0.90 |
| Trace metadata compliance (100%) | metadata_compliance | +30% | 0.95 |
| Tool description accuracy | description_update | +15% | 0.80 |

---

## Current Phase: Exploration (Implemented + Breakout)

Exploration mode validated and breakout protocols active (round 42, 2026-05-15):

1. ✅ **Saturation detection** — 21 consecutive reinforcement rounds → breakthrough
2. ✅ **Exploration gradients** — 5 validated types (cross-cluster, non-reinforcement, trace-source, weight-redistribution, cluster-merging)
3. ✅ **Exploration proposal priority** — Exploration=high during saturation
4. ✅ **Failure remediation** — insufficient_data category + synthetic trace filtering
5. ✅ **Trace source expansion** — 7 types, 40+ known patterns
6. ✅ **Breakout mechanism** — 16 exploration proposals generated, 10 active
7. ✅ **Policy saturation gap confirmed** — 42+ consecutive reinforcement-only rounds detected
8. ✅ **Breakout protocol written** — policy-saturation-breakout.md (detection, forced trigger, area generation)

**Active proposals (2026-05-15):**
- Cross-Cluster Resource Fusion Protocol
- Multi-Source Research Pipeline Expansion
- Adaptive Benchmark Cycle Framework
- Dynamic Cron Priority Engine
- Trace Quality & Coverage Matrix

**Current status:** Exploration mode active with breakout protocols. System needs new optimization area exploration to avoid re-saturation. GNW boredom scan (cycle 118+) protecting system health. Next: validate breakout outcomes over rounds 43-45.

**IGNITION-level gap:** Policy saturation confirmed (42+ consecutive reinforcement-only rounds, 0 exploration proposals until breakout). Breakout mechanism operational but needs continuous monitoring.

---

## Key Documentation

| Document | Location | Description |
|----------|----------|-------------|
| GRAO Loop Overview | `grao/README.md` | Live run history, cycle diagram, saturation status |
| Loop Specification | `grao/LOOP-SPEC.md` | 9-step loop, scheduling, state persistence |
| State Management | `grao/STATE-MANAGEMENT.md` | State schema, update protocol, recovery |
| Experiment Framework | `grao/EXPERIMENT-FRAMEWORK.md` | A/B tests, lifecycle, safety constraints |
| Gradient Methodology | `grao/gradient-derivation.md` | Full computation methodology with live data |
| TPG Architecture | `tpg/architecture.md` | Signal types and data flow |
| Routing Rules | `tpg/routing/ROUTING-IMPL.md` | How signals route through TPG |
| Script Reference | `scripts/README.md` | Usage, quick-start, design principles |

---

*Remnant Research — TPG-GRAO: gradient-driven research optimization.*
