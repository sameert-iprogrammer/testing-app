# Implementation Spec: TS-05 — Create Frontend-Only Audience Page with Mock Table Data

## Story Summary
Create a new frontend-only Audience page at `/audience` that displays a simple table with hardcoded mock audience data (User Name, Email, Location, Device, Last Active). Additionally, fix the sidebar navigation so that clicking "Overview" navigates to `/dashboard` and the active sidebar state reflects the current route.

## Business Goal
Provide dashboard users with a quick way to view sample audience information in a clean table format, establishing the page structure for future backend integration. This is a UI scaffolding story — no real data or API calls are involved.

## Functional Requirements
1. A new `/audience` route is registered and accessible to authenticated users.
2. The Audience page displays a heading "Audience" and subtitle "View audience insights and user details".
3. The page contains exactly one table with five columns: User Name, Email, Location, Device, Last Active.
4. The table is populated with five hardcoded mock audience records (as specified in the story).
5. No charts, cards, filters, tabs, or extra widgets appear on the Audience page.
6. Clicking "Overview" in the sidebar navigates to `/dashboard`.
7. Clicking "Audience" in the sidebar navigates to `/audience`.
8. The sidebar active state dynamically reflects the current route (Overview active on `/dashboard`, Audience active on `/audience`).

## Non-Functional Requirements
- **Performance**: Negligible — static page with 5 rows of hardcoded data.
- **Accessibility**: Table must have an `aria-label` or `<caption>`. All interactive sidebar items must be keyboard-navigable and have proper `role`/`tabIndex`.
- **Security**: Route is wrapped with `<ProtectedRoute>` (existing pattern). No user input — no XSS or validation concerns.
- **Browser Support**: Standard Tailwind CSS 4 compatibility (modern evergreen browsers).

## Acceptance Criteria Breakdown
| AC # | Criteria | Implementation Notes | Test Strategy |
|------|----------|---------------------|---------------|
| AC-1 | Audience page opens at `/audience` | Register new route in `App.tsx` wrapped with `<ProtectedRoute>` and `<DashboardLayout>`. Add `onClick` handler to Audience NavItem. | Verify URL changes to `/audience` and page renders. |
| AC-2 | Page displays heading "Audience" and subtitle "View audience insights and user details" | Add page header section matching `DashboardPage`/`ReportsPage` pattern. | Verify heading text and subtitle text in rendered output. |
| AC-3 | Only one table is shown, no extra widgets | Page contains only a header div and a single table div. No StatCards, charts, or other components. | Verify DOM contains exactly one `<table>` element and no card/chart elements. |
| AC-4 | Table displays mock data with correct columns and rows | Hardcode `mockAudience` array inline. Render table matching `ReportsPage` table pattern. | Verify all 5 column headers and 5 data rows render with correct values. |
| AC-5 | Overview sidebar click redirects to `/dashboard` | Add `onClick={() => navigate("/dashboard")}` to Overview NavItem. Remove hardcoded `active` prop. | Click Overview → verify URL is `/dashboard` and DashboardPage renders. |
| AC-6 | Sidebar active state updates correctly | Replace hardcoded `active` prop with dynamic check using `useLocation().pathname`. Each NavItem computes `active` based on current path. | Navigate to each page → verify corresponding NavItem has active styling. |

