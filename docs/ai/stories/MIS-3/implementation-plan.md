# MIS-3: Users Page — Implementation Plan

## Story Metadata
- **JIRA Key:** MIS-3
- **Title:** Users page
- **Description:** Users page with mock data listing
- **URL Path:** `/users`

## Resolved Decisions
- **Fields:** `id`, `name`, `email`, `role`, `status`, `createdAt`.
- **Interactivity:** Read-only list with a top-level 'Create User' button. No inline editing or row actions.
- **URL Path:** `/users`.
- **Mock Data Location:** Inline constant array within `UsersPage.tsx`.
- **Status Values:** `'active' | 'inactive'`.
- **Date Formatting:** `MM/DD/YYYY` using `toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })`.
- **Create User Action:** Triggers a success toast with a placeholder message.
- **Status Badge:** Adapted locally in `UsersPage.tsx` following the `ReportsPage.tsx` pattern.

## Files to Touch
- `src/pages/UsersPage.tsx` (Create)
- `src/App.tsx` (Modify)

## Context Budget
- Read `src/App.tsx` only to locate the exact insertion point for the new `/users` route.
- Read `src/pages/ReportsPage.tsx` only to verify the `StatusBadge` styling pattern and `<table>` Tailwind classes.
- Read `src/components/Toast.tsx` only to verify `useToast` hook usage and type signatures.
- Do not read `DashboardLayout`, `ProtectedRoute`, or `useAuth` unless import paths are ambiguous (they are standard and already known).

## Implementation Steps

### 1. Define Types & Mock Data (`src/pages/UsersPage.tsx`)
- Create a `User` interface matching the resolved fields:
  ```typescript
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    createdAt: string;
  }
  ```
- Define a `mockUsers` constant array with 5 representative entries. Use ISO date strings for `createdAt` (e.g., `"2024-01-15T08:30:00Z"`).

### 2. Create StatusBadge Component (`src/pages/UsersPage.tsx`)
- Adapt the `StatusBadge` pattern from `ReportsPage.tsx` to handle `'active'` and `'inactive'` states.
- Use Tailwind classes consistent with the dark theme:
  - `active`: `bg-emerald-500/10 text-emerald-400 border-emerald-500/20`
  - `inactive`: `bg-slate-500/10 text-slate-400 border-slate-500/20`
- Keep it as a local functional component within `UsersPage.tsx` to avoid cross-file coupling.

### 3. Build Action Bar & Toast Integration (`src/pages/UsersPage.tsx`)
- Import `useToast` from `src/components/Toast.tsx`.
- Create a top-level flex container matching `ReportsPage.tsx` styling:
  ```tsx
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
      <p className="text-slate-400 mt-1">Manage and view all registered users.</p>
    </div>
    <button
      onClick={() => showToast('Create User functionality coming soon!', 'success')}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Create User
    </button>
  </div>
  ```
- Import `Plus` from `lucide-react` to match the icon usage pattern in `ReportsPage.tsx`.

### 4. Implement Table & Empty State (`src/pages/UsersPage.tsx`)
- Wrap the table in a container matching `ReportsPage.tsx`:
  ```tsx
  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
    <table className="w-full">
      <thead className="bg-slate-900/60 border-b border-slate-800">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created At</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {mockUsers.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
              No users found.
            </td>
          </tr>
        ) : (
          mockUsers.map((user) => (
            <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  ```

### 5. Add Route to App.tsx (`src/App.tsx`)
- Import `UsersPage` from `./pages/UsersPage`.
- Insert a new `<Route>` following the exact wrapper pattern used for `/dashboard`, `/reports`, and `/settings`:
  ```tsx
  <Route
    path="/users"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <UsersPage />
        </DashboardLayout>
      </ProtectedRoute>
    }
  />
  ```
- Place it logically after the `/settings` route or alongside the other protected routes.

## Risks & Mitigations
- **Button Component Availability:** `ReportsPage.tsx` uses a `<Button>` component not fully defined in the context. *Mitigation:* Use a native `<button>` with Tailwind classes matching the existing dark UI theme (`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg`) to guarantee consistent styling without unknown dependencies.
- **Date Formatting Consistency:** `toLocaleDateString()` might produce locale-dependent formats. *Mitigation:* Explicitly pass `{ month: '2-digit', day: '2-digit', year: 'numeric' }` to enforce `MM/DD/YYYY` as specified.
- **Cross-File StatusBadge Coupling:** Reusing `StatusBadge` directly from `ReportsPage.tsx` could create tight coupling. *Mitigation:* Define a localized `StatusBadge` in `UsersPage.tsx` with identical styling, keeping the implementation self-contained per the "keep it simple" directive.

{"clarification": {"needed": true, "questions": [], "assumptions": [{"statement": "The 'Create User' button will trigger a success toast with the message 'Create User functionality coming soon!' and log a placeholder console message.", "risk": "low"}, {"statement": "Since the <Button> component used in ReportsPage.tsx is not fully exposed in the context, UsersPage.tsx will use a native <button> with Tailwind classes matching the existing dark UI theme (bg-indigo-600, rounded-lg, etc.).", "risk": "low"}, {"statement": "The StatusBadge component will be defined locally within UsersPage.tsx to avoid cross-file coupling, adapting the existing ReportsPage.tsx pattern for 'active' (emerald) and 'inactive' (slate) states.", "risk": "low"}, {"statement": "Mock data will consist of 5 hardcoded user objects directly inside UsersPage.tsx.", "risk": "low"}]}}
