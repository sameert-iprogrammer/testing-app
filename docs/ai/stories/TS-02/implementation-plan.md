# TS-02: Implementation Plan — Download Sample Excel Report from Dashboard

## Overview

Implement frontend-only Excel file download triggered by the "Download Report" button in `DashboardLayout.tsx`. Includes dynamic Excel generation via `xlsx` (SheetJS), a co-located toast notification system, and integration into the existing dashboard layout.

---

## Step 1: Install `xlsx` dependency

**Command:** `npm install xlsx@^0.18.5`

**File modified:** `package.json`, `package-lock.json`

**Verification:** Confirm `xlsx` appears in `dependencies` in `package.json`.

---

## Step 2: Create `src/utils/generateSampleReport.ts`

**Purpose:** Utility function that generates a sample Excel file and triggers browser download.

**Implementation details:**
- Export a single async function: `generateSampleReport(): Promise<void>`
- Use dynamic import: `const XLSX = await import('xlsx')`
- Create workbook with one sheet named `"Analytics Report"`
- Populate with data rows:
  - Header: `["Metric", "Value", "Change"]`
  - Row 1: `["Total Revenue", 45231.89, "+20.1%"]`
  - Row 2: `["Active Users", 2350, "+180.1%"]`
  - Row 3: `["Page Views", 12234, "-4.5%"]`
  - Row 4: `["Active Sessions", 573, "+12.5%"]`
- Generate Blob with MIME type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Create temp `<a>` element, set `href` via `URL.createObjectURL(blob)`, set `download="nexus-analytics-sample-report.xlsx"`, click, then `URL.revokeObjectURL`
- Throw on any failure (caller handles error)
- No `any` types; use explicit types for workbook, sheet, and data structures
- No `console.log`

**Type considerations:**
- Import types from `xlsx`: `WorkBook`, `WorkSheet`
- Data array typed as `(string | number)[][]`

---

## Step 3: Create `src/components/Toast.tsx`

**Purpose:** Reusable toast notification component with success/error variants.

**Exports:**
1. `ToastProvider: React.FC<{ children: React.ReactNode }>` — wraps children, manages toast state
2. `useToast()` hook — returns `{ showToast: (message: string, type: 'success' | 'error') => void }`

**Implementation details:**
- Use `React.createContext` for toast context
- `ToastProvider` manages state: `toast: { message: string; type: 'success' | 'error' } | null`
- `showToast` sets state, starts 3-second `setTimeout` to clear
- `useEffect` cleanup: clear timeout on unmount or new toast
- Toast UI: fixed position top-right, `role="alert"`, `aria-live="assertive"`
- Success styling: green/emerald background, check icon from `lucide-react`
- Error styling: red/rose background, alert icon from `lucide-react`
- Animations: Tailwind `animate-in fade-in` on mount, fade-out on dismiss (use CSS transition or Tailwind animation classes)
- Only one toast at a time (new replaces old)
- Keep under 150 lines

**Props interfaces:**
- `interface ToastProviderProps { children: React.ReactNode }`
- `interface ToastContextType { showToast: (message: string, type: 'success' | 'error') => void }`
- `interface ToastDisplayProps { message: string; type: 'success' | 'error'; onDismiss: () => void }`

---

## Step 4: Modify `src/components/DashboardLayout.tsx`

**Changes:**
1. Import `generateSampleReport` from `../utils/generateSampleReport`
2. Import `ToastProvider`, `useToast` from `./Toast`
3. Import `Loader2` from `lucide-react` (spinner for loading state)
4. Wrap `children` with `<ToastProvider>` in the return JSX
5. Add `const [isDownloading, setIsDownloading] = useState(false)` inside `DashboardLayout`
6. Call `useToast()` to get `showToast`
7. Create `handleDownload` async function:
   ```
   const handleDownload = async () => {
     setIsDownloading(true);
     try {
       await generateSampleReport();
       showToast('Report downloaded successfully.', 'success');
     } catch {
       showToast('Failed to download report. Please try again.', 'error');
     } finally {
       setIsDownloading(false);
     }
   };
   ```
8. Attach `onClick={handleDownload}` to the Download Report button
9. Add `disabled={isDownloading}` to the button
10. Add `aria-label="Download sample analytics report"` to the button
11. Add `aria-busy={isDownloading}` to the button
12. When `isDownloading` is true, show `Loader2` spinner icon (with `animate-spin`) alongside or replacing button text

**Important:** The `ToastProvider` must wrap the content that calls `useToast`. Since `useToast` must be called inside a component that is a descendant of `ToastProvider`, either:
- Option A: Wrap children with `ToastProvider` and create a separate inner component that calls `useToast` and renders the button
- Option B: Make `DashboardLayout` itself render a `ToastProvider` at the top level of its JSX, and extract the header content (including the button) into a sub-component that calls `useToast`

**Recommended approach (Option B):**
- Extract the header section into a `DashboardHeader` component inside the same file
- `DashboardHeader` calls `useToast()` and manages `isDownloading` state
- `DashboardLayout` wraps everything in `ToastProvider`
- This keeps `DashboardLayout` under 150 lines

---

## Step 5: Verify and test

**Commands to run:**
1. `npm run lint` — must pass with zero errors
2. `npm run build` — must succeed (`tsc -b && vite build`)

**Manual verification checklist:**
- Click "Download Report" → file `nexus-analytics-sample-report.xlsx` downloads
- Open downloaded file → contains correct sheet name and data
- Success toast appears with correct message and styling
- Simulate error (e.g., temporarily throw in `generateSampleReport`) → error toast appears
- Button shows spinner and is disabled during download
- Toast auto-dismisses after 3 seconds
- Button is keyboard accessible (Enter/Space triggers download)
- Screen reader announces toast (`role="alert"`, `aria-live="assertive"`)
- Page refresh does not break functionality

---

## Files Summary

| Action | File | Description |
|---|---|---|
| Create | `src/utils/generateSampleReport.ts` | Excel generation utility |
| Create | `src/components/Toast.tsx` | Toast notification system |
| Modify | `src/components/DashboardLayout.tsx` | Add download handler, toast integration, loading state |
| Modify | `package.json` | Add `xlsx` dependency |

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| `xlsx` dynamic import may fail in some Vite configurations | Use standard `await import('xlsx')`; Vite handles dynamic imports of npm packages out of the box |
| Toast context not accessible from button handler | Extract header into sub-component inside `ToastProvider` boundary |
| TypeScript strictness flags reject `xlsx` types | `xlsx` ships with its own type definitions; import `WorkBook`, `WorkSheet` explicitly |
| Component file exceeds 150 lines | Extract `DashboardHeader` and `NavItem` stays co-located; `Toast.tsx` split into small sub-components if needed |
| Tailwind v4 animation classes differ from v3 | Use standard Tailwind v4 classes: `transition-opacity`, `duration-300`, `opacity-0`/`opacity-100` for fade; avoid `animate-in` if not available in v4 |

---

## Out of Scope (do NOT implement)

- Backend API integration
- Authentication checks
- Real analytics data
- Dynamic filters or date ranges
- Download progress tracking
- Report history
- Modifications to `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js`
