# Safety and Alignment

Papers informing GNW's safety drive, veto protocol, Clawstr security architecture, and the OpenClaw threat model.

---

## GNW Safety Drive

### [Before the Tool Call: Deterministic Pre-Action Authorization](https://arxiv.org/abs/2603.27065)

- **arXiv:** 2603.27065
- **Published:** 2026
- **Relevance:** GNW (hard-veto protocol)
- **Framework Score:** 10/10

Open Agent Passport (OAP): deterministic authorization intercepting tool calls synchronously before execution, evaluated against declarative policy. Directly maps to GNW's hard-veto rule: safety drive ≥ 0.85 blocks all external actions regardless of other drive state. **Priority deep dive.**

---

### [ARES: Adaptive Red-Teaming for Agent Safety](https://arxiv.org/abs/2604.18789)

- **arXiv:** 2604.18789
- **Published:** 2026
- **Relevance:** GNW (safety drive threat model)
- **Framework Score:** 9/10

Adaptive red-teaming for agent safety evaluation. Informs the three-tier veto protocol (soft scrutiny → hard block → emergency): designed to resist adversarial pressure scenarios ARES tests against.

---

### [AgentHazard: Evaluating Harmful Behavior in Computer-Use Agents](https://arxiv.org/abs/2604.02947)

- **arXiv:** 2604.02947
- **Published:** 2026
- **Relevance:** GNW (safety — multi-step harm through individually plausible actions)
- **Framework Score:** 9/10

Harmful behavior emerging through sequences of individually acceptable steps. Critical GNW safety threat model: the hard-veto must evaluate action sequences, not just individual actions in isolation — a key GNW Phase 5 design constraint.

---

### [Red-MIRROR: Agentic LLM-based Autonomous Penetration Testing](https://arxiv.org/abs/2603.27127)

- **arXiv:** 2603.27127
- **Published:** 2026
- **Relevance:** GNW (adversarial multi-step attack modeling)
- **Framework Score:** 7/10

Autonomous pen-testing with reflective verification. Informs GNW's safety drive threat model for adversarial agent behavior in web-targeting multi-step attack scenarios.

---

### [AI In Cybersecurity Education — Scalable Agentic CTF Design](https://arxiv.org/abs/2603.21551)

- **arXiv:** 2603.21551
- **Published:** 2026
- **Relevance:** GNW (safety drive calibration at different autonomy levels)
- **Framework Score:** 7/10

Cross-regional study of LLM-centered CTF competitions. Informs GNW's safety drive calibration: understanding how autonomy level modulates risk, enabling tiered veto thresholds for different operational modes.

---

### [AGENTIC-AUDIT: Continuous Compliance Monitoring for AI Agent Deployments](https://arxiv.org/abs/2604.02647)

- **arXiv:** 2604.02647
- **Published:** 2026
- **Relevance:** GNW (boredom-scan compliance loop)
- **Framework Score:** 8/10

Continuous compliance monitoring framework for deployed AI agents. Directly informs GNW's boredom-scan / safety-drive monitoring loop — the same continuous audit pattern that GNW uses to detect drift in compliance state.

---

## OpenClaw and Clawstr Security

### [A Systematic Security Evaluation of OpenClaw and Its Variants](https://arxiv.org/abs/2604.03131)

- **arXiv:** 2604.03131
- **Published:** 2026
- **Relevance:** Clawstr (direct OpenClaw security audit)
- **Framework Score:** 10/10

Systematic security assessment of six OpenClaw-series frameworks (OpenClaw, AutoClaw, QClaw, KimiClaw, MaxClaw, ArkClaw). Primary Clawstr security reference: defines the full attack surface taxonomy for tool-augmented agents on the OpenClaw runtime. **Priority deep dive.**

---

### [AgentSocialBench: Privacy Risks in Human-Centered Agentic Social Networks](https://arxiv.org/abs/2604.01487)

- **arXiv:** 2604.01487
- **Published:** 2026
- **Relevance:** Clawstr (privacy in OpenClaw cross-domain coordination)
- **Framework Score:** 9/10

Directly names OpenClaw. Studies privacy risks when agents coordinate across domain boundaries in persistent LLM frameworks. Critical for Clawstr's access control design: agents must not leak sensitive context across domain boundaries during handoffs.

---

### [MCP Security: Analyzing Attack Surface in Model Context Protocol Servers](https://arxiv.org/abs/2601.13508)

- **arXiv:** 2601.13508
- **Published:** 2026
- **Relevance:** Clawstr (MCP attack surface in OpenClaw runtime)
- **Framework Score:** 10/10

Attack surface analysis for MCP server implementations — prompt injection, tool poisoning, confused deputy attacks. Critical Clawstr reference: all OpenClaw tool servers expose this attack surface. **Priority deep dive.**

---

### [The Attack and Defense Landscape of Agentic AI: A Survey](https://arxiv.org/abs/2603.11088)

- **arXiv:** 2603.11088
- **Published:** 2026
- **Relevance:** Clawstr + GNW (comprehensive agent security roadmap)
- **Framework Score:** 9/10

Comprehensive survey of AI agent security: attack landscape, defense mechanisms, design space, case studies. Security roadmap for hardening the multi-agent Ghostworks system.

---

## Privacy and Compliance

### [TAPAS: Task-Adaptive Planning with Privacy-Aware Scoping](https://arxiv.org/abs/2604.00187)

- **arXiv:** 2604.00187
- **Published:** 2026
- **Relevance:** GNW + Clawstr (privacy-scoped task planning)
- **Framework Score:** 7/10

Task-adaptive planning that scopes agent access to need-to-know data. Informs GNW's cognitive cycle privacy constraints and Clawstr's data access scoping per agent role.

---

## Key Papers for Deep Dive

1. **Before the Tool Call (2603.27065)** — hard-veto implementation blueprint
2. **OpenClaw Security Evaluation (2604.03131)** — Clawstr security audit foundation
3. **MCP Security (2601.13508)** — protocol-level attack surface taxonomy
4. **AgentHazard (2604.02947)** — multi-step harm detection requirement
5. **ARES (2604.18789)** — adaptive red-teaming methodology
