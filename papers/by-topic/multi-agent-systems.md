# Multi-Agent Systems — Paper Catalog

Papers informing GNW Phase 6 (Cross-Agent Coordination), GRAO Phase 7 (Multi-Agent GRAO), and Clawstr cluster framework.

---

#### [CAMP — Case-Adaptive Multi-agent Panel](https://arxiv.org/abs/2604.00085)

- **arXiv:** 2604.00085
- **Authors:** Yuxing Lu et al.
- **Published:** 2026-03-31
- **Relevance:** GNW (drive competition) + TPG (case-adaptive routing)

**Why it matters:** Dynamically assembles specialist panels per-case diagnostic uncertainty. Three-valued voting (KEEP/REFUSE/NEUTRAL) with evidence-based arbitration — directly maps to GNW's drive-competition mechanism where drives compete for workspace access via the priority matrix. The case-adaptive router is functionally analogous to TPG's temporal routing: routing decisions based on uncertainty state rather than fixed rules.

**Framework relevance score:** 9/10

---

#### [OrgAgent — Company-style Hierarchical Multi-Agent](https://arxiv.org/abs/2604.01020)

- **arXiv:** 2604.01020
- **Authors:** Yiru Wang et al.
- **Published:** 2026-04-01
- **Relevance:** GNW Phase 6 (Cross-Agent Coordination) + Clawstr (organizational structure)

**Why it matters:** Separates collaboration into governance, execution, and compliance layers. Hierarchical coordination reduces token consumption while improving performance (102.73% improvement over flat multi-agent on SQuAD 2.0, 74.52% token reduction). Hierarchy helps most when tasks benefit from stable skill assignment, controlled information flow, and layered verification — directly relevant to the 5-agent OpenClaw fleet's organizational design.

**Framework relevance score:** 9/10

---

#### [HippoCamp — Benchmarking Contextual Agents on Personal Computers](https://arxiv.org/abs/2604.01221)

- **arXiv:** 2604.01221
- **Authors:** Zhe Yang, Shulin Tian, Chen Change Loy, Ziwei Liu et al.
- **Published:** 2026-04-01
- **Relevance:** GRAO (benchmarking) + TPG (contextual retrieval)

**Why it matters:** Evaluates agents on multimodal file management over real-world user profiles (42.4 GB across 2K+ files, 581 QA pairs, 46.1K annotated trajectories). Reveals significant performance gap: even advanced models achieve only 48.3% accuracy in user profiling. Step-wise failure diagnosis for granular agent evaluation — directly relevant to GRAO's trace quality assessment and benchmark cycle framework.

**Framework relevance score:** 8/10

---

#### [Agent Psychometrics — Task-level Performance Prediction](https://arxiv.org/abs/2604.00594)

- **arXiv:** 2604.00594
- **Authors:** Daria Kryvosheieva et al.
- **Published:** 2026-04-01
- **Relevance:** GRAO (benchmarking optimization) + GNW (drive health monitoring)

**Why it matters:** Augments Item Response Theory (IRT) with rich task features (issue statements, repo contexts, solutions, test cases). Decomposes agent ability into LLM and scaffold components. Enables cross-leaderboard aggregation and task-level performance prediction for unseen benchmarks — directly relevant to GRAO's adaptive benchmark cycle framework (exp_03 exploration proposal) and GNW's drive health monitoring.

**Framework relevance score:** 8/10

---

#### [Distributed Safety-Critical Control of Multi-Agent Systems](https://arxiv.org/abs/2604.00429)

- **arXiv:** 2604.00429
- **Authors:** Shiyu Cheng et al.
- **Published:** 2026-04-01
- **Relevance:** Clawstr (safety) + GNW (safety drive)

**Why it matters:** Distributed optimization-based control for multi-agent reach-avoid problems with time-varying communication topologies. Truncation function converts time-varying graph to smoothly state-dependent one. Auxiliary mismatch variables with two-time-scale dynamics decouple globally coupled constraints. Collision avoidance, connectivity preservation, and convergence guarantees — relevant to Clawstr's cluster safety and GNW's safety drive coordination.

**Framework relevance score:** 7/10

---

#### [RLHF — A Statistical Perspective](https://arxiv.org/abs/2604.02507)

- **arXiv:** 2604.02507
- **Authors:** Pangpang Liu et al.
- **Published:** 2026-04-02
- **Relevance:** GRAO (gradient formalism) + Clawstr (protocol design)

**Why it matters:** Comprehensive survey on RLHF from statistical perspective. Covers BTL model, latent utility estimation, active learning, experimental design, uncertainty quantification. Reviews reward function learning from pairwise preference data and policy optimization via two-stage and one-stage (DPO) pipelines. Extensions include RL from AI feedback, inference-time algorithms, RL from verifiable rewards — relevant to GRAO's gradient formalism and the constrained optimization layer.

**Framework relevance score:** 7/10

---

#### [Hallucination-as-Cue Framework](https://arxiv.org/abs/2604.03179)

