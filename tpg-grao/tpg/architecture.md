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

## Signal ↔ Routing Reconciliation

| Signal Type (architecture.md) | Routing Rule (ROUTING-IMPL.md) | GRAO Sub-Loop |
|-------------------------------|-------------------------------|---------------|
| Agent traces | Rule 1 | Agent Optimization |
| Research traces | Rule 2 | Knowledge Acquisition |
| Stability traces | Rule 3 | System Health |
| Experience traces | Rule 4 | Meta-Optimization |

**Note:** Both documents use the same 4 signal types. The ROUTING-IMPL.md transformation pipeline is a shared processing step (not a 5th category).
