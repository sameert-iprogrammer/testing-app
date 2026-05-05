# Implementation Spec: TS-03 — Create Frontend-Only Settings Page with Mock Profile Update

## Story Metadata

| Field | Value |
|---|---|
| **JIRA Key** | TS-03 |
| **Title** | Create Frontend-Only Settings Page with Mock Profile Update |
| **Type** | Feature |
| **Priority** | Medium |
| **Status** | Draft |

## Story Summary

As a dashboard user, I want to view and update my basic profile details (Name, Email, Address) on a Settings page so that I can experience the profile update flow without backend integration. The page pre-fills mock data, validates that all fields are filled before enabling the Update button, and shows a success toast on submission.

## Business Goal

Provide users with a visible Settings page accessible from the dashboard sidebar, allowing them to interact with a profile update form. This establishes the UI/UX foundation for future backend-integrated profile management while delivering a functional frontend-only experience.

## Functional Requirements

1. A Settings page is accessible via the "Settings" option in the dashboard sidebar navigation.
2. The Settings page displays a profile settings form with exactly three fields: Name, Email, and Address.
3. All three fields are pre-filled with mock data on page load:
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Address: `221B Baker Street, London`
4. The Update button is disabled when any field is empty.
5. The Update button is enabled only when all three fields contain non-empty values.
6. Email field validates format (must contain `@` and a domain). Error message: "Please enter a valid email address."
7. Clicking Update with all fields valid shows a success toast with the message: "Profile updated successfully."
8. No backend API calls are made — all state is local component state.
9. No additional profile fields (avatar, password, phone, etc.) are displayed.

## Non-Functional Requirements

- **Performance**: No external dependencies added. Page renders instantly with mock data.
- **Accessibility**: All form inputs have associated `<label>` elements with `htmlFor`. Inputs use `aria-invalid` and `aria-describedby` for validation errors. Error messages use `role="alert"`. Update button is keyboard accessible. Toast uses existing accessible implementation (`role="alert"`, `aria-live="assertive"`).
- **Security**: No sensitive data handling. No `dangerouslySetInnerHTML`. No hardcoded secrets. Input values are controlled React state (XSS-safe).
- **Browser Support**: Standard modern browser support (matching project baseline).

## Acceptance Criteria Breakdown

| AC # | Criteria | Implementation Notes | Test Strategy |
|------|----------|---------------------|---------------|
| AC-1 | Settings page opens from sidebar | Register `/settings` route in `App.tsx` wrapped with `ProtectedRoute` + `DashboardLayout`. Add `onClick` handler to Settings NavItem in `DashboardLayout.tsx` that navigates to `/settings`. | Verify clicking Settings navigates to `/settings` and renders the form. |
| AC-2 | Mock data pre-filled | Initialize form state with `mockProfile` constant containing name, email, address. | Verify all three fields display correct mock values on mount. |
| AC-3 | Only required fields shown | Form contains exactly three inputs: Name, Email, Address. No other fields rendered. | Verify only three fields are present in the DOM. |
| AC-4 | Update button enabled/disabled correctly | Button `disabled` prop tied to `isFormValid` computed from: all fields non-empty AND email format valid (if email is non-empty). | Test button state changes as fields are cleared/filled. Test email format validation. |
| AC-5 | Success toast on update | On form submit with valid data, call `showToast("Profile updated successfully.", "success")` from existing `useToast` hook. | Verify toast appears with correct message after clicking Update. |

## Impacted Areas

| Area | Files | Change Type | Notes |
|------|-------|-------------|-------|
| Pages | `src/pages/SettingsPage.tsx` | New | Profile settings form page component |
| Components | `src/components/DashboardLayout.tsx` | Modify | Add `onClick` handler to Settings NavItem; add `useNavigate` import if not present |
| Routes | `src/App.tsx` | Modify | Register `/settings` route protected by `ProtectedRoute` + `DashboardLayout` |
| Types | Inline in `SettingsPage.tsx` | New | `ProfileFormData` interface for form state |
| Tests | `src/__tests__/pages/SettingsPage.test.tsx` | New | Component tests (when test framework is configured) |

## Data/API Requirements

- **Data Models**: No external data models needed. Inline interface:
  ```typescript
  interface ProfileFormData {
    name: string;
    email: string;
    address: string;
  }
  ```
