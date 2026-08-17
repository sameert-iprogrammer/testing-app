# MIS-17: Users page

## Description
Add a Users page with mock listing data to the application. The page displays a table of mock user records within the protected dashboard layout.

## Acceptance Criteria
1. A new protected route `/users` is added to the application, accessible only when authenticated.
2. The Users page renders inside the `DashboardLayout` wrapper, consistent with existing protected pages (Dashboard, Reports, Settings).
3. The page displays a header with the title "Users" and a descriptive subtitle.
4. A table of mock user data is rendered with the following columns:
   - Name
   - Email
   - Role
   - Status (Active / Inactive)
   - Created Date
5. The Status column uses a `StatusBadge` component (consistent with the Reports page pattern) with two states:
   - Active: green/emerald styling
   - Inactive: amber/yellow styling
6. The mock data includes at least 5 user records with realistic data.
7. The page follows the existing visual design system: dark theme (`slate-950` background), `bg-slate-900/40` card with `border-slate-800`, `rounded-2xl` corners, and `animate-in fade-in` entry animation.
8. The table uses the same styling pattern as the Reports page table (bordered rows, hover states, uppercase column headers).

## UI Notes
- **Layout**: The page renders inside `<DashboardLayout>`, which provides the sidebar navigation, header bar, and `ToastProvider` context.
- **Header pattern**: Matches `DashboardPage` and `ReportsPage`:
  ```
  <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
  <p className="text-slate-400">Manage and view all registered users</p>
  ```
- **Table card**: Single card container with `bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden` wrapping an `overflow-x-auto` table.
- **StatusBadge**: Reuse the same component pattern from `ReportsPage`:
  - `Active` → `bg-emerald-400/10 text-emerald-400`
  - `Inactive` → `bg-amber-400/10 text-amber-400`
- **Animation**: Container uses `space-y-8 animate-in fade-in duration-700` for page entry.
- **Responsive**: Table is horizontally scrollable on small screens via `overflow-x-auto`.

## Implementation Notes
### Files to create
- `src/pages/UsersPage.tsx` — New page component

### Files to modify
- `src/App.tsx` — Add `/users` route inside a `ProtectedRoute` + `DashboardLayout` wrapper
- `src/components/DashboardLayout.tsx` — Add navigation item for Users (see Open Questions)

### Component structure (UsersPage.tsx)
```tsx
// Interfaces
interface User {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

// Mock data array (5-6 users)
const mockUsers: User[] = [...];

// StatusBadge component (same pattern as ReportsPage)
const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => ...

// UsersPage component
const UsersPage: React.FC = () => { ... }
```

### Route registration (App.tsx)
Add after the existing `/reports` route:
```tsx
<Route path="/users" element={
  <ProtectedRoute>
    <DashboardLayout>
      <UsersPage />
    </DashboardLayout>
  </ProtectedRoute>
} />
```

### Import additions
- `src/App.tsx`: Import `UsersPage` from `./pages/UsersPage`
- `src/components/DashboardLayout.tsx`: Add `NavItem` for Users (see Open Questions)

## Open Questions
```json
{
  "clarification": {
    "needed": true,
    "questions": [
      {
        "id": "q1",
        "question": "The sidebar 'Audience' nav item already uses a Users icon (from lucide-react) but has no onClick handler. Should this item be repurposed to navigate to the new Users page, or should a separate 'Users' nav item be added alongside 'Audience'?",
        "whyItMatters": "Determines the sidebar navigation structure. Repurposing changes the label from 'Audience' to 'Users' and wires up the existing icon. Adding a new item keeps 'Audience' as a dead link (or requires future work to implement it).",
        "impactIfWrong": "If assumed incorrectly, the sidebar will either have a dead 'Audience' link or an unexpected 'Audience' nav item alongside 'Users'.",
        "options": [
          {
            "key": "opt_a",
            "label": "Repurpose 'Audience' to 'Users'",
            "consequence": "Rename the existing nav item from 'Audience' to 'Users', wire up its onClick to navigate('/users'), and keep the existing Users icon."
          },
          {
            "key": "opt_b",
            "label": "Add new 'Users' nav item alongside 'Audience'",
            "consequence": "Add a new NavItem with Users icon and 'Users' label. The 'Audience' item remains as a dead link (no onClick, no navigation target)."
          }
        ],
        "default": "opt_a",
        "allowFreeText": true,
        "blocking": true
      }
    ],
    "assumptions": [
      {
        "statement": "The Users table columns are: Name, Email, Role, Status (Active/Inactive), Created Date.",
        "risk": "low"
      },
      {
        "statement": "The route path is '/users', consistent with existing routes (/dashboard, /reports, /settings).",
        "risk": "low"
      },
      {
        "statement": "The mock data includes 5 user records with realistic names, emails, roles (Admin, Editor, Viewer), and a mix of Active/Inactive statuses.",
        "risk": "low"
      },
      {
        "statement": "No search, filter, pagination, or 'Add User' functionality is included in this story — only the listing table.",
        "risk": "low"
      },
      {
        "statement": "The StatusBadge component for the Users page uses the same pattern as ReportsPage but with 'Active' (emerald) and 'Inactive' (amber) states instead of 'Completed'/'Pending'/'Failed'.",
        "risk": "low"
      }
    ]
  }
}
```
