# TPG Routing Rules

## Overview

The Tensor Processing Graph (TPG) routes incoming signals from multiple trace sources into the appropriate GRAO sub-loops. Each routing rule defines:

1. **Source** — where the signal originates
2. **Signal type** — classification of the signal
3. **Destination** — which GRAO loop processes it
4. **Transformation** — any preprocessing required
5. **Priority** — signal urgency weight

## Routing Table

| Source | Signal Type | Destination | Transformation | Priority |
|--------|-------------|-------------|----------------|----------|
| Agent behavior logs | Agent trace | Agent optimization loop | Normalize timestamps, extract tool chains | Normal |
| arXiv scan results | Research trace | Knowledge acquisition loop | Deduplicate, extract key metrics | Normal |
| System health metrics | Stability trace | System health loop | Compute delta from baseline | High |
| Optimized workflows | Experience trace | Meta-optimization loop | Extract pattern, compute gradient | Normal |
| Cron execution logs | Stability trace | System health loop | Parse success/failure, latency | High |
| Memory promotion events | Stability trace | Memory integrity loop | Track consolidation rate | Low |
| Nostr engagement data | Research trace | Knowledge acquisition loop | Filter spam, extract signal | Normal |
| GRAO round outputs | Meta trace | Loop convergence analysis | Compare iteration deltas | High |

## Signal Weighting

Each signal carries a weight (0.0–1.0) that determines its influence on gradient computation:

- **Critical** (0.8–1.0): System failures, stability breaches, high-confidence research findings
- **Normal** (0.4–0.7): Routine observations, medium-confidence findings
- **Low** (0.1–0.3): Noise, exploratory signals, low-confidence hypotheses

## Routing Logic

```
For each incoming signal:
  1. Classify signal type
  2. Lookup routing rule by type
  3. Apply transformation pipeline
  4. Compute priority weight
  5. Route to destination loop
  6. Log routing decision for trace
```

## Extending Routing

To add a new signal source:

1. Define signal type and characteristics
2. Add routing rule to table above
3. Implement transformation in `scripts/trace-collector.js`
4. Document expected output format
5. Add to GRAO loop that will consume it
