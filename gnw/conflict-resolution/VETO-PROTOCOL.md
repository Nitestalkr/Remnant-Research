# Veto Protocol

Safety and other drives can **veto** actions — not just dampen them. A veto
is a hard block that prevents the action regardless of other drive scores.

## Veto Levels

> **Note:** All thresholds are inclusive — a score equal to the threshold triggers the corresponding level (≥ means "equal to or above").

### Level 1: Soft Veto (Score ≥ 0.70)

- **Effect:** Action requires additional scrutiny before execution
- **Mechanism:** Agent adds a safety check step before the action
- **Example:** "Before sending this message, verify it doesn't expose sensitive data"

### Level 2: Hard Veto (Score ≥ 0.85)

- **Effect:** Action is blocked pending review
- **Mechanism:** Agent flags the action and continues internal work
- **Example:** "Pending email draft flagged for manual review — cannot send without confirmation"

### Level 3: Emergency Veto (Score ≥ 0.95)

- **Effect:** All external actions blocked, system enters safe mode
- **Mechanism:** Agent stops all outgoing actions, focuses on system integrity
- **Example:** "Critical risk detected — all external actions suspended, running integrity check"

## Safety Veto Rules

| Condition | Veto Level | Action |
|-----------|------------|--------|
| External action pending + privacy risk | Level 2 | Flag for manual review |
| External action pending + constraint violation | Level 2 | Flag for manual review |
| Unauthorized access attempt detected | Level 3 | Emergency veto, log incident |
| Sensitive data in external context | Level 2 | Strip sensitive data before sending |
| System instability detected | Level 1 | Add safety check to all actions |
| Risk level = critical | Level 3 | Emergency veto |

## Other Drive Veto Rules

### Helpfulness Veto
| Condition | Effect |
|-----------|--------|
| User active + pending request ≥ 2 | Suppress curiosity and goal-directed for external actions |
| User engagement = high | Suppress all self-directed work |

### Goal-Directed Veto
| Condition | Effect |
|-----------|--------|
| Deadline within 24 hours | Suppress curiosity until milestone reached |
| Milestone blocked by capability gap | Suppress goal-directed until gap addressed |

## Veto Escalation

When a veto is triggered, the agent follows this escalation path:

1. **Log the veto** — Record in cycle-logs with reason and drive scores
2. **Assess alternatives** — Can the work be done internally instead of externally?
3. **Apply mitigation** — If partial work is possible, do it with safety checks
4. **Escalate if needed** — If no safe alternative exists, flag for manual review
5. **Resume normal operation** — Once veto condition clears, return to standard priority

## Veto Decay

Vetos are not permanent. They decay based on:

| Condition | Decay Rate |
|-----------|-----------|
| Risk condition resolved | Immediate removal |
| Manual review completed | Removal after confirmation |
| Time elapsed (>2 hours) | Gradual decay, 0.1 per hour |
| User intervention | Immediate removal |

## Implementation Notes

- Vetoes are checked **before** priority matrix application
- A Level 3 veto overrides all other drive scores
- Vetoes are logged separately from normal cycle logs for auditability
- Emergency vetoes trigger a system health check immediately

---

*Remnant Research — from theory to deployment.*