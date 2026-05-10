# Agent Handoff - Next Steps

Purpose: continue live Remnant Research implementation without re-deriving project state from scratch.

Last reviewed: 2026-05-10

## Current Project State

- GNW Phase 1-5 is complete.
- GNW Phase 6 is the next formal roadmap phase: Cross-Agent Coordination.
- GRAO pipeline scripts are operational.
- GRAO exploration logic has now been implemented to break reinforcement-only saturation.
- GRAO failure handling has improved:
  - synthetic cycle-start traces are filtered
  - `insufficient_data` category exists
  - trace-source detection was expanded in code
- The public repo follow-through gaps have been addressed:
  - ✅ trace collector's default and `--sources all` now expose all 7 source types
  - ✅ Round 40 artifact metric labeling clarified (outcome_buckets vs exploration_gradients)
  - ✅ root README updated to Round 40 state
  - ✅ FAILURE-ANALYSIS.md opening line corrected (stale absolute claim removed)
- The current live-run bottleneck is no longer "missing exploration logic." It is:
  - validating that the new exploration behavior holds up across future rounds
  - correcting repo and CLI drift so the public mirror matches live behavior
- The strongest ground-truth artifact for current live state is:
  - `tpg-grao/grao/loops/round_40_2026-05-10.json`

## What Was Completed Since The Last Handoff

The previous handoff's GRAO implementation priorities were largely completed:

- exploration-gradient generation added
- saturation detection added
- proposal prioritization during saturation added
- synthetic trace filtering added
- `insufficient_data` gradient category added
- trace collector expanded with more source detection
- new loop artifact written: `round_40_2026-05-10.json`
- handoff updated to continue GRAO validation rather than jumping into GNW Phase 6

The previous handoff's Phase 6 GNW coordination work was not implemented yet.

## Current Review Findings To Correct First

These are the next concrete corrections the repo and live implementation should address before broadening scope again:

1. ✅ `tpg-grao/scripts/trace-collector.js` source wiring fixed:
   - default `CONFIG.sources` includes all 7 types
   - `--sources all` maps to full source set
   - help text documents all 7 source types
   - 3 new sources documented as placeholder-backed
2. ✅ `tpg-grao/grao/loops/round_40_2026-05-10.json` metric labeling fixed:
   - outcome_buckets: `success`, `failure`, `insufficient_data` (sum = 138 reinforcement)
   - exploration_gradients: 5 (generated during saturation)
   - total_gradients: 143 (unambiguous)
3. ✅ `tpg-grao/README.md` updated to Round 40 state (success ratio progression includes round 40, exploration framed as implemented not next phase).
4. `tpg-grao/grao/FAILURE-ANALYSIS.md` is mostly updated, but its opening summary still uses older absolute wording that no longer matches the newer state cleanly.

Interpretation:

- The agent completed real implementation work.
- The next pass should focus on tightening the public mirror and making the live/public paths agree, not starting a new subsystem prematurely.

## What The Live System Says Is Next

From `tpg-grao/grao/loops/round_40_2026-05-10.json`:

- exploration mode activated successfully
- failure count reduced from 10 to 7
- `insufficient_data` count introduced
- exploration gradients were generated
- the next round should validate whether those exploration gradients produce durable, actionable output

The artifact's `next_round` is:

- Exploration gradient validation
- insufficient_data monitoring
- trace-source expansion

This means the immediate implementation priority is:

1. ✅ trace-collector source selection fixed (all 7 sources exposed in default + --sources all)
2. Validate exploration behavior over subsequent rounds
3. Normalize remaining docs to match live state

## Priority Order

### Priority 1 - Validate GRAO Exploration In Live Runs

Goal: confirm that the new exploration logic produces real, repeatable behavior beyond one implementation round.

Primary files:

- `tpg-grao/grao/README.md`
- `tpg-grao/grao/LOOP-SPEC.md`
- `tpg-grao/scripts/gradient-deriver.js`
- `tpg-grao/scripts/proposal-generator.js`
- `tpg-grao/scripts/grao-retriever.js`

Tasks:

1. Run and capture additional live rounds after Round 40.
2. Verify exploration gradients continue to appear when saturation conditions hold.
3. Verify exploration proposals produce actionable outputs, not only structural placeholders.
4. Check whether exploration decreases saturation or only renames reinforcement behavior.
5. Update loop artifacts to show what was actually explored and what changed as a result.

Acceptance criteria:

- At least 2-3 subsequent rounds confirm exploration output persists.
- Exploration proposals lead to concrete actions or configuration changes.
- Loop/report artifacts clearly distinguish reinforcement vs exploration behavior.
- Evidence exists that exploration touched genuinely new optimization areas.

### Priority 2 - Normalize Failure Handling And Evidence

Goal: make the repo's failure-analysis docs, loop artifacts, and runtime categories agree with the new implementation.

Primary files:

- `tpg-grao/grao/FAILURE-ANALYSIS.md`
- `tpg-grao/scripts/gradient-deriver.js`
- `tpg-grao/scripts/trace-collector.js`
- `tpg-grao/grao/LOOP-SPEC.md`

Tasks:

1. Update `tpg-grao/grao/FAILURE-ANALYSIS.md` so it no longer uses stale absolute wording.
2. Reconcile the old "10 persistent failure gradients" language with current round data.
3. Track whether `insufficient_data` items resolve into success or failure over future rounds.
4. Continue expanding trace-source rules only where live evidence shows remaining gaps.
5. Clarify whether `exploration` in round logs is:
   - an outcome bucket
   - a gradient type/category
   - a proposal type downstream of gradients
