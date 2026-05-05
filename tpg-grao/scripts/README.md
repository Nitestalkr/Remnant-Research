# GRAO Tooling Scripts

## Overview

Four Node.js scripts that power the TPG-GRAO pipeline: trace collection, gradient derivation, loop history retrieval, and proposal generation. All scripts are operational and wired into the OpenClaw cron system.

## Status

| Script | Status | Last Validated |
|--------|--------|----------------|
| `trace-collector.js` | ✅ Operational | Round 39 (2026-05-04) |
| `gradient-deriver.js` | ✅ Operational | Round 39 (2026-05-04) |
| `grao-retriever.js` | ✅ Operational | Round 39 (2026-05-04) |
| `proposal-generator.js` | ✅ Operational | Round 39 (2026-05-04) |

## Quick Start — Run Full Pipeline

```bash
cd tpg-grao/scripts

# Step 1: Collect traces (all sources, 24h window)
node trace-collector.js

# Step 2: Derive gradients from collected traces (7d window)
node gradient-deriver.js

# Step 3: Generate proposals from strong gradients (threshold 0.50)
node proposal-generator.js

# Step 4: Analyze loop history and generate trend report
node grao-retriever.js
```

Or target specific sources / thresholds:

```bash
node trace-collector.js --sources agent,stability --window 12h
node gradient-deriver.js --window 30d --threshold 0.60
node proposal-generator.js --threshold 0.70 --novelty 60
node grao-retriever.js --rounds 10 --metrics gradients,health
```

---

## Scripts

### trace-collector.js

Collects and normalizes raw traces from all signal sources.

**Usage:** `node trace-collector.js [--sources all|agent|research|stability|experience] [--output traces/] [--window 24h]`

**Input sources:**
- `agent` — Cron execution logs, tool usage, model calls
- `research` — arXiv scan results, paper downloads, deep dive outputs
- `stability` — Memory usage, storage health, gateway status, cron reliability
- `experience` — Optimized workflows, learned patterns

**Output:** Validated, deduplicated JSON trace files in `traces/YYYY-MM-DD/`

**Key behaviour:**
- Content-hash deduplication (1-minute window) prevents duplicate traces
- Schema validation per signal type — missing required fields are rejected
- Enriches traces with confidence score based on data completeness
- Updates `grao/grao-state.json` with last collection timestamp

---

### gradient-deriver.js

Computes directional gradients from collected traces using pattern analysis.

**Usage:** `node gradient-deriver.js [--traces traces/] [--output gradients/] [--window 7d] [--threshold 0.30]`

**Algorithm:**
1. Load traces within time window from `traces/`
2. Cluster by signal type (agent / research / stability / experience)
3. Compute pattern strength per cluster (source diversity × confidence × temporal consistency)
4. Apply temporal adjustment (accelerating +20%, decaying −20%)
5. Classify gradient type: `directional` (research/experience), `magnitude` (stability), `temporal` (agent)
6. Store gradients in `gradients/`, archive those older than 30 days

**Output:** JSON gradient files in `gradients/` + updated `grao/grao-state.json`

---

### grao-retriever.js

Retrieves and analyzes GRAO loop history for trend analysis and report generation.

**Usage:** `node grao-retriever.js [--rounds N] [--metrics all|gradients|proposals|health] [--output reports/] [--window 30]`

**Analysis:**
- Loads loop logs from `grao/loops/`
- Analyzes gradient direction trends over time
- Tracks proposal status distribution (pending / active / completed)
- Reads system health from `grao/grao-state.json`
- Generates findings and recommendations

**Output:** JSON trend report saved to `reports/`

---

### proposal-generator.js

Generates research proposals from gradient analysis.

**Usage:** `node proposal-generator.js [--gradients gradients/] [--threshold 0.50] [--output proposals/] [--novelty 30]`

**Logic:**
1. Load all gradients from `gradients/`
2. Filter to those meeting magnitude threshold (default: 0.50)
3. Novelty check — skip directions recently investigated (active, completed, or rejected within novelty window)
4. Confidence check — skip gradients below 0.30 confidence
5. Generate proposal JSON with hypothesis, methodology, timeline, priority
6. Write to `proposals/` with status `"pending"`
7. Update `grao/grao-state.json`

**Proposal priorities:** `high` (magnitude ≥ 0.80) · `medium` (≥ 0.50) · `low` (< 0.50)

---

## Shared Dependencies

- All scripts read/write the shared state file at `grao/grao-state.json`
- Trace format defined in `traces/README.md`
- Gradient format defined in `gradients/README.md`
- Proposal format defined in `proposals/README.md`

## Design Principles

- **Idempotent** — Safe to re-run; existing files are never overwritten
- **Graceful degradation** — Missing directories or empty inputs produce warnings, not crashes
- **Content-addressed** — Trace deduplication uses SHA-256 content hashes
- **State-aware** — Each script updates `grao-state.json` so the pipeline has shared context
