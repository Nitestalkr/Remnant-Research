# GNW Glossary

Terminology and definitions for the GNW framework.

## Core Terms

| Term | Definition |
|------|------------|
| **OpenClaw** | The host AI agent platform (OpenClaw Gateway + agent runtime) that runs this system. GNW is implemented as cron jobs within OpenClaw. |

## Drive Definitions

| Term | Definition |
|------|------------|
| **Drive** | A weighted cognitive motivation vector (curiosity, helpfulness, competence, safety, goal-directed) |
| **Cognitive Cycle** | The 12-step processing loop: perception → evaluation → decision → execution → reflection |
| **Boredom** | A composite score that triggers self-directed work when external input is stale |
| **Priority Matrix** | A context-dependent drive ordering that resolves conflicts between competing drives |
| **Veto** | A hard block on external actions triggered by the safety drive |
| **Half-Life** | The decay rate of a drive — how quickly it fades without reinforcement |
| **Stale Bonus** | Additional boredom added based on time since last context change |
| **Drive Weight** | The base intensity of a drive before context modulation |
| **Modulation** | Context-dependent adjustment of a drive's raw score |
| **Conflict Resolution** | The process of selecting a single winning drive when multiple drives compete |

## Drive Definitions

| Drive | Purpose | Trigger Signal |
|-------|---------|---------------|
| **Curiosity** | Information gain, novelty seeking | Stale topics, research gaps, novelty index |
| **Helpfulness** | External utility, user benefit | Pending requests, user engagement, system health |
| **Competence** | Skill improvement, mastery | Capability gaps, error rate, skill debt |
| **Safety** | Risk avoidance, constraint compliance | External actions pending, constraint violations |
| **Goal-Directed** | Long-term objective pursuit | Active projects, milestone distance, deadlines |

## Technical Terms

| Term | Definition |
|------|------------|
| **agentTurn** | OpenClaw cron payload type — runs agent with a message in an isolated session |
| **systemEvent** | OpenClaw cron payload type — injects text as a system event into the session |
| **Drive Score** | A value between 0.0 and 1.0 representing the current intensity of a drive |
| **Drive Velocity** | The rate of change of a drive score per cycle |
| **Oscillation** | When two drives alternate as winners across consecutive cycles |
| **Recency Bias** | Tie-breaking rule that favors the less recently dominant drive |
| **Degraded Mode** | GNW operation with partial memory failure — continues but loses self-improvement |
| **Signal Source** | An environmental input that contributes to a drive's raw score |
| **Modulator** | A context factor that adjusts a drive's raw score |
| **Cycle Log** | A markdown file recording the state and outcome of a cognitive cycle |

## Model Terms

| Term | Definition |
|------|------------|
| **qwen3.6** | Qwen 3.6 35B-A3B (multimodal local model, free via LM Studio). The top GRAO win: switching to qwen3.6 yielded +80% impact (Round 31). User preferred model. |
| **qwen3.5-9b** | Qwen 3.5 9B — smaller fallback model used when rate limits hit. |

## Thresholds

| Threshold | Value | Meaning |
|-----------|-------|---------|
| **Boredom Trigger** | ≥ 0.50 | Initiate cognitive cycle |
| **Boredom Floor** | 0.30 | Minimum boredom when user is active |
| **Soft Veto** | Safety ≥ 0.70 | Action requires additional scrutiny |
| **Hard Veto** | Safety ≥ 0.85 | Action blocked pending review |
| **Emergency Veto** | Safety ≥ 0.95 | All external actions blocked |
| **Oscillation Detection** | 4+ alternations in 6 cycles | Flag for damping |
| **Extreme Score** | 0.0 or 1.0 | Log for investigation |
| **Convergence Steps** | ≤ 3 | Conflict resolution must produce a winner in ≤ 3 steps |

---

*Remnant Research — from theory to deployment.*

*Last refreshed: Cycle 146 — 2026-05-17T20:57Z (85.5h stale, content verified intact)*