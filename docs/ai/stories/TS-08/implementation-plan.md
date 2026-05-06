# Implementation Plan: TS-08 — Password Change Form

**For:** code-implementer agent  
**Goal:** Add a UI-only password change section on `/settings` with strong-password rules, checklist, validation, and honest success feedback—no backend, no storage of secrets.

---

## 0. Preconditions (read before coding)

- Read `src/pages/SettingsPage.tsx` and `src/hooks/useProfileForm.ts` end-to-end; mirror **submit handling**, **`disabled={!isFormValid}`**, error styling (`text-rose-400 text-xs mt-1`, `role="alert"`), and card layout (`max-w-2xl`, `bg-slate-900/40`, `border-slate-800`, indigo focus rings).
- Confirm `useToast` from `src/components/Toast.tsx` is available (page is under `DashboardLayout`, which wraps `ToastProvider`).
- Do **not** modify `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, or `tailwind.config.js`. Do **not** add validation libraries (Zod/Yup) or new runtime dependencies without escalation.

---

## 1. Files to touch

| Action | Path | Notes |
|--------|------|--------|
| **Modify** | `src/pages/SettingsPage.tsx` | Add second card/section below profile form; keep profile behavior unchanged. |
| **Create** | `src/hooks/usePasswordChangeForm.ts` | Recommended: `SettingsPage` + new UI will exceed ~150 lines if all logic stays inline. |
| **Read-only** | `src/components/Toast.tsx` | Use `showToast(message, 'success')` with demo-only wording. |
| **Avoid** | `src/App.tsx` | `/settings` already exists; no route work unless broken. |

Optional: co-locate a small `PasswordField` or extend the local `FormField` pattern in `SettingsPage.tsx` if password visibility toggles are implemented (spec: optional but recommended).

---

## 2. Implementation steps

### Step A — Hook: `usePasswordChangeForm.ts`

1. **State shape** (controlled fields): `currentPassword`, `newPassword`, `confirmPassword` (all `string`). Separate `errors` object with optional string fields keyed by field name + any summary if desired.
2. **Normalization (document in code):** For validation and comparisons, use **trimmed** values:
   - Treat `trim() === ''` as empty for required checks (covers whitespace-only and padded paste).
   - Apply the **same** trimmed `new` value for: strength rules, confirm match, and inequality vs trimmed `current`.
3. **Strong password rules** (all on trimmed `new` password; block success until all pass):
   - Length ≥ 12.
   - At least one `[A-Z]`, one `[a-z]`, one `[0-9]`.
   - At least one special character from a **single fixed ASCII set** (pick one constant, e.g. ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` or the spec’s suggested set—use **one** regex or `includes` check consistent with that set).
4. **Cross-field:** trimmed `new ===` trimmed `confirm` (else message per V-9); trimmed `new !==` trimmed `current` (else V-10).
5. **`isFormValid`:** Derived boolean matching profile pattern: all required non-empty (after trim), all strength rules satisfied, confirm match, new ≠ current. Used to disable submit until valid.
6. **`handleSubmit(e, showToast)`:** `preventDefault`; if any check fails, set field/summary errors and return; if pass, call `showToast` with **non-deceptive** copy (e.g. that requirements were met and changes are **not** saved / demo only—exact tone flexible per spec), then **clear** `newPassword` and `confirmPassword` in state (and associated errors). Do **not** log passwords; no `fetch`/`axios`/storage writes for these fields.
7. **Checklist data:** Export or compute booleans for each rule (length, upper, lower, digit, special, no leading/trailing issues is implicitly satisfied if validating trimmed string—optional UI note: checklist can reflect trimmed evaluation). Update as user types so AC “dynamic state” is met.

### Step B — UI: `SettingsPage.tsx`

1. Add a **visually separate** block below the existing profile card: heading (e.g. “Change password” or “Security”), short helper that this is UI-only / no server update.
2. Second **`max-w-2xl`** card with a `<form>` containing:
   - **Current**, **New**, **Confirm** fields—all with `<label htmlFor>` + stable `id`s, `aria-invalid`, `aria-describedby` to error ids, errors with `role="alert"`.
   - **Visible checklist** (bullets or check icons) bound to rule booleans from the hook.
3. **(Recommended)** Per-field show/hide: toggle `type` between `password` and `text`; use `lucide-react` `Eye` / `EyeOff`; button needs `type="button"`, `aria-pressed`, and accessible name (e.g. “Show password”). Do not use `console.log` for values.
4. Submit button: **“Change password”** (or similar); **`disabled={!isFormValid}`** to match profile form (spec default).
5. Icons: e.g. `Lock` / `KeyRound` for fields per spec; consistent with existing left-icon input padding (`pl-10`).
6. Ensure no `localStorage`/`sessionStorage` usage for passwords.

### Step C — Verification

1. Run `npm run lint` and `npm run build`; fix any `any`, unused vars, or hook dependency issues.
2. Manual smoke: `/settings` shows both sections; weak submit paths show errors; valid submit shows toast and clears new/confirm; Network tab shows **no** new requests tied to this form.

---

## 3. Acceptance criteria mapping (quick checklist for implementer)

| AC | Verify |
|----|--------|
| AC-1 | Dedicated password/security section on `/settings`. |
| AC-2 | Three labeled password inputs (toggled types OK). |
| AC-3 | Checklist visible; unmet rules prevent valid submit. |
| AC-4 | Mismatch confirm → explicit error. |
| AC-5 | New equals current (after trim) → explicit error. |
| AC-6 | Success message states demo / not persisted; `useToast` or `role="status"` fallback; no HTTP. |
| AC-7 | No storage of password values in browser persistence APIs. |

---

## 4. Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **`SettingsPage.tsx` grows past ~150 lines** | Governance / review friction | Put state + validation in `usePasswordChangeForm.ts`; keep presentational pieces lean; optional small co-located `PasswordField`. |
| **Misleading success copy** | Product trust / AC fail | Use explicit “not saved” / “demo only” wording; align with spec examples. |
| **Inconsistent trim behavior** | Subtle validation bugs | Single helper `normalizePasswordInput(s: string): string` (trim) used everywhere for validation/compare. |
| **Special-character set drift** | User confusion vs tests | One exported constant + comment; one implementation path (regex or set membership). |
| **Accessibility gaps on visibility toggles** | a11y fail | `aria-pressed`, labels, `type="button"`, keyboard focus styles match existing inputs. |
| **Accidental network or storage** | Security / spec violation | Code review: no `fetch`, no `localStorage` for credentials; grep before PR. |
| **Breaking profile form** | Regression | Do not change `useProfileForm` behavior unless unavoidable; additive JSX only. |

---

## 5. Definition of done (story-level)

- All bullets in spec **Definition of Done** satisfied; `npm run lint` and `npm run build` pass; no `any`, no password `console.log`, no unrelated config edits.

---

*End of implementation plan.*
