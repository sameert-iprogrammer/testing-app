# MIS-12: Add Orders Page - Implementation Plan

## Overview
This plan outlines the implementation of the Orders page, adding a new authenticated route (`/orders`) that displays a responsive data table with mock e-commerce order data. The implementation reuses existing layout, routing, and styling patterns from the repository.

## Resolved Decisions
- **Fields**: Standard E-commerce Fields (Order ID, Customer, Date, Status, Total, Actions).
- **UI Component**: Data Table.

## Open Questions
None. All ambiguities have been resolved via assumptions below.

## Assumptions
1. `App.tsx` uses standard `react-router-dom` v7 `<Routes>` and `<Route>` components for client-side routing.
2. The sidebar navigation in `DashboardLayout.tsx` is a simple list of links using `lucide-react` icons and `react-router-dom` `Link` components. The implementer will add the 'Orders' link following this exact pattern.
3. The `StatusBadge` component from `ReportsPage.tsx` is a local component. The implementer will replicate its color-mapping logic and Tailwind classes locally in `OrdersPage.tsx` to avoid cross-file dependencies.

## Files to Touch
- `src/pages/OrdersPage.tsx` (Create)
- `src/App.tsx` (Modify)
- `src/components/DashboardLayout.tsx` (Modify)

## Implementation Steps

### Step 1: Define Mock Data and Types (`src/pages/OrdersPage.tsx`)
- Define the `MockOrder` interface matching the spec:
  ```typescript
  interface MockOrder {
    id: string;
    customer: string;
    date: string;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
  }
  ```
- Create a static array `MOCK_ORDERS` containing at least 5 rows with varied statuses. Format dates as `YYYY-MM-DD` or `MMM DD, YYYY`.

### Step 2: Implement Status Badge & Table Component (`src/pages/OrdersPage.tsx`)
- Create a local `StatusBadge` component (or inline logic) that renders a colored badge based on the `status` prop. Use Tailwind classes consistent with `ReportsPage.tsx` (e.g., green for Delivered, yellow for Pending, red for Cancelled, blue for Shipped).
- Create the `OrdersPage` component.
- Render a responsive HTML `<table>` with a sticky header (`sticky top-0`).
- Apply Tailwind utility classes matching the existing dark/slate theme (e.g., `bg-slate-900/40`, `border-slate-800`, `text-white`, `text-slate-400`).
- Map over `MOCK_ORDERS` to render table rows:
  - **Order ID**: `font-mono`, clickable or copyable.
  - **Customer**: Left-aligned.
  - **Date**: Formatted date string.
  - **Status**: Rendered via `StatusBadge`.
  - **Total**: Right-aligned, currency formatted (e.g., `$1,234.56`).
  - **Actions**: Simple text links or `lucide-react` icons (e.g., `Eye`, `Edit3`).

### Step 3: Update Routing (`src/App.tsx`)
- Import `OrdersPage` from `./pages/OrdersPage`.
- Locate the existing `<Routes>` block.
- Add the new route inside the protected section:
  ```tsx
  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
  ```

### Step 4: Update Navigation (`src/components/DashboardLayout.tsx`)
- Import `Link` from `react-router-dom` and a relevant icon from `lucide-react` (e.g., `ShoppingCart` or `Package`).
- Locate the existing sidebar navigation list.
- Append a new navigation item linking to `/orders`, matching the existing link styling, hover states, and icon placement.

## Context Budget
- **`src/App.tsx`**: Locate the `<Routes>` block to append the new route.
- **`src/components/DashboardLayout.tsx`**: Locate the sidebar navigation list to append the new link.
- **`src/pages/ReportsPage.tsx`**: Inspect `StatusBadge` for color mapping and styling conventions to replicate in `OrdersPage.tsx`.
- **`src/pages/DashboardPage.tsx`**: Reference for general page layout, spacing, and Tailwind color palette consistency.

No other files require reading or modification.

```json
{
  "clarification": {
    "needed": false,
    "questions": [],
    "assumptions": [
      {
        "statement": "App.tsx uses standard react-router-dom v7 <Routes> and <Route> components for client-side routing.",
        "risk": "low"
      },
      {
        "statement": "The sidebar in DashboardLayout.tsx is a simple list of links using lucide-react icons and react-router-dom Link components. The implementer will add the 'Orders' link following this exact pattern.",
        "risk": "low"
      },
      {
        "statement": "The StatusBadge component from ReportsPage.tsx is a local component. The implementer will replicate its color-mapping logic and Tailwind classes locally in OrdersPage.tsx to avoid cross-file dependencies.",
        "risk": "low"
      }
    ]
  }
}
```
