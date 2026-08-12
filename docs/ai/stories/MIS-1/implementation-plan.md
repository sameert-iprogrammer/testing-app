# MIS-1 Implementation Plan: Users Listing

## Resolved Decisions
- **Data Fields**: Name, Email, Address.
- **Routing Path**: `/users`.
- **Data Source**: Local mock array (`mockUsers`).
- **Layout Wrapper**: `DashboardLayout`.
- **Styling**: Tailwind CSS, matching existing dark theme palette (`slate-*`).

## Implementation Steps

### Step 1: Create Users Page and Mock Data
- **File**: `src/pages/UsersPage.tsx` (Create)
- **Details**:
  - Define the `User` interface: `{ name: string; email: string; address: string; }`.
  - Define `mockUsers` array with 5-6 entries (following the exact structural pattern of `mockReports` in `ReportsPage.tsx`).
  - Create the `UsersPage` functional component.
  - Wrap the component's content in `<DashboardLayout>`.
  - Render a main heading (e.g., "Users Listing").
  - Render a responsive `<table>` with columns `Name | Email | Address`.
  - Apply Tailwind classes for the table and cells matching `DashboardPage.tsx` conventions:
    - Table wrapper: `bg-slate-900/40 border border-slate-800 rounded-2xl p-6`
    - Header: `text-white font-semibold`
    - Rows: `border-b border-slate-800`
    - Text: `text-slate-400` (secondary), `text-white` (primary)

### Step 2: Add Route to Application
- **File**: `src/App.tsx` (Modify)
- **Details**:
  - Import `UsersPage` from `./pages/UsersPage`.
  - Locate the existing `<Routes>` component (or equivalent `react-router-dom` v7 setup).
  - Insert a new route: `<Route path="/users" element={<UsersPage />} />` in alphabetical or logical order with existing routes.

### Step 3: Optional Navigation Update
- **File**: `src/components/DashboardLayout.tsx` (Optional Modify)
- **Details**:
  - If `DashboardLayout` contains a sidebar or top navigation menu, add a link to `/users`. Otherwise, skip. This is out of strict scope per the story specification.

## Files to Touch
- `src/pages/UsersPage.tsx` (Create)
- `src/App.tsx` (Modify)
- `src/components/DashboardLayout.tsx` (Optional)

## Context Budget
- Read `src/App.tsx` to identify the exact insertion point and import structure for the new route.
- Read `src/pages/ReportsPage.tsx` (lines 10-18) to copy the exact mock data formatting pattern.
- Read `src/pages/DashboardPage.tsx` (lines 1-60) to extract exact Tailwind utility classes for container spacing and dark theme colors.
- Read `src/components/DashboardLayout.tsx` only if adding a navigation link in Step 3.
- Do not read full repo or external dependencies; rely on provided snippets and standard `react-router-dom` v7 patterns.

{"clarification":{"needed":false,"questions":[],"assumptions":[{"statement":"src/App.tsx already contains a <Routes> component wrapping page components, and the implementer will add the /users route inside it.","risk":"low"},{"statement":"DashboardLayout does not require navigation updates for this story; wrapping the UsersPage component satisfies the integration requirement.","risk":"low"},{"statement":"The user table will use the existing dark theme color palette (slate-900/40 backgrounds, slate-800 borders, white/slate-400 text) consistent with DashboardPage.tsx.","risk":"low"}]}}
