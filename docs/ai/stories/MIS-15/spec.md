# MIS-15: Orders Page

## Summary
Add an orders page with mock listing for the testing-app React application.

## Acceptance Criteria
1. **OrdersPage component** — `src/pages/OrdersPage.tsx` exists and exports a default `OrdersPage` React component.  
2. **Mock order data** — The page includes a `mockOrders` array with at least 5 sample orders conforming to an `Order` interface.  
3. **Visual consistency** — Styling matches the project's Tailwind CSS conventions (slate-900 backgrounds, indigo accents, rounded corners, spacing).  
4. **Route integration** — The page can be added to the app's routing configuration in `src/App.tsx`.  
5. **Status indicators** — Orders display status badges reflecting states such as pending, completed, and failed.

## Requirements
- Define an `Order` interface with the following properties:
  - `id: string`
  - `customerName: string`
  - `orderDate: string`
  - `totalAmount: string` (formatted currency)
  - `status: 'pending' | 'completed' | 'failed' | 'processing'`
  - `itemCount: number` or `items: string` (brief description)
- Create `src/pages/OrdersPage.tsx` containing:
  - A `mockOrders` constant with at least 5 `Order` objects with varying statuses.
  - An `OrdersPage` component that renders the order listing.
  - The component uses a table or grid layout consistent with `ReportsPage` and `DashboardPage`.
  - Each order row/card displays: order ID, customer name, date, total amount, and status badge.
  - Status badges use color coding (e.g., green for completed, amber/red for pending/failed).
  - The page header follows the pattern of other pages: `<h1>` title + brief description.
- Update `src/App.tsx` to add a `<Route path="/orders" element={<DashboardLayout><OrdersPage /></DashboardLayout>} />` (or equivalent placement within the dashboard route hierarchy).
- If the application requires authentication for dashboard pages, wrap OrdersPage with `ProtectedRoute` (consistent with ReportsPage, DashboardPage, SettingsPage).

## UI Notes
- Follow the visual pattern of `ReportsPage`: `bg-slate-900/40`, `border-slate-800`, `rounded-2xl`, `p-6`.
- Use Tailwind utility classes for spacing, colors, and rounding consistent throughout the app.
- Order status badges should use the same styling approach as `StatusBadge` from `ReportsPage` or inline conditional classes.
- Consider adding a "Download Orders" or "Export" button similar to the "View All Transactions" button in DashboardPage, or the download button in DashboardHeader.
- Page title: "Orders" or "Order Management" as the main heading.

## Implementation Notes
- The `Order` interface can be defined inline in `OrdersPage.tsx` or extracted to a shared types file if the project expands.
- Mock data should mirror the structure of `ReportsPage`'s `mockReports` for consistency in data modeling.
- Routing: Add the route inside the `DashboardLayout` so it inherits the app's navigation shell and authentication context.
- Determine `ProtectedRoute` wrapping by checking the existing pattern: ReportsPage and DashboardPage are already behind ProtectedRoute/DashboardLayout; OrdersPage should follow the same pattern.
- Export `OrdersPage` as default.
- Consider keyboard accessibility and focus management for the order table/interaction.

## Assumptions
- The project uses React Router v7 (`react-router-dom@^7.14.2`) and routes are defined in `src/App.tsx` using `<Route>` elements.
- The dashboard pages (DashboardPage, ReportsPage, SettingsPage) are all protected and rendered within `DashboardLayout`, which provides the surrounding UI (header, logout, etc.).
- Tailwind CSS configuration remains unchanged and supports the existing color palette (slate, indigo, emerald, rose).
- Mock order data is static and does not require a real API connection or backend integration for this story.
- The `StatusBadge` component from `ReportsPage` can be reused or an inline implementation with similar styling is acceptable.
- The orders page does not require a form or user input; it is a display-only listing page.

## Open Questions
None at this time. All ambiguities have been resolved through assumptions documented above.

## References
- `src/pages/ReportsPage.tsx` — mock data pattern and StatusBadge component
- `src/pages/DashboardPage.tsx` — StatCard and TransactionItem patterns for inspiration
- `src/components/DashboardLayout.tsx` — layout structure and authentication pattern
- `src/App.tsx` — routing structure and ProtectedRoute usage
- `src/hooks/useAuth.ts` — authentication context (for ProtectedRoute decision)

## Attachments
None

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "Orders page route path is /orders within DashboardLayout", "risk": "low"}, {"statement": "OrdersPage should be wrapped with ProtectedRoute like other dashboard pages", "risk": "low"}, {"statement": "Order interface fields follow the pattern defined in the spec (id, customerName, orderDate, totalAmount, status, itemCount)", "risk": "low"}]}
