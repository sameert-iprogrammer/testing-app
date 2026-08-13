# MIS-13: Orders page

## Story Metadata
- **JIRA Key**: MIS-13
- **Title**: Orders page
- **Description**: Add orders page with mock listing

## Resolved Decisions
- **Layout**: Responsive Table
- **Data Scope**: Summary Only (mock orders will not include line items/products)

## Acceptance Criteria
- [ ] A new protected route `/orders` is added to the application routing configuration.
- [ ] Navigating to `/orders` renders a page wrapped in `DashboardLayout` and `ProtectedRoute`.
- [ ] The page displays a responsive data table listing mock orders.
- [ ] Each table row displays summary fields: Order ID, Customer Name, Order Date, Total Amount, and Status.
- [ ] Status values are visually distinguished using badge-style indicators consistent with the existing `StatusBadge` component in `ReportsPage.tsx`.
- [ ] The table handles small viewports gracefully via horizontal scrolling without breaking the page layout.
- [ ] The page uses Tailwind CSS classes that align with the existing design system (typography, spacing, colors).
- [ ] The page integrates seamlessly with the existing `DashboardLayout` without visual or structural regressions.

## Requirements
### Data
- Mock data array containing 10–15 order objects.
- Object shape: `{ id: string; customer: string; date: string; total: number; status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' }`.
- Data should be defined locally (either inline in the page component or in a dedicated `mockOrders.ts` file) to avoid external API calls or heavy dependencies.

### UI/UX
- **Table Component**: A semantic `<table>` or Tailwind-styled flex/grid layout that behaves as a table.
- **Columns**: Order ID, Customer, Date, Total, Status.
- **Status Badges**: Reuse or adapt the styling pattern from `src/pages/ReportsPage.tsx` (`StatusBadge`) to color-code order statuses (e.g., Green for Delivered, Yellow for Pending, Red for Cancelled).
- **Responsiveness**: On mobile/tablet viewports, the table container should allow horizontal scrolling (`overflow-x-auto`) to prevent horizontal page overflow. Headers should remain visible if feasible.
- **Header**: A clear page title ("Orders") at the top of the content area.

### Routing & Navigation
- Add `/orders` to the React Router configuration in `src/App.tsx`.
- Ensure the new route is added to the navigation menu/sidebar within `DashboardLayout.tsx` (aligning with existing links like Dashboard, Reports, Settings).

## Implementation Notes
- **File Structure**:
  - Create `src/pages/OrdersPage.tsx`.
  - Optionally create `src/data/mockOrders.ts` for cleaner separation, or inline the mock data if preferred by project conventions.
- **Dependencies**:
  - Use `lucide-react` for any supplementary icons (e.g., a cart or package icon in the page header).
  - Leverage `react-router-dom` for routing.
  - Use Tailwind CSS for all styling.
- **Integration**:
  - Wrap the `OrdersPage` component in `<ProtectedRoute>` in `App.tsx`.
  - Ensure `DashboardLayout` passes the correct children and maintains the header/footer structure.
  - If `DashboardLayout` contains a sidebar navigation, add a link to `/orders` alongside existing links.

## Open Questions & Assumptions
### Assumptions
- The mock data will be static and defined at build time.
- The existing `DashboardLayout` will accommodate an additional navigation item without breaking the current layout.
- Status badge colors will follow a standard semantic mapping (e.g., Green for Delivered, Yellow for Pending, Red for Cancelled).
- Sorting, filtering, and pagination are out of scope for this story (MVP focus on listing).

### Open Questions
- Should the Order ID be clickable to navigate to a future "Order Details" page (reserved route `/orders/:id`)? *(Assumption: No deep linking for now, just plain text.)*
- Does the `DashboardLayout` currently render a sidebar, or is navigation solely in the header? *(Assumption: Sidebar exists based on typical dashboard patterns, but will verify during implementation.)*
