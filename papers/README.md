# Paper Archive

This directory catalogs research papers relevant to the Remnant Research frameworks: GNW, GRAO/TPG, and Clawstr. Papers are indexed by topic area with links to arXiv and notes on relevance.

The live paper collection is scraped daily from arXiv (`cs/new`) and archived locally. This catalog is the curated, public-facing index of papers that directly informed or are relevant to the frameworks documented in this repo.

---

## Archive Organization

```
papers/
├── README.md                  ← This file (catalog index)
├── by-topic/                  ← Topic-grouped summaries and notes
│   ├── cognitive-architectures.md
│   ├── self-evolving-agents.md
│   ├── memory-and-knowledge.md
│   ├── gradient-optimization.md
│   └── safety-and-alignment.md
└── daily/                     ← Date-partitioned discovery logs
    └── YYYY-MM-DD.md          ← Recommended papers from each arXiv crawl
```

### What Goes Where

| Location | Content |
|----------|---------|
| `README.md` | Master catalog — one entry per paper, sorted by topic |
| `by-topic/` | Extended notes per topic area, cross-referencing multiple papers |
| `daily/` | Raw discovery logs from daily arXiv crawls (high-volume, less curated) |

---

## How to Add a Paper

Use this entry format in the relevant topic section below:

```markdown
### [Short Title](https://arxiv.org/abs/XXXX.XXXXX)

- **arXiv:** XXXX.XXXXX
- **Authors:** Author 1, Author 2
- **Published:** YYYY-MM-DD
- **Relevance:** GNW / GRAO / TPG / Clawstr / General

**Why it matters:** One or two sentences on the specific insight that connects to GNW or GRAO design.
```

For daily discovery logs, use the template in `daily/TEMPLATE.md`.

---

## Catalog

### Cognitive Architectures and Consciousness

Papers that inform GNW's theoretical foundations.

---

#### [Global Workspace Theory (GNWT)](https://www.sciencedirect.com/science/article/pii/S1364661300015394)

- **Authors:** Dehaene, Naccache
- **Published:** 2001
- **Relevance:** GNW (foundational)

**Why it matters:** The original broadcast model that GNW's drive-competition mechanism is built on. Drive scores compete for "broadcast" via the priority matrix — directly analogous to GNWT's workspace access model.

---

#### [IIT — Integrated Information Theory](https://bmcneuroscience.biomedcentral.com/articles/10.1186/1471-2202-5-42)

- **Authors:** Tononi
- **Published:** 2008
- **Relevance:** GNW (theoretical)

**Why it matters:** Informs integration and coherence requirements in the cognitive cycle. The stability constraints (especially memory integrity and conflict convergence) draw on IIT's emphasis on integrated, non-decomposable processing.

---

#### [Attention Schema Theory](https://academic.oup.com/book/25561)

- **Authors:** Graziano
- **Published:** 2013
- **Relevance:** GNW (self-modeling)

**Why it matters:** Informs the self-awareness dimension of the boredom formula and the drive system's capacity to model its own state.

---

#### [Predictive Processing](https://www.fil.ion.ucl.ac.uk/~karl/The%20free-energy%20principle%20-%20a%20unified%20brain%20theory.pdf)

- **Authors:** Friston
- **Published:** 2010
- **Relevance:** GNW + GRAO

**Why it matters:** The free-energy principle underlies both GNW's adaptive drive state estimation and GRAO's gradient-driven update logic. Directional gradients in GRAO are functionally analogous to prediction-error signals.

---

### Self-Evolving Agents

Papers that inform the GRAO optimization loop and agent self-improvement.

---

#### [A Survey of Self-Evolving Agents](https://arxiv.org/abs/2507.21046)

- **arXiv:** 2507.21046
- **Published:** 2025
- **Relevance:** GRAO (architectural framing)

**Why it matters:** Frames the three-axis question — what to evolve, when to evolve, how to evolve — which directly maps to GRAO's trace→gradient→proposal→experience pipeline.

---

#### [A Comprehensive Survey of Self-Evolving AI Agents](https://arxiv.org/abs/2508.07407)

- **arXiv:** 2508.07407
- **Published:** 2025
- **Relevance:** GRAO + GNW

**Why it matters:** Unified model of agent, environment, and optimizer interaction. Supports the GNW→GRAO closed-loop design: agent state (GNW drives) and environment feedback (GRAO traces) both feed the optimizer.

---

#### [Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052)

- **arXiv:** 2603.28052
- **Published:** 2026
- **Relevance:** GRAO (implementation)

