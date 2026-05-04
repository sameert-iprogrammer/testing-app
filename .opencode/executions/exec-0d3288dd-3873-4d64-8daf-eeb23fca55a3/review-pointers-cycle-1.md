# Review Pointers — Cycle 1 (TS-01)

> Generated: 2026-05-04
> Reviewer: ai-reviewer

---

## Severity Summary

| Severity | Count |
|---|---|
| **Must-Fix** | 2 |
| **Should-Fix** | 1 |
| **Nit / Observation** | 2 |

---

## Must-Fix Items

### 1. `ProtectedRoute` reads `localStorage` directly but does not re-render on auth state change

**File:** `src/components/ProtectedRoute.tsx:9`
**Severity:** Must-Fix

`ProtectedRoute` reads `localStorage.getItem('isAuthenticated')` directly during render. This means if a user logs out from another component (e.g., `DashboardLayout`), `ProtectedRoute` will **not** re-render to reflect the changed state. The component only re-renders if its parent re-renders for unrelated reasons.

**Impact:** After logout, the dashboard may remain visible until a navigation event forces a re-render. The `<Navigate replace />` redirect works on initial mount, but stale reads can leave the UI in an inconsistent state.

**Fix:** Use the `useAuth` hook instead of direct `localStorage` access. The hook's `useState` will trigger re-renders when `setAuth` is called during logout, ensuring the guard reacts immediately.

```tsx
// Instead of:
const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

// Use:
const { auth } = useAuth();
const isAuthenticated = auth.isAuthenticated;
```

This contradicts the implementation plan's Step 2 guidance ("direct localStorage read is sufficient"), but the plan's risk mitigation table acknowledges the stale value risk. Using `useAuth` is the correct approach.

---

### 2. `LoginPage` — `useEffect` redirect can cause a flash of login UI before redirect

**File:** `src/pages/LoginPage.tsx:16-20`
**Severity:** Must-Fix

The authenticated redirect is inside a `useEffect`, which runs **after** the first render. If a user is already authenticated and navigates to `/login`, they will briefly see the login form before being redirected to `/dashboard`.

**Fix:** Perform a synchronous check before rendering the form:

```tsx
if (auth.isAuthenticated) {
  return <Navigate to="/dashboard" replace />;
}
```

Remove the `useEffect` entirely. This eliminates the flash and is the standard pattern for auth-garded public routes.

---

## Should-Fix Items

### 3. `DashboardLayout` — `NavItem` uses `href="#"` without proper handling

**File:** `src/components/DashboardLayout.tsx:115`
**Severity:** Should-Fix

The `NavItem` component renders `<a href="#">` which causes a page scroll-to-top and adds a history entry. This is a pre-existing issue but should be addressed when adding interactivity. Replace with `<button>` or use `event.preventDefault()` with `role="link"`.

---

## Nits / Observations

### 4. `LoginPage` — `ArrowRight` import is unused

**File:** `src/pages/LoginPage.tsx:3`
**Severity:** Nit

`ArrowRight` is imported and used in the submit button (line 120), so this is actually correct. No action needed — flagging for reviewer awareness since it appeared unused at first glance.

---

### 5. `useAuth` — Mock credentials are hardcoded as module-level constants

**File:** `src/hooks/useAuth.ts:14-15`
**Severity:** Observation

`MOCK_EMAIL` and `MOCK_PASSWORD` are module-level constants. This is fine for the current scope (frontend-only mock auth), but note that per governance rules, hardcoded credentials should eventually move to environment variables when real auth is implemented. Out of scope for this story.

---

## Files Not in Diff but Required by Plan

| File | Status |
|---|---|
| `src/hooks/useAuth.ts` | Created (49 lines) — matches plan |
| `src/components/ProtectedRoute.tsx` | Created (18 lines) — matches plan |
| `src/pages/LoginPage.tsx` | Modified (136 lines) — under 150 line limit |
| `src/App.tsx` | Modified (30 lines) — matches plan |
| `src/components/DashboardLayout.tsx` | Modified (123 lines) — under 150 line limit |

All five files from the implementation plan are present.

---

## Verification Checklist

- [ ] `npm run lint` — **must pass** before merge
- [ ] `npm run build` — **must pass** before merge
- [ ] No `any` types introduced — **confirmed**
- [ ] No `console.log` / `debugger` — **confirmed**
- [ ] All new components typed with props interfaces — **confirmed**
- [ ] New routes registered in `App.tsx` — **confirmed**
- [ ] Tailwind classes used (no inline styles) — **confirmed**
- [ ] No hardcoded secrets (mock creds are acceptable for this story) — **confirmed**
- [ ] File naming follows PascalCase — **confirmed**
- [ ] Imports are ordered and clean — **confirmed**
- [ ] Component files under ~150 lines — **confirmed**
- [ ] Accessibility basics covered (`aria-invalid`, `aria-describedby`, `role="alert"`, `role="button"`, `tabIndex`, `onKeyDown`) — **confirmed**
- [ ] No unrelated files modified — **confirmed**
