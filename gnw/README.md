> **Note:** GNW is documented here as a public research mirror of a live local OpenClaw workflow. Some artifacts are reconstructed from prior runs, and executable scripts will be published incrementally.

# GNW - Goals / Neural / Work

Drive-based cognitive architecture for autonomous agent self-improvement.

## Overview

GNW models internal motivation as a set of interacting cognitive drives:
curiosity, helpfulness, competence, safety, and goal-directedness. Each drive
is treated as a continuous weighted signal rather than a binary state.

The goal is to give an agent a principled internal basis for deciding:

- when to work
- what to work on
- when to defer, stop, or stay idle

In practice, GNW combines boredom-triggered self-direction, contextual
drive modulation, conflict resolution, and post-cycle reflection into a
single control loop for OpenClaw-based agents.

## What GNW Covers

- **Drive-based motivation** - agents self-direct work using weighted cognitive drives
- **Boredom detection** - self-directed work is triggered when context is stale and the user is away
- **Unified cognitive cycle** - a 12-step loop ties perception, evaluation, decision, execution, and memory update together
- **Conflict resolution** - a priority matrix arbitrates competing drives in context
- **Safety as veto** - unsafe external actions can be blocked regardless of other drive scores
- **Stability analysis** - convergence, oscillation, and score-bound behavior are treated as first-class concerns
- **Cross-agent coordination** - Phase 6 extends the model from single-agent control to multi-agent synchronization

## Repository Structure

- `docs/` - architecture, design rationale, parameters, roadmap, and support material
- `cognitive-cycle/` - boredom, drive computation, conflict flow, and cycle-log examples
- `conflict-resolution/` - priority matrix, veto protocol, edge cases, and resolution log
- `stability/` - formal stability and convergence checks
- `sprints/` - phase summaries and sprint-level progression
- `DRIVE-COMPUTATION-PSEUDOCODE.md` - reference implementation pseudocode

## Current State

- **Phases 1-5:** documented and publicly summarized
- **Phase 5:** example logs, parameter values, and reference pseudocode published
- **Phase 6:** cross-agent coordination design in progress; real multi-agent testing still pending
- **Code status:** runnable production logic exists locally, while public executable artifacts are still being packaged incrementally

## Core Components

### Drives

| Drive | Purpose | Example Signal |
|-------|---------|----------------|
| **Curiosity** | Information gain and novelty seeking | Stale topics, research gaps, novelty index |
| **Helpfulness** | External utility and user benefit | Pending requests, user engagement, system health |
| **Competence** | Skill improvement and mastery | Capability gaps, error rate, skill debt |
| **Safety** | Risk avoidance and constraint compliance | External actions pending, privacy risk, instability |
| **Goal-Directed** | Long-term objective pursuit | Active projects, milestone distance, deadlines |

### Boredom Formula

```text
boredom = (traditional + curiosity + self-awareness) / 3 + stale_bonus
```

When boredom exceeds the trigger threshold and the user is away, the system is
permitted to initiate self-directed work. If nothing qualifies, the correct
outcome is still to remain idle.

### Cognitive Cycle

The 12-step unified cycle is the operational spine of GNW:

```text
perception -> evaluation -> drive computation -> conflict resolution
-> selection -> execution -> reflection -> memory update
```

Every user-driven or self-directed turn passes through the same loop.

## What This Folder Gives You

- a conceptual model for internal agent motivation
- parameterized thresholds and drive behavior
- example cycle logs from Phase 5
- explicit conflict-resolution and veto rules
- stability-test design for oscillation, convergence, and memory integrity
- a public-facing bridge between private implementation and reproducible documentation

## Recommended Reading Order

1. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
2. [docs/DESIGN-DECISIONS.md](docs/DESIGN-DECISIONS.md)
3. [docs/PARAMETER-VALUES.md](docs/PARAMETER-VALUES.md)
4. [DRIVE-COMPUTATION-PSEUDOCODE.md](DRIVE-COMPUTATION-PSEUDOCODE.md)
5. [cognitive-cycle/cycle-logs/PHASE-5-EXAMPLE-LOGS.md](cognitive-cycle/cycle-logs/PHASE-5-EXAMPLE-LOGS.md)
6. [conflict-resolution/RESOLUTION-LOG.md](conflict-resolution/RESOLUTION-LOG.md)

## Implementation Notes

- boredom scan runs every 15 minutes via cron
- cognitive cycle runs every 30 minutes via cron
- **Canonical source for timing:** gnw/docs/PARAMETER-VALUES.md
- drive weights are dynamic, not static
- conflict resolution uses a priority matrix, not simple max-selection
- safety is treated as a veto on external action, not just another competing score

---

*Remnant Research - from theory to deployment.*
