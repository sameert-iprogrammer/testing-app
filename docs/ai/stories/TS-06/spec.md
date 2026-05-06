# Implementation Spec: TS-06 — Create Frontend-Only Registration Page UI

## Story Metadata

| Field | Value |
|---|---|
| **JIRA Key** | TS-06 |
| **Title** | Create Frontend-Only Registration Page UI |
| **Type** | Feature |
| **Priority** | Medium |
| **Status** | Draft |

## Story Summary

As a new user, I want to see a minimal registration page where I can enter basic account details before signing up. The Nexus Analytics app gains a public `/register` route that renders a centered, dark-theme registration form with exactly four fields (Name, Email, Password, Confirm Password) and a primary **Create Account** button. The experience is UI-only: submitting the form must not call any backend APIs, create users, or persist registration data beyond normal controlled input state.

## Business Goal

Establish the registration screen layout and copy for Nexus Analytics so product and engineering can iterate on auth flows later, without committing to backend contracts, validation rules, or post-signup routing in this iteration.

## Functional Requirements

1. A **Registration** page is reachable at the **`/register`** route (public route, same class as `/login` — not wrapped in `ProtectedRoute`).
2. When the registration route loads successfully, the page shows a registration UI (title/heading appropriate to “Create account” / registration — exact wording is an implementation detail as long as AC for fields and button are met).
3. The form exposes **only** these labeled inputs, in a sensible vertical order:
   - **Name**
   - **Email**
   - **Password**
   - **Confirm Password**
4. Each field uses the suggested placeholder copy:

   | Field | Placeholder |
   |---|---|
   | Name | Enter your name |
   | Email | Enter your email |
   | Password | Enter your password |
   | Confirm Password | Confirm your password |

5. A **primary** call-to-action button is shown with the visible label **exactly**: `Create Account` (case and spacing as written).
6. **Submit behavior (frontend-only)**:
   - The form’s submit handler must **`preventDefault`** on the submit event (standard form handling).
   - **No HTTP requests** (`fetch`, `XMLHttpRequest`, third-party clients) and **no new API/service modules** may be introduced for registration in this story.
   - **No integration** with backend registration, email verification, OTP, or captcha services.
   - **Do not** add a `register` path to `useAuth` or otherwise write to `localStorage` / session to simulate “sign up” — authenticated state must not change as a result of this form (unless the user navigates away manually).
7. **Local state**: If inputs are controlled, use **local component state only** (e.g., `useState` in the page component). No global stores, context providers, or URL state for form values unless already required elsewhere (not expected).
8. **Simplicity constraints**:
   - **No** extra sections beyond what is needed for a minimal card/page shell (optional: short subtitle — keep minimal).
   - **No** illustrations, charts, marketing blocks, testimonials, tabs, secondary forms, terms checkbox, captcha, or social-login buttons.

## Non-Functional Requirements

- **Visual consistency**: Match the **existing dark theme** Tailwind palette used on `LoginPage` and other surfaces (`bg-slate-950`, card `bg-slate-900/50`, `backdrop-blur-xl`, `border-slate-800`, `text-white` / `text-slate-*`, indigo focus rings and primary button styling — mirror `LoginPage` patterns rather than inventing a new visual language).
- **Layout**: The main registration form/card is **visually centered** on the viewport (same general approach as `LoginPage`: full-height container with flex centering and a constrained max width, e.g. `max-w-md`).
- **Styling tooling**: Tailwind utility classes only; **no inline styles**, no CSS modules (per project conventions).
- **Accessibility**: Each input has an associated `<label>` (`htmlFor` / `id`), inputs use appropriate `type` (`text`, `email`, `password`), submit control is a `<button type="submit">`, keyboard submission works; use `aria-invalid` / `aria-describedby` if inline errors are added later (**not required** by this story).
- **Performance / bundle**: No new runtime dependencies — use existing stack (`react`, `react-router-dom`, `tailwindcss`, `lucide-react` optional for icon parity with login).
- **Code conventions**: New page as `src/pages/RegisterPage.tsx`; `React.FC`; default export; relative imports; file length kept reasonable (extract only if approaching the ~150 line guideline).

## Acceptance Criteria Breakdown

Derived from story scenarios and normalized for implementation/test planning.

