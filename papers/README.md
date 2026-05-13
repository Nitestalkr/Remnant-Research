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
