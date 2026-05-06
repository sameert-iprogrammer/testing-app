# Implementation Spec: TS-08 — Password Change Form

## Story Metadata

| Field | Value |
|---|---|
| **JIRA Key** | TS-08 |
| **Title** | Password change form |
| **Description** | In settings page, add password change form. Add strong password criteria. No backend. Only UI. |
| **Type** | Feature |
| **Priority** | Medium |
| **Status** | Draft |

## Story Summary

As an authenticated user on **Settings** (`/settings`), I want a **password change** section with **strong password rules** clearly shown and enforced in the browser, so the product reflects a realistic security UX. There is **no backend**: no API calls, no verification of the current password against a server, and no persistence of new passwords.

## Alignment with Project Context (`docs/ai/project-context.md`)

- **Stack**: React 19 + TypeScript (strict-ish flags), Vite, `react-router-dom`, Tailwind v4 utilities only (no inline styles), `lucide-react` icons, `React.FC` + `export default` for pages/components.
- **Settings surface**: Extend the existing **Settings** route and `SettingsPage` area (already under `ProtectedRoute` + `DashboardLayout` per current `App.tsx`); do not introduce a separate route unless product explicitly requests it.
- **State**: Local/component state (and existing hooks patterns such as `useProfileForm`-style extraction are acceptable if they keep files under ~150 lines and avoid new dependencies).
- **Validation**: Client-side validation before submit is mandatory per project governance; no new validation library is required unless justified.
- **Security / governance**: Do not persist passwords in `localStorage` / `sessionStorage`. Do not add `console.log` of passwords. Do not call real auth endpoints or embed secrets.

## Functional Requirements

1. **Placement**: The password change UI lives on the **same Settings page** as existing profile/settings content, visually separated (e.g. a second card/section below the profile form or a clear titled region—implementation choice, must be obviously distinct).
2. **Fields** (controlled inputs):
   - **Current password** — required for UX parity with a real “change password” flow; **not cryptographically verified** (no backend).
   - **New password** — required.
   - **Confirm new password** — required.
3. **Strong password criteria** (all enforced client-side on **submit**, with optional inline feedback as implementations prefer—see Acceptance Criteria):
   - Minimum length: **12 characters**.
   - At least **one uppercase** Latin letter (`A–Z`).
   - At least **one lowercase** Latin letter (`a–z`).
   - At least **one digit** (`0–9`).
   - At least **one special character** from a documented set (recommendation: ASCII punctuation/symbols, e.g. `!@#$%^&*()_+-=[]{}|;:,.<>?` — pick one explicit set in implementation and use consistently).
   - **No leading or trailing whitespace** in the evaluated password (trim before validation or reject whitespace-only padding—document chosen behavior).
4. **Cross-field rules**:
   - **Confirm** must **exactly match** the **new password** (after the same trimming/normalization used for validation).
   - **New password** must **differ** from **current password** (string inequality after the same normalization).
5. **Criteria visibility**: Show a **visible checklist or bullet list** of the strong-password rules on the form, with **dynamic state** (e.g. met/unmet) updating as the user types **or** on blur/submit—minimum bar: user can always see what “strong” means without referring to external docs.
6. **Submit behavior (UI-only)**:
   - `preventDefault` on submit.
   - If validation fails: show field-level errors and/or summary; **do not** claim success.
   - If validation passes: show a **non-deceptive** success message (e.g. toast copy such as **“Password requirements met. Changes are not saved (demo only).”** or equivalent that clearly communicates **no server update**—exact wording can be tweaked for tone but **must not** imply persistence).
   - Clear **new** / **confirm** fields after successful submission (recommended); **never** retain password values in storage.
7. **No backend**: No `fetch`/HTTP client usage for this story; no environment variables required for passwords.

## Non-Functional Requirements

- **Accessibility**: Each input has an associated `<label>` (`htmlFor`/`id`). Errors use `role="alert"` and `aria-invalid` / `aria-describedby` where applicable. Toggle buttons (if any) need `aria-pressed` and accessible names.
- **UX (optional but recommended)**: Per-field “show/hide password” toggles using `lucide-react` icons, without exposing secrets in console/logs.
- **Performance**: No new runtime dependencies unless strongly justified and approved per project dependency rules.
- **Consistency**: Typography, spacing, card surfaces, and focus rings match existing Settings/Login patterns (`bg-slate-900/40`, `border-slate-800`, indigo focus rings, etc.).

## Acceptance Criteria Breakdown