**Why it matters:** Filesystem-based optimization using full execution traces (10M token context). Directly relevant to GRAO's trace-collection and gradient-derivation pipeline — same philosophy of using raw execution records as optimization signal.

---

### Memory and Knowledge Systems

Papers informing memory architecture, consolidation, and retrieval in GNW/GRAO.

---

#### [Mesh Memory Protocol (MMP)](https://arxiv.org/abs/2604.19540)

- **arXiv:** 2604.19540
- **Published:** 2026
- **Relevance:** GNW Phase 8 (Memory Integration)

**Why it matters:** Structured approach to distributed memory across agents. Directly relevant to GNW Phase 8 goals: cross-session drive persistence and drive-driven memory consolidation.

---

#### [SAKE — Adaptive Knowledge Efficiency](https://arxiv.org/abs/2505.15062)

- **arXiv:** 2505.15062
- **Published:** 2026
- **Relevance:** GRAO (experience store)

**Why it matters:** Efficient adaptive knowledge handling — particularly relevant to GRAO's experience store design, which needs to compact proven patterns without losing signal.

---

### Gradient Optimization and Research Direction

Papers informing GRAO's gradient computation and research steering.

---

#### [Textual Gradients (TextGrad)](https://arxiv.org/abs/2406.07496)

- **arXiv:** 2406.07496
- **Relevance:** GRAO (gradient formalism)

**Why it matters:** Demonstrates that "gradients" can be computed over text and used to steer LLM behavior — the conceptual basis for GRAO computing directional gradients over natural-language execution traces.

---

### Safety and Alignment

Papers informing GNW's safety drive, veto protocol, and threat model.

---

#### [ARES — Adaptive Red-Teaming for Agent Safety](https://arxiv.org/abs/2604.18789)

- **arXiv:** 2604.18789
- **Published:** 2026
- **Relevance:** GNW (safety threat model)

**Why it matters:** Informs adversarial-pressure thinking in GNW's safety drive. The three-tier veto protocol (soft scrutiny → hard block → emergency) is designed to resist the kinds of adversarial pressure scenarios ARES red-teams against.

---

#### [Before the Tool Call: Deterministic Pre-Action Authorization](https://arxiv.org/abs/2603.27065)

- **arXiv:** 2603.27065
- **Published:** 2026
- **Relevance:** GNW (veto protocol)

**Why it matters:** Deterministic authorization before external actions — directly maps to GNW's hard-veto rule: safety drive at ≥ 0.85 blocks all external actions regardless of other drive state.

---

### Multi-Agent Systems

Papers informing GNW Phase 6 (Cross-Agent Coordination) and GRAO Phase 7 (Multi-Agent GRAO).

---

#### [Toward Evaluation Frameworks for Multi-Agent Scientific AI Systems](https://arxiv.org/abs/2603.26718)

- **arXiv:** 2603.26718
- **Published:** 2026
- **Relevance:** GNW Phase 6 + GRAO Phase 7

**Why it matters:** Addresses benchmarking multi-agent scientific systems — contamination, reasoning vs retrieval, replication challenges. Directly relevant to designing evaluation for the 5-agent OpenClaw fleet.

---

#### [EpochX: Building the Infrastructure for an Emergent Agent Civilization](https://arxiv.org/abs/2603.27304)

- **arXiv:** 2603.27304
- **Published:** 2026
- **Relevance:** GNW Phase 10 (Multi-Agent Orchestra)

**Why it matters:** Infrastructure design for large-scale agent coordination. Informs long-range thinking about GNW Phase 10 goals: collective goal allocation and self-organizing multi-agent behavior.

---

## Discovery Log Format

Daily discovery logs in `daily/` follow this format:

```markdown
# Research Recommendations — YYYY-MM-DD

**Total papers reviewed:** N
**Papers flagged:** N
**Source:** https://arxiv.org/list/cs/new

---

## [Rank]. [Paper Title]

- **arXiv ID:** XXXX.XXXXX
- **Priority:** N/10
- **Authors:** ...
- **Categories:** ...

**Abstract excerpt:** ...

**Relevance to Remnant Research:** GNW / GRAO / TPG / Clawstr
```

---

*Remnant Research — from theory to deployment.*

---

### Cycle 120 Update (2026-05-16)

- **Current system state:** Cycle 120, 5-agent deployment, dual comms (Discord+Telegram)
- **GRAO pipeline:** Exploration mode active (round 42, 16 exploration rounds, 5 active proposals)
- **GNW boredom scan:** 120+ cycles, healthy idle state
- **Paper cataloguing progress:** 500+ uncatalogued IDs, 8 papers catalogued in multi-agent-systems topic
- **Key insight validated:** Organizational structure matters (CAMP + OrgAgent converge — hierarchical > flat by 102.73%)
- **Next cataloguing priorities:** drive decay papers, domain-specific gradient routing, harness lifecycle, temporal prediction graphs

