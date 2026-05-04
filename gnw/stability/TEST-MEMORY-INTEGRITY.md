# Test 5: Memory Update Integrity

**Status:** Implemented (write verification)
**Last Verified:** Phase 5 testing

## Objective

Ensure cognitive cycle memory updates don't corrupt state, lose data,
or leave the system in an inconsistent state.

## Memory Components

GNW writes to four memory locations each cycle:

| Component | Location | Format | Size |
|-----------|----------|--------|------|
| Drive weights | gnw/sprints/drive-weights.json | JSON | ~2KB |
| Cycle log | gnw/cognitive-cycle/cycle-logs/cycle-YYYY-MM-DD-HHMM.md | Markdown | ~1KB |
| Boredom score | gnw/sprints/boredom-state.json | JSON | ~500B |
| Winner history | gnw/sprints/winner-history.json | JSON | ~5KB |

## Write Verification Protocol

### Step 1: Write
Write all memory updates in a single atomic operation (or sequential with rollback).

### Step 2: Verify
After each write, verify:
1. File exists at expected path
2. Content matches expected format
3. No data truncation or corruption

### Step 3: Rollback (if verification fails)
If any write fails:
1. Restore from previous known-good state
2. Log the failure with severity
3. Continue cycle without the failed update (degraded mode)

## Memory Corruption Detection

### Periodic Integrity Check (Every 100 cycles)

`python
def memory_integrity_check():
    """Verify all GNW memory components are intact."""
    checks = [
        ('drive-weights.json', validate_json, check_drive_weights),
        ('boredom-state.json', validate_json, check_boredom_state),
        ('winner-history.json', validate_json, check_winner_history),
    ]
    
    failures = []
    for path, validator, checker in checks:
        if not file_exists(path):
            failures.append(f"{path}: file missing")
            continue
        
        content = read_file(path)
        if not validator(content):
            failures.append(f"{path}: invalid format")
            continue
        
        if not checker(content):
            failures.append(f"{path}: data inconsistency")
            continue
    
    return failures
`

### Check Functions

**validate_json:** Content is valid JSON
**check_drive_weights:** All 5 drives present, scores in [0.0, 1.0]
**check_boredom_state:** Has timestamp, score, components
**check_winner_history:** Sequential cycle IDs, no gaps

## Degraded Mode

If memory updates fail:
1. Drive scores computed but not persisted (reset each cycle)
2. Cycle logs not written (no historical record)
3. Boredom score computed but not tracked
4. Winner history not maintained (oscillation detection disabled)

**Impact:** GNW continues to function but loses self-improvement capability.
**Recovery:** Manual memory restoration or full restart.

## Success Criteria

- 100% memory write success rate in normal operation
- Zero data loss in any cycle
- Memory corruption detected and reported within 1 cycle
- Degraded mode does not cause system instability

## Historical Notes

- No memory corruption detected in Phase 5 testing
- One instance of cycle log write failure — fixed by adding write verification
- Memory integrity checks run periodically but not yet automated

---

*Remnant Research — from theory to deployment.*