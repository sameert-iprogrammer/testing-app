## Goal
Add an optional `designation` field to the user profile form on the settings page. The field is present in the UI, round-trips through local form state, and is never validated as required.

## Steps

1. **`src/hooks/useProfileForm.ts`**
   - Add `designation: string` to the `ProfileFormData` interface.
   - Initialize `designation` to `''` in the initial form-data state so the field is present but empty.
   - Add `designation?: string` to the `FormErrors` interface so per-field error display is available if used later; do not add a required-field validation for it, keeping it optional.
   - Ensure `handleInputChange` already handles arbitrary `keyof ProfileFormData` keys (it does, per its signature `handleInputChange(field: keyof ProfileFormData, value: string)`), so `designation` is covered with no change needed there.
   - In `handleSubmit`, include `designation` in the submitted payload (the object passed to the toast callback / any downstream consumer). Do not add a `validateRequired` call for `designation`.

2. **`src/pages/SettingsPage.tsx`**
   - Add a `designation` input rendered via the existing `FormFieldProps` pattern, matching how other fields are rendered.
   - Use the label "Designation".
   - Do not add a required marker (no `*` or required indicator) so the field reads as optional.
   - Wire it to `formData.designation` for the value and `handleInputChange('designation', value)` for updates.
   - Place it in the form alongside the other profile fields, following the existing layout/ordering convention.

## Risks
- **Validation regression**: If `handleSubmit` iterates over all `ProfileFormData` keys and calls `validateRequired` on each, `designation` would be wrongly required. The plan explicitly excludes it from required validation; the implementer must verify the existing loop does not auto-include new keys.
- **Payload shape**: `handleSubmit` currently builds a payload from known fields; adding `designation` to that payload is required by the spec. If the payload is built by spreading `formData`, the new key is included automatically; if it is built field-by-field, the implementer must add `designation` explicitly.
- **UI consistency**: The new input must follow the existing `FormFieldProps` pattern exactly (same wrapper, same input classes, same error-display slot) so it matches the other fields visually and behaviorally.

## Files to Touch
- Modify `src/hooks/useProfileForm.ts` — add `designation` to `ProfileFormData`, `FormErrors`, initial state, and submitted payload; keep it out of required validation.
- Modify `src/pages/SettingsPage.tsx` — add a `designation` input via `FormFieldProps`, label "Designation", optional, wired to `formData.designation` and `handleInputChange('designation', value)`.

## Context Budget
- Two files only. No new files, no new dependencies, no routing changes, no layout changes. The change is additive to existing interfaces and the existing form-rendering pattern. No backend or API work: the value lives in local form state only, as the spec states.

## Assumptions
- `handleInputChange` is a generic handler keyed on `keyof ProfileFormData` (confirmed by its signature), so no change is needed there for the new field.
- `handleSubmit` builds its submitted payload from the form-data object; if it spreads `formData`, `designation` is included automatically; if it lists fields explicitly, the implementer adds `designation` to that list. Either way the field is included in the payload per the spec.
- The existing `FormFieldProps` pattern supports an optional field (no required marker); if the current `FormFieldProps` interface has a `required` flag, the new field passes `required={false}` or omits the flag, matching how other optional fields are rendered.
