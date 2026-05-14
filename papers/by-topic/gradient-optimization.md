# Gradient Optimization and Research Direction

Papers informing GRAO's gradient computation, TPG's temporal prediction logic, and research steering.

---

## Gradient Formalism

### [Textual Gradients (TextGrad)](https://arxiv.org/abs/2406.07496)

- **arXiv:** 2406.07496
- **Relevance:** GRAO (gradient formalism — text-space gradients)
- **Framework Score:** 10/10

Demonstrates that "gradients" can be computed over text and used to steer LLM behavior — the conceptual basis for GRAO computing directional gradients over natural-language execution traces. **Foundational GRAO reference.**

---

### [Predictive Processing (Friston Free-Energy Principle)](https://www.fil.ion.ucl.ac.uk/~karl/The%20free-energy%20principle%20-%20a%20unified%20brain%20theory.pdf)

- **Authors:** Friston
- **Published:** 2010
- **Relevance:** GRAO (gradient = prediction-error minimization)
- **Framework Score:** 9/10

Prediction-error signals as gradient signals. GRAO directional gradients are functionally analogous to Friston's prediction-error minimization: each gradient points from current performance toward reduced surprise.

---

## Optimization Techniques

### [Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052)

- **arXiv:** 2603.28052
- **Published:** 2026
- **Relevance:** GRAO (10M token execution trace as optimization signal)
- **Framework Score:** 10/10

Filesystem-based optimization with full execution traces — 10M token context vs 26K for other methods. Directly relevant to GRAO's trace-collection and gradient-derivation pipeline. Shows that filesystem-traversal (grep/cat) over accumulated traces is a viable optimization signal source.

---

### [Reward Model Ensembles for Agent Alignment](https://arxiv.org/abs/2604.02460)

- **arXiv:** 2604.02460
- **Published:** 2026
- **Relevance:** GRAO (multi-signal gradient aggregation)
- **Framework Score:** 8/10

Ensembling reward models reduces alignment brittleness. Informs GRAO gradient aggregation: combining signals from multiple evaluation models mirrors multi-source trace aggregation before proposal synthesis.

---

### [Corruption-robust Offline MARLHF](https://arxiv.org/abs/2603.28281)

- **arXiv:** 2603.28281
- **Published:** 2026
- **Relevance:** GRAO (robustness against trace corruption)
- **Framework Score:** 7/10

Robustness against data corruption in multi-agent reinforcement learning from human feedback. Informs GRAO's gradient pipeline tolerance to corrupted or adversarially manipulated traces.

---

## Agent Research Loops

### [Agent-Driven Autonomous RL Research: Iterative Policy Improvement](https://arxiv.org/abs/2603.27416)

- **arXiv:** 2603.27416
- **Published:** 2026
- **Relevance:** GRAO (closed-loop research cycle)
- **Framework Score:** 9/10

Agent-driven research loop for quadruped locomotion. The execution flow (read → diagnose → edit → launch → analyze) directly models GRAO's cycle: trace collection → gradient derivation → proposal synthesis → apply.

---

### [Mimosa Framework: Evolving Multi-Agent Workflows](https://arxiv.org/abs/2603.28986)

- **arXiv:** 2603.28986
- **Published:** 2026
- **Relevance:** GRAO (workflow synthesis + iterative refinement)
- **Framework Score:** 9/10

Automatic synthesis and iterative refinement of multi-agent workflows via experimental feedback. Models GRAO at the workflow level: the gradient drives workflow topology changes, not just parameter updates.

---

## Temporal Prediction and Graph Routing (TPG)

### [ReasonGraph: Structured Reasoning via Dynamic Computation Graphs](https://arxiv.org/abs/2604.02006)

- **arXiv:** 2604.02006
- **Published:** 2026
- **Relevance:** TPG (dynamic computation graph = temporal prediction graph)
- **Framework Score:** 9/10

Dynamic computation graphs for structured reasoning chains. Core TPG reference: temporal prediction graphs are dynamic computation graphs whose topology emerges from execution context rather than being pre-specified.

---

### [Chain-of-Tools: Dynamic Tool Chain Planning](https://arxiv.org/abs/2604.02652)

- **arXiv:** 2604.02652
- **Published:** 2026
- **Relevance:** TPG (sequential routing chains)
- **Framework Score:** 9/10

Dynamic tool chain planning for multi-step queries. Core TPG reference: tool chains are temporal prediction graphs where each step's output conditions the next routing decision — TPG makes this predictive rather than reactive.

---

### [From Inference Routing to Agent Orchestration](https://arxiv.org/abs/2603.27299)

- **arXiv:** 2603.27299
- **Published:** 2026
- **Relevance:** TPG (declarative routing policy + audit traces)
- **Framework Score:** 8/10

Semantic Router DSL for per-request LLM routing. Informs TPG's declarative routing policy, cross-layer verification, and structured audit trace generation — all three components that TPG extends to temporal prediction.

---

### [Hierarchical Agent Planning with Temporal Abstraction](https://arxiv.org/abs/2604.01787)

- **arXiv:** 2604.01787
- **Published:** 2026
- **Relevance:** TPG (temporal abstraction hierarchy)
- **Framework Score:** 8/10

Hierarchical planning across multiple time scales. Directly informs TPG's temporal prediction hierarchy: short-horizon routing decisions (per-step tool selection) nested within long-horizon goal pursuit (multi-session task completion).

---

### [ToolFlow: Generalizable Tool-Augmented Agent](https://arxiv.org/abs/2603.29426)

- **arXiv:** 2603.29426
- **Published:** 2026
- **Relevance:** TPG (dynamic tool routing)
- **Framework Score:** 7/10

Generalizable tool-augmented agent with dynamic tool selection. Informs TPG's routing decisions for tool invocation ordering, dependency resolution, and fallback paths.

---

### [Agentic Tool Use in Large Language Models](https://arxiv.org/abs/2604.00835)

- **arXiv:** 2604.00835
- **Published:** 2026
- **Relevance:** TPG + Clawstr (tool-use paradigm taxonomy)
- **Framework Score:** 7/10

Organizes tool-use into three paradigms: prompting, supervised learning, RL-based. Informs Clawstr's tool registration design and TPG's decisions about which paradigm applies per tool class.

---

## Key Papers for Deep Dive

1. **TextGrad (2406.07496)** — foundational, defines gradient formalism for text
2. **Meta-Harness (2603.28052)** — closest existing GRAO implementation
3. **ReasonGraph (2604.02006)** — core TPG dynamic graph reference
4. **Chain-of-Tools (2604.02652)** — TPG sequential routing reference
