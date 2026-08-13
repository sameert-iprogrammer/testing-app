# MIS-11: Add Orders Page

## Story Metadata
- **JIRA Key:** MIS-11
- **Title:** Add orders page
- **Description:** Add orders page with mock listing

## Description
Implement a new Orders page that displays a mock listing of orders using standard e-commerce columns. The page should follow the existing application architecture, styling conventions, and component patterns.

## Acceptance Criteria
- [ ] A new `OrdersPage` component is created in `src/pages/OrdersPage.tsx`
- [ ] The page is accessible via a new route `/orders` in the application router
- [ ] The page is protected by `ProtectedRoute` (requires authentication)
- [ ] The page uses `DashboardLayout` for consistent layout and navigation
- [ ] The page displays a table of mock order data with the following columns:
  - Order ID
  - Customer Name
  - Order Date
  - Status (e.g., Pending, Processing, Shipped, Delivered, Cancelled)
  - Total Amount
- [ ] The table contains at least 5-10 mock order entries
- [ ] Status values are visually distinguished using badges (consistent with existing `StatusBadge` pattern from `ReportsPage`)
- [ ] The page renders without errors and matches the existing design system (Tailwind CSS, lucide-react icons)
- [ ] No filtering or sorting controls are present (as per resolved decision)

## Resolved Decisions
1. **Columns:** Standard E-commerce Columns (Order ID, Customer Name, Date, Status, Total Amount)
2. **Filtering/Sorting:** No filtering or sorting functionality is required for this iteration

## UI/UX Requirements
- **Layout:** Full-width content area within `DashboardLayout`, consistent with `DashboardPage` and `ReportsPage`
- **Table Design:** Clean, readable table with header row, proper spacing using Tailwind CSS, and clear visual hierarchy
- **Status Badges:** Color-coded status indicators (e.g., green for Delivered, yellow for Processing, red for Cancelled, blue for Pending)
- **Typography:** Consistent with existing pages (headings, table headers, data cells) using Tailwind typography utilities
- **Icons:** Use `lucide-react` icons where appropriate (e.g., `Package`, `Calendar`, `User`, `DollarSign`)
- **Responsive:** Table should be horizontally scrollable on smaller viewports if content overflows

## Implementation Notes
- **File Location:** Create `src/pages/OrdersPage.tsx`
- **Routing:** Add `/orders` route to the application router (likely in `src/App.tsx` or router configuration)
- **Navigation:** Add an "Orders" link to the `DashboardLayout` navigation menu alongside existing pages (Dashboard, Reports, Settings)
- **Mock Data:** Create a mock data array of order objects in the page component or a separate `src/data/mockOrders.ts` file
- **Component Structure:** 
  - `OrdersPage` (main page component)
  - Optional: `OrderTable` subcomponent for the table rendering (if complexity warrants separation)
- **Styling:** Use Tailwind CSS utility classes consistent with existing pages
- **TypeScript:** Define an `Order` interface with appropriate types for all fields

## Assumptions
1. The application uses React Router v7 for client-side routing (based on `react-router-dom@^7.14.2` dependency)
2. The `DashboardLayout` component can be extended to include a new navigation item for Orders
3. The `StatusBadge` component pattern from `ReportsPage` can be reused or a similar component created for the Orders page
4. Mock data will be static TypeScript arrays defined within the page or a dedicated data file
5. The existing `Toast` system is not required for this page (no user actions that trigger notifications)
6. Authentication state is managed by `useAuth` hook and is already available in the app context
7. The route structure follows the existing pattern where protected routes are wrapped in `ProtectedRoute` and rendered inside `DashboardLayout`

## References
- Existing pages: `src/pages/DashboardPage.tsx`, `src/pages/ReportsPage.tsx`, `src/pages/SettingsPage.tsx`
- Layout: `src/components/DashboardLayout.tsx`
- Routing: `src/App.tsx`
- Auth: `src/hooks/useAuth.ts`
- Components: `src/components/ProtectedRoute.tsx`, `src/components/Toast.tsx`
- Styling: `tailwind.config.js`, `src/index.css`
