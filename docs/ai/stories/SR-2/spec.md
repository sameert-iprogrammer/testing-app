# Spec — Update settings page · repo-6c7be0a9d08854cb0000

_The `repo-6c7be0a9d08854cb0000` part of a story that changes 1 repositories, built in this order: repo-6c7be0a9d08854cb0000 (workspace run wsrun-e943c231-c368-42ce-b1fc-24b2926ad710)._

## Story

Title: Update settings page
Issue: SR-2

Acceptance criteria:
- Update settings page, Include designation field against users and keep it optional.

Description:
Update settings page, Include designation field against users and keep it optional.

## Acceptance criteria

- Update settings page, Include designation field against users and keep it optional.

## This repository

_Repository: testing-app._

_The analysis isn't sure this story changes this repository: Does this story need changes in testing-app?_

_Builds first: it uses no other repository's contract._

Add an optional `designation` field to the settings page user profile form.

- `src/hooks/useProfileForm.ts` — Add `designation: string` to `ProfileFormData` (initialized to `''`) and an optional `designation?: string` key to `FormErrors` if per-field error display is used. Do not add it to the required-field validation so it stays optional. Ensure `handleInputChange`/`handleSubmit` round-trip `designation` through state and include it in the submitted payload.
- `src/pages/SettingsPage.tsx` — Add a `designation` input rendered via the existing `FormFieldProps` pattern (label "Designation", optional, no required marker), wired to `formData.designation` and `handleInputChange('designation', value)`.

Acceptance criteria carried: "Update settings page, Include designation field against users and keep it optional." The field must be present on the settings page and optional (no required marker, not validated as required). Persistence to a backend is out of scope: this repo has no API layer today, so the value is held in local form state only.

## Acceptance Criteria

- Update settings page, Include designation field against users and keep it optional.

## Contracts

`repo-6c7be0a9d08854cb0000` provides and uses no contract shared with another repository in this run.

## Builds against

`repo-6c7be0a9d08854cb0000` depends on no other repository in this run.
