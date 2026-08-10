# SAM-4: Change Password — Feature Specification

## 1. Story

- **JIRA Key**: SAM-4
- **Title**: Change Password
- **Description**: Give change password in the Profile settings
- **Priority**: P3
- **Story Type**: Feature

## 2. User Story

> **As a** logged-in user managing their profile settings,
> **I want to** change my account password from the Profile Settings page,
> **so that** I can maintain account security by updating my credentials when needed.

## 3. Scope

### In Scope
- A "Change Password" section within the existing Profile Settings page (`src/pages/SettingsPage.tsx`)
- A form with fields for current password, new password, and confirm new password
- Client-side validation before submission
- Toast notification on successful password change
- Toast notification on failure (e.g., incorrect current password)

### Out of Scope
- Email verification before password change
- Multi-factor authentication integration
- Password history enforcement
- Password strength meter (visual)
- Session invalidation upon password change
- Password reset via email (handled as a separate story)

## 4. Acceptance Criteria

1. **Password Change Form Present**
   - The Profile Settings page includes a "Change Password" section/card below the existing profile form.
   - The section is visually distinct but consistent with the existing design language (dark theme, indigo accents, rounded cards).

2. **Form Fields**
   - Three input fields are present:
     - **Current Password** (type="password", required)
     - **New Password** (type="password", required, min 8 characters)
     - **Confirm New Password** (type="password", required, must match New Password)
   - Each field has an appropriate label and placeholder.
   - A password visibility toggle (eye icon) is available for each field (optional enhancement).

3. **Validation Rules**
   - **Current Password**: Required. Submitted value is verified against the mock credentials (`Admin@123`).
   - **New Password**: Required, minimum 8 characters, must contain at least one uppercase letter, one lowercase letter, one number, and one special character (matching the existing mock password complexity).
   - **Confirm New Password**: Required, must exactly match the New Password field.
   - Validation errors display inline below each field in red text.

