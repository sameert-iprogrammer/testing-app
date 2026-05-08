# Governance AI Agent - testing-app

## Project Type and Technology Assumptions

- This repository is a **frontend-only single-page application (SPA)** built with **React + TypeScript + Vite**.
- Routing uses `react-router-dom` with route protection via `ProtectedRoute`.
- Styling uses **Tailwind CSS v4** (`@import "tailwindcss"`, PostCSS plugin `@tailwindcss/postcss`).
- Linting uses ESLint flat config with `@eslint/js`, `typescript-eslint`, `react-hooks`, and `react-refresh`.
- Build pipeline is:
  - `npm run dev` -> Vite dev server
  - `npm run build` -> `tsc -b && vite build`
  - `npm run lint` -> `eslint .`
- Current app behavior indicates a **mock/demo auth and data setup** (`localStorage`, hardcoded credentials, mock reports/profile values). Treat this as intentional unless explicitly asked to productionize.

## Code Quality Rules

- Use **TypeScript strictness by discipline**:
  - No `any` unless explicitly justified in code comments.
  - Preserve existing type-first patterns (`interfaces`, typed function signatures, typed unions).
- Keep components and hooks focused:
  - UI rendering in `components/` and `pages/`.
  - Reusable state/business logic in `hooks/`.
  - Pure utility logic in `utils/`.
- Preserve lint-clean code:
  - New code must pass `npm run lint`.
  - Do not add lint-disable comments unless unavoidable and narrowly scoped.
- Prefer small, incremental changes over broad rewrites.
- Maintain existing conventions for naming and exports:
  - `PascalCase` for React components/pages.
  - `camelCase` for hooks/utilities.
  - Keep default exports where that file already uses them.

## Architecture Rules

- Respect current route structure in `App.tsx`:
  - Public route: `/login`
  - Protected area: `/dashboard`, `/settings`, `/reports`
  - Default redirect from `/` to `/login`
- Do not bypass `ProtectedRoute` for authenticated sections.
- Keep auth access centralized through `useAuth`; do not duplicate auth-state storage logic across pages.
- Shared shell/layout concerns belong in `DashboardLayout`; avoid re-implementing top navigation/side navigation per page.
- Cross-cutting feedback/toast behavior must use `ToastProvider` / `useToast`, not ad-hoc alert implementations.

## Security Rules

- Never introduce real secrets, API keys, passwords, tokens, or private credentials into source files.
- Do not log sensitive user information to console.
- If adding network calls in future:
  - Use HTTPS endpoints only.
  - Validate and sanitize any untrusted input before render/use.
  - Handle errors without leaking internal details.
- Treat current `useAuth` implementation as mock-only:
  - Do not represent localStorage-only auth as secure production auth.
  - Any production auth migration must be explicit, scoped, and reviewed.
- Avoid unsafe DOM injection patterns (`dangerouslySetInnerHTML`) unless explicitly required and sanitized.

## Testing Expectations

- There is currently no formal test suite in this repository.
- For every non-trivial change, future agents must at minimum:
  - Run `npm run lint`.
  - Run `npm run build`.
  - Perform a quick manual flow check relevant to changed routes/features.
- When adding new logic-heavy utilities or hooks, prefer adding automated tests if test tooling is introduced.
- Do not claim test coverage that has not actually been executed.

## File/Folder Modification Rules

- Modify only files directly related to the requested task.
- Keep folder responsibilities intact:
  - `src/pages/` for route-level screens.
  - `src/components/` for reusable UI/layout elements.
  - `src/hooks/` for reusable state/logic hooks.
  - `src/utils/` for utility functions.
- Do not rename/move files unless required by the task and documented in the change notes.
- Do not alter build/lint/tooling config files (`vite.config.ts`, `eslint.config.js`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`) unless the task explicitly requires it.
- Do not introduce unrelated assets, scripts, docs, or scaffolding.

## Dependency Usage Rules

- Reuse existing dependencies first (`react`, `react-router-dom`, `lucide-react`, `xlsx`, Tailwind toolchain).
- Adding new dependencies requires explicit task justification and impact awareness (bundle size, maintenance).
- Prefer dynamic imports only when they improve loading behavior or preserve existing patterns (e.g., `xlsx` usage).
- Do not change dependency versions opportunistically; only update when required by the task.

## Review Checklist (Must Pass Before Finalizing Changes)

- Task scope respected; no unrelated file changes.
- TypeScript compiles (`npm run build`) and lint passes (`npm run lint`).
- Route protections and navigation behavior still work.
- No secrets or unsafe auth/security regressions introduced.
- Accessibility basics preserved for modified interactive elements (labels, roles, aria attributes where needed).
- Mock/demo behavior remains consistent unless the task explicitly requests behavior changes.
- Any assumptions and limitations are clearly stated in final notes.

## Instructions for Future AI Agents

- Start by reading `package.json`, `eslint.config.js`, `vite.config.ts`, `tsconfig*.json`, and relevant `src/` files before editing.
- Infer and follow existing patterns; do not enforce personal style preferences.
- Keep diffs minimal and explain rationale in terms of user intent.
- If ambiguity exists, choose the safest reversible change or ask for clarification.
- Validate changes locally via lint/build before completion whenever possible.
- If an unexpected repository state or unrelated modifications appear, stop and ask the user how to proceed.

## Rules to Prevent Unsafe, Unnecessary, or Unrelated Changes

- Never perform destructive git operations (`reset --hard`, force-push, history rewrites) unless explicitly requested.
- Never refactor broad areas "for cleanup" without a direct requirement.
- Never bundle multiple concerns into one change when only one is requested.
- Never silently change auth semantics, route access rules, or persistence behavior.
- Never modify generated output directories (for example `dist/`) manually.
- Never introduce telemetry, tracking, or external data exfiltration.

