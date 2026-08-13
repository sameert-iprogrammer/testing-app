# MIS-12: Add Orders Page

## Story Metadata
- **JIRA Key**: MIS-12
- **Title**: Add Orders page
- **Description**: Add orders page with mock listing data
- **Type**: Feature / UI Implementation

## Acceptance Criteria
- [ ] The application includes a new `/orders` route accessible only to authenticated users.
- [ ] The Orders page renders inside the existing `DashboardLayout` to preserve navigation and header consistency.
- [ ] The page displays a data table populated with mock order data (minimum 5 rows).
- [ ] Each table row displays standard e-commerce fields: Order ID, Customer Name, Order Date, Status, Total Amount, and an Actions column.
- [ ] The Status column uses a visually distinct badge or indicator to differentiate states (e.g., Pending, Shipped, Delivered, Cancelled).
- [ ] The page adheres to the existing Tailwind CSS styling conventions and TypeScript typing standards.
- [ ] The navigation menu within `DashboardLayout` includes a link to the Orders page.

## UI/UX Notes
- **Layout**: Reuse `DashboardLayout.tsx` for page shell (sidebar/header).
- **Data Table**: Implement a responsive HTML table styled with Tailwind CSS. Include a sticky header and hover states for rows.
- **Columns**:
  - `Order ID`: Monospace font, clickable or copyable.
  - `Customer`: Full name, aligned left.
  - `Date`: Formatted as `YYYY-MM-DD` or `MMM DD, YYYY`.
  - `Status`: Color-coded badge (e.g., green for Delivered, yellow for Pending, red for Cancelled).
  - `Total`: Currency formatted (e.g., `$1,234.56`), right-aligned.
  - `Actions`: Simple icon buttons or text links (e.g., "View", "Edit").
- **Empty State**: If mock data were dynamic, an empty state would be shown, but for this story, static mock data ensures the table always renders.

## Implementation Notes
- **File Creation**: `src/pages/OrdersPage.tsx`
- **Routing**: Update `src/App.tsx` to add:
  ```tsx
  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
  ```
- **Navigation**: Add an "Orders" link to the sidebar/menu in `src/components/DashboardLayout.tsx` pointing to `/orders`.
- **Mock Data**: Define a `MockOrder` interface and an array of mock objects in `src/pages/OrdersPage.tsx` (or `src/utils/mockOrders.ts` if preferred). Example structure:
  ```typescript
  interface MockOrder {
    id: string;
    customer: string;
    date: string;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
  }
  ```
- **Styling**: Use Tailwind utility classes consistent with `ReportsPage.tsx` and `DashboardPage.tsx`. Leverage existing `StatusBadge` pattern from `ReportsPage.tsx` for status indicators.
- **Type Safety**: Ensure all props and state are strictly typed. No `any` types.

## Resolved Decisions
- **Q**: What specific fields should be displayed for each mock order?
  **A**: Standard E-commerce Fields (Order ID, Customer, Date, Status, Total, Actions)
- **Q**: What UI component should be used to display the list of orders?
  **A**: Data Table

## Assumptions
- The existing `DashboardLayout` will be updated to include the new navigation link without altering its core props interface.
- The `ProtectedRoute` component will wrap the Orders page to enforce authentication, matching the pattern used for other dashboard pages.
- Mock data will be static and hardcoded for this iteration; no API integration is required.
- The application's routing setup in `App.tsx` uses `react-router-dom` v7, consistent with the dependency list.
- No additional third-party table libraries (e.g., TanStack Table) will be introduced; a native HTML table with Tailwind classes will suffice.
- The `StatusBadge` component from `ReportsPage.tsx` can be refactored into a shared utility or reused directly; if refactoring is needed, it will be scoped to this story to avoid breaking changes.

## References
- `src/pages/ReportsPage.tsx` (for StatusBadge pattern and table styling conventions)
- `src/components/DashboardLayout.tsx` (for layout and navigation structure)
- `src/App.tsx` (for route configuration)
- `src/hooks/useAuth.ts` (for authentication context)
