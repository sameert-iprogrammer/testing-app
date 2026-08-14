# MIS-14: Orders Page

## Story Metadata
- **JIRA Key**: MIS-14
- **Title**: Orders page
- **Description**: Orders page with mock listing data

## Resolved Decisions
- **Columns/Fields**: Standard Set (ID, Customer, Date, Status, Amount)
- **Interactivity**: Basic Static List (no sorting, filtering, or pagination)
- **Route Path**: `/orders`

## Acceptance Criteria
1. The Orders page is accessible at the route `/orders`.
2. The page renders within the existing `DashboardLayout` component, preserving the application header and navigation shell.
3. The page displays a list of mock order records.
4. Each order record explicitly displays five columns/fields: ID, Customer, Date, Status, and Amount.
5. The list is static; it does not include interactive controls for sorting, filtering, or pagination.
6. Order statuses are visually distinguished using a badge-style indicator (consistent with the existing `StatusBadge` component in `ReportsPage.tsx`).
7. The page styling adheres to the project's Tailwind CSS conventions and matches the visual language of `DashboardPage.tsx` and `ReportsPage.tsx`.
8. The page is protected by the existing `ProtectedRoute` mechanism, ensuring it is only accessible to authenticated users.

## UI/UX Notes
- **Layout Structure**: The page content should be placed inside the `DashboardLayout` component's `children` prop to maintain consistent spacing, header, and footer across the application.
- **Data Presentation**: Use a clean, responsive HTML `<table>` or a structured list component. Given the static nature, a standard table with clear headers and aligned columns is preferred.
- **Status Indicators**: Reuse or adapt the `StatusBadge` component from `src/pages/ReportsPage.tsx` to render status values (e.g., Pending, Processing, Shipped, Delivered, Cancelled) with appropriate color coding.
- **Typography & Spacing**: Follow the existing Tailwind utility classes for text sizing, font weights, and padding/margins as established in `DashboardPage.tsx`.
- **Empty State**: Not required for this iteration, as mock data will always be present.

## Implementation Notes
- **File Creation**: Create `src/pages/OrdersPage.tsx`.
- **Mock Data**: Define a constant array of mock order objects directly in `OrdersPage.tsx` or in a dedicated `src/data/mockOrders.ts` file. The array should contain 5-10 items to demonstrate the layout.
- **Routing Configuration**: Add a route for `/orders` in `src/App.tsx`. Ensure it is wrapped with `ProtectedRoute` and nested appropriately within the router structure.
- **Component Usage**:
  - Import `DashboardLayout` from `src/components/DashboardLayout`.
  - Import `StatusBadge` from `src/pages/ReportsPage.tsx` (or extract it to a shared `src/components` directory if it proves useful elsewhere, though local reuse is acceptable for this scope).
- **Styling**: Apply Tailwind CSS classes for table structure, borders, hover states, and responsive behavior. Align monetary values to the right and dates to the left for readability.

## Assumptions
- The application uses React Router v7 for client-side routing, consistent with `react-router-dom@^7.14.2` in `package.json`.
- The `DashboardLayout` component expects `children` as its only prop and handles all navigation/header logic internally.
- No additional API integration or backend mocking is required; all data will be hardcoded for this stage.
- The existing `ProtectedRoute` component in `src/components/ProtectedRoute.tsx` will automatically guard the new route without modification.
- Date formatting will use standard `toLocaleDateString()` or a simple string format consistent with other pages.
- Monetary amounts will be formatted as standard currency strings (e.g., `$1,234.56`).
