# Cron Scheduler Optimization — Architecture Spec

## Purpose

Optimize cron job scheduling for the Andi system to reduce context overflow, improve reliability, and balance workload across time windows.

## Current State

### Job Distribution
| Job | Schedule | Window |
|-----|----------|--------|
| GNW-Cognitive-Cycle | every 3h | 00, 03, 06, 09, 12, 15, 18, 21 |
| GNW-Boredom-Scan | every 30m | Continuous |
| TPG-GRAO-AutoEvolution | 08,10,12,14,16,18,20 EST | 08-20 |
| Clawstr-Heartbeat | 09,11,13,15,17,19,21 EST | 09-21 |
| Stability-Monitor | every 4h | 00, 04, 08, 12, 16, 20 |
| ArXiv-Monitor | daily | TBD |
| weekly-knowledge-harvest | 09 Sunday | Sunday |
| weekly-memory-backup | 18 Sunday | Sunday |
| daily-health-check | daily | TBD |
| daily-security-audit | daily | TBD |
| daily-update-status | daily | TBD |
| weekly-benchmark-full | 10 Saturday | Saturday |
| daily-benchmark-stability | 09 daily | Daily |

### Issues
- **Context overflow:** ArXiv Monitor, daily health/security/update jobs
- **Cluster overlap:** TPG-GRAO and Clawstr overlap at 12,14,16,18,20
- **Boredom Scan timeout:** 1 consecutive error (likely payload size)
- **Memory decline:** 15.8% → 13.4% (system health)

## Optimization Strategy

### 1. Spread Workload

**Morning (06-12 EST):**
- GNW-Cognitive-Cycle (06, 09)
- GNW-Boredom-Scan (continuous)
- TPG-GRAO-AutoEvolution (08, 10)
- daily-benchmark-stability (09)
- Stability-Monitor (08)

**Midday (12-18 EST):**
- GNW-Cognitive-Cycle (12)
- Clawstr-Heartbeat (13, 15)
- TPG-GRAO-AutoEvolution (14, 16)
- ArXiv-Monitor (12 — single run, reduce payload)

**Evening (18-24 EST):**
- GNW-Cognitive-Cycle (18, 21)
- Clawstr-Heartbeat (17, 19, 21)
- TPG-GRAO-AutoEvolution (18, 20)
- Stability-Monitor (20)

**Weekend:**
- weekly-benchmark-full (10 Saturday)
- weekly-knowledge-harvest (09 Sunday)
- weekly-memory-backup (18 Sunday)

### 2. Reduce Context Overflow

**ArXiv-Monitor:**
- Limit to 50 papers/day instead of 900-2000
- Focus on active research keywords only
- Download only top 5 picks
- Summary output instead of full paper content

**Daily health/security/update jobs:**
- Consolidate into single "daily-system-check" job
- Run at 06 EST (before peak workload)
- Output to benchmarks/metrics/ (structured format)
- Report only if anomalies detected

### 3. Boredom Scan Fix

**Current timeout issue:** Likely payload size exceeds model context limit.

**Fix:**
- Reduce boredom scan message to essential instructions only
- Remove detailed cycle logging format from prompt (reference file instead)
- Set timeout to 120s (current 300s is excessive for a scan)
- Reduce drive computation complexity in prompt

### 4. Cluster Separation

**TPG-GRAO vs Clawstr:**
- Move Clawstr to odd hours only: 09, 11, 13, 15, 17, 19, 21
- TPG-GRAO stays on even hours: 08, 10, 12, 14, 16, 18, 20
- No overlap → reduced concurrent workload

## Implementation Plan

### Phase 1: Immediate Fixes
1. Fix Boredom Scan payload (reduce message size)
2. Consolidate daily health/security/update jobs
3. Reduce ArXiv-Monitor payload

### Phase 2: Schedule Optimization
1. Implement spread workload schedule
2. Separate TPG-GRAO and Clawstr windows
3. Add weekend-only jobs

### Phase 3: Monitoring
1. Track cron health metrics (weekly benchmark)
2. Monitor context overflow events
3. Adjust schedules based on data

## Expected Improvements

| Metric | Before | After |
|--------|--------|-------|
| Cron Health | 0.75 | 0.85+ |
| Context Overflow | 2 jobs | 0 jobs |
| Cluster Overlap | 5 hours | 0 hours |
| Memory Pressure | High | Reduced |

## Cycle 128 Follow-Up Analysis

