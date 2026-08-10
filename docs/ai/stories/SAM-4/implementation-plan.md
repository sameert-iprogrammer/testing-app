# Implementation Plan: SAM-4 - Change Password

## Resolved Decisions
- **Password Visibility Toggle**: Include visibility toggle (eye/eye-off icon) for all password fields.
- **Form Structure**: Separate `<form>` element for the password change form, independent from the profile form, allowing independent validation and submission.

## Assumptions
1. **`FormField` Locality**: The `FormField` component used in `SettingsPage.tsx` is defined locally within that file (not imported). It will be updated inline to support password visibility toggles.
2. **Mock State**: The application uses in-memory mock state. The `useAuth` hook will store `currentPassword` with a default value of `Admin@123`. No network requests or external APIs are called; success/failure is determined purely by client-side state comparison.
3. **Network Failure Simulation**: Since the spec treats backend unavailability as a P3 edge case and the app is fully mocked, the implementation will not simulate network failures or latency. Only the "incorrect current password" client-side failure is implemented.
4. **Icon Mapping**: Password input fields will use the `Key` icon from `lucide-react` to match the existing `User`, `Mail`, and `MapPin` icon pattern in the profile form.

## Context Budget
- Focus exclusively on three files: `src/hooks/useAuth.ts`, `src/hooks/usePasswordForm.ts`, and `src/pages/SettingsPage.tsx`.
- Rely on existing project conventions: Tailwind utility classes (`bg-slate-900/40`, `border-slate-800`, `text-slate-400`, `bg-indigo-600`), `lucide-react` for icons, and the existing `useToast` context pattern.
- Do not modify routing, layout, or auth flow outside the explicit password change logic.

## Files to Touch
- `src/hooks/useAuth.ts` (Modify) - Extend auth state with password tracking and `changePassword` method.
- `src/hooks/usePasswordForm.ts` (Create) - New hook for password form state, validation logic, and submission handling.
- `src/pages/SettingsPage.tsx` (Modify) - Update local `FormField` component for password toggles, import new hook, and render the password change section.

## Implementation Steps

### Step 1: Extend `useAuth` with Password Change Logic
- **File**: `src/hooks/useAuth.ts`
- **Action**:
  - Add `currentPassword: string` to the `AuthState` interface (default value: `'Admin@123'`).
  - Add `changePassword: (newPassword: string) => Promise<boolean>` to the `UseAuthReturn` interface.
  - Implement `changePassword` inside the hook:
    - Accept `newPassword`.
    - Return a `Promise<boolean>`.
    - Resolve `true` if `newPassword` matches `state.currentPassword` (mock success).
    - Resolve `false` if `newPassword` does not match `state.currentPassword` (mock failure for incorrect current password).
  - Export the updated hook.

### Step 2: Create `usePasswordForm` Hook
- **File**: `src/hooks/usePasswordForm.ts` (New)
- **Action**:
  - Define interfaces: `PasswordFormData` (`currentPassword`, `newPassword`, `confirmPassword`) and `PasswordErrors` (`currentPassword?`, `newPassword?`, `confirmPassword?`).
  - Define constant: `const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;`
  - Create `usePasswordForm()` hook:
    - State: `formData` (defaults to empty strings), `errors` (empty object), `isFormValid`.
    - `isFormValid` derives from: all fields non-empty, `PASSWORD_REGEX.test(formData.newPassword)`, and `formData.newPassword === formData.confirmPassword`.
    - `handleInputChange(field: keyof PasswordFormData, value: string)`: updates `formData` and clears corresponding error.
    - `validateNewPassword(value)`: returns error string if length < 8 or fails regex; otherwise `undefined`.
    - `validateConfirmPassword(value)`: returns error string if `value !== formData.newPassword`; otherwise `undefined`.
    - `setFieldError(field, error)`: updates `errors` map.
    - `handleSubmit(e, onPasswordChange, showToast)`:
      - `e.preventDefault()`.
      - Run validation on all three fields. Collect errors into `newErrors`. If any exist, call `setFieldError` for each and return.
      - Call `onPasswordChange(formData.currentPassword, formData.newPassword)`.
      - On `true`: call `showToast('Password updated successfully.', 'success')`, reset `formData` to empty strings, clear `errors`.
      - On `false`: call `showToast('Current password is incorrect.', 'error')`.

