# TPG Signal Category Reconciliation

## Overview

This document reconciles the signal type definitions between `tpg/architecture.md` and
`tpg/routing/ROUTING-IMPL.md`. Both documents describe the same four signal types but
use slightly different terminology.

## Signal Type Mapping

| architecture.md | ROUTING-IMPL.md | Unified Name | Description |
|-----------------|-----------------|-------------|-------------|
| Agent traces | Agent Traces | **agent** | Agent behavior logs, tool usage, decision paths |
| Research traces | Research Traces | **research** | arXiv scans, paper analysis, deep dive results |
| Stability traces | Stability Traces | **stability** | System health, memory state, cron status |
| Experience traces | Experience Traces | **experience** | Optimized workflows, learned patterns |

## Routing Destination Mapping

| Signal Type | GRAO Sub-Loop |
|-------------|---------------|
| agent | agent optimization loop |
| research | knowledge acquisition loop |
| stability | system health loop |
| experience | meta-optimization loop |

## Why Two Names?

- `architecture.md` uses shorter names (used in trace `signal_type` field)
- `ROUTING-IMPL.md` uses descriptive names (used in routing rule documentation)
- The unified names above are canonical and used in all code and schemas

## Future

If additional signal types are needed, add them to both `architecture.md` and
`ROUTING-IMPL.md`, then update this reconciliation table.

---

*Remnant Research — TPG signal reconciliation.*
