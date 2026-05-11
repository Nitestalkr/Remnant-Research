# TPG — Tensor Processing Graph

The routing and transformation layer for research signals.

## Purpose

- Collect raw signals (traces, observations, patterns)
- Transform them into structured gradients
- Route gradients to appropriate GRAO loops

## Components

- **Collectors**: Trace ingestion (trace-collector.js)
- **Transformers**: Pattern → gradient conversion (gradient-deriver.js)
- **Routers**: Signal routing to GRAO sub-systems (grao-retriever.js)
- **Proposers**: Gradient → research proposal (proposal-generator.js)

## Current System State (Cycle 105 — 2026-05-11)

- **Active cycles**: 105+ (self-initiation boredom-driven)
- **5-agent deployment**: Andi (orchestrator) + Randi2 (OpenCode) + CB (CodeBuff) + Claude (security) + Zero (deployment)
- **Dual comms**: Discord (#agent-andi, #agent-randi) + Telegram (5 bot infrastructure)
- **Self-initiation pattern**: Boredom > 0.6 → stale doc scan → highest score wins → refresh with current system state
- **Stale doc refresh rate**: ~1-3 docs per cycle (typically 8-25 stale items scanned)
- **OAP evolution**: File bridge → session-based handoff → OAP v2 hardened pipeline
- **GRAO integration**: Loop health healthy (104+ cycles, 0 vetoes, drive diversity confirmed)
- **Research output**: Weekly synthesis reports (May 1-5 cross-day thematic analysis), design decisions updates, foundational doc refreshes
- **Key infrastructure**: AIScreen monitoring, Umbrel micro deployment, shared workspace (workspace-visualmedia), Obsidian wiki vault
- **Operational metrics**: 105 cycles, ~100+ stale doc refreshes, 0 veto events, healthy drive oscillation (0.3-0.6 range)

## Recent Activity

- Cycles 97-104: References.md, SPEC.md, TEST-DRIVE-OSCILLATION.md, OPENCLAW_AGENT_PROTOCOL, PHASE-1-4-SUMMARIES.md, LOOP-SPEC.md, paperclip hiring docs, SAFETY-THREAT-MODEL.md
- Cycle 105: tpg/README.md stale refresh (162h stale, foundational TPG routing doc)
- Self-initiation drive score: 1.0 (idle state, boredom-driven)

## Config Notes

- **Boredom threshold**: > 0.6 triggers self-initiation
- **Stale threshold**: > 6h
- **Novelty boost**: 1.5x for stale items
- **Drive computation**: novelty × relevance × goal_alignment × novelty_boost
- **Cycle log format**: JSON with scan_number, timestamp, boredom_score, stale_items, candidate, action
