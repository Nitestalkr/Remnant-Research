# Test 3: Boredom Threshold Stability

**Status:** Implemented (threshold check in boredom scan)
**Last Verified:** Phase 5 testing

## Objective

Ensure the boredom score triggers cognitive cycles only when appropriate,
not too frequently (wasteful) or too rarely (stagnant).

## Expected Boredom Behavior

| User State | Expected Boredom Range | Trigger Threshold |
|------------|----------------------|-------------------|
| User active | 0.0–0.30 (suppressed) | Never triggers (floor at 0.30) |
| User away, fresh context | 0.10–0.40 | Triggers only if ≥ 0.50 |
| User away, stale context | 0.30–0.70 | Triggers when ≥ 0.50 |
| User away, very stale | 0.50–0.90 | Triggers, may escalate |

## Anomaly Detection

### Anomaly 1: Boredom ≥ 0.50 While User Active

**Cause:** User presence modifier not applied correctly.
**Detection:** Check user active status when boredom ≥ 0.50.
**Resolution:** Apply floor modifier, log anomaly.

### Anomaly 2: Boredom < 0.30 While User Away for > 2 Hours

**Cause:** Stale_bonus not accumulating, or signal sources stale.
**Detection:** Track user-away duration vs. boredom score.
**Resolution:** Verify stale_bonus calculation, check signal freshness.

### Anomaly 3: Boredom ≥ 0.70 for 10+ Consecutive Cycles

**Cause:** Persistent stale context, possible signal capture error.
**Detection:** Track consecutive high-boredom cycles.
**Resolution:** Trigger signal audit, check for capture errors.

## Boredom Component Tracking

Each boredom computation logs:

| Component | Value | Description |
|-----------|-------|-------------|
| traditional | 0.0–1.0 | Overlap with recent topics |
| curiosity | 0.0–1.0 | Research gap + novelty |
| self-awareness | 0.0–1.0 | Confidence in current state |
| stale_bonus | 0.0–0.20 | Time since last context change |
| **total** | 0.0–1.0 | Final boredom score |
| **effective** | 0.0–1.0 | After user presence modifier |

## Success Criteria

- Boredom triggers only when user is away AND context is stale
- No false triggers while user is engaged
- No missed triggers when user is away > 30 minutes
- Boredom score distribution matches expected range

## Historical Notes

- Boredom formula correctly stops forcing work when nothing qualifies ≥ 0.50
- Key insight from testing: the system should not "try harder" when bored — it should just work on what's most relevant

---

*Remnant Research — from theory to deployment.*