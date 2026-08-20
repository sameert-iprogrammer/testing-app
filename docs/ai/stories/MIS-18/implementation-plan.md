# Implementation Plan: MIS-18 - Requests Page

### Overview
Add a `RequestsPage` that displays a list of requests with mock data, a download button with loading state, toast notifications on success/failure, and routing behind `ProtectedRoute`. The page follows existing React/React-Router patterns used by `DashboardPage`, `ReportsPage`, and `SettingsPage`.

### Files to Touch
- **Create**: `src/pages/RequestsPage.tsx`
- **Modify**: `src/App.tsx` — add `<Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />` and ensure `ProtectedRoute` and `RequestsPage` imports are present

### Context Budget
- Scope implementation to `src/pages/RequestsPage.tsx` (new file) and `src/App.tsx` (route registration)
- Re-use observed patterns: mock data structure from `ReportsPage.tsx` table layout, Tailwind utility classes from `DashboardLayout.tsx` and `ReportsPage` (e.g., `text-slate-400`, `bg-slate-900/40`, `border border-slate-800`, `rounded-2xl`, `flex items-center gap-4`), `useToast` hook from `src/components/Toast.tsx`/`~/components/ui/use-toast`, and `ProtectedRoute` from `src/components/ProtectedRoute.tsx`
- Avoid full-file reads; rely on module signatures and code snippets already provided

### Implementation Steps

1. **Create `src/pages/RequestsPage.tsx`**
   - Functional component `RequestsPage` with no props beyond routing context
   - Import `useState`, `useToast` from ` "@/components/ui/use-toast"` (per spec), `Loader2` and `Download` from `lucide-react`
   - Define `mockRequests` export matching spec structure: `{ id: string, title: string, status: string, createdAt: string }`
   - State `isDownloading` (`useState(false)`) and `showToast` from `useToast`
   - `handleDownload` async function: set `isDownloading(true)`, attempt report generation (placeholder with TODO), `showToast` on success/failure, finally set `isDownloading(false)`
   - Render structure:
     - Section with `p-6` padding, `h1` heading (`text-2xl font-bold mb-4`)
     - Download button group: disabled when `isDownloading`, `aria-busy`, spinner/Download icon toggle, indigo background with proper hover/pressed states
     - Table: `w-full border border-slate-800 rounded-lg overflow-hidden`, thead with `border-b border-slate-700`, `th` columns for ID, Title, Status, Created At; tbody maps `mockRequests` to `tr` with `border-b border-slate-700 hover:bg-slate-900`, `td` cells with `p-3` padding
   - Follow Tailwind conventions visible in `ReportsPage` and `DashboardLayout` (colors, spacing, rounding, flex patterns)

2. **Modify `src/App.tsx`**
   - Add `import { ProtectedRoute } from '@/components/ProtectedRoute'` (or project routing utilities) if not already present
   - Add `import { RequestsPage } from './pages/RequestsPage'` 
   - Register the route: `<Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />` within the same router configuration used by `DashboardPage`
   - Verify `ProtectedRoute` is imported from the project's routing utilities as specified

### Assumptions
- The main router configuration resides in `src/App.tsx` (the file where `DashboardPage` is registered); if located elsewhere, the implementer should reposition the route registration accordingly
- `ProtectedRoute` can be imported from `src/components/ProtectedRoute` (as listed in key module signatures); the import path may need adjustment if the project uses a barrel/relay file
- Tailwind utility classes named in the spec (e.g., `text-slate-400`, `bg-slate-900/40`, `rounded-2xl`, `flex items-center gap-2`) are compatible with the project's `tailwind.config.js` and `postcss.config.js`
- The `useToast` hook follows the context pattern from `src/components/Toast.tsx` (provides `showToast` callback, toasts auto-dismiss after 3s)
- Mock request data structure `{ id, title, status, createdAt }` aligns with any existing API or backend expectations; no field renaming is needed
- The project's `@/` alias resolves to `src/` (standard Vite configuration); if using absolute paths differently, adjust imports accordingly
- No additional TypeScript types or interfaces are required beyond what the spec provides; the component compiles with the project's `tsconfig.json`/`@types/react` settings

{"clarification": {"needed": false, "questions": []}, "assumptions": [{"statement": "Router configuration is in src/App.tsx (file where DashboardPage is registered)", "risk": "low"}, {"statement": "ProtectedRoute importable from src/components/ProtectedRoute", "risk": "low"}, {"statement": "Tailwind classes in spec compatible with project config", "risk": "low"}, {"statement": "useToast hook follows pattern from src/components/Toast.tsx", "risk": "low"}, {"statement": "Mock data structure {id, title, status, createdAt} matches expectations", "risk": "low"}, {"statement": "@/ alias resolves to src/ (standard Vite config)", "risk": "low"}]}
