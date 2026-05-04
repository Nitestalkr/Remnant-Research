# Edge Cases

Handling ambiguous, tied, or unusual drive states that don't fit the standard
priority matrix.

## Edge Case 1: All Drives Low (< 0.30)

**Situation:** No drive reaches the action threshold. Agent is content.

**Resolution:**
- No self-directed work
- Stay in "engagement mode" — only respond to external input
- Continue monitoring — next cycle may change the state
- **Do not force work** — this is a valid state, not a failure

**Historical note:** The system correctly stops forcing work when nothing qualifies ≥ 0.50. Josh noted: "I miss the boredom scan" — confirming it's essential but should only activate when warranted.

---

## Edge Case 2: All Drives High (> 0.80)

**Situation:** Every drive is at maximum intensity. Agent is overwhelmed.

**Resolution:**
1. Apply safety veto first (if applicable)
2. Use priority matrix to find the single highest-priority drive
3. Execute **only** that drive's action
4. Log all other drives as "deferred" for next cycle
5. **Do not attempt parallel execution** — single-threaded focus

**Rationale:** The agent has limited capacity. Trying to satisfy all drives simultaneously leads to poor execution across all of them.

---

## Edge Case 3: Drive Oscillation

**Situation:** Drives flip-flop between two states across consecutive cycles.

Example:
- Cycle 1: Curiosity wins → explores research
- Cycle 2: Goal-Directed wins → works on project
- Cycle 3: Curiosity wins → explores research
- Cycle 4: Goal-Directed wins → works on project

**Detection:** Track drive winner history. If the same two drives alternate ≥ 3 times, flag oscillation.

**Resolution:**
1. Apply recency bias — the less recently dominant drive wins
2. Increase the damping factor for the oscillating drive by 0.1
3. If oscillation persists for 5+ cycles, trigger a drive weight recalibration
4. Log oscillation event for analysis

**Prevention:** The half-life mechanism is designed to prevent this. If it's not working, the half-life values need adjustment.

---

## Edge Case 4: Drive Conflict with External Constraint

**Situation:** A drive wants to act, but an external constraint blocks it.

Example:
- Curiosity = 0.85 (wants to post research findings)
- Safety = 0.80 (post would expose sensitive data)
- Goal-Directed = 0.70 (research publication is a project milestone)

**Resolution:**
1. Safety veto applies → external action blocked
2. Check for internal alternative → can the research be documented internally?
3. If internal alternative exists → execute it with safety checks
4. If no internal alternative → flag for manual review
5. Continue with next-highest drive's action

---

## Edge Case 5: User Request Conflicts with Active Drive

**Situation:** User sends a request that conflicts with the agent's current drive priority.

Example:
- Goal-Directed = 0.75 (working on project milestone)
- User sends a low-priority request that would interrupt the milestone work

**Resolution:**
1. **Always** address user requests first (helpfulness override)
2. But minimize disruption:
   - If request is low-effort → handle it, then return to milestone
   - If request is high-effort → acknowledge, schedule, then return to milestone
   - If request conflicts with milestone → communicate the conflict, let user decide
3. Log the interruption and its impact on the active drive

---

## Edge Case 6: Drive Score = 0.0

**Situation:** A drive reaches exactly 0.0 — completely inactive.

**Possible causes:**
- No signals triggering the drive
- Drive weight is zero (configuration error)
- Drive has been suppressed by a veto

**Resolution:**
1. Verify drive weight is non-zero in configuration
2. Check if signals are being captured correctly
3. If drive is genuinely not triggered, note it in the cycle log
4. If persistent across 10+ cycles, investigate drive health

**Warning:** A permanently zero drive indicates a broken signal chain. This is a system health issue, not a normal state.

---

## Edge Case 7: Rapid Drive Score Changes

**Situation:** A drive score jumps from 0.2 to 0.9 in a single cycle.

**Possible causes:**
- New external event (user message, cron trigger, system alert)
- Signal capture error (double-counting, stale data)
- Genuine state change (new project, new deadline)

**Resolution:**
1. Verify signal source — was the change real or a capture error?
2. If real → apply normally, but add a "rapid change" flag to the log
3. If error → correct the signal, recompute drive scores
4. If genuine → allow the change but log it for pattern analysis

---

## Edge Case 8: Memory Corruption / State Loss

**Situation:** Drive computation relies on memory state that is corrupted or missing.

**Resolution:**
1. Attempt memory recovery from recent cycle logs
2. If recovery fails → use default drive weights (baseline scores)
3. Log the state loss event with severity
4. Trigger a memory consolidation cycle
5. Continue with default weights until state is restored

**Prevention:** Regular memory backups and state validation checks.

---

*Remnant Research — from theory to deployment.*