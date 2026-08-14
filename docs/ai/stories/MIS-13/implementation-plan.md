# MIS-13 Implementation Plan: Orders Page

## Resolved Decisions
- **Static mock list only** — no search, filtering, sorting, or pagination.
- **Basic fields** — ID, Date, Customer, Status, Total.

## Files to Touch
- `src/pages/OrdersPage.tsx` (Create)
- `src/utils/generateSampleOrders.ts` (Create)
- `src/components/DashboardLayout.tsx` (Modify)
- `src/App.tsx` (Modify)

## Context Budget
- `src/pages/ReportsPage.tsx` (to see `StatusBadge` pattern and page structure)
- `src/components/DashboardLayout.tsx` (to see sidebar structure for nav link)
- `src/App.tsx` (to see routing structure)
- `src/utils/generateSampleReport.ts` (to see mock data pattern)

## Implementation Steps

### 1. Create Mock Data Utility
- **File:** `src/utils/generateSampleOrders.ts`
- **Action:** Create a new file exporting an `Order` interface and a `MOCK_ORDERS` constant array.
- **Details:**
  - Define `interface Order { id: string; date: string; customer: string; status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; total: string; }`
  - Populate `MOCK_ORDERS` with at least 5 rows matching the spec's example data (e.g., `ORD-001` through `ORD-005`).
  - Follow the export pattern in `src/utils/generateSampleReport.ts`.

### 2. Create Orders Page Component
- **File:** `src/pages/OrdersPage.tsx`
- **Action:** Create a new file exporting the `OrdersPage` component.
- **Details:**
  - Import `DashboardLayout` and `ProtectedRoute`.
  - Import `MOCK_ORDERS` and `Order` from `src/utils/generateSampleOrders.ts`.
  - Define an inline `StatusBadge` component mirroring the pattern from `src/pages/ReportsPage.tsx`, mapping status strings to Tailwind color classes:
    - `Pending`: `bg-yellow-100 text-yellow-800`
    - `Processing`: `bg-blue-100 text-blue-800`
    - `Shipped`: `bg-indigo-100 text-indigo-800`
    - `Delivered`: `bg-green-100 text-green-800`
    - `Cancelled`: `bg-red-100 text-red-800`
  - Render a page layout with a title "Orders".
  - Render a responsive table or card-based list displaying the `MOCK_ORDERS` data with columns: ID, Date, Customer, Status (using `StatusBadge`), and Total.
  - Ensure the component is wrapped in `ProtectedRoute` and `DashboardLayout` as per spec.

### 3. Add Navigation Link
- **File:** `src/components/DashboardLayout.tsx`
- **Action:** Modify the existing sidebar navigation list.
- **Details:**
  - Add a new navigation item (e.g., `<li>` or `<a>`) linking to `/orders`.
  - Use a `lucide-react` icon (e.g., `Package` or `List`) consistent with other nav items.
  - Place it in alphabetical or logical order with existing pages.

### 4. Register Route
- **File:** `src/App.tsx`
- **Action:** Modify the route configuration.
- **Details:**
  - Add a new `<Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />` to the router configuration.
  - Place it alongside existing routes (`/`, `/login`, `/dashboard`, `/reports`, `/settings`).

## Risks
- **Sidebar Structure:** If `DashboardLayout.tsx` uses a non-standard structure for navigation, the implementer may need to adapt the link insertion. (Mitigation: Context budget includes reading `DashboardLayout.tsx`.)
- **StatusBadge Consistency:** If `ReportsPage.tsx` uses a complex `StatusBadge` implementation, inlining it in `OrdersPage.tsx` might lead to slight visual inconsistencies. (Mitigation: Follow the exact Tailwind classes provided in the spec.)

## Open Questions
None.

```json
{
  "clarification": {
    "needed": false,
    "questions": [],
    "assumptions": [
      {
        "statement": "DashboardLayout.tsx has a sidebar navigation list where a new <li> with a link to /orders can be appended.",
        "risk": "low"
      },
      {
        "statement": "App.tsx uses react-router-dom and has a route configuration block where the /orders route can be added alongside existing routes.",
        "risk": "low"
      },
      {
        "statement": "StatusBadge will be defined inline within OrdersPage.tsx to avoid scope creep into a shared component refactoring, as extraction is noted to be a separate task.",
        "risk": "low"
      }
    ]
  }
}
```
