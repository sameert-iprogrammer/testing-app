# MIS-13: Orders Page — Specification

## Story Overview
- **JIRA Key:** MIS-13
- **Title:** Orders page
- **Description:** Add orders page with mock listing data
- **Priority:** Not specified
- **Estimate:** Not specified

## Acceptance Criteria
1. **Orders page exists** at the appropriate route (e.g., `/orders`) and is accessible from the dashboard navigation.
2. **Page displays a static list** of mock orders — no search, filtering, or pagination capabilities.
3. **Each order row shows five fields:** ID, Date, Customer, Status, and Total.
4. **Mock data is defined** as a TypeScript constant/array within the page module (or a dedicated `src/utils/` file) and contains at least 5 representative rows.
5. **Status values are rendered** with a visual badge or indicator (consistent with the existing `StatusBadge` pattern from `src/pages/ReportsPage.tsx`).
6. **Page follows the existing layout:** wrapped in `DashboardLayout` (from `src/components/DashboardLayout.tsx`) to share the header, sidebar, and logout behavior.
7. **Page is protected:** accessible only to authenticated users via `ProtectedRoute` (from `src/components/ProtectedRoute.tsx`).
8. **TypeScript types** are defined for the order model and used consistently across the page.
9. **Styling uses Tailwind CSS** classes consistent with the project's existing page styles (e.g., card-based layout, table or list rendering).
10. **No external API calls or data-fetching logic** — all data is static/mock.

## Requirements

### Functional
| ID | Requirement | Notes |
|----|-------------|-------|
| REQ-1 | Render an "Orders" page with a title and a list/table of orders | Title: "Orders" |
| REQ-2 | Display mock order data with fields: ID, Date, Customer, Status, Total | Static array in component or utils |
| REQ-3 | Render status with a visual badge (e.g., color-coded) | Reuse or mirror `StatusBadge` from ReportsPage |
| REQ-4 | Page is accessible via navigation from the dashboard | Add nav link in `DashboardLayout` |
| REQ-5 | Page is protected by authentication | Wrap with `ProtectedRoute` |
| REQ-6 | No search, filter, sort, or pagination | Static list only |

### Non-Functional
| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-1 | TypeScript strict mode compliance | No `any` types |
| NFR-2 | Tailwind CSS styling | No inline styles or CSS modules |
| NFR-3 | Consistent with existing page patterns | Follow `ReportsPage.tsx` and `DashboardPage.tsx` conventions |
| NFR-4 | No new dependencies | Use only `lucide-react`, `react`, `react-router-dom`, `tailwindcss` |

## UI Notes

### Layout
- **Wrapper:** `DashboardLayout` (from `src/components/DashboardLayout.tsx`)
- **Header:** "Orders" page title
- **Content area:** A table or card-based list of orders

### Table / List Structure
| Column | Data Type | Example | Notes |
|--------|-----------|---------|-------|
| ID | string | `ORD-001` | Unique identifier |
| Date | string (formatted) | `2024-01-15` | ISO date or locale-formatted |
| Customer | string | `Jane Doe` | Customer name |
| Status | string + badge | `Shipped` | Color-coded badge |
| Total | string (currency) | `$125.00` | Formatted with currency symbol |

