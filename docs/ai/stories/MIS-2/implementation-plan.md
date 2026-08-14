# MIS-2: Orders Page - Implementation Plan

## Overview
Create a new protected dashboard page (`OrdersPage`) that displays a responsive table of mock orders. The page will follow the existing dark-mode Tailwind aesthetic established in `DashboardPage.tsx` and `ReportsPage.tsx`. The route will be added to `App.tsx` and wrapped in `ProtectedRoute` and `DashboardLayout`.

## Files to Touch
- `src/pages/OrdersPage.tsx` (Create)
- `src/App.tsx` (Modify)

## Context Budget
- **Target Files**: `src/pages/OrdersPage.tsx`, `src/App.tsx`.
- **Reference Files** (for styling/patterns only): `src/pages/DashboardPage.tsx` (dark theme, grid/table styling, typography), `src/pages/ReportsPage.tsx` (`StatusBadge` component pattern), `src/components/DashboardLayout.tsx` (layout wrapper), `src/components/ProtectedRoute.tsx` (protection wrapper).
- **Avoid**: Reading full `node_modules`, testing files, or unrelated pages unless necessary for route syntax verification.

## Implementation Steps

### Step 1: Create `src/pages/OrdersPage.tsx`
1. **Define Types & Mock Data**:
   - Create an `Order` interface with fields: `id` (string), `customerName` (string), `orderDate` (string), `status` ('Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'), `totalAmount` (string).
   - Define a `MOCK_ORDERS` array containing 6-8 sample order objects. Format dates as strings (e.g., "Oct 24, 2023") and amounts as strings (e.g., "$1,234.56").
2. **Create `StatusBadge` Component**:
   - Create a local `StatusBadge` component inside `OrdersPage.tsx` (replicating the pattern from `ReportsPage.tsx` to keep changes scoped).
   - Map statuses to colors:
     - `Pending` / `Processing`: Yellow/Amber (`bg-yellow-500/10 text-yellow-500 border-yellow-500/20`)
     - `Shipped`: Blue/Indigo (`bg-blue-500/10 text-blue-500 border-blue-500/20`)
     - `Delivered`: Green (`bg-green-500/10 text-green-500 border-green-500/20`)
     - `Cancelled`: Red (`bg-red-500/10 text-red-500 border-red-500/20`)
3. **Build the UI**:
   - Export `OrdersPage` as a functional component.
   - Wrap content in a container matching `DashboardPage.tsx` styling (e.g., `space-y-8 animate-in fade-in duration-700`).
   - Add a header: `h1` ("Orders") and `p` ("Manage and track customer orders.").
   - Render a responsive table (`<table>`) or styled cards. A table is best for order data.
   - Table styling: Use `w-full text-left text-sm` with `thead` (uppercase, text-slate-400, border-b border-slate-700) and `tbody` rows (`border-b border-slate-800 hover:bg-slate-800/50 transition-colors`).
   - Columns: Order ID, Customer Name, Order Date, Status (render `StatusBadge`), Total Amount.
   - Ensure mobile responsiveness (e.g., horizontal scroll container for the table, or hide less critical columns on small screens).

### Step 2: Update `src/App.tsx`
1. **Import `OrdersPage`**:
   - Add import statement for the new `OrdersPage` component.
2. **Add Route**:
   - Locate the existing `<Routes>` block.
   - Insert a new `<Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />` alongside other protected dashboard routes.
   - *Assumption*: `App.tsx` uses `react-router-dom` v7 standard routing syntax (`<BrowserRouter>`, `<Routes>`, `<Route>`). If it uses a different pattern (e.g., `createBrowserRouter`), adapt the route insertion to match the existing syntax exactly.

## Risks & Assumptions
- **Assumption**: `react-router-dom` v7 is configured with standard `<BrowserRouter>` and `<Routes>` in `App.tsx`. If `App.tsx` uses a different routing setup (e.g., `createBrowserRouter`), the route syntax in Step 2 will need adjustment.
- **Assumption**: The `StatusBadge` component from `ReportsPage.tsx` is a local component and not exported. I will create a localized version in `OrdersPage.tsx` to avoid cross-file dependencies or modifying `ReportsPage.tsx`.
- **Assumption**: Mock data does not require complex formatting utilities; plain string interpolation for dates and currency is sufficient.
- **Risk**: If `DashboardLayout.tsx` requires specific props or context to render correctly, ensure `OrdersPage.tsx` is wrapped correctly. The spec confirms it takes `children`.

## Acceptance Criteria Mapping
1. `OrdersPage.tsx` created in `src/pages/` -> Step 1
2. Renders list/table of mock orders -> Step 1.3
3. Displays Order ID, Customer Name, Order Date, Status, Total Amount -> Step 1.3
4. Styled with Tailwind CSS matching dashboard aesthetic -> Step 1.3 (referencing `DashboardPage.tsx`)
5. Accessible via `/orders`, protected by `ProtectedRoute`, uses `DashboardLayout` -> Step 2
6. All data mock/static -> Step 1.1
