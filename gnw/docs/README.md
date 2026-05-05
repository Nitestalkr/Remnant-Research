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
- `CROSS-AGENT-COORDINATION.md` - Phase 6 coordination design stub

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
+-----------------------------------------------------+
```

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