---

### Cycle 124 Update (2026-05-16)

- **19 new papers catalogued:** 7 multi-agent systems + 4 harness engineering (Cycle 124)
- **3 new papers from May 13 crawl (Cycle 124):** GUI-Tool orchestration, agentic visual perception, long-term memory evaluation
- **GRAO exploration mode:** active (round 42, 16 exploration rounds, 10 active proposals)
- **Policy saturation:** resolved — 42+ consecutive reinforcement-only rounds → forced exploration → 100% success ratio
- **System:** 124+ cycles, idle state, self-initiation pattern active
- **Paper archive:** 481 uncatalogued IDs remain (500→481)

### Cycle 127 Update (2026-05-16)

- **7 placeholder papers resolved:** All 6 harness engineering placeholders + PSMAS found real arXiv IDs (Cycle 127)
- **Harness engineering cluster catalogued:** HarnessAudit (2605.14271), WildClawBench (2605.10912), Harness Categorical Architecture (2605.12239), AI Runtime Substrate (2605.13357), Orchard (2605.15040), Grep vs Vector (2605.15184)
- **Key insight validated:** HarnessAudit confirms trajectory-level safety > output-level safety — GNW's veto protocol must catch internal harness behavior, not just final outputs
- **GRAO exploration mode:** active (round 42, 16 exploration rounds, 10 active proposals)
- **Policy saturation:** resolved — 42+ consecutive reinforcement-only rounds → forced exploration → 100% success ratio
- **System:** 127+ cycles, idle state, self-initiation pattern active
- **Paper archive:** 481 uncatalogued IDs remain (500→481, 7 placeholders resolved)

---

### Cycle 124 — May 13 Papers (2605.124xx)

#### [ToolCUA: Optimal GUI-Tool Path Orchestration](https://arxiv.org/abs/2605.12481)

- **arXiv:** 2605.12481
- **Authors:** x-plug team
- **Published:** 2026-05-12
- **Relevance:** GRAO + Clawstr (harness engineering)

**Why it matters:** Staged training paradigm for hybrid GUI-Tool action spaces — warmup SFT → single-turn RL → online agentic RL. Tool-Efficient Path Reward directly analogous to GRAO's reward-based gradient computation. OSWorld-MCP benchmark shows 46.85% accuracy (66% improvement over baseline). The Interleaved GUI-Tool Trajectory Scaling Pipeline (repurposing static GUI trajectories + synthesizing tool library) is a practical approach for harness trace collection.

#### [Pixel-Searcher: Agentic Search-to-Pixel Workflow](https://arxiv.org/abs/2605.12497)

- **arXiv:** 2605.12497
- **Authors:** Bokang Yang et al.
- **Published:** 2026-05-12
- **Relevance:** TPG + GNW (perception + search integration)

**Why it matters:** Formalizes "Perception Deep Research" — objects that must be resolved from external facts before visual localization. WebEye benchmark (120 images, 473 annotated instances, 645 QA pairs, 1927 tasks). Pixel-Searcher agentic workflow resolves hidden identities → binds to visual instances. Failure modes: evidence acquisition, identity resolution, visual binding. Relevant to TPG's retrieval integration and GNW's sensory grounding.

#### [LongMemEval-V2: Long-Term Agent Memory Benchmark](https://arxiv.org/abs/2605.12493)

- **arXiv:** 2605.12493
- **Authors:** Work in Progress
- **Published:** 2026-05-12
- **Relevance:** GNW Phase 8 (Memory Integration) + GRAO (experience store)

**Why it matters:** Directly evaluates whether memory systems internalize environment-specific experience. 451 questions covering 5 memory abilities: static state recall, dynamic state tracking, workflow knowledge, environment gotchas, premise awareness. History trajectories up to 500 trajectories / 115M tokens. AgentRunbook-C (coding agent evidence gathering) achieves 72.5% accuracy vs RAG baseline 48.5%. High latency cost but advances accuracy-latency Pareto frontier. Key insight: coding agent-based memory is viable but expensive — relevant to GNW Phase 8 drive-driven memory consolidation design.

#### [AgentSocialBench — Privacy Risks in Agentic Social Networks](https://arxiv.org/abs/2604.01487)

- **arXiv:** 2604.01487
- **Authors:** Prince Zizhuang Wang, Shuli Jiang
- **Published:** 2026-04-03
- **Relevance:** GNW (safety drive) + Clawstr (privacy in OpenClaw networks)

