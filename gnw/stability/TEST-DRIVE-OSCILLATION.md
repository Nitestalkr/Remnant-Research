# Test 1: Drive Oscillation Detection

**Status:** Implemented (monitoring mode)
**Last Verified:** Phase 5 testing

## Objective

Detect when drive scores oscillate between two states across consecutive
cycles, indicating a feedback loop that needs damping.

## Detection Algorithm

```python
# Track drive winner history
winner_history = []  # List of (cycle_id, winning_drive, score)

def check_oscillation():
    if len(winner_history) < 6:
        return False, "Insufficient data"

    # Get last 6 winners
    recent = winner_history[-6:]

    # Check for alternating pattern
    drives = [w[1] for w in recent]

    # Count alternations
    alternations = 0
    for i in range(1, len(drives)):
        if drives[i] != drives[i-1]:
            alternations += 1

    # If 4+ alternations in 6 cycles, likely oscillation
    if alternations >= 4:
        # Identify the two oscillating drives
        drive_counts = Counter(drives)
        top_two = drive_counts.most_common(2)

        return True, {
            "oscillating_drives": [d[0] for d in top_two],
            "alternations": alternations,
            "cycle_range": recent
        }

    return False, "No oscillation detected"
```

## Remediation Protocol

### Level 1: Recency Bias (First Response)

When oscillation is detected:
1. Apply recency bias — the less recently dominant drive wins
2. Log the remediation event
3. Monitor for 3 more cycles

### Level 2: Damping (If Level 1 Fails)

If oscillation persists after 3 cycles:
1. Increase damping factor for oscillating drive by 0.1
2. Log the weight change
3. Monitor for 5 more cycles

### Level 3: Weight Recalibration (If Level 2 Fails)

If oscillation persists after 5 cycles:
1. Trigger full drive weight recalibration
2. Analyze signal sources for both drives
3. Check for conflicting signal inputs
4. Reset weights to baseline and re-evaluate

## Success Criteria

- Oscillation resolved within 5 cycles after detection
- No false positives (normal drive variation should not trigger)
- Remediation logged with before/after scores

## False Positive Prevention

The following are **not** oscillation:
- Normal drive variation (±0.15 between cycles)
- Context-driven shifts (user active → away transitions)
- Single-cycle spikes (boredom scan triggering)

Oscillation requires **sustained alternation** — the same two drives
flipping back and forth with no context change.

---

## Current System State (Cycle 98 — 2026-05-11)

### Oscillation Monitoring Status

**Active cycles:** 98+ | **Current state:** Healthy idle

### Recent Drive History (last 10 cycles)

| Cycle | Time | Winning Drive | Score | Notes |
|-------|------|---------------|-------|-------|
| 98 | 12:44 AM | paperclip SPEC.md | 0.972 | Doc stale refresh |
| 97 | 12:14 AM | REFERENCES.md | 0.84 | Doc stale refresh |
| 96 | 8:39 PM | USER-PRESENCE-DETECTION.md | 0.108 | Doc stale refresh |
| 95 | 8:39 PM | AGENT-HANDOFF-NEXT-STEPS.md | 0.936 | Doc stale refresh |
| 94 | 6:09 PM | PRIORITY-MATRIX.md | 0.864 | Doc stale refresh |
| 93 | 5:39 PM | conflict-resolution README.md | 0.972 | Doc stale refresh |
| 92 | 5:09 PM | EDGE-CASES.md | 0.972 | Doc stale refresh |
| 91 | 4:39 PM | VETO-PROTOCOL.md | 0.648 | Doc stale refresh |
| 90 | 3:39 PM | DRIVE-COMPUTATION.md | 0.864 | Doc stale refresh |
| 89 | 3:10 PM | stability README.md | 0.652 | Doc stale refresh |

### Oscillation Analysis

**No sustained oscillation detected.** Recent winner pattern shows diversity across multiple drives (paperclip docs, GNW foundational docs, stability tests, coordination docs). This reflects healthy multi-drive competition rather than oscillation between two specific drives.

**Pattern:** The boredom scan consistently triggers self-initiation (boredom = 1.0, no pending events), and stale items are scored by novelty × relevance × goal_alignment with 1.5x novelty boost. Winners vary based on which documents have been most stale and most relevant to current system state.

### Drive Health

- **Boredom drive:** Persistent at 1.0 (no external events) — expected idle state
- **Stale-document drive:** Active, processing 5-25 stale items per cycle
- **Innovation drive:** Low (no new research proposals in active phase)
- **System health:** Stable, 98 cycles completed, all self-initiation cycles

### Remediation Events

**None.** No oscillation detected in 98-cycle history. Drive competition is healthy and diverse.

---

*Remnant Research — from theory to deployment.*
