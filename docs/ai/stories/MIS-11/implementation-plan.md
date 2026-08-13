# MIS-11: Add Orders Page - Implementation Plan

## Context Budget
- **Target Files Only**: `src/pages/OrdersPage.tsx`, `src/App.tsx`, `src/components/DashboardLayout.tsx`.
- **No Full Reads Needed**: 
  - `src/pages/ReportsPage.tsx`: Only need to replicate the visual pattern for `StatusBadge` (colored pills for statuses). No need to read its full implementation.
  - `src/components/DashboardLayout.tsx`: Only need to append a new navigation link. No need to refactor the layout.
  - `src/App.tsx`: Only need to add one route. No need to review the entire routing tree.
- **Scoped Assumptions**: Routing structure and navigation menu structure are assumed to follow the existing patterns for `/dashboard`, `/reports`, and `/settings`.

## Resolved decisions
- **Columns**: Standard E-commerce Columns (Order ID, Customer Name, Order Date, Status, Total Amount).
- **Filtering/Sorting**: No filtering or sorting functionality is required for this iteration.

## Files to Touch
- `src/pages/OrdersPage.tsx` (Create)
- `src/App.tsx` (Modify)
- `src/components/DashboardLayout.tsx` (Modify)

## Implementation Steps

### Step 1: Create `src/pages/OrdersPage.tsx`
1. **Define Types & Mock Data**:
   - Create an `Order` interface with fields: `id` (string), `customerName` (string), `date` (string), `status` (enum: `'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'`), `totalAmount` (string).
   - Create a static mock data array (`MOCK_ORDERS`) with 5-10 entries.
2. **Define `StatusBadge` Component**:
   - Create a local `StatusBadge({ status })` component inside `OrdersPage.tsx`.
   - Use Tailwind CSS to render colored badges based on status:
     - `Pending`: Blue (`bg-blue-100 text-blue-800`)
     - `Processing`: Yellow (`bg-yellow-100 text-yellow-800`)
     - `Shipped`: Indigo (`bg-indigo-100 text-indigo-800`)
     - `Delivered`: Green (`bg-green-100 text-green-800`)
     - `Cancelled`: Red (`bg-red-100 text-red-800`)
3. **Implement `OrdersPage` Component**:
   - Import `DashboardLayout` and wrap the page content.
   - Render a page heading: `<h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>`.
   - Render a responsive table container: `<div className="overflow-x-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-6">`.
   - Build the table with headers: `Order ID`, `Customer Name`, `Order Date`, `Status`, `Total Amount`.
   - Map over `MOCK_ORDERS` to render table rows.
   - Use `lucide-react` icons for visual polish: `Package` (Order ID), `User` (Customer Name), `Calendar` (Order Date), `DollarSign` (Total Amount).
   - Apply existing design system classes (e.g., `text-slate-400` for secondary text, `font-semibold` for headers).

### Step 2: Modify `src/App.tsx`
1. Import `OrdersPage` from `./pages/OrdersPage`.
2. Locate the existing protected route group (likely containing `/dashboard`, `/reports`, `/settings`).
3. Add a new route:
   ```tsx
   <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
   ```

### Step 3: Modify `src/components/DashboardLayout.tsx`
1. Locate the existing navigation menu (likely a list of `Link` or `NavLink` components for Dashboard, Reports, Settings).
2. Add a new navigation item for "Orders":
   ```tsx
   <Link to="/orders" className="...existing-styles...">
     <Package className="mr-3 h-5 w-5" />
     Orders
   </Link>
   ```
3. Ensure the link uses the same active-state styling logic as existing items (e.g., checking `location.pathname` or using `NavLink`).

## Risks & Mitigations
- **Navigation Structure in `DashboardLayout`**: The exact markup for the navigation menu is not fully visible. *Assumption*: It is a simple list of `Link` components. I will append the "Orders" link following the exact same class names and structure as the existing "Reports" and "Settings" links.
- **StatusBadge Styling**: The exact Tailwind classes for `StatusBadge` in `ReportsPage` are not fully visible. *Assumption*: I will use standard Tailwind badge styling (`px-2.5 py-0.5 rounded-full text-xs font-medium`) with the color variants specified in the spec.
- **Routing Grouping**: The exact placement of routes in `App.tsx` is not fully visible. *Assumption*: I will place the `/orders` route inside the same `Routes` block as other protected routes, maintaining alphabetical or logical grouping.

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "The navigation menu in DashboardLayout is a simple list of Link/NavLink components. I will append the 'Orders' link using the exact same Tailwind classes and structure as the existing 'Reports' and 'Settings' links.", "risk": "low"}, {"statement": "The /orders route will be added to the existing protected Routes block in App.tsx alongside /dashboard, /reports, and /settings.", "risk": "low"}, {"statement": "The StatusBadge component will be defined locally within OrdersPage.tsx using standard Tailwind badge styling (e.g., px-2.5 py-0.5 rounded-full text-xs font-medium) with color variants matching the spec, rather than extracting it to a shared component.", "risk": "low"}]}}
