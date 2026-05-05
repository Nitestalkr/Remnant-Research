# TPG-GRAO — Gradient-Driven Research Optimization

## Overview

TPG (Tensor Processing Graph) + GRAO (Gradient-Driven Research Optimization) is a framework for systematic research evolution through gradient-based pattern analysis.

### Core Concepts

- **Gradients**: Directional signals derived from pattern analysis across research traces
- **TPG**: The processing graph that routes, transforms, and accumulates these signals
- **GRAO**: The optimization loop that uses gradients to drive research direction

## Structure

```
tpg-grao/
├── README.md              # This file
├── tpg/                   # Tensor Processing Graph
│   ├── README.md
│   ├── architecture.md
│   └── routing/           # TPG routing rules
├── grao/                  # GRAO optimization loop
│   ├── README.md
│   ├── gradient-derivation.md
│   ├── loops/             # GRAO cycle logs
│   └── experiments/       # GRAO experiment results
├── traces/                # Raw research traces
│   └── .gitkeep
├── gradients/             # Computed gradients
│   └── .gitkeep
├── proposals/             # Research proposals generated
│   └── .gitkeep
├── reports/               # GRAO cycle reports
│   └── .gitkeep
└── scripts/               # GRAO tooling
    ├── trace-collector.js
    ├── gradient-deriver.js
    ├── grao-retriever.js
    └── proposal-generator.js
```

## Status

Phase 1 — Skeleton

## Key Docs

- `tpg-grao-roadmap.md` — Full roadmap
- `tpg-openclaw.md` — TPG architecture
- `textual-gradients.md` — Gradient computation methodology
- `grao-memory.md` — Memory integration
