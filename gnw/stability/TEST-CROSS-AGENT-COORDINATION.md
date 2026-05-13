# Test: Cross-Agent Coordination (Phase 6)

Tests for the Sprint 19 coordination layer: shared drive weight store, broadcast protocol, and arbitration.

---

## TC-P6-01: Broadcast Validation — Valid Scores

**Purpose:** Confirm broadcast-protocol.js accepts valid drive score payloads.

**Setup:** Valid JSON with all 5 drives in [0, 1].

**Run:**
```bash
node gnw/phase6/broadcast-protocol.js \
  --agent andi \
  --scores '{"curiosity":0.72,"helpfulness":0.65,"competence":0.58,"safety":0.45,"goal_directed":0.60}' \
  --winner curiosity --action scan_arxiv --confidence 0.85 --cycle 118
```

**Expected:**
- Exit code 0
- Stdout contains "Broadcast OK"
- `drive-weight-store.json`: andi entry updated with scores, `last_broadcast` set to current ISO timestamp
- `sync_log` has a new entry for "andi"

---

## TC-P6-02: Broadcast Validation — Out-of-Bounds Score Rejected

**Purpose:** Confirm score validation rejects values outside [0, 1].

**Run:**
```bash
node gnw/phase6/broadcast-protocol.js \
  --agent andi \
  --scores '{"curiosity":1.5,"helpfulness":0.65,"competence":0.58,"safety":0.45,"goal_directed":0.60}'
```

**Expected:**
- Exit code 1
- Stderr contains "out of bounds"
- `drive-weight-store.json` unchanged

---

## TC-P6-03: Broadcast Validation — Missing Drive Rejected

**Purpose:** Confirm that incomplete drive payloads are rejected.

**Run:**
```bash
node gnw/phase6/broadcast-protocol.js \
  --agent andi \
  --scores '{"curiosity":0.72,"helpfulness":0.65}'
```

**Expected:**
- Exit code 1
- Stderr contains "Missing drive score"

---

## TC-P6-04: Broadcast Validation — Unknown Agent Rejected

**Purpose:** Confirm that agents not in the founding set are rejected.

**Run:**
```bash
node gnw/phase6/broadcast-protocol.js \
  --agent unknown_bot \
  --scores '{"curiosity":0.72,"helpfulness":0.65,"competence":0.58,"safety":0.45,"goal_directed":0.60}'
```

**Expected:**
- Exit code 1
- Stderr contains "Unknown agent"

---

## TC-P6-05: Dry Run — No Store Write

**Purpose:** Confirm `--dry-run` validates without modifying the store.

**Setup:** Note current `_last_sync` in store.

**Run:**
```bash
node gnw/phase6/broadcast-protocol.js --agent andi --scores '{"curiosity":0.72,"helpfulness":0.65,"competence":0.58,"safety":0.45,"goal_directed":0.60}' --dry-run
```

**Expected:**
- Exit code 0
- Stdout contains "Dry run OK"
- `drive-weight-store.json`: `_last_sync` unchanged

---

## TC-P6-06: Arbitration — No Active Agents

**Purpose:** Confirm arbitration handles a store with no active agents gracefully.

**Setup:** Set all agents to `status: "pending"` or `last_broadcast: null` in a copy of the store.

**Expected:**
- Exit code 0
- Result contains `notes: "No active agents with broadcasts."`
- `allocations` is empty

---

## TC-P6-07: Arbitration — Single Active Agent, No Conflict

**Purpose:** Confirm arbitration allocates correctly for a single active agent.

**Setup:** Only andi has `last_broadcast` set and `status: "active"`. Scores: curiosity highest at 0.80.

**Expected:**
- Stdout contains "1 agents allocated, 0 conflicts resolved, 0 vetoes"
- `arbitration-result.json`: `allocations.andi.winning_drive = "curiosity"`
- `allocations.andi.action` = "research_scan" (user not active)

---

## TC-P6-08: Arbitration — Safety Veto Propagates

**Purpose:** Confirm that one agent's safety ≥ 0.85 blocks external actions for all.

**Setup:** andi safety = 0.90, randi2 safety = 0.20. Both active.

**Expected:**
- `vetoes` array contains an entry for andi
- `allocations.randi2.external_blocked = true`
- Stdout contains "1 vetoes"

---

## TC-P6-09: Arbitration — Oscillation Dampening Applied

**Purpose:** Confirm that repeated wins in sync log trigger dampening.

**Setup:** Populate `sync_log` with 5 entries for "andi" in last 6 slots. andi curiosity = 0.70, randi2 curiosity = 0.65.

**Expected:**
- `oscillating` array includes "andi"
- andi effective curiosity score ≈ 0.56 (0.70 × 0.80)
- randi2 wins the allocation (0.65 > 0.56)

---

## TC-P6-10: Arbitration — User Active Helpfulness Priority

**Purpose:** Confirm user presence causes helpfulness to win when user_active = true.

**Setup:** `global_context.user_active = true`. andi and randi2 both have helpfulness as highest drive.

**Expected:**
- `conflicts` contains entry with `resolved_by: "user_presence"`
- Winner gets `action: "respond_to_user"`
- Loser gets `action: "wait"`

---

## TC-P6-11: Sync Log Rolling Cap

**Purpose:** Confirm sync log never exceeds 200 entries.

**Setup:** Populate `sync_log` with exactly 200 entries. Run one broadcast.

**Expected:**
- After broadcast, `sync_log.length = 200`
- The oldest entry has been removed

---

## Test Result Format

Record test outcomes in the following format:

```
TC-P6-XX: [PASS | FAIL | SKIP]
Date: YYYY-MM-DD
Notes: <any relevant details>
```

---

## Acceptance Criteria for Sprint 19

All TC-P6-01 through TC-P6-10 pass before Sprint 20 cron job integration begins.

---

*Remnant Research — from theory to deployment.*
