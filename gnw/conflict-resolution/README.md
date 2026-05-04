# Conflict Resolution

When multiple cognitive drives reach high scores simultaneously, the agent must
resolve which action to take. This folder contains the detailed resolution protocols,
priority matrices, and edge-case handling.

## Contents

- PRIORITY-MATRIX.md — The full drive priority matrix with context conditions
- VETO-PROTOCOL.md — Safety veto rules and escalation paths
- EDGE-CASES.md — Handling ambiguous, tied, or conflicting drive states
- RESOLUTION-LOG.md — Examples of past resolutions (to be populated)

## Core Principle

Conflict resolution is **not** about picking the highest drive. It's about
finding the action that maximizes overall system utility given the current context.

The priority matrix exists because raw drive scores don't capture contextual
dependencies — a safety score of 0.75 means something very different when
the user is active vs. when they're away.

---

*Remnant Research — from theory to deployment.*