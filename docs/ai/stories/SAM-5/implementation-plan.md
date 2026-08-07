# Implementation Plan: SAM-5 - Add Users Listing

## Story Context & Resolved Decisions
This plan implements a read-only, paginated, searchable Users listing page accessible via `/users`.
- **Resolved Decision - Action Columns**: The table is strictly read-only for this sprint. No edit, delete, or view details actions.
- **Resolved Decision - Search Behavior**: When the user types in the search input, pagination automatically resets to page 1.
- **Resolved Decision - Sorting**: Sorting is enabled on all columns (`Name`, `Email`, `Role`, `Status`). Default sort is `Name` ascending.

## Files to Touch
- `src/types/user.ts`: Create
- `src/hooks/useUsers.ts`: Create
- `src/components/UsersTable.tsx`: Create
- `src/pages/UsersPage.tsx`: Create
- `src/components/DashboardLayout.tsx`: Modify
- `src/App.tsx`: Modify

## Step-by-Step Implementation Plan

### Step 1: Define User Type
Create `src/types/user.ts`.
- Export a `User` interface matching the spec: `{ id: string; name: string; email: string; role: string; status: 'Active' | 'Inactive' }`.

### Step 2: Implement `useUsers` Hook
Create `src/hooks/useUsers.ts`.
- Import `User` type and `useToast` hook.
- Create a static mock data array of ~30 users with varied roles (`Admin`, `Editor`, `Viewer`) and statuses.
- Manage local state: `users` (array), `loading` (boolean), `error` (string | null), `searchQuery` (string), `currentPage` (number), `pageSize` (number, default 10), `sortConfig` (`{ key: keyof User; direction: 'asc' | 'desc' }`).
- Implement `useEffect` to simulate an asynchronous fetch using `setTimeout`. If a random error is simulated (for robustness) or to match backend patterns, trigger `useToast` with an error message, otherwise resolve successfully.
- Expose `fetchUsers` function. Call it on mount.
- Compute `filteredUsers` using `useMemo`: filter based on `searchQuery` (case-insensitive match on `name` and `email`). If `searchQuery` length changes, reset `currentPage` to 1.
- Compute `sortedUsers` using `useMemo`: sort `filteredUsers` based on `sortConfig`.
- Compute `paginatedUsers` using `useMemo`: slice `sortedUsers` for the current page.
- Export the hook returning `{ users, loading, error, filteredUsers, paginatedUsers, searchQuery, setSearchQuery, sortConfig, setSortConfig, currentPage, totalPages, nextPage, prevPage, retry }`.

### Step 3: Implement `UsersTable` Component
Create `src/components/UsersTable.tsx`.
- Props interface: `UsersTableProps` containing `users`, `searchQuery`, `onSearchChange`, `sortConfig`, `onSortChange`, `pagination` (current, total, pageSize), `onPageChange`, `loading`.
- Container: `div` with `bg-slate-900/40 border border-slate-800 rounded-2xl p-6`.
- Search Input: `input` with `bg-slate-800 border border-slate-700 rounded-lg text-slate-200`, `aria-label="Search users"`. Pass `value` and `onChange` to parent.
- Table:
  - `<thead>`: Column headers (`Name`, `Email`, `Role`, `Status`). Make headers clickable to toggle sort direction using `lucide-react` icons (`ChevronUp`, `ChevronDown`, `ChevronsUpDown`).
  - `<tbody>`: Render rows. If `loading`, show a loading placeholder/spinner. If `users` is empty, show "No users found".
  - Status Badge: Inside the Status column, render a span with conditional classes: Active -> `bg-emerald-500/10 text-emerald-400`, Inactive -> `bg-slate-700/50 text-slate-400`. Use `px-2.5 py-0.5 rounded-full text-xs font-medium`.
- Pagination Controls: Centered below the table. Display "Page X of Y" or `[<] [1] [2] ... [>]` buttons. Disable prev/next when at bounds.

### Step 4: Implement `UsersPage` Component
Create `src/pages/UsersPage.tsx`.
- Layout: `min-h-screen bg-slate-950 p-6` (or matching `DashboardPage` spacing).
- Header: `h1` "User Management" and a descriptive paragraph.
- Initialize `useUsers` hook.
- Conditionally render:
  - If `loading`: Display a centered spinner or text "Loading users...".
  - If `error`: Display a fallback message with a "Retry" button. Call `useToast` on mount if `error` is present from a previous failed fetch, or handle it inside the hook.
  - If data is present: Render `<UsersTable>` passing all derived state and handlers.

### Step 5: Update `DashboardLayout`
Modify `src/components/DashboardLayout.tsx`.
- Locate the existing navigation menu / sidebar configuration.
- Add a new navigation item for "Users" with the path `/users`.
- Use an appropriate icon from `lucide-react` (e.g., `Users`).
- Ensure the item is inserted immediately after "Dashboard" and before "Reports", as per specification.

### Step 6: Update `App.tsx`
Modify `src/App.tsx`.
- Import `UsersPage` component.
- Add a new `<Route>` for `/users`.
- Ensure the route is wrapped in `<ProtectedRoute>` and `<DashboardLayout>` consistent with `DashboardPage` and `ReportsPage`.

## Risks & Mitigations
- **Context Availability (`useToast`)**: The `useToast` hook relies on React Context. If `useUsers` is consumed outside `ToastProvider`, it will throw. *Mitigation*: Ensure `UsersPage` (and thus `useUsers`) is only routed to within the app's `ToastProvider` scope (which wraps the main application in `main.tsx` or `App.tsx`).
- **Styling Consistency**: The exact spacing and padding of `DashboardPage` are not fully visible. *Mitigation*: Adhere strictly to the Tailwind classes mandated by the acceptance criteria (`bg-slate-950`, `bg-slate-900/40`, `border-slate-800`, `text-slate-200`) and mimic the `grid`/`space-y` patterns observed in the `DashboardPage` context snippet.
- **Mock Data Persistence**: The mock data is static. *Mitigation*: The implementation will treat the mock data as a temporary placeholder. The `useUsers` hook's structure (returning `{ fetchUsers, ... }`) will make it trivial to swap the mock `fetch` for a real API call in a future sprint.

## Context Budget
The implementation is strictly scoped to the target files listed above. To implement this plan safely, the code-implementer agent only needs to read:
- `src/components/DashboardLayout.tsx` (to identify the navigation structure for Step 5).
- `src/App.tsx` (to identify the routing pattern for Step 6).
- `src/pages/DashboardPage.tsx` (to accurately replicate the background, padding, and card styling conventions for Step 4).
- `src/components/Toast.tsx` (to verify the exact signature of `useToast` for Step 2).
No other files require reading.

{"clarification": {"needed": false, "assumptions": [{"statement": "The `useToast` hook can be safely called inside `src/hooks/useUsers.ts` without context availability issues, as the hook will only be consumed within the `ToastProvider` context scope.", "risk": "low"}, {"statement": "The `DashboardLayout.tsx` component exposes a navigable menu (either an array of link objects or a hardcoded `<nav>` element) that can be updated by simply adding a new entry for \"Users\" with the `/users` path.", "risk": "low"}, {"statement": "The `App.tsx` file uses standard `react-router-dom` routing (likely `BrowserRouter` + `Routes`/`Route`) where page components like `DashboardPage` and `ReportsPage` are nested within `DashboardLayout` and `ProtectedRoute` wrappers, which will be replicated for `UsersPage`.", "risk": "low"}]}}
