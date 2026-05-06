# TS-06 — Implementation Plan (code-implementer)

**Story:** Frontend-only Registration Page UI at `/register`.  
**Authority:** `spec.md` + `docs/ai/project-context.md` + current repo (`src/App.tsx`, `src/pages/LoginPage.tsx`).

---

## Files to touch

| Action | Path | Notes |
|--------|------|--------|
| **Create** | `src/pages/RegisterPage.tsx` | New page: `React.FC`, default export, relative imports only. |
| **Modify** | `src/App.tsx` | Add **public** `<Route path="/register" element={<RegisterPage />} />` next to `/login` (not inside `ProtectedRoute`). |
| **Optional (out of AC)** | `src/pages/LoginPage.tsx` | Only if scope is explicitly extended: change footer “Create account” from `href="#"` to `<Link to="/register">`. Requires adding `Link` import from `react-router-dom`. |

**Do not modify:** `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js` (governance + spec).

**Do not create:** `srс/services/*`, API modules, or any registration HTTP layer.

---

## Preconditions for the implementer

1. Read `src/pages/LoginPage.tsx` in full — this is the visual and structural template (outer shell, card, input/button Tailwind, optional `lucide-react` icon in header badge).
2. Read `src/App.tsx` in full — mirror the **Public Route** comment block when inserting `/register`.

---

## Implementation steps

### 1. Route wiring (`App.tsx`)

1. Add: `import RegisterPage from './pages/RegisterPage';` with other page imports (external/`react` group first per conventions — here keep same style as existing: router, components, pages).
2. Insert `<Route path="/register" element={<RegisterPage />} />` **alongside** `/login`, **outside** any `ProtectedRoute`.

### 2. `RegisterPage.tsx` UI and behavior

1. Export `const RegisterPage: React.FC = () => { ... };` and `export default RegisterPage`.
2. **Layout:** Match `LoginPage`: `min-h-screen bg-slate-950 flex items-center justify-center p-4`; inner `w-full max-w-md`; card `bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl`; content `p-8`; optional footer strip `p-6 bg-slate-800/30 border-t border-slate-800` with a **single line** “Already have an account? Sign in” linking to `/login` via `<Link>` from `react-router-dom` (spec allows this if kept minimal).
3. **Header:** Minimal title (e.g. create-account wording) + optional one-line muted subtitle; optional icon badge (e.g. `UserPlus` or similar from `lucide-react`) for parity with login’s lock badge — **no** illustrations, charts, or marketing blocks.
4. **Form:** `<form className="space-y-6" onSubmit={handleSubmit}>`.
5. **Fields — exactly four** labeled inputs, vertical order:
   - Name → `type="text"`, label **Name**, `placeholder="Enter your name"`.
   - Email → `type="email"`, label **Email**, `placeholder="Enter your email"`.
   - Password → `type="password"`, label **Password**, `placeholder="Enter your password"`.
   - Confirm Password → `type="password"`, label **Confirm Password**, `placeholder="Confirm your password"`.
6. Each field: `<label htmlFor="...">` matching input `id`; reuse input classes from `LoginPage` (`bg-slate-800/50`, `border-slate-700`, `rounded-lg`, `focus:ring-indigo-500/50`, `placeholder-slate-500`, etc.). Icon prefixes are optional; if used, keep the same `pl-10` + absolute icon pattern as login for consistency.
7. **State:** Local only — one object + `useState` or four `useState<string>` strings. Suggested shape:

   ```ts
   interface RegisterFormState {
     name: string;
     email: string;
     password: string;
     confirmPassword: string;
   }
   ```

   No `any`. No context, no global store, no URL state for values.

8. **Submit:** Single primary button inside the form: **`Create Account`** (exact visible label / accessible name), `type="submit"`, full width, `bg-indigo-600` / hover indigo styling aligned with login CTA.
9. **Handler:** `const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };` — **no other work** (no `fetch`, no `login`, no `useAuth` registration path, no `localStorage`/`sessionStorage` writes for signup, no navigation on success). Story explicitly allows empty submit with no validation.
10. **`useAuth` on this page:** **Do not** call `login` or add/use a `register` API on `useAuth`. **Default:** do not import `useAuth` at all. (If product later mandates redirect when already authenticated, mirror `LoginPage`’s `Navigate` guard **read-only** — still no auth mutations from this form; see risks.)

### 3. Verification (before handoff)

1. Run `npm run lint` and `npm run build`; fix all errors.
2. Grep the new/edited files for: `fetch`, `axios`, `XMLHttpRequest`, `/api`, `useAuth` (should be absent on `RegisterPage` unless an explicit redirect guard was approved), `localStorage`, `sessionStorage`.
3. Manual: open `/register` — four fields, placeholders exact per AC table, **Create Account** button, centered dark card; submit with Network tab — **zero** registration requests.
4. Confirm **no** extra `<input>`, `<textarea>`, or `<select>` beyond the four fields (no remember-me checkbox on this page).

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| **Visual drift** from `LoginPage` | Copy shell/card/input/button class strings from `LoginPage`; side-by-side review. |
| **Accidental auth integration** (`login`, future `register`, persistence) | Submit handler is only `preventDefault`; code review + grep; do not touch `src/hooks/useAuth.ts` for this story. |
| **Governance vs spec** (project rules ask for client-side validation before submit) | This story **intentionally** omits validation (per spec OOS). No required-field or password-match logic. |
| **Scope creep** (terms, social login, OTP, second forms) | Reject — not in AC. |
| **Authenticated users on `/register`** | Spec default: no redirect. `LoginPage` redirects when authenticated; product may want parity — if so, add read-only auth check only, **without** coupling submit to `useAuth` mutations. Confirm with PM if unsure. |
| **File size** | Keep `RegisterPage.tsx` under ~150 lines; extract only if necessary. |

---

## Definition of done (implementer checklist)

- [ ] `/register` is public in `App.tsx` and renders without error.
- [ ] Exactly four labeled fields with **exact** placeholders from spec §4 and primary button label **Create Account**.
- [ ] Submit: `preventDefault` only; no network; no auth persistence from this page.
- [ ] Dark theme + centered layout consistent with `LoginPage`; Tailwind only; no new runtime dependencies.
- [ ] No forbidden config edits; `npm run lint` + `npm run build` pass; no `any`, no prod `console.log` / `debugger`.

---

## Post-story (not in this ticket)

- Vitest + RTL tests (when infra exists): route render, field count, placeholders, button label, mocked `fetch` uncalled on submit.
- Future auth story: validation, confirm-password match, API, and `useAuth` integration — separate spec.
