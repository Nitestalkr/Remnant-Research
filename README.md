# Remnant Research

> **From theory to deployment.** Self-evolving AI agent systems, cognitive architectures, and autonomous research loops.

---

## 📖 Abstract

**What problem are we solving?** Autonomous agents need more than static task routing — they need *motivation*. Without a drive-based internal state, agents either work endlessly (burnout) or sit idle (apathy). Both are failure modes.

**Our approach:** GNW (Goals / Neural / Work) models cognitive drives — curiosity, helpfulness, competence, safety, goal-directedness — as continuous weighted vectors (0.0–1.0) that determine *what* an agent works on and *when*. The system uses boredom detection as a trigger for self-directed exploration, a 12-step cognitive cycle for execution, and priority-based conflict resolution when drives compete.

**What have we found?** After 5 phases of development and live testing:
- ✅ All 5 drives integrated and operational
- ✅ Unified cognitive cycle running (perception → execution → reflection)
- ✅ Boredom formula operational with "no forced work" principle
- ✅ Safety-as-veto prevents harmful external actions
- ✅ System correctly stops when nothing qualifies ≥ 0.50 (a key insight most frameworks miss)
- ⏳ Phase 6 (cross-agent coordination) — logic verified, real agent testing pending

This is a **specification + living research project**. Documentation is complete for Phases 1–5; executable code is being published incrementally. Some artifacts are reconstructed from prior local runs.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GNW Framework                                │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │  Drive       │    │  Cognitive   │    │  Conflict    │         │
│  │  Module      │───→│  Cycle       │───→│  Resolution  │         │
│  │              │    │  (12 steps)  │    │              │         │
│  └──────────────┘    └──────────────┘    └──────────────┘         │
│       │                   │                   │                    │
│       ▼                   ▼                   ▼                    │
│  ┌──────────────────────────────────────────────────────┐          │
│  │              Boredom Scanner                          │          │
│  │  Input: stale context, research gaps, novelty        │          │
│  │  Output: boredom score (0.0–1.0)                    │          │
│  └──────────────────────────────────────────────────────┘          │
│                         │                                           │
│                         ▼                                           │
│  ┌──────────────────────────────────────────────────────┐          │
│  │           Trigger Decision                            │          │
│  │  boredom ≥ 0.50 AND user away → run cognitive cycle  │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │           Cron Infrastructure                         │          │
│  │  ┌──────────────────┐  ┌──────────────────┐          │          │
│  │  │ Boredom Scan     │  │ Cognitive Cycle  │          │          │
│  │  │ Every 15 min     │  │ Every 30 min     │          │          │
│  │  └──────────────────┘  └──────────────────┘          │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │           Memory Integration                          │          │
│  │  Drive Weights (JSON) → Cycle Logs (MD) → State     │          │
│  └──────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

### Drive Module

```
┌─────────────────────────────────────┐
│           Drive Module               │
│                                      │
│  ┌──────────┐  ┌──────────┐        │
│  │ Curiosity│  │Helpfulness│        │
│  └──────────┘  └──────────┘        │
│                                      │
│  ┌──────────┐  ┌──────────┐        │
│  │Competence│  │  Safety  │        │
│  └──────────┘  └──────────┘        │
│                                      │
│  ┌──────────┐                       │
│  │Goal-Direct│                      │
│  └──────────┘                       │
│                                      │
│  All modules → raw scores → modulate │
│  → conflict detection → output       │
└─────────────────────────────────────┘
```

### Data Flow

```
External Input / Cron Trigger
        │
        ▼
┌──────────────┐
│  Boredom     │──→ boredom < 0.50 → SKIP (stay engaged)
│  Scanner     │
└──────────────┘
        │
        ▼ (boredom ≥ 0.50 AND user away)
┌──────────────┐
│  Cognitive   │
│  Cycle       │
│              │
│  1. Input    │──→ Perception
│  2. Context  │──→ Perception
│  3. State    │──→ Perception
│  4. Drive    │──→ Evaluation
│  5. Modulate │──→ Evaluation
│  6. Conflict │──→ Evaluation
│  7. Resolve  │──→ Decision
│  8. Select   │──→ Decision
│  9. Plan     │──→ Decision
│ 10. Dispatch │──→ Execution
│ 11. Capture  │──→ Execution
│ 12. Update   │──→ Reflection
└──────────────┘
        │
        ▼
┌──────────────┐
│  Memory      │──→ Persist drive weights, cycle log, state
│  Write       │
└──────────────┘
```