## Impacted Areas
| Area | Files | Change Type | Notes |
|------|-------|-------------|-------|
| Pages | `src/pages/AudiencePage.tsx` | New | New page component with mock data table |
| Components | `src/components/DashboardLayout.tsx` | Modify | Add `useLocation` for dynamic active state; add `onClick` to Overview and Audience NavItems |
| Routes | `src/App.tsx` | Modify | Register `/audience` route with ProtectedRoute + DashboardLayout wrapper |
| Tests | N/A | None | Testing framework not yet configured (project gap #4) |

## Data/API Requirements
- **Data Models**: Inline `AudienceMember` interface with fields: `userName: string`, `email: string`, `location: string`, `device: string`, `lastActive: string`.
- **API Endpoints**: None — this is a frontend-only story.
- **State Shape**: No global state. Mock data is a constant array defined inside the page file.
- **Error Handling**: Not applicable — no async operations or API calls.

## UI/UX Requirements
- **Layout**: Matches existing page pattern — `space-y-8` wrapper, header section with `h1` + `p`, then a single table container.
- **Styling**: Follow dark theme palette:
  - Page wrapper: `space-y-8 animate-in fade-in duration-700`
  - Header: `flex flex-col gap-1` with `text-3xl font-bold tracking-tight text-white` for h1, `text-slate-400` for subtitle
  - Table container: `bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden`
  - Table: `w-full max-w-full text-left` with `aria-label`
  - Table header: `border-b border-slate-800`, `text-xs font-medium text-slate-400 uppercase tracking-wider`, `px-6 py-4`
  - Table rows: `border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors`, `px-6 py-4`, `text-sm text-slate-200`
- **Responsive Behavior**: Table wrapped in `overflow-x-auto` div for horizontal scroll on narrow screens (matching ReportsPage pattern).
- **Interactions**: Row hover effect via `hover:bg-slate-800/30 transition-colors`.
- **Icons**: None needed on the Audience page itself.

## Validation Rules
- Not applicable — no user input fields on this page.

## Edge Cases
1. **Empty table** — Not applicable; mock data is hardcoded and always present.
2. **Long email addresses** — Table cells should handle overflow gracefully. The `overflow-x-auto` wrapper on the table container handles this at the table level.
3. **Narrow screen / mobile** — Table scrolls horizontally via `overflow-x-auto`. The sidebar is already hidden on mobile (`hidden md:flex`).
4. **Route accessed without authentication** — `<ProtectedRoute>` redirects to `/login` (existing behavior).

## Assumptions
1. The existing `<ProtectedRoute>` and `useAuth` hook are functional enough to protect the `/audience` route (they exist in the codebase already).
2. The mock data provided in the story description is the exact data to display — no additions or modifications.
3. The table styling should match the existing `ReportsPage` table pattern for consistency.
4. The sidebar active state should be determined by exact path match (e.g., `/dashboard` → Overview active, `/audience` → Audience active). Partial matching is not needed since there are no nested routes.
5. No loading state is needed since data is hardcoded and instantly available.
6. The "Overview" NavItem currently has `active` hardcoded to `true` — this will be replaced with dynamic path-based logic.

## Open Questions
1. **None** — The story description, acceptance criteria, and technical notes are sufficiently detailed for implementation.

## Implementation Plan

### Phase 1: Route Registration
1. Import `AudiencePage` in `src/App.tsx`.
2. Register a new route at `/audience` wrapped with `<ProtectedRoute>` and `<DashboardLayout>`, following the existing pattern for `/settings` and `/reports`.

### Phase 2: Create Audience Page
1. Create `src/pages/AudiencePage.tsx`.
2. Define the `AudienceMember` interface inline.
3. Define the `mockAudience` constant array with the 5 records from the story.
4. Build the page component following the existing page pattern:
   - `React.FC` type annotation, `export default`.
   - Header section with "Audience" heading and "View audience insights and user details" subtitle.
   - Single table with `overflow-x-auto` wrapper, `aria-label`, proper `<thead>` and `<tbody>`.
   - Columns: User Name, Email, Location, Device, Last Active.
   - Map over `mockAudience` to render rows.
5. Keep the file under ~150 lines.

### Phase 3: Fix Sidebar Navigation
1. In `src/components/DashboardLayout.tsx`, import `useLocation` from `react-router-dom`.
2. Add `const location = useLocation()` inside the `DashboardLayout` component.
3. Update each `NavItem` to compute `active` dynamically:
   - Overview: `active={location.pathname === "/dashboard"}`
   - Audience: `active={location.pathname === "/audience"}`
   - Reports: `active={location.pathname === "/reports"}`
   - Settings: `active={location.pathname === "/settings"}`
4. Add `onClick={() => navigate("/dashboard")}` to the Overview NavItem.
5. Add `onClick={() => navigate("/audience")}` to the Audience NavItem.
6. Remove the hardcoded `active` prop from Overview.

### Phase 4: Verification
1. Run `npm run lint` — ensure zero errors.
2. Run `npm run build` — ensure successful build.
3. Manually verify in dev server:
   - Navigate to `/audience` → page renders with table.
   - Click Overview → navigates to `/dashboard`, Overview sidebar item is active.
   - Click Audience → navigates to `/audience`, Audience sidebar item is active.
   - Click Reports → navigates to `/reports`, Reports sidebar item is active.
   - Click Settings → navigates to `/settings`, Settings sidebar item is active.

## Testing Strategy
- **Component Tests**: Not applicable — testing framework is not yet configured (project gap #4). When tests are added:
  - Test that `AudiencePage` renders the correct heading, subtitle, and table.
  - Test that all 5 mock records appear in the table.
  - Test that sidebar NavItems have correct active state based on route.
- **Integration Tests**: Verify navigation flow: Audience → Overview → Audience.
- **Accessibility Tests**: Verify table has `aria-label`, sidebar items are keyboard-navigable.

## Risk Checklist
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Sidebar active state logic conflicts with existing hardcoded `active` | Low | Low | Replace hardcoded `active` entirely with `useLocation`-based logic. |
| `useLocation` not available inside `DashboardLayout` | Low | Medium | `DashboardLayout` is already rendered inside `<BrowserRouter>` in `App.tsx`, so `useLocation` will work. |
| Table styling inconsistent with existing pages | Low | Low | Follow `ReportsPage` table pattern exactly. |
| `noUnusedLocals` lint error from unused imports | Low | Low | Ensure only needed imports are added. |

## Definition of Done
- [ ] All functional requirements implemented
- [ ] All acceptance criteria met
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] No `any` types introduced
- [ ] No `console.log` / `debugger` statements
- [ ] All new components typed with props interfaces
- [ ] New route registered in `src/App.tsx`
- [ ] Tailwind classes used (no custom CSS or inline styles)
- [ ] No hardcoded secrets
- [ ] File naming follows convention (PascalCase for components)
- [ ] Imports are ordered and clean
- [ ] Component files under ~150 lines
- [ ] Accessibility basics covered (table aria-label, keyboard navigation)
- [ ] No unrelated files modified
