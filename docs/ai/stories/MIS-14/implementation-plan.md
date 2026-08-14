# MIS-14: Orders Page - Implementation Plan

## Resolved Decisions
- **Data Display**: Static list only. No pagination, search, or filtering capabilities.
- **Mock Data Fields**: Order ID, Customer, Date, Status, Amount.
- **Routing**: Orders page will be mounted at the `/orders` route.
- **Navigation**: A link to `/orders` will be added to the existing `DashboardLayout` sidebar/header.
- **Mock Data Location**: Static array defined directly in `src/pages/OrdersPage.tsx`.
- **Status Rendering**: The `StatusBadge` component from `src/pages/ReportsPage.tsx` will be reused for the Status column.

## Context Budget
- Scope is strictly limited to four files: `src/pages/OrdersPage.tsx`, `src/App.tsx`, `src/components/DashboardLayout.tsx`, and `src/pages/ReportsPage.tsx`.
- No full repo reads or dependency installations are required. The implementer will only inspect the target files for exact import paths, existing component signatures, and UI styling tokens (Tailwind classes).
- Existing conventions (PascalCase filenames, `lucide-react` icons, Tailwind utility classes, `react-router-dom` v7 syntax) will be followed exactly.

## Files to Touch
- `src/pages/OrdersPage.tsx` (Create)
- `src/App.tsx` (Modify)
- `src/components/DashboardLayout.tsx` (Modify)
- `src/pages/ReportsPage.tsx` (Modify - export `StatusBadge` if not already exported)

## Implementation Steps

### 1. Create `src/pages/OrdersPage.tsx`
- Define an `Order` interface matching the resolved mock data fields:
  ```typescript
  interface Order {
    id: string;
    customer: string;
    date: string;
    status: 'Pending' | 'Shipped' | 'Delivered';
    amount: string;
  }
  ```
- Create a static mock data array (`const MOCK_ORDERS: Order[] = [...]`) with 5-10 sample entries. Use consistent date formats (e.g., `MMM DD, YYYY`) and realistic customer names.
- Build the `OrdersPage` component:
  - Wrap content in a container matching `DashboardPage.tsx` styling: `space-y-8 animate-in fade-in duration-700`.
  - Add a page header (`h1` "Orders", `p` subtitle like "Manage and track customer orders.").
  - Render a responsive table wrapper: `overflow-x-auto bg-slate-900/40 border border-slate-800 rounded-2xl`.
  - Construct a `<table>` with columns for Order ID, Customer, Date, Status, Amount.
  - Apply consistent typography: `text-slate-400` for table headers, `text-white` for data values, `py-4 px-6` for cells.
  - Import `StatusBadge` from `./ReportsPage` and render it in the Status column, passing the order status string.
  - Format amounts as currency strings (e.g., `$1,234.56`).

### 2. Update `src/pages/ReportsPage.tsx`
- Verify whether `StatusBadge` is currently exported. 
- If it is a local component, add the `export` keyword to its declaration so `OrdersPage.tsx` can import it. If it is already exported, skip this step.

### 3. Update `src/components/DashboardLayout.tsx`
- Import `Package` from `lucide-react` (or `ShoppingBag` if preferred, but `Package` aligns with order tracking).
- Locate the existing navigation menu or header link list.
- Add a new navigation link pointing to `/orders`.
- Match the exact styling of existing links (padding, rounded corners, hover states, active state logic, and icon sizing).

### 4. Update `src/App.tsx`
- Import `OrdersPage` from `./pages/OrdersPage`.
- Add `<Route path="/orders" element={<OrdersPage />} />` inside the protected route group, alongside `/dashboard`, `/reports`, and `/settings`.
- Ensure the route is properly nested within the `ProtectedRoute` or `DashboardLayout` wrapper to maintain auth guards and layout consistency.

## Risks & Mitigations
- **StatusBadge Export Coupling**: If `StatusBadge` relies on internal state or props specific to `ReportsPage`, exporting it might cause unexpected dependencies. *Mitigation*: If exporting fails or causes lint/type errors, copy the `StatusBadge` definition directly into `OrdersPage.tsx` instead of importing it.
- **Route Nesting Structure**: The exact placement of the new route depends on how `App.tsx` groups protected vs. public routes. *Mitigation*: Inspect the existing `<Route>` structure in `App.tsx` before inserting the new route to ensure it inherits the correct layout and auth context.
- **Table Responsiveness**: Long customer names or order IDs might break the table layout on mobile. *Mitigation*: Use `whitespace-nowrap` for ID/Amount columns and `truncate` for Customer names, wrapped in `overflow-x-auto` as planned.

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "The StatusBadge component from ReportsPage.tsx will be exported (or will be easily exportable) so it can be imported into OrdersPage.tsx.", "risk": "low"}, {"statement": "The navigation link for Orders in DashboardLayout.tsx will use the 'Package' icon from lucide-react, matching the existing sidebar header styling.", "risk": "low"}, {"statement": "Mock data will be defined as a static constant array directly inside src/pages/OrdersPage.tsx, rather than in a separate utils file.", "risk": "low"}, {"statement": "The new /orders route will be nested inside the existing protected route group in src/App.tsx, alongside /dashboard, /reports, and /settings.", "risk": "low"}]}}
