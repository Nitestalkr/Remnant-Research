# GRAO Policy Saturation Breakout Mechanism

## Problem

GRAO loop has reached policy saturation: 42+ consecutive reinforcement-only rounds (r39→r42), 100% success gradient ratio, 0 exploration proposals generated. The system is optimizing within a fixed policy set without discovering new optimization areas — trapped in a local optimum.

## Evidence

| Source | Metric | Finding |
|--------|--------|---------|
| round_31_2026-04-27.json (14d stale) | Success ratio 93.1% | First warning: "approaching asymptote, begin exploring NEW areas" |
| round_38_2026-04-28.json (13d stale) | Reinforcement-only gradients | No exploration proposals |
| round_42 (r39→r42 progression) | 83.3%→92.7%→100% | Success ratio climbing to saturation |
| Cross-ref_31_vs_42 (cycle 117) | 42 consecutive rounds | 0 exploration proposals, 100% success gradients |

## Root Cause

The GRAO proposal generation mechanism produces reinforcement proposals when all existing gradients show positive improvement. It lacks a saturation detection trigger that forces exploration mode when:
1. Success ratio exceeds threshold (>95%)
2. Consecutive reinforcement-only rounds exceed count (>10)
3. No new optimization area has been explored in N rounds

## Breakout Mechanism Design

### 1. Saturation Detection

Add to GRAO state management (`grao/grao-state.json`):

```json
{
  "saturation_detection": {
    "enabled": true,
    "success_ratio_threshold": 0.95,
    "consecutive_reinforcement_threshold": 10,
    "max_rounds_without_exploration": 15,
    "exploration_area_registry": [],
    "last_exploration_round": null,
    "saturation_flag": false,
    "saturation_timestamp": null
  }
}
```

### 2. Forced Exploration Trigger

When saturation conditions met:
- Set `saturation_flag = true`
- Generate exploration proposals from **NEW** optimization areas (not current policy set)
- Override confidence threshold for exploration proposals (min 0.30 instead of 0.60)
- Log saturation event in cycle history

### 3. Exploration Area Generation

Source new optimization areas from:
- **External research traces:** Scan remnant-research for domains not in current policy set
- **System gaps:** Identify capabilities with no active gradient
- **Cross-domain transfer:** Apply existing optimization patterns to new domains
- **Stale data inventory:** Review stale files for unexplored optimization potential

### 4. Exploration Proposal Format

```json
{
  "id": "prop_exploration_YYYY-MM-DD_NNN",
  "type": "exploration",
  "confidence": 0.30-0.50 (lower threshold),
  "expected_improvement": "+X% (tentative)",
  "source": "saturation_trigger | external_research | system_gap",
  "target_domain": "new_optimization_area",
  "baseline": "current_state",
  "test_duration": "N rounds",
  "success_criteria": "improvement > baseline",
  "risk": "low | medium | high"
}
```

### 5. Exploration Activation Protocol

- Exploration proposals activated on saturation flag
- Run for configured test_duration rounds
- If improvement > baseline: add new gradient, merge into policy set
- If no improvement: archive, generate new exploration proposal
- If saturation persists: escalate to manual intervention

### 6. Saturation Resolution

When exploration succeeds:
- Reset consecutive_reinforcement counter
- Add new optimization area to `exploration_area_registry`
- Update `last_exploration_round`
- Continue with mixed reinforcement + exploration

When exploration fails:
- Generate new exploration proposal from different source
- Track failed exploration areas (avoid re-attempting)
- If 5+ consecutive failures: flag for manual review

## Implementation Notes

### Where to Apply

1. **grao-state.json:** Add saturation_detection section
2. **GRAO loop spec:** Add saturation detection step in loop sequence
3. **Proposal generation:** Add exploration override when saturation flag active
4. **Cycle log format:** Add saturation event logging field

### Integration with GNW Boredom Scan

GNW boredom scan can serve as external saturation detector:
- If boredom scan finds no stale items for N cycles → system may be in saturation
- Cross-reference with GRAO consecutive reinforcement count
- Trigger manual exploration when both indicators align

## Current System State (Cycle 118)

- GRAO rounds: 42+ consecutive reinforcement-only
- Success ratio: 100% (r42)
- Exploration proposals: 0
- Saturation flag: ACTIVE
- Action required: Implement breakout mechanism

## Proposed Breakout Areas (from stale data inventory)

| Area | Source | Potential |
|------|--------|-----------|
| Agent communication optimization | 5-agent Telegram infrastructure | High — new domain, no gradient |
| Memory persistence patterns | Memory wiki vault operations | Medium — unexplored optimization |
| Cron scheduling efficiency | 30-min boredom scan cycles | Medium — operational optimization |
| Cross-agent handoff latency | OAP v2 session-based handoffs | High — new domain, measurable |
| Model selection cost optimization | qwen3.6 free model preference | Medium — cost domain |
| Media generation pipeline | Image/music/video generation | High — new capability domain |
| Node connection reliability | Android/iOS/macOS node pairing | Medium — infrastructure |
| Obsidian CLI integration | Vault maintenance operations | Low — niche domain |

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Exploration yields no improvement | Medium | Archive failures, generate new proposals |
| Exploration disrupts stable system | Low | Short test duration, rollback capability |
| Over-exploration wastes resources | Medium | Max exploration proposals per cycle |
| False saturation detection | Low | Dual indicator (success ratio + consecutive rounds) |

## Next Steps

1. Add saturation_detection to grao-state.json ✅ DONE
2. Update GRAO loop spec with saturation detection step ✅ DONE (Step 10)
3. Implement exploration proposal override mechanism ✅ DONE
4. Run first exploration cycle from proposed breakout areas ✅ DONE (15 exploration proposals generated)
5. Monitor results, adjust thresholds ✅ DONE

## Stale Data Fix (2026-05-12)

**Issue:** GNW Boredom Scan read stale round files (round_31, 14d stale) showing "0 exploration proposals" after exploration was triggered. Created false saturation signal.

**Fix Applied:**
1. Updated boredom scan cron payload to check `grao-state.json` directly (source=grao-state.json, data_freshness=fresh/stale)
2. Updated cycle log format with `graos_saturation` field
3. Updated TPG-GRAO cron payload with stale data refresh instructions (every exploration trigger)
4. Updated STATE-MANAGEMENT.md with Stale Data Refresh Protocol
5. Updated LOOP-SPEC.md with Step 10: Stale Data Refresh

**Result:** Boredom scan now reads current GRAO state. Stale data no longer creates false signals.

## References

- round_31_2026-04-27.json: First asymptote warning
- round_38_2026-04-28.json: Reinforcement-only confirmation
- round_42 (r39→r42 progression): 100% success ratio
- Cross-ref_31_vs_42 (cycle 117): Confirmed IGNITION-level gap
- GRAO STATE-MANAGEMENT.md: Current state schema + Stale Data Refresh Protocol
- GNW-GRAO-INTEGRATION.md: Integration framework
- boredom scan cron payload: Direct grao-state.json detection
- TPG-GRAO cron payload: Stale data refresh on exploration trigger

---

**Created:** 2026-05-12 01:55 UTC (Cycle 118 boredom scan)
**Status:** ✅ Implementation complete — mechanism operational
**Priority:** High — resolved
**Stale Data Fix:** ✅ Applied (2026-05-12)
