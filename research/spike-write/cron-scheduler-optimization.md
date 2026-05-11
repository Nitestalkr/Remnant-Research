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

## Notes

- All changes tested via cron update tool (no manual config edits)
- Privacy-safe: only system state + scheduling
- Benchmark comparison: track cron health before/after

---

_Spike-Write v1.0 — 2026-05-11_
