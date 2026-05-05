# GRAO Experiment Framework

## Overview

GRAO experiments allow controlled testing of configuration changes, new algorithms, or hypothesis validation within the optimization loop. Each experiment runs alongside the baseline system for comparison.

## Experiment Types

### A/B Experiments
Compare two configurations against each other:
- **Gradient threshold** — 0.30 vs 0.50
- **Proposal confidence** — 0.40 vs 0.60
- **Decay rate** — 0.01 vs 0.02 vs 0.05
- **Window size** — 7d vs 14d vs 30d

### Single-Parameter Experiments
Test one parameter change against baseline:
- New gradient computation algorithm
- Modified pattern strength formula
- Different temporal factor calculation

### Hypothesis Experiments
Validate research hypotheses:
- "Does increasing gradient threshold improve proposal quality?"
- "Does longer window size produce more stable gradients?"
- "Does adding experience traces improve direction accuracy?"

## Experiment Lifecycle

```
Design → Baseline → Configure → Run → Measure → Compare → Decide
   │        │         │         │       │        │         │
   │        │         │         │       │        │         └→ Implement winner
   │        │         │         │       │        └→ Document results
   │        │         │         │       └→ Analyze metrics
   │        │         │         └→ Execute for N cycles
   │        │         └→ Override config
   │        └→ Record baseline metrics
   └→ Define hypothesis, metrics, duration
```

## Experiment Schema

```json
{
  "experiment_id": "exp_YYYY-MM-DD_NNN",
  "timestamp": "ISO-8601",
  "status": "active|completed|abandoned",
  "type": "ab|single|hypothesis",
  "name": "Human-readable name",
  "hypothesis": "What we're testing",
  "description": "Detailed explanation",
  "parameters": {
    "overrides": {
      "gradient_threshold": 0.50,
      "proposal_confidence_min": 0.60
    },
    "baseline": {
      "gradient_threshold": 0.30,
      "proposal_confidence_min": 0.40
    }
  },
  "duration": {
    "start": "ISO-8601",
    "end": "ISO-8601",
    "cycles": 30,
    "cycles_completed": 0
  },
  "metrics": {
    "tracked": ["proposal_quality", "gradient_stability", "cycle_latency"],
    "baseline": {},
    "current": {},
    "comparison": {}
  },
  "results": {
    "winner": "baseline|experiment|inconclusive",
    "confidence": 0.0,
    "summary": "Results summary",
    "details": {}
  },
  "decision": "implement|discard|continue|abandon",
  "lessons_learned": []
}
```

## Running an Experiment

### 1. Design the Experiment

Define:
- **Hypothesis** — What are we testing?
- **Parameters** — What config values to override?
- **Duration** — How many cycles?
- **Metrics** — What to measure?
- **Success criteria** — When is it a win?

### 2. Create Experiment Record

Write experiment JSON to `grao/experiments/`:
```json
{
  "experiment_id": "exp_2026-05-05_001",
  "status": "active",
  "type": "ab",
  "name": "Gradient Threshold A/B",
  "hypothesis": "Higher gradient threshold produces higher quality proposals",
  "parameters": {
    "overrides": { "gradient_threshold": 0.60 },
    "baseline": { "gradient_threshold": 0.30 }
  },
  "duration": { "cycles": 20 },
  "metrics": {
    "tracked": ["proposal_confidence", "gradient_stability", "proposal_count"]
  }
}
```

### 3. Execute

The GRAO loop reads the experiment config and applies overrides:
1. Load experiment JSON
2. Apply parameter overrides to loop configuration
3. Run for N cycles
4. Collect metrics per cycle
5. Compare against baseline

### 4. Analyze

After experiment completes:
1. Compute metric deltas (experiment - baseline)
2. Calculate statistical significance
3. Determine winner
4. Write results to experiment JSON

### 5. Decide

Based on results:
- **Implement** — Apply winner to production config
- **Discard** — Revert to baseline, document findings
- **Continue** — Extend experiment duration
- **Abandon** — Stop experiment, document why

## Experiment Registry

Active experiments are tracked in `grao/grao-state.json` under `experiment_registry`.

## Experiment Naming Convention

`exp_YYYY-MM-DD_NNN` where NNN is sequential within the day.

## Safety Constraints

- Experiments never run for more than 100 cycles without review
- Experiments can only override safe parameters (thresholds, windows, rates)
- Experiments cannot modify system-critical config (safety thresholds, veto rules)
- All experiments must have a clear success criteria
- Experiments are automatically paused if system health drops below threshold
