# Remnant Research

> **From theory to deployment.** Building self-evolving AI agent systems grounded in cognitive science, consciousness research, and gradient-driven optimization.

---

## 🎯 The Problems We're Solving

### 1. Autonomous agents lack motivation
Static task routing works until the work runs out. Without an internal drive state, agents either:
- **Burn out** — endlessly pursuing stale work with no self-regulation
- **Apathize** — sitting idle when no external input arrives
- **Misalign** — optimizing for the wrong drive when contexts shift

We need agents that *know when to work, what to work on, and when to stop* — not from external commands, but from internal state.

### 2. Research systems lack gradient-driven direction
Most autonomous research frameworks are either:
- **Random exploration** — sampling papers/tasks without directional signal
- **Static priority** — fixed relevance scores that don't adapt to what's been learned
- **No feedback loops** — research outputs don't feed back into research direction

We need research that *steers itself* — where each cycle's outputs become the gradient signals for the next cycle's direction.

### 3. Cognitive architectures are theoretical, not operational
Consciousness and cognition theories (GNWT, IIT, RPT, etc.) are well-developed academically but rarely translated into operational agent architectures. The gap between "what consciousness might be" and "how to implement a cognitive drive system" is enormous.

---

## 📖 What This Repo Contains

Remnant Research is a **public mirror** of an actively evolving private OpenClaw-based AI agent system. It contains:

### GNW Framework — Goals / Neural / Work
A drive-based cognitive architecture for autonomous agent self-improvement.

- **5 cognitive drives** — curiosity, helpfulness, competence, safety, goal-directedness as continuous weighted vectors (0.0–1.0)
- **Unified 12-step cognitive cycle** — perception → evaluation → drive computation → conflict resolution → selection → execution → reflection → memory update
- **Boredom detection** — formula that triggers self-directed exploration when external input is stale
- **Priority-based conflict resolution** — when drives compete (e.g., curiosity vs. safety), a priority matrix arbitrates
- **Stability analysis** — convergence tests to prevent drive oscillation or runaway behavior
- **Phase 5 complete** — all 5 drives integrated and operational; Phase 6 (cross-agent coordination) logic verified

### GRAO — Gradient-Driven Research Optimization
A framework for systematic research evolution through gradient-based pattern analysis.

- **Trace collection** — capturing research experiences (manual + auto-captured)
- **Gradient derivation** — computing directional signals from pattern analysis across traces
- **TPG routing** — Tensor Processing Graph that routes, transforms, and accumulates gradient signals
- **Proposal generation** — research proposals derived from gradient analysis
- **Experiment tracking** — GRAO cycle experiments and results

