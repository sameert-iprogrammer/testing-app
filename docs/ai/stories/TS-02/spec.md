# TS-02: Download Sample Excel Report from Dashboard

## Story Metadata

| Field | Value |
|---|---|
| **JIRA Key** | TS-02 |
| **Title** | Download Sample Excel Report from Dashboard |
| **Type** | Feature |
| **Priority** | Medium |
| **Status** | Draft |

## User Story

**As a** dashboard user,
**I want to** download a sample Excel report from the Download Report button,
**so that** I can verify the report download experience without requiring backend integration.

## Context

The dashboard currently has a "Download Report" button in the top-right header section (`DashboardLayout.tsx`). The button is purely presentational and performs no action. This story implements frontend-only download functionality with toast feedback.

## Acceptance Criteria

### AC-1: Download sample report successfully

**Given** the user is on the dashboard page
**And** the Download Report button is visible
**When** the user clicks the Download Report button
**Then** a sample Excel report should be downloaded
**And** the downloaded file name should be `nexus-analytics-sample-report.xlsx`
**And** a success toast should be displayed with the message: "Report downloaded successfully."

### AC-2: Report should be Excel format

**Given** the user downloads the sample report
**When** the file is saved on the system
**Then** the file should have `.xlsx` extension
**And** the file should contain sample analytics data with the following structure:

| Metric | Value | Change |
|---|---|---|
| Total Revenue | 45231.89 | +20.1% |
| Active Users | 2350 | +180.1% |
| Page Views | 12234 | -4.5% |
| Active Sessions | 573 | +12.5% |

### AC-3: Error toast on download failure

**Given** the user clicks Download Report
**When** the download process fails due to any frontend error
**Then** an error toast should be displayed with the message: "Failed to download report. Please try again."

## Technical Specification

### Architecture Decision

**Approach**: Generate Excel file dynamically using the `xlsx` (SheetJS) library.

**Rationale**:
- No need to maintain a static file in `public/` that could be accidentally modified or deleted
- Dynamic generation ensures the file is always in sync with the intended sample data
- `xlsx` is the most widely used and well-maintained library for client-side Excel generation
- Keeps the bundle impact minimal (only the core `xlsx` module is needed)

### Files to Create

| File | Purpose |
|---|---|
| `src/utils/generateSampleReport.ts` | Utility function that generates the sample Excel file as a Blob and triggers download |
| `src/components/Toast.tsx` | Reusable toast notification component with success and error variants |

### Files to Modify

| File | Change |
|---|---|
| `src/components/DashboardLayout.tsx` | Add `onClick` handler to Download Report button, integrate toast state management |
| `package.json` | Add `xlsx` dependency |

### Implementation Details

#### 1. Excel Generation Utility (`src/utils/generateSampleReport.ts`)

- Export a function `generateSampleReport(): void`
- Uses `xlsx` library to create a workbook with one sheet named "Analytics Report"
- Populates the sheet with the sample data (headers: Metric, Value, Change)
- Generates a Blob with MIME type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Creates a temporary `<a>` element, sets `href` to `URL.createObjectURL(blob)`, sets `download` attribute to `nexus-analytics-sample-report.xlsx`, programmatically clicks it, then revokes the object URL
- Returns `true` on success, throws on failure
- No `any` types; all types must be explicit

#### 2. Toast Component (`src/components/Toast.tsx`)

- Co-located toast system using React state (no external toast library)
- Export a `ToastProvider` component that wraps the app or layout
- Export a `useToast` hook that exposes `showToast(message: string, type: 'success' | 'error'): void`
- Toast displays for 3 seconds then auto-dismisses
- Success toast: green/emerald styling with check icon
- Error toast: red/rose styling with alert icon
- Position: top-right of viewport, fixed positioning
- Supports one toast at a time (new toast replaces existing)
- Uses Tailwind CSS exclusively for styling
- Animations: fade-in on appear, fade-out on dismiss

#### 3. DashboardLayout Integration

- Wrap `DashboardLayout` children with `ToastProvider`
- Add `useState` for loading state on the Download Report button
- On click:
  1. Set loading state to `true`
  2. Call `generateSampleReport()` inside a try/catch
  3. On success: show success toast via `useToast`
  4. On error: show error toast via `useToast`
  5. Set loading state to `false`
- Button shows a loading indicator (spinner icon from `lucide-react`) while download is in progress
- Button is disabled during loading state

### Toast Message Text

| Scenario | Type | Message |
|---|---|---|
| Success | success | Report downloaded successfully. |
| Error | error | Failed to download report. Please try again. |

### Dependencies

| Package | Version | Type | Justification |
|---|---|---|---|
| `xlsx` | `^0.18.5` | production | Client-side Excel file generation |

### State Management

- Local component state only (no global state library)
- `DashboardLayout` manages: `isDownloading` (boolean)
- `ToastProvider` manages: `toast` object `{ message: string; type: 'success' \| 'error' } \| null`

### Error Handling

- Wrap Excel generation in try/catch
- Catch any exception from Blob creation, URL generation, or xlsx library
- Display error toast on any caught exception
- No `console.log` in production code

### Accessibility

- Download Report button must have `aria-label="Download sample analytics report"`
- Toast must have `role="alert"` and `aria-live="assertive"` for screen readers
- Button must be keyboard accessible (Enter/Space triggers download)
- Loading state must update `aria-busy` attribute on button

### Performance

- `xlsx` library should be dynamically imported to avoid blocking initial page load: `const XLSX = await import('xlsx')`
- Toast auto-dismiss after 3 seconds via `setTimeout` with proper cleanup in `useEffect`

## Out of Scope

- Backend API integration
- Authentication check for report download
- Real analytics data
- Dynamic filters
- Date range-based report generation
- Server-side file creation
- Report history
- Download progress tracking

## Definition of Done

- [ ] Download Report button triggers Excel download
- [ ] Downloaded file has correct name: `nexus-analytics-sample-report.xlsx`
- [ ] Downloaded file has `.xlsx` extension and opens in Excel/Google Sheets
- [ ] File contains the specified sample analytics data
- [ ] Success toast appears after successful download trigger
- [ ] Error toast appears if download trigger fails
- [ ] No backend dependency exists
- [ ] No existing dashboard UI is broken
- [ ] Functionality works after page refresh
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] No `any` types introduced
- [ ] No `console.log` / `debugger` statements
- [ ] All new components typed with props interfaces
- [ ] Tailwind classes used (no custom CSS or inline styles)
- [ ] File naming follows PascalCase for components, camelCase for utilities
- [ ] Imports are ordered and clean (external first, then internal)
- [ ] Component files under ~150 lines
- [ ] Accessibility basics covered (aria-labels, role="alert", keyboard support)
- [ ] No unrelated files modified
- [ ] `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, and `tailwind.config.js` are NOT modified
