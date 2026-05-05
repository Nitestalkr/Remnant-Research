# TPG Routing Implementation

## Overview

Concrete routing rules and transformation pipelines for the Tensor Processing Graph. This directory contains the actual routing logic that was previously only documented in the README.

## Routing Rules

### Rule 1: Agent Traces → Agent Optimization Loop

```
Source: Cron execution logs, tool usage, decision paths
Transformation:
  1. Extract timestamp, tool_name, success, latency
  2. Compute tool_chain (sequence of tools in decision path)
  3. Classify outcome (success, failure, partial, timeout)
  4. Tag with model_used, thinking_level
Output: Normalized agent event record
Destination: grao/loops/ (agent optimization sub-loop)
```

### Rule 2: Research Traces → Knowledge Acquisition Loop

```
Source: arXiv scan results, paper downloads, deep dive outputs
Transformation:
  1. Extract title, authors, abstract, arxiv_id
  2. Compute relevance_score against research keywords
  3. Extract key concepts (via keyword matching)
  4. Tag with domain, confidence, novelty
Output: Research event record with concept tags
Destination: grao/loops/ (knowledge acquisition sub-loop)
```

### Rule 3: Stability Traces → System Health Loop

```
Source: Memory metrics, drive status, gateway health, cron status
Transformation:
  1. Compute delta from baseline (memory %, drive %, etc.)
  2. Flag anomalies (threshold breaches)
  3. Compute trend (improving, stable, declining)
  4. Tag with severity (info, warning, critical)
Output: Health event record with trend analysis
Destination: grao/loops/ (system health sub-loop)
```

### Rule 4: Experience Traces → Meta-Optimization Loop

```
Source: Optimized workflows, learned patterns, configuration improvements
Transformation:
  1. Extract pattern description and context
  2. Compute effectiveness score (time saved, errors avoided)
  3. Tag with applicability domain
  4. Link to source trace if derived from one
Output: Experience record with effectiveness metrics
Destination: grao/loops/ (meta-optimization sub-loop)
```

## Transformation Pipeline

All traces pass through a standardized transformation pipeline:

```
Raw Input → Schema Validation → Type Classification → 
Domain Transformation → Enrichment → Output Format → 
Routing Decision → Destination
```

### Schema Validation
- Check required fields exist (timestamp, source, signal_type)
- Validate timestamp format (ISO-8601)
- Validate signal_type against known types

### Domain Transformation
Each signal type has domain-specific transformation:
- Agent traces: extract tool chains, latency, success rates
- Research traces: extract concepts, relevance, novelty
- Stability traces: compute deltas, trends, anomalies
- Experience traces: extract patterns, effectiveness, applicability

### Enrichment
- Add confidence score based on data quality
- Add relevance score based on current research priorities
- Add tags from pattern matching against known concepts

### Routing Decision
- Match signal type to routing rule
- Compute priority weight
- Select destination loop
- Apply any routing overrides

## Configuration

Routing behavior is configured in `grao/` state file:
- `routing.threshold` — minimum relevance score for routing
- `routing.overrides` — manual routing overrides for specific sources
- `routing.fallback` — default destination for unclassified signals
