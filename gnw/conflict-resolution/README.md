# Conflict Resolution

When multiple cognitive drives reach high scores simultaneously, the agent must
resolve which action to take. This folder contains the detailed resolution protocols,
priority matrices, and edge-case handling.

## Contents

- CONFLICT-RESOLUTION.md — Core conflict resolution algorithm
- PRIORITY-MATRIX.md — The full drive priority matrix with context conditions
- VETO-PROTOCOL.md — Safety veto rules and escalation paths
- EDGE-CASES.md — Handling ambiguous, tied, or conflicting drive states
- RESOLUTION-LOG.md — Examples of past resolutions

## Core Principle

Conflict resolution is **not** about picking the highest drive. It's about
finding the action that maximizes overall system utility given the current context.

The priority matrix exists because raw drive scores don't capture contextual
dependencies — a safety score of 0.75 means something very different when
the user is active vs. when they're away.

## Current System State (2026-05-10)

- **5-agent Telegram infrastructure deployed** (Andi, Randi2, CB, Claude, Zero)
- **Cycle 93** — boredom scan active, system idle
- **Conflict pattern:** Extended idle periods dominate (no pending events, boredom = 1.0)
- **Resolution behavior:** Self-initiation triggers when boredom > 0.6, stale doc refresh is default action
- **Veto health:** No veto events in current cycle history — system operating within bounds
- **Gateway:** Stable, no forced-work principle active

## Recent Resolution Patterns

Cycles 80-93 show consistent idle state with periodic self-initiation for stale doc maintenance:
- Boredom 1.0 → stale scan → highest-scoring doc refreshed → return to idle
- No drive conflicts requiring resolution (all drives converge on idle maintenance)
- No safety vetos triggered
- No edge cases encountered (conflict resolution algorithm operating as designed)

---

*Remnant Research — from theory to deployment.*