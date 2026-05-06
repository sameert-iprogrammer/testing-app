# TS-08 — Implementation Plan (Customer Listing on Dashboard)

**Audience:** code-implementer agent  
**Spec:** `docs/ai/stories/TS-08/spec.md`  
**Stack constraints:** `docs/ai/project-context.md` (React 19 + TS + Vite, Tailwind only, no new deps without justification, no config edits without approval)

## Goal

Add a **static, UI-only** “Customers” section on `/dashboard` inside `DashboardPage`, with a semantic table, mock data (≥5 rows, three status variants), accessible markup, and responsive horizontal scroll—**no** API, services, `fetch`, `import.meta.env`, or interactive data features (pagination, sort, filter, search, row actions).

## Files to touch

| File | Action | Notes |
|------|--------|--------|
| `src/pages/DashboardPage.tsx` | **Modify** (primary) | Add types, mock array, section UI, and optional co-located `CustomerStatusBadge` helper |
| `src/components/CustomersTable.tsx` (or similar) | **Create only if needed** | If post-change `DashboardPage.tsx` materially exceeds ~150 lines or readability suffers, extract table + badge only; keep `React.FC`, default export, relative imports |
| `src/App.tsx` | **Do not change** | `/dashboard` already wires `DashboardLayout` + `DashboardPage` |
| `src/components/DashboardLayout.tsx` | **Do not change** | Not required for this story |
| `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js` | **Do not change** | Unless explicitly approved |

**Reference implementation (do not modify unless shared patterns are genuinely wrong):**  
`src/pages/ReportsPage.tsx` — reuse its **table** structure (`overflow-x-auto` wrapper, `w-full max-w-full text-left`, header `text-xs font-medium text-slate-400 uppercase tracking-wider`, row `border-b border-slate-800`) and **`StatusBadge`-style pills** (`bg-*-400/10 text-*-400`, `rounded-full`, visible text). Map customer statuses to **emerald (Active)**, **amber (Invited)**, **rose (Churned)** per spec.

## Implementation steps (ordered)

1. **Read** full `src/pages/DashboardPage.tsx` before editing (governance).
2. **Add types and mock data** (top of file, after imports):
   - `type CustomerStatus = 'Active' | 'Invited' | 'Churned'`
   - `interface Customer { name; email; company; status; joined }` (`joined` as `YYYY-MM-DD` string)
   - `const MOCK_CUSTOMERS: Customer[]` with **at least five** rows; use the spec’s example rows or equivalent; ensure **all three** statuses appear; every column non-empty.
3. **Add `CustomerStatusBadge`** as a small `React.FC` co-located in the same file (mirroring `ReportsPage`’s `StatusBadge` pattern, keyed by `CustomerStatus`). No icon-only badges—status text must remain visible.
4. **Insert the Customers card** in the page JSX:
   - **Placement:** Immediately **after** the closing `</div>` of the `lg:grid-cols-3` grid block (the stats row stays unchanged; the chart + transactions grid stays unchanged), **still inside** the root `space-y-8` container (after line ~89 in current file, before the final closing `</div>` of the page).
   - **Section copy:** `<h2>` or `<h3>` with exact heading **“Customers”** (match heading level to **“Recent Transactions”** — currently `h3` on that card → use **`h3`** for consistency); subtitle: e.g. **“Recent accounts on the platform”** in muted `text-slate-400`.
   - **Container:** `bg-slate-900/40 border border-slate-800 rounded-2xl p-6` (match existing cards). Optional: `Users` icon from `lucide-react` already imported — only if it fits layout; not required for acceptance.
5. **Build the table:**
   - Outer: `overflow-x-auto max-w-full` (and ensure the card does not cause page-level horizontal overflow).
   - `<table>` with **accessible name**: `<caption className="sr-only">…</caption>` **or** `aria-label="Customers"` on `<table>` (pick one; avoid duplicate redundant naming).
   - `<thead>` / `<tbody>`; each header `<th scope="col">` for: Customer, Email, Company, Status, Joined.
   - Body cells: `text-sm text-slate-200`; row borders `border-b border-slate-800`; optional `hover:bg-slate-800/30` on `<tr>`.
   - Status column: render `CustomerStatusBadge` per row.
6. **Extraction decision:** After the edit, if the file is **well over ~150 lines** or the table dominates readability, move the table + badge to `src/components/CustomersTable.tsx`, pass `customers: Customer[]` as props (typed interface), keep dashboard page as composition only.
7. **Governance pass:** No `any`, no `console.log`, no inline `style={}` for new code (existing chart placeholders in `DashboardPage` may already use inline styles—do **not** refactor those unless necessary for this story). Tailwind-only for **new** UI. No `dangerouslySetInnerHTML`.
8. **Verify:** `npm run lint` and `npm run build` from repo root.

## Verification checklist (implementer)

- [ ] `/dashboard` shows **Customers** heading + subtitle; section sits **below** chart/transactions row.
- [ ] Semantic table: `table`, `thead`, `tbody`, `th`/`td`, `scope="col"` on headers.
- [ ] Caption **or** `aria-label` on table; badges remain text-labeled.
- [ ] Five+ rows; columns: Customer, Email, Company, Status, Joined; all cells populated.
- [ ] Three visually distinct status pills (Active / Invited / Churned) in mock data.
- [ ] Narrow viewport: table scrolls inside card (`overflow-x-auto`), layout intact.
- [ ] No network/env/service code paths for customers (grep: `fetch`, `axios`, `import.meta.env` in new code).
- [ ] No pagination, sorting, filtering, search, row clicks, or export UI.
- [ ] `npm run lint` and `npm run build` succeed.

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| **Line-count / complexity** in `DashboardPage.tsx` | Prefer co-location first; extract `CustomersTable` + badge only if file growth hurts maintainability. |
| **Visual drift** from dashboard | Copy utility clusters from existing cards on the same page and from `ReportsPage` table headers. |
| **Heading hierarchy** confusion | Page `<h1>` unchanged; Customers title should match **Recent Transactions** level (`h3`). |
| **Scope creep** (API, CRUD, interactivity) | Treat as defect; story is static read-only UI only. |
| **Accessibility gaps** | Prefer `scope="col"`; ensure table has one clear accessible name; avoid icon-only status. |
| **Regression** on existing dashboard blocks | Do not reorder stats or remove chart/transactions content; only append section and preserve spacing patterns. |

## Explicitly out of scope

- Backend, HTTP client, React Query/SWR, global state, env-driven URLs for this data.
- Loading/error states tied to network.
- Row actions, forms, exports, virtualization.
- New routes or changes to `ProtectedRoute` / auth behavior.
- “Fixing” pre-existing chart `inline style` in `DashboardPage` unless required to ship Customers (avoid unrelated diff).

## Done when

`implementation-plan.md` is satisfied by merged code: implementer completes verification checklist and spec **Definition of Done** in `spec.md`.
