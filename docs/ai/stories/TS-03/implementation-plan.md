# Implementation Plan: TS-03 — Create Frontend-Only Settings Page with Mock Profile Update

---

### 1. Story Summary

Create a Settings page accessible from the dashboard sidebar that allows users to view and update their basic profile details (Name, Email, Address). The page pre-fills mock data, validates all fields before enabling the Update button, and shows a success toast on submission. No backend API calls are made — all state is local component state.

---

### 2. Source of Truth

This plan is based on the structured specification at:
- **File**: `docs/ai/stories/TS-03/spec.md`
- **JIRA Key**: TS-03
- **Type**: Feature | **Priority**: Medium

---

### 3. Technical Understanding

**Key architectural decisions:**
- The Settings page will be a new route-level component in `src/pages/SettingsPage.tsx`, following the `*Page.tsx` naming convention.
- The route `/settings` will be registered in `src/App.tsx`, wrapped with `ProtectedRoute` and `DashboardLayout` (same pattern as `/dashboard`).
- The Settings `NavItem` in `DashboardLayout.tsx` needs an `onClick` handler wired via `useNavigate` to navigate to `/settings`.
- All state is local (`useState`) — no global state, no API layer, no persistence.
- The existing `ToastProvider` (already wrapping `DashboardLayout`) provides `useToast` for the success toast.
- Form validation is manual (no form library), following the pattern established in `LoginPage.tsx`.

**Patterns from project-context.md that apply:**
- `React.FC` type annotation for all components.
- Tailwind CSS utility classes exclusively (dark theme palette: `bg-slate-900/40`, `border-slate-800`, `text-white`, `text-slate-400`, `indigo-600` accents).
- Icon imports from `lucide-react` (named imports).
- Input styling matches `LoginPage.tsx`: icon prefix, `focus:ring-2 focus:ring-indigo-500/50`, error text `text-rose-400 text-xs mt-1`.
- Error messages use `role="alert"`, inputs use `aria-invalid` and `aria-describedby`.
- Component files kept under ~150 lines.
- No config file modifications (`vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.js`).

---

### 4. Files to Inspect

| File Path | Reason |
|-----------|--------|
| `src/App.tsx` | To understand current route registration pattern and add `/settings` route |
| `src/components/DashboardLayout.tsx` | To inspect `NavItem` component signature and add `onClick` prop + navigation handler |
| `src/pages/LoginPage.tsx` | To reference form validation patterns, input styling, and error display patterns |
| `src/pages/DashboardPage.tsx` | To reference page header styling and card layout patterns |
| `src/components/Toast.tsx` | To confirm `useToast` hook signature and `showToast` API |
| `src/components/ProtectedRoute.tsx` | To confirm route protection pattern |
| `src/hooks/useAuth.ts` | To understand auth state shape (for route protection context) |

---

### 5. Files to Modify or Create

**Create:**
- `src/pages/SettingsPage.tsx` — New page component with profile settings form (mock data, validation, toast)

**Modify:**
- `src/App.tsx` — Add `/settings` route wrapped with `ProtectedRoute` + `DashboardLayout`
- `src/components/DashboardLayout.tsx` — Add optional `onClick` prop to `NavItem` interface/type; wire Settings NavItem to navigate to `/settings`

**Review:**
- `src/components/Toast.tsx` — Verify `useToast` is accessible within `DashboardLayout` children (it is — `ToastProvider` wraps the layout content)
- `src/components/ProtectedRoute.tsx` — Confirm it correctly redirects unauthenticated users (no changes needed)

---

### 6. Step-by-Step Implementation Plan

**Step 1: Add `onClick` prop to NavItem and wire Settings navigation**
- **What**: Modify `DashboardLayout.tsx` to add an optional `onClick` prop to the `NavItem` component type. Wire the Settings NavItem to call `navigate("/settings")` on click.
- **Files**: `src/components/DashboardLayout.tsx`
- **Prerequisites**: None
- **Verify**: 
  - `NavItem` type accepts optional `onClick?: () => void`
  - Settings NavItem has `onClick={() => navigate("/settings")}`
  - Existing NavItem instances (Overview, Audience, Reports) are unaffected (no `onClick` passed)
  - `npm run lint` passes

