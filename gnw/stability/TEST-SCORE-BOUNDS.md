# Test 2: Drive Score Bounds

**Status:** Implemented (clamp on all scores)
**Last Verified:** Phase 5 testing

## Objective

Ensure all drive scores remain within the valid range [0.0, 1.0] at all times.

## Clamp Implementation

```python
def clamp_drive_score(score):
    """Ensure drive score is within valid bounds."""
    if score < 0.0:
        return 0.0
    elif score > 1.0:
        return 1.0
    return score

# Applied at two stages:
# 1. After raw score computation (before modulation)
# 2. After modulation (final score)

raw_scores = {
    'curiosity': clamp_drive_score(compute_curiosity_raw()),
    'helpfulness': clamp_drive_score(compute_helpfulness_raw()),
    'competence': clamp_drive_score(compute_competence_raw()),
    'safety': clamp_drive_score(compute_safety_raw()),
    'goal_directed': clamp_drive_score(compute_goal_directed_raw()),
}

modulated_scores = {}
for drive, raw in raw_scores.items():
    modulated = apply_modulators(drive, raw, context)
    modulated_scores[drive] = clamp_drive_score(modulated)
```

## Extreme Score Monitoring

Scores that reach 0.0 or 1.0 are logged as **extreme events**:

| Score | Meaning | Action |
|-------|---------|--------|
| 0.0 | Drive completely inactive | Log event, check signal chain |
| 1.0 | Drive at maximum | Log event, check for signal overflow |
| ≥ 0.95 | Near-maximum | Flag for review in next cycle |

## Signal Overflow Detection

If a drive score reaches 1.0, check for:
1. **Double-counting** — Same signal counted multiple times
2. **Weight overflow** — Signal weights sum to > 1.0
3. **Stale signal** — Old signal not cleared from computation
4. **Modulation error** — Modulator applied incorrectly

## Success Criteria

- Zero drive scores outside [0.0, 1.0] in any cycle
- All extreme scores logged and investigated
- No signal overflow in 100+ consecutive cycles

## Historical Notes

- No drive score has exceeded [0.0, 1.0] in production
- One instance of curiosity reaching 1.0 — traced to stale signal from old research gap
- Fix: Added signal expiration (signals older than 24 hours are cleared)

---

*Remnant Research — from theory to deployment.*
