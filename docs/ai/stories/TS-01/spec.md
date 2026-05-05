# TS-01 — Implement Login Form Functionality with Protected Dashboard Route

> **Status:** Draft
> **Created:** 2026-05-04
> **Last Updated:** 2026-05-04

---

## 1. Story Metadata

| Field | Value |
|---|---|
| **JIRA Key** | TS-01 |
| **Title** | Implement Login Form Functionality with Protected Dashboard Route |
| **Description** | As a user, I want to log in using valid credentials, so that I can access the dashboard page securely. |
| **Type** | Feature |
| **Priority** | High |

---

## 2. Background / Context

The React application currently has two designed pages (`/login` and `/dashboard`) that are UI-only with no business logic. Both pages use static/mock data and have no authentication state, form validation, or route protection. This story adds frontend-only mock authentication with `localStorage`-based session management and protected routing.

**Key project constraints (from `docs/ai/project-context.md`):**

- React 19.2.5 + TypeScript ~6.0.2 + Vite 8.0.10
- `react-router-dom` 7.14.2 for routing
- Tailwind CSS 4.2.4 for styling (no inline styles)
- No global state management library — use local state + `localStorage`
- Components use `React.FC` typing, PascalCase naming, `export default`
- No `any` types, no `console.log` in production code
- File modification rules: new hooks go in `src/hooks/`, new utilities in `src/utils/`, routes registered in `App.tsx`
- Do NOT modify `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, or `tailwind.config.js`

---

## 3. Mock Credentials

| Field | Value |
|---|---|
| **Email** | `test@example.com` |
| **Password** | `Admin@123` |

Only these credentials allow successful login. No backend API integration is required.

---

## 4. Functional Requirements

### 4.1 Login Form State Handling

**File:** `src/pages/LoginPage.tsx`

The login form must manage three controlled fields:

| Field | Type | Default |
|---|---|---|
| `email` | `string` | `""` |
| `password` | `string` | `""` |
| `rememberMe` | `boolean` | `false` |

- Email and password inputs must be controlled components bound to `useState`.
- The `rememberMe` checkbox must be bound to `useState`.
- The existing form `onSubmit` placeholder (`e.preventDefault()`) must be replaced with actual submission logic.

### 4.2 Login Validation

On form submission (Sign in button click):

1. Validate that `email === "test@example.com"` AND `password === "Admin@123"`.
2. **If valid:**
   - Store authentication state in `localStorage` (see Section 4.4).
   - Redirect to `/dashboard` using `useNavigate`.
3. **If invalid:**
   - Stay on `/login`.
   - Show error message: `"Invalid email or password."`
   - Do not authenticate the user.

### 4.3 Empty Field Validation

Before credential comparison, validate required fields:

| Condition | Error Message |
|---|---|
| `email` is empty | `"Email is required"` |
| `password` is empty | `"Password is required"` |

- Validation messages must be shown near the related input fields.
- Both errors may be shown simultaneously if both fields are empty.
- Validation runs on submit (not on blur/change).

### 4.4 Authentication Storage

Use `localStorage` for frontend-only authentication persistence.

**Storage keys:**

| Key | Value |
|---|---|
| `isAuthenticated` | `"true"` (string) |
| `user` | `{"email": "test@example.com", "name": "Test User"}` (JSON string) |

**Rules:**
- Do NOT store the password in any form.
- Use `localStorage.setItem` on successful login.
- Use `localStorage.removeItem` (or `localStorage.clear`) on logout.
- Reading auth state must be safe (handle `null`/missing keys).

### 4.5 Protected Dashboard Route

**File:** `src/App.tsx` (route configuration) + new `ProtectedRoute` component

- The `/dashboard` route must verify authentication before rendering.
- If `isAuthenticated` is not `"true"` in `localStorage`, redirect to `/login`.
- Implement a `ProtectedRoute` wrapper component that:
  - Reads `localStorage.getItem("isAuthenticated")` on mount.
  - Uses `useNavigate` or `<Navigate>` to redirect unauthenticated users.
  - Renders `children` only when authenticated.

### 4.6 Login Page Redirect Behavior

- If the user is already authenticated (`isAuthenticated === "true"`) and visits `/login`, redirect them to `/dashboard`.
- This check runs on `LoginPage` mount.

### 4.7 Logout Support

**File:** `src/components/DashboardLayout.tsx`

- Add a logout action on the dashboard.
- The existing sidebar user section (line 40-49) has a `LogOut` icon but no click handler — wire it up.
- Additionally, add a visible **Logout** button in the dashboard header top-right area.
- On logout click:
  1. Remove `isAuthenticated` and `user` from `localStorage`.
  2. Redirect to `/login`.

---

## 5. Acceptance Criteria

### Scenario 1: Successful Login

| Step | Action |
|---|---|
| Given | I am on the `/login` page |
| When | I enter Email: `test@example.com` |
| And | I enter Password: `Admin@123` |
| And | I click **Sign in** |
| Then | I am redirected to `/dashboard` |
| And | `localStorage` contains `isAuthenticated = "true"` |
| And | `localStorage` contains `user` with email and name |

### Scenario 2: Invalid Login

| Step | Action |
|---|---|
| Given | I am on the `/login` page |
| When | I enter an invalid email or password |
| And | I click **Sign in** |
| Then | I stay on `/login` |
| And | I see the error message: `"Invalid email or password."` |
| And | `localStorage` does NOT contain `isAuthenticated` |

### Scenario 3: Empty Login Form

| Step | Action |
|---|---|
| Given | I am on the `/login` page |
| When | I click **Sign in** without entering any credentials |
| Then | I see `"Email is required"` near the email field |
| And | I see `"Password is required"` near the password field |
| And | No authentication state is stored |

### Scenario 4: Prevent Unauthorized Dashboard Access

| Step | Action |
|---|---|
| Given | I am NOT authenticated |
| When | I directly navigate to `/dashboard` |
| Then | I am redirected to `/login` |

### Scenario 5: Redirect Authenticated User Away From Login

| Step | Action |
|---|---|
| Given | I am already authenticated (`isAuthenticated = "true"` in `localStorage`) |
| When | I navigate to `/login` |
| Then | I am redirected to `/dashboard` |

### Scenario 6: Logout

| Step | Action |
|---|---|
| Given | I am authenticated and on the `/dashboard` page |
| When | I click **Logout** |
| Then | `isAuthenticated` and `user` are removed from `localStorage` |
| And | I am redirected to `/login` |

---

## 6. Technical Design

### 6.1 New Files

| File | Purpose |
|---|---|
| `src/hooks/useAuth.ts` | Custom hook for auth state management (read/write `localStorage`, login, logout, check auth) |
| `src/components/ProtectedRoute.tsx` | Route guard component that redirects unauthenticated users to `/login` |

### 6.2 Modified Files

| File | Changes |
|---|---|
| `src/pages/LoginPage.tsx` | Add controlled form state, validation logic, submit handler, auth redirect on mount |
| `src/App.tsx` | Wrap `/dashboard` route with `ProtectedRoute` component |
| `src/components/DashboardLayout.tsx` | Wire up logout action on sidebar user section and add logout button in header |

### 6.3 `useAuth` Hook Specification

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

- `auth`: Reads current state from `localStorage` on every call (reactive via state).
- `login(email, password)`: Validates against mock credentials. On success, writes to `localStorage` and returns `{ success: true }`. On failure, returns `{ success: false, error: "Invalid email or password." }`.
- `logout()`: Clears `isAuthenticated` and `user` from `localStorage`.

### 6.4 `ProtectedRoute` Component Specification

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

- Reads `isAuthenticated` from `localStorage`.
- If not authenticated, renders `<Navigate to="/login" replace />`.
- If authenticated, renders `children`.

### 6.5 Route Table (Updated)

| Path | Element | Protection |
|---|---|---|
| `/` | `<Navigate to="/login" replace />` | None |
| `/login` | `<LoginPage />` | Redirects to `/dashboard` if already authenticated |
| `/dashboard` | `<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>` | Protected |

---

## 7. Implementation Order

1. Create `src/hooks/useAuth.ts` — auth state management hook.
2. Create `src/components/ProtectedRoute.tsx` — route guard component.
3. Update `src/pages/LoginPage.tsx` — add form state, validation, submit handler, auth redirect.
4. Update `src/App.tsx` — wrap dashboard route with `ProtectedRoute`.
5. Update `src/components/DashboardLayout.tsx` — wire up logout in sidebar and add logout button in header.

---

## 8. Review Checklist

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] No `any` types introduced
- [ ] No `console.log` / `debugger` statements
- [ ] All new components typed with props interfaces
- [ ] New routes registered in `App.tsx`
- [ ] Tailwind classes used (no custom CSS or inline styles)
- [ ] No hardcoded secrets (mock credentials are acceptable per story scope)
- [ ] Password is NOT stored in `localStorage`
- [ ] File naming follows PascalCase for components
- [ ] Imports are ordered (external first, then internal)
- [ ] Component files under ~150 lines
- [ ] Accessibility: form inputs have proper labels, error messages are associated
- [ ] All 6 acceptance scenarios verified manually

---

## 9. Out of Scope

- Backend API integration (mock auth only)
- Password reset / forgot password flow
- User registration / create account flow
- Token refresh / session expiry
- Real user management or role-based access control
- Test suite creation (no test framework configured yet)
- Environment variable configuration for credentials
