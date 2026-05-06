# Review Pointers — TS-08 Cycle 1 (Password Change Form)

## 1. Review summary

The change adds a UI-only password change flow on Settings: trimmed validation, strength rules, cross-field checks (confirm match, new ≠ current), a live checklist, show/hide toggles, disabled submit until valid, honest toast copy, and no persistence/network in the hook. Behavior matches `docs/ai/stories/TS-08/implementation-plan.md` for the reviewed code paths.

**Verdict: APPROVED_WITH_RECOMMENDATIONS** — no BLOCKER issues; fix or justify HIGH items before PR.

---

## 2. Source of truth

- `docs/ai/project-context.md`
- `docs/ai/stories/TS-08/implementation-plan.md`
- Working tree: `src/pages/SettingsPage.tsx`, `src/hooks/usePasswordChangeForm.ts` (and user-provided diff)

---

## 3. File-level pointers

| File | Assessment |
|------|------------|
| `src/hooks/usePasswordChangeForm.ts` | **Compliant:** `normalizePasswordInput`, single special-character set + membership check, `useMemo` for checklist + `isFormValid`, submit clears `newPassword`/`confirmPassword` and errors, non-deceptive toast, no `fetch`/storage/logging. Validation logic aligns with plan steps A.1–A.6. |
| `src/pages/SettingsPage.tsx` | **Mostly compliant:** Second `max-w-2xl` card, labels/`aria-invalid`/`aria-describedby`/`role="alert"`, checklist bound to hook, `disabled={!isPasswordFormValid}`, UI-only disclaimer, Lucide icons, Tailwind matches profile card. **Gaps:** page file far over project ~150-line guidance; three visibility toggles share the same accessible name (see HIGH). |

---

## 4. Plan compliance (implementation-plan.md)

| Area | Status | Notes |
|------|--------|--------|
| Hook: state + trimmed rules + cross-field | IMPLEMENTED | `usePasswordChangeForm.ts` |
| Checklist booleans + dynamic updates | IMPLEMENTED | `ruleChecklist` + `useMemo` |
| `handleSubmit(e, showToast)` + clear new/confirm | IMPLEMENTED | No current-password clear (plan only required new/confirm) |
| Second section + form + checklist + toggles | IMPLEMENTED | `SettingsPage.tsx` |
| `disabled={!isFormValid}` pattern | IMPLEMENTED | `isPasswordFormValid` |
| No backend / no password storage | IMPLEMENTED | Hook + page |
| Step C: `npm run lint` / `npm run build` | NOT VERIFIED IN REVIEW | Confirm locally before PR (MEDIUM / process). |

---

## 5. Scope creep

No unrelated edits in the reviewed files; profile form wiring appears unchanged aside from formatting.

---

## 6. Findings by severity

### BLOCKER

- None identified.

### HIGH

- **Indistinguishable names for password visibility toggles**
  - **File:** `src/pages/SettingsPage.tsx` (`PasswordFormField`)
  - **Description:** Each toggle uses the same `aria-label` / hide text (`Show password` / `Hide password`) without naming which field (current / new / confirm). Multiple controls with the same accessible name fail practical WCAG **4.1.2** expectations and hurt screen-reader UX on `/settings`.
  - **Fix:** Add a prop (e.g. `visibilityLabelSuffix` or `fieldName`) and set labels like “Show current password” / “Hide new password”, etc., per field instance.

### MEDIUM

- **`SettingsPage.tsx` far exceeds ~150-line component guideline**
  - **File:** `src/pages/SettingsPage.tsx`
  - **Description:** Project context and plan both warn about page size; the file is ~320+ lines. Logic is partially extracted to the hook, but the presentational block is still large for review and reuse.
  - **Fix:** Extract `PasswordFormField` and/or the security card into a co-located helper file or `src/components/` module (keep profile behavior unchanged).

- **Duplicated rule checks in submit vs checklist**
  - **File:** `src/hooks/usePasswordChangeForm.ts`
  - **Description:** `handleSubmit` repeats strength ordering with separate branches while `ruleChecklist` already encodes the same rules. Works today but risks drift if one path is edited.
  - **Fix:** Derive submit errors from the same boolean helpers or a single validation function that both `isFormValid` and `handleSubmit` call.

- **Lint/build not evidenced**
  - **File:** N/A (process)
  - **Description:** Plan Step C requires `npm run lint` and `npm run build` before done.
  - **Fix:** Run both and fix any reported issues before merge.

### LOW

- **`autoComplete` on confirm field**
  - **File:** `src/pages/SettingsPage.tsx` (`PasswordFormField`)
  - **Description:** Non-current fields both use `new-password`. Some UAs/password managers behave slightly better if confirm uses a distinct token where appropriate; not required by the plan.
  - **Fix:** Optional—pass per-field `autoComplete` (e.g. `current-password` / `new-password` / `new-password` or documented confirm token) via props if product wants finer browser hints.

---

## 7. Must-fix items

| Severity | Item | File |
|----------|------|------|
| — | **No BLOCKER must-fixes.** | — |
| HIGH (recommended before merge) | Unique accessible names per password visibility toggle | `src/pages/SettingsPage.tsx` |

---

## 8. Security quick check

- No `console.log` of secrets; no `fetch`/axios; no `localStorage`/`sessionStorage` for passwords in reviewed code. Toast copy states demo / not saved — aligns with AC-6 tone.

---

## 9. Final verdict

**APPROVED_WITH_RECOMMENDATIONS** — implementation matches the TS-08 plan for behavior and constraints. Address the **HIGH** accessible-name issue on the three toggles (and run **lint/build** for Definition of Done) before treating the branch as merge-ready.
