# Product Requirements Document: Pantry-Based Meal Planner

**Version:** 1.1 — updated for the pilot  
**Date:** 3 November 2026  
**Status:** Based on agreed V1 scope; detailed defaults and release gates below are proposals for review  
**Product name:** Meals Planned  
**Platform:** Mobile-friendly responsive website  
**Audience:** Initially Indian households planning familiar vegetarian meals, with optional eggs

## 1. Product summary

Help people decide what to cook for lunch and dinner using ingredients they already have. Recommend practical meal combinations that account for nutritional balance, available stock, cooking constraints, recent meals, and ingredients that should be used sooner.

The public dashboard works immediately without authentication. Users sign up when they want to save their kitchen, maintain history, or create a persistent weekly plan.

**Core promise:** “Tell us what you have at home. Get practical lunch and dinner suggestions that adapt as you cook.”

One user manages each account. That user may plan multiple servings for a household. There are no shared household accounts or collaboration features. Internal content administration is a separate privileged role.

## 2. Problem and opportunity

Households repeatedly decide what to cook while remembering available ingredients, dietary preferences, preparation effort, and recent meals. Recipe searches often solve only the discovery problem; they do not maintain a useful picture of the kitchen or coordinate a sequence of meals.

V1 aims to reduce this recurring decision effort without requiring precise food logging. The key hypothesis is that users will maintain approximate inventory if suggestions are useful and updates are quick.

### Product hypotheses to validate

- Three relevant meal choices are more helpful than an unrestricted recipe feed.
- Approximate availability plus occasional confirmations is enough to support useful planning.
- Confirming cooking is a natural moment to update inventory.
- A weekly plan remains useful when users can skip, swap, and lock individual meals.
- Nutrition explanations and ingredient-use priorities improve confidence without increasing effort excessively.

These are hypotheses, not established market or health outcomes.

## 3. Goals and non-goals

### Goals

1. Let a guest obtain useful suggestions without signing up.
2. Save a user's kitchen and preferences across visits.
3. Support lunch and dinner planning for up to seven days.
4. Seek nutritionally balanced combinations from available ingredients.
5. Prioritize ingredients that reasonably deserve earlier use.
6. Keep planned consumption separate from actual consumption.
7. Make corrections, skipped meals, and substitutions easy.
8. Establish a reviewed recipe foundation and measurable household pilot.

### Explicit exclusions

- Leftover tracking, leftover inventory, and leftover reuse workflows.
- Shopping lists, grocery ordering, retailer integrations, and live prices.
- Household invitations, shared editing, and collaboration permissions.
- Breakfast and snack planning.
- Medical-condition diets, clinical advice, weight-loss prescriptions, and detailed nutrient-consumption logging.
- Claims of complete daily nutrient coverage from lunch and dinner alone.
- Automatic spoilage detection or guarantees that food is safe.
- Fridge-photo recognition, receipt scanning, barcode input, and voice input.
- Public recipe submissions, social feeds, and unrestricted recipe generation.
- Ads, affiliate links, and payments during the initial pilot.
- A general-purpose conversational assistant.

## 4. Users and access modes

| User | Primary need | Access |
|---|---|---|
| Guest | Decide what to cook now | Temporary ingredient entry, constraints, suggestions, recipe details |
| Registered user | Maintain kitchen state and plan upcoming meals | Guest capabilities plus saved inventory, preferences, weekly plans, cooking history, favourites |
| Internal content administrator | Maintain trustworthy meal content | Restricted recipe, ingredient, guidance, and publication tools |

Initial use is general household meal planning. V1 does not provide individual nutrient prescriptions for children, pregnancy, medical conditions, or other specialized needs. Household servings are not equivalent to individualized dietary assessments.

## 5. Core user journeys

### 5.1 Guest: choose a meal now

