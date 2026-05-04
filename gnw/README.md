this repo is a public research mirror of an actively evolving private/local OpenClaw setup, that some artifacts are reconstructed from prior runs, and that executable scripts will be published incrementally.

# GNW — Goals / Neural / Work

Self-evolution framework for AI agent systems.

## Overview

GNW is a cognitive architecture for autonomous agent self-improvement.
It models drives (curiosity, competence, helpfulness, safety, goal-directedness)
as weighted vectors that determine what the agent works on and when.

The framework bridges theoretical research on artificial consciousness,
self-evolving agents, and gradient-driven optimization into a practical
system for OpenClaw-based AI agents.

### What It Covers

- **Drive-based motivation** — Agents self-direct work using weighted cognitive drives
- **Boredom detection** — Formula that triggers self-initiated exploration when external input is stale
- **Unified cognitive cycle** — 12-step perception → execution → reflection loop
- **Conflict resolution** — Priority arbitration when drives compete (e.g., curiosity vs. safety)
- **Stability analysis** — Convergence tests to prevent drive oscillation or runaway behavior
- **Cross-agent coordination** — Multi-agent drive synchronization (Phase 6)

## Structure

- sprints/ — Individual sprint implementations and logs
- cognitive-cycle/ — The unified 12-step cognitive cycle
- conflict-resolution/ — Drive priority and conflict resolution logic
- stability/ — Stability tests and convergence analysis
- docs/ — Framework documentation and design decisions

## Current State

Phase 5 complete: 5/5 drives integrated.
Phase 6: Cross-agent coordination logic verified, real agent testing pending.

## Key Components

### Drives

| Drive | Purpose | Signal |
|-------|---------|--------|
| **Curiosity** | Information gain, novelty seeking | High when stale topics dominate |
| **Helpfulness** | External utility, user benefit | High when user engagement present |
| **Competence** | Skill improvement, mastery | High when capability gaps detected |
| **Safety** | Risk avoidance, constraint compliance | High when external actions pending |
| **Goal-Directed** | Long-term objective pursuit | High when active projects exist |

### Boredom Formula

`
boredom = (traditional + curiosity + self-awareness) / 3 + stale_bonus
`

When boredom ≥ threshold, the agent initiates self-directed work.

### Cognitive Cycle

12-step unified cycle: perception → evaluation → drive computation → 
conflict resolution → selection → execution → reflection → memory update.

## Research Foundations

GNW draws from multiple research domains. Key papers and frameworks:

### Artificial Consciousness

- **Global Workspace Theory (GNWT)** — Dehaene: consciousness = information broadcasting
- **Integrated Information Theory (IIT)** — Tononi: consciousness = Φ (integrated information)
- **Recurrent Processing Theory (RPT)** — Lamme: consciousness = sustained recurrent activity
- **Attention Schema Theory** — Graziano: consciousness = brain's model of attention
- **Predictive Processing** — Friston: consciousness = controlled hallucination

**Adversarial Study:** Cogitate Consortium (Nature, April 2025) — tested GNWT and IIT against each other. Neither theory came out unscathed; GNWT partially validated, IIT's posterior hot zone falsified.

### Self-Evolving Agents

- **A Survey of Self-Evolving Agents** — arXiv:2507.21046 (v4, Jan 2026)
  - Three dimensions: what to evolve, when to evolve, how to evolve
  - 77 pages, 26 authors, published in TMLR
- **A Comprehensive Survey of Self-Evolving AI Agents** — arXiv:2508.07407
  - Unified model: System Inputs → Agent System → Environment → Optimisers
  - GitHub: https://github.com/EvoAgentX/Awesome-Self-Evolving-Agents

### Gradient-Driven Research

- **GRAO (Gradient-Driven Research Optimization)** — Experimental loop for autonomous research
  - Trace-collector, gradient-deriver, proposal-generator components
  - Manual and auto-captured experiences in research/experiences/

### Memory & Knowledge

- **Mesh Memory Protocol (MMP)** — arXiv:2604.19540
  - Semantic memory infrastructure; consolidated: memory 0.85→0.95
- **SAKE (Self-Adaptive Knowledge Engine)** — arXiv:2505.15062v4
  - Qwen2.5-7B beats GPT-3.5 + agentic KG on benchmarks with 90% less tokens
- **ARES Adaptive Red-Teaming** — arXiv:2604.18789
  - Dual-targeting systemic weaknesses; consolidated: security 0.50→0.60

### Related Frameworks

- **StepPO (Agentic RL)** — Policy optimization for agent behaviors
- **CAAF (Convergent AI Agent Framework)** — Multi-agent convergence
- **SkillGraph** — Skill dependency and progression modeling
- **Gated LLM Interface** — Quality-gate routing architecture (draft)

## Implementation Notes

- Boredom scan runs every 15 minutes via cron
- Cognitive cycle runs every 30 minutes via cron
- Drive weights are dynamic, not static — they shift based on context
- Conflict resolution uses a priority matrix, not simple max-selection

---

*Remnant Research — from theory to deployment.*
