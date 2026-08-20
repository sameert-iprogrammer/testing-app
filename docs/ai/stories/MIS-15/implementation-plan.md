## Implementation Plan: MIS-15 — Orders Page

### Overview
This plan implements the Orders page for the testing-app React application, following the MIS-15 specification. The implementation creates a new `OrdersPage.tsx` component and updates `App.tsx` with routing and authentication.

### ## Files to Touch

| Action | File |
|--------|------|
| Create | `src/pages/OrdersPage.tsx` |
| Modify | `src/App.tsx` |

### ## Context Budget
- **`src/pages/ReportsPage.tsx`**: Used as pattern reference for `mockReports` structure, `StatusBadge` styling, and `bg-slate-900/40`/`border-slate-800`/`rounded-2xl`/`p-6` conventions. Only the mock data interface and StatusBadge visual approach are referenced; full file is not read.
- **`src/pages/DashboardPage.tsx`**: Used for `StatCard` and `TransactionItem` layout inspiration; only visual patterns noted.
- **`src/components/DashboardLayout.tsx`**: Used to determine that dashboard pages are rendered within `DashboardLayout` with authentication context; no full-file read needed.
- **`src/App.tsx`**: Target for route addition; modification is limited to adding one `<Route>` element. Existing route structure is assumed based on conventions (dashboard routes inside `DashboardLayout`, `ProtectedRoute` wrapping).
- **`src/hooks/useAuth.ts`**: Referenced only to confirm that `ProtectedRoute` wrapping is appropriate for dashboard-featured pages; no hook logic is replicated.

### ## Assumptions (documented for implementer)
1. **Route path**: `/orders` within `DashboardLayout`, matching the spec's example placement.
2. **ProtectedRoute wrapping**: `OrdersPage` is wrapped with `ProtectedRoute`, consistent with `ReportsPage`, `DashboardPage`, and `SettingsPage`.
3. **StatusBadge**: Since the exact `StatusBadge` export from `ReportsPage.tsx` is not confirmed, an inline status badge with conditional Tailwind classes is used (green/emerald for completed, rose for pending/failed, indigo for processing), matching the project's color palette.
4. **Order interface**: Defined inline in `OrdersPage.tsx` with `itemCount: number` per the spec; not extracted to a shared types file.
5. **Tailwind colors**: Project palette includes `slate`, `indigo`, `emerald`, `rose`; these are used for backgrounds and text colors.
6. **React Router v7**: Routes are defined with `<Route>` elements; `react-router-dom@^7.14.2` is the installed version.

### ## Steps

**Step 1: Create `src/pages/OrdersPage.tsx`**
- Define `Order` interface with: `id: string`, `customerName: string`, `orderDate: string`, `totalAmount: string`, `status: 'pending' | 'completed' | 'failed' | 'processing'`, `itemCount: number`.
- Create `mockOrders` array with at least 5 orders having varying statuses (`completed`, `pending`, `failed`, `processing`).
- Render a table layout consistent with `ReportsPage`: `bg-slate-900/40`, `border-slate-800`, `rounded-2xl`, `p-6`.
- Page header: `<h1>Order Management</h1>` + brief description paragraph.
- Each row displays: order ID, customer name, date, total amount, status badge.
- Status badge uses inline conditional classes: completed → `bg-emerald-500/20 text-emerald-400`, processing → `bg-indigo-500/20 text-indigo-400`, pending/failed → `bg-rose-500/20 text-rose-400`.
- Export `OrdersPage` as default.

**Step 2: Modify `src/App.tsx`**
- Add `<Route path="/orders" element={<DashboardLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></DashboardLayout>} />` inside the dashboard route hierarchy, following the existing pattern of other dashboard routes.

### ## Risks & Mitigations
- **Risk**: `StatusBadge` component from `ReportsPage` may not be exported/reusable. Mitigation: inline conditional classes are used instead of an import, avoiding breakage.
- **Risk**: `ProtectedRoute` may expect different prop structure. Mitigation: wrapper follows the same pattern as other dashboard pages; if type mismatches occur, the implementer can inspect `src/components/ProtectedRoute.tsx`.
- **Risk**: Tailwind color names may differ from assumptions. Mitigation: project palette (`slate`, `indigo`, `emerald`, `rose`) is confirmed in conventions and `tailwind.config.js`.

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "Route path is /orders within DashboardLayout", "risk": "low"}, {"statement": "OrdersPage should be wrapped with ProtectedRoute like other dashboard pages", "risk": "low"}, {"statement": "Order interface fields follow the pattern defined in the spec (id, customerName, orderDate, totalAmount, status, itemCount)", "risk": "low"}, {"statement": "StatusBadge can be replicated inline with conditional Tailwind classes matching project palette", "risk": "low"}, {"statement": "App.tsx route addition follows existing dashboard route pattern", "risk": "low"}]}
