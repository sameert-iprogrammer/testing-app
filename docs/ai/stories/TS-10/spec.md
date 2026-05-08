# TS-10 — Add Change Password form UI with client-side validations on Settings page

## Metadata

| Field | Value |
| --- | --- |
| **JIRA key** | TS-10 |
| **Title** | Add Change Password form UI with client-side validations on Settings page |
| **Type** | Frontend UI + client-side validation only |

### User story

As an authenticated user, I want to change my password from the Settings page, so that I can manage my account security from the profile settings area.

### Summary

Extend the existing **Settings / Profile Settings** screen (`/settings`, `SettingsPage`) with a **second card** placed **below** the current profile form. The new **Change Password** section provides three password fields, inline validation, disabled submit until inputs are non-empty, submit-time validation for strength and consistency rules, and a **success toast** on valid submit—**without** any backend call, token handling, or real password update.

---

## Alignment with repository conventions

Per `docs/ai/project-context.md`, implementation should:

- Live on the **Settings** route and reuse **Tailwind** styling consistent with the existing dark dashboard cards and inputs on `SettingsPage`.
- Use **local React state** (`useState`) and optionally a small **`useX`-style hook** (similar to `useProfileForm`) if it keeps the page readable—**no** Redux/Zustand/new global domain store.
- Use **`useToast`** from the existing toast pattern (`ToastProvider` / `src/components/Toast.tsx`) for the success message.
- Use **controlled inputs**, inline errors under fields, and preserve the project’s **accessibility baseline** (`label`, `aria-invalid`, `aria-describedby`, `role="alert"` where appropriate)—matching `SettingsPage` + `useProfileForm` patterns.
- **Do not** add API/service modules, `.env`, or encryption logic for this story.

---

## Scope

### In scope

