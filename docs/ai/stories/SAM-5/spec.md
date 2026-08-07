# SAM-5: Add Users Listing

## Story Metadata
- **JIRA Key:** SAM-5
- **Title:** Add users listing
- **Description:** Add users listing after login

## Overview
This story implements a dedicated "Users" page that displays a paginated, searchable table of all system users. The page is accessible via the main dashboard navigation after login, follows the existing dark-themed Tailwind design system, and adheres to the current routing and protection patterns.

## Acceptance Criteria
1. [ ] A new `/users` route is added to `src/App.tsx`.
2. [ ] The `/users` route is wrapped in `<ProtectedRoute>` and `<DashboardLayout>`.
3. [ ] A "Users" navigation item is added to the `DashboardLayout` sidebar/menu, linking to `/users`.
4. [ ] The page renders a data table showing user records with columns: Name, Email, Role, and Status.
5. [ ] A text search input filters the table results in real-time by name or email.
6. [ ] Pagination controls (previous/next or numbered pages) are rendered when the dataset exceeds the configured page size.
7. [ ] The UI uses the existing project conventions: `slate` color palette, `bg-slate-900/40` card backgrounds, `border-slate-800`, `text-slate-200`, and `lucide-react` icons.
8. [ ] Fetch or data-loading states display a loading indicator; errors trigger a `Toast` notification via `useToast`.
9. [ ] The implementation uses TypeScript interfaces and type-safe props consistent with `SettingsPage` and `ReportsPage`.

## Requirements

### UI/UX Design
- **Theme & Layout:** Matches the dark UI of `DashboardPage` and `SettingsPage`. Primary background `bg-slate-950`, card containers `bg-slate-900/40 border border-slate-800 rounded-2xl`.
- **Table Layout:** 
  - Header row with sortable column titles.
  - Row height and spacing consistent with modern data tables.
  - Status column renders a pill/badge (e.g., Active = `bg-emerald-500/10 text-emerald-400`, Inactive = `bg-slate-700/50 text-slate-400`).
- **Interactivity:** Search input placed above the table. Pagination controls centered below. No edit/delete actions for this sprint.

### Technical Implementation Notes
- **File Structure:**
  - `src/pages/UsersPage.tsx` – Route component, handles layout wrapper and passes search/pagination state.
  - `src/components/UsersTable.tsx` – Renders the table, search input, and pagination.
  - `src/hooks/useUsers.ts` – Manages data fetching, filtering, sorting, and pagination state.
  - `src/types/user.ts` (or inline) – `User` interface: `{ id: string; name: string; email: string; role: string; status: 'Active' | 'Inactive' }`.
- **Data Source:** No backend endpoint is specified. I will implement a mock data fetch function that returns a static array of users, wrapped in the same `fetch` pattern expected for future API integration. A `useEffect` will trigger on mount.
- **State Management:** Local `useState` for `searchQuery`, `currentPage`, `pageSize`, and `filteredUsers`. `useMemo` for filter/sort calculations to maintain performance.
- **Accessibility:** Semantic `<table>`, `<thead>`, `<tbody>`, `aria-label` on inputs, keyboard-navigable pagination buttons, and proper color contrast ratios per `slate` palette.

## Assumptions
1. **Data Source:** The story scope does not include backend integration. A mock data provider (static JSON array + simulated async delay) will be used. Future stories will swap this for a real API call.
2. **User Model:** Each user record contains `id`, `name`, `email`, `role`, and `status` (`Active`/`Inactive`). No avatar images are required; initials will be used if a placeholder is needed.
3. **Access Control:** The existing `useAuth` hook authenticates users but does not yet enforce Role-Based Access Control (RBAC) for routing. All authenticated users can view the users list.
4. **Navigation Placement:** The "Users" link will be inserted into the `DashboardLayout` navigation menu immediately after "Dashboard" and before "Reports", maintaining alphabetical or logical grouping.
5. **Pagination Default:** `pageSize` defaults to `10`. Sorting defaults to `name` ascending.

## Open Questions

{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "Should the users table include action columns (e.g., Edit, View Details, Toggle Status) or remain strictly read-only for this story?", "whyItMatters": "Determines whether to wire up modal/form components and handler hooks now, or defer to a follow-up story.", "impactIfWrong": "If actions are expected but omitted, the implementation will need refactoring; if included unnecessarily, scope creep occurs.", "options": [{"key": "opt_a", "label": "Read-only (view only)", "consequence": "Simpler component, focuses on listing/search/pagination. Actions deferred."}, {"key": "opt_b", "label": "Include 'View Details' action", "consequence": "Adds a detail modal or sub-route. Moderate scope increase."}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q2", "question": "What should be the behavior when the user searches while on a non-first pagination page?", "whyItMatters": "Affects UX flow and hook logic. Resetting to page 1 prevents empty-state confusion.", "impactIfWrong": "Staying on the current page may show no results even if matching users exist on other pages.", "options": [{"key": "opt_a", "label": "Auto-reset to page 1", "consequence": "Standard table behavior. Guarantees results are visible."}, {"key": "opt_b", "label": "Stay on current page", "consequence": "May show empty table until user manually navigates. Less intuitive."}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q3", "question": "Should column sorting be enabled on all columns or restricted to Name and Email?", "whyItMatters": "Impacts the sorting logic in `useUsers.ts` and the header UI (chevron icons).", "impactIfWrong": "Over-engineering if only 2 columns need sort; broken UX if role/status sorts incorrectly due to string/date types.", "options": [{"key": "opt_a", "label": "Sort all columns", "consequence": "Full functionality, more state/logic to test."}, {"key": "opt_b", "label": "Sort only Name and Email", "consequence": "Faster implementation, matches common admin panel defaults."}], "default": "opt_a", "allowFreeText": true, "blocking": false}], "assumptions": [{"statement": "Mock data will consist of 25-30 users with varied roles and statuses to demonstrate pagination and filtering effectively.", "risk": "low"}, {"statement": "The toast notification system already in place (`useToast`) will be reused for error states (e.g., failed mock fetch).", "risk": "low"}]}}
