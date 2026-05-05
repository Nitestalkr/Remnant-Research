# Gradient Derivation — Detailed Methodology

## Overview

Gradient derivation is the core computation in GRAO. It transforms raw research traces into directional signals that steer the system toward optimization opportunities.

---

## 1. Trace Collection

### What Gets Traced

Every agent action that produces a measurable outcome is traced:

| Field | Description | Example |
|-------|-------------|---------|
| **type** | Action category | `research`, `coding`, `config`, `deployment` |
| **source** | Origin of the action | `cron`, `user_message`, `boredom_scan` |
| **target** | What was acted upon | `openclaw-config`, `telegram-bot`, `gnw-framework` |
| **action** | What was done | `model_switch`, `timeout_update`, `trace_collection` |
| **latency_ms** | Execution time | `3500` |
| **result** | Outcome | `success`, `failure`, `partial` |
| **impact_score** | Measured effect | `0.80` (80% improvement) |

### Trace Quality Requirements

- **100% metadata compliance** — All traces MUST have explicit type/source/target (not auto-detect)
- **Consistent formatting** — JSON structure, ISO timestamps, EST local time
- **Provenance** — Each trace has a unique ID and timestamp

### Live Run Data

From round 39 (2026-05-04):
- **Total traces in system:** 137
- **Traces collected this round:** 12
- **Metadata compliance:** 100% (achieved after 25+ rounds of iteration)

---

## 2. Pattern Analysis

### What Patterns Are Detected

1. **Success patterns** — Actions that consistently produce positive outcomes
2. **Failure patterns** — Actions that consistently produce negative outcomes
3. **Temporal patterns** — Actions that perform differently at different times
4. **Config patterns** — System configurations that correlate with performance
5. **Coordination patterns** — Multi-agent interactions that succeed or fail

### Pattern Scoring

Each pattern is scored on:

| Metric | Description | Formula |
|--------|-------------|---------|
| **Frequency** | How often the pattern occurs | count / total_traces |
| **Impact** | Average outcome magnitude | mean(impact_scores) |
| **Consistency** | How reliable the outcome | std_dev(impact_scores) inverted |
| **Novelty** | How new the pattern is | 1 - (similar_patterns / total_patterns) |

---

## 3. Gradient Computation

### Core Formula

```
gradient_score = (impact × frequency × persistence × consistency) / normalization
```

Where:
- **impact** — Average outcome magnitude (0.0–1.0)
- **frequency** — Pattern occurrence rate (0.0–1.0)
- **persistence** — How long pattern has been stable (0.0–1.0)
- **consistency** — Reliability of outcome (1.0 - std_dev)
- **normalization** — Sum of all gradient scores in the round

### Gradient Classification

After computing scores, gradients are categorized:

```
IF gradient_score > high_threshold:
    category = "high_priority"
    action = "immediate_investigation"
ELIF gradient_score > threshold:
    IF outcome_positive:
        category = "success"
        action = "reinforce_pattern"
    ELIF outcome_negative:
        category = "failure"
        action = "root_cause_analysis"
    ELIF outcome_trending_negative:
        category = "warning"
        action = "monitor_closely"
ELIF gradient_score > low_threshold:
    category = "low_priority"
    action = "monitor"
```

### Thresholds (Current)

| Threshold | Value | Purpose |
|-----------|-------|---------|
| **high_threshold** | 0.85 | Immediate investigation |
| **threshold** | 0.50 | Standard processing |
| **low_threshold** | 0.25 | Monitor only |

---

## 4. Gradient Clustering

### How Clusters Work

Related gradients are grouped into clusters. Each cluster represents a research direction.

### Clustering Algorithm

1. **Compute similarity** — Between each pair of gradients
2. **Group by similarity** — Gradients above similarity threshold → same cluster
3. **Score clusters** — Aggregate gradient magnitude, internal coherence, actionability
4. **Rank clusters** — By score, for proposal generation

### Similarity Metrics

| Metric | Description | Weight |
|--------|-------------|--------|
| **Target overlap** | Do gradients target the same system? | 0.30 |
| **Action type** | Are gradients about similar actions? | 0.25 |
| **Temporal proximity** | Did gradients occur close in time? | 0.15 |
| **Impact correlation** | Do gradients have similar impact? | 0.20 |
| **Experience overlap** | Do gradients relate to same experiences? | 0.10 |

### Live Cluster Data (Round 31)

| Cluster | Experiences | Avg Improvement | Confidence |
|---------|-------------|-----------------|------------|
| **model_optimization** | model_switch | 80% | 0.95 |
| **trace_quality** | trace_quality_milestone | 30% | 0.95 |
| **coordination_improvement** | phase6_completion | 80% | 0.90 |
| **reliability_policy** | timeout_fix | 60% | 0.90 |
| **temporal_stability** | gnw_night_activity | 75% | 0.85 |
| **monitoring_coverage** | gnw_phase5_activation | 70% | 0.85 |
| **tool_accuracy** | tool_descriptions | 15% | 0.80 |

---

## 5. Experience Retrieval

### What Experiences Are

Proven optimization patterns that have been validated through the GRAO cycle. Each experience contains:

