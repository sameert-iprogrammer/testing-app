# TS-11 — Add User Logs Table in Profile Settings Page

## Metadata

| Field | Value |
| --- | --- |
| JIRA key | TS-11 |
| Title | Add User Logs Table in Profile Settings Page |
| Primary surface | Profile Settings (`/settings`, `SettingsPage` in `src/pages/SettingsPage.tsx`) |

## User story

As a user, I want to view recent account activity logs on the Profile Settings page, so that I can quickly check basic actions performed on my account.

## Problem and outcome

- **Problem:** Users cannot see a simple, read-only history of account-related actions from the settings screen.
- **Outcome:** A new **User Logs** section appears on Profile Settings with a minimal table of mock activity rows, styled consistently with the existing dark dashboard, plus a clear empty state when there are no rows.

## Scope

### In scope

- Add a **User Logs** card/section on the Profile Settings page, **below** the existing profile settings content (see Placement).
- Render a **simple table** of mock user activity logs (static frontend data only).
- Match existing **page theme, spacing, colors, and card** patterns (Tailwind utility styling aligned with other dashboard pages).
- Keep the UI **minimal** and consistent with the **dark dashboard** layout.
- Show an **empty state** when the logs array has length zero.
- **Status** values appear as small **badges** with visually distinct **Success** vs **Failed** styling.

### Out of scope

- Backend API integration, service modules, or environment-based endpoints.
- Pagination, filtering, sorting, search.
- Export/download of logs.
- Detailed log view, modal, or row drill-down.
- New routes or navigation entries.
- Changes to authentication, `ProtectedRoute`, or backend-related files (none exist today; do not add them for this story).

## Functional requirements

1. **Section visibility:** On load of Profile Settings, a section titled **User Logs** is visible with subtitle **Recent account activity**.
2. **Table structure:** The section contains a table with exactly these columns, in order:
   - **Action** — human-readable activity name.
   - **Date & Time** — when the action occurred (display string as provided in mock data).
   - **Device** — device or browser description.
   - **Status** — `Success` or `Failed` (rendered as badges per Non-functional requirements).
3. **Mock data source:** Log rows come from a **hardcoded** array in the frontend (inline in `SettingsPage` or a small colocated mock module under `src/`). No network requests for this feature.
4. **Empty state:** If the logs array is empty, the section still renders, but the table area shows the message: **No user logs available.**

## UI requirements

### Placement

Vertical order on Profile Settings:

1. Profile Settings header and existing profile form/content (current page structure).
2. **Change Password** card (when present in the page layout — place **User Logs** immediately **after** that card).
3. **User Logs** card.

If the Change Password block is not yet present in code, implement **User Logs** below the existing profile settings card(s) so it remains the **last** major card on the page until Change Password exists.

### Visual and layout

- Use the same card/surface patterns as other screens (e.g. `bg-slate-900/40`, `border-slate-800`, rounded containers, spacing consistent with `SettingsPage` and `DashboardLayout`).
- **Status badges:** Small pill-style badges — **Success** uses a success-oriented palette; **Failed** uses an error/destructive-oriented palette (reuse existing badge-like Tailwind patterns if already used elsewhere; otherwise introduce minimal utility-class badges consistent with the theme).
- **Responsive table:** Table remains readable on narrow viewports; allow **horizontal scroll** (`overflow-x-auto` wrapper) when needed rather than breaking column semantics.

## Data model (mock)

Each log entry should include at least:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `number` | Stable row key for React lists. |
| `action` | `string` | Shown in **Action** column. |
| `dateTime` | `string` | Preformatted display string for **Date & Time**. |
| `device` | `string` | Shown in **Device** column. |
| `status` | `'Success' \| 'Failed'` | Drives badge variant. |

**Example mock dataset** (representative; implementation may match or extend):

- Profile updated — 12 May 2026, 10:30 AM — Chrome on Windows — Success  
- Password changed — 11 May 2026, 06:15 PM — Safari on Mac — Success  
- Login attempt — 10 May 2026, 09:45 AM — Chrome on Android — Failed  

## Non-functional requirements and project alignment

Align with `docs/ai/project-context.md`:

- **Stack:** Vite + React + TypeScript + Tailwind v4; no new global state library for this feature.
- **Location:** Implement on `SettingsPage` (`src/pages/SettingsPage.tsx`) or extract a **single-use** subcomponent colocated with that page if it improves readability.
- **Styling:** Prefer Tailwind utility composition; keep dark-dashboard **slate/indigo** visual language and spacing rhythm.
- **Icons:** Use `lucide-react` only if icons are needed; do not add icon libraries.
- **Quality gates:** After implementation, run `npm run lint` and `npm run build` for meaningful UI changes.
- **Governance:** Minimal, task-scoped edits; do not bypass auth or move shell concerns out of `DashboardLayout`; do not add secrets or unsafe HTML injection for log text.

## Acceptance criteria

| ID | Criterion |
| --- | --- |
| AC1 | Given an authenticated user opens **Profile Settings** (`/settings`), when the page loads, then a section titled **User Logs** is visible below the existing profile settings content (and below **Change Password** when that section exists). |
| AC2 | Given mock user logs are defined in the frontend, when the **User Logs** section renders, then the table shows columns **Action**, **Date & Time**, **Device**, and **Status**, and each row displays the corresponding mock fields. |
| AC3a | Given a row has status **Success**, when rendered, then **Status** appears as a **small success-style badge**. |
| AC3b | Given a row has status **Failed**, when rendered, then **Status** appears as a **small failed/error-style badge**. |
| AC4 | Given the logs array is empty, when the **User Logs** section renders, then the user sees the empty state message **No user logs available.** (section chrome/title may remain visible). |
| AC5 | Given the Profile Settings page loads, when the **User Logs** section is shown, then log data is supplied **only** from frontend mock data (no `fetch`, no API client calls, and no `useEffect` or other hook whose purpose is loading logs from a remote source). |

## Definition of done

- All acceptance criteria AC1–AC5 satisfied on `/settings` within `DashboardLayout` / `ProtectedRoute` as today.
- No new routes; no backend or API client added for logs.
- Lint and build succeed after changes.
- Visual consistency with existing dark dashboard cards and typography.

## Open questions

None — requirements are sufficient for implementation planning. If **Change Password** is absent from `SettingsPage` at implementation time, default placement is after the profile form card; reconcile with this spec when Change Password is added.
