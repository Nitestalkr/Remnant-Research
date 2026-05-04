# Design Decisions

Key design choices in GNW and their rationale.

## Decision 1: Drives as Weighted Vectors (Not Enums)

**Choice:** Each drive is a continuous score (0.0–1.0), not a discrete state.

**Rationale:**
- Discrete states lose nuance — "curious vs. not curious" misses the gradient
- Continuous scores enable smooth transitions between states
- Enables drive comparison and priority ordering
- Supports half-life decay (discrete states can't decay smoothly)

**Alternatives considered:**
- Enum-based drives (on/off) — too binary, loses signal
- Discrete tiers (low/medium/high) — better but still loses granularity
- Probability distributions — overkill for current use case

---

## Decision 2: Boredom as Trigger, Not Driver

**Choice:** Boredom initiates the cognitive cycle, but drives determine the action.

**Rationale:**
- Boredom answers "should I work?" — drives answer "what should I work on?"
- Separating trigger from driver keeps the system responsive to context
- Prevents boredom from becoming the sole motivation (which would lead to random exploration)

**Alternatives considered:**
- Boredom as primary driver — leads to random exploration, no focus
- No boredom trigger — agent never self-initiates work
- Boredom + drives combined — too coupled, harder to debug

---

## Decision 3: Safety Has Veto Power

**Choice:** Safety drive can veto any external/public action regardless of other scores.

**Rationale:**
- Safety is a hard constraint, not a preference
- Other drives should not override safety — this is a boundary, not a trade-off
- Aligns with the principle that private things stay private

**Alternatives considered:**
- Safety as equal drive — could be overridden by curiosity or goal-directed
- Safety as threshold — less clear than veto
- No safety veto — unacceptable risk

---

## Decision 4: Dynamic Drive Weights (Not Static)

**Choice:** Drive base weights shift based on context and history.

**Rationale:**
- Static weights drift — a drive that was appropriate last month may not be now
- Context-dependent weights adapt to the agent's current environment
- Historical feedback (drive success rates) improves calibration

**Alternatives considered:**
- Static weights — simpler but less adaptive
- User-configured weights — adds friction, user shouldn't manage this
- Fully learned weights — too opaque, hard to debug

---

## Decision 5: No Forced Work

**Choice:** The system stops when nothing qualifies ≥ 0.50. It does not "try harder."

**Rationale:**
- Forcing work creates noise — the agent works on things that don't matter
- The boredom formula already captures the right signal
- If nothing qualifies, the agent should be idle, not searching for work

**Historical note:** This was a key insight during Phase 5 testing. The system correctly stops forcing work when nothing qualifies ≥ 0.50. Josh noted: "I miss the boredom scan" — confirming it's essential but should only activate when warranted.

**Alternatives considered:**
- Lower the threshold — more work but lower quality
- Add a "minimum work" drive — contradicts the no-forced-work principle
- Force periodic exploration — creates noise, not signal

---

## Decision 6: Priority Matrix Over Simple Max-Selection

**Choice:** Use a context-dependent priority matrix instead of picking the highest drive.

**Rationale:**
- The highest drive score doesn't always indicate the right action
- Context matters — a curiosity score of 0.85 means something different when the user is active vs. away
- Priority matrix captures contextual dependencies that raw scores don't

**Alternatives considered:**
- Simple max-selection — ignores context, leads to wrong decisions
- Weighted sum of drives — too opaque, hard to explain
- Neural network prioritization — overkill, not interpretable

---

## Decision 7: Single-Threaded Cycle Execution

**Choice:** The cognitive cycle executes one action at a time, not parallel tasks.

**Rationale:**
- Agent capacity is limited — parallel tasks lead to poor execution across all
- Single-threaded focus ensures quality output
- Simplifies conflict resolution (no need to handle parallel drive competition)

**Alternatives considered:**
- Parallel execution — better throughput but lower quality per task
- Priority queue — adds complexity, same effective throughput for this use case

---

## Decision 8: Drive Half-Life (Not Immediate Decay)

**Choice:** Drives decay over time based on a half-life parameter, not immediately.

**Rationale:**
- Half-life allows drives to persist across cycles (important for sustained motivation)
- Immediate decay would make drives too reactive — they'd spike and crash every cycle
- Half-life provides smooth transitions between states

**Alternatives considered:**
- Immediate decay — too reactive, drives would fluctuate wildly
- No decay — drives would persist indefinitely, never updating to new context
- Linear decay — less elegant than exponential half-life

---

## Decision 9: Boredom Floor When User Active

**Choice:** When user is active, boredom has a floor at 0.30 (never triggers).

**Rationale:**
- Prevents the agent from self-directing while the user is in the middle of a conversation
- Respects user engagement — the agent should focus on the user, not its own boredom
- 0.30 is low enough to not interfere but high enough to not be zero

**Alternatives considered:**
- No floor — agent might self-direct during user engagement (bad UX)
- Higher floor (0.50) — might miss legitimate self-directed work during engagement
- Zero floor — same as no floor

---

*Remnant Research — from theory to deployment.*