# MIS-16: Users page

## Story Metadata
- **JIRA Key**: MIS-16
- **Title**: Users page
- **Description**: Add users page with mock listing data

## Acceptance Criteria
1. A new `UsersPage` component is created at `src/pages/UsersPage.tsx`.
2. The page renders a static table displaying mock user data.
3. Mock data contains at least 5–10 entries with columns: Name, Email, Role, Status, Last Active.
4. A navigation link labeled "Users" is added to the `DashboardLayout` sidebar/header.
5. The `/users` route is registered in `App.tsx` and wrapped in `ProtectedRoute`.
6. The page renders correctly when navigating to `/users` and displays the static table without any search or filter controls.

## UI Notes
- **Layout**: Full-width table inside the existing dashboard layout, matching the spacing and typography of `ReportsPage` and `DashboardPage`.
- **Columns**:
  - Name (plain text)
  - Email (plain text)
  - Role (plain text, e.g., Admin, Editor, Viewer)
  - Status (text or simple inline badge, e.g., Active, Inactive)
  - Last Active (formatted date string)
- **Styling**: Use Tailwind CSS utility classes consistent with the existing codebase. No custom CSS files.
- **Interactivity**: None. The table is purely static for this story.

## Implementation Notes
- **File Creation**:
  - `src/pages/UsersPage.tsx`: Component definition and mock data array.
- **Routing**:
  - Add `<Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />` to the route configuration in `src/App.tsx`.
- **Navigation**:
  - Update `src/components/DashboardLayout.tsx` to include a link to `/users` in the sidebar/header menu. Use a relevant icon from `lucide-react` (e.g., `Users` or `User`).
- **Data Structure**:
  ```typescript
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive';
    lastActive: string;
  }
  ```
- **Mock Data**: Hardcode an array of 5–10 realistic user objects directly in `UsersPage.tsx`.
- **Status Display**: Reuse `StatusBadge` from `ReportsPage` if it fits, or render status as a simple styled `<span>` with Tailwind classes.

## Resolved Decisions
- **Search/Filter**: The Users page will be a static table only. No client-side search or filter functionality is required for this story.
- **Navigation**: The navigation link for the Users page will be added to the `DashboardLayout` sidebar/header in this story, rather than being deferred to a later iteration.

## Assumptions
- The existing `DashboardLayout` component structure can accommodate a new navigation item without layout breaks.
- The project's routing setup (React Router v7) supports standard declarative `<Route>` elements inside `App.tsx`.
- No API calls or external data fetching are needed; all data is static and defined locally.
- Existing component conventions (functional components, TypeScript interfaces, Tailwind styling) apply to the new page.

## References
- Existing pages: `src/pages/ReportsPage.tsx`, `src/pages/DashboardPage.tsx`
- Layout: `src/components/DashboardLayout.tsx`
- Routing: `src/App.tsx`
- UI Library: `lucide-react`
- Styling: Tailwind CSS (configured via `tailwind.config.js` and `postcss.config.js`)
