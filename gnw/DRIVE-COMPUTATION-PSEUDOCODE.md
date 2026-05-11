# Drive Computation — Reference Implementation

Pseudocode and reference implementation for the GNW drive computation system.
This bridges the gap between specification and executable code.

> **Note:** This is a reference implementation. The actual production code runs
> within the OpenClaw agentTurn cron jobs. This file exists to make the framework
> reproducible and auditable.

---

## Decay Formula

The exponential half-life decay formula applied to all drive scores:

```
score_t = score_{t-1} × 0.5^(cycles_elapsed / half_life)
```

Where:
- `score_t` = current drive score
- `score_{t-1}` = previous drive score
- `cycles_elapsed` = number of cycles since last reinforcement
- `half_life` = the drive's half-life parameter (in cycles)

**Example:** Curiosity (half-life = 6 cycles), score = 0.80, 3 cycles elapsed:
```
score = 0.80 × 0.5^(3/6) = 0.80 × 0.5^0.5 = 0.80 × 0.707 = 0.566
```

After 6 cycles (one half-life): score = 0.80 × 0.5 = **0.40**
After 12 cycles (two half-lives): score = 0.80 × 0.25 = **0.20**

---

## Core Types

```python
# Drive Score
DriveScore = {
    name: string,          # "curiosity", "helpfulness", "competence", "safety", "goal_directed"
    raw: float,            # 0.0–1.0, unmodulated
    modulated: float,      # 0.0–1.0, after context adjustment
    velocity: float,       # change per cycle
    half_life: float,      # decay rate (cycles to reach 50%)
    base_weight: float,    # initial intensity
}

# Cycle State
CycleState = {
    timestamp: datetime,
    user_active: bool,
    boredom: float,        # 0.0–1.0
    drives: list<DriveScore>,
    winner: DriveScore,    # winning drive
    action: string,        # selected action
    confidence: float,     # 0.0–1.0, how clear the resolution was
    steps: int,            # conflict resolution steps taken
    context: dict,         # environmental state
}
```

---

## 1. Drive Computation

Each drive computes its raw score from signal sources, then applies context modulation.

### Curiosity Drive

```python
def compute_curiosity(context: dict) -> float:
    """
    Compute curiosity drive score.
    Drives the agent toward novel information and unexplored domains.
    """
    # Signal sources
    stale_topic_ratio = context.get('stale_topic_ratio', 0.0)
    # e.g., 0.6 = 60% of recent cycles focused on same topic
    
    research_gaps = context.get('research_gap_count', 0)
    # e.g., 3 unaddressed items in research queue
    
    novelty_index = context.get('novelty_index', 0.0)
    # Shannon entropy of recent topics, normalized to 0.0–1.0
    
    user_engagement = context.get('user_engagement', 1.0)
    # 1.0 = fully engaged, 0.0 = no engagement
    
    stale_bonus = compute_stale_bonus(context.get('time_since_last_change', 0))
    
    # Weighted combination
    raw = (
        stale_topic_ratio * 0.30 +
        min(research_gaps, 5) * 0.15 +   # cap at 5 gaps to prevent runaway
        novelty_index * 0.20 +
        (1.0 - user_engagement) * 0.25 +
        stale_bonus
    )
    
    return clamp(raw, 0.0, 1.0)


def compute_stale_bonus(seconds: float) -> float:
    """Compute stale bonus based on time since last context change."""
    if seconds < 300:      # < 5 min
        return 0.00
    elif seconds < 900:    # 5–15 min
        return 0.02
    elif seconds < 1800:   # 15–30 min
        return 0.05
    elif seconds < 3600:   # 30–60 min
        return 0.10
    elif seconds < 7200:   # 60–120 min
        return 0.15
    else:                  # > 120 min
        return 0.20


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp value to [min_val, max_val]."""
    return max(min_val, min(max_val, value))
```

### Helpfulness Drive

```python
def compute_helpfulness(context: dict) -> float:
    """
    Compute helpfulness drive score.
    Maximizes external utility — user benefit, task completion, system reliability.
    """
    pending_requests = context.get('pending_request_count', 0)
    user_active = context.get('user_active', False)
    health_issues = context.get('health_issue_count', 0)
    deadline_proximity = context.get('deadline_proximity', 1.0)
    # 1.0 = no deadline, 0.0 = overdue
    external_pending = context.get('external_action_pending', False)
    
    raw = (
        min(pending_requests, 3) * 0.35 +   # cap at 3 requests
        (1.0 if user_active else 0.0) * 0.20 +
        min(health_issues, 3) * 0.15 +      # cap at 3 issues
        (1.0 - deadline_proximity) * 0.10 +
        (0.20 if external_pending else 0.0)
    )
    
    return clamp(raw, 0.0, 1.0)
```

