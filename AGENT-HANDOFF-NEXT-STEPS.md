# Agent Handoff - Next Steps

Purpose: continue live Remnant Research implementation without re-deriving project state from scratch.

Last reviewed: 2026-05-09

## Current Project State

- GNW Phase 1-5 is complete.
- GNW Phase 6 is the next formal roadmap phase: Cross-Agent Coordination.
- GRAO pipeline scripts are operational.
- The current live-run bottleneck is GRAO policy saturation, not missing GNW core architecture.
- The strongest ground-truth artifact for current live state is:
  - `tpg-grao/grao/loops/round_39_2026-05-04.json`

## What The Live System Says Is Next

From `tpg-grao/grao/loops/round_39_2026-05-04.json`:

- Policy saturation is active.
- No new optimization areas were explored.
- `next_round` is:
  - New optimization area exploration
  - Failure gradient investigation
  - GRAO expansion

This means the immediate implementation priority is:

1. GRAO Exploration Phase
2. Failure-gradient remediation
3. Experience-cluster expansion
4. Then GNW Phase 6 multi-agent coordination work

## Priority Order

### Priority 1 - Implement GRAO Exploration

Goal: stop reinforcement-only looping and introduce exploration gradients and non-reinforcement proposals.

Primary files:

- `tpg-grao/grao/README.md`
- `tpg-grao/grao/LOOP-SPEC.md`
- `tpg-grao/scripts/gradient-deriver.js`
- `tpg-grao/scripts/proposal-generator.js`
- `tpg-grao/scripts/grao-retriever.js`

Tasks:

1. Add explicit exploration-gradient generation when saturation is detected.
2. Detect saturation from live loop conditions:
   - 15+ or 20+ consecutive reinforcement-only rounds
   - plateau near 90%+ success ratio
   - no new optimization areas explored
3. Add proposal logic that prioritizes exploration proposals over reinforcement proposals during saturation.
4. Record exploration-specific output in loop reports and proposal artifacts.

Acceptance criteria:

- A run can emit an exploration gradient, not only reinforcement-style output.
- Proposal generation can produce at least one non-reinforcement proposal during saturation.
- Loop/report artifacts clearly distinguish reinforcement vs exploration behavior.

### Priority 2 - Resolve Persistent Failure Gradient Classes

Goal: reduce known artifact failures and make remaining failures easier to classify.

Primary files:

- `tpg-grao/grao/FAILURE-ANALYSIS.md`
- `tpg-grao/scripts/gradient-deriver.js`
- `tpg-grao/scripts/trace-collector.js`
- `tpg-grao/grao/LOOP-SPEC.md`

Tasks:

1. Filter synthetic traces where `action=unknown` during gradient derivation.
2. Add an `insufficient_data` category instead of forcing all ambiguous items into failure/high-priority buckets.
3. Expand trace-collector rules for genuine unresolved source-pattern gaps.
4. Update docs only after behavior changes are real.

Acceptance criteria:

- Synthetic cycle-start traces no longer count as normal failures.
- Ambiguous items can be classified as `insufficient_data`.
- Failure counts in future loop logs better match actual unresolved issues.

### Priority 3 - Expand GRAO Experience Depth

Goal: move beyond saturation by increasing experience diversity and enabling cross-cluster discovery.

Primary files:

- `tpg-grao/grao/README.md`
- `tpg-grao/grao/loops/README.md`
- loop JSON artifacts under `tpg-grao/grao/loops/`

Tasks:

1. Expand experience coverage beyond the current plateau.
2. Support cross-cluster analysis instead of only reinforcing current strong patterns.
3. Make loop outputs show whether a round added new experience types or only reinforced old ones.

Acceptance criteria:

- New experience types or clusters can be introduced and tracked.
- Loop artifacts show whether diversity increased.

### Priority 4 - GNW Phase 6 Cross-Agent Coordination

Goal: continue the formal GNW roadmap after the GRAO saturation bottleneck is addressed.

Primary files:

- `gnw/docs/ROADMAP.md`
- `gnw/docs/CROSS-AGENT-COORDINATION.md`
- `gnw/docs/GNW-GRAO-INTEGRATION.md`

Tasks:

1. Implement drive-score broadcast protocol.
2. Implement cross-agent priority arbitration.
3. Implement shared drive-weight storage/synchronization.
4. Prepare two-agent test path for Andi + Randi2.

Acceptance criteria:

- At least two agents can exchange drive-state or score information.
- Arbitration rules exist for conflicting priorities.
- A concrete multi-agent test artifact or run path exists.

## Files To Trust First

Use these as source-of-truth before older prose summaries:

- `gnw/docs/PARAMETER-VALUES.md`
- `gnw/conflict-resolution/RESOLUTION-LOG.md`
- `gnw/cognitive-cycle/cycle-logs/PHASE-5-EXAMPLE-LOGS.md`
- `tpg-grao/grao/loops/round_39_2026-05-04.json`
- `tpg-grao/grao/FAILURE-ANALYSIS.md`

Rule:

- If prose conflicts with loop JSONs or canonical parameter files, prefer the loop JSONs and canonical parameter files.

## Important Constraints

- Do not overwrite unrelated local changes.
- There is currently an uncommitted local modification in:
  - `gnw/cognitive-cycle/BOREDOM-FORMULA.md`
- Keep edits narrow and tied to the current implementation target.
- Prefer real behavioral changes before doc cleanup.
- If a doc claim is uncertain, soften wording instead of overstating implementation maturity.

## Recommended Work Sequence

1. Read `tpg-grao/grao/loops/round_39_2026-05-04.json`
2. Read `tpg-grao/grao/README.md`
3. Read `tpg-grao/grao/FAILURE-ANALYSIS.md`
4. Inspect:
   - `tpg-grao/scripts/gradient-deriver.js`
   - `tpg-grao/scripts/proposal-generator.js`
   - `tpg-grao/scripts/trace-collector.js`
5. Implement exploration-gradient and proposal-priority behavior.
6. Implement failure-class remediation.
7. Update loop/report artifacts or docs to reflect the new actual behavior.
8. Only then move to GNW Phase 6 implementation.

## Definition Of Done For The Next Pass

The next pass should count as successful if it achieves all of the following:

- Exploration logic exists in code, not just docs.
- Saturation can produce exploration-oriented output.
- Synthetic failure traces are handled better than before.
- The resulting behavior is captured in updated artifacts or logs.
- The repo clearly reflects that the live system moved beyond pure reinforcement-only saturation handling.
