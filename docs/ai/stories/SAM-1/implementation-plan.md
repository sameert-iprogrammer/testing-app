# Implementation Plan: SAM-1 - Add Users Page with Listing

## Resolved Decisions
- **User fields displayed:** Name, Email, Role, Status (4 standard columns).
- **Supported actions:** Read-only listing only (no edit/delete/action buttons per row).

## Files to Touch
- `src/pages/UsersPage.tsx` (Create)
- `src/App.tsx` (Modify)
- `src/components/DashboardLayout.tsx` (Modify)

## Context Budget
- **Target files:** `src/pages/UsersPage.tsx`, `src/App.tsx`, `src/components/DashboardLayout.tsx`.
- **Reference files (light read for patterns only):** `src/pages/ReportsPage.tsx` (for `StatusBadge` component structure, mock data array pattern, and table styling), `src/pages/DashboardPage.tsx` (for header/title layout).
- **Avoid:** Do not read `src/hooks/`, `src/components/Toast.tsx`, or full `node_modules`. Rely on existing imports and established Tailwind utility classes.

## Implementation Steps

### Step 1: Create `src/pages/UsersPage.tsx`
1. **Define Data Interfaces & Mock Data:**
   - Create `interface User` matching the spec:
     ```typescript
     interface User {
       id: string;
       name: string;
       email: string;
       role: string;
       status: 'Active' | 'Inactive' | 'Deactivated';
     }
     ```
   - Export a `const mockUsers: User[]` array containing exactly 5 entries (John Doe, Jane Smith, Bob Johnson, Alice Brown, Charlie Wilson) matching the spec's values.

2. **Implement `StatusBadge` Component:**
   - Create a local `StatusBadge` component (similar to `ReportsPage.tsx:1-9` pattern).
   - Prop type: `status: User['status']`.
   - Styling map:
     - `'Active'` → `text-emerald-400 bg-emerald-400/10`
     - `'Inactive'` → `text-amber-400 bg-amber-400/10`
     - `'Deactivated'` → `text-rose-400 bg-rose-400/10`
   - Render: `<span className="px-2.5 py-0.5 rounded-full text-xs font-medium ...">{status}</span>`

3. **Implement `UsersPage` Component:**
   - Import `User`, `mockUsers`, `StatusBadge`, `User` icon, and `Mail`/`Shield` icons from `lucide-react`.
   - **Header:** Match `DashboardPage.tsx` structure:
     ```tsx
     <div className="space-y-8 animate-in fade-in duration-700">
       <div className="flex flex-col gap-1">
         <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
         <p className="text-slate-400">Manage and view all registered users.</p>
       </div>
     ```
   - **Table Container:** Wrap table in `bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden` (mirrors `ReportsPage.tsx` and `SettingsPage.tsx` card styling).
   - **Table Structure:**
     - `<table className="w-full text-left text-sm text-slate-300">`
     - `<thead>` with `<tr>` containing `<th>` for Name, Email, Role, Status. Use `px-6 py-4 font-medium text-slate-200` and align text appropriately.
     - `<tbody>` maps over `mockUsers`:
       - `<tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">`
       - Cells: `user.name`, `user.email`, `user.role`, `<StatusBadge status={user.status} />`
     - Add `px-6 py-4` to all `<td>` elements.
   - Close components and export default `UsersPage`.

### Step 2: Add Routing in `src/App.tsx`
1. Import `UsersPage` from `../pages/UsersPage`.
2. Locate the existing `<Routes>` block protected by `ProtectedRoute` and `DashboardLayout` (likely structured as a route with `<Outlet />` for nested navigation).
3. Add a new route alongside existing pages (`/`, `/reports`, `/settings`):
   ```tsx
   <Route path="/users" element={<UsersPage />} />
   ```
4. Ensure the route sits inside the correct layout/wrapper element so `DashboardLayout` remains the parent for consistent header/sidebar.

### Step 3: Update Navigation in `src/components/DashboardLayout.tsx`
1. Import `Users` icon from `lucide-react`.
2. Locate the navigation links array or JSX structure rendering Dashboard, Reports, and Settings links.
3. Add a new navigation item:
   - Link text: `"Users"`
   - Icon: `<Users className="h-4 w-4" />`
   - Route: `/users`
   - Styling: Match existing active/inactive link styles (e.g., `text-slate-300 hover:text-white` for inactive, `text-indigo-400` or `bg-slate-800` for active).
4. Ensure navigation uses `react-router-dom`'s `Link` component for client-side routing.

## Risks & Considerations
- **Table Responsiveness:** If the table overflows on mobile, wrap it in `<div className="overflow-x-auto">`. This is a safe default and matches common dashboard patterns.
- **Tailwind Theme Consistency:** Use `slate-*` palette for text/backgrounds and `emerald/amber/rose-*` for status badges to strictly match the existing dark UI system.
- **Routing Structure:** `App.tsx` may use React Router v7 `<Route element={...}>` syntax. Place the new route inside the same `<Outlet>` or layout wrapper as existing pages to guarantee `DashboardLayout` wraps it.

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "App.tsx uses a React Router v7 `<Routes>` structure with a protected `<Route path=\"/\" element={<ProtectedRoute>...</ProtectedRoute>} />` containing an `<Outlet />` where nested page routes (like /reports, /settings) are defined.", "risk": "low"}, {"statement": "DashboardLayout.tsx renders navigation links as standard `<Link>` components from react-router-dom in a flex or grid container, making it safe to append a new `<li>` or `<div>` for the Users link.", "risk": "low"}, {"statement": "The StatusBadge colors will be emerald (Active), amber (Inactive), and rose (Deactivated) to align with the existing dark theme palette and ReportsPage color conventions.", "risk": "low"}]}}
