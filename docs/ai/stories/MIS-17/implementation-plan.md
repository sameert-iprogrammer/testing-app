## Resolved Decisions
- **Q1 (Sidebar Navigation)**: Add a new 'Users' nav item alongside the existing 'Audience' item. The 'Audience' item remains untouched.

## Files to Touch
- `src/pages/UsersPage.tsx` (Create)
- `src/App.tsx` (Modify)
- `src/components/DashboardLayout.tsx` (Modify)

## Context Budget
- Read `src/pages/ReportsPage.tsx` to verify the exact `StatusBadge` implementation and padding/rounded styling.
- Read `src/pages/DashboardPage.tsx` to verify header and card container layout patterns.
- Read `src/components/DashboardLayout.tsx` to identify the exact structure of existing `NavItem` components and locate where to append the new one.
- Read `src/App.tsx` to identify the exact structure of existing `<Route>` components and locate where to append the new one.
- No other files need to be read.

## Implementation Steps

### Step 1: Create `src/pages/UsersPage.tsx`
1. **Define Types & Mock Data**:
   - Create a `User` interface with fields: `name`, `email`, `role`, `status`, `createdDate`.
   - Create a `mockUsers` array containing exactly 5 realistic user records. Include a mix of `Active` and `Inactive` statuses and roles (e.g., Admin, Editor, Viewer).
2. **Create `StatusBadge` Component**:
   - Implement a functional component `StatusBadge` that accepts `status: 'Active' | 'Inactive'`.
   - Render a `<span>` with conditional styling matching the spec:
     - `Active`: `bg-emerald-400/10 text-emerald-400`
     - `Inactive`: `bg-amber-400/10 text-amber-400`
   - Apply consistent badge styling (e.g., `px-2.5 py-0.5 rounded-full text-xs font-medium`) matching `ReportsPage`.
3. **Create `UsersPage` Component**:
   - Wrap the entire component in a `div` with `className="space-y-8 animate-in fade-in duration-700"`.
   - Add the header:
     ```tsx
     <div className="flex flex-col gap-1">
       <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
       <p className="text-slate-400">Manage and view all registered users</p>
     </div>
     ```
   - Add the table card container:
     ```tsx
     <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
       <div className="overflow-x-auto">
         <table className="w-full text-sm text-left text-slate-400">
           <thead className="text-xs uppercase bg-slate-900/50 text-slate-300">
             <tr>
               <th className="px-6 py-3">Name</th>
               <th className="px-6 py-3">Email</th>
               <th className="px-6 py-3">Role</th>
               <th className="px-6 py-3">Status</th>
               <th className="px-6 py-3">Created Date</th>
             </tr>
           </thead>
           <tbody>
             {mockUsers.map((user, index) => (
               <tr key={user.email} className="border-b border-slate-800 hover:bg-slate-800/50">
                 <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                 <td className="px-6 py-4">{user.email}</td>
                 <td className="px-6 py-4">{user.role}</td>
                 <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                 <td className="px-6 py-4">{user.createdDate}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
     ```

### Step 2: Modify `src/App.tsx`
1. **Import `UsersPage`**:
   - Add `import UsersPage from './pages/UsersPage';` at the top of the file.
2. **Add Route**:
   - Locate the existing `/reports` route definition.
   - Append the new `/users` route immediately after it:
     ```tsx
     <Route path="/users" element={
       <ProtectedRoute>
         <DashboardLayout>
           <UsersPage />
         </DashboardLayout>
       </ProtectedRoute>
     } />
     ```

### Step 3: Modify `src/components/DashboardLayout.tsx`
1. **Import `Users` Icon**:
   - Ensure `Users` is imported from `lucide-react` (add to existing imports if not present).
2. **Add Navigation Item**:
   - Locate the existing sidebar `NavItem` components.
   - Append a new `NavItem` for "Users" alongside the existing "Audience" item:
     ```tsx
     <NavItem icon={<Users size={20} />} label="Users" onClick={() => navigate('/users')} />
     ```
   - Ensure the styling matches existing `NavItem` components (hover states, text color, active state handling).

## Risks & Assumptions
- **Assumption**: `react-router-dom`'s `useNavigate` hook is already initialized and available within `DashboardLayout` for sidebar navigation.
- **Assumption**: The `lucide-react` library is already installed and supports the `Users` icon.
- **Assumption**: Tailwind CSS utility classes (`animate-in`, `fade-in`) are correctly configured in the project's PostCSS/Tailwind setup as evidenced by their usage in `DashboardPage.tsx`.
- **Risk**: If the existing `NavItem` component in `DashboardLayout.tsx` expects an `isActive` prop or derives it from `useLocation`, the implementer must ensure the new "Users" link highlights correctly when the `/users` route is active. If no active-state logic exists, a default `false` or dynamic check via `useLocation` should be applied consistently with other items.
