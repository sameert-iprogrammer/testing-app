# SAM-8: Users listing

## Story Metadata
- **JIRA Key:** SAM-8
- **Title:** Users listing
- **Description:** Add users listing with mock data
- **Priority:** [To be determined by pipeline]
- **Component/Module:** `src/pages/UsersPage.tsx`, `src/data/users.ts` (or inline), `src/App.tsx` (routing)

## Acceptance Criteria
1. [ ] Navigating to `/users` renders the `UsersPage` component.
2. [ ] The page displays a table (or structured list) containing mock user data.
3. [ ] Each user row displays: Name, Email, Role, and Status.
4. [ ] The Status column uses a visual indicator (e.g., colored badge or dot) to distinguish between statuses (e.g., Active, Inactive, Pending).
5. [ ] The page renders all mock users in a single view without pagination controls or infinite scroll.
6. [ ] The page contains no search input, filter dropdowns, or sorting controls.
7. [ ] The page is wrapped in the existing `DashboardLayout` component.
8. [ ] The route is protected by the existing `ProtectedRoute` component.
9. [ ] A navigation link for "Users" is added to the dashboard navigation/sidebar to allow access to the page.

## Requirements
- **Page Component:** Create `src/pages/UsersPage.tsx`.
- **Routing:** Add a `/users` route in `src/App.tsx` using `react-router-dom` v7 syntax, wrapped in `ProtectedRoute`.
- **Navigation:** Add a "Users" item to the `DashboardLayout` navigation menu (sidebar or header, consistent with existing layout structure).
- **Data:** Provide a static array of mock user objects. Minimum 5-10 entries recommended for realistic table rendering.
- **Styling:** Use Tailwind CSS utility classes. Match the existing project's neutral/brand color palette and typography scale.
- **Icons:** Use `lucide-react` for any status indicators or action icons, consistent with the project's existing iconography.

## UI/UX Notes
- **Layout:** Standard dashboard shell. Main content area should have appropriate padding and max-width constraints.
- **Table Design:** Clean, bordered or striped table header. Rows should have hover states for readability.
- **Status Badges:** 
  - `Active`: Green/Primary tone
  - `Inactive`: Gray/Neutral tone
  - `Pending`: Amber/Yellow tone
- **Responsiveness:** Table should be horizontally scrollable on small viewports, or adapt to a card-based layout if screen width is constrained (< 640px).
- **Empty State:** Not required initially given mock data is always present, but structure should allow for future empty states.

## Implementation Notes
- **File Structure:**
  ```text
  src/pages/UsersPage.tsx
  src/data/users.ts (optional, or inline in UsersPage)
  src/components/DashboardLayout.tsx (update navigation)
  src/App.tsx (update routes)
  ```
- **Routing:** Use `react-router-dom` v7 `<Route>` syntax. Example: `<Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />`
- **Component Composition:** Keep `UsersPage` focused on layout and data rendering. Extract a `UserTable` component if the JSX exceeds ~60 lines, otherwise keep it monolithic within the page file for simplicity.
- **Mock Data:** Define a `User` interface and a constant array `MOCK_USERS`. Ensure IDs are unique strings or numbers.
- **Styling:** Leverage Tailwind's `table`, `divide-y`, `px-4`, `py-3`, `text-sm`, `font-medium` utilities for consistent table styling.

## Data Model
```typescript
export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Pending' },
  { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'Viewer', status: 'Active' },
];
```

## Resolved Decisions
- **Pagination/Scrolling:** Display all users at once. No pagination or infinite scroll will be implemented.
- **Search/Filter:** No search input or filter functionality will be included on this page.

## Assumptions
1. The existing `DashboardLayout` includes a navigation structure (sidebar or top nav) that can be extended with a "Users" link without architectural changes.
2. The project's color palette and typography are defined in `tailwind.config.js` and standard Tailwind utilities will suffice; no custom CSS variables or theme extensions are required for this story.
3. Mock data is static and does not require API integration or state management hooks for this iteration.
4. `react-router-dom` v7 is configured and working; standard v7 route registration syntax applies.
5. The page will only be accessible to authenticated users, enforced by `ProtectedRoute`.

## References
- Existing Pages: `src/pages/DashboardPage.tsx`, `src/pages/ReportsPage.tsx`
- Existing Components: `src/components/DashboardLayout.tsx`, `src/components/ProtectedRoute.tsx`
- Dependencies: `react-router-dom@^7.14.2`, `lucide-react@^1.14.0`, `tailwindcss`
