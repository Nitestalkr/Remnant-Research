# Remnant Research

> **Note:** This repo is a public research mirror of an actively evolving private/local OpenClaw setup. Some artifacts are reconstructed from prior runs, and executable scripts will be published incrementally as they stabilize.
>
> **From theory to deployment.** Building self-evolving AI agent systems grounded in cognitive science, consciousness research, and gradient-driven optimization.

---

## Platform

**OpenClaw** is the local agent orchestration platform that hosts the live system documented here. It provides the cron infrastructure (scheduled agent turns), memory persistence, tool routing, and multi-agent coordination layer that GNW and GRAO run on top of. OpenClaw is a private, local deployment — this repo mirrors its research artifacts publicly, not the platform itself.

---

## What This Repo Is

Remnant Research documents two connected systems built inside a live OpenClaw-based AI agent:

- **GNW (Goals / Neural / Work)** — a drive-based cognitive architecture that gives an agent internal motivation: when to work, what to work on, and when to stop.
- **GRAO (Gradient-Driven Research Optimization)** — a research loop that turns execution traces, pattern analysis, and proven experiments into directional signals that steer the next cycle of work.

Together they define the closed-loop architecture this project is building toward: **GNW decides what to do → GRAO tracks the results → GRAO produces gradients and proposals → validated feedback informs future GNW behavior → the cycle repeats.**

---

## The Problems

### 1. Autonomous agents lack motivation

Static task routing works until the obvious work runs out. Without an internal drive state, agents tend to:

- **burn out** by endlessly pursuing stale work
- **go idle** when no external input arrives
- **misalign** by optimizing the wrong objective when context shifts

GNW solves this by modeling five cognitive drives as continuous weighted vectors that shift with context.

### 2. Research loops lack directional feedback

Many research systems behave like one-off loops:

- random exploration without a durable directional signal
- static priorities that don't adapt to what was just learned
- outputs that are logged but not converted into steering information

GRAO solves this by computing gradients from trace patterns and using them to generate actionable proposals.

### 3. Cognitive architectures are usually descriptive, not operational

Theories such as GNWT, IIT, RPT, predictive processing, and attention schema theory are rich conceptually, but they are rarely turned into concrete agent control systems. A major part of this repo is closing that translation gap — documenting not just the theory, but the operational design, parameter values, stability tests, and real cycle data.

---

## GNW Framework

### Overview

GNW models internal motivation as a set of interacting cognitive drives: curiosity, helpfulness, competence, safety, and goal-directedness. Each drive is a continuous weighted signal (0.0–1.0) rather than a binary state. The goal is to give an agent a principled internal basis for deciding when to work, what to work on, and when to defer.

### Five Cognitive Drives

| Drive | Trigger Threshold | Veto Power | Half-Life |
|-------|-------------------|------------|-----------|
| **Curiosity** | ≥ 0.50 | No | 6 cycles |
| **Helpfulness** | ≥ 0.70 | No (user override) | 4 cycles |
| **Competence** | ≥ 0.60 | No | 8 cycles |
| **Safety** | ≥ 0.70 (soft), ≥ 0.85 (hard), ≥ 0.95 (emergency) | Yes (veto on external actions) | 2 cycles |
| **Goal-Directed** | ≥ 0.55 | No | 10 cycles |

### 12-Step Cognitive Cycle

The unified cognitive cycle is the core processing loop. Every agent turn — whether user-initiated or self-directed — passes through it:

1. **Input Capture** — Receive external input (user message, cron event, system signal)
2. **Context Load** — Pull relevant memory, workspace state, and active project context
3. **State Assessment** — Evaluate current system state (boredom, resource availability, task queue)
4. **Drive Activation** — Compute raw drive scores based on current state
5. **Drive Modulation** — Apply context modifiers (user presence, safety constraints, project priority)
6. **Conflict Detection** — Identify competing drives and priority overlaps
7. **Conflict Resolution** — Apply priority matrix to resolve drive competition
8. **Action Selection** — Choose the highest-weighted actionable drive
9. **Plan Formation** — Generate a concrete plan for the selected drive
10. **Task Dispatch** — Execute the plan (internal work, sub-agent spawn, tool call)
11. **Result Capture** — Collect outputs, metrics, and side effects
12. **Memory Update** — Write results to memory, update drive weights, log cycle data

