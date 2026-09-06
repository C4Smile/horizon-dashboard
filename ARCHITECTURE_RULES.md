# Architecture Rules For Agents (CLAUDE/CODEX)

Taken from the sito `apps/` rule set that wallet follows, with one deliberate
divergence: section 6. Wallet groups by kind (`components/`, `views/`,
`hooks/`); horizon-dashboard groups by feature. Everything else is unchanged.

## Scope

- This rule set applies to `horizon-dashboard`.
- The sibling projects it came from live under `sito-app/apps/`.

# ARCHITECTURE_RULES

## Mandatory Pre-Work

All coding agents (Codex, Claude, or any automated contributor) **must read this file before making any code change**.

---

## 1) Scope

- These architecture rules are mandatory for this project.
- Any new feature, refactor, or file move must follow this document.
- If an exception is needed, document it explicitly in the implementation notes/PR.

---

## 2) State Management and Data Flow

- Use `Context + Provider` patterns to avoid prop-drilling.
- Do not pass shared state through multiple component levels unless it is strictly local UI state.
- Each domain should expose a provider and a typed access hook when needed.
- Keep business logic out of presentational components.

---

## 3) Models and Domain Design

- Define explicit, typed models for domain entities.
- Keep model definitions centralized and reusable.
- Avoid ad-hoc object shapes spread across components.
- Validate incoming external data (API/local storage/imported JSON) before using it in views.

---

## 4) Manager Classes + Provider Access

- Use manager classes to encapsulate domain operations/state transitions.
- Managers should be instantiated and exposed through providers.
- Components must consume managers/state through provider APIs, not through direct global singletons.
- Keep side effects and orchestration inside managers/providers, not in UI leaf components.

---

## 5) Styling Rules (Tailwind + Global Theme)

- Use **Tailwind CSS** for component styling (`className` utilities in components).
- Define theme tokens/variables in `global.css`.
- Global CSS should be minimal and design-token oriented (colors, spacing tokens, typography scales, etc.).
- Do not replace Tailwind utility usage with large component-level custom CSS unless there is a strong reason.

---

## 6) Folder Structure (Required)

Group by feature, not by kind. A feature owns its api client, its dtos, its
screens and its components, so everything one entity needs is in one folder and
deleting the entity means deleting one folder.

```txt
src/
  app/            # bootstrap, routing, and the screens no feature owns
    views/        # Home, Account, Auth, NotFound
  features/       # one folder per domain entity
    <feature>/
      api/        # the entity's api client
      lib/        # the entity's dtos and types
      pages/      # the entity's list and form screens
      components/ # components only this feature uses
      index.ts    # the feature's public surface
  shared/         # everything used by more than one feature
    api/          # base client, manager, request plumbing
    components/
    hooks/
    lib/          # base dtos, shared types
    providers/
    utils/
    lang/
    styles/
```

Rules:

- A feature may import from `shared/`. A feature must not import from another
  feature except through that feature's `index.ts`.
- `shared/` must not import from `features/`. If shared code needs a feature's
  type, the type belongs in `shared/lib`.
- Anything used by two features moves to `shared/`. Anything used by one moves
  into that feature.
- `app/` wires the application together and owns the screens that belong to no
  single entity.

Documented exception (section 1 requires naming these):

- A handful of `shared/components` reach for `providers` and `layouts`, which
  live under `app/`. They need the api client and the entity navigation, and
  both are wired at the root. Closing it means those components taking what
  they need as props, or the library's own `useManager()` in place of the
  horizon wrapper. Until then, this is the one arrow pointing the wrong way.

## 7) Feature-Level File Structure (Mandatory)

When creating or refactoring hooks/components, use this per-feature structure:

```txt
FeatureName/
  FeatureName.tsx|ts   # Only one component or one hook per file
  constants.ts         # Constants only
  utils.ts             # Reusable helper functions only
  types.ts             # Type aliases and interfaces only
  index.ts             # Public exports
```

Rules:

- One hook per file (`useSomething.ts`).
- One component per file (`Something.tsx`).
- Do not declare reusable helpers/constants/types inside component or hook files.
- Move helper functions to `utils.ts`.
- Move constants to `constants.ts`.
- Move interfaces/types to `types.ts`.
- Keep support files as siblings of the hook/component they support.
- If a hook/component grows, create its own folder and expose public API via `index.ts`.
- Preserve existing public imports by re-exporting from local `index.ts` files.

---

## 8) Routing Conventions (Mandatory)

- Centralize app routes in one shared file (for example: `src/lib/routes.ts`) using constant objects (`as const`).
- Do not hardcode route strings in `navigate(...)`, `<Link to=...>`, `<Route path=...>`, menu config, or sitemap config.
- For dynamic routes and query-based routes, expose helper functions (for example: `getShipRoute(id)`).
- Centralize query parameter keys in route constants (for example: `RouteQueryParam`) and reuse them consistently.

---

## 9) i18n Rules

- Store translation resources in `lang/`.
- Avoid hardcoded user-facing strings in reusable components when i18n is expected.
- Keep translation keys consistent and domain-oriented.

---

## 10) Implementation Discipline

- Prefer clear boundaries: UI layer, provider layer, domain logic layer.
- Prefer small, composable modules over monolithic files.
- Keep APIs typed and explicit.
- New features must follow these rules unless an exception is documented in the implementation notes/PR.
