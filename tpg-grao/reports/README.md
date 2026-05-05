# GRAO Cycle Reports

## Overview

GRAO cycle reports summarize the state of the research optimization loop after each major cycle. They track gradient evolution, proposal outcomes, and system health across iterations.

## Report Format

```json
{
  "report_id": "rpt_YYYY-MM-DD_cycle_NNN",
  "cycle_number": N,
  "timestamp": "ISO-8601",
  "period": {
    "start": "ISO-8601",
    "end": "ISO-8601"
  },
  "summary": {
    "traces_collected": N,
    "gradients_computed": N,
    "proposals_generated": N,
    "proposals_completed": N,
    "proposals_rejected": N
  },
  "gradient_state": {
    "top_directions": [{"direction": "", "magnitude": 0.0}],
    "emerging_patterns": [],
    "decaying_patterns": []
  },
  "system_health": {
    "memory_integrity": 0.0,
    "cron_stability": 0.0,
    "agent_performance": 0.0,
    "research_quality": 0.0
  },
  "key_findings": [],
  "recommendations": [],
  "next_cycle_focus": []
}
```

## Report Types

### Cycle Report (every GRAO cycle)
- Full state summary
- Gradient evolution
- Proposal outcomes
- System health metrics

### Weekly Report (every Sunday)
- Cross-cycle trend analysis
- Long-term gradient tracking
- Research direction assessment
- Strategic recommendations

### Incident Report (as needed)
- Stability breaches
- Pattern anomalies
- System failures
- Recovery actions

## Report Storage

Reports are stored as JSON files named `cycle_NNN_YYYY-MM-DD.json`. Weekly reports use `weekly_YYYY-MM-DD.json`.