### Boredom Trigger

The boredom formula determines when the agent is permitted to self-initiate work:

```
boredom = (traditional + curiosity + self-awareness) / 3 + stale_bonus
```

- Runs every 15 minutes via cron
- Triggers full cognitive cycle when ≥ 0.50
- Suppressed when user is active (floor at 0.30)
- **Key insight:** The system correctly stops forcing work when nothing qualifies ≥ 0.50. Forcing work breaks the model.

### Conflict Resolution

- Priority matrix with 7 context-dependent conditions
- Veto protocol with 3 escalation tiers (soft scrutiny → hard block → emergency)
- Tie-breaking algorithm (recency bias → half-life → base weight)
- Edge case handling for 8 known scenarios

### Stability Tests

Five formal stability checks ensure the framework doesn't enter runaway states:

| Test | What It Checks | Success Criteria |
|------|---------------|------------------|
| **Drive Oscillation** | Detect flip-flop between two drives across consecutive cycles | Resolved within 5 cycles |
| **Drive Score Bounds** | All scores remain within [0.0, 1.0] | No score outside bounds |
| **Boredom Threshold** | Boredom triggers only when appropriate | No false positives/negatives |
| **Conflict Convergence** | Conflict resolution always produces a single winner | ≤ 3 steps |
| **Memory Integrity** | Drive state persistence and recovery | 100% write success, zero data loss |

### GNW Roadmap

| Phase | Status | Focus |
|-------|--------|-------|
| **1: Foundation** | ✅ Complete | Drive architecture, boredom formula, cognitive cycle skeleton |
| **2: Integration** | ✅ Complete | Drive modulation, conflict priority matrix, veto protocol |
| **3: Stabilization** | ✅ Complete | Stability tests, oscillation detection, edge case handling |
| **4: Real Agent Testing** | ✅ Complete | OpenClaw integration, live testing, drive weight calibration |
| **5: Drive Integration** | ✅ Complete | All 5 drives operational, unified cycle, cron infrastructure |
| **6: Cross-Agent Coordination** | 🔄 In Progress | Drive score broadcast, weight sharing, multi-agent synchronization |
| **7: Self-Modifying Drives** | 📋 Planned | Drives learn from success/failure rates, auto-calibration |
| **8: Memory Integration** | 📋 Planned | Cross-session persistence, drive-driven memory consolidation |
| **9: Research Integration** | 📋 Planned | GNW drives inform research priorities, autonomous research loop |
| **10: Multi-Agent Orchestra** | 📋 Planned | Full 5-agent coordination, collective goal-directed behavior |

### Open Questions

1. Optimal drive weight initialization
2. Drive half-life calibration from real cycle data
3. Cross-agent conflict resolution at scale
4. Self-modification safety boundaries
5. Scalability of priority matrix to 10+ agents
6. User feedback integration into drive weights

---

## TPG-GRAO Framework

### Overview

TPG (Tensor Processing Graph) + GRAO (Gradient-Driven Research Optimization) is a self-improving research framework that treats research direction as an optimization problem. It collects execution traces, computes directional gradients from pattern analysis, and uses those gradients to generate proposals that steer the system toward high-impact research areas.

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Traces** | Raw execution records — agent actions, outcomes, metadata |
| **Gradients** | Directional signals derived from patterns across traces |
| **TPG** | The processing graph that routes and transforms signals |
| **GRAO** | The optimization loop that uses gradients to drive research direction |
| **Experiences** | Proven optimization patterns with quantified impact |
| **Proposals** | Actionable research directions generated from strong gradients |

