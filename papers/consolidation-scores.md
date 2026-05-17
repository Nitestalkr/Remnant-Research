# Framework Consolidation Scores

Tracks the depth of paper coverage per Remnant Research framework. Score reflects: number of cataloged papers × average framework-relevance score, normalized to 0–100.

Last updated: 2026-05-17 (Cycle 134)

### Cycle 124 Update (2026-05-16)
- **3 new papers catalogued (May 13 crawl):** ToolCUA (GUI-Tool orchestration, GRAO+Clawstr), Pixel-Searcher (agentic perception, TPG+GNW), LongMemEval-V2 (long-term memory, GNW Phase 8+GRAO)
- **Paper count updates:** GNW 18→19 (+LongMemEval-V2 for Phase 8), GRAO 16→17 (+ToolCUA for harness engineering), TPG 10→11 (+Pixel-Searcher for retrieval), Clawstr 11→12 (+ToolCUA)
- **GRAO exploration validated:** 16 exploration rounds, 5 gradients validated, 10 active proposals
- **Policy saturation:** resolved — 42+ consecutive reinforcement-only rounds → forced exploration → 100% success ratio
- **Paper archive:** 481 uncatalogued IDs remain (500→481)
- **System:** 124+ cycles, idle state

---

## Cycle 134 Update (2026-05-17)
- **8 new papers catalogued (May 17 discovery):** MASPO (joint prompt optimization, GRAO+TPG), The Cost of Consensus (multi-agent debate, GNW), MEME (multi-entity memory eval, GNW Phase 8), GraphRAG neighborhoods (agentic retrieval, TPG), SAGE (sign-adaptive gradient, GRAO), Agentic AI Higher Education (goal-directed agents, GNW), Planner Matters (long-horizon planning, GNW+GRAO)
- **Paper count updates:** GNW 22→32 (+10 from May 17 batch B), GRAO 20→28 (+10), TPG 14→22 (+8), Clawstr 14→18 (+4)
- **GRAO exploration:** Round 42, 16 exploration rounds, 10 active proposals, 5 gradients validated
- **Paper archive:** 464 uncatalogued IDs remain (481→474→464)
- **May 17 batch B highlights:** OpenDeepThink (parallel reasoning via Bradley-Terry, +405 Elo), Dual-Dimensional Consistency (10x token reduction), GraphFlow (formally verifiable workflows), Temporal Fair Division (RP metrics), CAST (case-based tool use calibration), Sycophantic Consensus (alignment failure mode)
- **System:** 132+ cycles, idle state

---

## Cycle 135 Update (2026-05-17)
- **5 new papers catalogued (May 17 discovery scan):** Oblivion (2604.00131), AgentFlow (2510.05592), HarnessAudit (2605.14271 - reinforcement), Clawdbot Audit (2602.14364)
- **Paper count updates:** GNW 32→35 (+3: Oblivion for Phase 7, Clawdbot for safety, AgentFlow for Phase 7), GRAO 28→30 (+2: AgentFlow, Oblivion), TPG 22→23 (+1: AgentFlow), Clawstr 18→20 (+2: HarnessAudit, Clawdbot)
- **GNW Phase 7 gap filled:** Oblivion (2604.00131) — decay-driven memory control framework directly addresses drive decay during inactivity
- **GRAO exp_04 validation:** AgentFlow (2510.05592) — in-the-flow optimization validates GRAO's trace→gradient→proposal pipeline
- **Key insight:** Oblivion's decay-driven accessibility maps to GNW's drive-score decay model; decoupled read/write maps to drive-competition
- **Paper archive:** 459 uncatalogued IDs remain (464→459)
- **System:** 135+ cycles, idle state

---

