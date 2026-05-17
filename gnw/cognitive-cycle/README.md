# Cognitive Cycle

The unified 12-step cognitive cycle is the core processing loop that drives
agent behavior in the GNW framework. Every agent turn — whether user-initiated
or self-directed — passes through this cycle.

## The 12 Steps

### Phase 1: Perception
1. **Input Capture** — Receive external input (user message, cron event, system signal)
2. **Context Load** — Pull relevant memory, workspace state, and active project context
3. **State Assessment** — Evaluate current system state (boredom, resource availability, task queue)

### Phase 2: Evaluation
4. **Drive Activation** — Compute raw drive scores based on current state
5. **Drive Modulation** — Apply context modifiers (user presence, safety constraints, project priority)
6. **Conflict Detection** — Identify competing drives and priority overlaps

### Phase 3: Decision
7. **Conflict Resolution** — Apply priority matrix to resolve drive competition
8. **Action Selection** — Choose the highest-weighted actionable drive
9. **Plan Formation** — Generate a concrete plan for the selected drive

### Phase 4: Execution
10. **Task Dispatch** — Execute the plan (internal work, sub-agent spawn, tool call)
11. **Result Capture** — Collect outputs, metrics, and side effects

### Phase 5: Reflection
12. **Memory Update** — Write results to memory, update drive weights, log cycle data

## Drive Computation

### Raw Drive Scores

Each drive starts with a base score (0.0–1.0) computed from environmental signals:

`
curiosity_raw = f(stale_topics, research_gaps, novelty_index)
helpfulness_raw = f(user_engagement, pending_requests, external_utility)
competence_raw = f(capability_gaps, skill_debt, benchmark_performance)
safety_raw = f(risk_level, constraint_violations, external_action_pending)
goal_directed_raw = f(project_progress, milestone_distance, deadline_pressure)
`

### Modulation Factors

| Factor | Effect |
|--------|--------|
| User active | Boost helpfulness, damp curiosity |
| User away | Boost curiosity, damp helpfulness |
| High risk pending | Boost safety |
| Active project | Boost goal-directed |
| Stale context (≥5min) | Add stale_bonus to curiosity (0.02 at 5–15min, growing to 0.20 cap at >120min) |
| Capability gap detected | Boost competence |

### Conflict Resolution

When drives compete (e.g., curiosity wants to explore research, safety wants to avoid external actions), the priority matrix resolves:

1. **Safety** always has veto power on external/public actions
2. **Helpfulness** prioritized when user is engaged
3. **Goal-Directed** prioritized when active projects have deadlines
4. **Curiosity** gets priority when user is away and context is stale
5. **Competence** gets priority when capability gaps block other drives

## Cycle Metrics

Each cycle logs:
- **Boredom score** — Pre-cycle boredom state
- **Drive scores** — All 5 drive values post-modulation
- **Selected drive** — Which drive won
- **Action taken** — What the agent did
- **Reflection quality** — Self-assessment of cycle effectiveness

## Relationship to Research

The cognitive cycle draws from:

- **Global Workspace Theory** — The cycle acts as a "global workspace" where drive signals compete for broadcast
- **Recurrent Processing Theory** — Steps 1-3 (perception) are feedforward; steps 4-12 are recurrent processing
- **Predictive Processing** — The cycle maintains a predictive model of the environment and updates it each iteration
- **Self-Evolving Agent surveys** — The "when to evolve" dimension maps to drive threshold crossing

## Implementation

In OpenClaw, the cognitive cycle is implemented via:
- **GNW Cognitive Cycle cron** — Runs every 30 minutes, executes the full 12-step loop
- **GNW Boredom Scan cron** — Runs every 15 minutes, computes boredom score and triggers cycle if needed
- **Drive weight files** — Stored in gnw/sprints/ as dynamic configuration

---

## Cycle 122 Update (2026-05-16 06:38 AM EDT)

### Current System State
- **Cycle count:** 122
- **GRAO Pipeline:** Round 42, exploration mode active, 10 active proposals (cross-cluster-optimization, research-domain-expansion, benchmarking-optimization, cron-scheduler-refinement, trace-collection-enhancement)
- **GRAO Saturation:** Resolved — exploration triggered 16 rounds, last proposal 20h ago (<24h threshold)
- **GNW Boredom Scan:** 122+ cycles, consistent idle pattern
- **Drive Health:** Healthy diversity, no remediation events
- **5-Agent Infrastructure:** Andi, Randi2, CB, Claude, Zero — Telegram bots operational
- **Research Pipeline:** Paper archive cataloguing active (8 papers catalogued multi-agent systems topic)
- **Stale Data Management:** gnw foundational docs refreshed (cycle 122)

### Operational Metrics
- **Self-initiation pattern:** boredom > 0.6 → stale doc refresh or research analysis
- **Work quality:** mix of doc-refresh (40%) and actual data analysis (60%)
- **Key insight from cycle 120:** organizational structure matters (hierarchical > flat by 102.73%) — CAMP + OrgAgent convergence validated by GRAO exploration

---

*Remnant Research — from theory to deployment.*