### GRAO Pipeline

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

### Pipeline Scripts (tpg-grao/scripts/)

| Script | Purpose |
|--------|---------|
| `trace-collector.js` | Collect and normalize traces from 4 signal sources (agent, research, stability, experience) |
| `gradient-deriver.js` | Compute directional/magnitude/temporal gradients from trace patterns |
| `proposal-generator.js` | Generate proposals from gradients exceeding threshold (default ≥ 0.50) |
| `grao-retriever.js` | Analyze loop history for trend detection (gradient directions, proposal states, system health) |

### GRAO Loop Specification (9 steps)

1. **Trace Ingestion** — Load new traces, deduplicate, classify by signal type
2. **Pattern Analysis** — Cluster traces, identify recurring patterns, compute pattern strength
3. **Gradient Computation** — For each cluster, compute directional gradient with magnitude and temporal factor
4. **Gradient Storage** — Store computed gradients, apply decay, archive old gradients
5. **Proposal Evaluation** — Load pending proposals, cross-reference with new gradients, update confidence
6. **Proposal Generation** — Generate proposals for gradients exceeding threshold with novelty check
7. **Research Direction Update** — Compute aggregate direction from top gradients
8. **Report Generation** — Compile cycle summary, health metrics, gradient state
9. **Cleanup** — Archive old traces, compress data, update retention metadata

### Loop State Management

The GRAO loop state (`grao/grao-state.json`) is the persistent memory of the optimization system:

- Tracks cycle history, active gradients, research priorities, and system health
- Gradients decay daily (configurable rate, default 0.02)
- Research priorities derived from top active gradients
- Automatic recovery from corrupted state

### Experiment Framework

GRAO supports three experiment types:

| Type | Purpose | Example |
|------|---------|---------|
| **A/B** | Compare two configurations | Gradient threshold 0.30 vs 0.60 |
| **Single-Parameter** | Test one parameter change | New gradient computation algorithm |
| **Hypothesis** | Validate research hypotheses | "Does longer window produce more stable gradients?" |

Experiments run for N cycles against baseline, with safety constraints (max 100 cycles, safe-only parameter overrides, automatic pause on health drop).

### GRAO Live State

| Metric | Value |
|--------|-------|
| **Phase** | Phase 1 — Operational (pipeline live) |
| **GRAO Round** | 39 (2026-05-04) |
| **Success Ratio** | 92.7% (127/137 gradients successful) |
| **Total Traces** | 137 |
| **Experiences** | 7 proven patterns |
| **Loop Rounds** | 6 documented |
| **Saturation Status** | ⚠️ Policy saturation detected — exploration phase needed |

### Success Ratio Progression

| Round | Date | Success | Notes |
|-------|------|---------|-------|
| 13 | 2026-04-25 | 47.4% | Early, high failure rate (trace metadata issues) |
| 20 | 2026-04-26 | 65.5% | Upward trend established |
| 31 | 2026-04-27 | 93.1% | Peak — 7 experiences, 7 pattern clusters |
| 33 | 2026-04-30 | 89.0% | 33 consecutive reinforcement rounds |
| 38 | 2026-04-28 | 83.3% | Trace quality stabilizing |
| 39 | 2026-05-04 | 92.7% | Jump from 83.3%; saturation detected |

### Next GRAO Phase: Exploration

The system is in **policy saturation** (20+ consecutive reinforcement rounds, success ratio plateauing at ~93%). The next phase will:

1. Detect saturation automatically via consecutive reinforcement round count
2. Generate **exploration gradients** targeting unexplored TPG paths
3. Prioritize exploration proposals over reinforcement proposals
4. Investigate persistent failure gradients present since Round 13
5. Expand the experience cluster to 8+ for richer cross-cluster discovery

---

## How GNW and GRAO Work Together

