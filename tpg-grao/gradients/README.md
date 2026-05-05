# Gradients

## What Are Gradients?

In the TPG-GRAO framework, **gradients** are directional signals derived from pattern analysis across research traces. They represent the *direction* and *magnitude* of optimization needed — not just whether something worked or failed, but *how* it worked, *why* it failed, and *where* to push next.

Think of them like gradient descent in ML, but applied to agent behavior optimization: each trace is a data point, each gradient is a computed direction toward better performance.

## Why Gradients Are Needed

Without gradients, an autonomous research system has no way to:

1. **Steer itself** — Random exploration or static priority leads to diminishing returns. Gradients provide continuous directional signal.
2. **Distinguish signal from noise** — Not all improvements are equal. A 5% improvement on a high-frequency task is worth more than a 50% improvement on a never-run path. Gradients encode this.
3. **Detect saturation** — When all strong patterns are codified and success ratios plateau, gradients reveal what's *not* being explored. This is the "policy saturation" problem (20+ consecutive reinforcement rounds with no new optimization areas).
4. **Prioritize failure investigation** — Not all failures are equal. A failure on a critical path with high impact potential deserves attention over a failure on an edge case. Gradients encode priority.

## How Gradients Work

```
Trace Collection → Pattern Analysis → Gradient Derivation → TPG Routing → Proposal Generation
     │                  │                   │                 │               │
     │                  │                   │                 │               │
  Raw data        What changed?        Direction +        Which nodes     What to
  (137 traces)    Success/failure      Magnitude          to update       implement
```

Each round:
1. **Collect traces** — Agent actions, results, context, metadata
2. **Analyze patterns** — Compare against existing policies and experience clusters
3. **Derive gradients** — Compute directional signals (success, failure, warning, high-priority)
4. **Route via TPG** — Tensor Processing Graph routes gradients to appropriate nodes
5. **Generate proposals** — Based on gradient analysis, propose optimization actions

## Gradient Types

### 1. Success Gradients
**Signal:** A pattern produced a positive outcome. Reinforce this pattern.

**Purpose:** Codify what works into TPG policies. This is the "reinforcement" phase.

**Example from live runs:**
```
Round 39: 127 success gradients (92.7% of 137 total)
- Model switch to qwen3.6: sustained +80% improvement over 33 rounds
- Night activity pattern stabilization: sustained +75% improvement
- Unified cognitive cycle: sustained +70% improvement
- Cron timeout fix (300→600s): sustained +60% improvement
```

**Characteristics:**
- High frequency when policies are stable
- Diminishing marginal value as patterns get codified
- Can mask exploration gaps (reinforcement-only loops)

### 2. Failure Gradients
**Signal:** A pattern produced a negative outcome. Investigate and adapt.

**Purpose:** Identify broken patterns, root causes, and adaptation opportunities.

**Example from live runs:**
```
Round 39: 10 failure gradients (7.3% of 137 total)
- All 10 are high-priority (trace metadata quality issues)
- Persistent across 39 rounds — same root cause not addressed
- Impact: 10/29 failure gradients in earlier rounds were trace metadata
```

**Characteristics:**
- High priority when persistent (same failure across many rounds)
- Root cause analysis needed for persistent failures
- Can indicate systemic issues (not just random noise)

### 3. Warning Gradients
**Signal:** A pattern is degrading or approaching a threshold. Monitor closely.

**Purpose:** Early detection of degradation before it becomes a failure.

**Example from live runs:**
```
Round 38→39: Success ratio jumped from 83.3%→92.7%
- Warning: Sudden improvement may indicate measurement artifact
- Action: Verify trace quality and collection methodology
```

**Characteristics:**
- Often precede failure gradients (early warning)
- Can also precede success (when a fix takes effect)
- Need contextual analysis to interpret correctly

### 4. High-Priority Gradients
**Signal:** A pattern has critical impact potential. Immediate attention required.

**Purpose:** Ensure critical issues aren't lost in the noise of routine monitoring.

