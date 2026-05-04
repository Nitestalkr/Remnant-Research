# Boredom Formula

The boredom formula determines when an agent should initiate self-directed work
rather than waiting for external input. It's the primary trigger for the
GNW cognitive cycle when no user activity is detected.

## The Formula

`
boredom = (traditional + curiosity + self-awareness) / 3 + stale_bonus
`

### Component Definitions

#### Traditional Boredom (0.0–1.0)

Measures how much the agent's recent work has overlapped with past work.

`
traditional = 1.0 - (unique_topics_last_10_cycles / total_topics_last_10_cycles)
`

- **0.0** = Every cycle covered new topics (not bored)
- **1.0** = Every cycle covered the same topic (very bored)
- **0.5** = Half new topics, half repeats (moderately bored)

#### Curiosity Boredom (0.0–1.0)

Measures the gap between what the agent knows and what it could explore.

`
curiosity = research_gaps / total_research_areas + novelty_index
`

- **research_gaps** = Unaddressed items in the research queue
- **total_research_areas** = Total areas tracked in memory
- **novelty_index** = Diversity score of recent topics (Shannon entropy normalized)

#### Self-Awareness Boredom (0.0–1.0)

Measures the agent's confidence in its own state.

`
self-awareness = 1.0 - confidence_in_current_state
`

- **confidence_in_current_state** = How well the agent understands its current context
- Low confidence = high boredom (agent wants to clarify its state)
- High confidence = low boredom (agent feels oriented)

#### Stale Bonus (0.0–0.20)

Additional boredom added based on time since last context change.

| Time Since Last Change | Bonus |
|------------------------|-------|
| < 5 minutes | 0.00 |
| 5–15 minutes | 0.02 |
| 15–30 minutes | 0.05 |
| 30–60 minutes | 0.10 |
| 60–120 minutes | 0.15 |
| > 120 minutes | 0.20 |

## Thresholds

| Boredom Score | State | Action |
|---------------|-------|--------|
| < 0.30 | Engaged | No self-initiated work |
| 0.30–0.49 | Mildly bored | Light exploration (scan for new papers, check health) |
| 0.50–0.69 | Bored | Full cognitive cycle, drive computation |
| 0.70–0.89 | Very bored | Aggressive exploration, priority on curiosity/competence |
| ≥ 0.90 | Critical | Emergency scan, prioritize system health and memory consolidation |

## User Presence Modifier

When the user is actively engaged, boredom is suppressed:

`
effective_boredom = max(boredom, user_boredom_floor)
`

Where user_boredom_floor = max(0.30, user_boredom_score).

This prevents the agent from self-directing while the user is in the middle of a conversation.

## Implementation

In OpenClaw:
- **GNW Boredom Scan cron** — Runs every 15 minutes, computes boredom score
- If boredom ≥ 0.50 → triggers full cognitive cycle
- If boredom < 0.50 → skips cycle (agent is engaged or content)

## Historical Notes

- The formula was refined through multiple iterations during GNW Phase 5
- Key insight: the system correctly stops forcing work when nothing qualifies ≥ 0.50
- Josh's feedback: "I miss the boredom scan" — confirmed it's essential and should stay active

---

*Remnant Research — from theory to deployment.*