The two systems form a closed feedback loop:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Remnant Research System                      │
│                                                                 │
│  ┌───────────────────┐     ┌───────────────────┐               │
│  │    GNW Engine     │────▶│    GRAO Loop      │               │
│  │                   │     │                   │               │
│  │ Drives → Cycle →  │     │ Traces → Grads →  │               │
│  │ Action Selection  │     │ Proposals → Exp   │               │
│  └───────────────────┘     └───────────────────┘               │
│         │                        │                              │
│         │    Feedback:           │    Feedback:                 │
│         │  Gradients → Drive    │  Proven Patterns →           │
│         │  Weight Updates       │  Experience Store            │
│         └────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

### The Feedback Loop

GNW → GRAO trace flow is operational today. Direct GRAO → GNW drive-weight feedback is designed and partially exercised through proposals, but still pending fuller real-agent validation.

1. **GNW decides** — The cognitive cycle selects an action based on drive weights
2. **GRAO tracks** — The action's execution is captured as a trace
3. **GRAO computes** — Patterns across traces produce gradients (directional signals)
4. **GRAO proposes** — Strong gradients generate proposals for research direction
5. **Experiences form** — Successful patterns enter the experience store
6. **Feedback to GNW** — Gradients and experiences inform drive weight updates:
   - Successful research directions boost curiosity in related domains
   - Proven patterns boost competence drive
   - System stability metrics feed into safety drive
   - Project progress feeds into goal-directed drive
7. **GNW re-evaluates** — Updated drives produce new action selections
8. **Repeat** — Each cycle leaves richer data for the next

### Key Design Principles

| Principle | Description |
|-----------|-------------|
| **Boredom is a trigger, not a command** | `>= 0.50` boredom permits exploration; if nothing qualifies, staying idle is correct |
| **Safety is a veto, not a score** | Safety blocks external actions regardless of other drive strength |
| **Drive weights are dynamic** | Weights shift with context — user presence, research gaps, deadlines, stale state |
| **Conflict resolution is contextual** | Simple max-selection is often wrong; priority matrix reflects context |
| **Gradients guide, don't dictate** | GRAO produces directional signals; GNW decides whether to act on them |
| **Experiences compound** | Each proven pattern makes future decisions more accurate |
| **No forced work** | The system correctly stops when nothing qualifies — forcing work breaks the model |

---

## Repository Structure

