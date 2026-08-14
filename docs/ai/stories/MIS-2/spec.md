# MIS-2: Orders Page

## Story Metadata
- **JIRA Key:** MIS-2
- **Title:** Orders page
- **Description:** Add orders page with mock listing data

## Acceptance Criteria
1. A new `OrdersPage.tsx` component is created in `src/pages/`.
2. The page renders a list/table of mock orders.
3. Each order displays: Order ID, Customer Name, Order Date, Status, and Total Amount.
4. The page is styled using Tailwind CSS, matching the existing dashboard aesthetic (consistent with `DashboardPage.tsx` and `ReportsPage.tsx`).
5. The page is accessible via the `/orders` route and protected by `ProtectedRoute`, utilizing `DashboardLayout` for the chrome/header.
6. All data is mock/static; no API calls are made.

## UI/UX Notes
- **Layout:** Use `DashboardLayout` to wrap the page content, maintaining consistent header/sidebar navigation.
- **Data Display:** Use a responsive HTML `<table>` or Tailwind-styled card grid to display orders.
- **Status Indicators:** Reuse or adapt the `StatusBadge` component pattern from `ReportsPage.tsx` to color-code order statuses (e.g., green for Delivered, yellow for Pending, red for Cancelled).
- **Typography & Spacing:** Follow existing `index.css` and `tailwind.config.js` conventions for font sizes, weights, and spacing.

## Implementation Notes
- **File Structure:** Create `src/pages/OrdersPage.tsx`.
- **Types:** Define an `Order` interface matching the displayed fields.
- **Mock Data:** Define a `MOCK_ORDERS` array of `Order` objects directly in the page file.
- **Routing:** Add a new route `<Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />` in `App.tsx`.
- **Styling:** Use utility classes for table rows, hover states, and responsive breakpoints.

## Assumptions
1. The Orders page is a protected dashboard page, so it will be wrapped in `DashboardLayout` and protected by `ProtectedRoute`, consistent with `ReportsPage` and `SettingsPage`.
2. The route path will be `/orders`.
3. Order statuses will be limited to: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`.
4. Mock data will be defined inline in `src/pages/OrdersPage.tsx` containing ~5-10 sample orders.
5. No pagination, sorting, or filtering is required for this initial implementation; a flat list is sufficient.

## Open Questions
*(None)*

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "The Orders page is a protected dashboard page wrapped in DashboardLayout and ProtectedRoute, consistent with ReportsPage and SettingsPage.", "risk": "low"}, {"statement": "Mock data will be defined inline in src/pages/OrdersPage.tsx containing ~5-10 sample orders.", "risk": "low"}, {"statement": "Order statuses will be limited to: Pending, Processing, Shipped, Delivered, Cancelled.", "risk": "low"}, {"statement": "No pagination, sorting, or filtering is required; a flat list is sufficient.", "risk": "low"}]}}