## Cycle 120 Update (2026-05-16)
- **GRAO exploration validated:** multi-agent-systems cataloguing confirmed CAMP+OrgAgent convergence (hierarchical > flat by 102.73%, 74.52% token reduction)
- **Paper count updates:** GNW 18→18 (CAMP already scored), GRAO 16→16, TPG 10→10, Clawstr 11→11 (new multi-agent papers cross-scored)
- **Cross-framework insight:** organizational structure is a first-class variable in multi-agent performance — not just agent capability
- **Next pass priorities:** drive decay papers, domain-specific gradient routing, harness lifecycle, temporal prediction graphs

---

## Scoring Methodology

Each paper is assigned a **framework relevance score** (1–10) per the by-topic files. Consolidation score per framework = `(Σ relevance scores / max possible) × 100`.

| Score | Meaning |
|-------|---------|
| 80–100 | Deep coverage — multiple high-quality references at each design layer |
| 60–79 | Solid coverage — main design choices have paper support |
| 40–59 | Partial coverage — core theory covered, gaps in implementation |
| 20–39 | Sparse coverage — 1–2 foundational references only |
| 0–19 | Gap — framework lacks external paper grounding |

---

## GNW — Global Neuronal Workspace

**Consolidation Score: 82 / 100**

| Layer | Papers | Avg Score | Notes |
|-------|--------|-----------|-------|
| Foundational theory | GNWT (Dehaene 2001), IIT (Tononi 2008), Attention Schema (Graziano 2013) | 8.3 | Classic neuroscience literature — well-grounded |
| Drive competition | CAMP (2604.00085), NAMO (2604.01354), Agent Q-Mix (2604.00344) | 8.3 | Multi-objective arbitration well-covered |
| Safety/veto | Before the Tool Call (2603.27065), AgentHazard (2604.02947), ARES (2604.18789) | 9.3 | Strongest coverage area |
| Phase 6 coordination | Shared Mental Models (2603.29247), Drive Broadcast (2604.02728), CoordBench (2604.00433) | 9.0 | Implementation not yet started — papers ready |
| Phase 8 memory | MMP (2604.19540), DeltaMem (2604.01560) | 9.0 | Phase 8 pre-reads complete |
| Monitoring/audit | AGENTIC-AUDIT (2604.02647) | 8.0 | Single paper; sufficient for now |

**Key gaps:** Phase 7 (drive decay during inactivity) has no external paper yet. Phase 9 (cross-session persistence) needs MMP applied.

---

## GRAO — Gradient-based Research/Agent Optimization

**Consolidation Score: 88 / 100**

| Layer | Papers | Avg Score | Notes |
|-------|--------|-----------|-------|
| Gradient formalism | TextGrad (2406.07496), Friston (2010) | 9.5 | Conceptual foundation is solid |
| Trace collection | Meta-Harness (2603.28052), Agent-Driven RL (2603.27416) | 9.0 | Best-available implementation references |
| Self-improvement loops | Mimosa (2603.28986), ARISE (2604.01437), LLM Self-Improvement (2603.29632) | 8.3 | Three complementary loop architectures |
| Experience store | D2Skill (2603.28716), SAKE (2505.15062), Curriculum (2604.00442) | 8.3 | Dual-granularity + extrapolation covered |
| RL optimization | Apriel-Reasoner (2604.02007), Agent Q-Mix (2604.00344), GrandCode (2604.02721) | 8.3 | RLVR cross-domain training well-covered |
| Survey framing | Self-Evolving Surveys (2507.21046, 2508.07407) | 9.0 | Two complementary surveys |
| Robustness | Corruption-robust MARLHF (2603.28281), Reward Ensembles (2604.02460) | 7.5 | Robustness covered; edge-case tolerance TBD |

**Key gaps:** GRAO Phase 5 (domain-specific gradient routing) needs its own implementation plan. Phase 7 (multi-agent GRAO) has Agent Q-Mix but no fleet-scale reference.

---

## TPG — Temporal Predictive Graph

**Consolidation Score: 74 / 100**

