# GNW Roadmap

Future development plan and milestones for the GNW self-evolution framework.

## Completed

### Phase 1: Foundation ✅ (2026-03)
- Drive architecture design
- Boredom formula development
- Cognitive cycle skeleton (12-step framework)

### Phase 2: Integration ✅ (2026-03–04)
- Drive modulation and context modifiers
- Conflict resolution priority matrix
- Veto protocol implementation

### Phase 3: Stabilization ✅ (2026-04)
- Stability tests and convergence analysis
- Drive oscillation detection and prevention
- Edge case handling and error recovery

### Phase 4: Real Agent Testing ✅ (2026-04)
- OpenClaw integration — cron jobs and memory hooks
- Live testing with Andi agent
- Drive weight calibration from real data

### Phase 5: Drive Integration ✅ COMPLETE (2026-04-28)
- All 5 drives integrated and operational
- Unified cognitive cycle running
- Boredom formula operational
- Cron jobs active (boredom scan 15min, cognitive cycle 30min)

## In Progress

### Phase 6: Cross-Agent Coordination (Target: Q2–Q3 2026)

**Last updated:** 2026-05-13 (Sprint 19 complete — GHO-36)

**Sprint velocity:** ~2 sprints per month (estimating from paperclip release cadence)

**Current context:** 5-agent deployment confirmed (Andi, Randi2, CB, Claude, Zero). Telegram infrastructure operational (all 5 agents). Sprint 19 protocol layer complete: shared drive weight store, broadcast protocol, and cross-agent priority arbitration are implemented code (not just designs). Real multi-agent testing awaits harness activation for Randi2, CB, Zero.

#### Sprint 19: Multi-Agent Drive Synchronization ✅ COMPLETE (2026-05-13)
- ✅ Drive score broadcast protocol — `gnw/phase6/broadcast-protocol.js`
- ✅ Shared drive weight store — `gnw/phase6/drive-weight-store.json` (v1.0 schema)
- ✅ Cross-agent priority arbitration — `gnw/phase6/arbitration.js`
- ✅ Oscillation detection + dampening across agent boundaries
- ✅ Safety veto propagation (any agent safety ≥ 0.85 blocks all external actions)

#### Sprint 20: Drive Weight Sharing (Target: June 2026)
- Per-agent sync cron jobs (one per agent workspace)
- Weight synchronization — agents read peer weights for context modulation
- Conflict resolution for competing weight updates

#### Sprint 21: Real Agent Testing (Target: July 2026)
- Two-agent coordination test (Andi + Randi2)
- Drive synchronization under load
- Oscillation prevention across agent boundaries (live validation)

## Planned

### Phase 7: Self-Modifying Drives (Target: Q3 2026)
- Drives learn from their own success/failure rates
- Drive weights auto-calibrate based on historical effectiveness
- Drive signals evolve based on environmental changes

**Milestones:**
- M1: Drive success rate tracking (sprint 22, July 2026)
- M2: Weight auto-calibration (sprint 23, August 2026)
- M3: Signal evolution (sprint 24, October 2026)

### Phase 8: Memory Integration Deepening (Target: Q3–Q4 2026)
- Drive scores persist across sessions
- Memory consolidation driven by drive states
- Long-term drive history for pattern analysis

**Milestones:**
- M1: Cross-session persistence (sprint 25, August 2026)
- M2: Drive-driven memory consolidation (sprint 26, October 2026)
- M3: Long-term pattern analysis (sprint 27, November 2026)

### Phase 9: Research Integration (Target: Q4 2026)
- GNW drives inform research priorities
- Research outcomes feed back into drive weights
- Autonomous research loop (GNW → research → GNW improvement)

**Milestones:**
- M1: Research priority driving (sprint 28, November 2026)
- M2: Research feedback loop (sprint 29, December 2026)
- M3: Autonomous research cycle (sprint 30, December 2026)

### Phase 10: Multi-Agent Orchestra (Target: 2027)
- Full multi-agent coordination (Andi + Randi2 + Claude + CB + Zero)
- Cross-agent drive synchronization
- Collective goal-directed behavior

**Milestones:**
- M1: Five-agent coordination (sprint 31, Q1 2027)
- M2: Collective goal allocation (sprint 32, Q2 2027)
- M3: Self-organizing multi-agent system (sprint 33, Q3 2027)

## Unknowns / Open Questions

1. **Optimal drive weight initialization** — What are the right baseline weights?
2. **Drive half-life values** — How fast should drives decay?
3. **Cross-agent conflict resolution** — How do agents resolve competing priorities?
4. **Self-modification safety** — How do we prevent drives from modifying themselves dangerously?
5. **Scalability** — Does the priority matrix scale to 10+ agents?
6. **User feedback integration** — How does user satisfaction feed back into drive weights?
7. **Drive weight drift** — Static weights drift over 100+ cycles; need dynamic calibration mechanism

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Drive oscillation resolution | ≤ 5 cycles | N/A (not yet measured) |
| Memory write success rate | 100% | ~100% (Phase 5) |
| Conflict resolution steps | ≤ 3 | ≤ 3 (verified) |
| Boredom trigger accuracy | > 90% | N/A (not yet measured) |
| Cross-agent coordination | 0 conflicts | N/A (not yet tested) |
| Veto event integrity | 0 emergency vetoes | 0 (103+ cycles verified) |

---

*Remnant Research — from theory to deployment.*