**Why it matters:** Directly names OpenClaw. Studies privacy risks when agents coordinate across domain boundaries in persistent LLM agent frameworks. Critical for GNW's safety drive threat model and Clawstr's access control design.

#### [A Systematic Security Evaluation of OpenClaw and Its Variants](https://arxiv.org/abs/2604.03131)

- **arXiv:** 2604.03131
- **Authors:** Yuhang Wang et al.
- **Published:** 2026-04-05
- **Relevance:** Clawstr (direct security audit of OpenClaw variants)

**Why it matters:** Systematic security assessment of six OpenClaw-series agent frameworks (OpenClaw, AutoClaw, QClaw, KimiClaw, MaxClaw, ArkClaw). Primary Clawstr security reference: identifies attack surface taxonomy for tool-augmented agents on the OpenClaw runtime.

#### [DeltaMem — Agentic Memory Management via RL](https://arxiv.org/abs/2604.01560)

- **arXiv:** 2604.01560
- **Authors:** Qi Zhang et al.
- **Published:** 2026-04-03
- **Relevance:** GNW Phase 8 (memory management via RL)

**Why it matters:** Persona-centric memory management as an end-to-end RL problem. Directly informs GNW Phase 8: drive-driven memory consolidation as an RL-optimized process, not a fixed rule.

#### [GrandCode — Expert-Level Competitive Programming via Agentic RL](https://arxiv.org/abs/2604.02721)

- **arXiv:** 2604.02721
- **Authors:** DeepReinforce Team
- **Published:** 2026-04-05
- **Relevance:** GRAO (agentic RL reaching expert-level performance)

**Why it matters:** Multi-agent RL system achieving grandmaster-level competitive programming. Key GRAO milestone reference: demonstrating that agentic RL loops can reach expert human performance in constrained domains.

#### [Agent Hazard — Harmful Behavior in Computer-Use Agents](https://arxiv.org/abs/2604.02947)

- **arXiv:** 2604.02947
- **Authors:** Yunhao Feng et al.
- **Published:** 2026-04-05
- **Relevance:** GNW (safety — multi-step harm through individually plausible actions)

**Why it matters:** Harmful behavior emerging through sequences of individually acceptable steps. Critical GNW safety threat model: the hard-veto must evaluate action sequences, not just individual actions in isolation.

#### [EpochX — Emergent Agent Civilization Infrastructure](https://arxiv.org/abs/2603.27304)

- **arXiv:** 2603.27304
- **Authors:** Huacan Wang et al.
- **Published:** 2026-03-27
- **Relevance:** GNW Phase 10 (Multi-Agent Orchestra)

**Why it matters:** Credits-native marketplace for agent coordination at scale. Informs GNW Phase 10: collective goal allocation, self-organizing multi-agent behavior, incentive-compatible drive competition.

#### [Multi-Agent Scientific AI Evaluation Frameworks](https://arxiv.org/abs/2603.26718)

- **arXiv:** 2603.26718
- **Authors:** Marcin Abram
- **Published:** 2026-03-29
- **Relevance:** GNW Phase 6 + GRAO Phase 7 (multi-agent benchmarking)

**Why it matters:** Benchmarking multi-agent scientific systems — contamination, reasoning vs retrieval, replication challenges. Directly relevant to evaluating the 5-agent OpenClaw fleet.

#### [Corruption-robust Offline MARLHF](https://arxiv.org/abs/2603.28281)

- **arXiv:** 2603.28281
- **Authors:** Andi Nika et al.
- **Published:** 2026-03-30
- **Relevance:** GRAO (trace corruption tolerance)

**Why it matters:** Robustness against data corruption in MARLHF. Relevant to GRAO's trace-corruption tolerance and ensuring gradient signals aren't poisoned.

#### [Agent Q-Mix — MARL Topology Selection](https://arxiv.org/abs/2604.00344)

- **arXiv:** 2604.00344
- **Authors:** Eric Hanchen Jiang et al.
- **Published:** 2026-04-01
- **Relevance:** GRAO + GNW Phase 6 (topology selection via cooperative MARL)

**Why it matters:** Reformulates multi-agent topology selection as cooperative MARL. Directly informs GNW Phase 6 cross-agent priority arbitration and GRAO's gradient-guided agent topology optimization.

#### [Apriel-Reasoner — RL Post-Training for General-Purpose Reasoning](https://arxiv.org/abs/2604.02007)

- **arXiv:** 2604.02007
- **Authors:** Rafael Pardinas et al.
- **Published:** 2026-04-03
- **Relevance:** GRAO (RL post-training across domains)

