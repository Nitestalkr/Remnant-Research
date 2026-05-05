# GNW ↔ GRAO Integration

## Overview

GNW and GRAO are not independent systems — they form a closed feedback loop where each
drives the other. GNW provides the cognitive architecture for agent motivation and action
selection; GRAO provides the research-direction optimization that feeds back into GNW's
drive weights.

This document describes the formal integration between the two systems.

---

## The Closed Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                    GNW Cognitive Engine                         │
│                                                                 │
│  Context → Drives → Cycle → Action Selection → Execute         │
│                                                                 │
└──────────────────────┬────────────────────────────────────────┘
                       │ traces (execution records)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GRAO Research Loop                           │
│                                                                 │
│  Traces → Gradients → Proposals → Experiences → Updates        │
│                                                                 │
└──────────────────────┬────────────────────────────────────────┘
                       │ gradients, experiences, proposals
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Drive Weight Update                          │
│                                                                 │
│  Gradients → Drive modulation → Updated drive weights          │
│                                                                 │
└──────────────────────┬────────────────────────────────────────┘
                       │ (new drive weights)
                       └──→ GNW (next cycle)
```

### Step-by-Step

1. **GNW acts** — The cognitive cycle selects an action based on current drive weights
2. **Trace generated** — The action's execution produces a trace (tool calls, outcomes, metadata)
3. **GRAO collects** — The trace is ingested by `trace-collector.js`
4. **GRAO derives** — Patterns across traces produce directional gradients
5. **GRAO proposes** — Strong gradients generate proposals for research direction
6. **Experiences form** — Successful patterns enter the experience store
7. **Feedback computed** — Gradients and experiences are translated into drive weight updates
8. **GNW re-evaluates** — Updated drive weights produce new action selections
9. **Repeat** — Each cycle leaves richer data for the next

---

## Gradient → Drive Weight Mapping

Gradients from GRAO are mapped to GNW drives based on what the gradient signals:

| Gradient Direction | Drive Boosted | Mechanism |
|--------------------|---------------|-----------|
| **knowledge-acquisition** | Curiosity | New research domains detected → curiosity increases |
| **system-health** | Safety | Stability issues detected → safety increases |
| **agent-optimization** | Competence | Workflow patterns improving → competence increases |
| **meta-optimization** | Competence | Proven patterns entering experience store → competence increases |
| **research-related** | Goal-Directed | Active research projects tracked → goal-directed increases |
| **user-engagement** | Helpfulness | User interaction patterns → helpfulness increases |

### Mapping Logic

```
For each active gradient:
  1. Identify gradient direction
  2. Look up mapping table above
  3. Compute boost magnitude from gradient magnitude
  4. Apply boost to target drive
  5. Normalize drive weights after all boosts applied
```

The boost magnitude is proportional to the gradient magnitude:

```
drive_boost = gradient_magnitude × gradient_confidence × mapping_strength
```

Where `mapping_strength` is a per-direction weight (default 0.30, configurable).

---

## Experience → Drive Weight Mapping

Proven experiences from the GRAO experience store also feed back into GNW:

| Experience Impact | Drive Boosted | Mechanism |
|-------------------|---------------|-----------|
| **Model switch success** (+80%) | Competence | Proven optimization → competence increases |
| **Coordination pattern** (+80%) | Goal-Directed | Cross-agent success → goal-directed increases |
| **Trace quality milestone** (+30%) | Competence | Quality improvement → competence increases |
| **Stability improvement** (+75%) | Safety | System health proven → safety decreases (risk reduced) |

### Safety Inverse Mapping

Unlike other drives, **safety decreases** when stability experiences are proven.
This reflects reduced risk — the system is more confident because stability has been
validated.

---

## Proposal → Drive Weight Mapping

GRAO proposals also influence drive weights when they are activated:

| Proposal Type | Drive Effect |
|---------------|-------------|
| **Exploration proposal** | Boosts Curiosity (explicitly seeks new areas) |
| **Reinforcement proposal** | Boosts Competence (reinforces proven patterns) |
| **System health proposal** | Boosts Safety (addresses stability concerns) |
| **Research integration proposal** | Boosts Goal-Directed (advances research objectives) |

---

## Drive Weight Update Protocol

Drive weight updates from GRAO feedback follow this protocol:

1. **Collect feedback** — Load active gradients and experiences from GRAO state
2. **Compute boosts** — Apply mapping tables to derive per-drive boost values
3. **Apply normalization** — Ensure all drive weights remain in valid range
4. **Log changes** — Record which drives were boosted and by how much
5. **Persist** — Write updated weights to drive weight store
6. **Next cycle** — GNW cognitive cycle uses updated weights for action selection

### Normalization

After applying GRAO-derived boosts, drive weights are normalized:

```
total_boost = sum of all individual drive boosts
if total_boost > 0:
    normalized_boost = individual_boost / total_boost
    new_weight = base_weight + (normalized_boost × boost_scale)
    clamp to [0.0, 1.0]
