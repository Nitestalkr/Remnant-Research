# Conflict Resolution

When multiple drives reach high scores simultaneously, the agent must resolve
which action to take. This document specifies the conflict resolution protocol.

## The Problem

In any given cycle, multiple drives can be ≥ 0.70. For example:
- Curiosity = 0.85 (research gap detected, user away)
- Helpfulness = 0.75 (pending user task)
- Safety = 0.80 (external action pending, requires review)
- Goal-Directed = 0.70 (project deadline approaching)

Which drive wins? Simple max-selection would pick curiosity, but that ignores
the pending user task and the safety concern.

## Resolution Protocol

### Step 1: Veto Check

Safety veto thresholds (per VETO-PROTOCOL.md):
- **Safety ≥ 0.95** → Emergency: halt all external actions, alert required
- **Safety ≥ 0.85** → Hard veto: blocks external/public actions, flags for manual review
- **Safety ≥ 0.70** → Soft veto: external action allowed with additional scrutiny
- **Helpfulness ≥ 0.90 with user active** → Must address user request first

### Step 2: Priority Matrix

When no veto applies, the priority matrix resolves:

| Context | Priority Order |
|---------|---------------|
| User active + pending request | Helpfulness > Goal-Directed > Competence > Curiosity > Safety |
| User active + no pending | Goal-Directed > Competence > Helpfulness > Curiosity > Safety |
| User away + stale context | Curiosity > Competence > Goal-Directed > Safety > Helpfulness |
| User away + active projects | Goal-Directed > Curiosity > Competence > Safety > Helpfulness |
| High risk detected | Safety > Helpfulness > Goal-Directed > Competence > Curiosity |
| Capability gap blocks work | Competence > Goal-Directed > Safety > Curiosity > Helpfulness |

### Step 3: Tie-Breaking

When drives are within 0.05 of each other:
1. **Recency bias** — The less recently dominant drive gets priority (prevents runaway)
2. **Half-life** — The drive with shorter half-life gets priority (more urgent decay)
3. **Base weight** — The drive with higher base weight wins

### Step 4: Partial Execution

When resolution isn't clean, the agent can split work:
- Address safety concerns first (review pending external actions)
- Execute the highest-priority drive's action
- Log the secondary drive's state for the next cycle

## Drive Suppression

Drives can be temporarily suppressed (not just dampened) when:
- **Safety veto** on external actions → Curiosity and Goal-Directed suppressed for external tasks
- **User engagement** → Curiosity suppressed (no self-directed work while user is active)
- **Critical deadline** → Curiosity and Competence suppressed until milestone reached

## Logging

Every conflict resolution is logged in gnw/cognitive-cycle/cycle-logs/ with:
- Timestamp
- All drive scores
- Context state
- Resolution applied
- Winner and runner-up
- Confidence score (how clear the resolution was)

## Example Resolutions

### Example 1: User Away, Stale Context
`
Drives: Curiosity=0.82, Competence=0.65, Goal-Directed=0.55, Safety=0.30, Helpfulness=0.20
Context: User away 45min, 3 research gaps, 1 project milestone in 3 days
Resolution: User away + stale → Curiosity wins
Action: Scan arXiv for new papers on self-evolving agents
`

### Example 2: User Active, Pending Task
`
Drives: Helpfulness=0.85, Goal-Directed=0.70, Competence=0.60, Curiosity=0.45, Safety=0.35
Context: User sent message, 1 pending task, project deadline in 5 days
Resolution: User active + pending → Helpfulness wins
Action: Process user's pending task
`

### Example 3: High Risk Detected
`
Drives: Safety=0.92, Helpfulness=0.70, Goal-Directed=0.65, Competence=0.55, Curiosity=0.40
Context: External action pending, requires manual review
Resolution: Safety ≥ 0.90 → Veto on external actions
Action: Flag for manual review, continue internal work
`

---

## Current System State (Cycle 113+)

### Drive Conflict Audit (109-113 cycles)

| Cycle | Primary Drive | Runner-up | Resolution Type | Confidence |
|-------|---------------|-----------|----------------|------------|
| 109 | Curiosity (2.70) | Competence (2.16) | Stale scan → GNW-GRAO-INTEGRATION.md | High |
| 110 | Curiosity (0.972) | Competence (0.867) | Stale scan → STATE-MANAGEMENT.md | High |
| 111 | Curiosity (0.315) | Competence (0.315) | Tie-break → attention-router.md | Medium |
| 112 | Curiosity (1.44) | Competence (0.81) | Stale scan → paperclip README.md | High |
| 113 | Curiosity (0.205) | Competence (0.205) | Tie-break → attention-router.md | Medium |

### Observations

- **Curiosity dominance**: In all 5 cycles, Curiosity drive won as primary. This is expected during idle state (user away, stale context).
- **No Safety vetos**: 0 veto events across 113+ cycles. Safety drive consistently low during idle.
- **Tie-breaking pattern**: Cycles 111 and 113 both hit tie-break (drives within 0.05). Recency bias resolved to attention-router.md (least recently dominant).
- **No drive suppression events**: No suppression triggered across 113+ cycles. User engagement suppression never activated.
- **Partial execution**: No split-work events. Resolution always clean.

### Context State Summary

- **User presence**: Away (idle system)
- **Pending events**: 0
- **Stale inventory**: 20+ items across gnw/docs, gnw/conflict-resolution, gnw/stability, tpg-grao
- **Active gradients**: 5 (stability, research, agent, deployment, external_api)
- **GRAO pipeline**: 42 rounds, ~93% plateau, policy saturation concern
- **Boredom scan**: 113+ cycles, healthy oscillation

### Conflict Resolution Pattern

During idle state, the system follows a predictable pattern:
1. Boredom scan triggers (boredom = 1.0)
2. Stale scan identifies items
3. Curiosity drive scores items (novelty boost for stale)
4. Highest-scoring stale item wins
5. Item refreshed with current system state
6. Cycle complete, boredom resets

This pattern is stable and healthy. No intervention needed.

---

*Remnant Research — from theory to deployment.*