| AC # | Criteria | Implementation Notes | Test Strategy |
|------|----------|---------------------|---------------|
| AC-1 | **Registration route loads** — Navigating to `/register` renders the Registration page without errors. | Add public `<Route path="/register" element={<RegisterPage />} />` in `src/App.tsx` (alongside `/login`). | Manual or future E2E: visit `/register`, assert root heading/form visible. |
| AC-2 | **Exactly four fields** — Only Name, Email, Password, Confirm Password appear as form fields (no extra inputs such as phone, OTP, checkbox, captcha). | Count text/email/password inputs + labels; do not render additional `<input>` / `<textarea>` / `<select>` controls. | Assert four labeled fields and no others. |
| AC-3 | **Placeholders** — Each field shows the placeholder text specified in Functional Requirements §4. | Controlled or uncontrolled inputs with `placeholder="..."` per table. | Snapshot or RTL: placeholder attribute text. |
| AC-4 | **Primary “Create Account” button** — A single prominent primary-style button labeled **Create Account** is visible on the page. | Match primary button styling to login CTA (`bg-indigo-600`, hover, width full inside form). \| **Submit** semantics: recommend `type="submit"` nested in `<form>`. | Assert button visible with exact accessible name/text. |
| AC-5 | **Minimal dark UI** — Page uses dark theme consistent with existing app; form is centered; no charts, illustrations, or complex marketing sections. | Reuse LoginPage structural patterns (`min-h-screen`, centered flex, card). | Visual/manual check; assert no `<canvas>`, `<img>` for illustration, chart libraries. |
| AC-6 | **No backend on submit** — On “Create Account” click / form submit: **no network registration** and **no user creation**. | Submit handler: `preventDefault` only (or noop after preventDefault). **No** `fetch`, no `import` of HTTP clients, **no** new `src/services/` registration API. Code review / grep for forbidden calls. | Mock `global.fetch` in tests when tests exist — assert zero calls post-submit; verify no navigation required by story (none specified). |

## Out of Scope (Explicit)

Per story: backend API integration; real user registration; email verification; password strength/rules; confirm-password matching logic; OTP; social login; terms checkbox; captcha; **redirect after registration** (no automatic navigation away from `/register` on success).

Also out of scope: adding auth guards to `/register` (it remains public).

## Impacted Areas

| Area | Files | Change Type | Notes |
|------|-------|-------------|-------|
| Pages | `src/pages/RegisterPage.tsx` | New | Registration UI — centered card form, local state optional |
| Routes | `src/App.tsx` | Modify | Register public route `/register` |

**Optional follow-up (not required by acceptance criteria):** Replace `href="#"` on LoginPage’s “Create account” anchor with `<Link to="/register">` for navigation consistency — confirm with product before scope creep.

**Governance alignment note:** Project rules encourage client-side validation before submission for production forms; this story **intentionally** excludes validation rules for passwords and parity between password fields (see Out of Scope). Implementation should document that fuller validation arrives with a future auth story.

## Data/API Requirements

- **Suggested initial local form shape** (if using a single state object):

  ```typescript
  const initialRegisterForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  ```

- **Alternative:** Four independent `useState` strings — equivalent for this story.
- **Persistence**: No server payload; **no `localStorage` writes** for registration.
- **Types**: Prefer an inline interface/type for form state (`RegisterFormState` or similar); no `any`.

## UI/UX Requirements

- **Page shell**: Full viewport height (`min-h-screen`), `bg-slate-950`, flex alignment to center (`flex items-center justify-center`), horizontal padding (`p-4`).
- **Card container**: Mirrors `LoginPage` — `w-full max-w-md`, inner card `bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl`, inner padding ~`p-8`.
- **Header block**: Minimal — e.g., icon badge (optional, `lucide-react`), title, optional one-line muted subtitle (“Create your account”, etc.).
- **Form**: `space-y-6`, inputs use `LoginPage`-like classes (`bg-slate-800/50`, `border-slate-700`, `rounded-lg`, `focus:ring-indigo-500/50`, `placeholder-slate-500`).
- **Button**: Primary indigo filled, full width, clear hover/active states; label text **Create Account** (must not be split across multiple elements in a way that breaks the accessible name).
- **Footer strip** (optional): Subtle `border-t` footer with “Already have an account? Sign in” linking to `/login` via `Link` — **only if** it does not violate “no extra sections”; keep a single line if included.

## Validation Rules

- **This story**: No required field validation, no password policy, no confirm-password match check. Empty submit is allowed from a product perspective; implementation still uses `preventDefault` and performs **no** network I/O.
- **Future story**: When backend auth exists, add schema validation and match policy per governance.

