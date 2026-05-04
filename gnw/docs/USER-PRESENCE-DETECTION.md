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

*Remnant Research — from theory to deployment.*
