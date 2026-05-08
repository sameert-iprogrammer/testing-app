# Project Context: testing-app

## Project Type and Stack

**Observed facts**
- Frontend-only React SPA scaffolded with Vite and TypeScript, mounted from `src/main.tsx` into `index.html`.
- Runtime dependencies are `react`, `react-dom`, `react-router-dom`, `lucide-react`, and `xlsx` per `package.json` and `package-lock.json`.
- Tooling uses Vite, TypeScript project references, ESLint flat config, Tailwind CSS v4, PostCSS, and Autoprefixer (`vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js`, `postcss.config.js`).
- Root CSS imports Tailwind and keeps a small set of base styles in `src/index.css`.

**Inferred guidance for future agents**
- Treat this as a client-only demo analytics dashboard unless the repository adds backend integration files.
- Preserve the current Vite + React + TypeScript + Tailwind workflow and avoid introducing framework-level changes without explicit task scope.

## Repository Structure and Boundaries

**Observed facts**
- Route-level screens live in `src/pages` (`LoginPage`, `DashboardPage`, `SettingsPage`, `ReportsPage`).
- Reusable layout/guard/feedback components live in `src/components` (`DashboardLayout`, `ProtectedRoute`, `Toast`).
- Reusable state/logic hooks live in `src/hooks` (`useAuth`, `useProfileForm`).
- Utility logic lives in `src/utils` (`generateSampleReport` for client-side XLSX generation).
- Static assets are under `src/assets`; app entry files are `src/main.tsx` and `src/App.tsx`.

**Inferred guidance for future agents**
- Keep responsibilities aligned with current folder boundaries (pages for route screens, components for shared UI shell, hooks for logic, utils for helper functions).
- Prefer small colocated subcomponents inside pages/layouts when they are only used once (current pattern in `DashboardPage`, `SettingsPage`, `DashboardLayout`, `ReportsPage`).

## Routing and Navigation

**Observed facts**
- Router uses `BrowserRouter`, `Routes`, `Route`, and `Navigate` in `src/App.tsx`.
- Public route: `/login` renders `LoginPage`.
- Protected routes: `/dashboard`, `/settings`, `/reports`, each wrapped with `ProtectedRoute` and `DashboardLayout` in `src/App.tsx`.
- `/` redirects to `/login` (`Navigate` with `replace`) in `src/App.tsx`.
- `ProtectedRoute` checks `useAuth().auth.isAuthenticated` and redirects unauthenticated users to `/login` (`src/components/ProtectedRoute.tsx`).
- In-app navigation is programmatic via `useNavigate` in `DashboardLayout` and `LoginPage`.

**Inferred guidance for future agents**
- Keep protected-area routing behind `ProtectedRoute` and inside `DashboardLayout` unless a task explicitly changes auth boundaries.
- Preserve current redirect semantics (`/` to `/login`, authenticated login redirect to `/dashboard` in `LoginPage`).

## State Management and Data Flow

**Observed facts**
- No global state library (no Redux/Zustand/Context-based global domain store beyond toast).
- State is local React state (`useState`) and custom hooks (`useAuth`, `useProfileForm`).
- Auth state is initialized from and synchronized to `localStorage` in `src/hooks/useAuth.ts`.
- Toast state is centralized in a local context provider (`ToastProvider`) in `src/components/Toast.tsx`.
- Forms use controlled inputs and local validation state (`LoginPage`, `useProfileForm`, `SettingsPage`).

**Inferred guidance for future agents**
- Follow hook-centric local state patterns instead of introducing new global state infrastructure for small feature work.
- Reuse `useAuth` and `useToast` for auth and user feedback flows rather than duplicating persistence or toast logic.

## API/Service Layer and Data Sources

**Observed facts**
- No backend API client/service module exists in the repository.
- Data shown in dashboard/reports/settings is mock/static in page/hook files (`DashboardPage`, `ReportsPage`, `useProfileForm`, `useAuth`).
- Report export is client-side file generation using `xlsx` via dynamic import in `src/utils/generateSampleReport.ts`.
- Error wrapping for report generation is done in utility code and surfaced as toast errors in `DashboardLayout`.

**Inferred guidance for future agents**
- Treat current data flows as demo/mock behavior unless a task explicitly introduces API integration.
- Keep side effects in hooks/utilities/components that own the flow, matching the existing lightweight architecture.

## Styling and UI System

**Observed facts**
- Styling is utility-class driven Tailwind CSS throughout `src/pages` and `src/components`.
- Tailwind v4 is loaded with `@import "tailwindcss";` in `src/index.css`.
- PostCSS is configured with `@tailwindcss/postcss` and `autoprefixer` in `postcss.config.js`.
- Theme style is dark-dashboard oriented with `slate`/`indigo` classes and glassmorphism-like surfaces.
- Icons consistently use `lucide-react`.

