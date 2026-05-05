# TPG Architecture

## Data Flow

```
Raw Traces → Collector → Pattern Analysis → Gradient Derivation → Router → GRAO Loop → Proposal
```

## Signal Types

- **Agent traces**: Agent behavior logs, tool usage, decision paths
- **Research traces**: arXiv scans, paper analysis, deep dive results
- **Stability traces**: System health, memory state, cron status
- **Experience traces**: Optimized workflows, learned patterns

## Routing Rules

Each signal type maps to specific GRAO sub-loops:
- Agent traces → agent optimization loop
- Research traces → knowledge acquisition loop
- Stability traces → system health loop
- Experience traces → meta-optimization loop
