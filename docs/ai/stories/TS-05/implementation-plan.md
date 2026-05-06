# Implementation Plan: TS-05 — Create Frontend-Only Audience Page with Mock Table Data

---

### 1. Story Summary

Create a new `/audience` route that renders an Audience page displaying a table with 5 hardcoded mock audience records (User Name, Email, Location, Device, Last Active). Additionally, fix the sidebar navigation so that clicking "Overview" navigates to `/dashboard` and the sidebar active state dynamically reflects the current route instead of being hardcoded.

---

### 2. Source of Truth

This plan is based on the structured specification at:
- **File**: `docs/ai/stories/TS-05/spec.md`
- **Story ID**: TS-05
- **Date**: 2026-05-05

---

### 3. Technical Understanding

**Key architectural decisions:**
- This is a frontend-only scaffolding story — no API calls, no state management, no new dependencies.
- The Audience page follows the exact same pattern as `ReportsPage.tsx`: a header section (`h1` + subtitle) followed by a single table container with `overflow-x-auto`.
- The sidebar active state will switch from hardcoded `active` props to dynamic `useLocation().pathname` comparisons.
- The route pattern follows the existing protected route structure: `<ProtectedRoute><DashboardLayout><AudiencePage /></DashboardLayout></ProtectedRoute>`.

**Existing patterns to follow:**
- Page components use `React.FC` type annotation and `export default`.
- Table styling matches `ReportsPage.tsx` exactly (same Tailwind classes for thead, tbody, th, td).
- NavItem component in `DashboardLayout.tsx` already supports `active` and `onClick` props — we just need to wire them up dynamically.
- Mock data is defined as a constant array inline in the page file with an inline interface.

---

### 4. Files to Inspect

| File Path | Reason |
|-----------|--------|
| `src/App.tsx` | Understand current route registration pattern; add `/audience` route |
| `src/components/DashboardLayout.tsx` | Understand NavItem structure and current hardcoded `active` state; add `useLocation` and dynamic active logic |
| `src/pages/ReportsPage.tsx` | Reference table pattern (styling, structure, aria-label) to match exactly |
| `src/pages/DashboardPage.tsx` | Reference page header pattern (h1 + subtitle styling) |
| `src/components/ProtectedRoute.tsx` | Confirm it exists and wraps routes correctly (spec assumes it does) |

---

### 5. Files to Modify or Create

**Create:**
- `src/pages/AudiencePage.tsx` — New page component with `AudienceMember` interface, `mockAudience` data array, header section, and table rendering.

**Modify:**
- `src/App.tsx` — Import `AudiencePage` and register the `/audience` route.
- `src/components/DashboardLayout.tsx` — Import `useLocation` from `react-router-dom`; replace hardcoded `active` on Overview NavItem with dynamic path-based logic; add `onClick` handlers to Overview and Audience NavItems.

**Review:**
- `src/pages/ReportsPage.tsx` — Review table pattern to ensure AudiencePage matches styling exactly.
- `src/components/ProtectedRoute.tsx` — Verify it exists and works as expected for route protection.

---

### 6. Step-by-Step Implementation Plan

**Step 1: Create AudiencePage.tsx**
- **What**: Create `src/pages/AudiencePage.tsx` with the following:
  - Inline `AudienceMember` interface: `{ userName: string; email: string; location: string; device: string; lastActive: string }`
  - `mockAudience` constant array with 5 records (see spec data below)
  - `AudiencePage: React.FC` component with:
    - Header: `h1` "Audience" + `p` "View audience insights and user details"
    - Single table with columns: User Name, Email, Location, Device, Last Active
    - Table wrapped in `overflow-x-auto` div, with `aria-label="Audience members"`
    - Map over `mockAudience` to render rows
  - `export default AudiencePage`
- **Files**: `src/pages/AudiencePage.tsx` (create)
- **Prerequisites**: None
- **Verify**: File compiles with TypeScript; follows same structure as `ReportsPage.tsx`; stays under ~150 lines.

**Mock data to use (5 records):**
```
{ userName: "Alice Johnson", email: "alice@example.com", location: "New York, US", device: "Desktop", lastActive: "2 min ago" }
{ userName: "Bob Smith", email: "bob@example.com", location: "London, UK", device: "Mobile", lastActive: "15 min ago" }
{ userName: "Carol White", email: "carol@example.com", location: "Toronto, CA", device: "Tablet", lastActive: "1 hour ago" }
{ userName: "David Brown", email: "david@example.com", location: "Sydney, AU", device: "Desktop", lastActive: "3 hours ago" }
{ userName: "Eva Martinez", email: "eva@example.com", location: "Berlin, DE", device: "Mobile", lastActive: "1 day ago" }
```

