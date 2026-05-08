# Review pointers — cycle 1 (TS-10 change password)

## Severity legend

- **Blocker**: Fails spec, breaks build/lint, or serious correctness bug.
- **Major**: User-visible bug, spec mismatch, or maintainability risk that should ship with a fix.
- **Minor**: Polish, consistency, or optional hardening.

---

## Must-fix (before merge)

| Item | Severity | Where | Notes |
| --- | --- | --- | --- |
| None identified from static review | — | — | Validation copy, toast message, placeholders, card layout, and button enablement (trim + non-empty) align with `implementation-plan.md`. Run `npm run lint` and `npm run build` locally to confirm CI parity (not executed in this review environment). |

If CI reports a `React` namespace error on `React.FormEvent` in `useChangePasswordForm.ts`, fix by importing the event type from `react` (same pattern could apply to `useProfileForm.ts` if that file is in scope).

---

## File-level pointers

### `src/pages/SettingsPage.tsx`

- **Minor — layout vs plan wording**: Wrapper changed from `max-w-2xl` to `max-w-2xl space-y-8` to separate the two cards. This matches the plan’s “second card below” intent and does not alter profile submit/validation behavior.
- **Minor — consistency**: Change-password submit uses `isChangePasswordSubmitEnabled` (non-empty + `!isSubmitting`) instead of inlining `allFieldsNonEmpty`; behavior matches the plan’s “all three non-empty” rule, with extra guard during submit state.
- **Minor — readability**: The `useProfileForm` destructure is a long single line; optional wrap for consistency with the change-password hook formatting.

### `src/hooks/useChangePasswordForm.ts`

- **Minor — redundant submit guard**: `isSubmitting` is set `true` then cleared synchronously in `handleSubmit`, so it does not meaningfully prevent double-submit; either add a real async boundary / `queueMicrotask` or drop the flag until needed (per plan risk table).
- **Major (polish / UX) — stale cross-field error**: `handleInputChange` only clears errors for the edited field. If `newPassword` shows “New password must be different from current password” and the user corrects `currentPassword` without touching `newPassword`, that error can remain until the next blur/change on `newPassword`. Consider clearing or re-validating `newPassword` when `currentPassword` changes (and similarly for confirm when `newPassword` changes) if AC/manual checklist expects immediate recovery.
- **Minor — typing**: `e: React.FormEvent` without a `react` value/type import matches `useProfileForm.ts`; prefer `import type { FormEvent } from 'react'` if the codebase moves away from the `React.` namespace pattern.

---

## Spec / plan checklist (spot-check)

- Second card below profile with shared Tailwind recipe: **met**.
- Headings/subtitle copy: **met** (`Change Password`, `Update your account password securely`).
- Placeholders: **met** (including exact “Enter new password”).
- Required, length, strength, mismatch, and same-as-current messages: **met** (exact strings in hook).
- Success toast: **`Password changed successfully`** with success type: **met**.
- No API/backend scope creep in touched files: **met**.

---

## Suggested manual verification

- On `/settings`, exercise blur vs submit for each field, whitespace-only values (button stays disabled), mismatch confirm, weak new password, and new same as current after fixing current.
- Confirm both forms still behave independently (profile vs change password).
