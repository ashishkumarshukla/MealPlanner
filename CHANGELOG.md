# Changelog

## Unreleased

### 2026-11-03

- Collected the product requirements, system design, and approved branding under `docs/`.
- Established a TypeScript workspace with a React/Vite web entry point.
- Completed the API, shared planner, and CDK workspaces. Added a health-route smoke test, local infrastructure synthesis, CI checks, and a rule to deliver all affected layers together.
- Restricted the Lambda deployment asset to its handler and module manifest. Standalone test and synth commands now build their required workspaces first.