## Edge Cases

1. **Direct URL access** — `/register` should render when typed in the address bar (public route).
2. **Authenticated user visits `/register`** — Story does not require redirect; optional UX: mirror `LoginPage` redirect if already authenticated (product decision). Default: **no redirect** unless specified — avoids coupling to `useAuth` for “registration success.”
3. **Double submit** — Still no API; multiple clicks remain harmless.
4. **Browser autofill** — Inputs should remain standard `name`/`type` so autofill works; no special handling required.

## Assumptions

1. **Public route** at top level `/register` (not nested under dashboard), consistent with `/login`.
2. **Nexus Analytics** branding can reuse the same icon/mark treatment as `LoginPage` for visual consistency.
3. **No config changes** — `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js` are not modified (per project governance).
4. **No new npm dependencies** for forms, HTTP, or state.
5. **Testing infrastructure** may still be absent; manual verification is acceptable for this story; document RTL cases for when Vitest + RTL land.

## Open Questions

1. Should **authenticated** users be redirected away from `/register` (e.g., to `/dashboard`) for parity with `LoginPage`? Story is silent — confirm with product.
2. Should the **LoginPage** “Create account” link be updated to `react-router-dom` **`Link`** in the same ticket? Helpful UX but **not listed** in AC — confirm scope.
3. When future validation is added, should **confirm password** parity be enforced client-side before any API call?

## Implementation Plan

### Phase 1: Route wiring
1. Create `RegisterPage.tsx` under `src/pages/` (placeholder export acceptable briefly during dev — prefer complete UI in single commit/chunk).
2. In `src/App.tsx`, import default `RegisterPage` and register `<Route path="/register" element={<RegisterPage />} />` adjacent to `/login`.

### Phase 2: Registration page UI
1. Implement `RegisterPage` as `React.FC`.
2. Build centered layout and card styling consistent with `LoginPage.tsx`.
3. Render four labeled fields with placeholders per spec table; wire to local state (`initialRegisterForm` or four `useState` hooks).
4. Render **`Create Account`** primary submit button (`type="submit"`).
5. Implement `onSubmit` handler: **`e.preventDefault()`** — end of mandatory behavior for this story. Do not invoke `fetch` or `login`/`useAuth` signup.

### Phase 3: Quality bar
1. Run `npm run lint` and `npm run build`.
2. Confirm no stray `fetch`/`axios`/service imports on the registration path.
3. Quick accessibility pass (labels, keyboard submit, semantic form).

### Phase 4: Tests (future)
When Vitest + RTL are configured, add tests asserting route renders, four fields present, placeholders, button label **Create Account**, and mocked `fetch` untouched on submit.

## Testing Strategy

- **Manual**: Visit `/register`; verify fields, placeholders, centered layout, dark theme, button label; submit with devtools Network tab **closed** — no requests.
- **Static review**: Search `RegisterPage` and `App.tsx` diffs for `fetch`, `/api`, `axios`, `useAuth`-based registration hooks.
- **Future automated** (recommended): RTL render test for AC-2–AC-4; optionally assert `preventDefault` on submit and zero network.

## Risk Checklist

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Drift from `LoginPage` visual patterns | Medium | Medium | Copy structural Tailwind snippets from `LoginPage`; diff in review |
| Accidental dependency on auth hook | Low | Medium | Explicitly forbid `login`/register side effects in form submit handler |
| Governance conflict (validation omitted) | Low | Low | Document as intentional OOS per story |
| Footer/link scope creep | Medium | Low | Keep optional footer one line or omit |

## Definition of Done

- [ ] `/register` route exists and renders `RegisterPage` from `src/App.tsx` (public, not `ProtectedRoute`)
- [ ] Form shows **only** Name, Email, Password, Confirm Password inputs with specified placeholders
- [ ] Primary **Create Account** button is present and submits the `<form>`
- [ ] On submit: **`preventDefault`** is invoked; **no** API calls / user creation / signup persistence
- [ ] Layout is centered; dark theme aligns with existing pages; **no** charts/extra complex sections
- [ ] No new runtime dependencies added
- [ ] No forbidden config file edits (`vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js`)
- [ ] `npm run lint` passes and `npm run build` succeeds
- [ ] No `any`; no production `console.log` / `debugger`
- [ ] Import order and `React.FC`/`export default` conventions match sibling pages
