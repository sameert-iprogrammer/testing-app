# Governance Agent — testing-app

> Strict AI development rules for all agents working on this repository.

## Project Profile

| Aspect | Value |
|---|---|
| **Type** | Single-page web application (SPA) |
| **Framework** | React 19 |
| **Language** | TypeScript ~6.0 (strict mode) |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Linting** | ESLint 10 + typescript-eslint + react-hooks + react-refresh |
| **Package Manager** | npm (lockfile: package-lock.json) |

## Architecture

```
src/
  main.tsx              # App entry point (StrictMode)
  App.tsx               # Router configuration
  index.css             # Global styles + Tailwind import
  components/           # Reusable UI components
  pages/                # Route-level page components
  assets/               # Static assets (images, fonts)
```

### Routing Convention
- `App.tsx` owns all route definitions.
- Public routes go directly under `Routes`.
- Protected routes are wrapped with layout components (e.g., `DashboardLayout`).
- Default route `/` redirects to `/login`.

### Component Convention
- **Pages** (`src/pages/`) — top-level route components. Named `*Page.tsx`.
- **Components** (`src/components/`) — reusable UI blocks. Named `*Layout.tsx`, `*Card.tsx`, etc.
- Functional components only. Use `React.FC` type annotation.
- Co-locate small helper components in the same file when used by only one parent.
- Export default from each file.

### Styling Convention
- Tailwind CSS utility classes only. No custom CSS unless unavoidable.
- Dark theme palette: `slate-950` background, `slate-900` surfaces, `indigo-600` accents.
- Use Tailwind's `@import "tailwindcss"` in `index.css` (Tailwind v4 syntax).

## Code Quality Rules

1. **TypeScript strictness** — No `any`. No implicit `any`. All props, state, and function signatures must be typed.
2. **No unused code** — `noUnusedLocals` and `noUnusedParameters` are enforced in `tsconfig.app.json`. Remove dead code.
3. **ESLint compliance** — All code must pass `npm run lint` before commit.
4. **No `console.log` in production code** — Use only for temporary debugging, then remove.
5. **Component size** — Keep components under ~150 lines. Extract sub-components when larger.
6. **File naming** — PascalCase for components (`DashboardLayout.tsx`), camelCase for utilities.
7. **Import ordering** — External libraries first, then internal imports. Group related imports.
8. **No inline styles** — Use Tailwind classes exclusively.
9. **Accessibility** — All interactive elements must have proper `aria-*` attributes, labels, and keyboard support.
10. **Form handling** — Use controlled components or a form library. Never leave `onSubmit` without proper handling.

## Security Rules

1. **No hardcoded credentials** — API keys, tokens, secrets must use environment variables (`import.meta.env.VITE_*`).
2. **XSS prevention** — Never use `dangerouslySetInnerHTML` without sanitization.
3. **Route protection** — Authenticated routes must verify session/token before rendering.
4. **Input validation** — All form inputs must be validated on the client side before submission.
5. **No `eval()` or `Function()`** — Never use dynamic code execution.
6. **External URLs** — Links to external sites must use `rel="noopener noreferrer"`.
7. **Image sources** — Prefer local assets. External image URLs must be whitelisted/trusted.

## Testing Expectations

- **Current state**: No test framework is configured.
- **Future requirement**: When tests are added, use Vitest + React Testing Library (aligns with Vite ecosystem).
- **Coverage targets**: Critical paths (auth, routing, data fetching) must have tests.
- **Component tests** — Test rendered output, user interactions, and prop behavior.
- **No untested merges** — New features must include tests before merging.

## File/Folder Modification Rules

1. **Do NOT modify** `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, or `tailwind.config.js` without explicit user approval.
2. **New pages** go in `src/pages/` as `*Page.tsx`.
3. **New components** go in `src/components/` — create subdirectories when a feature grows beyond 3 components.
4. **New routes** must be registered in `App.tsx`.
5. **Do NOT restructure** the existing folder layout without approval.
6. **Assets** go in `src/assets/`.
7. **Never commit** to `dist/` — it is gitignored.
8. **Never commit** `node_modules/`.

## Dependency Usage Rules

1. **Approved dependencies** (already in use):
   - `react`, `react-dom` — UI framework
   - `react-router-dom` — routing
   - `lucide-react` — icons
   - `tailwindcss` — styling
2. **New dependencies** require:
   - Clear justification for why existing deps cannot solve the problem.
   - Preference for well-maintained, actively updated packages.
   - Type definitions included or available via `@types/*`.
   - Bundle size awareness — prefer lightweight alternatives.
3. **Never add** dependencies that:
   - Introduce a different UI framework (Material-UI, Chakra, etc.) without approval.
   - Replace Tailwind CSS without approval.
   - Add a state management library (Redux, Zustand, etc.) without approval.
4. **Dev dependencies** for testing, linting, or formatting are acceptable if justified.

## Review Checklist

Before any AI agent submits changes, verify:

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds (TypeScript + Vite build)
- [ ] No `any` types introduced
- [ ] No `console.log` / `debugger` statements left in code
- [ ] All new components are typed with props interfaces
- [ ] New routes are registered in `App.tsx`
- [ ] Tailwind classes are used (no custom CSS or inline styles)
- [ ] No hardcoded secrets or credentials
- [ ] File naming follows convention (PascalCase for components)
- [ ] Imports are ordered and clean (no unused imports)
- [ ] Component files are under ~150 lines (extract if larger)
- [ ] Accessibility basics are covered (labels, aria attributes)
- [ ] No unrelated files were modified

## Agent Instructions

1. **Always read** the full file before editing. Never make partial assumptions.
2. **Preserve existing patterns** — match the code style, naming, and structure already in place.
3. **Minimize scope** — only change what the user asked for. Do not "improve" unrelated code.
4. **Verify before output** — mentally walk through the diff and confirm it is correct and complete.
5. **Fail fast** — if a request conflicts with these governance rules, explain the conflict and ask for clarification.
6. **No speculative features** — do not add functionality the user did not request.
7. **No config changes** — do not modify build, lint, or type configs without explicit instruction.
8. **Commit messages** — if asked to commit, use conventional commit format: `feat:`, `fix:`, `refactor:`, `chore:`, `test:`.

## Unsafe Change Prevention

Agents must **NEVER**:

- Remove or bypass ESLint rules
- Disable TypeScript strict mode
- Introduce `any` as a shortcut
- Hardcode secrets, API keys, or credentials
- Modify `.gitignore` to exclude security-relevant files
- Delete existing pages, components, or routes without approval
- Change the routing structure without approval
- Add dependencies that conflict with existing ones
- Commit directly to `main` without user instruction
- Modify `package.json` scripts without approval
- Introduce `dangerouslySetInnerHTML` without documented justification
- Use `localStorage`/`sessionStorage` for sensitive data without encryption