- **API Endpoints**: None. This is frontend-only.
- **State Shape**: Local component state via `useState`:
  ```typescript
  const [formData, setFormData] = useState<ProfileFormData>(mockProfile);
  const [errors, setErrors] = useState<{ email?: string }>({});
  ```
- **Error Handling**: Email format validation error displayed inline below the email field. No network errors possible (no API calls).

## UI/UX Requirements

- **Layout**:
  - Page title: "Profile Settings" (matching `text-3xl font-bold tracking-tight text-white` pattern from DashboardPage)
  - Subtitle: "Manage your account information" (matching `text-slate-400` pattern)
  - Form card: `bg-slate-900/40 border border-slate-800 rounded-2xl p-6` (matching DashboardPage card pattern)
  - Form fields stacked vertically with `space-y-6`
  - Update button: full-width or right-aligned, indigo-600 styling matching existing button patterns
- **Styling**: Tailwind CSS utility classes only. Dark theme palette consistent with existing pages.
- **Responsive Behavior**: Form card should be readable on mobile. Use `max-w-2xl` for form container.
- **Interactions**:
  - Input focus: `focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500` (matching LoginPage pattern)
  - Button hover: `hover:bg-indigo-500` with `transition-colors`
  - Button disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
  - Error text: `text-rose-400 text-xs mt-1` (matching LoginPage pattern)
- **Icons**: `User` (for Name field), `Mail` (for Email field), `MapPin` (for Address field), `Save` or `Check` (for Update button) — all from `lucide-react`.

## Validation Rules

- **Name**: Required. Must not be empty or whitespace-only. Error: "Name is required."
- **Email**: Required. Must not be empty. Additionally, if non-empty, must match basic email format (contains `@` with text before and after, and a `.` in the domain). Error for empty: "Email is required." Error for invalid format: "Please enter a valid email address."
- **Address**: Required. Must not be empty or whitespace-only. Error: "Address is required."
- **Form-level**: Update button disabled until all fields pass validation. No cross-field validation needed.

## Edge Cases

1. **User clears a pre-filled field** — Update button becomes disabled immediately. Validation error appears for that field.
2. **User enters invalid email format** — Email validation error appears. Update button remains disabled.
3. **User enters valid email then clears it** — Email error changes from format error to required error. Button disabled.
4. **User clicks Update with all fields valid** — Success toast appears. Form values remain unchanged (no reset, no API call).
5. **User navigates away and returns** — Form resets to mock data (no persistence, per "out of scope" — no localStorage).
6. **User is not authenticated** — `ProtectedRoute` redirects to `/login`.
7. **User tabs through form with keyboard** — All inputs and button are focusable and operable via keyboard.

## Assumptions

1. The Settings page route will be `/settings` (not nested under `/dashboard/settings`), consistent with how `/dashboard` is a top-level protected route.
2. The Settings NavItem in the sidebar will use an `onClick` handler with `useNavigate` to route to `/settings`, since `NavItem` is currently a `<button>` element (not a `<Link>`).
3. The Settings page will be wrapped in `DashboardLayout` (same as DashboardPage) so the sidebar and header remain visible.
4. The `ToastProvider` already wraps `DashboardLayout`, so `useToast` is available inside `SettingsPage` without additional provider setup.
5. Form state is not persisted — navigating away and back resets to mock data. This aligns with the "frontend-only" scope and "no localStorage for profile data" constraint.
6. Email validation uses a simple regex check (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) rather than a full RFC-compliant validator, since no form validation library is in use.
7. The existing `NavItem` component in `DashboardLayout.tsx` will be extended with an optional `onClick` prop to support navigation, keeping it as a `<button>` element.
8. No active/highlight state is needed for the Settings nav item beyond the existing `active` prop pattern (Settings will not be `active` by default since Overview is the default active item).

## Open Questions

1. **Should the Settings nav item show an active state when on `/settings`?** — Currently only "Overview" has `active` set. Should this be dynamic based on route? (Product/UX decision)
2. **Should the form reset to mock data after a successful update, or retain the edited values?** — The story does not specify. Retaining edited values is more natural UX, but resetting confirms the "mock" nature. (Product decision — spec assumes values are retained.)
3. **Should the Settings page be accessible at `/settings` directly (typed URL), or only via sidebar navigation?** — Spec assumes direct URL access is allowed (standard route behavior). (Confirm if route should be sidebar-only.)

## Implementation Plan

