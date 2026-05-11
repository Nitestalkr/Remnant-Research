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
| 38 | 2026-04-28 | 83.3% | 5 | — | Trace quality stable, 60 traces in system |
| 33 | 2026-04-30 | 89.0% | 6 | 33 | 33 consecutive policy rounds (saturation warning) |
| 39 | 2026-05-04 | 92.7% | 7 | 20 | Significant jump from 83.3%, policy saturation detected |

### Trend: Success Ratio Over Time

```
Round 13: 47.4%  ← Early, high failure rate (trace metadata issues)
Round 20: 65.5%  ← Upward trend established (56.5→59.1→54.5→58.3→63.0→65.5%)
Round 31: 93.1%  ← Peak, 7 experiences, 7 pattern clusters
Round 38: 83.3%  ← Further dip, trace quality bottleneck
Round 33: 89.0%  ← Slight dip, 33 consecutive reinforcement rounds
Round 39: 92.7%  ← Significant jump (127/137 success)
Round 40: 90.1%  ← Exploration gradients generated (128 success, 7 failure, 3 insufficient_data, 5 exploration)
```

The success ratio improved dramatically as GRAO expanded from 3→7 experiences. The current plateau at ~93% triggered **policy saturation** detection → exploration mode activated in round 40.

> **Note — metrics glossary:**
> - **Success ratio** = fraction of traces in a round with positive outcomes (e.g., 92.7% = 127/137 traces succeeded). This measures pipeline health.
> - **Experiment impact** = % performance improvement from a specific intervention (e.g., "+80%" for the model switch). This measures the effectiveness of individual optimizations.
> These measure different things and should not be conflated.

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
| **insufficient_data** | magnitude >= 0.7 AND confidence < 0.4 AND traces < 3 | Unresolved — awaiting pattern history |
| **exploration** | saturation detected → generate non-reinforcement gradients | Drive toward unexplored optimization areas |

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
├── README.md              # TPG-GRAO overview and current status
├── grao/                  # GRAO optimization loop
│   ├── README.md          # ← You are here
│   ├── LOOP-SPEC.md       # 9-step loop architecture and scheduling
│   ├── STATE-MANAGEMENT.md     # State schema, update protocol, recovery
│   ├── EXPERIMENT-FRAMEWORK.md # Experiment types, lifecycle, safety
│   ├── gradient-derivation.md  # Gradient computation methodology
│   ├── loops/             # GRAO cycle logs (round_N_YYYY-MM-DD.json)
│   └── experiments/       # Validated experiment records
├── tpg/                   # Tensor Processing Graph
├── traces/                # Raw research traces (date-partitioned)
├── gradients/             # Computed gradients
├── proposals/             # Generated research proposals
├── reports/               # GRAO cycle trend reports
└── scripts/               # Pipeline tooling (4 scripts, published incrementally)
```

---

## 🔮 Current Phase: Exploration Gradients (Implemented)

Exploration gradients are now operational (round 40, 2026-05-10). The system:

1. **Detects saturation** — 15+ consecutive reinforcement rounds, 90%+ success ratio, pure reinforcement
2. **Generates exploration gradients** — 5 unexplored areas during saturation
3. **Prioritizes exploration proposals** — Exploration=high priority during saturation
4. **Deprioritizes reinforcement** — Reinforcement proposals lowered during saturation
5. **Distinguishes behavior** — Loop artifacts clearly separate reinforcement vs exploration

**Current status:** Exploration mode activated (round 40). Failure count reduced 10→7. Next: validate exploration behavior over subsequent rounds (Monday May 11 GRAO run).

---

## 📚 Additional Documentation

- **LOOP-SPEC.md** — Full GRAO loop architecture (9 steps, scheduling, state persistence)
- **STATE-MANAGEMENT.md** — GRAO loop state schema, update protocol, recovery
- **EXPERIMENT-FRAMEWORK.md** — Experiment types, lifecycle, safety constraints
- **gradient-derivation.md** — Gradient computation methodology

---

## 🛠️ Tooling

All GRAO scripts are in `scripts/`:

| Script | Purpose |
|--------|---------|
| `trace-collector.js` | Collect/normalize traces from all signal sources |
| `gradient-deriver.js` | Compute gradients from trace patterns |
| `proposal-generator.js` | Generate proposals from strong gradients |
| `grao-retriever.js` | Analyze loop history for trends |

Usage: `node <script>.js --help` for full options.

---

## 📊 Current System State (Cycle 105 — 2026-05-11)

### GRAO Pipeline Health

- **Active cycles:** 105+ GNW boredom scan cycles
- **Loop rounds:** 42 active (round_41, round_42 from May 11)
- **Success ratio:** ~93% plateau → exploration mode active (round 40+)
- **Gradients computed:** 5 active gradient categories (deployment, research, agent, external_api, stability)
- **Proposals generated:** 20+ proposals from May 11 traces
- **Traces collected:** 6 trace types active (agent cron, research arxiv, deployment restart, deployment agent, stability storage, stability memory, external_api paperclip, external_api nostr)

### Integration with GNW Boredom Scan

The GRAO pipeline feeds the GNW boredom scan's stale-item scoring:

- **Research traces** → novelty scoring for stale docs
- **Agent traces** → system health gradient computation
- **Deployment traces** → infrastructure gradient signals
- **Stability traces** → drive health gradient computation
- **External API traces** → paperclip/nostr gradient signals

### Active Gradients (May 11)

| Gradient | Source | Status |
|----------|--------|--------|
| deployment | grad_2026-05-11_deployment | Active |
| research | grad_2026-05-11_research | Active |
| agent | grad_2026-05-11_agent | Active |
| external_api | grad_2026-05-11_external_api | Active |
| stability | grad_2026-05-11_stability | Active |

### GRAO Loop Configuration

- **Loop schedule:** 30-min cycle (boredom scan)
- **Saturation threshold:** 15+ consecutive reinforcement rounds
- **Exploration trigger:** 90%+ success ratio plateau
- **Gradient formula:** (impact × frequency × persistence) / normalization
- **Policy saturation detection:** Active (round 40+)
- **Exploration mode:** Active (round 40+)

### Recent GRAO Activity (Cycles 97-105)

- **Cycle 97:** 8 new research citations added (REFERENCES.md)
- **Cycle 98:** paperclip/doc/SPEC.md updated with current system state
- **Cycle 99:** TEST-DRIVE-OSCILLATION.md updated with 10-cycle drive history
- **Cycle 100:** OPENCLAW_AGENT_PROTOCOL updated with 5-agent deployment state
- **Cycle 101:** PHASE-1-4-SUMMARIES.md updated with Phase 6 context
- **Cycle 102:** attention-router.md updated with cycle 102 stale scan
- **Cycle 103:** TEST-CONFLICT-CONVERGENCE.md updated with 103+ cycle convergence history
- **Cycle 104:** SAFETY-THREAT-MODEL.md updated with 0-veto-event audit (103 cycles)
- **Cycle 105:** tpg/README.md updated with current system state section

### Key Design Decisions

1. **Exploration mode** activated at round 40 (policy saturation detected)
2. **5-agent Telegram infrastructure** operational (Andi, Randi2, CB, Claude, Zero)
3. **Dual comms** (Discord + Telegram) for all agents
4. **Self-initiation pattern** dominant (boredom 1.0 → stale doc refresh)
5. **No forced work** principle maintained (idle system, no user requests)
6. **GRAO traces** partitioned by date for clean analysis
7. **Gradient categories** expanded to 5 (deployment, research, agent, external_api, stability)

---

*Remnant Research — GRAO: directional signal for autonomous research.*
