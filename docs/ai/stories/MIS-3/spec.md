# MIS-3: Users Page

## Story Metadata
- **JIRA Key:** MIS-3
- **Title:** Users page
- **Description:** Users page with mock data listing
- **URL Path:** `/users`

## Overview
Implement a read-only Users page that displays a list of users with mock data. The page will be accessible at `/users`, protected by authentication, and styled consistently with the existing dashboard layout. A top-level "Create User" button will be present for future functionality.

## Acceptance Criteria
1. **Route & Protection:** The page is accessible at `/users` and is wrapped in a `ProtectedRoute` component, ensuring only authenticated users can view it.
2. **Layout:** The page uses the existing `DashboardLayout` component for consistent header/sidebar structure.
3. **Data Display:** The page renders a table displaying mock user data.
4. **Columns:** Each user record displays the following fields: `id`, `name`, `email`, `role`, `status`, `createdAt`.
5. **Read-Only:** The list is strictly read-only. No inline editing or row-level actions are implemented.
6. **Create User Button:** A "Create User" button is present at the top of the page.
7. **Mock Data:** Data is hardcoded or generated via a local utility function. No API calls are made.
8. **Styling:** Uses Tailwind CSS classes consistent with the existing codebase (e.g., matching `DashboardPage.tsx` and `ReportsPage.tsx` styling patterns).
9. **TypeScript:** Fully typed with TypeScript interfaces matching the resolved field list.

## UI/UX Requirements
- **Header:** Standard dashboard header provided by `DashboardLayout`.
- **Action Bar:** Contains the page title "Users" and the "Create User" button (primary style).
- **Table:** 
  - Responsive table layout with clear column headers.
  - Header row with column names: ID, Name, Email, Role, Status, Created At.
  - Each row displays the corresponding user data.
  - Status column should visually indicate active/inactive status (e.g., badge styling similar to `StatusBadge` in `ReportsPage.tsx`).
- **Empty State:** If mock data array is empty, display a centered message "No users found."
- **Loading State:** Not required for mock data implementation, but skeleton or loading placeholder may be added if following existing patterns.

## Implementation Notes
- **File Location:** `src/pages/UsersPage.tsx`
- **Routing:** Add route definition to `App.tsx` alongside existing routes (`/dashboard`, `/reports`, `/settings`).
- **Components:** Reuse `DashboardLayout` and `ProtectedRoute`. Consider extracting a reusable `UserTable` component if the list grows, but keep it simple for now.
- **Styling:** Follow Tailwind conventions used in `DashboardPage.tsx` (e.g., `bg-white`, `rounded-lg`, `shadow`, `p-6` for cards/tables).
- **Status Badge:** Reuse or adapt the `StatusBadge` component from `src/pages/ReportsPage.tsx` for the `status` column.
- **Toast:** Import `useToast` from `src/components/Toast.tsx` if the "Create User" button needs to trigger a feedback message.

## Resolved Decisions
- **Fields:** Each user record contains `id`, `name`, `email`, `role`, `status`, `createdAt`.
- **Interactivity:** Read-only list with a top-level 'Create User' button. No inline editing or row actions.
- **URL Path:** `/users`

## Assumptions
1. The "Create User" button currently triggers a success toast or is a placeholder for future implementation, as no specific behavior was defined.
2. Mock data will be defined as a constant array of objects within `UsersPage.tsx` or in a new `src/utils/mockUsers.ts` file.
3. The `status` field will use string values like "Active" or "Inactive", rendered with a colored badge.
4. The `createdAt` field will be formatted as a localized date string (e.g., `MM/DD/YYYY`).
5. The page will follow the same authentication guard pattern as `DashboardPage` and `ReportsPage`.
6. No additional data fetching or API integration is required for this story.

## References
- Existing Pages: `src/pages/DashboardPage.tsx`, `src/pages/ReportsPage.tsx`
- Components: `src/components/DashboardLayout.tsx`, `src/components/ProtectedRoute.tsx`, `src/components/Toast.tsx`
- Hooks: `src/hooks/useAuth.ts`
