# GRAO — Gradient-Driven Research Optimization

> **Directional signal for autonomous research.** GRAO uses computed gradients from research traces to steer research direction, detect saturation, and drive optimization.

---

## 🎯 What GRAO Solves

### The Problem: Autonomous research without direction is random exploration

Most autonomous research systems fall into one of these failure modes:

1. **Random sampling** — Pick a paper/topic at random, process it, repeat. No cumulative direction.
2. **Static priority** — Fixed relevance scores that don't adapt. The "best" paper today stays the "best" paper next month.
3. **Reinforcement loops** — Codify what works, keep reinforcing, never explore new areas. This is **policy saturation** (20+ consecutive rounds with no new optimization).
4. **No feedback** — Research outputs don't feed back into research direction. Each cycle starts from scratch.

### GRAO's Approach: Gradient-based steering

GRAO treats research optimization like gradient descent in ML:

- **Traces** = data points (agent actions, results, context)
- **Gradients** = directional signals (where to push, how hard)
- **TPG routing** = the computation graph (routes signals to appropriate nodes)
- **Proposals** = step directions (what action to take)
- **Experiences** = proven optimization patterns (what worked, quantified)

---

## 🔁 The GRAO Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    GRAO Auto-Evolution Cycle                    │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│  │  Collect │───→│  Derive  │───→│  Analyze │                 │
│  │  Traces  │    │Gradients │    │Clusters  │                 │
│  └──────────┘    └──────────┘    └──────────┘                 │
│       │                   │                   │                │
│       ▼                   ▼                   ▼                │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              Gradient Clustering                      │       │
│  │  Group related gradients → research directions        │       │
│  └─────────────────────────────────────────────────────┘       │
│       │                                                       │
│       ▼                                                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│  │  Propose │───→│ Execute  │───→│ Capture  │                 │
│  │ Actions  │    │ Actions  │    │ Results  │                 │
│  └──────────┘    └──────────┘    └──────────┘                 │
│       │                                                       │
│       ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              New Traces → Next Cycle                  │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              GRAO Experience Store                    │       │
│  │  Proven patterns → experience retrieval →             │       │
│  │  proposal generation → gradient computation           │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step

1. **Collect traces** — Agent actions, results, context, metadata (type/source/target)
2. **Derive gradients** — Compute directional signals from trace patterns
3. **Analyze clusters** — Group related gradients into research directions
4. **Propose actions** — Based on gradient analysis, generate optimization proposals
5. **Execute actions** — Apply proposals to the system
6. **Capture results** — Record outcomes as new traces
7. **Update experiences** — If proposal succeeded, add to GRAO experience store
8. **Repeat** — Next cycle uses updated gradients + new experiences

---

## 📊 Live Run History

### Evolution from Round 13 → Round 39

| Round | Date | Success Ratio | Experiences | Policy Rounds | Key Milestone |
|-------|------|--------------|-------------|---------------|---------------|
| 13 | 2026-04-25 | 47.4% | 3 | 4 | Early stabilization, high failure rate |
| 20 | 2026-04-26 | 65.5% | 3 | 12 | Upward trend established (56.5→65.5%) |
| 31 | 2026-04-27 | 93.1% | 7 | 23 | Pattern clustering comprehensive (7 clusters) |
| 33 | 2026-04-30 | 89.0% | 6 | 33 | 33 consecutive policy rounds (saturation warning) |
| 38 | 2026-04-28 | 83.3% | 5 | — | Trace quality stable, 60 traces in system |
| 39 | 2026-05-04 | 92.7% | 6 | 20 | Significant jump from 83.3%, policy saturation detected |

### Trend: Success Ratio Over Time

```
Round 13: 47.4%  ← Early, high failure rate (trace metadata issues)
Round 20: 65.5%  ← Upward trend established (56.5→59.1→54.5→58.3→63.0→65.5%)
Round 31: 93.1%  ← Peak, 7 experiences, 7 pattern clusters
Round 33: 89.0%  ← Slight dip, 33 consecutive reinforcement rounds
Round 38: 83.3%  ← Further dip, trace quality bottleneck
Round 39: 92.7%  ← Significant jump (127/137 success)
```

The success ratio improved dramatically as GRAO expanded from 3→7 experiences. The current plateau at ~93% suggests **policy saturation** — all strong patterns are codified.

---

## 🧮 Gradient Computation

### Formula

```
gradient_score = (impact × frequency × persistence) / normalization_factor
```

### Signal Weights

| Weight | Description | Range |
|--------|-------------|-------|
| **Impact** | Potential effect of optimization | 0.0–1.0 |
| **Frequency** | How often this pattern occurs | 0.0–1.0 |
| **Persistence** | How long the pattern has been stable | 0.0–1.0 |
| **Normalization** | Total gradient score in the round | Ensures sum = 1.0 |

### Gradient Categorization

| Category | Condition | Action |
|----------|-----------|--------|
| **Success** | gradient_score > threshold AND outcome positive | Reinforce pattern |
| **Failure** | gradient_score > threshold AND outcome negative | Investigate root cause |
| **Warning** | gradient_score > threshold AND outcome trending negative | Monitor closely |
| **High-priority** | gradient_score > high_threshold OR impact > critical | Immediate attention |

### Policy Saturation Detection

When the system detects:
- 15+ consecutive reinforcement-only rounds
- Success ratio plateauing near 90%+
- No new optimization areas explored

→ Generate **exploration gradients** to drive toward unexplored TPG paths.

---

## 📁 Directory Structure

```
tpg-grao/
├── README.md              # This file
├── grao/                  # GRAO optimization loop
│   ├── README.md          # ← You are here
│   ├── gradient-derivation.md  # Gradient computation methodology
│   ├── loops/             # GRAO cycle logs and reports
│   ├── experiments/       # GRAO experiment results
│   ├── proposals/         # Research proposals generated
│   ├── reports/           # GRAO cycle reports
│   └── scripts/           # GRAO tooling
├── tpg/                   # Tensor Processing Graph
├── traces/                # Raw research traces
├── gradients/             # Computed gradients
├── proposals/             # Research proposals generated
└── reports/               # GRAO cycle reports
```

---

## 🔮 Next Phase: Exploration Gradients

The current system is stuck in reinforcement-only mode (20+ consecutive rounds). The next phase of GRAO:

1. **Detect saturation** — Monitor policy round count and success ratio plateau
2. **Generate exploration gradients** — Drive toward unexplored TPG paths
3. **Cross-cluster analysis** — Compare gradients across different TPG clusters
4. **Richer pattern discovery** — Expand GRAO to 10+ experiences for cross-cluster patterns
5. **Non-reinforcement proposals** — Test proposals that explore, not just reinforce

---

*Remnant Research — GRAO: directional signal for autonomous research.*
