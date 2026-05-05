# TS-01 — Implementation Plan

> **Story:** Implement Login Form Functionality with Protected Dashboard Route
> **Created:** 2026-05-04
> **Target:** code-implementer agent

---

## Overview

This plan covers adding frontend-only mock authentication with `localStorage`-based session management, form validation, protected routing, and logout support. No new dependencies are needed.

---

## Step 1: Create `src/hooks/useAuth.ts`

**Purpose:** Custom hook for auth state management — reads/writes `localStorage`, provides `login`, `logout`, and current auth state.

### Implementation Details

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
}

interface UseAuthReturn {
  auth: AuthState;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}
```

- **`auth`**: Read from `localStorage` on every call. Parse `user` JSON safely (handle `null`/malformed). Use `useState` with a lazy initializer so it re-reads on each render.
- **`login(email, password)`**:
  - Compare against mock credentials: `email === "test@example.com"` && `password === "Admin@123"`.
  - On success: `localStorage.setItem("isAuthenticated", "true")`, `localStorage.setItem("user", JSON.stringify({ email: "test@example.com", name: "Test User" }))`, return `{ success: true }`.
  - On failure: return `{ success: false, error: "Invalid email or password." }`.
- **`logout()`**: `localStorage.removeItem("isAuthenticated")`, `localStorage.removeItem("user")`.
- **Do NOT** store the password anywhere.
- Use `React.useState` with a getter function to ensure fresh reads from `localStorage`.
- No `any` types. No `console.log`.

### Key Considerations
- The hook should NOT use `useEffect` for reading — use lazy `useState` initializer for synchronous reads.
- Export as `export default function useAuth(): UseAuthReturn`.

---

## Step 2: Create `src/components/ProtectedRoute.tsx`

**Purpose:** Route guard component that redirects unauthenticated users to `/login`.

### Implementation Details

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

- Read `localStorage.getItem("isAuthenticated")`.
- If not `"true"`, render `<Navigate to="/login" replace />`.
- If authenticated, render `children`.
- Type as `React.FC<ProtectedRouteProps>`.
- Import `Navigate` from `react-router-dom`.
- Use `React.ReactNode` for children type.

### Key Considerations
- Keep it simple — no need for `useAuth` hook here; direct `localStorage` read is sufficient and avoids re-render complexity.
- Use `replace` on `<Navigate>` to prevent back-button loops.

---

## Step 3: Update `src/pages/LoginPage.tsx`

**Purpose:** Add controlled form state, validation logic, submit handler, and auth redirect on mount.

### Changes Required

1. **Add imports:**
   - `useState` from `react`
   - `useNavigate` from `react-router-dom`
   - `useAuth` from `../hooks/useAuth`

2. **Add state variables:**
   - `email: string` (default `""`)
   - `password: string` (default `""`)
   - `rememberMe: boolean` (default `false`)
   - `emailError: string` (default `""`)
   - `passwordError: string` (default `""`)
   - `submitError: string` (default `""`)

3. **Add auth redirect on mount:**
   - Use `useAuth()` to check `auth.isAuthenticated`.
   - If already authenticated, `navigate("/dashboard", { replace: true })`.
   - Use `useEffect` with `[navigate]` dependency, or check synchronously before render.

4. **Wire up form inputs as controlled components:**
   - Email input: `value={email}`, `onChange={(e) => setEmail(e.target.value)}`
   - Password input: `value={password}`, `onChange={(e) => setPassword(e.target.value)}`
   - Remember me checkbox: `checked={rememberMe}`, `onChange={(e) => setRememberMe(e.target.checked)}`
   - Add `id` attributes to inputs for label association (`id="email"`, `id="password"`)
   - Update labels to use `htmlFor` matching input `id`s

5. **Implement `handleSubmit`:**
   - `e.preventDefault()`
   - Clear all errors: `setEmailError("")`, `setPasswordError("")`, `setSubmitError("")`
   - Validate empty fields:
     - If `!email.trim()`: `setEmailError("Email is required")`
     - If `!password`: `setPasswordError("Password is required")`
     - If any field error, return early
   - Call `login(email, password)` from `useAuth`
   - If `result.success`: `navigate("/dashboard")`
   - If `!result.success`: `setSubmitError(result.error)`

6. **Display error messages:**
   - Field errors: Show below respective inputs with `text-rose-400 text-xs mt-1` styling
   - Submit error: Show above the form or between heading and form with `text-rose-400 text-sm text-center`
   - Associate errors with inputs via `aria-describedby` or `aria-invalid`

7. **Preserve existing UI:**
   - Keep all Tailwind classes, icons, layout structure
   - Only add error message elements and wire up existing form elements

### Key Considerations
- Validation runs on submit only, NOT on blur/change.
- Both email and password errors can show simultaneously.
- The `rememberMe` field is tracked but not used for persistence in this story (scope limitation).
- Keep file under ~150 lines.

---

## Step 4: Update `src/App.tsx`

**Purpose:** Wrap `/dashboard` route with `ProtectedRoute` component.

### Changes Required

1. **Add import:**
   - `import ProtectedRoute from './components/ProtectedRoute';`

2. **Update `/dashboard` route:**
   ```tsx
   <Route path="/dashboard" element={
     <ProtectedRoute>
       <DashboardLayout>
         <DashboardPage />
       </DashboardLayout>
     </ProtectedRoute>
   } />
   ```

3. **No other changes needed** — `/` redirect and `/login` route remain unchanged.

### Key Considerations
- Import order: external libraries first, then internal imports.
- Keep the existing route structure intact.

---

## Step 5: Update `src/components/DashboardLayout.tsx`

**Purpose:** Wire up logout action on sidebar user section and add logout button in header.

### Changes Required

1. **Add imports:**
   - `useNavigate` from `react-router-dom`
   - `useAuth` from `../hooks/useAuth`

2. **Add logout handler:**
   - Call `useAuth()` to get `logout` function.
   - Call `useNavigate()` for redirect.
   - Create `handleLogout` function:
     ```typescript
     const handleLogout = () => {
       logout();
       navigate("/login", { replace: true });
     };
     ```

3. **Wire up sidebar LogOut icon (line 48):**
   - Add `onClick={handleLogout}` to the sidebar user section `div` (line 40 wrapper).
   - Add `role="button"` and `tabIndex={0}` for accessibility.
   - Add keyboard handler: `onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLogout(); }}`

4. **Add Logout button in header:**
   - In the header's right section (around line 71-80), add a logout button:
     ```tsx
     <button
       onClick={handleLogout}
       className="text-slate-400 hover:text-rose-400 transition-colors text-sm font-medium"
     >
       Logout
     </button>
     ```
   - Place it before or after the "Download Report" button.

### Key Considerations
- The `DashboardLayout` is a component that receives `children` — adding hooks at the top level is fine.
- Keep the existing sidebar user section styling intact.
- The logout button in header should be subtle (text-only, not a filled button) to not compete with "Download Report".
- Keep file under ~150 lines.

---

## Implementation Order

1. `src/hooks/useAuth.ts` (new file)
2. `src/components/ProtectedRoute.tsx` (new file)
3. `src/pages/LoginPage.tsx` (modify)
4. `src/App.tsx` (modify)
5. `src/components/DashboardLayout.tsx` (modify)

---

## Files Summary

| Action | File |
|---|---|
| CREATE | `src/hooks/useAuth.ts` |
| CREATE | `src/components/ProtectedRoute.tsx` |
| MODIFY | `src/pages/LoginPage.tsx` |
| MODIFY | `src/App.tsx` |
| MODIFY | `src/components/DashboardLayout.tsx` |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `localStorage` read returns stale value | Use lazy `useState` initializer in `useAuth` to re-read on every render |
| Back-button shows dashboard after logout | Use `{ replace: true }` in all `navigate()` calls for auth redirects |
| TypeScript errors from unused imports | Only import what is used; `noUnusedLocals` is enabled |
| LoginPage exceeds ~150 lines | Extract error display into a small co-located component if needed |
| DashboardLayout exceeds ~150 lines | Keep logout button minimal; extract if needed |
| ESLint failures | Run `npm run lint` after all changes; fix any issues |
| Build failures | Run `npm run build` after all changes; fix TypeScript errors |

---

## Verification Steps

After implementation, the code-implementer agent must:

1. Run `npm run lint` — must pass with zero errors
2. Run `npm run build` — must succeed
3. Manually verify all 6 acceptance scenarios from the spec:
   - Scenario 1: Successful login with `test@example.com` / `Admin@123`
   - Scenario 2: Invalid credentials show error, no auth stored
   - Scenario 3: Empty form shows field-level errors
   - Scenario 4: Unauthenticated user redirected from `/dashboard` to `/login`
   - Scenario 5: Authenticated user redirected from `/login` to `/dashboard`
   - Scenario 6: Logout clears storage and redirects to `/login`

---

## Out of Scope (Do NOT Implement)

- Backend API integration
- Password reset / forgot password flow
- User registration
- Token refresh / session expiry
- Role-based access control
- Test suite creation
- Environment variable configuration
- `rememberMe` persistence logic (track state but don't implement)
