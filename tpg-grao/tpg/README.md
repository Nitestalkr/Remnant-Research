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