| AC # | Criteria | Implementation Notes | Test Strategy |
|------|----------|---------------------|---------------|
| AC-1 | Settings page includes a dedicated **Password** / **Security** section | Add UI to `SettingsPage` (or small co-located subcomponents in the same file if line limits require). | Open `/settings` and confirm section title + form are visible. |
| AC-2 | Form includes **Current**, **New**, and **Confirm** password fields | All `type="password"` (or safely toggled). | DOM/query three labeled inputs. |
| AC-3 | Strong password rules are **listed** and **enforced** | Implement the rules in §Functional Requirements; unmet rules block submit success. | Type weak vs strong passwords; verify errors and checklist states. |
| AC-4 | Confirm must match new password | Show explicit error if mismatched (e.g. “Passwords do not match”). | Submit mismatching values. |
| AC-5 | New password must differ from current | Show explicit error if equal. | Use identical strings for current and new. |
| AC-6 | Successful submit shows **honest** success copy (demo-only / not saved) and performs **no network I/O** | Use existing `useToast` if available; otherwise inline success region with `role="status"`. | Network tab + code review; verify toast/message text. |
| AC-7 | No passwords stored in browser storage | No `localStorage`/`sessionStorage` writes for credential fields. | Code review / runtime inspection. |

## Impacted Areas

| Area | Files | Change Type | Notes |
|------|-------|-------------|-------|
| Pages | `src/pages/SettingsPage.tsx` | Modify | Primary location for new section |
| Hooks | `src/hooks/usePasswordChangeForm.ts` (example name) | New (optional) | Extract if page would exceed ~150 lines |
| Components | Co-located helpers in `SettingsPage.tsx` | Optional | Mirrors existing `FormField` pattern |

## Data / API Requirements

- **API**: None.
- **State shape** (illustrative):
  ```typescript
  interface PasswordChangeFormState {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  ```
- **Derived data**: Boolean map or computed booleans for “rule satisfied” checklist items derived from `newPassword` (and comparison helpers for confirm/current).

## UI / UX Requirements

- **Layout**: Second `max-w-2xl` card or equivalent; heading such as “Change password” + short helper text that this is UI-only/demo.
- **Primary action**: Single submit button (`Change password` or similar), `disabled` when the form cannot be submitted **or** enabled with errors on submit—pick one consistent pattern with the existing Settings profile form (prefer consistency with current **disabled until valid** behavior if practical).
- **Errors**: Inline per field (`text-rose-400 text-xs mt-1`, `role="alert"`), consistent with existing settings form fields.
- **Icons**: Prefer `Lock`, `Eye`, `EyeOff`, `Shield`, or `KeyRound` from `lucide-react` for affordances.

## Validation Rules (Concrete)

| Rule ID | Condition | Typical user-facing message (copy can vary, meaning must not) |
|---|---|---|
| V-1 | Current password non-empty | “Current password is required.” |
| V-2 | New password non-empty | “New password is required.” |
| V-3 | Confirm non-empty | “Please confirm your new password.” |
| V-4 | Length ≥ 12 (after trim) | “Password must be at least 12 characters.” |
| V-5 | Contains uppercase | “Password must include an uppercase letter.” |
| V-6 | Contains lowercase | “Password must include a lowercase letter.” |
| V-7 | Contains digit | “Password must include a number.” |
| V-8 | Contains special char | “Password must include a special character.” |
| V-9 | New equals confirm | “Passwords do not match.” |
| V-10 | New differs from current | “New password must be different from your current password.” |

## Edge Cases

1. User pastes password with accidental leading/trailing spaces — trimming policy must not accidentally accept blank passwords; document whether trimming is applied to all three fields for comparison only or also for emptiness checks.
2. Submit while a field has only whitespace — treat as empty / failed required validation.
3. User submits valid form repeatedly — acceptable; toast may repeat if using existing toast UX (no backend idempotency concerns).
4. User navigates away mid-entry — passwords should not persist beyond component lifetime (React state clears on unmount).

## Assumptions

1. `/settings` remains the canonical settings URL; Password change is additive to TS-03’s profile settings UX.
2. Mock authentication may exist (`useAuth`/protected routes)—this story does **not** change auth behavior beyond adding UI on Settings.
3. Profile form behavior remains unchanged unless a shared refactor is unavoidable (keep diff focused).

## Out of Scope

- Server-side password change, hashing, MFA, logout-after-change, breach checks, entropy meters wired to external APIs.
- Email-based reset / forgot password flows.
- Saving passwords anywhere durable (localStorage, cookies, backend).
- Adding Zod/Yup/etc. without explicit approval.

## Open Questions

1. Should the submit button remain **disabled until all validations pass** (matches current profile form style) or always enabled with errors on submit? **Default in this spec:** prefer parity with existing Settings profile form for consistency.
2. Exact demo success copy — product/UX may tune wording; must remain non-misleading about persistence.

## Definition of Done

- [ ] Password change section visible on `/settings` with current/new/confirm fields
- [ ] Strong password criteria visible as a checklist and enforced in UI logic
- [ ] Confirm match + “new differs from current” enforced
- [ ] Success feedback clearly indicates **UI-only / not saved**, with **no** network requests
- [ ] No passwords written to persistent browser storage
- [ ] Accessibility basics satisfied (labels, errors announced, keyboard operable toggles if present)
- [ ] `npm run lint` passes; `npm run build` succeeds
- [ ] No `any` types; no `console.log`/debugger noise
- [ ] No unrelated config changes (`vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js` unchanged unless explicitly approved elsewhere)
