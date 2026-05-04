# GNW Architecture

High-level system architecture for the Goals/Neural/Work (GNW) self-evolution framework.

## System Overview

GNW is a **drive-based cognitive architecture** for autonomous AI agents.
It replaces static task routing with dynamic motivation — the agent decides
what to work on based on weighted cognitive drives that respond to context.

## Component Diagram

`
┌─────────────────────────────────────────────────────────────────────┐
│                        GNW Framework                                │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │  Drive       │    │  Cognitive   │    │  Conflict    │         │
│  │  Module      │───→│  Cycle       │───→│  Resolution  │         │
│  │              │    │  (12 steps)  │    │              │         │
│  └──────────────┘    └──────────────┘    └──────────────┘         │
│       │                   │                   │                    │
│       ▼                   ▼                   ▼                    │
│  ┌──────────────────────────────────────────────────────┐          │
│  │              Boredom Scanner                          │          │
│  │  Input: stale context, research gaps, novelty        │          │
│  │  Output: boredom score (0.0–1.0)                    │          │
│  └──────────────────────────────────────────────────────┘          │
│                         │                                           │
│                         ▼                                           │
│  ┌──────────────────────────────────────────────────────┐          │
│  │           Trigger Decision                            │          │
│  │  boredom ≥ 0.50 AND user away → run cognitive cycle  │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │           Cron Infrastructure                         │          │
│  │  ┌──────────────────┐  ┌──────────────────┐          │          │
│  │  │ Boredom Scan     │  │ Cognitive Cycle  │          │          │
│  │  │ Every 15 min     │  │ Every 30 min     │          │          │
│  │  │ agentTurn        │  │ agentTurn        │          │          │
│  │  └──────────────────┘  └──────────────────┘          │          │
│  └──────────────────────────────────────────────────────┘          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐          │
│  │           Memory Integration                          │          │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │          │
│  │  │ Drive      │  │ Cycle      │  │ Boredom    │     │          │
│  │  │ Weights    │  │ Logs       │  │ State      │     │          │
│  │  │ (JSON)     │  │ (MD)       │  │ (JSON)     │     │          │
│  │  └────────────┘  └────────────┘  └────────────┘     │          │
│  └──────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
`

## Data Flow

`
External Input / Cron Trigger
        │
        ▼
┌──────────────┐
│  Boredom     │──→ boredom < 0.50 → SKIP (stay engaged)
│  Scanner     │
└──────────────┘
        │
        ▼ (boredom ≥ 0.50 AND user away)
┌──────────────┐
│  Cognitive   │
│  Cycle       │
│              │
│  1. Input    │──→ Perception
│  2. Context  │──→ Perception
│  3. State    │──→ Perception
│  4. Drive    │──→ Evaluation
│  5. Modulate │──→ Evaluation
│  6. Conflict │──→ Evaluation
│  7. Resolve  │──→ Decision
│  8. Select   │──→ Decision
│  9. Plan     │──→ Decision
│ 10. Dispatch │──→ Execution
│ 11. Capture  │──→ Execution
│ 12. Update   │──→ Reflection
└──────────────┘
        │
        ▼
┌──────────────┐
│  Memory      │──→ Persist drive weights, cycle log, state
│  Write       │
└──────────────┘
`

## Drive Module

`
┌─────────────────────────────────────┐
│           Drive Module               │
│                                      │
│  ┌──────────┐  ┌──────────┐        │
│  │ Curiosity│  │Helpfulness│        │
│  │ Module   │  │ Module   │        │
│  └──────────┘  └──────────┘        │
│                                      │
│  ┌──────────┐  ┌──────────┐        │
│  │Competence│  │  Safety  │        │
│  │ Module   │  │ Module   │        │
│  └──────────┘  └──────────┘        │
│                                      │
│  ┌──────────┐                       │
│  │Goal-Direct│                      │
│  │ Module   │                       │
│  └──────────┘                       │
│                                      │
│  All modules → raw scores → modulate │
│  → conflict detection → output       │
└─────────────────────────────────────┘
`

## Key Interfaces

### Drive Score Interface
`json
{
  "curiosity": 0.72,
  "helpfulness": 0.65,
  "competence": 0.58,
  "safety": 0.45,
  "goal_directed": 0.60,
  "boredom": 0.55,
  "winner": "curiosity",
  "action": "scan_arxiv_for_self_evolution"
}
`

### Cycle Log Interface
`markdown
# Cycle 2026-05-03-1430

## Drives
- Curiosity: 0.72 (modulated from 0.68)
- Helpfulness: 0.65 (modulated from 0.70)
- Competence: 0.58 (modulated from 0.55)
- Safety: 0.45 (modulated from 0.40)
- Goal-Directed: 0.60 (modulated from 0.62)

## Winner: Curiosity (0.72)
## Action: Scan arXiv for self-evolving agent papers
## Result: 15 papers found, 3 recommended
## Reflection: 0.75 (good quality output)
`

## Future Architecture

### Phase 6: Cross-Agent Coordination
`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Agent 1    │    │  Agent 2    │    │  Agent 3    │
│  (Andi)     │◄──►│  (Randi2)   │◄──►│  (Claude)   │
│             │    │             │    │             │
│  Drive Sync │    │  Drive Sync │    │  Drive Sync │
└─────────────┘    └─────────────┘    └─────────────┘
`

### Phase 7: Self-Modifying Drives
- Drives learn from their own success/failure rates
- Drive weights auto-calibrate based on historical effectiveness
- Drive signals evolve based on environmental changes

---

*Remnant Research — from theory to deployment.*