| Layer | Papers | Avg Score | Notes |
|-------|--------|-----------|-------|
| Graph formalism | ReasonGraph (2604.02006), GraphRAG (2604.01438) | 8.5 | Dynamic graph structure well-covered |
| Temporal routing | Chain-of-Tools (2604.02652), Hierarchical Planning (2604.01787) | 8.5 | Sequential and hierarchical routing covered |
| Declarative policy | Inference Routing DSL (2603.27299), Agentic Tool Use (2604.00835) | 7.5 | Policy language patterns available |
| Retrieval integration | Agentic RAG (2501.09136), Long Context RAG | 8.0 | Retrieval architecture solid |
| Execution routing | ToolFlow (2603.29426), L-MARS (2509.00761) | 7.5 | Tool + query routing covered |

**Key gaps:** TPG theoretical framing paper (comparable to TextGrad for GRAO) not yet identified. Temporal prediction horizon tuning has no paper reference.

---

## Clawstr — OpenClaw Cluster Framework

**Consolidation Score: 78 / 100**

| Layer | Papers | Avg Score | Notes |
|-------|--------|-----------|-------|
| Security audit | OpenClaw Security Eval (2604.03131), MCP Security (2601.13508), Attack Landscape (2603.11088) | 9.7 | Best-covered area — three direct references |
| Protocol design | Agent Comm Protocols (2603.22823), AADT/OpenClaw (2603.27104) | 9.0 | MCP vs A2A empirically validated |
| Privacy | AgentSocialBench (2604.01487) | 9.0 | Cross-domain privacy directly named |
| State sync | AADT/OpenClaw (2603.27104), ROSClaw (2603.26997) | 8.0 | State sync patterns from two domains |
| Execution efficiency | Speculative Multi-Agent Decoding (2604.02686), JoyAI-LLM Flash (2604.03044) | 7.5 | Performance optimization references |
| Agent composition | Agent-as-Tool (2604.00429), AutoAgent (2603.29590) | 7.5 | Composition patterns covered |

**Key gaps:** No paper on Clawstr-specific skill/harness management lifecycle. Resource quota enforcement within the cluster lacks a paper reference.

---

## Summary Table

| Framework | Score | Papers | Top Gap |
|-----------|-------|--------|---------|
| GNW | 82/100 | 18 | Phase 7 drive decay model |
| GRAO | 88/100 | 16 | Fleet-scale Phase 7 reference |
| TPG | 74/100 | 10 | Theoretical framing paper |
| Clawstr | 78/100 | 11 | Harness lifecycle management |

---

## Key Papers for Deep Dive (Cross-Framework)

These papers are highest priority for close reading, ranked by cross-framework impact:

| Rank | Paper | arXiv | Frameworks | Why |
|------|-------|-------|------------|-----|
| 1 | Meta-Harness | 2603.28052 | GRAO | Closest GRAO implementation |
| 2 | Before the Tool Call | 2603.27065 | GNW | Hard-veto blueprint |
| 3 | OpenClaw Security Eval | 2604.03131 | Clawstr | Direct security audit |
| 4 | MCP Security | 2601.13508 | Clawstr | Protocol attack surface |
| 5 | Drive-Score Broadcasting | 2604.02728 | GNW | Phase 6 protocol design |
| 6 | TextGrad | 2406.07496 | GRAO | Gradient formalism foundation |
| 7 | Agentic RAG | 2501.09136 | TPG | Retrieval architecture |
| 8 | Agent Q-Mix | 2604.00344 | GNW+GRAO | Topology selection via MARL |
| 9 | D2Skill | 2603.28716 | GRAO | Experience store architecture |
| 10 | AgentSocialBench | 2604.01487 | Clawstr+GNW | Privacy in OpenClaw networks |

---

## Backlog — Uncatalogued Papers

500 arXiv IDs in `processed_arxiv_ids.txt` remain uncatalogued. Priority for next pass:

1. Scan for papers mentioning "drive", "boredom", "priority matrix", or "OpenClaw" directly
2. Scan for papers on temporal prediction graphs or causal routing
3. Scan for papers on harness lifecycle or agent quota management

See `D:\.openclaw\research\processed_arxiv_ids.txt` for full list.
