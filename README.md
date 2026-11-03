# Meals Planned

Plan lunch and dinner with the ingredients you already have.

- [Product requirements](docs/Meal-Planner-V1-PRD.md)
- [System design](docs/Meal-Planner-V1-System-Design.md)
- [Branded screens](docs/design/Meals-Planned-Stitch.png)
- [Stitch project](https://stitch.withgoogle.com/projects/14274819275338680925?pli=1)

## Local development

Use Node.js 22.12 or newer and npm. Run these commands from the repository root.

- `npm ci` installs the locked dependencies.
- `npm run dev` starts the web app and prints its local address.
- `npm test` builds the API and runs the handler tests.
- `npm run synth` builds the API and infrastructure, then synthesizes the stack locally. The Lambda asset includes the compiled handler and an ES module manifest.
- `npm run check` runs the full workspace checks.

See [the changelog](CHANGELOG.md) for progress. The next milestone is the guest ingredient-to-meal screen based on the approved Stitch designs.

## Workspace checks

The web app lives in `apps/web`, the Lambda handler in `apps/api`, shared planning logic in `packages/planner`, and CDK infrastructure in `infra`. Run `npm ci` followed by `npm run check` to compile all workspaces, exercise the health handler, and synthesize the HTTP API and Lambda stack locally. The GitHub workflow runs the same checks on pushes and pull requests.