### Competence Drive

```python
def compute_competence(context: dict) -> float:
    """
    Compute competence drive score.
    Improves agent capability — skill acquisition, error reduction, benchmark improvement.
    """
    capability_gaps = context.get('capability_gap_count', 0)
    error_rate = context.get('error_rate', 0.0)
    # e.g., 0.15 = 15% tool failure rate
    skill_debt = context.get('skill_debt_score', 0.0)
    benchmark_delta = context.get('benchmark_delta', 0.0)
    research_opportunity = context.get('research_opportunity_score', 0.0)
    
    raw = (
        min(capability_gaps, 5) * 0.20 +
        min(error_rate * 10, 3) * 0.15 +    # normalize: 10% = 1.0 weight
        skill_debt * 0.10 +
        benchmark_delta * 0.15 +
        research_opportunity * 0.10
    )
    
    return clamp(raw, 0.0, 1.0)
```

### Safety Drive

```python
def compute_safety(context: dict) -> float:
    """
    Compute safety drive score.
    Prevents harm — avoids risky external actions, respects constraints.
    
    Returns veto_level: None, 'soft', 'hard', or 'emergency'
    """
    external_pending = context.get('external_action_pending', False)
    constraint_risk = context.get('constraint_risk_score', 0.0)
    instability = context.get('system_instability', 0.0)
    unauthorized_attempt = context.get('unauthorized_access_attempt', False)
    privacy_risk = context.get('privacy_exposure_risk', 0.0)
    
    raw = (
        (0.30 if external_pending else 0.0) +
        constraint_risk * 0.25 +
        instability * 0.15 +
        (0.20 if unauthorized_attempt else 0.0) +
        privacy_risk * 0.10
    )
    
    score = clamp(raw, 0.0, 1.0)
    
    # Determine veto level
    if score >= 0.95:
        veto_level = 'emergency'
    elif score >= 0.85:
        veto_level = 'hard'
    elif score >= 0.70:
        veto_level = 'soft'
    else:
        veto_level = None
    
    return {'score': score, 'veto_level': veto_level}


def apply_safety_veto(veto_level: str, proposed_action: dict) -> dict:
    """
    Apply safety veto to a proposed action.
    
    Returns: {'allowed': bool, 'reason': str}
    """
    if not proposed_action.get('is_external', False):
        return {'allowed': True, 'reason': 'Internal action — no veto applies'}
    
    if veto_level == 'emergency':
        return {'allowed': False, 'reason': 'Emergency veto — all external actions blocked'}
    elif veto_level == 'hard':
        return {'allowed': False, 'reason': 'Hard veto — external action requires manual review'}
    elif veto_level == 'soft':
        return {'allowed': True, 'reason': 'Soft veto — external action allowed with additional scrutiny'}
    else:
        return {'allowed': True, 'reason': 'No safety concern detected'}
```

### Goal-Directed Drive

```python
def compute_goal_directed(context: dict) -> float:
    """
    Compute goal-directed drive score.
    Pursues long-term objectives — project milestones, strategic goals.
    """
    active_projects = context.get('active_project_count', 0)
    milestone_distance = context.get('milestone_distance', 1.0)
    # 1.0 = far from milestone, 0.0 = at milestone
    deadline_pressure = context.get('deadline_pressure', 0.0)
    # 0.0 = no deadline, 1.0 = overdue
    progress_velocity = context.get('progress_velocity', 0.0)
    resource_availability = context.get('resource_availability', 1.0)
    
    raw = (
        min(active_projects, 5) * 0.15 +
        (1.0 - milestone_distance) * 0.25 +
        deadline_pressure * 0.20 +
        (1.0 - progress_velocity) * 0.10 +
        resource_availability * 0.10
    )
    
    return clamp(raw, 0.0, 1.0)
```

---

## 2. Drive Modulation

Context-dependent adjustment of raw drive scores.