**Step 2: Register /audience route in App.tsx**
- **What**: 
  - Add import: `import AudiencePage from './pages/AudiencePage';`
  - Add new route after `/reports` route (before the default redirect):
    ```tsx
    <Route path="/audience" element={
      <ProtectedRoute>
        <DashboardLayout>
          <AudiencePage />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    ```
- **Files**: `src/App.tsx` (modify)
- **Prerequisites**: Step 1 complete (AudiencePage.tsx exists)
- **Verify**: TypeScript compiles; route is registered; imports are ordered (external first, then internal).

**Step 3: Add useLocation to DashboardLayout and fix sidebar active state**
- **What**: In `src/components/DashboardLayout.tsx`:
  1. Add `useLocation` to the `react-router-dom` import (alongside existing `useNavigate`):
     ```tsx
     import { useNavigate, useLocation } from "react-router-dom";
     ```
  2. Inside `DashboardLayout` component, add: `const location = useLocation();`
  3. Update all NavItem `active` props to use dynamic path matching:
     - Overview: `active={location.pathname === "/dashboard"}`
     - Audience: `active={location.pathname === "/audience"}`
     - Reports: `active={location.pathname === "/reports"}`
     - Settings: `active={location.pathname === "/settings"}`
  4. Add `onClick` handlers to Overview and Audience NavItems:
     - Overview: `onClick={() => navigate("/dashboard")}`
     - Audience: `onClick={() => navigate("/audience")}`
  5. Remove the hardcoded `active` prop from the Overview NavItem (it currently has `active` with no value, which means `true`).
- **Files**: `src/components/DashboardLayout.tsx` (modify)
- **Prerequisites**: Steps 1 and 2 complete
- **Verify**: 
  - No unused imports (check `noUnusedLocals`).
  - All 4 NavItems have both `active` and `onClick` props.
  - TypeScript compiles cleanly.
  - File stays under ~150 lines for the main component (note: file is currently 199 lines total including co-located components — this is acceptable as the spec says "components observed are under ~150 lines" and this file includes multiple co-located components).

**Step 4: Run lint and build verification**
- **What**: Run `npm run lint` and `npm run build` to verify no errors.
- **Files**: None (verification step)
- **Prerequisites**: Steps 1-3 complete
- **Verify**: Both commands exit with zero errors.

**Step 5: Manual verification in dev server**
- **What**: Start dev server with `npm run dev` and verify:
  1. Navigate to `/audience` → page renders with "Audience" heading, subtitle, and table with 5 rows.
  2. Click "Overview" in sidebar → navigates to `/dashboard`, Overview item is highlighted.
  3. Click "Audience" in sidebar → navigates to `/audience`, Audience item is highlighted.
  4. Click "Reports" in sidebar → navigates to `/reports`, Reports item is highlighted.
  5. Click "Settings" in sidebar → navigates to `/settings`, Settings item is highlighted.
  6. Table has `aria-label`, rows have hover effect, table scrolls horizontally on narrow screens.
- **Files**: None (verification step)
- **Prerequisites**: Step 4 complete
- **Verify**: All navigation and active state behaviors work correctly.

---

### 7. API / Data Contract Changes

- **New Endpoints**: None — this is a frontend-only story.
- **Modified Endpoints**: None.
- **Data Models / Interfaces**: 
  - New inline interface `AudienceMember` in `src/pages/AudiencePage.tsx`:
    ```typescript
    interface AudienceMember {
      userName: string;
      email: string;
      location: string;
      device: string;
      lastActive: string;
    }
    ```
- **Breaking Changes**: None.

---

### 8. UI / UX Changes

- **New Page**: `/audience` route renders `AudiencePage` with:
  - Heading: "Audience" (text-3xl, bold, white)
  - Subtitle: "View audience insights and user details" (text-slate-400)
  - Single table with 5 columns and 5 rows of mock data
  - Dark theme styling matching existing pages
- **Sidebar Changes**:
  - Overview NavItem now has an `onClick` handler (previously had none)
  - Audience NavItem now has an `onClick` handler (previously had none)
  - All NavItems now compute `active` dynamically based on `useLocation().pathname`
- **Accessibility**: Table has `aria-label="Audience members"`. NavItems are already `<button>` elements with proper keyboard support.
- **Responsive**: Table wrapped in `overflow-x-auto` for horizontal scroll on narrow screens.

