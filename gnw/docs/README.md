# Docs

Framework documentation and design decisions for GNW.

## Contents

- ARCHITECTURE.md — High-level system architecture and component diagram
- DESIGN-DECISIONS.md — Key design choices and their rationale
- GLOSSARY.md — GNW terminology and definitions
- ROADMAP.md — Future development plan and milestones

## Architecture Overview

GNW consists of five main components:

`
┌─────────────────────────────────────────────────────┐
│                   GNW Framework                      │
├─────────────┬──────────────┬──────────┬────────────┤
│  Drives     │ Cognitive    │ Conflict │ Stability  │
│  Module     │ Cycle        │ Res.     │ Module     │
├─────────────┴──────────────┴──────────┴────────────┤
│              Boredom Scanner                         │
├─────────────────────────────────────────────────────┤
│           Cron Infrastructure                        │
│  (Boredom Scan 15min | Cognitive Cycle 30min)       │
├─────────────────────────────────────────────────────┤
│           Memory Integration                         │
│  (Drive weights | Cycle logs | State persistence)    │
└─────────────────────────────────────────────────────┘
`

## Key Design Principles

1. **Drives are vectors, not enums** — Each drive has a score, velocity, and half-life
2. **Conflict resolution is contextual** — Priority depends on environment, not just scores
3. **Safety has veto power** — No external action without safety check
4. **Boredom is the trigger, not the driver** — Boredom initiates the cycle; drives determine the action
5. **Dynamic weights** — Drive base weights shift based on context and history
6. **No forced work** — System stops when nothing qualifies ≥ 0.50

## Documentation Standards

- All docs use markdown
- Include "Remnant Research" footer
- Link to related papers/frameworks where applicable
- Keep specs actionable — not just theory, but how to implement

---

*Remnant Research — from theory to deployment.*