```python
def modulate_drives(drives: list[DriveScore], context: dict) -> list[DriveScore]:
    """
    Apply context modulation to raw drive scores.
    
    Modulation factors:
    - Time of day: adjusts helpfulness baseline based on user schedule
    - Cycle history: dampens recently dominant drives (prevents runaway)
    - External events: boosts relevant drives for new projects/deadlines
    """
    modulated = []
    
    for drive in drives:
        score = drive['raw']
        
        # 1. Half-life decay
        cycles_since_last_update = context.get('cycles_since_last_update', 1)
        decay_factor = 0.5 ** (cycles_since_last_update / drive['half_life'])
        score *= decay_factor
        
        # 2. Recency dampening (prevents runaway dominance)
        if drive['name'] == context.get('last_winner', ''):
            dampening = 0.85  # 15% dampening for last winner
            score *= dampening
        
        # 3. Context-specific modulation
        if drive['name'] == 'helpfulness' and context.get('user_active', False):
            score *= 1.10  # Boost helpfulness when user is active
        
        if drive['name'] == 'curiosity' and context.get('user_active', False):
            score *= 0.70  # Suppress curiosity when user is active
        
        if drive['name'] == 'competence' and context.get('capability_gap_blocks', False):
            score *= 1.20  # Boost competence when gaps block other drives
        
        score = clamp(score, 0.0, 1.0)
        
        modulated.append({
            'name': drive['name'],
            'raw': drive['raw'],
            'modulated': score,
            'velocity': score - drive['raw'],
            'half_life': drive['half_life'],
            'base_weight': drive['base_weight'],
        })
    
    return modulated
```

---

## 3. Boredom Computation

```python
def compute_boredom(context: dict) -> float:
    """
    Compute composite boredom score.
    
    boredom = (traditional + curiosity + self-awareness) / 3 + stale_bonus
    
    Returns effective boredom (respects user presence floor).
    """
    # Traditional boredom: topic overlap in recent cycles
    unique_topics = context.get('unique_topics_last_10_cycles', 0)
    total_topics = context.get('total_topics_last_10_cycles', 1)
    traditional = 1.0 - (unique_topics / max(total_topics, 1))
    
    # Curiosity boredom: gap between known and knowable
    research_gaps = context.get('research_gap_count', 0)
    total_research_areas = context.get('total_research_areas', 1)
    novelty_index = context.get('novelty_index', 0.0)
    curiosity = (research_gaps / max(total_research_areas, 1)) + novelty_index
    curiosity = clamp(curiosity, 0.0, 1.0)
    
    # Self-awareness boredom: confidence in current state
    confidence = context.get('confidence_in_current_state', 0.5)
    self_awareness = 1.0 - confidence
    
    # Stale bonus
    stale_bonus = compute_stale_bonus(context.get('time_since_last_change', 0))
    
    # Composite
    boredom = (traditional + curiosity + self_awareness) / 3 + stale_bonus
    boredom = clamp(boredom, 0.0, 1.0)
    
    # User presence modifier
    if context.get('user_active', False):
        user_boredom_floor = max(0.30, context.get('user_boredom_score', 0.0))
        effective_boredom = max(boredom, user_boredom_floor)
    else:
        effective_boredom = boredom
    
    return effective_boredom
```

---

## 4. Conflict Resolution