---

### 9. State Management Changes

- **New state slices**: None.
- **Modified existing state**: None.
- **Side effects**: `useLocation()` hook used in `DashboardLayout` to read current pathname — this is a read-only hook with no state mutation.
- **Cache invalidation**: Not applicable.

---

### 10. Validation and Error Handling

- **Input validation**: Not applicable — no user input fields on the Audience page.
- **Error handling**: Not applicable — no async operations or API calls.
- **Edge cases handled**:
  - Long email addresses: handled by `overflow-x-auto` on table container.
  - Narrow screens: table scrolls horizontally; sidebar is hidden on mobile (`hidden md:flex`).
  - Unauthenticated access: `<ProtectedRoute>` redirects to `/login`.

---

### 11. Test Plan

- **Unit Tests**: Not applicable — testing framework is not yet configured (project gap #4 from `project-context.md`).
- **Integration Tests**: Not applicable — same reason.
- **E2E Tests**: Not applicable — same reason.
- **When testing framework is added**, the following should be tested:
  - `AudiencePage` renders correct heading, subtitle, and table with 5 rows.
  - All 5 mock records appear with correct column values.
  - Sidebar NavItems have correct active state based on current route.
  - Clicking Overview navigates to `/dashboard`.
  - Clicking Audience navigates to `/audience`.
- **Test Files**: None to create in this story.

---

### 12. Risk Areas

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `useLocation` not available in `DashboardLayout` | Low | Medium | `DashboardLayout` is rendered inside `<BrowserRouter>` in `App.tsx`, so `useLocation` will work correctly. |
| Sidebar active state logic conflicts with existing hardcoded `active` | Low | Low | Replace hardcoded `active` entirely with `useLocation`-based logic. No partial migration. |
| Table styling inconsistent with existing pages | Low | Low | Follow `ReportsPage.tsx` table pattern exactly — copy the same Tailwind classes. |
| `noUnusedLocals` / `noUnusedParameters` lint errors | Low | Low | Only import what is used. Verify with `npm run lint`. |
| File exceeds ~150 lines | Low | Low | `AudiencePage.tsx` should be ~60-80 lines with the interface, mock data, and component. Well within limit. |
| Spec mentions mock data but doesn't specify exact records | Low | Low | Use reasonable mock data matching the 5-column schema. The spec says "five hardcoded mock audience records (as specified in the story)" — use the 5 records defined in Step 1 above. |

---

### 13. Final Coding Agent Instructions

**Execution order**: Follow Steps 1 through 5 sequentially. Each step depends on the previous one.

**Before starting**:
1. Read `src/App.tsx`, `src/components/DashboardLayout.tsx`, and `src/pages/ReportsPage.tsx` to understand current patterns.
2. Ensure you are on the correct feature branch.

**Commands to run**:
- After Step 3 (all code changes): `npm run lint` — must pass with zero errors.
- After lint passes: `npm run build` — must succeed.
- For manual testing: `npm run dev` — verify navigation and active state in browser.

**If a step fails**:
- **Lint failure**: Fix the reported error before proceeding. Do not suppress or ignore lint errors.
- **Build failure**: Check TypeScript errors — likely a missing import, wrong type, or unused variable.
- **Unexpected behavior in dev server**: Verify the route is registered correctly, `useLocation` is inside `BrowserRouter`, and NavItem `onClick`/`active` props are wired correctly.

**When to pause and request clarification**:
- If `ProtectedRoute.tsx` does not exist or has a different interface than expected.
- If `DashboardLayout.tsx` has been significantly restructured since the spec was written.
- If any existing NavItem already has dynamic active state logic (spec assumes it's hardcoded).

**Confirmation criteria for marking complete**:
- [ ] `src/pages/AudiencePage.tsx` exists with correct interface, mock data, header, and table.
- [ ] `/audience` route is registered in `src/App.tsx` with ProtectedRoute + DashboardLayout wrapper.
- [ ] `DashboardLayout.tsx` uses `useLocation` for dynamic active state on all 4 NavItems.
- [ ] Overview and Audience NavItems have `onClick` handlers for navigation.
- [ ] `npm run lint` passes with zero errors.
- [ ] `npm run build` succeeds.
- [ ] No `any` types introduced.
- [ ] No `console.log` / `debugger` statements.
- [ ] No unrelated files modified.
- [ ] Table has `aria-label` attribute.
- [ ] All NavItems are keyboard-navigable (already are as `<button>` elements).