### Phase 1: Route Registration & Navigation Setup
1. Modify `src/components/DashboardLayout.tsx`:
   - Ensure `useNavigate` is imported from `react-router-dom` (already imported per current codebase).
   - Add a `handleNavigateSettings` function that calls `navigate("/settings")`.
   - Add an `onClick` prop to the `NavItem` interface (optional, type `(() => void) | undefined`).
   - Wire the Settings `NavItem` to call `handleNavigateSettings` on click.
2. Modify `src/App.tsx`:
   - Import `SettingsPage` from `./pages/SettingsPage`.
   - Add a new `<Route>` for `/settings` wrapped with `ProtectedRoute` and `DashboardLayout`, following the same pattern as `/dashboard`.

### Phase 2: Settings Page Component
1. Create `src/pages/SettingsPage.tsx`:
   - Define `ProfileFormData` interface inline.
   - Define `mockProfile` constant with the specified values.
   - Define email validation regex constant.
   - Component uses `React.FC` type annotation.
   - State: `formData` (ProfileFormData), `errors` (partial record with email error).
   - Computed: `isFormValid` — returns true when name, email, address are all non-empty AND email matches format.
   - `handleInputChange` — updates formData for a given field, clears associated error.
   - `validateEmail` — validates email format, sets error if invalid.
   - `handleSubmit` — prevents default, validates all fields, shows success toast via `useToast`.
   - Render: page header, form card with three labeled inputs, Update button.
   - Each input: icon prefix (matching LoginPage pattern), controlled value, onChange handler, aria attributes for validation.
   - Email field: shows format error below input when applicable.
   - Update button: disabled when `!isFormValid`, styled with indigo-600.

### Phase 3: Polish & Accessibility
1. Verify all inputs have proper `id`, `htmlFor` labels, `aria-invalid`, and `aria-describedby` attributes.
2. Verify error messages have `role="alert"`.
3. Verify Update button has appropriate `aria-label` or visible text.
4. Verify keyboard navigation works (Tab order, Enter to submit).
5. Verify responsive layout on mobile (form card width, input sizing).

### Phase 4: Testing
1. Write component tests for `SettingsPage` (when Vitest + React Testing Library is configured):
   - Renders form with mock data pre-filled.
   - Shows exactly three fields.
   - Update button is disabled when any field is empty.
   - Update button is enabled when all fields are valid.
   - Shows email format error for invalid email.
   - Shows success toast on valid submission.

## Testing Strategy

- **Component Tests** (Vitest + React Testing Library, per governance):
  - Render `SettingsPage` and verify mock data is displayed in all three fields.
  - Clear a field and verify Update button becomes disabled.
  - Fill all fields with valid data and verify Update button becomes enabled.
  - Enter invalid email and verify error message appears.
  - Submit form with valid data and verify toast is called with correct message.
- **Integration Tests**:
  - Navigate from Dashboard to Settings via sidebar click, verify page renders.
  - Access `/settings` directly via URL, verify page renders (ProtectedRoute allows access when authenticated).
- **Edge Case Tests**:
  - Whitespace-only values in fields should be treated as empty.
  - Email with `@` but no domain should fail validation.
  - Rapid typing should not cause validation flicker.
- **Accessibility Tests**:
  - All inputs have associated labels.
  - Error messages are announced by screen readers (`role="alert"`).
  - Keyboard navigation covers all interactive elements.

## Risk Checklist

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| NavItem `onClick` prop conflicts with existing behavior | Low | Low | Add as optional prop; existing NavItem instances without `onClick` are unaffected |
| Email validation regex too permissive/restrictive | Medium | Low | Use simple, well-tested pattern; can be refined later |
| Settings page exceeds ~150 line limit | Medium | Low | Extract form field rendering into a co-located helper component if needed |
| Route protection gap (no real auth) | Low | Low | Existing `ProtectedRoute` already handles this at mock level; aligns with project gap #1 |
| Toast not visible if ToastProvider scope changes | Low | Medium | Verify ToastProvider still wraps DashboardLayout after route addition |

## Definition of Done

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
- [ ] No hardcoded secrets
- [ ] File naming follows convention (PascalCase for components)
- [ ] Imports are ordered and clean
- [ ] Component files under ~150 lines
- [ ] Accessibility basics covered (labels, aria attributes, keyboard navigation)
- [ ] No unrelated files modified
- [ ] `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, and `tailwind.config.js` are NOT modified
