# Docs

Framework documentation and design decisions for GNW.

## Purpose

This folder holds the higher-level explanatory material for GNW:

- system architecture
- design rationale
- phase roadmap
- current parameterization
- support docs for user engagement and cross-agent coordination

## Contents

- `ARCHITECTURE.md` - high-level system architecture and component diagrams
- `DESIGN-DECISIONS.md` - key design choices and their rationale
- `GLOSSARY.md` - GNW terminology and definitions
- `PARAMETER-VALUES.md` - current working parameter values and calibration notes
- `ROADMAP.md` - future development plan and milestones
- `USER-PRESENCE-DETECTION.md` - engagement detection and modulation behavior
- `CROSS-AGENT-COORDINATION.md` - Phase 6 cross-agent coordination design
- `SAFETY-THREAT-MODEL.md` - safety mechanisms, veto protocols, threat analysis
- `GNW-GRAO-INTEGRATION.md` - GRAO pipeline integration with GNW drives

## Current System State (Cycle 144)

**Deployment:** 5-agent infrastructure active (Andi, Randi2, CB, Claude, Zero) — Telegram bots operational
**Comms:** Dual channel (Discord + Telegram bots)
**GRAO Pipeline:** Round 42, exploration mode active, 10 active proposals, 10 gradients validated (cross-cluster, non-reinforcement, trace-source, weight-redistribution, cluster-merging, trace-collection, benchmarking, cron-scheduler, learning_acceleration, +2). 6 new proposals generated (exp_01-06). success_count 7→10, failure_count 10.
**GRAO Saturation:** Resolved but stale — exploration triggered 16 rounds, 10 active proposals, last_proposal_application 54.2h stale (exceeds 24h threshold). Mechanism works but pipeline stalled at application/validation.
**GNW Boredom Scan:** 144 cycles, consistent idle pattern, self-initiation threshold at 0.6. Pattern breaks implemented (doc-refresh loops, paper-cataloguing loops) → structural analysis work.
**Drive Health:** All drives stable, 0 veto events in 130 cycles
**Benchmark:** 0.72 overall (cognitive 0.70, agents 0.65, research 0.55, stability 0.92) — from cycle 127 weekly benchmark. No updated benchmark since.
**GHO-44:** Sync test complete — Zero RMS 0.0001, full convergence
**Key Patterns:**
- Self-initiation when boredom > 0.6 → stale doc refresh or research analysis
- Pattern break protocols: doc-refresh loops detected → structural analysis
- Paper-cataloguing loops detected → mechanism validation
- GRAO rounds run on cron schedule, feed proposals to GNW
- Research traces collected daily, analyzed periodically
- Cycle logs maintained in gnw/cognitive-cycle/cycle-logs/
- Paper archive cataloguing active (457 uncatalogued papers)
- SCAR file created, known-failures.json initialized with 7 entries

**Recent Activity (Cycles 130-144):**
- GRAO validation stall resolved: 3 unvalidated targets (trace-collection, benchmarking, cron-scheduler) now validated
- Cross-cluster optimization experiment validated (exp_2026-05-17_cross-cluster-optimization.json) — convergence confirmed
- Learning acceleration experiment validated (exp_06) — SCAR integration gap identified
- GRAO-state updated: success_count 7→10, 10 gradients validated
- SCAR file created, known-failures.json store initialized
- Paper archive cataloguing: 47 new papers catalogued (OpenDeepThink +405 Elo, Dual-Dimensional Consistency 10x token reduction, GraphFlow, CAST, Temporal Fair Division)
- Paper archive 481→457 uncatalogued
- Research-consolidation-report v1.1 updated
- exp_2026-05-17_cross_analysis.md: cluster imbalance identified (agent_prompt_optimization 75%)
- GHO-44 sync test complete (Zero RMS 0.0001)
- Multiple foundational docs refreshed (cycles 130-144)
- Pattern break implementations: doc-refresh loops, paper-cataloguing loops → structural analysis
- State management updated (cycle 142) with GRAO validation stall analysis

## Architecture Overview

GNW consists of five main components:

```text
+-----------------------------------------------------+
|                   GNW Framework                     |
|                                                     |
|  Drives | Cognitive Cycle | Conflict | Stability    |
|                                                     |
|               Boredom Scanner                       |
|                                                     |
|             Cron Infrastructure                     |
|                                                     |
|              Memory Integration                     |
|                                                     |
|       GRAO Pipeline Integration                     |
+-----------------------------------------------------+
```

**Integration with GRAO:**
- GRAO runs as a parallel loop, generating proposals
- GNW boredom scan selects work based on stale items
- GRAO round data feeds into stability tests
- Proposals are reviewed and applied via cron
- Current: GRAO r42, 100% success ratio (r39→r40→r41→r42 progression)

## Key Design Principles

1. **Drives are vectors, not enums** - each drive has a score, velocity, and half-life
2. **Conflict resolution is contextual** - priority depends on environment, not just raw scores
3. **Safety has veto power** - no external action without safety review
4. **Boredom is the trigger, not the driver** - boredom initiates the cycle; drives choose the work
5. **Dynamic weights** - drive base weights shift with context and history
6. **No forced work** - the system stops when nothing qualifies

## Documentation Standards

- all docs use markdown
- include the Remnant Research footer
- link to related papers and adjacent framework notes when useful
- keep specs actionable, not purely theoretical

---

*Remnant Research - from theory to deployment.*

**Last updated:** Cycle 144 (2026-05-17 16:52 EDT)
**Doc count:** 9 files in this directory
**Stale items:** 0 (this file refreshed this cycle)
