# Contributing to Remnant Research

Thank you for your interest in contributing to Remnant Research. This is an open research mirror of a live OpenClaw-based AI agent system. Contributions take the form of research documentation, analysis, implementation specifications, and paper indexing — not running code patches against the live system.

---

## What You Can Contribute

### 1. Framework Documentation

Improvements to GNW, GRAO/TPG, or Clawstr documentation:

- Clarifying descriptions, glossary entries, or design rationale
- Correcting stale parameter values or outdated status claims
- Adding worked examples to cognitive-cycle or conflict-resolution docs
- Extending the stability test specs with new test cases

**Where:** `gnw/docs/`, `tpg-grao/grao/`, `tpg-grao/tpg/`, `clawstr/`

### 2. Research Paper Indexing

Adding papers to the archive catalog:

- Relevant arXiv papers on cognitive architectures, autonomous agents, self-evolving systems, gradient-driven optimization, consciousness theories, memory systems
- Papers should include: arXiv ID, title, authors, date, abstract summary, and relevance to GNW/GRAO

**Where:** `papers/`  — see [papers/README.md](papers/README.md) for the catalog format

### 3. GRAO Loop Analysis

Analysis of GRAO cycle logs or gradient patterns:

- Pattern analysis across rounds (gradient direction trends, success ratio changes)
- Proposal quality assessment
- Failure mode categorization

**Where:** `tpg-grao/reports/`

### 4. Stability Tests and Benchmarks

New stability tests for GNW or benchmark definitions for GRAO:

- Follow the format in `gnw/stability/` for new stability test specs
- Follow the format in `benchmarks/` for new benchmark definitions

**Where:** `gnw/stability/`, `benchmarks/`

### 5. Corrections and Fixes

This repo mirrors a live system and can drift from live state. Pull requests that:

- Correct factual errors (wrong parameter values, stale success ratios, contradictions)
- Align prose with loop JSON artifacts (loop JSONs are the ground truth)
- Fix broken links or outdated file references

---

## How to Contribute

### For Documentation and Analysis

1. Fork the repository
2. Create a branch: `git checkout -b your-topic`
3. Make your changes following the style guide below
4. Open a pull request with a clear description of what changed and why

### For Paper Indexing

1. Use the catalog format defined in [papers/README.md](papers/README.md)
2. Add the paper entry under the appropriate section (framework, memory, safety, etc.)
3. Keep entries concise — focus on relevance to GNW/GRAO

### For Corrections

1. Reference the source of truth (loop JSON artifact, parameter file, or spec) in your PR description
2. Note if the correction was derived from the live system or from public documents only
3. If uncertain, soften wording rather than asserting a specific value

---

## Style Guide

### Markdown

- Use ATX headings (`#`, `##`, `###`) — no underline style
- Use pipes for tables (aligned columns optional)
- Use fenced code blocks with language identifiers
- Prefer relative links within the repo over absolute URLs

### Technical Accuracy

- **Loop JSON artifacts are ground truth.** When prose conflicts with a loop JSON, the JSON wins.
- **Parameter files are canonical.** Refer to `gnw/docs/PARAMETER-VALUES.md` for drive parameter values.
- **Avoid absolute success claims.** Use "as of Round N" or "as of Phase N" so claims decay gracefully.
- **Never claim an implementation is live** unless a loop artifact or script execution backs it up.

### Status Language

Use consistent status markers:

| Marker | Meaning |
|--------|---------|
| ✅ Complete | Implemented and verified by loop artifacts |
| 🔄 In Progress | Actively being worked on in the live system |
| 📋 Planned | Specified but not yet started |
| ⏳ Pending | Waiting on a dependency |
| ❌ Deprecated | No longer valid — reference only |

---

## What This Repo Is Not

- **Not a runnable codebase.** The OpenClaw platform powering the live system is private. Scripts in `tpg-grao/scripts/` are published incrementally as they stabilize; they are not a complete install-and-run package.
- **Not accepting live system patches.** PRs cannot modify the live OpenClaw deployment — only the public research mirror artifacts.
- **Not a general AI research aggregator.** Papers should be relevant to the specific frameworks documented here (GNW, GRAO, TPG, Clawstr).

---

## Questions and Discussion

- Open a GitHub Issue to ask about the framework design, propose new research directions, or flag a doc inconsistency
- Reference specific files and line numbers where possible
- For GRAO loop analysis, reference the specific round artifact (e.g., `round_40_2026-05-10.json`)

---

*Remnant Research — from theory to deployment.*
