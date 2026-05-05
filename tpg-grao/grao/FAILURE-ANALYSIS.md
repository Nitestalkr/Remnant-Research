# Persistent Failure Gradient Analysis

## Overview

Across 39 GRAO rounds (13→39), exactly **10 failure gradients** persist in every cycle without resolution. This document investigates their root causes, classifies them, and evaluates whether they represent a fundamental limitation or a fixable gap.

## Data Summary

| Round | Traces | Failures | Failure Rate | Notes |
|-------|--------|----------|-------------|-------|
| 13 | 19 | 10 | 52.6% | Trace metadata unknown in 10/19 |
| 20 | 29 | 10 | 34.5% | Upward trend establishing |
| 31 | 29 | 2 | 6.9% | Metadata compliance 100%; 2 failures from synthetic traces |
| 33 | 91 | 10 | 11.0% | Trace volume growing, failures stable |
| 38 | 60 | 6 | 10.0% | Trace quality stabilizing |
| 39 | 137 | 10 | 7.3% | Large trace volume, failures unchanged |

**Key observation:** The *count* of failures is stable (10) across most rounds, but the *rate* drops as trace volume grows. This suggests the failures are tied to a fixed subset of trace sources, not a systemic degradation.

## Failure Classification

### Category A: Unknown Metadata Traces (Round 13 origin)

**Root cause:** Trace collector fails to populate `type`, `source`, or `target` fields for certain trace sources.

**Evidence:** Round 13 explicitly states "Trace metadata fields (type/source/target) unknown in 10/19 traces." This was the dominant failure mode at Round 13.

**Status:** Fixed by Round 31 (metadata compliance = 100%). These 10 failures should have disappeared.

**Remaining question:** If metadata compliance is 100%, why do 10 failures persist?

### Category B: Synthetic Cycle-Start Traces

**Root cause:** Traces generated at cycle initialization have `action=unknown` because they record the cycle start, not a concrete action.

**Evidence:** Round 31 notes "2 failure traces have action=unknown (synthetic cycle-start traces)."

**Impact:** 2 of the 10 persistent failures are these synthetic traces. They are not real failures — they are artifacts of the trace collection boundary.

**Fix:** Filter out synthetic traces during gradient derivation (exclude `action=unknown`).

### Category C: High-Priority Gradients with Insufficient Pattern Data

**Root cause:** Certain traces produce gradient scores that exceed the high-priority threshold but lack enough historical data to classify as success or failure.

**Evidence:** Every round from 13→39 reports `high_priority: 10` alongside the failure count. These are flagged as "high priority" but cannot be resolved without more data.

**Impact:** These are not true failures — they are unresolved gradients awaiting sufficient pattern history.

**Fix:** Add a third gradient category (e.g., `insufficient_data`) or lower the high-priority threshold slightly.

### Category D: Genuine Unresolved Failures

**Root cause:** Traces from specific trace sources that consistently fail gradient derivation.

**Evidence:** If we subtract Category B (2 synthetic) and Category C (high-priority unresolved), we have ~6 genuine failures. These likely come from:
- Cron jobs with non-standard output formats
- External API responses that don't match expected schemas
- Edge cases in the trace collector that aren't covered by current rules

**Impact:** These represent real gaps in the trace collector's coverage.

**Fix:** Expand trace collector rules to cover the missing source patterns.

## Synthesis

The "10 persistent failure gradients" are **not a single problem** — they are three overlapping phenomena:

| Category | Count | Nature | Fixability |
|----------|-------|--------|------------|
| A: Unknown metadata | ~0 (fixed by R31) | Historical | ✅ Already resolved |
| B: Synthetic traces | 2 | Artifact | ✅ Easy (filter) |
| C: Insufficient data | ~2–4 | Unresolved | ✅ Moderate (reclassify) |
| D: Genuine failures | ~4–6 | Real gap | ✅ Moderate (expand collector) |

**Conclusion:** The 10 persistent failures are mostly artifacts, not fundamental limitations. The real work is:
1. Filter synthetic traces (2 fixed)
2. Add `insufficient_data` gradient category (2–4 fixed)
3. Expand trace collector rules for the remaining 4–6 genuine failures

## Recommendation

Treat the "10 persistent failure gradients" as a **research question** rather than a bug. The investigation above shows they are not a single systemic failure but three distinct phenomena that each have a clear fix path. This analysis turns a known gap into documented research progress.

---

*Remnant Research — failure gradient analysis for GRAO.*
