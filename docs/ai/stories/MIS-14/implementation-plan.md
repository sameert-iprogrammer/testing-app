# Implementation Plan: MIS-14 (Orders Page)

## Overview
This plan implements the Orders page, adding a static mock listing of orders accessible at `/orders`. The page will be protected by the existing `ProtectedRoute` and styled to match the application's dark-mode Tailwind conventions.

## Resolved Decisions
- **Columns/Fields**: ID, Customer, Date, Status, Amount.
- **Interactivity**: Basic Static List (no sorting, filtering, or pagination).
- **Route Path**: `/orders`.

## Files to Touch
- `src/data/mockOrders.ts` (Create) — Mock data array for orders.
- `src/components/StatusBadge.tsx` (Create) — Extracted reusable status badge component.
- `src/pages/ReportsPage.tsx` (Modify) — Update to import `StatusBadge` from the new shared location.
- `src/pages/OrdersPage.tsx` (Create) — The new Orders page component.
- `src/App.tsx` (Modify) — Add the `/orders` route wrapped in `ProtectedRoute`.

## Context Budget
- **`src/App.tsx`**: Review existing route structure to determine where to insert the new `/orders` route.
- **`src/pages/ReportsPage.tsx`**: Locate the `StatusBadge` component definition to extract it.
- **`src/pages/OrdersPage.tsx`**: Use `DashboardPage.tsx` and `ReportsPage.tsx` as visual references for table styling, typography, and layout.
- **`src/components/DashboardLayout.tsx`**: Confirm `children` prop usage for layout nesting.

## Implementation Steps

### Step 1: Create Mock Data
Create `src/data/mockOrders.ts`.
- Define a `MockOrder` interface with fields: `id`, `customer`, `date`, `status`, `amount`.
- Export a constant array `mockOrders` containing 5-10 sample objects.
- Format dates as strings (e.g., `toLocaleDateString()`) and amounts as currency strings (e.g., `$1,234.56`).

### Step 2: Extract StatusBadge Component
Create `src/components/StatusBadge.tsx`.
- Move the `StatusBadge` component from `src/pages/ReportsPage.tsx` to this new file.
- Define a `StatusBadgeProps` interface: `{ status: string }`.
- Implement color mapping for statuses (e.g., Pending: yellow, Processing: blue, Shipped: indigo, Delivered: green, Cancelled: red) using Tailwind classes.
- Export `StatusBadge`.

Update `src/pages/ReportsPage.tsx`.
- Import `StatusBadge` from `../components/StatusBadge`.
- Remove the local `StatusBadge` definition.

### Step 3: Implement OrdersPage
Create `src/pages/OrdersPage.tsx`.
- Import `DashboardLayout` from `../components/DashboardLayout`.
- Import `StatusBadge` from `../components/StatusBadge`.
- Import `mockOrders` from `../../data/mockOrders`.
- Define the `OrdersPage` component.
- Render `DashboardLayout` with `children` containing the order list.
- Inside the layout, create a responsive `<table>` with headers: ID, Customer, Date, Status, Amount.
- Map over `mockOrders` to render table rows.
- Apply Tailwind classes for table styling: `w-full`, `text-left`, `align-middle`, `border-b`, `hover:bg-slate-800/50`, etc.
- Align monetary values to the right (`text-right`) and dates to the left.
- Use `StatusBadge` for the Status column.

### Step 4: Configure Routing
Update `src/App.tsx`.
- Import `OrdersPage` from `./pages/OrdersPage`.
- Add a new `<Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />` entry within the router configuration.
- Ensure the route is nested appropriately (likely alongside other dashboard routes).

## Assumptions
- **Status Badge Colors**: Standard Tailwind color mapping will be used for status badges (Pending: yellow-500, Processing: blue-500, Shipped: indigo-500, Delivered: green-500, Cancelled: red-500) unless `ReportsPage.tsx` defines specific colors that differ.
- **DashboardLayout Props**: `DashboardLayout` accepts only `children` as a prop, as stated in the spec.
- **Date Formatting**: Standard `toLocaleDateString()` or simple string format will be used for dates.
- **ProtectedRoute**: The existing `ProtectedRoute` component will automatically guard the new route without modification.

{"clarification":{"needed":false,"questions":[],"assumptions":[{"statement":"Standard Tailwind color mapping will be used for status badges (Pending: yellow-500, Processing: blue-500, Shipped: indigo-500, Delivered: green-500, Cancelled: red-500) unless ReportsPage.tsx defines specific colors that differ.","risk":"low"},{"statement":"DashboardLayout accepts only children as a prop.","risk":"low"},{"statement":"Standard toLocaleDateString() or simple string format will be used for dates.","risk":"low"},{"statement":"The existing ProtectedRoute component will automatically guard the new route without modification.","risk":"low"}]}}
