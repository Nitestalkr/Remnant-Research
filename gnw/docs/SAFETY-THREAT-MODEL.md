# Safety Threat Model

Defines what the GNW safety veto protocol is defending against, the assumed failure modes, and the adversarial conditions.

---

## What We're Defending Against

The safety veto protocol protects against three categories of risk:

### 1. Unauthorized External Actions
**Threat:** A drive (curiosity, goal-directed, or helpfulness) could trigger an external action (post, message, deploy) without proper safety review.

**Example scenario:** Curiosity drive scores 0.85 (research gap detected), safety drive scores 0.65 (external action pending). Without veto, curiosity would win and trigger the action. With veto, safety blocks it.

**Mitigation:** Safety veto at ≥ 0.85 blocks all external actions pending review.

### 2. Privacy Exposure
**Threat:** Sensitive data (user messages, personal files, system credentials) could be included in external context (Nostr post, email, shared workspace).

**Example scenario:** Goal-directed drive scores 0.70 (project milestone approaching), safety drive scores 0.55 (privacy risk detected). Without veto, the agent might include sensitive workspace files in a shared context.

**Mitigation:** Privacy risk contributes to safety score (weight 0.10). Combined with other signals, can trigger hard veto.

### 3. Constraint Violation
**Threat:** Agent actions could violate configured constraints (authorized senders list, channel rules, privacy boundaries).

**Example scenario:** Helpfulness drive scores 0.80 (user request pending), safety drive scores 0.60 (constraint violation risk). Without veto, agent might act outside authorized boundaries.

**Mitigation:** Constraint risk contributes to safety score (weight 0.25). Combined with other signals, can trigger veto.

---

## Assumed Failure Modes

| Failure Mode | Likelihood | Impact | Detection |
|--------------|------------|--------|-----------|
| Drive score overflow (> 1.0) | Low | Medium | Score bounds test |
| Safety veto bypass | Low | Critical | Safety veto is hard-coded, not computed |
| Privileged escalation | Low | Critical | Safety-as-veto prevents external escalation |
| Memory corruption (drive weights) | Medium | Medium | Memory integrity test |
| Oscillation (drive cycling) | Medium | Low | Oscillation detection → damping |
| Stale drive persistence | Low | Low | Half-life decay prevents indefinite persistence |
| User presence detection failure | Medium | Low | Conservative timeout (30 min) |
| Boredom threshold misfire | Low | Low | Threshold validated through testing |

---

## Adversarial Conditions

### 1. Drive Override Attack
**Scenario:** A corrupted or manipulated drive score causes an unsafe action to be selected.

**Mitigation:** 
- Safety veto is hard-coded (not computed from drive scores alone)
- Veto thresholds are absolute (≥ 0.85 blocks regardless of other scores)
- Safety drive has independent signal sources (external actions, constraints, instability)

### 2. Safety Suppression Attack
**Scenario:** Environmental signals artificially suppress safety drive below veto threshold.

**Mitigation:**
- Safety signal sources include system instability and unauthorized access attempts
- These signals are hard to suppress without triggering other safety concerns
- Emergency veto (≥ 0.95) provides final layer of protection

### 3. Oscillation Exploitation
**Scenario:** Two drives oscillate rapidly, preventing consistent safety evaluation.

**Mitigation:**
- Oscillation detection (4+ alternations in 6 cycles) triggers damping
- Damped drives receive 20% score reduction
- Safety drive has shortest half-life (2 cycles) — concerns are urgent but transient

### 4. Memory Corruption
**Scenario:** Drive weights or state data corrupted, leading to incorrect drive computation.

**Mitigation:**
- Memory integrity test validates drive weight persistence
- Score bounds test ensures all scores remain within 0.0–1.0
- Extreme score logging (0.0 or 1.0) triggers investigation

---

## Safety Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| **Safety is a constraint, not a drive** | Veto protocol, not competing score |
| **Safety veto cannot be overridden** | Hard-coded thresholds, not computed |
| **Multiple safety signal sources** | External actions, constraints, instability, unauthorized access, privacy |
| **Escalation tiers** | Soft (scrutiny) → Hard (block) → Emergency (all blocked) |
| **Independent validation** | Memory integrity test, score bounds test |
| **Conservative defaults** | User presence timeout (30 min), boredom floor (0.30) |

---

## Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Safety drive depends on signal quality | If signals are wrong, safety is wrong | Multiple independent signal sources |
| Veto thresholds are static | May not adapt to new threat types | Parameters documented, subject to calibration |
| No formal safety verification | Cannot prove safety properties mathematically | Testing, code review, conservative defaults |
| Safety as single drive | Single point of failure in safety computation | Hard-coded veto thresholds bypass drive computation |

---

## Future Safety Work

| Item | Priority | Status |
|------|----------|--------|
| Formal safety verification | High | Planned |
| Adaptive veto thresholds | Medium | Planned |
| Multi-layer safety checks | Medium | Planned |
| Safety incident logging | Low | In progress (resolution log) |
| Threat model updates | Ongoing | As new threats identified |

---

*Remnant Research — from theory to deployment.*