```

The `boost_scale` parameter controls how aggressively GRAO feedback shifts drive weights
(default 0.15, meaning GRAO feedback can shift weights by up to 15% per cycle).

---

## Integration Data Flow

### What GNW Sends to GRAO

| Data | Format | Purpose |
|------|--------|---------|
| Action execution | Trace JSON | GRAO analyzes what was done and how well |
| Tool calls | Trace JSON | GRAO patterns tool usage for optimization |
| Outcomes | Trace JSON | GRAO computes success/failure patterns |
| Metadata | Trace JSON | Model, latency, confidence, etc. |

### What GRAO Sends to GNW

| Data | Format | Purpose |
|------|--------|---------|
| Active gradients | State JSON | Drive weight update computation |
| Proven experiences | State JSON | Competence/safety drive modulation |
| Research priorities | State JSON | Goal-directed drive modulation |
| System health metrics | State JSON | Safety drive modulation |

---

## Integration Status

| Component | Status | Notes |
|-----------|--------|-------|
| **GNW → GRAO (traces)** | ✅ Operational | GNW actions produce traces collected by GRAO |
| **GRAO → GNW (gradients)** | 📋 Designed | Mapping documented, live integration pending |
| **Experience → Drive** | 📋 Designed | Mapping documented, live integration pending |
| **Proposal → Drive** | 📋 Designed | Mapping documented, live integration pending |
| **Weight update protocol** | 📋 Designed | Normalization and logging documented |

The GNW → GRAO direction is operational (traces flow from agent actions to GRAO).
The GRAO → GNW direction is designed but not yet implemented in the live system.
This is a Phase 6 / Phase 9 priority — closing the feedback loop is the most
important remaining integration task.

---

## Why This Matters

The GNW ↔ GRAO closed loop is the project's most important architectural claim:

1. **Self-regulating motivation** — GRAO's gradient analysis directly modulates GNW's
   drive weights, meaning the agent's motivation adapts to what the research system
   has learned.

2. **Compounding improvement** — Each cycle produces traces → gradients → proposals →
   experiences → drive updates → better actions → better traces. The loop compounds.

3. **Research-driven evolution** — Unlike static drive weights, GNW's motivation is
   informed by GRAO's empirical analysis of what actually works.

4. **No external tuning** — The system self-calibrates through the feedback loop,
   reducing the need for manual parameter adjustment.

---

## Future Integration Work

| Item | Priority | Status |
|------|----------|--------|
| Implement gradient → drive mapping | High | Phase 9 |
| Implement experience → drive mapping | High | Phase 9 |
| Implement proposal → drive mapping | Medium | Phase 9 |
| Weight update normalization | Medium | Phase 9 |
| Integration testing (GNW + GRAO together) | High | Phase 6 |
| Drive weight history tracking | Medium | Phase 8 |
| Cross-agent integration (multi-agent feedback) | High | Phase 10 |

---

*Remnant Research — GNW ↔ GRAO integration design.*
