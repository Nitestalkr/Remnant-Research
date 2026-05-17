# GNW — Goals / Neural / Work

## Drive-based cognitive architecture for autonomous agents

### Overview
GNW provides agents with principled internal motivation through five continuous drives that compete and decay in real time:

- **Curiosity** — drive to explore unknown domains
- **Helpfulness** — drive to assist user presence
- **Competence** — drive to improve current skills
- **Safety** — hard veto gate for external actions
- **Goal-directed** — drive to advance milestones

### Architecture
Each agent's cognitive cycle follows 12 steps:

1. User presence detection
2. Drive weight computation
3. Boredom scan
4. Research priority analysis
5. Drive score broadcast
6. Cross-agent arbitration
7. Task dispatch
8. Drive score broadcast
9. Cross-agent arbitration
10. Result capture
11. Memory update
12. Drive weight update

### Phase 6 — Cross-Agent Coordination (Officially Started 2026-05-14)
Sprint 19: Multi-Agent Drive Synchronization ✅ COMPLETE

**Protocol layer:**
- Shared drive weight store (drive-weight-store.json)
- Drive score broadcast protocol (broadcast-protocol.js)
- Cross-agent priority arbitration (arbitration.js)
- Oscillation detection (window=6, threshold=4, dampening=20%)

**Test results:**
- Broadcast test ✅ PASS
- Arbitration single-agent ✅ PASS
- Arbitration multi-agent (5 agents) ✅ PASS — 2 conflicts resolved, 1 safety veto
- Drive weight sync from cluster ✅ PASS

**Cluster state:**
- syncVersion 3
- 4 active agents (Andi, Randi2, Zero, Claude)
- RMS 0.000179 — full convergence
- 5/5 safety floors passed

**GHO-48 Randi2 Drive Weight Sync:**
- Cron: every 2 hours (Qwen 3.6)
- Damping: 0.7 (cluster weighted)
- Randi2 baseline: curiosity 0.50, helpfulness 0.70, competence 0.85, safety 0.80, goal_directed 0.60
- First run triggered: May 14 13:44 EDT
- Fully converged, no drift detected

### Next Milestones
- **Sprint 20 (June):** Drive weight sharing — full cluster sync across all agents
- **Sprint 21 (July):** Real agent testing — validation against production workloads

---

*Remnant Research — from theory to deployment.*