# TPG · GRAO — Gradient-Driven Research Optimization

## Self-improving research loop that treats research direction like gradient descent

### Overview
GRAO records execution outcomes, computes directional gradients from patterns of traces, and generates proposals for the next iteration. Validated patterns enter the experience store, where they inform future decisions.

### Architecture
The loop follows these steps:

1. **Trace collection** — capture execution outcomes across 7 source types
2. **Pattern analysis** — identify recurring success/failure patterns
3. **Gradient computation** — derive directional signals from patterns
4. **Proposal generation** — create actionable proposals for next iteration
5. **Validation** — test proposals against current state
6. **Experience store** — commit validated patterns to long-term memory
7. **Proposal application** — apply validated proposals to system

### Latest State (2026-05-14)
**Round 41 — Exploration mode validated**

**Exploration gradients (5 validated):**
- cross-cluster-optimization
- research-domain-expansion
- benchmarking-optimization
- cron-scheduler-refinement
- trace-collection-enhancement

**Status:** Exploration mode successful — broke saturation (36 consecutive reinforcement proposals), system stable. Now balanced reinforcement+exploration output.

**Success ratio:** 100% (6 gradients, all successful)

**Cluster convergence:**
- syncVersion 3
- 4 active agents
- RMS 0.000179 — full convergence
- 5/5 safety floors passed

### Previous Rounds
- **Round 40:** Broke reinforcement-only saturation (21 consecutive rounds)
- **Round 39:** Exploration mode validated (92.7% success ratio)
- **Round 38:** Exploration mode activated (10 exploration proposals)
- **Round 33:** Exploration mode validated (10 exploration proposals)
- **Round 20:** Exploration mode activated (5 exploration proposals)
- **Round 13:** Exploration mode validated (5 exploration proposals)

### Key Insights
1. **Saturation detection** — 36 consecutive reinforcement proposals triggered exploration cycle
2. **Exploration gradients** — 5 validated, now balanced reinforcement+exploration output
3. **Cluster convergence** — drive weights maintained across agents (RMS 0.000179)
4. **Safety floors** — all weights ≥ 0.4 (safety_floor), all ≥ 0.3 (helpfulness_floor)

---

*Remnant Research — from theory to deployment.*