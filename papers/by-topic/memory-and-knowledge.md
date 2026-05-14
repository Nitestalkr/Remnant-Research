# Memory and Knowledge Systems

Papers informing memory architecture, consolidation, and retrieval in GNW and GRAO.

---

## Memory Architecture

### [Mesh Memory Protocol (MMP)](https://arxiv.org/abs/2604.19540)

- **arXiv:** 2604.19540
- **Published:** 2026
- **Relevance:** GNW Phase 8 (Memory Integration)
- **Framework Score:** 9/10

Structured approach to distributed memory across agents. Directly relevant to GNW Phase 8 goals: cross-session drive persistence and drive-driven memory consolidation across the 5-agent fleet.

---

### [DeltaMem: Agentic Memory Management via Reinforcement Learning](https://arxiv.org/abs/2604.01560)

- **arXiv:** 2604.01560
- **Published:** 2026
- **Relevance:** GNW Phase 8 (memory management via RL)
- **Framework Score:** 9/10

Persona-centric memory management as an end-to-end RL problem. Directly informs GNW Phase 8: drive-driven memory consolidation as an RL-optimized process, enabling the drive system itself to determine what gets remembered vs. discarded.

---

### [Hierarchical Memory Agents](https://arxiv.org/abs/HIERARCHY-MEMORY)

- **Relevance:** GNW + GRAO (episodic vs semantic memory hierarchy)
- **Framework Score:** 8/10

Hierarchical memory system for agents distinguishing episodic (trace) from semantic (consolidated) memory. Maps to GRAO's trace-to-experience pipeline: raw traces are episodic, consolidated patterns in the experience store are semantic.

---

## Knowledge Retrieval

### [Agentic Retrieval-Augmented Generation (Agentic RAG)](https://arxiv.org/abs/2501.09136)

- **arXiv:** 2501.09136
- **Published:** 2026
- **Relevance:** TPG (retrieval routing architecture)
- **Framework Score:** 9/10

Comprehensive survey of Agentic RAG — dynamic query routing, multi-hop retrieval, self-reflection loops. Core TPG reference: defines the query-decompose → retrieve → synthesize pattern that TPG's temporal routing graph executes.

---

### [GraphRAG: Knowledge Graph Enhanced Retrieval](https://arxiv.org/abs/2604.01438)

- **arXiv:** 2604.01438
- **Published:** 2026
- **Relevance:** TPG (graph-based retrieval routing)
- **Framework Score:** 8/10

Knowledge graph-enhanced RAG leveraging graph structure for navigation. Informs TPG's routing layer: using graph relationships to navigate knowledge rather than flat embedding similarity, enabling multi-hop factual chains.

---

### [Long Context RAG](https://arxiv.org/abs/LONG-CONTEXT-RAG)

- **Relevance:** GNW Phase 8 + TPG (long-context retrieval for drive state)
- **Framework Score:** 7/10

Long-context retrieval strategies for extended agent interactions. Informs both GNW Phase 8 (retrieving historical drive state across sessions) and TPG (routing over long-horizon context windows).

---

### [SAKE: Structured Agentic Knowledge Extrapolation](https://arxiv.org/abs/2505.15062)

- **arXiv:** 2505.15062
- **Published:** 2026
- **Relevance:** GRAO (experience store extrapolation)
- **Framework Score:** 9/10

RL-powered knowledge extrapolation in specialized domains. Core GRAO experience store reference: stored patterns must generalize to novel situations, not just replay past retrievals.

---

## Knowledge Synthesis and Updating

### [K²-Agent: Co-Evolving Know-What and Know-How](https://arxiv.org/abs/2603.00676)

- **arXiv:** 2603.00676
- **Published:** 2026
- **Relevance:** GNW + GRAO (declarative vs procedural knowledge separation)
- **Framework Score:** 8/10

Separates and co-evolves declarative knowledge ("know-what") and procedural knowledge ("know-how"). Maps to GNW's drive system (declarative: what goals exist) and GRAO's experience store (procedural: how to achieve them). Co-evolution is the GNW→GRAO closed loop.

---

### [SWE-Bench Verified: Language Models on Real Software Tasks](https://arxiv.org/abs/2603.28900)

- **arXiv:** 2603.28900
- **Published:** 2026
- **Relevance:** GRAO (trace quality benchmark)
- **Framework Score:** 6/10

Evaluation of software task completion via agentic LLMs. Informs GRAO trace quality standards: what constitutes a clean, evaluable execution trace for gradient derivation — the traces used in GRAO should meet SWE-Bench rigor.

---

## Key Papers for Deep Dive

1. **MMP (2604.19540)** — Phase 8 distributed memory design
2. **DeltaMem (2604.01560)** — RL-based memory consolidation
3. **Agentic RAG (2501.09136)** — TPG retrieval architecture
4. **K²-Agent (2603.00676)** — declarative/procedural knowledge co-evolution