6. Update Round 40-style artifacts so totals are unambiguous.

Acceptance criteria:

- Docs match code and current loop artifacts.
- Synthetic traces are no longer reported as normal unresolved failures.
- Future loop logs separate failure vs `insufficient_data` cleanly.
- Remaining unresolved failures are tied to specific source-pattern gaps.
- Round metric blocks cannot be misread at a glance.

### Priority 3 - Strengthen Loop Logs And Public Evidence

Goal: make cycle logs reflect the live implementation closely enough that the repo can serve as an accurate research mirror.

Primary files:

- `tpg-grao/grao/README.md`
- `tpg-grao/grao/loops/README.md`
- loop JSON artifacts under `tpg-grao/grao/loops/`
- `README.md`

Tasks:

1. Continue updating cycle logs to match live implementation details.
2. Make round summaries distinguish:
   - traces collected
   - gradients derived
   - success
   - failure
   - `insufficient_data`
   - exploration
3. Make experience counts and cluster counts consistent across:
   - root README
   - `tpg-grao/README.md`
   - `tpg-grao/grao/README.md`
   - loop JSON artifacts
4. Keep loop JSONs as the strongest source of truth when prose drifts.
5. Refresh the root `README.md` so it no longer presents:
   - Round 39 as the newest state
   - pre-exploration wording
   - older loop-round counts if newer public artifacts exist

Acceptance criteria:

- Round logs accurately match live execution behavior.
- Public docs no longer drift from the newest loop artifacts.
- A reader can tell what changed in a round without cross-referencing multiple files.

### Priority 4 - Next Major Track Decision

Decision: Continue GRAO validation first.

Rationale:

- Round 40 was the first exploration implementation, not a stable validation series.
- Exploration behavior is still under-evidenced.
- Public mirror normalization is improved but not finished.
- Trace-collector source coverage still needs to line up with public claims.

When to move to GNW Phase 6:

- After subsequent GRAO runs confirm exploration output persists
- After 2-3 subsequent rounds show exploration behavior is stable
- After logs are trustworthy as feedback artifacts
- After the public CLI/docs accurately reflect the implemented trace-source behavior

If moving to GNW Phase 6, tasks are:

1. Implement drive-score broadcast protocol.
2. Implement cross-agent priority arbitration.
3. Implement shared drive-weight storage/synchronization.
4. Prepare two-agent test path for Andi + Randi2.

Acceptance criteria for choosing GNW Phase 6:

- Exploration work is no longer the active live bottleneck.
- GRAO logs are accurate enough to trust as feedback artifacts.
- At least two agents can exchange drive-state or score information once Phase 6 work begins.

## Files To Trust First

Use these as source-of-truth before older prose summaries:

- `gnw/docs/PARAMETER-VALUES.md`
- `gnw/conflict-resolution/RESOLUTION-LOG.md`
- `gnw/cognitive-cycle/cycle-logs/PHASE-5-EXAMPLE-LOGS.md`
- `tpg-grao/grao/loops/round_40_2026-05-10.json`
- `tpg-grao/grao/FAILURE-ANALYSIS.md`
- `tpg-grao/scripts/trace-collector.js`

Rule:

- If prose conflicts with loop JSONs or canonical parameter files, prefer the loop JSONs and canonical parameter files.
- If the handoff conflicts with current script behavior, prefer the script until the handoff is refreshed again.

## Important Constraints

- Do not overwrite unrelated local changes.
- There may be active local work on cycle-log cleanup or doc normalization. Check `git status` before editing.
- Keep edits narrow and tied to the current implementation target.
- Prefer real behavioral changes before doc cleanup.
- If a doc claim is uncertain, soften wording instead of overstating implementation maturity.
- Do not treat a new source type as "live" unless the collector path and artifact output both support that claim.

## Recommended Work Sequence

1. Read `tpg-grao/grao/loops/round_40_2026-05-10.json`
2. Inspect `tpg-grao/scripts/trace-collector.js`
3. Decide the intended supported source set for the next live/public pass
4. Fix CLI/default/help/doc drift around source selection
5. Read `tpg-grao/grao/README.md`
6. Read `tpg-grao/grao/FAILURE-ANALYSIS.md`
7. Inspect:
   - `tpg-grao/scripts/gradient-deriver.js`
   - `tpg-grao/scripts/proposal-generator.js`
8. Verify exploration behavior in subsequent rounds.
9. Update failure-analysis and loop docs to match actual implementation state.
10. Refresh root/public summaries so they match the newest loop artifacts.
11. Only then decide whether to continue GRAO expansion or move into GNW Phase 6.

## Definition Of Done For The Next Pass

The next pass should count as successful if it achieves all of the following:

- Trace-collector source selection and docs match the intended live/public behavior.
- Round 40 behavior is verified by subsequent runs, not treated as a one-off.
- Failure-analysis docs reflect the implemented changes and no longer use stale absolute claims.
- Round metric blocks clearly distinguish outcome counts from exploration/category counts.
- Root README is aligned with the current GRAO state.
- Cycle logs and summaries closely match live implementation details.
- The next major track is explicitly chosen: further GRAO validation or GNW Phase 6.