**Example from live runs:**
```
Round 39: 10 high-priority gradients
- All related to trace metadata quality
- Root cause: trace collector missing type/source/target fields
- Impact: Limits GRAO experience retrieval quality
- Action: Fix trace collector metadata fields
```

**Characteristics:**
- Subset of failure/warning gradients that have been flagged
- Based on impact × frequency × persistence scoring
- Always investigated before lower-priority gradients

### 5. Exploration Gradients (Emerging)
**Signal:** A pattern hasn't been explored yet. Worth investigating.

**Purpose:** Drive the system toward *new* optimization areas when saturation is detected.

**Not yet implemented in live runs** — this is the next phase of GRAO. The current system is stuck in reinforcement-only mode (20+ consecutive rounds with no new optimization areas).

**Proposed characteristics:**
- Generated when success ratio plateaus near 90%+
- Triggered by "policy saturation" detection
- Direct system toward unexplored TPG paths
- Would enable the "explore new areas" action needed per round 39

## Gradient Computation

Each gradient is computed from trace data using the following formula:

```
gradient_score = (impact × frequency × persistence) / normalization_factor
```

Where:
- **impact** — Potential effect of optimization (0.0–1.0)
- **frequency** — How often this pattern occurs (0.0–1.0)
- **persistence** — How long the pattern has been stable (0.0–1.0)
- **normalization_factor** — Total gradient score in the round (ensures scores sum to 1.0)

Gradients are then categorized:
- **Success** — gradient_score > threshold AND outcome positive
- **Failure** — gradient_score > threshold AND outcome negative
- **Warning** — gradient_score > threshold AND outcome trending negative
- **High-priority** — gradient_score > high_threshold OR impact > critical_threshold

## Gradient Data from Live Runs

### Round 39 (2026-05-04) — Most Recent
```
Total traces: 137
Success gradients: 127 (92.7%)
Failure gradients: 10 (7.3%)
High-priority: 10 (all failure, trace metadata)
Success ratio trend: 83.3% → 92.7% (significant jump)
Policy saturation: 20 consecutive reinforcement rounds
```

### Round 33 (2026-04-30) — Pre-Expansion
```
Total traces: 13
Success gradients: 81 (89.0%)
Failure gradients: 10 (11.0%)
GRAO experiences: 6 (in agent_prompt_optimization cluster)
Success ratio trend: Upward since round 27's 100% milestone
Policy codification: 33 consecutive rounds holding
```

### Round 20 (2026-04-26) — Early Stabilization
```
Total traces: 13
Success gradients: 19 (65.5%)
Failure gradients: 10 (34.5%)
GRAO experiences: 3 (in agent_prompt_optimization cluster)
Success ratio trend: 56.5% → 59.1% → 54.5% → 58.3% → 63.0% → 65.5%
Policy codification: 12 consecutive rounds holding
```

### Trend Analysis
```
Round 20: 65.5% success ratio, 3 experiences, 12 policy rounds
Round 33: 89.0% success ratio, 6 experiences, 33 policy rounds
Round 39: 92.7% success ratio, 6 experiences, 20 policy rounds (saturation)
```

The success ratio improved dramatically as GRAO expanded from 3→6 experiences. The current plateau at ~93% suggests policy saturation — all strong patterns are codified, and the system needs to explore new areas.

## Gradient Storage

Gradients are stored in two places:

1. **`gradients/`** — Computed gradient data (this folder)
2. **`research/grao/monitor/`** — Round-level gradient summaries (live run data)

The monitor rounds contain the raw gradient counts and metrics. The `gradients/` folder will contain derived gradient analysis, gradient evolution tracking, and gradient-based proposal history.

## Next Steps

1. **Implement exploration gradients** — Detect policy saturation and drive toward new optimization areas
2. **Add gradient evolution tracking** — Track how gradient distributions change over time
3. **Cross-cluster gradient analysis** — Compare gradients across different TPG clusters (not just agent_prompt_optimization)
4. **Gradient-based proposal generation** — Use gradient analysis to auto-generate optimization proposals

---

*Remnant Research — gradients as the directional signal for autonomous research.*