**Step 2: Register `/settings` route in App.tsx**
- **What**: Import `SettingsPage` and add a new `<Route path="/settings" ... />` following the same `ProtectedRoute` + `DashboardLayout` wrapping pattern as `/dashboard`.
- **Files**: `src/App.tsx`
- **Prerequisites**: Step 1 complete (route can exist before page, but page must exist for build to succeed — see Step 3)
- **Verify**: 
  - Route is registered with correct path and wrapping
  - Import statement for `SettingsPage` is added
  - `npm run lint` passes

**Step 3: Create SettingsPage component**
- **What**: Create `src/pages/SettingsPage.tsx` with:
  - `ProfileFormData` interface (name, email, address)
  - `mockProfile` constant with specified values
  - Email validation regex constant
  - `useState` for `formData` and `errors`
  - `isFormValid` computed value
  - `handleInputChange` handler
  - `validateEmail` helper
  - `handleSubmit` with toast notification
  - Render: page header ("Profile Settings"), subtitle, form card with 3 labeled inputs (Name, Email, Address), Update button
  - Each input: icon prefix (User, Mail, MapPin from lucide-react), controlled value, onChange, aria attributes
  - Email field: inline error display
  - Update button: disabled when `!isFormValid`, indigo-600 styling
- **Files**: `src/pages/SettingsPage.tsx`
- **Prerequisites**: Steps 1 and 2 complete (page needs to be importable by App.tsx)
- **Verify**:
  - Mock data pre-fills all three fields on mount
  - Update button is disabled initially (all fields filled but validation runs)
  - Clearing a field disables the button and shows error
  - Invalid email shows format error
  - Valid submission shows success toast
  - All inputs have `id`, `htmlFor` labels, `aria-invalid`, `aria-describedby`
  - Error messages have `role="alert"`
  - `npm run lint` passes
  - File is under ~150 lines (extract helper if needed)

**Step 4: Manual verification and polish**
- **What**: Run the dev server, navigate to `/login`, authenticate with mock credentials (`test@example.com` / `Admin@123`), click Settings in sidebar, verify form renders and behaves correctly.
- **Files**: None (manual testing)
- **Prerequisites**: Steps 1-3 complete
- **Verify**:
  - Settings nav item is clickable and navigates to `/settings`
  - Form displays with mock data pre-filled
  - Only three fields visible (Name, Email, Address)
  - Update button disabled/enabled correctly
  - Email validation works
  - Success toast appears on valid submission
  - Keyboard navigation works (Tab order, Enter to submit)
  - Responsive layout on mobile

**Step 5: Build and lint verification**
- **What**: Run `npm run lint` and `npm run build` to confirm no errors.
- **Files**: All modified/created files
- **Prerequisites**: Steps 1-4 complete
- **Verify**: Both commands succeed with zero errors

---

### 7. API / Data Contract Changes

- **New Endpoints**: None. This is frontend-only.
- **Modified Endpoints**: None.
- **Data Models / Interfaces**:
  - New inline interface in `SettingsPage.tsx`:
    ```typescript
    interface ProfileFormData {
      name: string;
      email: string;
      address: string;
    }
    ```
  - New inline type for errors:
    ```typescript
    interface FormErrors {
      name?: string;
      email?: string;
      address?: string;
    }
    ```
- **Breaking Changes**: None.
- **NavItem Type Change**: The `NavItem` component's props type gains an optional `onClick?: () => void` field. This is backward-compatible since it's optional.

---

### 8. UI / UX Changes