- **arXiv:** 2604.03179
- **Authors:** Gengwei Zhang et al.
- **Published:** 2026-04-03
- **Relevance:** GNW (safety threat model) + GRAO (robustness)

**Why it matters:** Analytical framework investigating RL-based post-training effects on multimodal reasoning through hallucination-inductive modality-specific corruptions. Reveals that RL training under purely hallucination-inductive settings can still significantly improve reasoning performance — challenges prevailing assumptions about MLLM reasoning training. CVPR 2026. Relevant to GNW's safety threat model (hallucination as adversarial pressure) and GRAO's robustness layer.

**Framework relevance score:** 7/10

---

## Key Insight: Organizational Structure Matters

Two papers (CAMP and OrgAgent) converge on the same finding: **multi-agent performance is heavily dependent on organizational structure**, not just agent capability. CAMP shows case-adaptive panel assembly outperforms fixed roles; OrgAgent shows hierarchical organization outperforms flat collaboration by 102.73% while reducing tokens by 74.52%. This validates the 5-agent OpenClaw fleet's structured role assignment and priority matrix routing design.

---

#### [Phase-Scheduled Multi-Agent Systems (PSMAS)](https://arxiv.org/abs/2604.18234)

- **arXiv:** 2604.18234 (submitted April 2026)
- **Relevance:** GNW Phase 7 (drive decay) + GRAO (token efficiency)

**Why it matters:** Phase-scheduled coordination where agents activate within an angular window derived from task dependency topology. Idle agents receive compressed context summaries, reducing per-step token consumption. Directly relevant to GNW Phase 7 (drive decay during inactivity) and the idle agent state optimization — idle agents should receive compressed context rather than full state to reduce token waste.

**Framework relevance score:** 8/10

---

#### [Auditing Agent Harness Safety (HarnessAudit)](https://arxiv.org/abs/2605.14271)

- **arXiv:** 2605.14271
- **Authors:** Work in Progress
- **Published:** 2026-05-13
- **Relevance:** GNW (safety threat model) + Clawstr (cluster safety)

**Why it matters:** HarnessAudit proposes that agent safety evaluation must audit full execution trajectories rather than final outputs — because a harness can return a correct answer while internally accessing unauthorized resources, leaking context between agents, or triggering unintended side effects. Harness-Trajectory Gap in agent safety. HarnessAudit-Bench includes 210 tasks across eight real-world domains. Focus on multi-agent harnesses where these risks are most pronounced. Directly relevant to GNW's three-tier veto protocol and Clawstr's cluster safety coordination.

**Framework relevance score:** 9/10

---

#### [WildClawBench: A Benchmark for Real-World, Long-Horizon Agent Evaluation](https://arxiv.org/abs/2605.10912)

- **arXiv:** 2605.10912
- **Authors:** InternLM team
- **Published:** 2026-05-11
- **Relevance:** GRAO (benchmarking optimization) + GNW (drive health)

**Why it matters:** Benchmark with 8-minute wall-clock tasks, 20+ tool calls, Docker containers hosting real CLI agent harnesses (OpenClaw, Claude Code, Codex, Hermes) with real tools. Hybrid grading combining deterministic and human evaluation. Tests what actually matters: can an AI agent do real work, end-to-end, without hand-holding. Directly relevant to GRAO's adaptive benchmark cycle framework (exp_03 exploration proposal) — this is the closest real-world benchmark to the GNW boredom scan's own evaluation methodology. Results show long-horizon native-runtime agent evaluation remains far-from-resolved for current frontier models.

**Framework relevance score:** 8/10

---

## Harness Engineering Papers (Clawstr Relevance)

These papers directly address Clawstr's harness lifecycle gap.

---

#### [Harness Engineering as Categorical Architecture](https://arxiv.org/abs/2605.12239)

- **arXiv:** 2605.12239
- **Authors:** Work in Progress
- **Published:** 2026-05-12
- **Relevance:** Clawstr (harness lifecycle) + GRAO (gradient formalism)

**Why it matters:** Formal theory governing harness design — composition, preservation of properties under compilation, systematic comparison across frameworks. Uses the categorical Architecture triple (G, Know, Φ) from ArchAgents framework to formalize four pillars: Memory as coalgebraic state, Skills as operad-composed objects, Protocols as syntactic wiring, Harness Engineering as deployment maps. The agent harness (prompts, tools, memory, orchestration) as the central engineering abstraction for LLM-based agents. Directly relevant to Clawstr's harness lifecycle gap and GRAO's gradient formalism (harness design as optimization target).

**Framework relevance score:** 7/10

---

#### [AI Harness Engineering: A Runtime Substrate for Foundation-Model Software Agents](https://arxiv.org/abs/2605.13357)

- **arXiv:** 2605.13357
- **Authors:** Work in Progress
- **Published:** 2026-05-13
- **Relevance:** Clawstr (harness lifecycle) + GRAO (trace collection)

