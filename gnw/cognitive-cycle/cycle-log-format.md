# GNW Cycle Log Format

## Purpose
Record the GNW cognitive cycle's state and decisions for long-term traceability.

## Privacy
- No personal names, addresses, private details
- No message content, conversation data
- Only system state, research topics, project names

## Log Structure
```json
{
  "cycle_number": N,
  "timestamp": "ISO-8601",
  "cron_job": "GNW-Cognitive-Cycle",
  "boredom_score": 0.0-1.0,
  "pending_events": [
    {
      "file": "relative path",
      "staleness_hours": N,
      "score": 0.0-1.0,
      "reason": "brief description"
    }
  ],
  "stale_items": [
    {
      "file": "relative path",
      "staleness_hours": N,
      "within_threshold": true/false
    }
  ],
  "stage_contents": [
    {
      "item": "name",
      "score": 0.0-1.0,
      "status": "active|pending|completed|stale"
    }
  ],
  "self_initiation": {
    "triggered": true/false,
    "threshold": 0.6,
    "candidate": "file or null",
    "action": "brief description or null"
  },
  "drive_scores": {
    "curiosity": 0.0-1.0,
    "helpfulness": 0.0-1.0,
    "competence": 0.0-1.0,
    "safety": 0.0-1.0,
    "goal_directed": 0.0-1.0
  },
  "graos_saturation": {
    "detected": true/false,
    "source": "grao-state.json|stale_round_files",
    "reinforcementRounds": N,
    "exploration_triggered": true/false,
    "exploration_count": N,
    "last_exploration_timestamp": "ISO-8601 or null",
    "data_freshness": "fresh|stale",
    "notes": "brief description"
  },
  "system_status": "idle|active|self-initiation|user-present",
  "notes": "brief summary"
}
```

## File Naming
`gnw/cognitive-cycle/cycle-logs/cycle_N_YYYY-MM-DD.json`

## Storage
- Written to `remnant-research/gnw/cognitive-cycle/cycle-logs/`
- Also available via cron job payload output

## Example
```json
{
  "cycle_number": 80,
  "timestamp": "2026-05-10T04:51:00Z",
  "cron_job": "GNW-Cognitive-Cycle",
  "boredom_score": 0.0,
  "pending_events": [],
  "stale_items": [],
  "stage_contents": [
    {"item": "GNW Phase 6", "score": 0.75, "status": "active"},
    {"item": "GRAO Round 40", "score": 0.85, "status": "active"},
    {"item": "Zenith Fitness", "score": 0.60, "status": "completed"},
    {"item": "Paperclip", "score": 0.55, "status": "active"}
  ],
  "self_initiation": {
    "triggered": false,
    "threshold": 0.6,
    "candidate": null,
    "action": null
  },
  "drive_scores": {
    "curiosity": 0.30,
    "helpfulness": 0.10,
    "competence": 0.40,
    "safety": 0.80,
    "goal_directed": 0.20
  },
  "system_status": "idle",
  "notes": "No pending events, no stale items. System healthy idle."
}
```