---

## 📊 Status

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Complete | Drive architecture design, boredom formula, cognitive cycle skeleton |
| **Phase 2** | ✅ Complete | Drive modulation, conflict resolution priority matrix, veto protocol |
| **Phase 3** | ✅ Complete | Stability tests, convergence analysis, edge case handling |
| **Phase 4** | ✅ Complete | OpenClaw integration, live testing with Andi agent, drive weight calibration |
| **Phase 5** | ✅ Complete | All 5 drives integrated, unified cycle operational, cron infrastructure active |
| **Phase 6** | 🔄 In Progress | Cross-agent coordination — logic verified, real agent testing pending |
| **Phase 7** | 📋 Planned | Self-modifying drives — auto-calibration, signal evolution |
| **Phase 8** | 📋 Planned | Memory integration deepening — cross-session persistence |
| **Phase 9** | 📋 Planned | Research integration — autonomous research loop |
| **Phase 10** | 📋 Planned | Multi-agent orchestra — full five-agent coordination |

**Current:** Phase 5 complete (5/10 phases). Phase 6 in progress.

---

## 🗂️ How to Navigate

```
gnw-research/
├── README.md              ← You are here
├── gnw/
│   ├── README.md           ← GNW framework overview (start here for GNW details)
│   ├── docs/
│   │   ├── ARCHITECTURE.md ← High-level system architecture (diagrams, data flow)
│   │   ├── DESIGN-DECISIONS.md ← Why each design choice was made
│   │   ├── GLOSSARY.md     ← Terminology and definitions
│   │   └── ROADMAP.md      ← Full development plan, milestones, unknowns
│   ├── cognitive-cycle/
│   │   ├── DRIVE-COMPUTATION.md ← Drive specs, signal sources, formulas
│   │   ├── BOREDOM-FORMULA.md   ← Boredom trigger mechanics
│   │   ├── CONFLICT-RESOLUTION.md← Priority matrix, tie-breaking, veto protocol
│   │   └── cycle-logs/          ← Execution logs (populating)
│   ├── conflict-resolution/
│   │   ├── EDGE-CASES.md
│   │   ├── PRIORITY-MATRIX.md
│   │   └── VETO-PROTOCOL.md
│   ├── sprints/
│   │   ├── PHASE-5-SUMMARY.md ← Phase 5 completion report
│   │   └── README.md
│   └── stability/
│       ├── TEST-BOREDOM-THRESHOLD.md
│       ├── TEST-CONFLICT-CONVERGENCE.md
│       ├── TEST-DRIVE-OSCILLATION.md
│       ├── TEST-MEMORY-INTEGRITY.md
│       └── TEST-SCORE-BOUNDS.md
├── gnw-phase1-plan.md (legacy — see PHASE-1-4-SUMMARIES.md for full phase history)
└── LICENSE
```

**Quick start:**
1. Read this README for the overview
2. Go to `gnw/docs/ARCHITECTURE.md` for the system diagram
3. Go to `gnw/docs/DESIGN-DECISIONS.md` for rationale behind each choice
4. Go to `gnw/docs/ROADMAP.md` for the full development plan
5. Go to `gnw/cognitive-cycle/DRIVE-COMPUTATION.md` for drive specs

---

## 🧠 Research Foundations

GNW draws from multiple research domains. Key theoretical references:

### Artificial Consciousness & Cognitive Science

| Framework | Author | Key Insight |
|-----------|--------|-------------|
| **Global Workspace Theory (GNWT)** | Dehaene et al. | Consciousness = information broadcasting to distributed processors |
| **Integrated Information Theory (IIT)** | Tononi | Consciousness = Φ (integrated information); consciousness arises from causal structure |
| **Recurrent Processing Theory (RPT)** | Lamme | Consciousness = sustained recurrent activity (not just feedforward) |
| **Attention Schema Theory** | Graziano | Consciousness = the brain's internal model of its own attention |
| **Predictive Processing** | Friston | Perception = controlled hallucination constrained by sensory input |