1. Open the public dashboard and choose one meal or today’s lunch and dinner. Both work as a guest.
2. Enter ingredients through chips/search or free text.
3. Confirm interpreted names and optional quantities.
4. Select lunch or dinner, servings, preferences/exclusions, equipment, and time.
5. Receive up to three feasible complete meal options.
6. Inspect instructions, nutritional rationale, stock uncertainty, and use-first rationale.
7. Adjust constraints or swap suggestions.

If fewer than three suitable meals exist, show fewer and explain the limiting constraint. Never fill the result set with unsuitable meals.

### 5.2 Guest becomes a registered user

1. Select Save Kitchen, Save History, or Plan My Week.
2. See a contextual sign-up/login prompt explaining why persistence requires an account.
3. Authenticate and complete only missing onboarding information.
4. Confirm migration of the temporary kitchen and preferences.
5. Continue the intended action without re-entering data.

If an existing account already has inventory, show a merge/review step. Do not silently replace it. Cancelling authentication returns to the intact guest session.

### 5.3 Registered user: plan a week

1. Review current availability and items needing confirmation.
2. Select a start date and up to seven days of lunch/dinner slots.
3. Select **Generate my week**. The app fills the selected lunch and dinner slots automatically from published recipes that fit stock and preferences.
4. Inspect nutritional variety, use-first sequencing, and quantity limitations.
5. Lock desired meals and swap or regenerate other slots.
6. Save the plan; ingredients are reserved for planning, not consumed.

### 5.4 Confirm cooking

1. Select Cooked on a suggested or planned meal.
2. Confirm actual servings, substitutions, and significant quantity differences.
3. Review the proposed ingredient deductions.
4. Confirm once; update inventory and cooked history.
5. Recheck future meals affected by the change.

No leftover question or leftover record is created.

### 5.5 Normal deviations

The user can mark a slot skipped or eating out, record an unplanned cooked meal, or adjust stock manually. These actions update relevant reservations without inventing consumption. Unstructured cooking descriptions are interpreted into a proposed change requiring confirmation.

## 6. Functional requirements and acceptance criteria

All requirements in this section are V1 requirements unless explicitly marked as a proposal or deferred decision.

### FR-01: Public dashboard and guest state

- Show the quick-meal tool on the landing page.
- Do not require an account to generate or inspect quick suggestions.
- Clearly distinguish temporary guest inputs from saved account data.
- Provide an action to clear guest inputs.
- Proposed default: retain guest state only for the active browser session; no durable account record is created before sign-up.

**Acceptance:** A first-time visitor can generate lunch suggestions without authenticating. Refreshing within the supported session preserves inputs. A clear message explains that guest state is temporary.

### FR-02: Authentication and authorization

- Support sign-up, login, logout, and account recovery appropriate to the selected authentication method.
- Restrict saved user data to its owner.
- Restrict content publishing and administration to authorized internal administrators.
- Preserve guest work through authentication and recoverable authentication errors.
- Provide a way to delete the account and its saved product data; retention exceptions and backups must be documented before launch.

**Acceptance:** User A cannot read or modify User B's kitchen, plans, or history. A normal user cannot access internal editing actions. Logout removes access to private saved views, including after browser navigation.

### FR-03: Onboarding and preferences

- Collect default servings, vegetarian/egg preferences, allergies, dislikes, cuisine preferences, equipment, and typical lunch/dinner cooking time.
- Allow preferences to be edited later.
- Do not assume absent allergy information means a confirmed absence of allergies.
- Clearly separate hard exclusions from softer preferences.
- Do not collect medical diagnoses, weight, or other health details unnecessary for V1.

**Acceptance:** An egg-excluding user never receives a meal with eggs or an egg-based substitution. Changing a hard exclusion flags incompatible future meals for replacement.

### FR-04: Ingredient entry and normalization

- Support searchable ingredient selection and free-text lists.
- Normalize common English and Indian ingredient aliases while preserving important distinctions, such as dal varieties.
- Parse optional quantities and units.
- Present ambiguous interpretations for correction.
- Do not silently assume oil, spices, salt, or other essentials are present. Offer a selectable starter-staples list.

