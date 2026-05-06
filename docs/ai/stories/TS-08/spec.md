# Implementation Spec: TS-08 — Add Customer Listing in the Dashboard Page

## Story Metadata

| Field | Value |
|---|---|
| **JIRA Key** | TS-08 |
| **Title** | Add customer listing in the dashboard page |
| **Type** | Feature |
| **Priority** | Medium |
| **Status** | Draft |

## Story Summary

As a dashboard user, I want a **customer listing** visible on the **Dashboard Overview** page (`/dashboard`) so that I can scan representative customer records in the same shell as the existing stats, chart area, and recent transactions. The implementation is **UI only**: all customer data is **mock/static** in the frontend, with **no backend**, HTTP client, services layer, or environment-driven configuration for this data.

## Business Goal

Expose a customers table on the primary dashboard route to validate layout, typography, and dark-theme patterns for a future real customer directory—without coupling to APIs yet.

## Alignment with Project Context

Per `docs/ai/project-context.md`:

- **SPA**: React 19 + TypeScript (strict-ish flags) + Vite; extend **`src/pages/DashboardPage.tsx`** (route already registered in `src/App.tsx` under `/dashboard` with `ProtectedRoute` + `DashboardLayout`).
- **Styling**: Tailwind utility classes only; match existing dashboard **dark palette** (`bg-slate-950` context, cards `bg-slate-900/40`, borders `border-slate-800`, text hierarchy `text-white` / `text-slate-400`).
- **Components**: `React.FC` on pages; co-locate small helpers in the same file (e.g. `StatCard`, `TransactionItem` pattern) unless file size forces extraction per ~150-line guideline.
- **State/data**: No global state or fetching libraries; static constant array is sufficient.
- **Governance**: No new dependencies without justification; no `any`; no `console.log`; no inline styles; no config file edits (`vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js`) unless explicitly approved.

## Functional Requirements

1. On **`/dashboard`**, the **Dashboard Overview** page includes a distinct **Customers** listing section (heading visible to users—see UI section for exact copy).
2. The listing presents **tabular data** (semantic `<table>`) so multiple attributes per customer are scannable; not a free-form paragraph.
3. The table includes **at least these columns**:
   - **Customer** (display name)
   - **Email**
   - **Company**
   - **Status** (account lifecycle state)
   - **Joined** (date string, mock ISO-style `YYYY-MM-DD` for consistency with other story specs)
4. The table is populated with **at least five** hardcoded mock customers with **non-empty** values in every column.
5. **Status** values use **visually distinct** treatments (e.g. pill/badge styling) for at least: **Active**, **Invited**, **Churned** (or equivalent labels—implementation may normalize naming but must keep three distinguishable states in the mock set).
6. **No backend integration**: no `fetch`, no `axios`, no service modules, no `import.meta.env` usage for customer data, no loading or error UI tied to network failure (data is always present and static).
7. **No interactive data features** in scope: no pagination, sorting, filtering, search, row click navigation, edit forms, or export—unless explicitly added in a future story.

## Non-Functional Requirements