**Adversarial Study:** Cogitate Consortium (*Nature*, April 2025) — tested GNWT and IIT against each other. Neither theory came out unscathed; GNWT partially validated, IIT's posterior hot zone falsified.

### Self-Evolving Agents

| Paper | arXiv | Key Contribution |
|-------|-------|-----------------|
| **A Survey of Self-Evolving Agents** | [2507.21046](https://arxiv.org/abs/2507.21046) (v4, Jan 2026) | Three dimensions: what to evolve, when to evolve, how to evolve. 77 pages, 26 authors, TMLR. |
| **A Comprehensive Survey of Self-Evolving AI Agents** | [2508.07407](https://arxiv.org/abs/2508.07407) | Unified model: System Inputs → Agent System → Environment → Optimisers |
| **Awesome-Self-Evolving-Agents** | [GitHub](https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents) | Curated collection of self-evolving agent frameworks |

### Memory & Knowledge

| Paper | arXiv | Key Insight |
|-------|-------|-------------|
| **Mesh Memory Protocol (MMP)** | [2604.19540](https://arxiv.org/abs/2604.19540) | Semantic memory infrastructure; consolidation improves memory from 0.85→0.95 |
| **SAKE (Self-Adaptive Knowledge Engine)** | [2505.15062](https://arxiv.org/abs/2505.15062) (v4) | Qwen2.5-7B beats GPT-3.5 + agentic KG on benchmarks with 90% less tokens |
| **ARES Adaptive Red-Teaming** | [2604.18789](https://arxiv.org/abs/2604.18789) | Dual-targeting systemic weaknesses in AI systems |

### Related Frameworks

| Framework | Domain |
|-----------|--------|
| **StepPO (Agentic RL)** | Policy optimization for agent behaviors |
| **CAAF (Convergent AI Agent Framework)** | Multi-agent convergence |
| **SkillGraph** | Skill dependency and progression modeling |
| **Gated LLM Interface** | Quality-gate routing architecture (draft) |

---

## 🎯 Key Design Principles

| Principle | Description |
|-----------|-------------|
| **Drives as weighted vectors** | Continuous scores (0.0–1.0), not binary flags — enables smooth transitions and decay |
| **Boredom as trigger, not driver** | Boredom answers "should I work?" — drives answer "what should I work on?" |
| **Safety as veto** | Safety is a hard constraint, not a competing drive. Prevents "helpfulness" from overriding caution |
| **No forced work** | System stops when nothing qualifies ≥ 0.50. Forcing work creates noise, not signal |
| **Dynamic weights** | Drive base weights shift based on context and history, not static |
| **Priority matrix over max-selection** | Context-dependent ordering resolves conflicts that raw scores can't |
| **Single-threaded execution** | One action at a time — quality over throughput |
| **Half-life decay** | Exponential decay prevents stale drive persistence without immediate reactivity |

---

## 🔧 Drive Overview

| Drive | Purpose | Trigger Signal |
|-------|---------|----------------|
| **Curiosity** | Information gain, novelty seeking | Stale topics, research gaps, novelty index |
| **Helpfulness** | External utility, user benefit | Pending requests, user engagement, system health |
| **Competence** | Skill improvement, mastery | Capability gaps, error rate, skill debt |
| **Safety** | Risk avoidance, constraint compliance | External actions pending, constraint violations |
| **Goal-Directed** | Long-term objective pursuit | Active projects, milestone distance, deadlines |

**Boredom Formula:** `boredom = (traditional + curiosity + self-awareness) / 3 + stale_bonus`

When boredom ≥ 0.50 AND user is away → full cognitive cycle initiates.

---

## 📝 Contributing

This is a public research mirror of an actively evolving private/local OpenClaw setup. Some artifacts are reconstructed from prior runs, and executable scripts will be published incrementally.

**Want to engage with this research?**
- Open issues for theoretical feedback, citation suggestions, or framework critiques
- PRs welcome for: documentation improvements, reference additions, pseudocode implementations, stability test results
- Questions about methodology, design decisions, or research foundations are encouraged

**Research methodology:** Hypothesis → Experiment (live agent testing) → Data (cycle logs, drive scores) → Analysis (stability tests, convergence analysis) → Iteration (sprint updates).

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

*Remnant Research — from theory to deployment.*