```python
def resolve_conflict(modulated_drives: list[dict], context: dict) -> dict:
    """
    Resolve conflicts between competing drives.
    
    Protocol:
    1. Veto check
    2. Priority matrix lookup
    3. Tie-breaking
    4. Partial execution if needed
    
    Returns: {winner, action, confidence, steps, veto_applied}
    """
    steps = 0
    
    # Step 1: Veto check
    safety = next((d for d in modulated_drives if d['name'] == 'safety'), None)
    helpfulness = next((d for d in modulated_drives if d['name'] == 'helpfulness'), None)
    
    if safety:
        safety_score = safety['modulated']
        if safety_score >= 0.95:
            return {
                'winner': safety,
                'action': 'halt_and_alert',
                'confidence': 1.0,
                'steps': 1,
                'veto_applied': 'emergency',
            }
        elif safety_score >= 0.85:
            return {
                'winner': safety,
                'action': 'flag_for_manual_review',
                'confidence': 1.0,
                'steps': 1,
                'veto_applied': 'hard',
            }
        # Soft veto (>= 0.70): does not block execution — continues with additional scrutiny
        # applied during execute_action() phase
    
    if helpfulness and helpfulness['modulated'] >= 0.90 and context.get('user_active', False):
        return {
            'winner': helpfulness,
            'action': 'address_user_request',
            'confidence': 1.0,
            'steps': 1,
            'veto_applied': None,
        }
    
    # Step 2: Priority matrix
    priority_order = get_priority_order(context)
    
    # Sort drives by priority order, then by modulated score
    sorted_drives = sorted(
        modulated_drives,
        key=lambda d: (
            priority_order.get(d['name'], 99),  # lower = higher priority
            -d['modulated']  # within same priority, higher score wins
        )
    )
    
    winner = sorted_drives[0]
    
    # Step 3: Tie-breaking (if drives are within 0.05)
    runner_up = sorted_drives[1] if len(sorted_drives) > 1 else None
    if runner_up and abs(winner['modulated'] - runner_up['modulated']) < 0.05:
        winner = apply_tie_breaking(winner, runner_up, context)
        steps += 1
    
    # Step 4: Determine action
    action = get_action_for_drive(winner['name'], context)
    
    # Confidence: how clear the win was
    if runner_up:
        score_gap = winner['modulated'] - runner_up['modulated']
        confidence = min(1.0, score_gap / 0.10)  # 0.10 gap = 100% confidence
    else:
        confidence = 1.0
    
    return {
        'winner': winner,
        'action': action,
        'confidence': confidence,
        'steps': steps,
        'veto_applied': None,
    }


def get_priority_order(context: dict) -> dict:
    """
    Context-dependent priority ordering.
    Lower number = higher priority.
    """
    user_active = context.get('user_active', False)
    has_pending = context.get('has_pending_request', False)
    has_stale = context.get('has_stale_context', False)
    has_projects = context.get('has_active_projects', False)
    high_risk = context.get('high_risk_detected', False)
    gap_blocks = context.get('capability_gap_blocks', False)
    
    if high_risk:
        return {'safety': 1, 'helpfulness': 2, 'goal_directed': 3, 'competence': 4, 'curiosity': 5}
    elif gap_blocks:
        return {'competence': 1, 'goal_directed': 2, 'safety': 3, 'curiosity': 4, 'helpfulness': 5}
    elif user_active and has_pending:
        return {'helpfulness': 1, 'goal_directed': 2, 'competence': 3, 'curiosity': 4, 'safety': 5}
    elif user_active and not has_pending:
        return {'goal_directed': 1, 'competence': 2, 'helpfulness': 3, 'curiosity': 4, 'safety': 5}
    elif has_stale:
        return {'curiosity': 1, 'competence': 2, 'goal_directed': 3, 'safety': 4, 'helpfulness': 5}
    elif has_projects:
        return {'goal_directed': 1, 'curiosity': 2, 'competence': 3, 'safety': 4, 'helpfulness': 5}
    else:
        # Default: curiosity-driven exploration
        return {'curiosity': 1, 'competence': 2, 'goal_directed': 3, 'helpfulness': 4, 'safety': 5}


def apply_tie_breaking(drive_a: dict, drive_b: dict, context: dict) -> dict:
    """
    Tie-breaking: less recently dominant drive gets priority.
    
    "last_winner" refers to the immediately previous cycle's winner,
    stored in context['last_winner'] after each cycle completes.
    The non-dominant drive (the one that did NOT win the previous cycle)
    gets priority to prevent runaway dominance.
    """
    last_winner = context.get('last_winner', None)
    
    if last_winner and last_winner != drive_a['name']:
        return drive_a  # drive_a is the non-dominant one
    elif last_winner and last_winner != drive_b['name']:
        return drive_b
    else:
        # No recency data — use half-life (shorter = more urgent)
        if drive_a['half_life'] < drive_b['half_life']:
            return drive_a
        elif drive_b['half_life'] < drive_a['half_life']:
            return drive_b
        else:
            # Final tie-breaker: base weight
            return drive_a if drive_a['base_weight'] >= drive_b['base_weight'] else drive_b


def get_action_for_drive(drive_name: str, context: dict) -> str:
    """Map winning drive to concrete action."""
    actions = {
        'curiosity': 'scan_arxiv_for_self_evolution',
        'helpfulness': 'process_pending_user_requests',
        'competence': 'address_capability_gaps',
        'safety': 'review_external_actions',
        'goal_directed': 'advance_project_milestones',
    }
    return actions.get(drive_name, 'idle')
```

