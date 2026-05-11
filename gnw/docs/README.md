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

## Current System State (Cycle 110)

**Deployment:** 5-agent infrastructure active (Andi, Randi2, CB, Claude, Zero)
**Comms:** Dual channel (Discord + Telegram bots)
**GRAO Pipeline:** 42+ rounds, ~93% plateau rate, policy saturation concern active
**GNW Boredom Scan:** 110+ cycles, healthy idle pattern, self-initiation threshold at 0.6
**Drive Health:** All drives stable, no veto events in 110 cycles
**Key Patterns:**
- Self-initiation when boredom > 0.6 → stale doc refresh or research analysis
- GRAO rounds run on cron schedule, feed proposals to GNW
- Research traces collected daily, analyzed periodically
- Cycle logs maintained in gnw/cognitive-cycle/cycle-logs/

**Recent Activity (Cycles 107-110):**
- paperclip README refreshed (cycle 107)
- round_39 context bridge added (cycle 108)
- GNW-GRAO-INTEGRATION updated (cycle 109)
- LOOP-SPEC refreshed (cycle 104)
- SAFETY-THREAT-MODEL updated (cycle 104)
- tpg/README refreshed (cycle 105)
- tpg-grao/grao/README updated (cycle 106)

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

**Last updated:** Cycle 110 (2026-05-11 10:44 AM EDT)
**Doc count:** 9 files in this directory
**Stale items:** 1 (this file itself — 144h stale)
