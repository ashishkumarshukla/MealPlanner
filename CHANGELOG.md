# Changelog

## Unreleased

### 2026-11-03

- Collected the product requirements, system design, and approved branding under `docs/`.
- Established a TypeScript workspace with a React/Vite web entry point.
- Completed the API, shared planner, and CDK workspaces. Added a health-route smoke test, local infrastructure synthesis, CI checks, and a rule to deliver all affected layers together.
- Restricted the Lambda deployment asset to its handler and module manifest. Standalone test and synth commands now build their required workspaces first.

- Added the guest ingredient-entry, suggestions and recipe-detail UI with local samples and desktop/mobile browser coverage.

- Completed guest preview controls for meal/day planning, weekly sign-in context, use-first preferences, ingredient exclusions, session persistence and clearing.

- Connected guest meal suggestions to a public HTTP endpoint and shared catalogue rules, with local fallback when the service is unavailable.

- Added scaled recipe amounts, unknown-stock labels and active/total time. Updated the desktop guest layout, session-retention copy and singular serving labels after QA.
- Recognize quantity-prefixed ingredients, keep arbitrary ingredient names removable, and clarify the serving-size stock check. Run desktop and mobile guest tests in CI.
