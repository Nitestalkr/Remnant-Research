# Computed Gradients

## Overview

Gradients are directional signals computed from pattern analysis across research traces. They represent the "force" pushing the research system in a particular direction.

## Gradient Types

### Directional Gradients
Indicate which direction research should evolve:
- **Knowledge acquisition** — new research domains to explore
- **System optimization** — areas needing improvement
- **Agent behavior** — workflow patterns to adopt/abandon
- **Memory consolidation** — patterns worth reinforcing

### Magnitude Gradients
Indicate the strength of a signal:
- **Strong** (|g| > 0.7): Clear pattern, high confidence
- **Moderate** (0.3 < |g| ≤ 0.7): Emerging pattern, medium confidence
- **Weak** (|g| ≤ 0.3): Noise or exploratory signal

### Temporal Gradients
Indicate how patterns change over time:
- **Accelerating** — pattern gaining strength
- **Stable** — pattern consistent
- **Decaying** — pattern losing relevance
- **Oscillating** — pattern cycling

## Gradient Computation

```
gradient = Σ(signal_weight × pattern_strength × temporal_factor) / n_signals
```

Where:
- `signal_weight` — from routing table (0.0–1.0)
- `pattern_strength` — consistency of pattern across traces
- `temporal_factor` — recent vs. historical signal ratio
- `n_signals` — number of contributing signals

## Gradient Storage Format

```json
{
  "gradient_id": "grad_YYYY-MM-DD_type",
  "timestamp": "ISO-8601",
  "type": "directional|magnitude|temporal",
  "direction": "research_domain_or_system_area",
  "magnitude": 0.0,
  "confidence": 0.0,
  "contributing_traces": ["trace_ids"],
  "decay_rate": 0.0,
  "next_computation": "ISO-8601"
}
```

## Gradient Lifecycle

1. **Computed** — from trace analysis by `scripts/gradient-deriver.js`
2. **Stored** — in this directory as JSON
3. **Applied** — by GRAO loop to influence research direction
4. **Evaluated** — in next cycle to check accuracy
5. **Archived** — after 30 days if no longer relevant