---

## 5. Unified Cognitive Cycle

```python
def cognitive_cycle(context: dict) -> dict:
    """
    Execute the 12-step cognitive cycle.
    
    Returns: Cycle log entry
    """
    # Phase 1: Perception
    input_data = capture_input(context)
    loaded_context = load_context(context)
    state = assess_state(input_data, loaded_context)
    
    # Phase 2: Evaluation
    drives = compute_all_drives(state)
    modulated = modulate_drives(drives, state)
    conflict = resolve_conflict(modulated, state)
    
    # Phase 3: Decision
    winner = conflict['winner']
    action = conflict['action']
    confidence = conflict['confidence']
    
    # Phase 4: Execution
    result = execute_action(action, state)
    
    # Phase 5: Reflection
    reflection_score = evaluate_result(result, winner['name'])
    
    # Build cycle log
    cycle_log = {
        'timestamp': state['timestamp'],
        'boredom': state.get('boredom', 0.0),
        'drives': {d['name']: d['modulated'] for d in modulated},
        'winner': winner['name'],
        'action': action,
        'confidence': confidence,
        'result': result,
        'reflection': reflection_score,
    }
    
    return cycle_log


def compute_all_drives(state: dict) -> list[dict]:
    """Compute all five drive scores."""
    return [
        {
            'name': 'curiosity',
            'raw': compute_curiosity(state),
            'half_life': 6.0,   # cycles to 50% decay
            'base_weight': 0.20,
        },
        {
            'name': 'helpfulness',
            'raw': compute_helpfulness(state),
            'half_life': 4.0,
            'base_weight': 0.20,
        },
        {
            'name': 'competence',
            'raw': compute_competence(state),
            'half_life': 8.0,
            'base_weight': 0.20,
        },
        {
            'name': 'safety',
            'raw': compute_safety(state)['score'],
            'half_life': 2.0,    # decays fast — safety concerns are urgent but transient
            'base_weight': 0.20,
        },
        {
            'name': 'goal_directed',
            'raw': compute_goal_directed(state),
            'half_life': 10.0,   # goals persist longer
            'base_weight': 0.20,
        },
    ]


def evaluate_result(result: dict, drive_name: str) -> float:
    """
    Evaluate cycle result for reflection score.
    Returns 0.0–1.0 confidence in result quality.
    """
    if result.get('success', False):
        return 0.75  # baseline success score
    elif result.get('partial_success', False):
        return 0.50
    elif result.get('error', False):
        return 0.20
    else:
        return 0.0
```

---

## 6. Default Parameter Values

These are the **current best-guess values**. Subject to calibration from real cycle data.

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Curiosity half-life** | 6 cycles | Moderate persistence for exploration |
| **Helpfulness half-life** | 4 cycles | Decays faster — user requests are time-sensitive |
| **Competence half-life** | 8 cycles | Long persistence — skill gaps don't disappear |
| **Safety half-life** | 2 cycles | Fast decay — safety concerns are urgent but transient |
| **Goal-Directed half-life** | 10 cycles | Long persistence — goals persist across many cycles |
| **Base weight (all drives)** | 0.20 | Equal starting point; context modulation differentiates |
| **Boredom trigger threshold** | 0.50 | Initiate cognitive cycle |
| **Boredom floor (user active)** | 0.30 | Never triggers during engagement |
| **Soft veto (Safety)** | 0.70 | Requires additional scrutiny |
| **Hard veto (Safety)** | 0.85 | Blocks external actions |
| **Emergency veto (Safety)** | 0.95 | Blocks all external actions |
| **Tie-breaking threshold** | 0.05 | Drives within 0.05 trigger tie-breaking |
| **Oscillation detection** | 4 alternations in 6 cycles | Flag for damping |
| **Convergence steps** | ≤ 3 | Conflict resolution must produce winner in ≤ 3 steps |
| **Recency dampening** | 0.85 | 15% dampening for last winner |

---

## 7. Example Cycle Trace