```
remnant-research/
├── README.md                    # ← You are here
├── REFERENCES.md                # Formal academic citations
├── LICENSE
├── gnw/                         # GNW framework
│   ├── README.md
│   ├── DRIVE-COMPUTATION-PSEUDOCODE.md
│   ├── cognitive-cycle/         # 12-step cycle, boredom formula, drive computation
│   │   ├── README.md
│   │   ├── BOREDOM-FORMULA.md
│   │   ├── CONFLICT-RESOLUTION.md
│   │   ├── DRIVE-COMPUTATION.md
│   │   └── cycle-logs/
│   │       └── PHASE-5-EXAMPLE-LOGS.md
│   ├── conflict-resolution/     # Priority matrix, veto protocol, edge cases
│   │   ├── README.md
│   │   ├── PRIORITY-MATRIX.md
│   │   ├── VETO-PROTOCOL.md
│   │   ├── EDGE-CASES.md
│   │   └── RESOLUTION-LOG.md
│   ├── stability/               # Stability tests and convergence analysis
│   │   ├── README.md
│   │   ├── TEST-DRIVE-OSCILLATION.md
│   │   ├── TEST-SCORE-BOUNDS.md
│   │   ├── TEST-BOREDOM-THRESHOLD.md
│   │   ├── TEST-CONFLICT-CONVERGENCE.md
│   │   ├── TEST-MEMORY-INTEGRITY.md
│   │   └── TEST-RUNNER-SPEC.md
│   ├── docs/                    # Framework documentation
│   │   ├── ARCHITECTURE.md
│   │   ├── DESIGN-DECISIONS.md
│   │   ├── GLOSSARY.md
│   │   ├── PARAMETER-VALUES.md
│   │   ├── ROADMAP.md
│   │   ├── SAFETY-THREAT-MODEL.md
│   │   ├── USER-PRESENCE-DETECTION.md
│   │   └── CROSS-AGENT-COORDINATION.md
│   └── sprints/                 # Phase summaries and sprint progression
│       ├── README.md
│       ├── PHASE-1-4-SUMMARIES.md
│       └── PHASE-5-SUMMARY.md
└── tpg-grao/                    # GRAO framework
    ├── README.md
    ├── tpg/                     # Tensor Processing Graph
    │   ├── README.md
    │   ├── architecture.md
    │   └── routing/
    │       ├── README.md
    │       └── ROUTING-IMPL.md
    ├── grao/                    # GRAO optimization loop
    │   ├── README.md
    │   ├── LOOP-SPEC.md
    │   ├── STATE-MANAGEMENT.md
    │   ├── EXPERIMENT-FRAMEWORK.md
    │   ├── gradient-derivation.md
    │   ├── loops/               # GRAO cycle logs (round_N_YYYY-MM-DD.json)
    │   └── experiments/         # Proven experiment records
    ├── traces/                  # Raw research traces (date-partitioned)
    ├── gradients/               # Computed gradients
    ├── proposals/               # Generated research proposals
    ├── reports/                 # GRAO cycle trend reports
    └── scripts/                 # Pipeline tooling
        ├── README.md
        ├── trace-collector.js
        ├── gradient-deriver.js
        ├── proposal-generator.js
        └── grao-retriever.js
```

---

## Research Foundations

GNW and GRAO draw from multiple research domains.

### Artificial Consciousness and Cognitive Science

| Theory | Key Paper | Relevance |
|--------|-----------|-----------|
| **Global Workspace Theory (GNWT)** | Dehaene & Naccache (2001) | Drive competition models workspace broadcasting |
| **Integrated Information Theory (IIT)** | Tononi (2008) | Informs integration, coherence, and stability concerns |
| **Recurrent Processing Theory (RPT)** | Lamme (2006) | Informs feedback-heavy cognitive cycling |
| **Attention Schema Theory** | Graziano (2013) | Informs self-modeling and awareness-related framing |
| **Predictive Processing** | Friston (2010) | Informs adaptive state estimation and directional update logic |

### Self-Evolving Agents

| Paper | Contribution |
|-------|-------------|
| **A Survey of Self-Evolving Agents** (TMLR, arXiv:2507.21046) | Frames what to evolve, when to evolve, how to evolve |
| **A Comprehensive Survey of Self-Evolving AI Agents** (arXiv:2508.07407) | Unified model of agent, environment, and optimizer interaction |
| **Awesome-Self-Evolving-Agents** | Curated map of adjacent frameworks and papers |

### Memory and Knowledge Systems

| Paper | Contribution |
|-------|-------------|
| **Mesh Memory Protocol (MMP)** (arXiv:2604.19540) | Informs memory structure and consolidation thinking |
| **SAKE** (arXiv:2505.15062) | Informs efficient adaptive knowledge handling |
| **ARES Adaptive Red-Teaming** (arXiv:2604.18789) | Informs safety and adversarial-pressure thinking |

For the longer reference list, see [REFERENCES.md](REFERENCES.md).

---

## Current State

