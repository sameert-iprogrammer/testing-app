# MIS-1: Users listing with mock data

## Story
- **JIRA Key**: MIS-1
- **Title**: Users listing
- **Description**: Add users listing with mock data
- **Resolved Decisions**:
  - Data fields displayed per user: `Name`, `Email`, `Address`

## Acceptance Criteria
1. A new route/page exists for the users listing (e.g., `/users`).
2. The page renders a table (or structured list) of users populated entirely from mock data.
3. Each row/column displays the user's `Name`, `Email`, and `Address`.
4. The mock data interface and data array follow the same TypeScript and structural conventions as existing mock datasets in the project (e.g., `mockReports` in `ReportsPage.tsx`, `mockProfile` in `useProfileForm.ts`).
5. The page integrates with the existing `DashboardLayout` so that navigation and header remain consistent with other dashboard pages.
6. The UI uses Tailwind CSS classes for styling, consistent with the existing codebase.
7. The component is written in TypeScript with proper interfaces for the user entity.

## Requirements
### Functional
- Render a user listing view.
- Display exactly three fields per record: `name`, `email`, `address`.
- Data source: local mock array, no external API calls.
- No pagination, sorting, or filtering required in this story unless explicitly added later.

### Non-Functional
- Must adhere to existing TypeScript strictness (`tsconfig.app.json` conventions).
- Must use the same component structure pattern as existing pages (`LoginPage.tsx`, `ReportsPage.tsx`, `SettingsPage.tsx`).
- Must support the existing dark/light or theme system if present (follow current `index.css` / Tailwind config).

## UI Notes
- **Layout**: Within `DashboardLayout`, using the same container and spacing conventions as `DashboardPage.tsx` and `SettingsPage.tsx`.
- **Data Presentation**: A responsive table or card-based list. Given three fields, a clean table with columns `Name | Email | Address` is appropriate.
- **Styling**: Tailwind utility classes. Use consistent padding/margins aligned with existing dashboard sections.
- **Icons**: Optional header icon from `lucide-react` (e.g., `Users` or `List`) if it aligns with the dashboard header pattern.

## Implementation Notes
### New/Modified Files
- `src/pages/UsersPage.tsx` (new)
- `src/App.tsx` (update routes)
- `vite.config.ts` (no change expected, unless file-based routing is used — project currently uses `App.tsx` for routing)
- Potentially `src/components/DashboardLayout.tsx` (no change expected, as it wraps children)

### TypeScript Interface
```typescript
interface User {
  name: string;
  email: string;
  address: string;
}
```

### Mock Data Pattern
Align with existing `mockReports` and `mockProfile` patterns:
```typescript
const mockUsers: User[] = [
  { name: 'Alice Johnson', email: 'alice@example.com', address: '123 Main St, Springfield' },
  { name: 'Bob Smith', email: 'bob@example.com', address: '456 Oak Ave, Shelbyville' },
  { name: 'Charlie Brown', email: 'charlie@example.com', address: '789 Pine Rd, Capital City' },
  // Add enough entries to demonstrate scrolling/responsiveness if needed
];
```

### Routing
- Add a new route in `src/App.tsx` (or existing router setup) pointing to the new `UsersPage` component.
- Ensure navigation link is added to the dashboard navigation/menu if applicable (outside strict scope but noted for completeness).

### Component Structure
- Export default functional component.
- Use React state/hooks only if needed (likely none for static mock rendering).
- Keep styling inline via Tailwind classes.

## Assumptions
1. The project uses a client-side router (react-router-dom v7 per `package.json`), so a new route will be added in `src/App.tsx`.
2. No backend integration is required; mock data is purely local.
3. The `DashboardLayout` is the intended wrapper for all dashboard-facing pages, including this one.
4. Accessibility requirements follow standard HTML table/list semantics; no additional ARIA patterns are mandated by the story.
5. The existing Tailwind configuration supports standard color palettes and spacing; no custom theme extensions are assumed.

## References
- Existing mock data pattern: `src/pages/ReportsPage.tsx` (`mockReports`)
- Existing form/profile mock: `src/hooks/useProfileForm.ts` (`mockProfile`)
- Routing convention: `src/App.tsx`
- Layout wrapper: `src/components/DashboardLayout.tsx`
- Tech stack: React 19, TypeScript, Vite, Tailwind CSS, react-router-dom 7, lucide-react
