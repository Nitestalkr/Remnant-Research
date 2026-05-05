# Research Traces

## Overview

Raw research traces are the unprocessed signal sources that feed the TPG. Each trace captures a snapshot of system activity, research output, or agent behavior at a point in time.

## Trace Format

```json
{
  "trace_id": "unique_identifier",
  "timestamp": "ISO-8601",
  "source": "trace_source_name",
  "signal_type": "agent|research|stability|experience",
  "raw_data": {},
  "metadata": {
    "confidence": 0.0,
    "relevance_score": 0.0,
    "tags": []
  }
}
```

## Trace Sources

### Agent Traces
- Tool usage chains
- Decision paths
- Response patterns
- Error/recovery events
- Model selection decisions

### Research Traces
- arXiv scan results
- Paper analysis summaries
- Deep dive findings
- Citation networks
- Pattern matches across papers

### Stability Traces
- Memory state snapshots
- Cron execution results
- Drive/storage metrics
- Model load times
- Gateway health checks

### Experience Traces
- Optimized workflows
- Learned shortcuts
- Pattern recognitions
- Cross-session insights
- Configuration improvements

## Trace Collection

Traces are collected by `scripts/trace-collector.js` and stored here as JSON. Each trace should be self-contained and include enough metadata for later gradient computation.

## Retention Policy

- Active traces: retained indefinitely for gradient computation
- Raw traces older than 90 days: compressed and archived
- Duplicate traces: deduplicated by content hash
