# MIS-16: Users Page Implementation Plan

## Resolved Decisions
- **Search/Filter**: The Users page will be a static table only. No client-side search or filter functionality is required.
- **Navigation**: The navigation link for the Users page will be added to the `DashboardLayout` sidebar/header in this story.

## Files to Touch
- `src/pages/UsersPage.tsx` (Create)
- `src/components/DashboardLayout.tsx` (Modify)
- `src/App.tsx` (Modify)

## Context Budget
- Read `src/components/DashboardLayout.tsx` to locate the existing navigation menu structure and styling.
- Read `src/App.tsx` to locate the existing route configuration block and import structure.
- Read `src/pages/ReportsPage.tsx` to check if `StatusBadge` is exported for reuse.

## Implementation Steps

### 1. Create `src/pages/UsersPage.tsx`
- **Define Data Structure**: Create the `User` interface exactly as specified in the story.
- **Mock Data**: Hardcode an array of 5–10 realistic user objects directly in the file.
- **Status Badge**: Check if `StatusBadge` is exported from `ReportsPage.tsx`. If it is, import and reuse it. If not, define a local `StatusBadge` component inside `UsersPage.tsx` that renders a styled `<span>` using Tailwind classes (e.g., green background/text for 'Active', gray for 'Inactive').
- **Table Layout**: Render a `<table>` inside a container matching the existing dashboard styling (e.g., `bg-slate-900/40 border border-slate-800 rounded-2xl p-6`).
- **Columns**: Implement columns for Name, Email, Role, Status, and Last Active using plain text and the `StatusBadge` component.
- **Styling**: Use Tailwind CSS utility classes consistent with `DashboardPage.tsx` and `ReportsPage.tsx` (e.g., `text-white`, `text-slate-400`, `border-slate-800`, `font-semibold`).

### 2. Update `src/components/DashboardLayout.tsx`
- **Import Icon**: Import `Users` from `lucide-react`.
- **Add Navigation**: Locate the existing sidebar or header navigation menu. Add a new navigation link labeled "Users" pointing to `/users`.
- **Styling**: Match the styling of existing navigation items (e.g., hover states, active states, icon placement, text colors) to ensure visual consistency.

### 3. Update `src/App.tsx`
- **Import Page**: Import `UsersPage` from `./pages/UsersPage`.
- **Add Route**: Locate the existing `<Routes>` block. Add a new route:
  ```tsx
  <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
  ```
- **Placement**: Insert the new route in alphabetical order or alongside other protected routes to maintain consistency with the existing routing structure.

## Risks & Mitigations
- **Layout Breakage**: Adding a new link to `DashboardLayout` might affect the sidebar/header layout if the navigation container has strict sizing. *Mitigation*: Review the existing navigation structure in `DashboardLayout.tsx` before adding the link to ensure it fits within the existing flex/grid containers.
- **Component Coupling**: Reusing `StatusBadge` from `ReportsPage.tsx` might introduce unnecessary coupling for a simple static component. *Mitigation*: If `StatusBadge` is not easily reusable or exported, define it locally in `UsersPage.tsx` to keep the page self-contained.

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "StatusBadge from ReportsPage.tsx will be either exported and imported, or defined locally in UsersPage.tsx to avoid cross-file coupling for a simple static component.", "risk": "low"}]}}
