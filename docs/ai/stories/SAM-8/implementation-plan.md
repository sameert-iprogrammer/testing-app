# Implementation Plan: SAM-8 - Users Listing

## Context Budget
To minimize read/write overhead and keep the implementer focused:
- `src/pages/UsersPage.tsx` (Create)
- `src/data/users.ts` (Create)
- `src/components/DashboardLayout.tsx` (Read & Modify: locate navigation JSX/array)
- `src/App.tsx` (Read & Modify: locate `<Routes>` block)
- `src/pages/DashboardPage.tsx` (Read: reference table styling, layout padding, and color palette)
- `src/components/ProtectedRoute.tsx` (Read: confirm wrapper usage pattern)

## Resolved Decisions
- **Pagination/Scrolling:** Display all users at once. No pagination or infinite scroll will be implemented.
- **Search/Filter:** No search input or filter functionality will be included on this page.

## Files to Touch
- `src/data/users.ts` — Create
- `src/pages/UsersPage.tsx` — Create
- `src/components/DashboardLayout.tsx` — Modify
- `src/App.tsx` — Modify

## Implementation Steps

### Step 1: Create Mock Data Module (`src/data/users.ts`)
- Define the `User` interface and `MOCK_USERS` array exactly as specified in the story spec.
- Export both `User` and `MOCK_USERS` as named exports.
- Include at least 5 entries with varied `role` and `status` values to demonstrate badge rendering.

### Step 2: Create UsersPage Component (`src/pages/UsersPage.tsx`)
- Import `React`, `User`, and `MOCK_USERS` from `../data/users`.
- Export a default functional component `UsersPage`.
- **Layout:** Wrap content in a `<div>` with `space-y-6` or `space-y-8` padding, matching the dashboard aesthetic.
- **Header:** Render a `<h1>` ("Users") and optional `<p>` subtitle, consistent with `DashboardPage.tsx` heading styles.
- **Table Container:** Wrap the table in `<div className="overflow-x-auto bg-slate-900/40 border border-slate-800 rounded-2xl">` to handle responsive scrolling.
- **Table Structure:**
  - `<table className="w-full text-sm text-left">`
  - `<thead>` with columns: Name, Email, Role, Status. Use `bg-slate-800/50` and `text-slate-300 font-medium` for header cells.
  - `<tbody>` mapping over `MOCK_USERS`. Each `<tr>` should have `border-b border-slate-800` and `hover:bg-slate-800/30` for readability.
  - Cells: `Name`, `Email`, `Role` rendered as plain text or `span` with `text-slate-200`.
  - **Status Badge:** Render a conditional badge based on `user.status`:
    - `Active`: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
    - `Inactive`: `bg-slate-500/10 text-slate-400 border border-slate-500/20`
    - `Pending`: `bg-amber-500/10 text-amber-400 border border-amber-500/20`
    - Use a small rounded container with `px-2 py-1 rounded-full text-xs font-medium`.
- Export the component as default.

### Step 3: Update DashboardLayout Navigation (`src/components/DashboardLayout.tsx`)
- Locate the existing navigation structure (sidebar or top nav array/JSX).
- Add a "Users" navigation item linking to `/users`.
- Match the existing styling (e.g., `NavLink` or `Link` from `react-router-dom`, active state highlighting if the layout supports it, and consistent icon usage if applicable).
- Ensure the new item is placed logically within the existing menu order.

### Step 4: Update App Routing (`src/App.tsx`)
- Import `UsersPage` from `./pages/UsersPage`.
- Import `ProtectedRoute` from `./components/ProtectedRoute` (if not already imported).
- Add a new `<Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />` inside the existing `<Routes>` block.
- Ensure the route path aligns with the project's existing routing conventions (e.g., nested vs flat, though flat `/users` is specified).

## Risks & Mitigations
- **Navigation Structure Variance:** `DashboardLayout` might use a complex state-driven menu or external config. *Mitigation:* Inspect `DashboardLayout.tsx` during implementation; if it uses a prop-based menu, pass a `navItems` array. If it's hardcoded JSX, append directly.
- **Route Nesting:** `App.tsx` might use nested layouts (e.g., `<Route element={<DashboardLayout/>}>`). *Mitigation:* Follow the exact syntax shown in the spec (`<Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />`) and place it within the existing route tree.
- **Tailwind Color Mismatch:** Custom theme colors might override standard Tailwind palette. *Mitigation:* Use the exact hex/opacity values from the spec (`emerald`, `slate`, `amber`) as they align with the `slate-900` dashboard background seen in `DashboardPage.tsx`.

## Open Questions & Assumptions

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "DashboardLayout.tsx contains a straightforward navigation array or JSX block where a new 'Users' link can be appended without altering component props or state logic.", "risk": "low"}, {"statement": "App.tsx uses a flat or standard react-router-dom v7 <Routes> structure where adding a /users route alongside existing pages (Dashboard, Reports, Settings) will not conflict with wildcard or nested paths.", "risk": "low"}, {"statement": "Status badges will be implemented as inline spans with Tailwind utility classes for background, text, and border colors, avoiding custom CSS or additional components.", "risk": "low"}, {"statement": "The UsersPage will be wrapped inside DashboardLayout by the routing setup in App.tsx or by importing DashboardLayout inside UsersPage, consistent with how DashboardPage and ReportsPage are structured.", "risk": "low"}]}}