4. **Submit Behavior**
   - The "Change Password" button is disabled until all fields pass validation.
   - On successful validation:
     - Current password is verified against the mock current password (`Admin@123`).
     - If correct, the new password is stored (in mock auth state) and a success toast appears: "Password updated successfully."
     - The form resets to empty fields.
   - If current password is incorrect:
     - An error toast appears: "Current password is incorrect."
   - If validation fails (e.g., new password doesn't meet complexity):
     - The form does not submit; inline errors are displayed.

5. **Error Handling**
   - If the backend (mock API) is unavailable or returns a 500 error, display a generic error toast: "Failed to update password. Please try again."
   - The form state is preserved on error (fields remain populated with user input).

6. **Accessibility**
   - All form fields have associated `<label>` elements.
   - Error messages are programmatically linked to their fields via `aria-describedby`.
   - The form is navigable via keyboard (Tab order).

## 5. UI/UX Notes

### Design Language
- Follow the existing SettingsPage design: dark slate backgrounds (`bg-slate-900/40`), indigo accents (`bg-indigo-600`), rounded corners (`rounded-2xl`), and white text.
- The Change Password section should be a separate card below the Profile Settings form, maintaining consistent spacing (`space-y-6` within the card).

### Visual Structure
```
┌──────────────────────────────────────┐
│  Profile Settings                    │
│  Manage your account information     │
├──────────────────────────────────────┤
│  [Existing Profile Form Card]        │
│  ┌──────────────────────────────┐    │
│  │ Name: [input]                │    │
│  │ Email: [input]               │    │
│  │ Address: [input]             │    │
│  │ [Update Profile button]      │    │
│  └──────────────────────────────┘    │
├──────────────────────────────────────┤
│  Change Password                     │
│  ┌──────────────────────────────┐    │
│  │ Current Password: [input]    │    │
│  │ New Password:     [input]    │    │
│  │ Confirm Password: [input]    │    │
│  │ [Change Password button]     │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

### Icons
- Use `lucide-react` for icons (consistent with existing project):
  - `Lock` icon for the Change Password section header
  - `Eye` / `EyeOff` icons for password visibility toggles (if implemented)

## 6. Implementation Notes

### Architecture
- **New Hook**: Create `src/hooks/usePasswordForm.ts` (parallel to `useProfileForm`) to manage password form state, validation, and submission logic.
  - Exports: `formData` (`{ currentPassword: string, newPassword: string, confirmPassword: string }`), `errors`, `isFormValid`, `handleInputChange`, `validateCurrentPassword`, `validateNewPassword`, `validateConfirmPassword`, `setFieldError`, `handleSubmit`
- **Integration**: Add the password form to `SettingsPage.tsx` as a second `<form>` element (or two separate forms within one container) below the profile form.
- **Validation Regex**: Use the same email-style regex pattern from `useProfileForm` as inspiration, but create a dedicated `PASSWORD_REGEX` for complexity:
  ```typescript
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  ```

### State Management
- Store the "updated" password in the mock auth context (`useAuth` hook). Since this is a mock, simply update the `MOCK_PASSWORD` variable or store it in a local state within `useAuth`.
- The `useAuth` hook should expose a `changePassword(newPassword: string)` method for the password form to call.

### Reusability
- The `FormField` component used in `SettingsPage.tsx` should be reused for password fields.
- Ensure `FormField` supports `type="password"` and a `showPasswordToggle` prop for visibility toggling (if implemented).

### Testing Considerations
- Unit tests for `usePasswordForm` hook:
  - Validation passes for valid password.
  - Validation fails for short password.
  - Validation fails for missing complexity requirements.
  - Submit succeeds with correct current password.
  - Submit fails with incorrect current password.
- Integration tests for `SettingsPage`:
  - Render password form.
  - Submit with valid data → toast appears.
  - Submit with invalid data → inline errors appear.

## 7. Data Model

### Password Form Data
```typescript
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
```

### Auth Context Extension
```typescript
interface UseAuthReturn {
  // existing fields...
  changePassword: (newPassword: string) => Promise<boolean>;
}
```

## 8. Error States

| Scenario | Error Message | Display |
|----------|--------------|---------|
| Current password incorrect | "Current password is incorrect." | Toast (error type) |
| New password too short (< 8 chars) | "New password must be at least 8 characters." | Inline field error |
| New password missing complexity | "Password must include uppercase, lowercase, number, and special character." | Inline field error |
| Passwords don't match | "New password and confirm password must match." | Inline field error |
| API/network failure | "Failed to update password. Please try again." | Toast (error type) |
| All valid, submit succeeds | "Password updated successfully." | Toast (success type) |

## 9. Assumptions

1. **Mock Password Storage**: The new password is stored in the mock auth state (`useAuth`) rather than calling an external API. This is consistent with the existing mock implementation in `useAuth.ts`.
2. **Password Complexity**: The new password must match the complexity requirements of the existing mock password (`Admin@123`), which requires uppercase, lowercase, digit, and special character.
3. **Existing Form Retained**: The existing Profile Settings form (name, email, address) is NOT modified; the Change Password section is a new, separate form/card.
4. **No Session Invalid**: Changing the password does NOT invalidate the current session or require re-login.
5. **FormField Reuse**: The existing `FormField` component in `SettingsPage.tsx` can be reused for password inputs. If it requires modification (e.g., to support password visibility toggles), it will be updated accordingly.

## 10. Open Questions

1. **Password Visibility Toggle**: Should each password field include an eye icon to show/hide the password? (Decision impacts UI complexity and accessibility.)
2. **API Integration**: Is there a mock API endpoint to be created for password change, or will the change be handled entirely in the `useAuth` mock state? (Decision impacts implementation scope.)
3. **Form Separation**: Should the Change Password form be a separate `<form>` element from the profile form, or should all fields be in a single form? (Decision impacts form validation and submission behavior.)

---

{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "Should each password field include an eye icon to show/hide the password?", "whyItMatters": "This changes the UI component requirements and accessibility considerations. Without it, users have no way to verify what they typed, which is a common UX expectation for password fields.", "impactIfWrong": "If omitted when expected, users may enter wrong passwords due to typos, increasing support requests. If included when not expected, adds unnecessary complexity.", "options": [{"key": "opt_a", "label": "Include visibility toggle (eye icon)", "consequence": "Requires updating the FormField component to support a showPassword prop, and adding state for each field's visibility."}, {"key": "opt_b", "label": "No visibility toggle", "consequence": "Simpler implementation, but users must rely on their memory or paste to verify password entry."}], "default": "opt_a", "allowFreeText": true, "blocking": true}, {"id": "q2", "question": "Should the Change Password form be a separate <form> element from the profile form, or should all fields be in a single form?", "whyItMatters": "This affects form validation scope, submission behavior, and accessibility. Separate forms allow independent validation and submission of each section.", "impactIfWrong": "If in a single form, submitting the profile form would also attempt password validation, causing confusion. If in separate forms, users can update profile or password independently.", "options": [{"key": "opt_a", "label": "Separate <form> element", "consequence": "Allows independent validation and submission of profile and password forms. Recommended for clarity."}, {"key": "opt_b", "label": "Single <form> element", "consequence": "All fields validated on any submit. Risk of confusing error messages if user only wants to update profile."}], "default": "opt_a", "allowFreeText": true, "blocking": true}], "assumptions": [{"statement": "The new password is stored in the mock auth state (useAuth) rather than calling an external API, consistent with the existing mock implementation.", "risk": "low"}, {"statement": "Password complexity requires uppercase, lowercase, digit, and special character (matching Admin@123 pattern).", "risk": "low"}, {"statement": "Existing Profile Settings form is retained unchanged; Change Password is a new separate section.", "risk": "low"}, {"statement": "Changing password does NOT invalidate the current session or require re-login.", "risk": "low"}]}}
