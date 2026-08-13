## Resolved Decisions
- **Layout**: Responsive Table
- **Data Scope**: Summary Only (mock orders will not include line items/products)
- **Navigation**: `DashboardLayout` renders a persistent sidebar navigation menu.

## Files to Touch
- `src/data/mockOrders.ts` (Create)
- `src/pages/OrdersPage.tsx` (Create)
- `src/App.tsx` (Modify)
- `src/components/DashboardLayout.tsx` (Modify)

## Context Budget
The implementer should only read the following files to gather necessary context:
- `src/pages/ReportsPage.tsx` (to inspect `StatusBadge` styling and verify export status)
- `src/components/DashboardLayout.tsx` (to identify the exact structure, component hierarchy, and location of the sidebar navigation links)
- `src/App.tsx` (to identify the exact routing structure, import paths, and `ProtectedRoute` usage)
No other files need to be read. Do not modify or read any other files.

## Implementation Steps

### Step 1: Create Mock Data File
Create `src/data/mockOrders.ts`.
- Define a `Order` interface matching the spec: `{ id: string; customer: string; date: string; total: number; status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' }`.
- Export a constant array `mockOrders` containing 10–15 objects.
- Use realistic but static data. Ensure `date` values are formatted strings (e.g., `YYYY-MM-DD` or `MM/DD/YYYY`).
- Ensure `total` values are numbers. Format currency in the UI layer, not the data layer.

### Step 2: Create Orders Page Component
Create `src/pages/OrdersPage.tsx`.
- Import `mockOrders` from `../data/mockOrders`.
- Import `StatusBadge` from `./ReportsPage`. If `StatusBadge` is not exported, copy its styling logic inline to maintain isolation.
- Import `Package` from `lucide-react` for the page header icon.
- Create the `OrdersPage` component:
  - Render a header section with the title "Orders" and the imported icon, matching the typography/spacing conventions seen in `DashboardPage.tsx`.
  - Render a container `div` with `className="overflow-x-auto"` to handle mobile responsiveness without breaking layout.
  - Inside the container, render a semantic `<table>` with Tailwind classes.
  - Table `<thead>`: Columns for Order ID, Customer, Date, Total Amount, Status.
  - Table `<tbody>`: Map over `mockOrders`. Each `<tr>` should display the corresponding fields.
  - Map the `status` field to the `StatusBadge` component.
  - Apply Tailwind classes consistent with the existing design system (dark/slate theme, rounded corners, proper spacing, hover states).
- Export `OrdersPage` as the default export.

### Step 3: Update Application Routing
Modify `src/App.tsx`.
- Import `OrdersPage` from `./pages/OrdersPage`.
- Add a new `<Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />` to the existing route configuration.
- Ensure the route is placed logically within the route hierarchy (e.g., alongside `/dashboard`, `/reports`, `/settings`).

### Step 4: Update Dashboard Layout Navigation
Modify `src/components/DashboardLayout.tsx`.
- Identify the sidebar navigation block (likely a list of links or buttons).
- Add a new navigation item linking to `/orders`.
- Label the item "Orders".
- Use an appropriate icon from `lucide-react` (e.g., `ShoppingCart` or `Package`) to match the visual style of existing sidebar items.
- Ensure the new link uses the same active-state styling and structure as the existing links (`Dashboard`, `Reports`, `Settings`).

## Risks & Mitigations
- **StatusBadge Export**: If `StatusBadge` in `ReportsPage.tsx` is not exported, the implementer must inline its styling. This is a minor deviation but ensures component isolation.
- **Sidebar Structure**: If `DashboardLayout.tsx` uses a non-standard structure for navigation (e.g., external config array or conditional rendering), the implementer should adapt the new link to match that pattern exactly.
- **Table Responsiveness**: Horizontal scrolling must be applied to the table wrapper, not the page body, to prevent layout breakage on small viewports. Headers should remain visible if feasible using `sticky top-0`.