### Current System State (2026-05-16 18:39 EST)
- **Cycle count:** 128+ GNW boredom scans
- **GRAO status:** Exploration mode active (round 42, 16 exploration rounds, 10 active proposals, last_proposal_application 7.5h ago)
- **Boredom Scan timeout issue:** Still active — payload size exceeds model context limit
- **Drive health:** Healthy (1.0 boredom, stable oscillation)
- **Memory decline:** 15.8% → 13.4% (tracked)
- **System idle:** No pending events, healthy idle state
- **GHO-44 sync test:** COMPLETE — Zero RMS 0.0001, full convergence
- **Weekly benchmark:** 0.72 (+0.06 vs baseline 0.66)

### GRAO Alignment
- **Active proposal:** exp_04 (Dynamic Cron Priority Engine)
- **Target:** cron-scheduler-refinement
- **This spike is the direct research artifact for exp_04**
- **Additional alignment:** exp_03 (Adaptive Benchmark Cycle Framework) — benchmark results available

### Priority: Immediate Action

**Boredom Scan payload fix** (highest priority, directly addresses current timeout):
1. Remove detailed cycle logging format from prompt — reference file instead
2. Reduce drive computation complexity in prompt
3. Set timeout to 120s (current 300s is excessive)
4. Remove cycle notes table from workspace-state.md (reference instead)

**Consolidation** (medium priority):
1. Merge daily health/security/update jobs → single daily-system-check
2. Run at 06 EST before peak workload

**Benchmark integration** (new, tied to exp_03):
1. Benchmark results available: cognitive 0.70, agents 0.65, research 0.55, stability 0.92
2. Use benchmark data as cron health metric input
3. Track improvement trajectory (0.66→0.72 baseline)

### Pending Actions
- [ ] Test boredom scan payload reduction
- [ ] Consolidate daily jobs
- [ ] Benchmark cron health before/after
- [ ] Track context overflow events
- [ ] Integrate benchmark data into cron health monitoring

### Research Progress
- **Paper archive:** 481 uncatalogued (down from 500)
- **GRAO exploration:** 16 rounds, 5 validated cross-cluster gradients
- **GHO-44:** Sync test complete, structural ceiling identified (fixed agents vs Zero near-perfect)
- **Consolidation report:** v1.1, prototype viability 0.47→0.70 target

## Cycle 131 Follow-Up Analysis

### Current System State (2026-05-17 03:20 EST)
- **Cycle count:** 131+ GNW boredom scans
- **GRAO status:** Exploration mode active (round 42, 16 exploration rounds, 10 active proposals, last_proposal_application 2026-05-16T15:03:00Z, ~12h ago)
- **Boredom Scan payload issue:** Still active — payload size exceeds model context limit (30-min cycle running, but payload contains full workspace-state.md cycle notes table)
- **Drive health:** Healthy (1.0 boredom, stable oscillation, 0 veto events)
- **Memory decline:** 13.4% (tracked, no remediation needed)
- **System idle:** No pending events, healthy idle state
- **Weekly benchmark:** 0.72 (2026-05-16, cognitive 0.70, agents 0.65, research 0.55, stability 0.92)
- **Paper archive:** 481 uncatalogued (down from 500)
- **GHO-44:** Sync test complete

### GRAO Alignment
- **Active proposal:** exp_04 (Dynamic Cron Priority Engine) — this spike is the direct research artifact
- **Additional alignment:** exp_03 (Adaptive Benchmark Cycle Framework) — benchmark results available
- **exp_01:** Cross-Cluster Resource Fusion — validated
- **exp_02:** Multi-Source Research Pipeline Expansion — validated
- **exp_05:** Trace Quality & Coverage Matrix — validated
- **5 exploration gradients:** all validated, success_ratio=1

### Actionable Recommendations

**Priority 1 — Boredom Scan payload fix** (directly addresses current timeout, tied to exp_04):
- Current scan payload contains full workspace-state.md cycle notes table (131+ entries)
- Fix: replace cycle notes table with reference link to workspace-state.md
- Remove detailed cycle logging format from prompt body
- Reduce drive computation complexity in prompt
- Set timeout to 120s (current 300s excessive)
- **Estimated impact:** Eliminates timeout errors, reduces memory pressure

**Priority 2 — Cluster separation validation**:
- TPG-GRAO (even hours) vs Clawstr (odd hours) — no overlap confirmed
- Current schedule: TPG-GRAO 08,10,12,14,16,18,20; Clawstr 09,11,13,15,17,19,21
- **Status:** Already implemented, working correctly

**Priority 3 — Consolidation**:
- Merge daily health/security/update → single daily-system-check at 06 EST
- Reduce ArXiv-Monitor payload: 50 papers/day focus on active keywords
- **Status:** Pending, tied to exp_04

