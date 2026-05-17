# Self-Evolving Agents

Papers informing the GRAO optimization loop and agent self-improvement architecture.

---

## Surveys and Frameworks

### [A Survey of Self-Evolving Agents](https://arxiv.org/abs/2507.21046)

- **arXiv:** 2507.21046
- **Published:** 2025
- **Relevance:** GRAO (architectural framing)
- **Framework Score:** 9/10

Frames the three-axis question — what to evolve, when to evolve, how to evolve — which maps directly to GRAO's trace→gradient→proposal→experience pipeline. The canonical GRAO survey reference.

---

### [A Comprehensive Survey of Self-Evolving AI Agents](https://arxiv.org/abs/2508.07407)

- **arXiv:** 2508.07407
- **Published:** 2025
- **Relevance:** GRAO + GNW
- **Framework Score:** 9/10

Unified model of agent, environment, and optimizer interaction. Supports the GNW→GRAO closed-loop design: agent state (GNW drives) and environment feedback (GRAO traces) both feed the optimizer.

---

### [Mimosa Framework: Evolving Multi-Agent Systems for Scientific Research](https://arxiv.org/abs/2603.28986)

- **arXiv:** 2603.28986
- **Published:** 2026
- **Relevance:** GRAO (evolving workflow synthesis via MCP)
- **Framework Score:** 9/10

Automatically synthesizes task-specific multi-agent workflows and iteratively refines them through experimental feedback using Model Context Protocol. Core GRAO pattern: trace → gradient → synthesize → refine.

---

## Implementation References

### [Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052)

- **arXiv:** 2603.28052
- **Published:** 2026
- **Relevance:** GRAO (trace-based optimization at 10M token scale)
- **Framework Score:** 10/10

Filesystem-based optimization using full execution traces (10M token context vs 26K for other methods). The closest existing implementation to GRAO's trace-collection and gradient-derivation pipeline. **Priority deep dive.**

---

### [Agent-Driven Autonomous RL Research: Iterative Policy Improvement](https://arxiv.org/abs/2603.27416)

- **arXiv:** 2603.27416
- **Published:** 2026
- **Relevance:** GRAO (agent-driven research loop — read/diagnose/edit/launch/analyze)
- **Framework Score:** 8/10

Case study of an agent-driven research loop for quadruped locomotion. The execution flow (read code → diagnose failures → edit configs → launch jobs → analyze metrics) directly models GRAO's trace→gradient→proposal→apply cycle.

---

### [LLM Self-Improvement via Feedback Loops](https://arxiv.org/abs/2603.29632)

- **arXiv:** 2603.29632
- **Published:** 2026
- **Relevance:** GRAO (closed-loop self-improvement)
- **Framework Score:** 8/10

Structured LLM self-improvement through feedback cycles. Core GRAO mechanism: closed-loop improvement where execution traces feed gradient derivation feeding proposal synthesis.

---

### [ARISE: Agentic Reasoning with Iterative Self-Evaluation](https://arxiv.org/abs/2604.01437)

- **arXiv:** 2604.01437
- **Published:** 2026
- **Relevance:** GRAO (self-evaluation = gradient computation phase)
- **Framework Score:** 8/10

Agentic reasoning with iterative self-evaluation and correction. Models GRAO's gradient-derivation phase: self-evaluation generates the directional signal before proposals are synthesized.

---

## Reinforcement Learning and Training

### [Apriel-Reasoner: RL Post-Training for General-Purpose Reasoning](https://arxiv.org/abs/2604.02007)

- **arXiv:** 2604.02007
- **Published:** 2026
- **Relevance:** GRAO (RL post-training across heterogeneous domains)
- **Framework Score:** 8/10

RLVR post-training across diverse domains with per-domain gradient management. Directly maps to GRAO: domain-specific gradient accumulation with joint optimization, managing domain difficulty variance.

---

### [Agent Q-Mix: Selecting Right Action for LLM Multi-Agent Systems via RL](https://arxiv.org/abs/2604.00344)

- **arXiv:** 2604.00344
- **Published:** 2026
- **Relevance:** GRAO + GNW Phase 6 (cooperative MARL for topology optimization)
- **Framework Score:** 9/10