**New page:**
- Route: `/settings`
- Page title: "Profile Settings" (`text-3xl font-bold tracking-tight text-white`)
- Subtitle: "Manage your account information" (`text-slate-400`)
- Form card: `bg-slate-900/40 border border-slate-800 rounded-2xl p-6`
- Three form fields stacked vertically with `space-y-6`:
  - **Name**: `User` icon, text input, placeholder "Enter your name"
  - **Email**: `Mail` icon, email input, placeholder "Enter your email"
  - **Address**: `MapPin` icon, text input, placeholder "Enter your address"
- Update button: full-width, `bg-indigo-600 hover:bg-indigo-500`, with `Save` or `Check` icon from lucide-react
- Disabled state: `disabled:opacity-50 disabled:cursor-not-allowed`
- Error text: `text-rose-400 text-xs mt-1` with `role="alert"`
- Form container: `max-w-2xl` for readability
- Responsive: Form card readable on mobile, standard Tailwind breakpoints

**Navigation change:**
- Settings NavItem in sidebar now navigates to `/settings` on click (previously no-op)

**Accessibility:**
- All inputs have `id`, associated `<label>` with `htmlFor`
- Inputs use `aria-invalid` and `aria-describedby` for validation errors
- Error messages use `role="alert"`
- Update button is keyboard accessible (native `<button type="submit">`)
- Toast uses existing accessible implementation (`role="alert"`, `aria-live="assertive"`)

---

### 9. State Management Changes

**New local component state in `SettingsPage.tsx`:**
```typescript
const [formData, setFormData] = useState<ProfileFormData>(mockProfile);
const [errors, setErrors] = useState<FormErrors>({});
```

**Computed value:**
```typescript
const isFormValid = formData.name.trim() !== '' 
  && formData.email.trim() !== '' 
  && formData.address.trim() !== ''
  && isValidEmail(formData.email);
```

**No global state changes.** No context, no stores, no cache invalidation.

**Side effects:** None. Toast is triggered imperatively via `useToast().showToast()` on form submit.

**Form reset behavior:** Form values are retained after successful submission (no reset). Navigating away and returning resets to mock data (component unmounts/remounts).

---

### 10. Validation and Error Handling

**Validation rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Name | Required, non-empty, non-whitespace | "Name is required." |
| Email | Required, non-empty, format: `^[^\s@]+@[^\s@]+\.[^\s@]+$` | Empty: "Email is required." / Invalid: "Please enter a valid email address." |
| Address | Required, non-empty, non-whitespace | "Address is required." |

**Error handling strategy:**
- Validation runs on change (clears errors when field becomes valid) and on submit (validates all fields).
- Errors displayed inline below the relevant input field.
- Update button disabled when any field fails validation.
- No network errors possible (no API calls).
- Success toast: "Profile updated successfully." shown via `useToast().showToast(message, "success")`.

**User-facing error messages:**
- "Name is required."
- "Email is required."
- "Please enter a valid email address."
- "Address is required."

---

### 11. Test Plan

**Note**: No test framework is currently configured in the project. Tests are specified for future implementation when Vitest + React Testing Library is added.

**Unit Tests** (future `src/__tests__/pages/SettingsPage.test.tsx`):
- Renders form with mock data pre-filled (Name: "John Doe", Email: "john.doe@example.com", Address: "221B Baker Street, London")
- Shows exactly three input fields
- Update button is disabled when any field is cleared
- Update button is enabled when all fields contain valid values
- Shows "Email is required." error when email is cleared
- Shows "Please enter a valid email address." for invalid email format
- Shows "Name is required." when name is cleared
- Shows "Address is required." when address is cleared
- Shows success toast "Profile updated successfully." on valid submission
- Form values are retained after successful submission (not reset)

**Integration Tests** (future):
- Navigate from Dashboard to Settings via sidebar click
- Access `/settings` directly via URL (ProtectedRoute allows when authenticated)
- Unauthenticated access to `/settings` redirects to `/login`

**Edge Cases:**
- Whitespace-only values treated as empty
- Email with `@` but no domain fails validation
- Email with `@` and domain but no `.` fails validation
- Rapid typing does not cause validation flicker