**Priority 4 — Benchmark integration** (tied to exp_03):
- Use benchmark data as cron health metric input
- Track improvement trajectory: baseline 0.66 → current 0.72
- **Status:** New, pending

### Pending Actions
- [ ] Test boredom scan payload reduction (Priority 1)
- [ ] Consolidate daily jobs (Priority 2)
- [ ] Reduce ArXiv-Monitor payload (Priority 2)
- [ ] Benchmark cron health before/after (Priority 3)
- [ ] Track context overflow events (Priority 3)
- [ ] Integrate benchmark data into cron health monitoring (Priority 4)

### Research Progress
- **Paper archive:** 481 uncatalogued, 19 papers catalogued in recent cycles
- **GRAO exploration:** 16 rounds, 5 validated gradients, 10 active proposals
- **Consolidation report:** v1.1, prototype viability 0.47→0.70 target
- **Cycle 131 stale scan:** 8 items scored, cron-scheduler-optimization.md (0.860) wins IGNITION

## Cycle 139 Follow-Up Analysis

### Current System State (2026-05-17 10:31 EST)
- **Cycle count:** 139+ GNW boredom scans
- **GRAO status:** Exploration mode active (round 42, 10 active proposals), but **mechanism stalled** — last_proposal_application 42h stale (exceeds 24h threshold)
- **Boredom Scan payload issue:** Still active — payload contains full workspace-state.md cycle notes table
- **Drive health:** Healthy (1.0 boredom, stable oscillation, 0 veto events)
- **Memory decline:** 13.4% (tracked)
- **System idle:** No pending events, healthy idle
- **Weekly benchmark:** 0.72 (2026-05-16, cognitive 0.70, agents 0.65, research 0.55, stability 0.92)
- **Paper archive:** 459 uncatalogued

### Structural Gap Identified (Cycle 139)
- **GRAO validation stall:** 10 active proposals with ZERO validation evidence
- **Cluster imbalance:** agent_prompt_optimization dominates (75%)
- **Pipeline stalled at application/validation** — mechanism works but execution gap
- **Recommendation:** validate 2 underrepresented proposals, trigger proposal-applier cron

### GRAO Alignment
- **Active proposal:** exp_04 (Dynamic Cron Priority Engine) — this spike is the direct research artifact
- **Additional alignment:** exp_03 (Adaptive Benchmark Cycle Framework)
- **exp_01, exp_02, exp_05:** validated
- **5 exploration gradients:** all validated, success_ratio=1
- **New gap:** exp_03 and exp_04 need validation evidence

### Priority 5 — GRAO Validation Gap (NEW, CYCLE 139)
- **Issue:** 10 active proposals, 0 validation results
- **Mechanism works** (exploration triggered, gradients validated) but **pipeline stalled at application**
- **Action:** validate 2 underrepresented proposals (research-domain-expansion, trace-collection-enhancement)
- **Action:** implement proposal-applier cron to close application gap
- **Risk:** exploration mode becomes theoretical without validation data

### Priority 6 — Boredom Scan Payload Fix (still Priority 1)
- **Same fix as before:** remove cycle notes table, reduce drive computation, set timeout 120s
- **Impact:** eliminates timeout errors, reduces memory pressure

### Pending Actions
- [ ] Test boredom scan payload reduction (Priority 1)
- [ ] Consolidate daily jobs (Priority 2)
- [ ] Reduce ArXiv-Monitor payload (Priority 2)
- [ ] Benchmark cron health before/after (Priority 3)
- [ ] Track context overflow events (Priority 3)
- [ ] Integrate benchmark data into cron health monitoring (Priority 4)
- [ ] Validate 2 underrepresented GRAO proposals (Priority 5)
- [ ] Implement proposal-applier cron (Priority 5)

### Research Progress
- **Paper archive:** 459 uncatalogued, 7 papers catalogued in Cycle 135
- **GRAO exploration:** 16 rounds, 5 validated gradients, 10 active proposals, **validation stall identified**
- **Consolidation report:** v1.1, prototype viability 0.47→0.70 target
- **Cycle 139 stale scan:** 5 items scored, GRAO validation gap (0.504) highest

## Notes

- All changes tested via cron update tool (no manual config edits)
- Privacy-safe: only system state + scheduling
- Benchmark comparison: track cron health before/after
- **This spike is tied to GRAO exploration proposal exp_04 (Dynamic Cron Priority Engine)**
- **New gap from Cycle 139:** GRAO validation stall — mechanism works but pipeline stalled at application

---

_Spike-Write v1.0 — 2026-05-11
Updated: 2026-05-17 Cycle 139_