### Step 3: Update `FormField` in `SettingsPage.tsx` for Password Toggles
- **File**: `src/pages/SettingsPage.tsx`
- **Action**:
  - Locate the local `FormField` component definition.
  - Extend its props interface to accept optional `showPassword?: boolean` and `onTogglePassword?: () => void`.
  - Modify the input rendering logic:
    - If `type === "password"`, set `<input type={showPassword ? "text" : "password"} ... />`.
    - Render an interactive icon container to the right of the input when `showPassword` and `onTogglePassword` are provided.
    - Use `Eye` icon when `showPassword` is false (click to show), and `EyeOff` icon when `showPassword` is true (click to hide).
    - Apply consistent Tailwind styling for the toggle icon (e.g., `text-slate-400 hover:text-slate-200 cursor-pointer mr-3`).
    - Ensure `id` and `aria-describedby` attributes correctly link to the error message container below.

### Step 4: Integrate Password Form into `SettingsPage.tsx`
- **File**: `src/pages/SettingsPage.tsx`
- **Action**:
  - Import necessary dependencies: `usePasswordForm` from `../hooks/usePasswordForm`, `useAuth` from `../hooks/useAuth`, and icons `Lock`, `Key`, `Eye`, `EyeOff` from `lucide-react`.
  - Destructure `changePassword` from `useAuth` and `showToast` from `useToast`.
  - Call `const { formData, errors, isFormValid, handleInputChange, validateNewPassword, validateConfirmPassword, setFieldError, handleSubmit } = usePasswordForm();`.
  - Add state for password visibility inside the component:
    ```typescript
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    ```
  - Insert a new card section directly below the existing profile form's closing `</div>`:
    - Wrapper: `<div className="max-w-2xl">`
    - Card: `<form onSubmit={(e) => handleSubmit(e, changePassword, showToast)} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">`
    - Header: `<h2 className="text-xl font-semibold flex items-center gap-2 text-white"><Lock className="h-5 w-5" /> Change Password</h2>`
    - Input 1 (Current Password): `<FormField id="currentPassword" label="Current Password" type="password" value={formData.currentPassword} placeholder="Enter current password" icon={<Key />} showPassword={showCurrentPassword} onTogglePassword={() => setShowCurrentPassword(p => !p)} error={errors.currentPassword} onChange={(v) => handleInputChange('currentPassword', v)} onBlur={() => { /* optional manual validation */ }} />`
    - Input 2 (New Password): `<FormField id="newPassword" label="New Password" type="password" value={formData.newPassword} placeholder="Enter new password" icon={<Key />} showPassword={showNewPassword} onTogglePassword={() => setShowNewPassword(p => !p)} error={errors.newPassword} onChange={(v) => handleInputChange('newPassword', v)} onBlur={() => { const err = validateNewPassword(formData.newPassword); if(err) setFieldError('newPassword', err); }} />`
    - Input 3 (Confirm Password): `<FormField id="confirmPassword" label="Confirm New Password" type="password" value={formData.confirmPassword} placeholder="Confirm new password" icon={<Key />} showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(p => !p)} error={errors.confirmPassword} onChange={(v) => handleInputChange('confirmPassword', v)} onBlur={() => { const err = validateConfirmPassword(formData.confirmPassword); if(err) setFieldError('confirmPassword', err); }} />`
    - Button: `<button type="submit" disabled={!isFormValid} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors"><Lock className="h-4 w-4" /> Change Password</button>`
    - Close tags for form, card wrapper, and max-width container.

## Verification & Acceptance Criteria
1. **Password Change Form Present**: New section renders below the profile form with matching dark theme, rounded corners, and consistent spacing.
2. **Form Fields**: Three password inputs with labels, placeholders, and eye toggles that switch between text and password types.
3. **Validation Rules**: 
   - Current password triggers error if not `Admin@123` on submit.
   - New password requires 8+ chars, uppercase, lowercase, digit, special character (`PASSWORD_REGEX`).
   - Confirm password must exactly match new password.
   - Inline red error messages appear below fields on validation failure.
4. **Submit Behavior**: Button remains disabled until `isFormValid` is true. Success clears form and shows success toast. Mismatch shows error toast. Form preserves input on error.
5. **Accessibility**: All inputs have associated labels, `aria-describedby` links to errors via `FormField`, and full keyboard navigation.

## Risks & Edge Cases
- **FormField Controlled State**: The password visibility state is managed at the `SettingsPage` level, but the `FormField` component itself handles the visual toggle. Ensure the `type` prop passed to `FormField` defaults to `"password"` and is correctly overridden by the visibility state inside `FormField`.
- **Regex Strictness**: `PASSWORD_REGEX` must not reject valid common passwords while still enforcing all four complexity requirements. The provided regex handles this, but edge cases with spaces or rare special characters should be noted if reported.
- **Form Reset on Error**: If the mock `changePassword` fails, the `handleSubmit` function must *not* clear the form inputs, preserving user data for correction.
