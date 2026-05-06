# Review Pointers — TS-08 Cycle 1

## Review Summary

**Scope reviewed:** `DashboardPage.tsx` changes (Customers section + mock data + import) and new `CustomersTable.tsx`, against `docs/ai/stories/TS-08/implementation-plan.md`, `docs/ai/stories/TS-08/spec.md`, and `docs/ai/project-context.md`.

**Overall:** Implementation matches the story: static mock data (five rows, three statuses), semantic table with `scope="col"`, `aria-label` on `<table>`, Reports-style headers and row chrome, status pills (emerald / amber / rose), card placement below the chart/transactions grid, and no network/env/service usage in new code.

**Verdict:** **APPROVED_WITH_RECOMMENDATIONS** — no correctness or spec gaps found; follow-ups are process verification and maintainability hygiene.

---

## Severity Legend

| Level | Meaning |
|--------|--------|
| **BLOCKER** | Must fix before merge; breaks AC, governance, or security. |
| **HIGH** | Should fix before PR; material risk or plan deviation. |
| **MEDIUM** | Worth fixing; quality, consistency, or future-proofing. |
| **LOW** | Optional polish. |

---

## File-Level Pointers

### `src/pages/DashboardPage.tsx`

| Sev | Pointer |
|-----|---------|
| **MEDIUM** | **Line budget:** File is **~177 lines**, above the ~150-line soft limit in `project-context.md`. Table + badge were extracted per plan, but the page still carries the full mock array. Acceptable for TS-08; if the page grows again, consider a tiny `customersMock.ts` next to the page **only** if product wants shared mocks—otherwise leave as-is to match AC-3 (“const in the page”). |
| **LOW** | **React list keys:** Rows are keyed by `customer.email` in `CustomersTable`. Safe for current mocks; if data ever allows duplicate emails, switch to a stable `id` or composite key. |
| **LOW** | **Optional spec nuance:** Spec lists an optional `Users` icon near the section title; not required for acceptance—skip unless design asks for parity with other cards. |

### `src/components/CustomersTable.tsx`

| Sev | Pointer |
|-----|---------|
| **LOW** | **Empty state:** `customers.map` with an empty array yields headers only—fine for static story; no change required unless product wants an empty message later (out of scope). |
| **LOW** | **`CustomerStatusBadge` typing:** `styles[status]` is correct given `CustomerStatus`; no fallback branch needed for the union. |

### Process / repo (not a single file)

| Sev | Pointer |
|-----|---------|
| **MEDIUM** | **Verification evidence:** Implementation plan and DoD require `npm run lint` and `npm run build`. Confirm both pass in CI or locally before PR; this review did not capture command output. |

---

## Must-Fix Items

**None.**

No BLOCKER or HIGH issues identified. Spec mock table (AC/data section) matches the committed mock rows; table semantics, accessible name, column set, status variants, and responsive wrapper align with the implementation plan and AC-1–AC-7.

---

## Findings by Severity (consolidated)

### BLOCKER

- *(none)*

### HIGH

- *(none)*

### MEDIUM

1. **Line count / maintainability** — `src/pages/DashboardPage.tsx` exceeds ~150 lines after TS-08; acceptable; document intent if future edits add more sections.
2. **Lint/build confirmation** — Run `npm run lint` and `npm run build` and attach or rely on CI results per plan step 8 and AC-8.

### LOW

1. **Row key strategy** — `src/components/CustomersTable.tsx`: prefer stable unique ids if the data model evolves beyond mocks.
2. **Optional section icon** — `src/pages/DashboardPage.tsx`: spec-only optional enhancement.

---

## Plan Compliance (abbreviated)

| Requirement | Status |
|-------------|--------|
| Customers section below `lg:grid-cols-3` grid, inside `space-y-8` | ✅ |
| `h3` “Customers” + subtitle | ✅ |
| Card container classes match dashboard | ✅ |
| ≥5 rows; all columns populated; three statuses in mock | ✅ |
| Semantic `table` / `thead` / `tbody`; `th scope="col"` | ✅ |
| `aria-label` or caption (one mechanism) | ✅ (`aria-label`) |
| `overflow-x-auto` + `max-w-full` | ✅ |
| Status badges: emerald / amber / rose pills with visible text | ✅ |
| No `fetch` / services / `import.meta.env` for customers | ✅ |
| No pagination, sort, filter, row actions | ✅ |
| `React.FC`, default export, relative imports | ✅ |
| New code: Tailwind only, no `any` / `console.log` observed | ✅ |

---

## Final Verdict

**APPROVED_WITH_RECOMMENDATIONS** — Ship after confirming **lint and build** in the author’s environment or CI. Optional: watch `DashboardPage.tsx` size on the next dashboard edit.