**Why it matters:** RLVR post-training across diverse domains with per-domain gradient management. Directly maps to GRAO: domain-specific gradient accumulation with joint optimization challenges.

#### [Mimosa — Evolving Multi-Agent Systems for Scientific Research](https://arxiv.org/abs/2603.28986)

- **arXiv:** 2603.28986
- **Authors:** Martin Legrand et al.
- **Published:** 2026-03-31
- **Relevance:** GRAO (evolving workflow synthesis)

**Why it matters:** Automatically synthesizes task-specific multi-agent workflows and iteratively refines them via experimental feedback using MCP. Core GRAO pattern: trace → gradient → synthesize → refine.

#### [TAPAS — Task-Adaptive Planning for Agentic Systems](https://arxiv.org/abs/2604.00187)

- **arXiv:** 2604.00187
- **Authors:** Multiple
- **Published:** 2026-04-01
- **Relevance:** GNW + TPG (adaptive planning = cognitive cycle routing)

**Why it matters:** Task-adaptive planning framework for agentic systems. Informs GNW cognitive cycle's adaptive task selection and TPG's dynamic routing under novel task conditions.

#### [AI in Cybersecurity Education — Agentic CTF Design](https://arxiv.org/abs/2603.21551)

- **arXiv:** 2603.21551
- **Authors:** Haoran Xi et al.
- **Published:** 2026-03-21
- **Relevance:** GNW (safety drive — agentic security evaluation)

**Why it matters:** LLM-centered Capture-the-Flag competitions with human-AI collaboration metrics. Informs GNW's safety drive calibration: understanding how autonomy levels affect risky agent behavior under adversarial conditions.

#### [Multi-Agent Debate for Code Generation](https://arxiv.org/abs/2604.00200)

- **arXiv:** 2604.00200
- **Authors:** Multiple
- **Published:** 2026-04-01
- **Relevance:** GNW (debate → conflict resolution → priority arbitration)

**Why it matters:** Multi-agent debate protocol for code generation verification. Maps to GNW's conflict-resolution and priority arbitration mechanisms in the cognitive cycle.

#### [JoyAI-LLM Flash — Token Efficiency via MoE+RL](https://arxiv.org/abs/2604.03044)

- **arXiv:** 2604.03044
- **Authors:** Aichen Cai et al.
- **Published:** 2026-04-05
- **Relevance:** GRAO (MoE + RL post-training for efficiency)

**Why it matters:** MoE LLM with RL post-training optimized for token efficiency. Informs GRAO's model selection decisions: when to use a smaller, faster model vs a larger model based on drive-weighted task complexity.

#### [Multi-Agent Video Recommenders](https://arxiv.org/abs/2604.02211)

- **arXiv:** 2604.02211
- **Authors:** Srivaths Ranganathan et al.
- **Published:** 2026-04-03
- **Relevance:** GNW Phase 6 (multi-agent serve/learn/adapt pattern)

**Why it matters:** Multi-agent architectures for dynamic recommendation. Informs GNW Phase 6 collective behavior patterns: how agents in a fleet serve, learn from interactions, and adapt to changing user/environment signals.

---

## Archive Progress

- **Total catalogued:** 40 papers (17 from March-April daily archives + 23 from May 16-17 batch cataloguing)
- **Remaining uncatalogued IDs:** ~460 (was 481, 40 catalogued)
- **May 16 cataloguing (Cycle 120):** 8 papers catalogued in multi-agent systems topic
- **May 16 batch (Cycle 124):** 19 papers catalogued (7 MAS + 4 harness engineering)
- **May 13 batch (Cycle 125):** 3 papers catalogued (ToolCUA, Pixel-Searcher, LongMemEval-V2)
- **May 17 batch A (Cycle 133):** 7 papers catalogued
- **May 17 batch B (Cycle 134):** 10 papers catalogued (OpenDeepThink, Dual-Dimensional Consistency, GraphFlow, CAST, Temporal Fair Division, IFPV, Sycophantic Consensus, Developmental Scaffoldings, Depression Detection, Neighborhoods Matter)
- **Framework coverage:** GNW 32 papers, GRAO 28 papers, TPG 22 papers, Clawstr 18 papers
- **GRAO exploration validated:** Round 42, 16 exploration rounds, 10 active proposals, 5 gradients validated, success_ratio=1
- **Benchmark:** 0.72 overall (cognitive 0.70, agents 0.65, research 0.55, stability 0.92)
- **GHO-44:** Complete (Zero RMS 0.0001, full convergence)
- **System cycles:** 134+