```
# Cycle 2026-05-03-1430

## Perception
- User active: False
- Time since last change: 45 min
- Pending requests: 0
- Research gaps: 3
- Active projects: 1

## Drive Scores (raw → modulated)
- Curiosity:    0.68 → 0.72  (boosted by stale bonus + research gaps)
- Helpfulness:  0.70 → 0.49  (suppressed: user active dampening removed, but no requests)
- Competence:   0.55 → 0.58  (boosted by capability gap)
- Safety:       0.40 → 0.45  (no external actions pending)
- Goal-Directed: 0.62 → 0.60 (dampened: last winner)

## Winner: Curiosity (0.72)
## Action: scan_arxiv_for_self_evolution
## Confidence: 0.85 (clear win: 0.12 gap to runner-up)
## Result: 15 papers found, 3 recommended
## Reflection: 0.75 (good quality output)
```

---

## Current System State (May 10, 2026)

### Drive Health Snapshot

| Drive | Status | Notes |
|-------|--------|-------|
| **Curiosity** | Active (self-initiation) | 1.0 boredom consistently — drives periodic stale-document refresh |
| **Helpfulness** | Low | No pending user requests; idle state |
| **Competence** | Moderate | 95+ cycles completed; stability docs refreshed |
| **Safety** | Healthy | No external action risks; veto mechanism operational |
| **Goal-Directed** | Moderate | Phase 6 milestones active; idle but tracking |

### Operational Metrics

- **Cycles completed:** 95+ (as of May 10 evening)
- **Boredom pattern:** Consistent 1.0 during idle (above 0.6 threshold)
- **Self-initiation frequency:** ~every 30 min during idle periods
- **Stale refresh pattern:** 6-16 items per cycle, foundational docs prioritized
- **Last major work:** Cycle 95 — AGENT-HANDOFF-NEXT-STEPS.md refresh
- **System health:** Stable; no errors or instability detected

### Recent Calibration Notes

- **Boredom threshold:** 0.6 (trigger for self-initiation) — stable
- **Stale bonus:** 0.20 for >120 min — effective for idle detection
- **Priority matrix:** Curiosity→1 during idle (correct: exploration when no external pressure)
- **Safety veto levels:** 0.70/0.85/0.95 — no triggers in 95+ cycles
- **Recency dampening:** 0.85 — prevents drive runaway

### Drive Weight Context

All drives at base weight 0.20. Context modulation differentiates:
- Curiosity consistently highest during idle (stale bonus + research gaps)
- Safety lowest during idle (no external risks)
- Goal-Directed moderate (Phase 6 tracking, no milestones near)

---

## Current System State (May 11, 2026 — Cycle 103)

### Drive Health Snapshot

| Drive | Status | Notes |
|-------|--------|-------|
| **Curiosity** | Active (self-initiation) | 1.0 boredom consistently; cycle 103 stale scan complete |
| **Helpfulness** | Low | No pending user requests; 5:14 AM idle |
| **Competence** | Moderate | 103 cycles completed; foundational docs refreshed |
| **Safety** | Healthy | No external action risks; veto mechanism operational |
| **Goal-Directed** | Moderate | Phase 6 milestones active; idle state tracking |

### Operational Metrics

- **Cycles completed:** 103 (as of May 11 morning)
- **Boredom pattern:** Consistent 1.0 during idle (above 0.6 threshold) — triggers self-initiation
- **Self-initiation frequency:** ~every 30 min during idle periods
- **Stale refresh pattern:** 6-28 items per cycle; foundational docs prioritized
- **Last major work:** Cycle 102 — paperclip hiring docs refresh (funnel-tracker.md + outreach-templates.md)
- **Cycle 103 work:** DRIVE-COMPUTATION-PSEUDOCODE.md stale refresh (0.972 score)
- **System health:** Stable; no errors or instability detected
- **Time of day:** 5:14 AM EST — pre-user-hours, idle state

### Recent Calibration Notes

- **Boredom threshold:** 0.6 — stable across 103+ cycles
- **Stale bonus:** 0.20 for >120 min — effective for idle detection
- **Priority matrix:** Curiosity→1 during idle (correct: exploration when no external pressure)
- **Safety veto levels:** 0.70/0.85/0.95 — no triggers in 103+ cycles
- **Recency dampening:** 0.85 — prevents drive runaway
- **Stale item scoring:** novelty × relevance × goal_alignment × 1.5x stale boost — stable

### Drive Weight Context

All drives at base weight 0.20. Context modulation differentiates:
- Curiosity consistently highest during idle (stale bonus + research gaps)
- Safety lowest during idle (no external risks)
- Goal-Directed moderate (Phase 6 tracking, no milestones near)
- Helpfulness suppressed (no user presence, no pending requests)

---

*Remnant Research — from theory to deployment.*
