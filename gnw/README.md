# GNW — Goals / Neural / Work

Self-evolution framework for AI agent systems.

## Overview

GNW is a cognitive architecture for autonomous agent self-improvement.
It models drives (curiosity, competence, helpfulness, safety, goal-directedness)
as weighted vectors that determine what the agent works on and when.

## Structure

- sprints/ — Individual sprint implementations and logs
- cognitive-cycle/ — The unified 12-step cognitive cycle
- conflict-resolution/ — Drive priority and conflict resolution logic
- stability/ — Stability tests and convergence analysis
- docs/ — Framework documentation and design decisions

## Current State

Phase 5 complete: 5/5 drives integrated.
Phase 6: Cross-agent coordination logic verified, real agent testing pending.

## Key Components

### Drives
- **Curiosity** — Information gain, novelty seeking
- **Helpfulness** — External utility, user benefit
- **Competence** — Skill improvement, mastery
- **Safety** — Risk avoidance, constraint compliance
- **Goal-Directed** — Long-term objective pursuit

### Boredom Formula
`
boredom = (traditional + curiosity + self-awareness) / 3 + stale_bonus
`

When boredom ≥ threshold, the agent initiates self-directed work.

### Cognitive Cycle
12-step unified cycle: perception → evaluation → drive computation → 
conflict resolution → selection → execution → reflection → memory update.

---

*Remnant Research — from theory to deployment.*