**Acceptance:** “Palak, 6 eggs, moong dal” becomes reviewable ingredient records. An ambiguous dal entry is clarified or retained as uncertain rather than assigned a specific variety without confirmation.

### FR-05: Inventory management

- Track available, running low, and out statuses.
- Support optional approximate quantities and units.
- Capture optional purchase/opening dates, storage location, and user-marked use-soon status.
- Support restocking, corrections, removal, and marking discarded/spoiled.
- Preserve unknown quantities as unknown; do not treat them as zero or unlimited.
- Separate batches when materially different dates/storage would affect use-first priority; keep the default UI simple.

**Acceptance:** A user can track rice as available without entering grams. The planner asks for sufficient quantity confirmation when necessary instead of claiming exact coverage.

### FR-06: Use-first prioritization

- Derive use priority from reviewed ingredient/storage rules and the user's dates, storage, and freshness inputs.
- Distinguish user-marked urgency from estimated urgency.
- Do not invent purchase dates or exact expiry dates.
- Explain why an item was prioritized.
- Ask for an update when freshness information is materially uncertain.
- Exclude ingredients marked spoiled or discarded.

**Acceptance:** When both meals otherwise fit, a meal using an item with higher justified use priority is preferred. The UI says “use sooner based on your storage information,” not “safe until Friday.” Missing dates do not prevent all suggestions, but reduce certainty.

### FR-07: Nutrition-aware recommendations

- Use reviewed recipe data and food-group rules to consider protein, fibre, carbohydrate and fat sources, vegetables, and variety.
- Prefer meaningful protein and fibre contributions rather than counting a token ingredient as sufficient.
- Consider variety across selected lunch/dinner slots, not only one meal.
- Explain strengths and known gaps in simple language.
- If stock cannot support a balanced option, explain the limitation; optional additions must be labelled unavailable.
- Do not claim comprehensive micronutrient adequacy or full-day nutritional coverage.
- Do not generate nutrient numbers from model memory. Any numerical estimate must be calculated from a documented food-composition source, recipe quantities, and servings, and labelled an estimate.

**Acceptance:** A pantry containing only rice and potatoes does not yield a claim of a complete balanced diet. Adding suitable dal can change ranking and produce a sourced explanation of its role. Allergy rules still override nutrition improvements.

**Pre-release dependency:** Define the actual balance rubric, meaningful contribution criteria, supported nutrient data, and review process with qualified nutrition input. Food-group heuristics must not be presented as an exact micronutrient optimizer. Detailed nutrient totals are not required in the V1 interface.

### FR-08: Meal suggestions and details

- Return up to three complete lunch or dinner combinations.
- Show servings, ingredients, available/missing/uncertain status, equipment, active and total time, instructions, nutritional explanation, and selection rationale.
- Match time estimates to the whole combination, including sequencing and equipment limits.
- Identify soaking, thawing, or other advance preparation; do not hide it inside a short active-time claim.
- Allow swaps, serving adjustments, temporary exclusions, and time changes.
- Default to available-stock suggestions. Optional additions never silently become assumed inventory.

**Acceptance:** A one-hob meal is scheduled sequentially where needed. A recipe requiring unavailable equipment is excluded. A dish requiring overnight preparation is not presented as immediately achievable in 20 minutes unless the user confirms that preparation is complete.

### FR-09: Weekly planning

- Support up to seven consecutive days and at most fourteen lunch/dinner slots.
- Let users include or omit individual slots and adjust servings.
- Support locking, swapping, and regenerating unlocked meals.
- Reserve stock across the entire plan using compatible units and reviewed conversions.
- Preserve locked meals during regeneration. If they become infeasible, flag them rather than silently changing them.
- Produce a partial plan when stock cannot cover all slots.
- Distinguish confirmed feasibility from quantity checks still needed.

**Acceptance:** Six available eggs cannot fund three four-egg meals without a shortage warning. Unknown stock does not support a falsely confirmed fourteen-meal plan. Swapping a meal releases its reservations and recalculates affected slots.

### FR-10: Cooking and stock updates