**Why it matters:** Proposes that software-engineering capability emerges from a model-harness-environment system, not from model capability alone. The runtime substrate — the harness — mediates how a foundation-model agent observes a project, acts on it, receives feedback, and establishes that a change is complete. Directly relevant to Clawstr's harness lifecycle gap and GRAO's trace collection (harness execution as optimization signal). This paper fundamentally challenges the assumption that agent capability = model capability.

**Framework relevance score:** 7/10

---

#### [Orchard: An Open-Source Agentic Modeling Framework](https://arxiv.org/abs/2605.15040)

- **arXiv:** 2605.15040
- **Authors:** Work in Progress
- **Published:** 2026-05-14
- **Relevance:** Clawstr (sandbox lifecycle) + GRAO (experiment framework)

**Why it matters:** Orchard Env provides a lightweight environment service for sandbox lifecycle management across task domains, agent harnesses, and pipeline stages. Kubernetes-native framework with decoupled environment service. Three agentic modeling recipes (Orchard-SWE for coding agents). Directly relevant to Clawstr's sandbox lifecycle gap and GRAO's experiment framework. Scalable agentic modeling with reusable primitives.

**Framework relevance score:** 7/10

---

#### [Is Grep All You Need? How Agent Harnesses Reshape Agentic Search](https://arxiv.org/abs/2605.15184)

- **arXiv:** 2605.15184
- **Authors:** Work in Progress
- **Published:** 2026-05-14
- **Relevance:** Clawstr (protocol design) + GRAO (trace collection)

**Why it matters:** Systematic comparison of how retrieval strategy choice interacts with agent architecture and tool-calling paradigm. Empirical study comparing grep vs vector retrieval on LongMemEval using custom agent harness (Chronos) and provider-native CLI harnesses (Claude Code, Codex, Gemini CLI). Key finding: programmatic file-based delivery reverses grep-versus-vector ranking unpredictably. Tool-calling brittleness in search results delivery. Relevant to Clawstr's protocol design gap and GRAO's trace collection (search strategy as optimization variable).

**Framework relevance score:** 6/10

---

### [Multi-Agent Scientific AI Evaluation Frameworks](https://arxiv.org/abs/2603.26718)

- **arXiv:** 2603.26718
- **Authors:** Marcin Abram
- **Published:** 2026-03-29
- **Relevance:** GNW Phase 6 + GRAO Phase 7 (multi-agent benchmarking)

Benchmarking multi-agent scientific systems — contamination, reasoning vs retrieval, replication challenges. Directly relevant to evaluating the 5-agent OpenClaw fleet. **Framework Score: 8/10**

---

### [EpochX — Infrastructure for Emergent Agent Civilization](https://arxiv.org/abs/2603.27304)

- **arXiv:** 2603.27304
- **Authors:** Huacan Wang et al.
- **Published:** 2026-03-27
- **Relevance:** GNW Phase 10 (Multi-Agent Orchestra)

Credits-native marketplace for agent coordination at scale. Informs GNW Phase 10: collective goal allocation, self-organizing multi-agent behavior, incentive-compatible drive competition. **Framework Score: 9/10**

---

### [Mimosa Framework — Evolving Multi-Agent Systems for Scientific Research](https://arxiv.org/abs/2603.28986)

- **arXiv:** 2603.28986
- **Authors:** Martin Legrand et al.
- **Published:** 2026-03-31
- **Relevance:** GRAO (evolving workflow synthesis)

Automatically synthesizes task-specific multi-agent workflows and iteratively refines them via experimental feedback using MCP. Core GRAO pattern: trace → gradient → synthesize → refine. **Framework Score: 8/10**

---

### [Multi-Agent Debate for Code Generation and Verification](https://arxiv.org/abs/2604.00200)

- **arXiv:** 2604.00200
- **Authors:** Multiple
- **Published:** 2026-04-01
- **Relevance:** GNW (debate → conflict resolution → priority arbitration)

Multi-agent debate protocol for code generation verification. Maps to GNW's conflict-resolution and priority arbitration mechanisms in the cognitive cycle. **Framework Score: 7/10**

---

### [Multi-Agent Video Recommenders — Evolution, Patterns, Challenges](https://arxiv.org/abs/2604.02211)

- **arXiv:** 2604.02211
- **Authors:** Srivaths Ranganathan et al.
- **Published:** 2026-04-03
- **Relevance:** GNW Phase 6 (multi-agent serve/learn/adapt pattern)

Multi-agent architectures for dynamic recommendation. Informs GNW Phase 6 collective behavior patterns: how agents in a fleet serve, learn from interactions, and adapt to changing user/environment signals. **Framework Score: 6/10**

---

## Backlog for Next Pass

Remaining uncatalogued IDs in `processed_arxiv_ids.txt`: ~481 (19 catalogued above). Priority next pass:
1. Scan for papers on drive decay during inactivity (GNW Phase 7 gap)
2. Scan for papers on domain-specific gradient routing (GRAO Phase 5 gap)
3. Scan for papers on temporal prediction graphs (TPG theoretical gap)
4. Scan for papers on agent quota/resource enforcement (Clawstr gap)