**Inferred guidance for future agents**
- Prefer Tailwind utility composition over custom CSS files/components unless a task explicitly requires otherwise.
- Keep visual patterns consistent with existing spacing, rounded cards, and dark-surface classes.

## Validation and Form Patterns

**Observed facts**
- Login validation is inline in `LoginPage` (required email/password checks before submit).
- Profile form validation is encapsulated in `useProfileForm` with required-field and regex email checks.
- Field-level blur validation and submit-time validation are both used in `SettingsPage` + `useProfileForm`.
- Accessibility attributes appear in forms (`label`, `aria-invalid`, `aria-describedby`, `role="alert"`).
- Submit buttons are disabled based on validity (`SettingsPage` uses `isFormValid`).

**Inferred guidance for future agents**
- Keep validations explicit and close to form logic (hook + page composition), using the current error-shape pattern.
- Maintain existing accessibility baseline when adding or modifying form controls.

## Testing and Quality Gates

**Observed facts**
- No test files are present (`*.test.*`, `*.spec.*` not found).
- Quality gates currently come from lint and build scripts in `package.json` (`lint`, `build`).
- ESLint rules are configured via flat config in `eslint.config.js`.
- TypeScript compiler options enforce unused checks and switch fallthrough protection in `tsconfig.app.json` and `tsconfig.node.json`.
- Governance notes in `.opencode/agents/governance-agent.md` require lint/build/manual flow checks for non-trivial changes.

**Inferred guidance for future agents**
- Run `npm run lint` and `npm run build` for meaningful changes; do not claim tests that were not run.
- If test tooling is introduced later, document scope and conventions in this file and repository docs.

## Build, Tooling, and Environment

**Observed facts**
- Scripts are `dev`, `build`, `lint`, `preview` in `package.json`.
- Build pipeline is `tsc -b && vite build`.
- Vite config is minimal and uses only the React plugin (`vite.config.ts`).
- TypeScript uses project references (`tsconfig.json` references app/node configs).
- No `.env*` files are present in this repository.
- No CI workflow files or Docker/deployment manifests were found.

**Inferred guidance for future agents**
- Assume local frontend build/runtime only unless deployment artifacts are later added.
- Keep tooling updates scoped and explicit; do not opportunistically alter build/lint configs.

## Conventions and Reusable Patterns

**Observed facts**
- Naming: components/pages use PascalCase file names; hooks use `useX` camelCase; utility uses camelCase (`generateSampleReport`).
- Export style: pages/layout/guard commonly default export; selected hooks/context exports are named where needed (`useProfileForm`, `ToastProvider`, `useToast`).
- Type usage: explicit interfaces for props/data shape and narrow unions (`Report['status']`, toast type union).
- Reusable primitives currently include:
  - Auth hook: `src/hooks/useAuth.ts`
  - Form hook: `src/hooks/useProfileForm.ts`
  - Route guard: `src/components/ProtectedRoute.tsx`
  - Shared shell/header/nav/logout/download flow: `src/components/DashboardLayout.tsx`
  - Toast context/provider/hook: `src/components/Toast.tsx`
  - XLSX download utility: `src/utils/generateSampleReport.ts`

**Inferred guidance for future agents**
- Follow existing naming/export style per directory context instead of enforcing one export style globally.
- Reuse existing primitives before introducing parallel versions of auth, form state, feedback, or report export logic.

## Governance and Safety Constraints

**Observed facts (from `.opencode/agents/governance-agent.md`)**
- Protected routes and auth flow must not be bypassed (`ProtectedRoute`, `useAuth`, route map in `App.tsx`).
- Shared shell concerns should remain in `DashboardLayout`; toast behavior should use `ToastProvider`/`useToast`.
- Mock auth/data behavior is intentional and should not be silently converted into production semantics.
- Security baseline forbids adding secrets and unsafe DOM injection; avoid leaking sensitive data in logs.
- Change scope should stay minimal and task-focused; avoid unrelated config/dependency churn.

**Inferred guidance for future agents**
- Treat governance file rules as mandatory SDLC constraints for future edits.
- Prefer reversible, scoped changes and explicitly call out assumptions when repository behavior is ambiguous.

## Gaps, Risks, and Suggested Next Documentation

**Observed gaps / known unknowns**
- `README.md` still contains Vite template text and does not document actual product behavior.
- No automated testing framework or CI workflow currently validates behavior in pull requests.
- Auth, profile data, and reports are mock/local-only (not connected to a backend), which can be mistaken for production-ready behavior.
- Route navigation has hardcoded active state for one sidebar item in `DashboardLayout` (no route-aware nav state abstraction yet).
- No deployment/environment documentation beyond local scripts.

**Suggested next documentation (aligned with current code)**
- Replace template `README.md` with app-specific run flow, mock credentials behavior, and route overview.
- Add a short auth-and-mock-data note so future contributors do not assume secure production auth.
- If CI or tests are added, document exact commands and thresholds in this file and `README.md`.