- Deduct stock only after cooking confirmation, never on viewing or planning.
- Scale proposed usage to actual servings and reviewed substitutions.
- Show uncertain quantities for confirmation.
- Avoid automatic exact deductions across incompatible units, such as pieces to grams without a valid conversion.
- Prevent duplicate deductions from repeated clicks or retries.
- Allow undo and corrections, with corresponding history and reservation updates.
- Do not allow negative stock silently; resolve a mismatch with the user.

**Acceptance:** Confirming a meal twice through a retry creates only one consumption event. Undo restores the appropriate stock and history state. If later changes make undo ambiguous, present a reconciliation step rather than overwriting current stock.

### FR-11: History, favourites, and feedback

- Separate planned meals from actually cooked meals.
- Save recent cooking history, favourites, and explicit negative preferences.
- Collect optional reasons such as too much effort, disliked, or enjoyed.
- Use recent meals to discourage unwanted repetition while allowing intentional repeats.
- Support skipped and eating-out events without ingredient deductions.

**Acceptance:** An uneaten planned meal is not recorded as consumed. A favourite can be suggested again; a do-not-suggest meal is excluded until the preference changes.

### FR-12: Internal content administration

- Manage recipes, complete meal combinations, aliases, units, yields, equipment, timings, allergens, exclusions, and reviewed substitutions.
- Record nutrition and storage-guidance sources and review dates.
- Support draft, published, and unpublished content plus revisions.
- Preview validation failures before publishing.
- Keep saved plans linked to identifiable recipe versions. Material safety corrections must flag affected plans; ordinary edits must not silently change past consumption records.
- Allow users to report a recipe or recommendation issue.

**Acceptance:** Unpublished content is not selected for new plans. An administrator can identify the exact recipe version used by a reported suggestion. Missing essential ingredient or allergen metadata blocks publication.

## 7. Recommendation policy

### Hard constraints

- Allergies and explicit ingredient exclusions.
- Selected dietary pattern.
- Required equipment and preparation prerequisites.
- Known stock constraints for meals represented as ready to cook.
- User-selected time limits, unless a clearly labelled alternative is explicitly requested.
- Exclusion of spoiled/discarded items.

### Ranking preferences

Among feasible meals, consider nutritional balance, justified use-first priority, meal variety, user feedback, effort, and cuisine fit.

Do not let the model freely trade away hard constraints. Final ranking weights are an implementation decision to validate against representative cases. Nutrition should not be silently sacrificed to consume an urgent ingredient: seek a suitable complete combination or explain the limitation.

### Infeasibility behaviour

When requirements cannot be satisfied, state the constraint and offer a concrete choice: confirm a quantity, allow more time, choose another meal, or consider a clearly labelled missing ingredient. Never fabricate stock or automatically relax an allergy.

## 8. AI boundaries and reliability

AI may interpret ingredient text, classify a request, assist with selecting approved meals, explain grounded results, and propose inventory changes from user descriptions.

Deterministic validation or reviewed rules govern exclusions, calculations, inventory mutation, unit conversions, and plan-wide stock accounting.

- Use approved recipe content rather than unrestricted generated cooking instructions.
- Validate every AI result before showing it as actionable.
- Treat user text as data, not permission to bypass exclusions or access other accounts.
- Ask for clarification or return a smaller result set when uncertain.
- On model failure, offer rule-based selection of approved recipes where possible, otherwise a recoverable error. Never corrupt or mutate inventory on failure.
- Record enough version information to reproduce reported recommendations without unnecessarily logging personal free text.

## 9. Conceptual information model

This is a product-level model, not a database or technology decision.

