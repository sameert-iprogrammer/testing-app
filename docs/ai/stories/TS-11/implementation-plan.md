# TS-11 Implementation Plan - User Logs Table in Profile Settings

## Objective
Add a new **User Logs** section to the Profile Settings page (`/settings`) that renders a mock-data table with `Action`, `Date & Time`, `Device`, and `Status` columns, supports an empty state, and matches the existing dark dashboard UI patterns.

## Files to touch
- `src/pages/SettingsPage.tsx` (primary implementation target)

## Implementation steps
1. **Inspect current page structure in `SettingsPage`**
   - Confirm existing card order and where profile form and any Change Password card render.
   - Identify the correct insertion point so User Logs is the last major card (or directly after Change Password if present).

2. **Define local mock log data and types**
   - In `SettingsPage`, add a small typed data structure for logs:
     - fields: `id`, `action`, `dateTime`, `device`, `status`
     - status union: `'Success' | 'Failed'`
   - Seed with representative static rows from the story spec.
   - Keep data frontend-only (no fetch/effect/service calls).

3. **Add User Logs card section**
   - Render a new card with:
     - title: `User Logs`
     - subtitle: `Recent account activity`
   - Reuse existing dark-theme card classes and spacing conventions already used on the page.

4. **Implement table UI**
   - Add an `overflow-x-auto` wrapper for responsive horizontal scrolling on narrow screens.
   - Render table with exact column order:
     1. Action
     2. Date & Time
     3. Device
     4. Status
   - Map each mock row using `id` as React key.

5. **Implement status badges**
   - Render status as compact pill badges.
   - Apply distinct visual variants:
     - Success: success-oriented palette
     - Failed: error/destructive-oriented palette
   - Keep typography/spacing consistent with existing Tailwind UI language.

6. **Implement empty state behavior**
   - If logs array length is `0`, render:
     - `No user logs available.`
   - Keep section chrome (title/subtitle/card) visible when empty.

7. **Verify acceptance criteria manually**
   - Confirm placement, columns, row rendering, badge variants, and empty state behavior.
   - Ensure no network-loading logic was introduced for logs.

8. **Run quality gates**
   - Execute:
     - `npm run lint`
     - `npm run build`
   - Address any issues caused by the new UI changes.

## Risks and mitigations
- **Risk: Incorrect placement relative to existing cards**
  - **Mitigation:** Validate rendered order directly in `SettingsPage`; keep User Logs as the final card unless Change Password exists, then place immediately after it.

- **Risk: Table layout breaks on small screens**
  - **Mitigation:** Use `overflow-x-auto` around table and avoid collapsing column semantics.

- **Risk: Visual mismatch with dark dashboard theme**
  - **Mitigation:** Reuse the same surface, border, text, and spacing class patterns already used in `SettingsPage` and dashboard cards.

- **Risk: Scope creep into API/data loading**
  - **Mitigation:** Keep data as local static mock data and avoid adding hooks/services/fetch calls.

## Definition of done checklist
- User Logs section appears on `/settings` in required position.
- Table columns and row data match AC requirements.
- Success/Failed badges are visually distinct and compact.
- Empty state message appears correctly when logs array is empty.
- No API or remote loading logic added.
- `npm run lint` and `npm run build` pass.
