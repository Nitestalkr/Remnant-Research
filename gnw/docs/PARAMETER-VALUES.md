# Parameter Values - Current Working Configuration

Documented parameter values for GNW. These are current best-guess values, subject to calibration from real cycle data.

---

## Drive Base Parameters

| Parameter | Curiosity | Helpfulness | Competence | Safety | Goal-Directed |
|-----------|-----------|-------------|------------|--------|---------------|
| **Base weight** | 0.20 | 0.20 | 0.20 | 0.20 | 0.20 |
| **Half-life (cycles)** | 6 | 4 | 8 | 2 | 10 |
| **Trigger threshold** | 0.50 | 0.70 | 0.60 | 0.70/0.85/0.95 (soft/hard/emergency) | 0.55 |
| **Max raw score** | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |

### Rationale for Half-Life Values

| Drive | Half-life | Why |
|-------|-----------|-----|
| Curiosity | 6 cycles | Moderate persistence - exploration interest should last a few cycles but not dominate |
| Helpfulness | 4 cycles | Faster decay - user requests are time-sensitive; old requests lose urgency |
| Competence | 8 cycles | Long persistence - capability gaps do not disappear quickly; sustained motivation is needed |
| Safety | 2 cycles | Fast decay - safety concerns are urgent but transient; once addressed, urgency should drop |
| Goal-Directed | 10 cycles | Longest persistence - goals persist across many cycles; long-term objectives need sustained drive |

---

## Boredom Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Trigger threshold** | 0.50 | Midpoint - triggers exploration before stagnation, but not too aggressively |
| **Floor (user active)** | 0.30 | Low enough to not interfere, high enough to not be zero |
| **Floor (user away)** | 0.0 | No floor - boredom can fall to 0 when the user is away and context is still fresh |
| **Stale bonus max** | 0.20 | Capped to prevent runaway boredom from stale time alone |

### Why 0.50 vs. Alternatives

| Threshold | Pros | Cons |
|-----------|------|------|
| **0.45** | More proactive exploration | Risk of triggering on minor staleness and creating noise |
| **0.50** | Balanced - triggers before stagnation, not before normal variation | May miss some legitimate exploration opportunities |
| **0.60** | Less noise, higher quality | Risk of stagnation - agent may stay on the same topic too long |

**Current choice: 0.50** - validated through Phase 5 testing. The system correctly stops when nothing qualifies `>= 0.50`, which supports the threshold choice.

---

## Safety Veto Thresholds

| Level | Threshold | Effect |
|-------|-----------|--------|
| Soft | >= 0.70 | Action allowed with additional scrutiny |
| Hard | >= 0.85 | External action blocked, pending manual review |
| Emergency | >= 0.95 | All external actions blocked |

### Why These Values

- **Soft (0.70):** Early warning - gives the agent time to reconsider before a hard block
- **Hard (0.85):** Clear danger signal - external actions should not proceed without review
- **Emergency (0.95):** Imminent harm - no external actions, period

---

## Tie-Breaking Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Tie threshold** | 0.05 | Drives within 0.05 are considered tied |
| **Recency dampening** | 0.85 | 15 percent dampening for the last winner |
| **Oscillation detection** | 4 alternations in 6 cycles | Enough to confirm pattern, not so sensitive that it triggers on noise |
| **Oscillation damping** | 0.80 | 20 percent dampening for oscillating drives |
| **Oscillation damping duration** | Persists until context changes or 12 cycles pass, whichever comes first | Damping is temporary, not permanent punishment |

---

## Signal Source Weights

### Curiosity Drive

| Signal | Weight | Max Contribution |
|--------|--------|-----------------|
| Stale topic ratio | 0.30 | 0.30 |
| Research gap count | 0.15 per gap | 0.75, capped at 5 gaps |
| Novelty index | 0.20 | 0.20 |
| User engagement inverse | 0.25 | 0.25 |
| Stale bonus | variable | 0.20 max |

### Helpfulness Drive

| Signal | Weight | Max Contribution |
|--------|--------|-----------------|
| Pending requests | 0.35 per request | 1.05, capped at 3 requests |
| User active | 0.20 | 0.20 |
| Health issues | 0.15 per issue | 0.45, capped at 3 issues |
| Deadline proximity | 0.10 | 0.10 |
| External action pending | 0.20 | 0.20 |

### Competence Drive

| Signal | Weight | Max Contribution |
|--------|--------|-----------------|
| Capability gaps | 0.20 per gap | 1.00, capped at 5 gaps |
| Error rate | 0.15 per 10 percent errors | 0.45, capped at 30 percent errors |
| Skill debt | 0.10 | 0.10 |
| Benchmark delta | 0.15 | 0.15 |
| Research opportunity | 0.10 | 0.10 |

### Safety Drive

| Signal | Weight | Max Contribution |
|--------|--------|-----------------|
| External action pending | 0.30 | 0.30 |
| Constraint risk | 0.25 | 0.25 |
| System instability | 0.15 | 0.15 |
| Unauthorized access | 0.20 | 0.20 |
| Privacy risk | 0.10 | 0.10 |

### Goal-Directed Drive

| Signal | Weight | Max Contribution |
|--------|--------|-----------------|
| Active projects | 0.15 per project | 0.75, capped at 5 projects |
| Milestone distance | 0.25 | 0.25 |
| Deadline pressure | 0.20 | 0.20 |
| Progress velocity inverse | 0.10 | 0.10 |
| Resource availability | 0.10 | 0.10 |

---

## Calibration Notes

These values were determined through:

1. theoretical analysis informed by cognitive science literature
2. Phase 5 testing against live agent behavior (100+ cycles)
3. user feedback confirming the boredom scan behavior felt appropriate

**Phase 5 Validation:** All parameters were validated through Phase 5 testing. The system
operated correctly across 100+ cycles with no drive oscillation, no score-bound violations,
and correct boredom triggering behavior.

**Subject to calibration from:**

- cross-agent coordination data from Phase 6
- user satisfaction feedback
- expanded cycle data beyond Phase 5

**Next calibration milestone:** Phase 6 real-agent testing data, expected Q3 2026.

---

*Remnant Research - from theory to deployment.*