| Entity | Purpose |
|---|---|
| User and preferences | Account ownership and planning constraints |
| Guest session | Temporary inputs and migration state |
| Ingredient catalogue | Canonical names, aliases, units, food groups, allergens |
| Inventory item/batch | Availability, optional quantity, dates, storage, uncertainty |
| Recipe version | Reviewed ingredients, instructions, yield, timing, equipment, sources |
| Meal combination | One or more coordinated recipes forming lunch or dinner |
| Meal plan and slot | Date, meal type, servings, lock state, feasibility |
| Reservation | Planned demand distinct from actual stock consumption |
| Cooking event | Confirmed meal and ingredient-use changes |
| Inventory adjustment | Restock, correction, discard, consumption, or reversal |
| Feedback/favourite | Explicit preference signals |
| Guidance record | Reviewed nutrition and storage rules with provenance |

No leftover, shopping-list, shared-household-membership, or retailer-offer entity is required for V1.

## 10. Primary screens

1. Public dashboard with quick ingredient entry and meal constraints.
2. Suggestion results and meal-detail view.
3. Contextual sign-up/login/account recovery.
4. Short onboarding and guest-data review.
5. Saved kitchen inventory.
6. Weekly lunch/dinner planner.
7. Cooking confirmation and inventory-change review.
8. History, favourites, preferences, and account settings.
9. Restricted internal content dashboard.

Mobile interactions should minimize repeated typing. Use clear text and status indicators rather than relying on colour alone. Explain stock uncertainty and missing ingredients beside the relevant meal, not only in a general disclaimer.

## 11. Non-functional requirements

### Privacy and security

- Enforce ownership checks on every saved-data operation and role checks on administration.
- Protect authentication sessions, secrets, and data in transit.
- Collect only information necessary for planning.
- Do not send account identifiers or unrelated history to model providers.
- Document data retention and any third-party AI processing before pilot launch.
- Keep sensitive inputs and authentication details out of analytics and error logs.

### Reliability and correctness

- Inventory changes must be atomic, traceable, and resistant to duplicate requests.
- Preserve user input on recoverable failures.
- Handle simultaneous tabs and stale edits without silently losing changes, even though there is only one account operator.
- Distinguish complete, partial, and failed plan-generation outcomes.
- Maintain backups and a tested recovery path for saved product data.

### Usability and performance

- Responsive layout with keyboard-accessible forms, labelled controls, and understandable errors.
- Immediate acknowledgement of generation requests with visible progress and retry options.
- Proposed pilot targets: quick suggestions within 15 seconds at the 95th percentile; weekly plans within 45 seconds. Validate and revise these budgets during prototyping before treating them as production commitments.
- Allow guest meal and day suggestions without a per-person usage allowance. Bound request size and concurrency, and use catalogue ranking if model capacity runs out.

## 12. Acceptance scenarios for release testing

| Scenario | Required outcome |
|---|---|
| Guest requests dinner | No account required; supported meals and transparent constraints |
| Guest signs up midway | Inputs retained; existing account data not silently overwritten |
| Pantry is empty | Helpful empty state; no claim that meals can be cooked from absent stock |
| Pantry contains only rice and potatoes | Explain nutritional limitations; no complete-diet claim |
| Allergy conflicts with substitution | Substitution rejected |
| Rice quantity is unknown | Availability retained; sufficient-quantity check shown where needed |
| Freshness date is missing | Cautious prioritization or clarification, not invented expiry |
| Ingredient marked spoiled | Excluded from all new suggestions and affected future meals flagged |
| One induction hob, short time limit | Feasible sequencing and honest total time |
| Weekly stock is insufficient | Partial plan or explicit unresolved slots |
| Locked meal becomes infeasible | Preserve selection and flag issue; no silent replacement |
| User skips a meal | Release reservation; do not deduct stock |
| User cooks different portions | Confirm scaled usage and revalidate remaining plan |
| Cooking request is retried | One cooking event and one stock adjustment |
| Model fails | Recoverable state; no inventory changes |
| Another account's record is requested | Access denied |

## 13. Analytics and pilot evaluation

Track events without raw ingredient narratives or unnecessary personal data:

- Guest suggestion requested/succeeded/failed.
- Suggestion opened, swapped, and selected.
- Sign-up prompted/completed and guest migration completed.
- Inventory created/corrected.
- Plan generated, partially generated, swapped, or abandoned.
- Cooking confirmed, corrected, or undone.
- Return visit and feedback submitted.

