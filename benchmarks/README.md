# Benchmarks — Andi System Performance Framework

_Automated benchmarking for the multi-agent AI system. Measures cognitive performance, agent capabilities, research quality, and system stability over time._

## Purpose

Answer "how good is this system?" with actual numbers instead of vibes. Track progress, identify bottlenecks, and provide comparative data for future assessments.

## Scoring Methodology

All metrics use a **0.0–1.0 scale** with clear thresholds:

| Score | Meaning |
|-------|---------|
| 0.9–1.0 | Excellent / fully operational |
| 0.7–0.8 | Good / minor issues |
| 0.5–0.6 | Adequate / needs attention |
| 0.3–0.4 | Degraded / significant issues |
| 0.0–0.2 | Critical / immediate action required |

Scores are **evidence-based**, not subjective. Each metric has defined inputs and calculation rules.

## Benchmark Buckets

### 1. Cognitive Performance (GNW + GRAO)

Measures the self-evolution systems' effectiveness.

| Metric | Input | Calculation |
|--------|-------|-------------|
| Cycle Completeness | gnw/cognitive-cycle/cycle-logs/ | % of cycles with all 12 steps completed |
| Drive Convergence | gnw/cognitive-cycle/cycle-logs/ | Average drive weight stability (variance < 0.05 = 1.0) |
| Exploration Ratio | tpg-grao/grao/grao-state.json | Exploration vs reinforcement output ratio |
| Boredom Responsiveness | gnw/cognitive-cycle/cycle-logs/ | Time from boredom > 0.5 to action taken |
| GRAO Success Rate | tpg-grao/grao/loops/ | Successful gradients / total gradients |
| Saturation Breaks | tpg-grao/grao/loops/ | Count of rounds that broke reinforcement-only loops |

### 2. Agent Capabilities (Dev + Visual Teams)

Measures the multi-agent team's effectiveness.

| Metric | Input | Calculation |
|--------|-------|-------------|
| Task Completion Rate | Agent heartbeat logs | Completed tasks / assigned tasks |
| Handoff Success Rate | Inter-agent messaging logs | Successful handoffs / total handoffs |
| Error Rate | Agent heartbeat logs | Error events / total events |
| Code Quality Score | Output analysis | Complexity, readability, bug rate |
| Response Latency | Message timestamps | Average time from task receipt to completion |
| Skill Utilization | Agent activity logs | % of available skills actively used |

### 3. Research Quality

Measures the research monitor's effectiveness.

| Metric | Input | Calculation |
|--------|-------|-------------|
| Paper Relevance Score | ArXiv monitor output | % of papers matching active research keywords |
| Deep Dive Consolidation | research/DEEPDIVE-*/ | Consolidated frameworks / total frameworks analyzed |
| Prototype Viability | research/prototypes/ | % of prototypes with actionable implementation path |
| Knowledge Harvest Rate | Knowledge harvest cron | Unique insights harvested / total papers reviewed |
| Cross-Domain Coverage | Research keywords | % of target domains actively monitored |

### 4. System Stability

Measures the deployment environment's health.

| Metric | Input | Calculation |
|--------|-------|-------------|
| Gateway Uptime | Gateway status logs | Uptime hours / total hours |
| Cron Health | Cron job status | % of jobs running without consecutive errors |
| Memory Usage | OS memory reports | Free RAM / total RAM |
| Drive Space | Drive reports | Available space / total space (per drive) |
| Crash Frequency | System crash logs | Crash events / total hours |
| Plugin Health | Plugin status | % of plugins operational |

## Metric Collection

Automated via cron:
- **Weekly:** Full benchmark run (all metrics)
- **Daily:** System stability metrics only
- **On-demand:** Any bucket via manual trigger

Output format: JSON snapshot → `benchmarks/metrics/` → `benchmarks/reports/` (analysis)

## Baseline

Current measurements: `benchmarks/baseline.md` (v1.1 — 2026-05-16)

## Latest Benchmark

Cycle 127 (2026-05-16 10:15 AM):
- **Overall Score: 0.72** (+0.06 vs baseline 0.66)
- **Cognitive: 0.70** — GRAO exploration breakthrough, GHO-44 convergence
- **Agents: 0.65** — GHO-44 sync test COMPLETE, 5-agent deployment
- **Research: 0.55** — 19 papers catalogued, consolidation v1.1 pending
- **Stability: 0.92** — Gateway healthy, 0 veto events, loop prevention

## Future Assessments

When someone asks about system quality:
1. Pull latest benchmark report from `benchmarks/reports/`
2. Compare against baseline (v1.1)
3. Highlight improvements and areas needing attention
4. Provide specific numbers, not generalizations

---

_Benchmarking framework v1.1 — 2026-05-16 (Cycle 127 update)_
