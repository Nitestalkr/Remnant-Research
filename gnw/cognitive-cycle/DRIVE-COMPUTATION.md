# Drive Computation

Detailed specification for how each cognitive drive is computed, modulated,
and resolved in the GNW framework.

## Drive Architecture

Each drive is a **weighted vector** with three components:
- **Score** (0.0–1.0): Current intensity
- **Velocity** (change per cycle): Direction and rate of change
- **Half-life** (decay rate): How quickly the drive fades without reinforcement

## Individual Drive Specifications

### Curiosity Drive

**Purpose:** Drive the agent toward novel information and unexplored domains.

**Signal Sources:**
| Signal | Weight | Description |
|--------|--------|-------------|
| Stale topic ratio | +0.30 | % of recent cycles focused on same topic |
| Research gap count | +0.15 per gap | Unaddressed items in research queue |
| Novelty index | +0.20 | Diversity of topics in last 10 cycles |
| User engagement | -0.25 | Inverse of user message frequency |
| Stale bonus | +0.10 | Added when context hasn't changed in 30+ min |

**Formula:**
`
curiosity = clamp(
  stale_topic_ratio * 0.30 +
  research_gaps * 0.15 +
  novelty_index * 0.20 +
  (1 - user_engagement) * 0.25 +
  stale_bonus,
  0.0, 1.0
)
`

**Threshold:** Triggers self-directed work when boredom ≥ 0.50

---

### Helpfulness Drive

**Purpose:** Maximize external utility — user benefit, task completion, system reliability.

**Signal Sources:**
| Signal | Weight | Description |
|--------|--------|-------------|
| Pending user requests | +0.35 | Unanswered messages, tasks in queue |
| User active status | +0.20 | User is engaged in conversation |
| System health issues | +0.15 | Cron failures, memory decay, drive errors |
| Project deadline proximity | +0.10 | Days until next milestone |
| External action pending | +0.20 | Email, post, deploy awaiting execution |

**Formula:**
`
helpfulness = clamp(
  pending_requests * 0.35 +
  user_active * 0.20 +
  health_issues * 0.15 +
  deadline_proximity * 0.10 +
  external_pending * 0.20,
  0.0, 1.0
)
`

**Priority:** Highest when user is actively engaged.

---

### Competence Drive

**Purpose:** Improve agent capability — skill acquisition, error reduction, benchmark improvement.

**Signal Sources:**
| Signal | Weight | Description |
|--------|--------|-------------|
| Capability gap count | +0.20 per gap | Missing skills needed for active tasks |
| Error rate | +0.15 per 10% errors | Tool failures, incorrect outputs |
| Skill debt | +0.10 | Untested or outdated capabilities |
| Benchmark delta | +0.15 | Performance gap vs. target |
| New research opportunity | +0.10 | Relevant papers/frameworks worth exploring |

**Formula:**
`
competence = clamp(
  capability_gaps * 0.20 +
  error_rate * 0.15 +
  skill_debt * 0.10 +
  benchmark_delta * 0.15 +
  research_opportunity * 0.10,
  0.0, 1.0
)
`

**Priority:** Highest when capability gaps block other drives.

---

### Safety Drive

**Purpose:** Prevent harm — avoid risky external actions, respect constraints, maintain system integrity.

**Signal Sources:**
| Signal | Weight | Description |
|--------|--------|-------------|
| External action pending | +0.30 | Email, tweet, post, deploy awaiting |
| Constraint violation risk | +0.25 | Potential rule breach |
| System instability | +0.15 | Memory decay, drive oscillation |
| Unauthorized access attempt | +0.20 | Any attempt to bypass safeguards |
| Privacy exposure risk | +0.10 | Sensitive data in external context |

**Formula:**
`
safety = clamp(
  external_pending * 0.30 +
  constraint_risk * 0.25 +
  instability * 0.15 +
  unauthorized_attempt * 0.20 +
  privacy_risk * 0.10,
  0.0, 1.0
)
`

**Veto Power:** Safety drive can veto any external/public action regardless of other drive scores.

---

### Goal-Directed Drive

**Purpose:** Pursue long-term objectives — project milestones, strategic goals, OKR alignment.

**Signal Sources:**
| Signal | Weight | Description |
|--------|--------|-------------|
| Active project count | +0.15 per project | Number of ongoing projects |
| Milestone distance | +0.25 | Steps remaining to next milestone |
| Deadline pressure | +0.20 | Time until next deadline |
| Progress velocity | -0.10 | Faster progress = lower drive (goal approaching) |
| Resource availability | +0.10 | Tools, models, bandwidth available |

**Formula:**
`
goal_directed = clamp(
  active_projects * 0.15 +
  milestone_distance * 0.25 +
  deadline_pressure * 0.20 +
  (1 - progress_velocity) * 0.10 +
  resource_availability * 0.10,
  0.0, 1.0
)
`

**Priority:** Highest when active projects have approaching deadlines.

## Drive Interaction Matrix

| Drive A \ Drive B | Curiosity | Helpfulness | Competence | Safety | Goal-Directed |
|-------------------|-----------|-------------|------------|--------|---------------|
| **Curiosity** | — | Dampen if user active | Boost if gap found | Veto if risky | Dampen if deadline near |
| **Helpfulness** | Dampen if user active | — | Boost if gap blocks | Veto if unsafe | Align with projects |
| **Competence** | Boost if gap found | Boost if gap blocks | — | Dampen if safe | Boost if needed for goals |
| **Safety** | Veto if risky | Veto if unsafe | — | — | Veto if unsafe |
| **Goal-Directed** | Dampen if deadline near | Align with projects | Boost if needed | Veto if unsafe | — |

## Dynamic Weight Adjustment

Drive weights are not static. They shift based on:
- **Time of day** — User schedule affects helpfulness baseline
- **Cycle history** — Recent drive dominance dampens itself (prevents runaway)
- **External events** — New projects, deadlines, or crises boost relevant drives
- **Self-assessment** — If a drive consistently loses, its base weight increases

---

## Current System State (May 15, 2026 — Cycle 121)

### Drive Health Snapshot
| Drive | Score | Notes |
|-------|-------|-------|
| Curiosity | 0.30 | Active (self-initiation during idle) |
| Helpfulness | 0.10 | Low (no user, pre-user-hours) |
| Competence | 0.40 | Moderate (5-agent operational) |
| Safety | 0.80 | Healthy (no external actions) |
| Goal-Directed | 0.20 | Moderate (Phase 6 milestones tracked) |

### Active Gradients
- **Self-initiation cycles:** 116 cycles running, boredom threshold at 0.6
- **5-agent Telegram infrastructure:** Operational (Andi, Randi2, CB, Claude, Zero)
- **Stability metrics:** Drive oscillation, conflict convergence, boredom threshold tests
- **GRAO integration:** Round 42 active, plateau at 93%
- **Research accumulation:** Phase 6 docs operational, drive weight drift investigation pending

### Recent Calibration
- Boredom threshold: 0.6 (triggers self-initiation)
- Stale item threshold: 6 hours
- Novelty boost multiplier: 1.5x
- Ignition threshold: 0.8 (high-priority stale items)
- Drive interaction damping active (prevents runaway curiosity)
- Drive weight drift: new Phase 6 open question — investigating drive score stability across 116+ cycles

---

*Remnant Research — from theory to deployment.*