- New **Change Password** card **below** the existing profile settings card on the Settings page.
- Fields: **Current Password**, **New Password**, **Confirm New Password** (all `type="password"`).
- **Client-side validation** and **local state** for values, errors, validity, and submitting flag.
- **Submit button** labeled **Change Password**, **disabled** until all three fields are non-empty (see [Button enablement](#button-enablement)).
- On successful validation: show toast **“Password changed successfully”**, then **clear** all password fields and reset related UI state as needed (errors/submitting).
- Visual parity: same **dark theme**, card, spacing, borders, inputs, and button styles as the existing Settings profile section.

### Out of scope

- Backend API integration and any HTTP client changes.
- Actual password update, persistence, or auth token mutation.
- Password encryption/hashing.
- Server-side validation.
- Forgot-password flow.
- New automated tests (none in repo today); follow `npm run lint` and `npm run build` as quality gates for changes.

---

## UI specification

### Placement

- **Below** the existing **Profile Settings** card on `SettingsPage`.
- Order: **Profile Settings** card → **Change Password** card.

### Section copy

| Element | Text |
| --- | --- |
| **Section heading** | Change Password |
| **Section subtitle** | Update your account password securely |

### Fields

| Field | Control | Placeholder | Required |
| --- | --- | --- | --- |
| Current Password | `password` | Enter current password | Yes |
| New Password | `password` | Enter new password | Yes |
| Confirm New Password | `password` | Confirm new password | Yes |

### Primary action

| Element | Label |
| --- | --- |
| Submit button | Change Password |

### Error presentation

- Show **inline validation messages** **below** the corresponding field.
- Use the same error text styling as existing Settings forms (e.g. destructive/error color class pattern already used on the page).

---

## Button enablement

- **Initial:** Button **disabled** when any of `currentPassword`, `newPassword`, or `confirmPassword` is empty (after trim if the implementation trims for display logic—**spec intent**: user must have non-empty input in all three fields before the button enables).
- **Enabled:** When **all three** fields contain non-empty values.

**Note:** Disabled-by-empty is independent of whether current validation errors exist; the button may become enabled even if the values would fail strength/mismatch rules—those rules are enforced on **submit** (and optional blur behavior per [Interaction and validation behavior](#interaction-and-validation-behavior)).

---

## Validation rules and messages

### Current password

| Rule | Error message |
| --- | --- |
| Required (empty on validate) | `Current password is required` |

### New password

| Rule | Error message |
| --- | --- |
| Required | `New password is required` |
| Minimum length 8 | `Password must be at least 8 characters long` |
| Strength: at least one uppercase, one lowercase, one digit, one special character | `Password must contain uppercase, lowercase, number and special character` |

**Strength rule detail:** One message covers any failure of the character-class requirement (missing any of upper, lower, number, special)—do not split into separate messages unless product later asks for it.

### Confirm new password

| Rule | Error message |
| --- | --- |
| Required | `Confirm password is required` |
| Must equal New Password | `New password and confirm password do not match` |

### Same-password (new vs current)

| Rule | Error message |
| --- | --- |
| New password must not equal current password (per validation pass) | `New password must be different from current password` |

**Equality:** Case-sensitive string equality is acceptable unless the product specifies otherwise; document in implementation if normalization is applied.

---

## Interaction and validation behavior

Recommended alignment with existing Settings patterns (`useProfileForm` / `SettingsPage`):

- **Submit:** Run full validation on **Change Password** click. Surface field errors; **do not** show success toast if validation fails.
- **Blur (optional but consistent with profile form):** When the user leaves a field (`onBlur`), validate that field (or related pair for confirm) so “focus and leave empty” scenarios show messages as described in the story.
- **Submitting:** While handling a valid submit (simulated async optional), set `isSubmitting` to avoid double-submit; for a purely synchronous mock success, keep the flag only long enough to mirror UX consistency if other forms use it.

### Success path (mock)

On **valid** submit only:

1. Show toast: **`Password changed successfully`** (exact string).
2. Clear **currentPassword**, **newPassword**, **confirmPassword**.
3. Clear field errors; reset **isSubmitting** to false.
4. Button returns to **disabled** state because fields are empty.

### Example valid scenario (from story)

| Field | Value |
| --- | --- |
| Current Password | `Admin@123` |
| New Password | `NewAdmin@123` |
| Confirm New Password | `NewAdmin@123` |

Submit → success toast → fields cleared.

---

## State management

Maintain **local** state only (component state or dedicated hook colocated under `src/hooks`), **no** global/backend persistence:

| State | Purpose |
| --- | --- |
| `currentPassword` | Current password field value |
| `newPassword` | New password field value |
| `confirmPassword` | Confirm password field value |
| `errors` | Field-keyed error messages (shape consistent with existing profile form errors pattern) |
| `isFormValid` | Optional derived flag for **non-empty** all fields if useful for enabling the button; **do not** confuse with “passes all validation rules” |
| `isSubmitting` | Guard submit / transient loading if used |

**Derived rules:**

- **Button disabled:** Not all three fields non-empty (see [Button enablement](#button-enablement)).
- **`isFormValid` (if used):** Typically `true` when all three trimmed values are non-empty; naming may match existing profile form (`isFormValid`) but semantics here are **empty-check**, not full validation pass.

---

## Functional requirements (normalized)

1. **Visibility:** On `/settings`, below the profile card, a **Change Password** section appears with heading and subtitle as specified.
2. **Fields:** Three password inputs with correct placeholders and labels.
3. **Initial load:** All password fields empty; **Change Password** button **disabled**.
4. **Enable button:** When user enters non-empty values in **all** three fields, button **enables**.
5. **Empty validation:** Leaving a field empty after interaction (per blur/submit rules) shows the correct **required** message for that field.
6. **Length:** New password with fewer than 8 characters fails with the length error on submit (and on blur if implemented).
7. **Strength:** New password missing upper/lower/digit/special fails with the combined strength error on submit (and on blur if implemented).
8. **Mismatch:** Confirm not matching new fails with mismatch message on submit (and on blur if implemented).
9. **Same as current:** If new equals current, show **New password must be different from current password** on submit (and optionally on blur when both are filled).
10. **Success:** When all rules pass and user clicks **Change Password**, show toast **Password changed successfully** and clear all password fields.

---

## Acceptance criteria (testable checklist)

- [ ] **AC1 — Section placement:** On the Settings page, scrolling below the Profile Settings form shows a **Change Password** card/section.
- [ ] **AC2 — Copy:** Section shows heading **Change Password** and subtitle **Update your account password securely**.
- [ ] **AC3 — Fields:** Form includes **Current Password**, **New Password**, and **Confirm New Password** with `type="password"` and placeholders exactly as specified.
- [ ] **AC4 — Primary button:** Primary action is labeled **Change Password**.
- [ ] **AC5 — Initial disabled:** When all three fields are empty, **Change Password** is disabled.
- [ ] **AC6 — Enable when filled:** When all three fields contain non-empty input, **Change Password** is enabled.
- [ ] **AC7 — Current password required:** Empty current password on validation shows **Current password is required**.
- [ ] **AC8 — New password required:** Empty new password on validation shows **New password is required**.
- [ ] **AC9 — Length:** New password with fewer than 8 characters on submit shows **Password must be at least 8 characters long**.
- [ ] **AC10 — Strength:** New password failing character rules on submit shows **Password must contain uppercase, lowercase, number and special character**.
- [ ] **AC11 — Confirm required:** Empty confirm on validation shows **Confirm password is required**.
- [ ] **AC12 — Mismatch:** Non-matching confirm on submit shows **New password and confirm password do not match**.
- [ ] **AC13 — Same password:** When new equals current on submit, show **New password must be different from current password**.
- [ ] **AC14 — Success toast:** Valid submit shows toast **Password changed successfully** (via existing toast mechanism).
- [ ] **AC15 — Reset after success:** After successful submit, all three password fields are cleared and the button is disabled again (empty fields).
- [ ] **AC16 — Styling:** New section matches existing Settings page card/input/button dark theme and spacing patterns.
- [ ] **AC17 — No backend:** No new API modules, network calls, or auth/token changes are introduced for this story.

---

## Implementation notes (non-binding hints)

- **File touchpoints:** Primarily `src/pages/SettingsPage.tsx`; optionally `src/hooks/useChangePasswordForm.ts` (or similar) mirroring `useProfileForm` separation.
- **Toast:** `useToast().showSuccess` or equivalent per existing `Toast` API—verify the exact method name in `src/components/Toast.tsx` during implementation.
- **Quality:** Run `npm run lint` and `npm run build` before merge.

---

## Open questions / clarifications

None required for a minimal implementation; optional product clarifications if stakeholders care:

- Whether **trim** is applied to passwords before length/character checks (default: validate raw input unless UX asks for trim).
- Whether **submit** should be blocked when `isSubmitting` is true if a fake delay is added later.
