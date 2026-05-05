# Stability Test Runner

## Overview

Script that runs the GNW stability tests against live or simulated drive state. Used to validate framework stability before and after changes.

## Usage

```bash
node stability-test-runner.js [--test all|oscillation|bounds|boredom|convergence|integrity] [--mode live|simulated] [--cycles N]
```

## Test Execution

### Stability Test 1: Drive Oscillation
```bash
node stability-test-runner.js --test oscillation --cycles 20
```
Runs 20 cognitive cycles and checks for flip-flop patterns.

### Stability Test 2: Drive Score Bounds
```bash
node stability-test-runner.js --test bounds --cycles 50
```
Runs 50 cycles and verifies all scores stay in [0.0, 1.0].

### Stability Test 3: Boredom Threshold
```bash
node stability-test-runner.js --test boredom --user-state active|away --cycles 30
```
Tests boredom triggers under different user states.

### Stability Test 4: Conflict Convergence
```bash
node stability-test-runner.js --test convergence --simulated --cycles 100
```
Runs 100 simulated cycles with randomized drive scores.

### Stability Test 5: Memory Integrity
```bash
node stability-test-runner.js --test integrity
```
Verifies drive state persistence and recovery.

## Output

Results written to `gnw/stability/test-results/` as JSON:
```json
{
  "test_id": "test_YYYY-MM-DD_type",
  "test": "oscillation|bounds|boredom|convergence|integrity",
  "mode": "live|simulated",
  "cycles": N,
  "passed": true/false,
  "details": {},
  "timestamp": "ISO-8601"
}
```

## Simulated Mode

When `--mode simulated`, the test runner generates synthetic drive scores
based on the convergence profiles defined in `TEST-SCORE-BOUNDS.md`:

- Curiosity: 0.3–0.6 with stale bonuses
- Helpfulness: 0.4–0.8 with user presence modulation
- Competence: 0.2–0.5 with gap detection spikes
- Safety: 0.1–0.4 with risk spikes
- Goal-Directed: 0.3–0.7 with project activity modulation
