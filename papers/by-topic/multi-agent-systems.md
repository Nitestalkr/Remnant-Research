# Multi-Agent Systems

Papers informing GNW Phase 6 (Cross-Agent Coordination), GRAO Phase 7 (Multi-Agent GRAO), and Clawstr fleet management.

---

## Communication and Coordination Protocols

### [Empirical Comparison of Agent Communication Protocols for Task Orchestration](https://arxiv.org/abs/2603.22823)

- **arXiv:** 2603.22823
- **Published:** 2026
- **Relevance:** Clawstr (MCP vs A2A protocol selection)
- **Framework Score:** 9/10

Head-to-head comparison of MCP (tool integration protocol) vs. agent-to-agent delegation protocol. Directly informs Clawstr's protocol selection for the OpenClaw runtime and GNW Phase 6 cross-agent handshake design.

---

### [Multi-Agent Coordination via Shared Mental Models](https://arxiv.org/abs/2603.29247)

- **arXiv:** 2603.29247
- **Published:** 2026
- **Relevance:** GNW Phase 6 (shared drive state = shared mental model)
- **Framework Score:** 9/10

Shared mental models enabling coherent multi-agent coordination. Directly maps to GNW Phase 6: agents sharing drive-weight state to maintain coherent collective behavior without a centralized orchestrator.

---

### [Drive-Score Broadcasting in Persistent Agent Networks](https://arxiv.org/abs/2604.02728)

- **arXiv:** 2604.02728
- **Published:** 2026
- **Relevance:** GNW Phase 6 (drive-score broadcast protocol)
- **Framework Score:** 10/10

Persistent drive-state broadcasting across networked agents. Direct GNW Phase 6 implementation reference: defines the broadcast protocol for sharing drive scores across the agent fleet — the core unresolved Phase 6 task. **Priority deep dive.**

---

### [Trust Calibration in Multi-Agent LLM Systems](https://arxiv.org/abs/2604.02023)

- **arXiv:** 2604.02023
- **Published:** 2026
- **Relevance:** GNW Phase 6 (inter-agent trust as dynamic weight)
- **Framework Score:** 8/10

Dynamic trust calibration in multi-agent systems. Maps to GNW Phase 6: inter-agent trust as a weight in the cross-agent priority matrix for task delegation — high-trust agents bypass arbitration checks.

---

## Multi-Agent Fleet Architecture

### [EpochX: Building the Infrastructure for an Emergent Agent Civilization](https://arxiv.org/abs/2603.27304)

- **arXiv:** 2603.27304
- **Published:** 2026
- **Relevance:** GNW Phase 10 (self-organizing multi-agent behavior at scale)
- **Framework Score:** 8/10

Credits-native marketplace for large-scale agent coordination. Informs long-range GNW Phase 10 thinking: collective goal allocation and self-organizing multi-agent behavior in economically incentive-compatible systems.

---

### [Meta-Agent Scheduling for Heterogeneous Agent Fleets](https://arxiv.org/abs/2604.02334)

- **arXiv:** 2604.02334
- **Published:** 2026
- **Relevance:** GNW Phase 6 (fleet scheduling via priority broadcast)
- **Framework Score:** 8/10

Meta-agent scheduler for heterogeneous fleets. Maps to GNW Phase 6 global workspace broadcast: selects which agents receive activation based on task-capability fit, acting as a fleet scheduler.

---

### [MediHive: Decentralized Agent Collective](https://arxiv.org/abs/2603.27150)

- **arXiv:** 2603.27150
- **Published:** 2026
- **Relevance:** GNW Phase 6 (decentralized coordination, fault tolerance)
- **Framework Score:** 7/10

Decentralized multi-agent collective avoiding single-point-of-failure bottlenecks. Informs GNW Phase 6 architecture: cross-agent coordination that degrades gracefully when individual agents go offline.

---

## Evaluation and Benchmarking

### [Toward Evaluation Frameworks for Multi-Agent Scientific AI Systems](https://arxiv.org/abs/2603.26718)

- **arXiv:** 2603.26718
- **Published:** 2026
- **Relevance:** GNW Phase 6 + GRAO Phase 7 (fleet evaluation)
- **Framework Score:** 9/10

Benchmarking multi-agent scientific systems — contamination resistance, reasoning vs retrieval distinction, replication challenges. Directly relevant to designing evaluation for the 5-agent OpenClaw fleet during GNW Phase 6 / GRAO Phase 7 testing.

---

### [CoordBench: Benchmarking Coordination in Multi-Agent LLMs](https://arxiv.org/abs/2604.00433)

- **arXiv:** 2604.00433
- **Published:** 2026
- **Relevance:** GNW Phase 6 + GRAO Phase 7 (coordination benchmark suite)
- **Framework Score:** 8/10

Benchmark suite for multi-agent coordination protocols. Candidate evaluation framework for GNW Phase 6 cross-agent coordination implementation — validates that the drive-broadcast achieves coordination gains.

---

### [Agent Q-Mix: Topology Selection via Cooperative MARL](https://arxiv.org/abs/2604.00344)

- **arXiv:** 2604.00344
- **Published:** 2026
- **Relevance:** GNW Phase 6 + GRAO Phase 7 (topology optimization)
- **Framework Score:** 9/10

Reformulates multi-agent topology selection as cooperative MARL. Informs both GNW Phase 6 cross-agent priority arbitration and GRAO Phase 7 gradient-guided agent topology optimization across the fleet.

---

## Specialized Agent Coordination

### [AADT: OpenClaw Framework for State Synchronization](https://arxiv.org/abs/2603.27104)

- **arXiv:** 2603.27104
- **Published:** 2026
- **Relevance:** Clawstr (OpenClaw state sync across agent instances)
- **Framework Score:** 9/10

Uses OpenClaw for Medical Digital Twin state synchronization. Demonstrates Clawstr's state sync capability: agents maintaining a continuously-updated shared world model, directly applicable to GNW Phase 6 shared drive state.

---

### [AI-Supervisor: Autonomous Research Supervision via Multi-Agent Orchestration](https://arxiv.org/abs/2603.24402)

- **arXiv:** 2603.24402
- **Published:** 2026
- **Relevance:** GNW + GRAO (orchestration blueprint for research team)
- **Framework Score:** 8/10

Multi-agent orchestration for end-to-end research supervision. Blueprint for the Ghostworks multi-agent architecture: Andi (orchestrator), Randi2 (developer), CB (optimizer), Claude (security), Zero (deployer) mirror the paper's research team role decomposition.

---

## Key Papers for Deep Dive

1. **Drive-Score Broadcasting (2604.02728)** — direct GNW Phase 6 implementation
2. **Shared Mental Models (2603.29247)** — coordination theory foundation
3. **Agent Communication Protocols (2603.22823)** — MCP vs A2A empirical data
4. **CoordBench (2604.00433)** — validation benchmark for Phase 6
5. **AADT/OpenClaw (2603.27104)** — Clawstr state sync reference implementation
