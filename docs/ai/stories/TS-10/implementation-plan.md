# TS-10 — Implementation plan (Change Password UI + client-side validation)

## Goal

Add a second **Change Password** card **below** the existing profile form on `SettingsPage`, with three password fields, validation per spec, mock success via toast (no backend), matching existing Tailwind card/input/button and a11y patterns.

## Files to touch

| File | Action |
| --- | --- |
| `src/hooks/useChangePasswordForm.ts` | **Add** (recommended): encapsulate state, validators, submit handler—mirror `useProfileForm` shape where it helps readability. |
| `src/pages/SettingsPage.tsx` | **Edit**: render new card + wire hook; reuse or extend local `FormField` for password rows (icons: pick `lucide-react` icons consistent with page, e.g. `Lock`). |

**Do not add:** API modules, `.env`, auth/token changes, or tests (out of scope per spec).

## Preconditions (implementer)

1. Read `useProfileForm` (`src/hooks/useProfileForm.ts`) for error object shape, `handleInputChange` clearing errors on type, `setFieldError`, blur vs submit.
2. Confirm toast API: `useToast()` exposes **`showToast(message, type)`** with `type: 'success' | 'error'` (`src/components/Toast.tsx`). Success path: `showToast('Password changed successfully', 'success')` (exact message string per AC14).

## Data model and state

- **Fields:** `currentPassword`, `newPassword`, `confirmPassword` (strings).
- **Errors:** keyed object, e.g. `ChangePasswordErrors` with optional `currentPassword`, `newPassword`, `confirmPassword`—same inline pattern as profile (`errors.field` → `FormField` `error` prop).
- **`isSubmitting`:** optional boolean; set `true` before mock work, `false` after reset. For synchronous mock, a single tick/`requestAnimationFrame` is optional—only if needed to avoid double-submit; spec allows minimal use.
- **Button disabled flag:** `true` when **any** of the three values is empty after the same empty-check the spec implies (use **trim** consistently for “non-empty” so whitespace-only does not enable the button; document choice in code if raw vs trim for validation messages differs).

## Validation helpers (single source of truth)

Implement pure functions or methods inside the hook for:

1. **Required messages (exact):**
   - Current empty → `Current password is required`
   - New empty → `New password is required`
   - Confirm empty → `Confirm password is required`
2. **New password length:** `< 8` → `Password must be at least 8 characters long`
3. **New password strength:** must include at least one uppercase, one lowercase, one digit, one special character—**one** message for any failure: `Password must contain uppercase, lowercase, number and special character`
4. **Confirm vs new:** mismatch → `New password and confirm password do not match`
5. **New vs current:** case-sensitive equality acceptable; if `newPassword === currentPassword` (after documenting normalization) → `New password must be different from current password`

**Order on full validate (submit):** run checks so all applicable field errors appear where reasonable (e.g. required first; for new password run length then strength; confirm mismatch only when both sides non-empty; same-as-current after new is otherwise valid or as spec ordering prefers—avoid overwriting a more specific error with a generic one).

## UI composition steps (`SettingsPage.tsx`)

1. Keep existing page header and profile `<form>` unchanged in behavior.
2. Below the profile card wrapper (`max-w-2xl` block), add a **second** card container with the same visual recipe: `bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6`.
3. Inside the new card: heading **Change Password**, subtitle **Update your account password securely** (exact copy per AC2).
4. Three `FormField` instances (or dedicated password field rows) with `type="password"` and placeholders **exactly**: `Enter current password`, `Enter new password`, `Confirm new password`.
5. Primary button: label **Change Password**, `type="submit"`, `disabled={!allFieldsNonEmpty}` (not “full validation passed”).
6. Wire `onChange` to hook; on blur call field-level validation aligned with profile page (clear errors on change like `useProfileForm`).

## Interaction behavior

- **Submit:** `preventDefault`; run full validation; if errors, `setErrors` and **no** toast.
- **Blur (recommended):** validate touched field; for confirm, consider validating against `newPassword` when both present.
- **Success:** only if no errors: `showToast('Password changed successfully', 'success')`, clear all three values, clear errors, `isSubmitting` false. Button becomes disabled again (empty fields).

## Accessibility

Match existing `FormField`: `label` + `htmlFor`, `aria-invalid`, `aria-describedby` pointing to error id, error `role="alert"`.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Confusing profile **`isFormValid`** (includes email regex) with change-password enablement | Change-password button uses **only** “all three non-empty” (trim). Do not require strength/match before enabling. |
| Spec mentions `showSuccess`; codebase uses `showToast` | Use `showToast(..., 'success')` only. |
| Trim vs raw for passwords | Spec: default validate raw unless product asks for trim; pick one rule for “empty” vs “length” and document in hook comment if they differ. |
| Special-character regex too strict/loose | Use an explicit character-class check consistent with “at least one special”; avoid brittle “all Unicode punctuation” unless desired—ASCII specials are usually enough for demo. |
| Double submit | Guard with `isSubmitting` if adding any async delay. |

## Verification (manual + scripts)

1. `npm run lint`
2. `npm run build`
3. Manual on `/settings` (authenticated): run through AC1–AC17 checklist in `spec.md`—especially exact strings for errors and toast, button disabled/enabled transitions, and no network/backend changes.

## Out of scope reminder

No API, persistence, or auth mutations; no new test files.
