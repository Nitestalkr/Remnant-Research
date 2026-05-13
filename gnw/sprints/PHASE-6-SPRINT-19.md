# GNW Phase 6 — Sprint 19: Multi-Agent Drive Synchronization

**Status:** ✅ COMPLETE  
**Date:** 2026-05-13  
**Objective:** Implement the foundational layer for cross-agent drive coordination: shared store, broadcast protocol, and priority arbitration.

---

## What Was Built

### 1. Shared Drive Weight Store (`gnw/phase6/drive-weight-store.json`)

A single JSON file serving as the coordination point for all five founding agents:

- **Per-agent sections:** each agent maintains its current drive weights, last broadcast timestamp, cycle count, and status
- **Global context:** user_active flag, active project count, shared research queue, coordination mode, arbitration stats
- **Sync log:** rolling 200-entry history of broadcasts for oscillation detection

All agents read from and write to this file at the end of each cognitive cycle. The schema is versioned (`_schema_version: "1.0"`) to allow forward-compatible updates.

### 2. Drive Score Broadcast Protocol (`gnw/phase6/broadcast-protocol.js`)

Node.js CLI that each agent calls at the end of its cognitive cycle:

```bash
node gnw/phase6/broadcast-protocol.js \
  --agent andi \
  --scores '{"curiosity":0.72,"helpfulness":0.65,"competence":0.58,"safety":0.45,"goal_directed":0.60}' \
  --winner curiosity \
  --action scan_arxiv \
  --confidence 0.85 \
  --cycle 118
```

Key properties:
- **Validation:** rejects scores outside [0, 1]; rejects unknown drive names; rejects unknown agents
- **Atomic write:** reads store → updates agent entry → appends sync log → writes store
- **Dry-run mode:** `--dry-run` validates without writing
- **Exportable module:** `broadcast`, `validateScores`, `readStore` available for import

Broadcast payload schema (v1.0):
```json
{
  "agent_id": "andi",
  "timestamp": "2026-05-13T07:00:00Z",
  "drives": { "curiosity": 0.72, "helpfulness": 0.65, "competence": 0.58, "safety": 0.45, "goal_directed": 0.60 },
  "winner": "curiosity",
  "action": "scan_arxiv",
  "confidence": 0.85,
  "version": "1.0"
}
```

### 3. Cross-Agent Priority Arbitration (`gnw/phase6/arbitration.js`)

Node.js CLI that reads the shared store and resolves conflicts across all active agents:

```bash
node gnw/phase6/arbitration.js --verbose
```

**Priority rules (applied in order):**

| Rule | Trigger | Effect |
|------|---------|--------|
| Safety veto | Any agent safety ≥ 0.85 | External actions blocked for all |
| User presence | `user_active = true` + helpfulness winner | Helpfulness drive agent responds |
| Project alignment | `goal_directed` winner conflict | Highest score wins |
| Score priority | All other conflicts | Highest score wins, others continue current |

**Oscillation detection:**
- Tracks last 6 sync log entries
- If any agent appears 4+ times out of 6, flag as oscillating
- Apply 20% score dampening to oscillating agents before arbitration
- Dampening is per-cycle — next cycle recalculates from raw weights

**Output:**
- `arbitration-result.json` — full allocation with per-agent action assignments
- Stdout summary: `Arbitration OK — N agents allocated, N conflicts resolved, N vetoes`

---

## Integration with Phase 5 Cognitive Cycle

Each agent's 12-step cognitive cycle gains two new steps after Step 10 (Task Dispatch):

```
10. Task Dispatch
→ 10a. Drive Score Broadcast (broadcast-protocol.js)
→ 10b. Cross-Agent Arbitration (arbitration.js) [run by coordinating agent]
11. Result Capture
12. Memory Update
```

Only one agent needs to run arbitration per cycle window (the "coordinating agent" is the last to broadcast in each cycle round).

---

## Agent Readiness

| Agent | Workspace | Status |
|-------|-----------|--------|
| Andi | D:/.openclaw/workspace | Ready (117 cycles completed) |
| Randi2 | C:/.openclaw/workspace-randi2 | Pending harness activation |
| CB | C:/.openclaw/workspace-cb | Pending harness activation |
| Claude | D:/.openclaw/workspace-claude | Pending (researcher role) |
| Zero | C:/.openclaw/workspace-zero | Pending harness activation |

**Current constraint:** Only Andi is actively cycling. Sprint 19 is complete from a protocol/store perspective. Real multi-agent broadcasts require the other agents' harnesses to be activated (tracked under GHO-41 and related issues).

---

## Sprint 19 Deliverables — Acceptance Check

| Deliverable | Status |
|-------------|--------|
| Drive weight schema definition | ✅ Done — `drive-weight-store.json` v1.0 |
| Drive weight sharing protocol | ✅ Done — `broadcast-protocol.js` |
| Cross-agent arbitration protocol | ✅ Done — `arbitration.js` |
| Oscillation detection across agents | ✅ Done — window=6, threshold=4, dampening=20% |
| Safety veto propagation | ✅ Done — any agent safety ≥ 0.85 blocks all external actions |
| Sync job per-agent (Sprint 20 target) | ⏳ Next — sync cron jobs per agent once harnesses active |

---

## Lessons Learned

1. **Store-file simplicity wins** — A single shared JSON file is simpler than a message bus and easier to audit. File contention is not a concern until agents run concurrently on separate processes.
2. **Arbitration is stateless** — The arbitrator reads only the store; no in-memory state required. This means any agent can run arbitration.
3. **Oscillation dampening must be per-cycle** — Persistent dampening would permanently disadvantage agents that happen to win frequently, not just those truly oscillating.
4. **Protocol-first, integration second** — Broadcasting to a store without live multi-agent testing is valid for Sprint 19; Sprint 21 provides the real integration test.

---

## Next Sprint

**Sprint 20: Drive Weight Sharing (Target: June 2026)**
- Per-agent sync cron jobs (one per agent workspace)
- Weight synchronization — agents read peer weights before computing their own context modulation
- Conflict resolution for competing weight updates (last-write-wins with timestamp check)
- AGENT-HANDOFF-NEXT-STEPS.md update

---

*Remnant Research — from theory to deployment.*