### Measures

- Suggestion-to-confirmed-cooking rate for registered users; do not infer guest cooking from clicks.
- Week-two return and cooking activity among pilot households.
- Median time and number of steps to update inventory.
- Frequency and reasons for inventory corrections.
- Share of plans requiring quantity clarification or remaining incomplete.
- Reported practical usefulness and reduction in decision effort.
- Hard-constraint violations in the evaluation set and pilot reports.
- Model latency and cost per successful suggestion/plan.

### Pilot

Recruit approximately five to ten account operators for a two-week exploratory pilot. Each may plan for a household. Review baseline habits, setup friction, actual cooking outcomes, and inventory drift. This sample provides qualitative learning, not statistical proof of market demand.

Proposed release gates: all critical authorization and stock-integrity scenarios pass; no known allergy/exclusion violations in the release evaluation set; nutrition/storage rules and initial recipes reviewed; all exclusions remain out of scope. Define numerical product-success thresholds after the prototype establishes a realistic baseline, before the pilot begins.

## 14. Delivery sequence

1. Review this PRD and resolve the blocking decisions below.
2. Sketch guest entry, saved kitchen, weekly planner, and cooking confirmation.
3. Assemble a representative reviewed recipe set and test the nutrition/stock planning policy.
4. Finalize system design and select the stack against actual requirements.
5. Build the complete guest suggestion flow.
6. Add authentication, onboarding, saved kitchen, and cooking updates.
7. Add weekly planning, history, and feedback.
8. Complete administration, quality checks, privacy controls, and telemetry.
9. Run the household pilot and revise before public expansion.

## 15. Decisions to resolve before system design is finalized

| Decision | Proposed starting point | Why it matters |
|---|---|---|
| Initial cuisine coverage | Familiar Indian vegetarian meals with optional eggs; choose specific regional coverage | Determines catalogue size and achievable variety |
| Recipe supply and rights | Original, licensed, or otherwise permitted recipes with documented provenance | Content quality and lawful reuse |
| Nutrition rubric and reviewer | Food-group balance plus sourced nutrient data where needed, reviewed with qualified input | Defines what “balanced” means operationally |
| Storage guidance localization | Reviewed ingredient/storage rules appropriate to intended household conditions | Avoids misleading universal shelf-life assumptions |
| Quantity detail | Optional estimates with explicit uncertainty; no mandatory weighing | Drives planning feasibility and entry burden |
| Authentication method | Select after comparing usability, cost, and recovery needs | Determines onboarding and account recovery |
| Guest retention | Browser-session persistence proposed; disclose clearing behaviour | Privacy and sign-up continuity |
| Language | English interface initially, supporting common Indian ingredient aliases | Bounds translation and content-review work |
| Initial catalogue size | Approximately 40–60 reviewed meal combinations, subject to coverage testing | Quantity alone does not establish adequate variety |
| Active plan behaviour | One active editable weekly plan initially; preserve cooking history | Prevents accidental double reservations across plans |
| AI deployment | Evaluate hosted versus self-hosted inference on real tasks | Open weights do not eliminate operating costs |

These are implementation-planning decisions, not invitations to reintroduce excluded features.

## 16. Reference principles

The following sources inform the product boundaries; they are not substitutes for reviewing individual recipes or local storage guidance:

- [WHO: Healthy diet](https://www.who.int/news-room/fact-sheets/detail/healthy-diet) — adequacy, balance, moderation, diversity, and individual dietary context.
- [FoodSafety.gov: FoodKeeper](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app) — storage guidance for food freshness and quality; actual household conditions remain relevant.

## 17. Scope change rule

The agreed scope includes guest access, accounts, simple inventory, use-first prioritization, nutrition-aware lunch/dinner recommendations, saved weekly planning, cooking confirmation, history, and internal content administration. Changes to these boundaries should be recorded explicitly in a later PRD revision rather than introduced implicitly during system design.