**Test Files:**
- New: `src/__tests__/pages/SettingsPage.test.tsx` (when test framework is configured)

---

### 12. Risk Areas

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `NavItem` `onClick` prop conflicts with existing behavior | Low | Low | Add as optional prop; existing instances unaffected |
| SettingsPage exceeds ~150 line limit | Medium | Low | Extract input field rendering into a co-located helper component if needed |
| Email validation regex edge cases | Medium | Low | Use well-tested simple pattern; can refine later |
| Toast not accessible if `useToast` called outside `ToastProvider` | Low | Medium | `ToastProvider` wraps `DashboardLayout`, and `SettingsPage` is rendered inside it — verify this chain |
| Route protection gap (no real auth) | Low | Low | Existing `ProtectedRoute` handles mock-level protection; aligns with known project gap |
| `useAuth` import in `DashboardLayout.tsx` — verify it exists | Low | Low | Already confirmed: `src/hooks/useAuth.ts` exists and is imported |
| Spec ambiguity: should Settings nav item show active state? | Medium | Low | Spec assumes no active state needed beyond existing pattern; can be addressed later |
| Spec ambiguity: form reset after submit? | Low | Low | Spec assumes values are retained (more natural UX) |

---

### 13. Final Coding Agent Instructions

**Recommended order of execution:**
1. Step 1: Modify `DashboardLayout.tsx` — add `onClick` to NavItem, wire Settings navigation
2. Step 3: Create `SettingsPage.tsx` — the full page component (do this before Step 2 so the import in App.tsx resolves)
3. Step 2: Modify `App.tsx` — register the `/settings` route
4. Step 4: Manual verification in dev server
5. Step 5: Run `npm run lint` and `npm run build`

**Setup/configuration before starting:**
- Ensure you're on the correct git worktree branch
- Run `npm install` if `node_modules/` is not present

**Commands to run:**
- `npm run dev` — start dev server for manual testing
- `npm run lint` — verify ESLint passes with zero errors
- `npm run build` — verify TypeScript compilation and Vite build succeed

**If a step fails:**
- **Lint failure**: Check for unused imports, missing type annotations, or `any` types. The project has `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` enabled.
- **Build failure**: Check TypeScript errors — ensure all props are typed, no missing imports, correct interface usage.
- **NavItem type error**: Ensure the `onClick` prop is optional (`onClick?: () => void`) so existing NavItem calls don't break.
- **Toast error**: If `useToast` throws "must be used within a ToastProvider", verify `SettingsPage` is rendered inside `DashboardLayout` (which wraps content in `ToastProvider`).

**When to pause and request clarification:**
- If the existing `NavItem` component structure differs significantly from what's described in the spec
- If `ToastProvider` scope changes and `useToast` is not accessible in `SettingsPage`
- If any config files need modification (against project rules)

**Confirmation criteria for marking implementation complete:**
- [ ] Settings page renders at `/settings` route
- [ ] Sidebar Settings option navigates to Settings page
- [ ] Form displays exactly three fields: Name, Email, Address
- [ ] All fields pre-filled with specified mock data
- [ ] Update button disabled when any field is empty
- [ ] Update button enabled when all fields have valid values
- [ ] Email format validation works with correct error message
- [ ] Success toast shows "Profile updated successfully." on valid submission
- [ ] No backend API calls are made
- [ ] No additional profile fields are displayed
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] No `any` types introduced
- [ ] No `console.log` / `debugger` statements
- [ ] All new components typed with props interfaces
- [ ] New route registered in `src/App.tsx`
- [ ] Tailwind classes used (no custom CSS or inline styles)
- [ ] File naming follows convention (PascalCase for components)
- [ ] Imports are ordered and clean
- [ ] Component files under ~150 lines
- [ ] Accessibility basics covered (labels, aria attributes, keyboard navigation)
- [ ] No unrelated files modified
- [ ] `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, and `tailwind.config.js` are NOT modified