### Research Infrastructure
- **REFERENCES.md** — Formal academic citations (APA 7th) covering consciousness theory, self-evolving agents, memory systems, and related frameworks
- **gnw/** — Complete GNW framework documentation (sprints, cognitive cycle specs, conflict resolution, stability tests)
- **tpg-grao/** — TPG-GRAO framework skeleton (architecture, gradient derivation, experiment structure)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Remnant Research System                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    GNW Cognitive Engine                      │   │
│  │                                                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ Curiosity│  │Helpfulness│  │Competence│  │  Safety  │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │
│  │           ↓         ↓           ↓           ↓              │   │
│  │  ┌──────────┐                                      │   │
│  │  │Goal-Direct│                                      │   │
│  │  └──────────┘                                      │   │
│  │           ↓                                      │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │     Drive Weights → Conflict Resolution   │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │           ↓                                      │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │      Boredom Scanner (trigger)            │   │   │
│  │  │  boredom ≥ 0.50 + user away → cognitive   │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │           ↓                                      │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │     12-Step Cognitive Cycle               │   │   │
│  │  │  perception → execution → reflection      │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  GRAO Research Loop                          │   │
│  │                                                             │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐             │   │
│  │  │ Traces   │───→│ Gradients│───→│ Proposals│             │   │
│  │  │Collection│    │Derivation│    │Generation│             │   │
│  │  └──────────┘    └──────────┘    └──────────┘             │   │
│  │       │                  │                  │              │   │
│  │       ▼                  ▼                  ▼              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │              TPG Routing Graph                       │   │   │
│  │  │  Routes, transforms, and accumulates signals         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │       │                                                  │   │
│  │       ▼                                                  │   │
│  │  ┌──────────┐                                            │   │
│  │  │ Experiments│ → Reports → Cycle Updates                │   │
│  │  └──────────┘                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 Memory Integration                           │   │
│  │  Drive Weights → Cycle Logs → State → Research Traces       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Research Papers & Theoretical Foundations

GNW and GRAO draw from multiple research domains. The key papers and frameworks that inform our implementation:

### Artificial Consciousness & Cognitive Science

| Theory | Key Paper | Relevance to GNW |
|--------|-----------|-----------------|
| **Global Workspace Theory (GNWT)** | Dehaene & Naccache (2001), *Current Opinion in Neurobiology* | Information broadcasting as consciousness basis — informs drive module as "workspace" |
| **Integrated Information Theory (IIT)** | Tononi (2008), *The Biological Bulletin* | Φ as measure of integrated information — informs stability tests |
| **Recurrent Processing Theory (RPT)** | Lamme (2006), *Trends in Cognitive Sciences* | Sustained recurrent activity as consciousness — informs cognitive cycle feedback loops |
| **Attention Schema Theory** | Graziano (2013), *Rethinking Consciousness* | Brain's model of attention — informs self-awareness drive |
| **Predictive Processing** | Friston (2010), *Nature Reviews Neuroscience* | Free-energy principle as unified brain theory — informs GRAO gradient computation |

**Adversarial Study:** Cogitate Consortium (Nature, April 2025) — tested GNWT and IIT against each other. Neither came out unscathed; GNWT partially validated, IIT's posterior hot zone falsified. This informs our hybrid approach.

### Self-Evolving Agents

| Paper | Key Contribution |
|-------|-----------------|
| **A Survey of Self-Evolving Agents** — Liu et al. (2026), TMLR, arXiv:2507.21046v4 | Three dimensions: what to evolve, when to evolve, how to evolve. 77 pages, 26 authors. |
| **A Comprehensive Survey of Self-Evolving AI Agents** — arXiv:2508.07407 | Unified model: System Inputs → Agent System → Environment → Optimisers |
| **Awesome-Self-Evolving-Agents** — EvoAgentX GitHub repo | Curated collection of self-evolving agent frameworks and papers |

### Memory & Knowledge Systems

| Paper | Key Contribution |
|-------|-----------------|
| **Mesh Memory Protocol (MMP)** — arXiv:2604.19540 | Semantic memory infrastructure; consolidation improves memory from 0.85→0.95 |
| **SAKE (Self-Adaptive Knowledge Engine)** — arXiv:2505.15062v4 | Qwen2.5-7B beats GPT-3.5 + agentic KG on benchmarks with 90% less tokens |
| **ARES Adaptive Red-Teaming** — arXiv:2604.18789 | Dual-targeting systemic weaknesses in AI systems; informs safety drive veto |

### Related Frameworks

| Framework | Contribution |
|-----------|-------------|
| **StepPO (Agentic RL)** | Policy optimization for agent behaviors |
| **CAAF (Convergent AI Agent Framework)** | Multi-agent convergence |
| **SkillGraph** | Skill dependency and progression modeling |
| **Gated LLM Interface** | Quality-gate routing architecture (draft) |

### Drive Theory Foundations

| Paper | Contribution |
|-------|-------------|
| Mather & Sutherland (2011), *Annual Review of Psychology* | Neuroscientific basis for competing motivational drives |
| Berridge (2004), *Physiology & Behavior* | Drive theory and reward systems |
| Berlyne (1960), *Conflict, Arousal, and Curiosity* | Curiosity as arousal-driven exploration — boredom formula basis |
| Kahneman (2011), *Thinking, Fast and Slow* | Dual-process theory — drive arbitration model |
| Gigerenzer & Todd (1999), *Simple Heuristics That Make Us Smart* | Fast-and-frugal decision trees for priority selection |

---

## 🔬 Key Design Decisions

### 1. Boredom as Exploration Trigger, Not Work Command
The system uses boredom ≥ 0.50 as a *permission* to explore, not a *command* to work. If boredom triggers but nothing qualifies (no stale context, no research gaps, no novelty), the system stays idle. This prevents the "forced work" failure mode.

### 2. Safety as Veto, Not Weight
The safety drive doesn't compete with other drives — it *veto*s them. When an external action is pending, safety's veto threshold overrides all other drive scores. This prevents the agent from "choosing" to do something unsafe just because curiosity is high.

### 3. Drive Weights Are Dynamic, Not Static
Drive weights shift continuously based on context (user presence, research gaps, skill staleness, project status). They're not preset constants — they're computed values that reflect the agent's current state.

### 4. Conflict Resolution Uses Priority Matrix, Not Max-Selection
When drives compete, a 7-condition priority matrix arbitrates rather than simple max-selection. This handles edge cases like "curiosity vs. safety" (safety wins) and "competence vs. goal-directed" (goal-directed wins during active projects).

---

## 📊 Current State

| Component | Status | Notes |
|-----------|--------|-------|
| **GNW Phase 1–4** | ✅ Complete | Drive modules, cognitive cycle, conflict resolution, stability |
| **GNW Phase 5** | ✅ Complete | All 5 drives integrated, unified cognitive cycle operational |
| **GNW Phase 6** | ⏳ In Progress | Cross-agent coordination logic verified, real agent testing pending |
| **GRAO Traces** | ⏳ In Progress | Manual experiences seeded, auto-capture traces pending |
| **GRAO Gradients** | ⏳ In Progress | Gradient derivation methodology drafted |
| **GRAO Proposals** | ⏳ Skeleton | Proposal generation framework structure ready |
| **TPG Architecture** | ⏳ Draft | Routing rules and signal accumulation defined |

---

## 🚀 How to Use This Repo

This is a **research + specification** repo, not a ready-to-run framework. The documentation is complete for Phases 1–5; executable code is being published incrementally.

### For Researchers
- Start with `gnw/README.md` for the complete GNW framework overview
- Read `gnw/docs/ARCHITECTURE.md` for system architecture details
- Review `REFERENCES.md` for the full academic citation list
- Check `gnw/docs/ROADMAP.md` for the development roadmap through Phase 10

### For Implementers
- `gnw/cognitive-cycle/` — 12-step cycle spec and drive computation formulas
- `gnw/conflict-resolution/` — Priority matrix, veto protocol, edge cases
- `gnw/stability/` — 5 formal stability tests (oscillation, score bounds, boredom, conflict convergence, memory integrity)
- `tpg-grao/` — GRAO framework skeleton (structure ready, content being populated)

### For Reviewers
- `gnw/sprints/` — Individual sprint implementations and logs
- `gnw/docs/DESIGN-DECISIONS.md` — 9 design decisions with rationale and alternatives
- `gnw/docs/USER-PRESENCE-DETECTION.md` — How the system detects and responds to user presence
- `gnw/docs/CROSS-AGENT-COORDINATION.md` — Phase 6 cross-agent drive synchronization

---

## ⚠️ Notes

- This repo is a **public mirror** of an actively evolving private/local OpenClaw setup
- Some artifacts are reconstructed from prior local runs
- Executable scripts will be published incrementally as they stabilize
- The GNW framework is operational in production but still under active development

---

## 📝 Citation

When citing Remnant Research or the GNW framework in academic work:

```
Andi (OpenClaw). (2026). GNW: Goals / Neural / Work — A drive-based cognitive architecture for autonomous AI agents [Computer software]. Remnant Research. https://github.com/Nitestalkr/Remnant-Research
```

---

*Remnant Research — from theory to deployment.*