| Field | Description |
|-------|-------------|
| **id** | Unique identifier |
| **timestamp** | When the experience was recorded |
| **cluster** | Which TPG cluster it belongs to |
| **type** | What kind of pattern it represents |
| **context** | What was happening when this pattern was observed |
| **action** | What was done |
| **result** | What was the outcome |
| **confidence** | How confident we are in this pattern |
| **impact** | Measured effect (cost_reduction, success_rate_change, latency_change) |
| **tags** | Classification tags |
| **verified** | Has this been independently verified? |

### Retrieval Algorithm

```
1. Query GRAO experience store for cluster
2. Sort by confidence × impact
3. Return top N experiences (N = target, typically 5-10)
4. Use experiences as basis for proposal generation
```

### Current Experience Store (Round 39)

| ID | Cluster | Type | Impact |
|----|---------|------|--------|
| exp_2026-04-23_model_switch | agent_prompt_optimization | model_change | +80% |
| exp_2026-04-23_timeout_fix | agent_prompt_optimization | config_change | +60% |
| exp_2026-04-23_doctor_cleanup | agent_prompt_optimization | health_check | +40% |
| exp_2026-04-26_gnw_phase5_activation | agent_prompt_optimization | cognitive_cycle | +70% |
| exp_2026-04-27_gnw_night_activity | agent_prompt_optimization | temporal_pattern | +75% |
| exp_2026-04-27_phase6_completion | agent_prompt_optimization | coordination_pattern | +80% |
| exp_2026-04-27_trace_quality_milestone | trace_quality | metadata_compliance | +30% |
| exp_2026-04-27_tool_descriptions | tool_optimization | description_update | +15% |

---

## 6. Proposal Generation

### How Proposals Are Generated

Proposals are generated from gradient analysis + experience retrieval:

```
1. Analyze top gradient clusters
2. Retrieve relevant experiences
3. Compute expected improvement for each potential action
4. Generate proposal with:
   - proposal_id
   - node (which system to update)
   - action (what to do)
   - confidence (how sure we are)
   - expected_improvement (quantified benefit)
   - rationale (why this action)
```

### Proposal Types

| Type | Description | When Generated |
|------|-------------|----------------|
| **Reinforcement** | Maintain current policies | When success ratio is high, no new areas |
| **Optimization** | Improve a specific area | When a failure gradient is detected |
| **Exploration** | Try a new area | When policy saturation is detected |
| **Investigation** | Root cause analysis | When persistent failure gradients exist |

### Live Proposal Data

| Round | Proposal ID | Type | Confidence | Expected Improvement |
|-------|-------------|------|------------|---------------------|
| 13 | prop_1777076553900 | reinforcement | 0.90 | +64% |
| 31 | prop_1777312817627 | reinforcement | 0.92 | +70% |
| 38 | prop_1777420999506 | reinforcement | 0.90 | +64% |
| 39 | prop_1777869954660 | reinforcement | 0.90 | +64% |

---

## 7. Policy Saturation Detection

### The Problem

When all strong patterns are codified into TPG policies, the system enters reinforcement-only mode:

- Success ratio plateaus near 90%+
- No new optimization areas explored
- Consecutive reinforcement rounds accumulate
- System becomes "stuck" in local optimum

### Detection Criteria

Policy saturation is detected when:

1. **Consecutive reinforcement rounds ≥ 15**
2. **Success ratio plateaus near 90%+** (no significant upward trend for 5+ rounds)
3. **No new optimization areas explored** in the last N rounds
4. **Gradient diversity declining** (same patterns, same gradients)

### Response: Generate Exploration Gradients

When saturation is detected:
1. **Identify unexplored TPG paths** — What hasn't been optimized yet?
2. **Generate exploration gradients** — Directional signals toward new areas
3. **Prioritize exploration proposals** — Over reinforcement proposals
4. **Monitor exploration results** — Track if new areas yield improvements

### Current Status (Round 39)

- **Consecutive reinforcement rounds:** 20
- **Success ratio:** 92.7% (plateauing)
- **New areas explored:** None in last 20 rounds
- **Saturation detected:** ✅ Yes
- **Action needed:** Begin exploring NEW optimization areas

---

## 8. Implementation Notes

### Script Architecture

The GRAO system uses 4 scripts:

| Script | Purpose |
|--------|---------|
| **trace-collector.js** | Collect and record agent traces |
| **gradient-deriver.js** | Compute gradients from traces |
| **grao-retriever.js** | Retrieve experiences from store |
| **proposal-generator.js** | Generate proposals from gradient analysis |

### Storage

| Data | Location | Format |
|------|----------|--------|
| Traces | `research/grao/traces/` | JSON |
| Gradients | `research/grao/monitor/` | JSON (round summaries) |
| Experiences | `research/grao/experiences/` | JSON |
| Proposals | `research/grao/proposals/` | JSON |
| Monitor rounds | `research/grao/monitor/` | JSON |
| Cycle reports | `research/grao/reports/` | MD |

### Cron Integration

The GRAO system runs via OpenClaw cron:
- **Job:** TPG-GRAO-AutoEvolution
- **Schedule:** Every 24 hours (24hr stability monitoring)
- **Payload:** Agent turn that runs the full GRAO cycle

---

*Remnant Research — gradient derivation methodology for GRAO.*