Reformulates multi-agent topology selection as cooperative MARL. Informs GRAO Phase 7 (Multi-Agent GRAO): gradient-guided optimization of agent topology, not just individual agent behavior.

---

### [GrandCode: Grandmaster Level Competitive Programming via Agentic RL](https://arxiv.org/abs/2604.02721)

- **arXiv:** 2604.02721
- **Published:** 2026
- **Relevance:** GRAO (agentic RL reaching expert-level performance milestone)
- **Framework Score:** 8/10

Multi-agent RL system achieving grandmaster-level competitive programming. Key GRAO milestone reference: demonstrates that agentic RL loops can reach expert human performance in constrained domains — validates the GRAO improvement ceiling.

---

## Knowledge and Experience Storage

### [Dynamic Dual-Granularity Skill Bank for Agentic RL](https://arxiv.org/abs/2603.28716)

- **arXiv:** 2603.28716
- **Published:** 2026
- **Relevance:** GRAO (dual-granularity experience store architecture)
- **Framework Score:** 9/10

D2Skill: task skills (high-level guidance) + step skills (fine-grained decision support). Maps directly to GRAO's experience store hierarchy: proposal-level patterns and trace-level primitives stored at different granularities.

---

### [SAKE: Structured Agentic Knowledge Extrapolation via RL](https://arxiv.org/abs/2505.15062)

- **arXiv:** 2505.15062
- **Published:** 2026
- **Relevance:** GRAO (experience store — extrapolation beyond replay)
- **Framework Score:** 9/10

RL-powered framework for structured knowledge extrapolation in specialized domains. Core GRAO reference: the experience store must extrapolate proven patterns to novel situations, not just replay past traces.

---

### [KAT-Coder-V2: Specialize-then-Unify Training Paradigm](https://arxiv.org/abs/2603.27703)

- **arXiv:** 2603.27703
- **Published:** 2026
- **Relevance:** GRAO (per-domain gradient specialization before unification)
- **Framework Score:** 7/10

"Specialize-then-Unify" paradigm via on-policy distillation. Informs GRAO Phase 5 (domain-specific gradient accumulation) and Phase 7 (multi-agent GRAO consolidation across agent specialties).

---

### [Curriculum Learning for Multi-Agent RL](https://arxiv.org/abs/2604.00442)

- **arXiv:** 2604.00442
- **Published:** 2026
- **Relevance:** GRAO (curriculum-aware gradient application)
- **Framework Score:** 7/10

Curriculum-driven MARL for progressive skill acquisition. Informs GRAO experience store ordering: curriculum-aware gradient application for progressive agent capability growth.

---

### [Reward Model Ensembles for Agent Alignment](https://arxiv.org/abs/2604.02460)

- **arXiv:** 2604.02460
- **Published:** 2026
- **Relevance:** GRAO (multi-signal gradient aggregation)
- **Framework Score:** 7/10

Reward ensembles reduce alignment brittleness. Informs GRAO gradient aggregation: multi-reward-model signals mirror GRAO's multi-source trace aggregation before proposal synthesis.

---

## Key Papers for Deep Dive

1. **Meta-Harness (2603.28052)** — closest implementation to GRAO, must-read
2. **Self-Evolving Survey (2507.21046)** — canonical framing reference
3. **D2Skill (2603.28716)** — experience store architecture design
4. **SAKE (2505.15062)** — extrapolation beyond replay
5. **Agent Q-Mix (2604.00344)** — MARL-based topology optimization for Phase 7

---

## Cycle 123 System State (2026-05-16)

- **GRAO exploration validated:** 16 exploration rounds triggered, 5 gradients validated (cross-cluster, non-reinforcement, trace-source, weight-redistribution, cluster-merging)
- **Active exploration proposals:** 10 targeting research-domain-expansion, cross-cluster-optimization, benchmarking-optimization, cron-scheduler-refinement, trace-collection-enhancement
- **Policy saturation gap:** resolved — 42+ consecutive reinforcement-only rounds → forced exploration → 100% success ratio on new gradients
- **System:** 123+ cycles, idle state, self-initiation pattern active
- **Next:** GRAO exploration proposals need application verification — are they being applied to the agent's behavior?
