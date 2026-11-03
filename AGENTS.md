# Project workflow

For every project change, add or update a concise dated entry under Unreleased in CHANGELOG.md in the same change. Group related edits and describe their effect. Update the README when commands or setup change. Run npm run check before handing off code changes.

Deliver each change across all affected parts in the same unit of work. Before starting, identify the affected UI, API, shared logic, infrastructure, tests, and docs. For cross-layer features, implement and verify the full user journey together. For single-layer changes, limit edits to that layer and relevant checks. Apply the same scope rule to scaffolding. Record any unverified boundary at handoff.