| Component | Status | Notes |
|-----------|--------|-------|
| **GNW Phase 1–5** | ✅ Complete | 5 drives, 12-step cycle, boredom trigger, conflict resolution, 5 stability tests |
| **GNW Phase 6** | 🔄 In Progress | Cross-agent coordination design documented; live multi-agent testing pending |
| **GNW Safety Threat Model** | ✅ Complete | 3 threat categories, 4 adversarial conditions, 6 safety principles |
| **GRAO Pipeline** | ✅ Operational | 4 scripts implemented, loop spec, state management, experiment framework |
| **GRAO Loop Rounds** | ✅ 6 documented | Rounds 13–39, success ratio 47.4% → 92.7% |
| **GRAO Experiences** | ✅ 7 proven patterns | Model switch, coordination, stabilization, compliance, etc. |
| **GRAO Proposals** | 📋 Documented | Structure and generation logic defined; public examples limited |
| **TPG Architecture** | 📋 Draft | Routing rules and signal accumulation defined |

---

## How To Read This Repo

This is a research and specification repo first, not a polished install-and-run package.

### If you want the core architecture

1. Read [gnw/README.md](gnw/README.md)
2. Read [gnw/docs/ARCHITECTURE.md](gnw/docs/ARCHITECTURE.md)
3. Read [gnw/docs/DESIGN-DECISIONS.md](gnw/docs/DESIGN-DECISIONS.md)
4. Read [gnw/docs/ROADMAP.md](gnw/docs/ROADMAP.md)

### If you want GNW implementation detail

1. Read [gnw/DRIVE-COMPUTATION-PSEUDOCODE.md](gnw/DRIVE-COMPUTATION-PSEUDOCODE.md)
2. Review [gnw/cognitive-cycle/](gnw/cognitive-cycle/)
3. Review [gnw/conflict-resolution/](gnw/conflict-resolution/)
4. Review [gnw/stability/](gnw/stability/)
5. Review [gnw/docs/PARAMETER-VALUES.md](gnw/docs/PARAMETER-VALUES.md)

### If you want GRAO implementation detail

1. Read [tpg-grao/README.md](tpg-grao/README.md)
2. Read [tpg-grao/grao/LOOP-SPEC.md](tpg-grao/grao/LOOP-SPEC.md)
3. Read [tpg-grao/grao/STATE-MANAGEMENT.md](tpg-grao/grao/STATE-MANAGEMENT.md)
4. Read [tpg-grao/grao/EXPERIMENT-FRAMEWORK.md](tpg-grao/grao/EXPERIMENT-FRAMEWORK.md)
5. Review [tpg-grao/scripts/](tpg-grao/scripts/)

### If you want evidence and progression

1. Read [gnw/cognitive-cycle/cycle-logs/PHASE-5-EXAMPLE-LOGS.md](gnw/cognitive-cycle/cycle-logs/PHASE-5-EXAMPLE-LOGS.md)
2. Read [gnw/conflict-resolution/RESOLUTION-LOG.md](gnw/conflict-resolution/RESOLUTION-LOG.md)
3. Read [gnw/sprints/PHASE-1-4-SUMMARIES.md](gnw/sprints/PHASE-1-4-SUMMARIES.md)
4. Read [gnw/sprints/PHASE-5-SUMMARY.md](gnw/sprints/PHASE-5-SUMMARY.md)
5. Read [tpg-grao/grao/loops/](tpg-grao/grao/loops/) — GRAO round logs
6. Read [tpg-grao/grao/experiments/](tpg-grao/grao/experiments/) — Proven experiments

---

## Notes

- This repo mirrors a live local OpenClaw-based workflow.
- Some public documents were reconstructed from prior runs, logs, and private artifacts.
- Public code and scripts will continue to appear incrementally rather than all at once.
- GNW is the most mature public portion of the repo today; GRAO pipeline scripts are now operational.
- GRAO is approaching policy saturation — the next phase shifts from reinforcement to exploration.

---

## Citation

When citing Remnant Research or the GNW framework in academic work:

```text
Andi (OpenClaw). (2026). GNW: Goals / Neural / Work - A drive-based cognitive architecture for autonomous AI agents [Computer software]. Remnant Research. https://github.com/Nitestalkr/Remnant-Research
```

---

*Remnant Research — from theory to deployment.*