### Status Badge
- Mirror the pattern from `src/pages/ReportsPage.tsx` (`StatusBadge` component)
- Suggested statuses for mock data: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`
- Each status mapped to a Tailwind color class (e.g., green for Delivered, yellow for Pending)

### Icons
- Use `lucide-react` for any icons (e.g., `Package`, `List`, `ShoppingCart`)
- Consistent with `DashboardPage.tsx` and `ReportsPage.tsx` usage

## Implementation Notes

### File Locations
| File | Path | Purpose |
|------|------|---------|
| Page component | `src/pages/OrdersPage.tsx` | Main page component |
| Types | Inline or `src/types/orders.ts` | `Order` interface |
| Mock data | Inline or `src/utils/generateSampleOrders.ts` | Static order array |
| Nav link | `src/components/DashboardLayout.tsx` | Add to sidebar nav |

### TypeScript Interfaces
```typescript
interface Order {
  id: string;
  date: string;
  customer: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: string;
}
```

### Mock Data Sample
```typescript
const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', date: '2024-01-15', customer: 'Jane Doe', status: 'Delivered', total: '$125.00' },
  { id: 'ORD-002', date: '2024-01-16', customer: 'John Smith', status: 'Shipped', total: '$89.99' },
  { id: 'ORD-003', date: '2024-01-17', customer: 'Alice Johnson', status: 'Processing', total: '$210.50' },
  { id: 'ORD-004', date: '2024-01-18', customer: 'Bob Brown', status: 'Pending', total: '$45.00' },
  { id: 'ORD-005', date: '2024-01-19', customer: 'Carol White', status: 'Cancelled', total: '$175.25' },
];
```

### Component Structure
```tsx
// src/pages/OrdersPage.tsx
import { DashboardLayout } from '../components/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Order interface and mock data defined here or imported

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        {/* Table or card list of MOCK_ORDERS */}
      </div>
    </DashboardLayout>
  );
}
```

### Routing
- Add route in `src/App.tsx`:
  ```tsx
  <Route path="/orders" element={
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  } />
  ```

### Navigation
- Add "Orders" link to sidebar in `src/components/DashboardLayout.tsx`
- Use `lucide-react` icon (e.g., `Package` or `List`)
- Link to `/orders`

### Status Badge
- Create or reuse a `StatusBadge` component similar to `src/pages/ReportsPage.tsx`
- Map status strings to Tailwind classes:
  - `Pending`: `bg-yellow-100 text-yellow-800`
  - `Processing`: `bg-blue-100 text-blue-800`
  - `Shipped`: `bg-indigo-100 text-indigo-800`
  - `Delivered`: `bg-green-100 text-green-800`
  - `Cancelled`: `bg-red-100 text-red-800`

## Resolved Decisions
1. **Static mock list only** — no search, filtering, sorting, or pagination.
2. **Fields:** ID, Date, Customer, Status, Total — no additional fields.
3. **Status badge rendering** — consistent with existing `StatusBadge` pattern from `ReportsPage.tsx`.
4. **No new dependencies** — use only existing `lucide-react`, `react`, `react-router-dom`, `tailwindcss`.
5. **Page route:** `/orders`
6. **Protected route:** Yes — wrapped in `ProtectedRoute`
7. **Layout:** Wrapped in `DashboardLayout` for consistent navigation

## Open Questions
None — all decisions resolved.

## Assumptions
1. **Route registration:** The route `/orders` will be added to `src/App.tsx` alongside existing routes (`/`, `/login`, `/dashboard`, `/reports`, `/settings`).
2. **Navigation link:** The "Orders" link will be added to the sidebar in `DashboardLayout.tsx` in alphabetical or logical order with other pages.
3. **StatusBadge reuse:** The `StatusBadge` component from `ReportsPage.tsx` can be extracted to a shared component (e.g., `src/components/StatusBadge.tsx`) or replicated inline in `OrdersPage.tsx`. If extraction is preferred, it will be done as a separate task.
4. **Date format:** Dates will be rendered as ISO strings (`YYYY-MM-DD`) unless Tailwind/UI conventions suggest otherwise.
5. **Currency format:** Totals will be rendered as string values with a `$` prefix and two decimal places.
6. **Mock data count:** At least 5 orders will be included in the static array to demonstrate the list rendering.
7. **No API integration:** The page will not include any loading states, error handling for API calls, or optimistic updates since data is static.
8. **Responsive design:** The table/list will use Tailwind responsive classes to ensure readability on smaller screens (e.g., horizontal scroll or card layout on mobile).
9. **i18n:** Not required — all text in English.
10. **Testing:** Unit tests are out of scope for this spec; E2E or integration tests may be added by a later stage.

## References
- `src/pages/ReportsPage.tsx` — StatusBadge pattern and page structure
- `src/pages/DashboardPage.tsx` — StatCard and layout conventions
- `src/components/DashboardLayout.tsx` — Navigation and layout wrapper
- `src/components/ProtectedRoute.tsx` — Auth guard pattern
- `src/App.tsx` — Route registration
- `src/utils/generateSampleReport.ts` — Mock data pattern