- **Performance**: Static render only; no virtualization required for ~5 rows.
- **Accessibility**: Semantic table (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<tr>`, `<td>`); table has an accessible name via `<caption>` **or** `aria-label`; header cells use `<th scope="col">`; status badges remain readable (visible text, not icon-only).
- **Security**: Static strings only; no `dangerouslySetInnerHTML`; no secrets.
- **Responsive**: Table container allows horizontal scroll on narrow viewports (`overflow-x-auto`) so the listing remains usable on small screens.
- **Consistency**: Section container, typography, and spacing should match existing dashboard cards (e.g. `rounded-2xl`, border, padding patterns used on the chart and transactions cards).

## Acceptance Criteria Breakdown

| AC # | Criteria | Implementation Notes | Verification |
|------|----------|----------------------|--------------|
| AC-1 | Customer listing appears on the dashboard route | Implement within `DashboardPage` so `/dashboard` renders the new section inside the existing layout (no new route required). | Open `/dashboard`; listing is visible without navigating away. |
| AC-2 | Section is clearly labeled as a customer listing | Use an `<h2>` or `<h3>` (consistent with existing “Recent Transactions” heading level) with text **“Customers”** and a short supporting line of muted text (e.g. **“Recent accounts on the platform”**). | Headings and copy match; hierarchy remains coherent with the page `<h1>`. |
| AC-3 | Data is UI-only / mock | Customer rows come from a `const` array in the page (or co-located module only if extraction is needed for line limits); no API layer. | Code search shows no network calls for customers; no new service files for this story. |
| AC-4 | Table shape and minimum columns | Columns present: Customer, Email, Company, Status, Joined; ≥5 rows; all cells non-empty. | DOM/RTL: correct headers and row count. |
| AC-5 | Status is visually distinct | At least three status variants appear in mock data with badge-like styling distinct in color (align with palette: e.g. emerald / amber / rose patterns used elsewhere). | Visual or class assertion per status. |
| AC-6 | Accessible table | Caption or `aria-label`; proper `<th scope="col">`. | axe/manual screen reader spot-check optional pre-test framework. |
| AC-7 | Responsive containment | Wrapper allows horizontal scroll on small widths without breaking the dashboard layout. | Resize viewport; table scrolls inside card. |
| AC-8 | Engineering quality gates | `npm run lint` and `npm run build` succeed; no `any`; no `console.log`; Tailwind-only styling. | Run project commands. |

## Impacted Areas

| Area | Files | Change Type | Notes |
|------|-------|-------------|-------|
| Pages | `src/pages/DashboardPage.tsx` | Modify | Add Customers section + mock data; optional co-located helpers (`CustomerStatusBadge`, row mapper) |
| Routes | `src/App.tsx` | **None expected** | `/dashboard` already renders `DashboardPage` |
| Components | `src/components/DashboardLayout.tsx` | **None required** | Unless future story links Customers elsewhere |
| New dependencies | `package.json` | **None** | Story is UI-only with existing stack |

## Data / API Requirements

- **Models** (inline in `DashboardPage.tsx` unless extraction required):

  ```typescript
  type CustomerStatus = 'Active' | 'Invited' | 'Churned';

  interface Customer {
    name: string;
    email: string;
    company: string;
    status: CustomerStatus;
    joined: string; // YYYY-MM-DD
  }
  ```

- **Mock dataset** (minimum expectations for planning—implementer may adjust display strings but must preserve shape, column meanings, row count ≥5, and three status variants):

  | Customer | Email | Company | Status | Joined |
  |---|---|---|---|---|
  | Alice Nguyen | alice.nguyen@example.com | Northwind Traders | Active | 2025-11-12 |
  | Ben Ortega | ben.ortega@example.com | Contoso Labs | Invited | 2026-01-04 |
  | Chandra Patel | chandra.patel@example.com | Fabrikam Inc. | Active | 2025-08-22 |
  | Diego Müller | diego.muller@example.com | Adventure Works | Churned | 2025-03-30 |
  | Elena Rossi | elena.rossi@example.com | Tailspin Toys | Active | 2026-04-18 |

- **API**: None.

## UI / UX Requirements

- **Placement**: Add a full-width section **below** the existing stats + chart/transactions grid (after the closing `</div>` of the `lg:grid-cols-3` block, still inside the page `space-y-8` container) so the listing reads as a secondary dashboard module without displacing the primary overview content.
- **Container**: Match card styling used elsewhere on the page: e.g. `bg-slate-900/40 border border-slate-800 rounded-2xl p-6`.
- **Table**:
  - Header row: uppercase / muted header pattern consistent with `ReportsPage`-style tables if present in codebase (`text-xs font-medium text-slate-400 uppercase tracking-wider`, bottom border).
  - Body cells: `text-sm text-slate-200`; row separators `border-b border-slate-800`; optional `hover:bg-slate-800/30` on rows.
  - Outer wrapper: `overflow-x-auto` and `max-w-full`.
- **Status badges**: Pill style with opacity backgrounds parallel to TS-04 patterns, e.g. Active → emerald, Invited → amber, Churned → rose.
- **Icons**: Optional `Users` or `UserCircle` from `lucide-react` near the section title if consistent with existing icon usage; not required for acceptance.

## Validation Rules

- No user input fields in this section; **no form validation** required for TS-08.

## Edge Cases

1. **Narrow/mobile width**: Horizontal scroll inside the card; no page-level horizontal overflow.
2. **Long email or company names**: Prefer `truncate` with `title` attribute only if layout breaks; mock data should stay short—truncate is optional hardening.
3. **File size / complexity**: If `DashboardPage.tsx` approaches the ~150-line soft limit, extract **only** the customer table + badge into `src/components/CustomersTable.tsx` (or similar) following PascalCase rules—prefer co-location until limit forces extraction.
4. **Auth**: `ProtectedRoute` behavior is unchanged; listing is visible whenever dashboard is visible.

## Assumptions

1. “Dashboard page” means **`DashboardPage` at `/dashboard`**, not a new top-level route.
2. Customers are **human account holders** for a B2B-style product; company name column is appropriate.
3. **Joined** is a mock static date, not real-time freshness.
4. No requirement to synchronize mock customer names with the “Welcome back, John!” greeting or transaction mock data.

## Open Questions

1. Should the **Customers** section appear **above** the chart/transactions row instead of below? (Current spec chooses below for minimal disruption; product may override.)
2. Should row actions (e.g. “View”) be added? **Default: no**—out of scope unless product confirms.
3. Should status vocabulary match future API enums exactly? (Align to **Active / Invited / Churned** until API contract exists.)

## Implementation Plan (High Level)

1. **Mock data & types**: Add `Customer` interface + `CustomerStatus` union + `mockCustomers` array in `DashboardPage.tsx` (or extracted file if needed).
2. **UI block**: Add Customers card with heading, subtitle, scrollable table, and badge helper (co-located `CustomerStatusBadge` mirroring `StatusBadge` patterns from other pages).
3. **Accessibility pass**: Caption/`aria-label`, `<th scope="col">`, ensure badges are text-labeled.
4. **Quality**: Run `npm run lint` and `npm run build`; verify responsive scroll.

## Testing Strategy

- **Manual**: Resize viewport; confirm scroll; scan for keyboard focus issues (no interactive controls required).
- **Automated** (when Vitest + RTL exist): Render `DashboardPage` and assert Customers heading, column headers, five rows, and three status texts present.
- **Regression**: Ensure existing stats, chart placeholder, and recent transactions blocks still render unchanged aside from intended layout spacing.

## Risk Checklist

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| `DashboardPage.tsx` exceeds line guideline | Medium | Low | Extract badge/table component only if needed |
| Table styling drifts from dashboard cards | Medium | Medium | Reuse exact card utility clusters from adjacent sections |
| Scope creep (CRUD, API wiring) | Medium | Medium | Explicitly defer non-UI work; keep mock array local |

## Definition of Done

- [ ] `/dashboard` shows a **Customers** listing section with mock data
- [ ] Table meets column, row count, and status-badge requirements
- [ ] No backend or network usage for customer data
- [ ] Accessible table semantics (caption or `aria-label`, scoped headers)
- [ ] Responsive horizontal scroll for the table container
- [ ] `npm run lint` passes; `npm run build` succeeds
- [ ] No forbidden patterns per project governance (`any`, `console.log`, inline styles, unapproved config edits)
- [ ] Scope limited to customer listing UI; no pagination/search/API unless separately specified
