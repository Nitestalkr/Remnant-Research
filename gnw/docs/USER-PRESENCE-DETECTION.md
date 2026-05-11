# User Presence Detection

Defines how the system determines whether the user is actively engaged, which affects boredom suppression and drive modulation.

---

## Detection Method

User presence is determined through OpenClaw's session monitoring:

```python
def detect_user_presence() -> dict:
    """
    Detect user presence and engagement level.
    
    Returns: {
        active: bool,
        last_message_age: int,  # seconds since last user message
        message_frequency: float,  # messages per minute (last 10 min)
        engagement_level: str  # "high", "medium", "low", "none"
    }
    """
```

### Criteria

| Condition | User Active | Engagement Level |
|-----------|-------------|-----------------|
| Message received within last 5 minutes | ✅ True | High |
| Message received within last 15 minutes | ✅ True | Medium |
| Message received within last 30 minutes | ✅ True | Low |
| No message in last 30 minutes | ❌ False | None |

### Timeout

- **User considered "away"** after 30 minutes of no messages
- **User considered "active"** within 30 minutes of last message
- **Boredom floor applies** when user is active (0.30 minimum)
- **Boredom suppression** prevents self-directed work during engagement

---

## Message Frequency Calculation

```python
def calculate_engagement_level(last_message_age: int, messages_per_minute: float) -> str:
    if last_message_age < 300:  # < 5 min
        return "high"
    elif last_message_age < 900:  # 5-15 min
        return "medium"
    elif last_message_age < 1800:  # 15-30 min
        return "low"
    else:
        return "none"
```

### Engagement Level Impact on Drives

| Level | Helpfulness boost | Curiosity suppression |
|-------|-------------------|----------------------|
| High | +0.20 | -0.25 |
| Medium | +0.10 | -0.15 |
| Low | +0.05 | -0.10 |
| None | 0.00 | 0.00 |

---

## Modulation Mechanics

Modulation uses **multiplicative factors**, not additive. Each factor is applied sequentially:

```
modulated_score = raw_score × factor_1 × factor_2 × ... (all factors)
```

When user is active:
1. **Helpfulness boost:** `helpfulness × 1.10` (10% multiplicative increase)
2. **Curiosity suppression:** `curiosity × 0.70` (30% multiplicative decrease)
3. **Both factors apply independently** to their respective drives

This means:
- High engagement → helpfulness goes UP, curiosity goes DOWN (they move in opposite directions)
- The dampening of curiosity is NOT caused by helpfulness boosting — it's an independent rule
- Both are multiplicative, not additive

---

## Integration with OpenClaw

In practice, user presence detection uses:

1. **`session_status`** — checks current session activity
2. **`sessions_list`** — checks for recent user messages across sessions
3. **Message timestamps** — determines time since last user interaction

The detection runs as part of the boredom scan, before drive computation.

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| User sends message, then goes silent | Active for 30 min after last message |
| User sends rapid messages | Engagement level = "high", boredom floor enforced |
| User sends message exactly at 30 min boundary | Treated as active (conservative) |
| Multiple sessions active | Use most recent message across all sessions |
| Session timeout | User considered away (no active session) |

---

## Current System State (Cycle 96 — 2026-05-10)

### Deployment Status
- **5-agent Telegram infrastructure** fully deployed (Andi, Randi2, CB, Claude, Zero)
- **Hybrid mode**: group chat (-1003741274242) + individual DMs
- **Detection channel**: Telegram (primary), Discord (secondary)
- **User ID**: 1747124819

### Active Detection Mechanics
- **session_status** — checks current session activity (model, thinking, channel)
- **sessions_list** — checks for recent user messages across sessions with `activeMinutes` filter
- **Message timestamps** — determines time since last user interaction on Telegram
- **Boredom scan integration** — detection runs before drive computation in each 30-min cycle

### Current Idle Metrics (Cycle 96)
- **User activity**: Away (no pending events, idle system)
- **Engagement level**: None
- **Boredom floor**: 1.0 (no suppression — user away)
- **Self-initiation**: Active (boredom > 0.6 threshold)
- **Stale items detected**: 8 files > 6h untouched
- **Highest candidate**: USER-PRESENCE-DETECTION.md (0.108) — 161h stale

### Recent Calibration
- **Helpfulness boost**: +0.20 multiplicative when user high engagement
- **Curiosity suppression**: -0.25 multiplicative when user high engagement
- **Both factors independent** — multiplicative, not additive
- **30-minute away threshold** confirmed stable across 96 cycles

### Integration Notes
- Detection runs **before** drive computation in boredom scan cycle
- User presence check feeds into **boredom floor** calculation
- Active user → boredom floor 0.30, suppression prevents self-directed work
- Away user → boredom 1.0, self-initiation allowed

---

*Remnant Research — from theory to deployment.*
*Updated: 2026-05-10 Cycle 96*
