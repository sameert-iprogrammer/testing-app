# SAM-1: Add Users Page with Listing

## Overview
Add a new Users page to the application that displays a table/list of users with basic user information. This page will be accessible from the dashboard navigation and will follow the existing application patterns and styling conventions.

## Requirements

### Functional Requirements
1. Create a new `UsersPage` component at `src/pages/UsersPage.tsx`
2. The page must display a list of users in a table format
3. Each user row must display: User Name, Email, Role, and Status
4. The page must be protected (require authentication) using the existing `ProtectedRoute` component
5. The page must integrate with the existing `DashboardLayout` component for consistent navigation and header
6. Use mock data initially, following the same pattern as `ReportsPage.tsx`

### UI Requirements
1. The page must use Tailwind CSS for styling, matching the existing design system
2. User status must be displayed with a status badge component (similar to `StatusBadge` in `ReportsPage.tsx`)
3. The page must use `lucide-react` icons where appropriate (e.g., User icon for the page header)
4. Toast notifications may be used for any user actions (add, edit, delete)

### Routing Requirements
1. Add a new route for the Users page in `src/App.tsx`
2. The route must be protected by `ProtectedRoute`
3. The route must be accessible from the dashboard navigation (requires navigation update in `DashboardLayout.tsx`)

## Acceptance Criteria
- [ ] `UsersPage` component exists at `src/pages/UsersPage.tsx` and exports a default component
- [ ] The page displays a table/list of mock users with columns: Name, Email, Role, Status
- [ ] The page integrates with `DashboardLayout` for navigation context
- [ ] The page is protected by `ProtectedRoute` (only accessible when authenticated)
- [ ] User status is rendered with a `StatusBadge`-style component with color coding (Active/Inactive/Deactivated)
- [ ] The page follows the existing React + TypeScript + Tailwind CSS patterns
- [ ] Mock user data is defined in the page file (similar to `mockReports` in `ReportsPage`)
- [ ] The app routing in `src/App.tsx` includes the new UsersPage route
- [ ] The dashboard navigation in `src/components/DashboardLayout.tsx` includes a link to the Users page

## Implementation Notes

### File Locations
- New component: `src/pages/UsersPage.tsx`
- Routing update: `src/App.tsx`
- Navigation update: `src/components/DashboardLayout.tsx`

### Design Patterns to Follow
- **Component Structure**: Follow the pattern in `ReportsPage.tsx` with interfaces for data types, mock data array, and a main page component
- **Status Badges**: Implement a `StatusBadge` component matching the pattern from `ReportsPage.tsx` for user status display (different color coding for Active/Inactive/Deactivated)
- **Layout**: Use `DashboardLayout` as the wrapper component (consistent with other protected pages)
- **Icons**: Use `lucide-react` icons (`User`, `Mail`, `Shield` or similar for roles, `CheckCircle`/`XCircle` for status)
- **Styling**: Use Tailwind CSS utility classes, matching the existing codebase style

### Mock Data Structure
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Deactivated';
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'Inactive' },
  { id: '4', name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Manager', status: 'Active' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', status: 'Deactivated' },
];
```

## Open Questions

| ID | Question | Why It Matters | Options & Impact |
|---|---|---|---|
| Q1 | **What user fields/properties should be displayed in the listing?** | Defines the data model and column structure of the table | **Default (opt_a):** Name, Email, Role, Status — four standard columns matching common user management patterns. Impact if wrong: Missing critical fields (e.g., role) renders the page incomplete; extra fields (e.g., phone, department) add UI complexity not requested. |
| Q2 | **What user actions should be supported on this page?** | Defines whether the table is read-only or includes interactive actions per row | **Default (opt_a):** Read-only listing only (no edit/delete/action buttons). Impact if wrong: Including actions prematurely scope-creeps beyond "listing"; excluding actions when they're expected forces a follow-up story with no incremental value delivered. |

## Assumptions

| Statement | Risk |
|---|---|
| Mock data will be used initially, following the same pattern as `ReportsPage.tsx` | Low — API integration can be added in a follow-up story |
| Basic 4-column table: Name, Email, Role, Status | Low — additional fields can be added when required |
| No search, filter, or pagination functionality for this story | Low — these are common enhancements for later iterations |
| No CRUD actions (add/edit/delete) on user rows for this story | Low — action buttons can be added when business logic requires them |
| The new Users page will be added to the sidebar navigation in `DashboardLayout.tsx` alongside existing pages (Dashboard, Reports, Settings) | Low — consistent with existing navigation patterns |

## References
- `src/pages/ReportsPage.tsx` — Reference implementation for list page with status badges and mock data
- `src/components/DashboardLayout.tsx` — Layout wrapper and navigation structure
- `src/components/ProtectedRoute.tsx` — Route protection mechanism
- `src/components/Toast.tsx` — Toast notification system
- `src/pages/DashboardPage.tsx` — Example of a protected dashboard page

{"clarification":{"needed":true,"questions":[{"id":"q1","question":"What user fields/properties should be displayed in the listing table?","whyItMatters":"Defines the data model (User interface) and column structure of the table, directly affecting the component implementation.","impactIfWrong":"Missing critical fields (e.g., role) renders the page incomplete for its intended purpose; extra fields not requested add UI complexity and increase implementation time unnecessarily.","options":[{"key":"opt_a","label":"Name, Email, Role, Status","consequence":"Standard 4-column user management table; matches common patterns and delivers value without scope creep."},{"key":"opt_b","label":"Include additional fields (e.g., Department, Last Login, Phone)","consequence":"Expands the data model and table width; requires more mock data and potentially different column layouts."}],"default":"opt_a","allowFreeText":true,"blocking":true},{"id":"q2","question":"What user actions should be supported on the user listing page?","whyItMatters":"Determines whether the table is read-only or includes interactive action buttons (View, Edit, Delete, Deactivate, etc.) per row.","impactIfWrong":"Including actions prematurely scope-creeps beyond the \"listing\" description and requires mock action handlers; excluding actions when they are expected forces a minimal first story with no incremental value, requiring a follow-up story immediately.","options":[{"key":"opt_a","label":"Read-only listing only (no action buttons)","consequence":"Delivers a clean listing page; action buttons can be added in a follow-up story when business logic (edit/delete workflows) is defined."},{"key":"opt_b","label":"Include action buttons (View/Edit/Delete)","consequence":"Adds interactive UI elements (icons, dropdowns, or inline buttons) and requires mock handlers; delivers more value but increases complexity and risk of over-engineering before requirements are clear."}],"default":"opt_a","allowFreeText":true,"blocking":true}],"assumptions":[{"statement":"Mock data will be used initially, following the same pattern as ReportsPage.tsx.","risk":"low"},{"statement":"The table uses 4 columns: Name, Email, Role, Status.","risk":"low"},{"statement":"No search, filter, or pagination functionality is included in this story.","risk":"low"},{"statement":"No CRUD actions (add/edit/delete) on user rows are included in this story.","risk":"low"},{"statement":"The Users page will be added to the sidebar navigation in DashboardLayout.tsx alongside existing pages.","risk":"low"}]}}
