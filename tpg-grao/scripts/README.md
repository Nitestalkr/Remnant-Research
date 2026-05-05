# GRAO Tooling Scripts

## Overview

Scripts that power the TPG-GRAO pipeline: trace collection, gradient derivation, research retrieval, and proposal generation.

## Scripts

### trace-collector.js
Collects and normalizes raw traces from all signal sources.

**Usage:** `node trace-collector.js [--sources all|agent|research|stability|experience] [--output traces/]`

**Input sources:**
- Agent logs (cron execution, tool usage)
- Research outputs (arXiv scan results, paper downloads)
- System metrics (memory, storage, gateway health)
- Experience captures (optimized workflows)

**Output:** JSON trace files in `traces/`

### gradient-deriver.js
Computes gradients from collected traces using pattern analysis.

**Usage:** `node gradient-deriver.js [--traces traces/] [--output gradients/] [--window 7d]`

**Algorithm:**
1. Load traces within time window
2. Cluster by signal type
3. Compute pattern strength per cluster
4. Apply temporal decay factors
5. Generate directional/magnitude/temporal gradients
6. Store in `gradients/`

### grao-retriever.js
Retrieves and analyzes GRAO loop history for trend analysis.

**Usage:** `node grao-retriever.js [--rounds N] [--metrics all|gradients|proposals|health]`

**Output:** Trend analysis and comparison data for report generation

### proposal-generator.js
Generates research proposals from gradient analysis.

**Usage:** `node proposal-generator.js [--gradients gradients/] [--threshold 0.50] [--output proposals/]`

**Logic:**
1. Load gradients exceeding threshold
2. Cross-reference with existing proposals (novelty check)
3. Score confidence based on pattern consistency
4. Generate proposal JSON for high-confidence signals
5. Route to `proposals/` with status "pending"

## Shared Dependencies

- All scripts use the trace format defined in `traces/README.md`
- All scripts use the gradient format defined in `gradients/README.md`
- All scripts use the proposal format defined in `proposals/README.md`

## Development Notes

- Scripts should be idempotent (safe to re-run)
- Each script should log its operation to stderr
- Output files should include creation timestamp in filename
- Error handling: graceful degradation, not crashes
