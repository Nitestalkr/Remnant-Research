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

Any drive with score ≥ 0.90 triggers a veto on incompatible actions:
- **Safety ≥ 0.90** → Blocks all external/public actions
- **Safety ≥ 0.75** → Requires manual review before external actions
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

*Remnant Research — from theory to deployment.*