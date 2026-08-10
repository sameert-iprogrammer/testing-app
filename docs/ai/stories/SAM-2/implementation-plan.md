# SAM-2 Implementation Plan: Add User functionality

## Overview
This implementation adds an inline modal to the `UsersPage` listing, enabling users to create new user records. The feature reuses the dark-theme styling and validation patterns established in `SettingsPage` and `useProfileForm`. It updates local `mockUsers` state immutably, handles duplicate email validation, and provides immediate toast feedback.

## Resolved decisions
- **Role options**: Dropdown with fixed options (`Admin`, `Manager`, `User`).
- **Duplicate emails**: Block duplicate emails with inline error and toast notification.

## Files to Touch
- `src/hooks/useProfileForm.ts` (Modify)
- `src/pages/UsersPage.tsx` (Modify)

## Context Budget
- **Target files**: Only `UsersPage.tsx` and `useProfileForm.ts`.
- **Styling reference**: `src/pages/SettingsPage.tsx` provides the exact Tailwind classes for inputs, buttons, and error states (slate-900/40 backgrounds, indigo-600 primary buttons, red-400 error text).
- **Toast reference**: `src/components/Toast.tsx` provides the `useToast` hook contract (`showToast(message, type)`).
- **State reference**: The existing `mockUsers` array and `User` interface in `UsersPage.tsx` dictate the target state shape. No external API or backend context is required.

## Implementation Steps

### Step 1: Prepare Validation Helpers
1. Open `src/hooks/useProfileForm.ts`.
2. The file currently contains `validateRequired` and `validateEmail` helper functions. Export these at the module level so they can be imported directly into `UsersPage`:
   ```ts
   export function validateRequired(value: string, fieldName: string): string | undefined
   export function validateEmail(email: string): string | undefined
   ```
3. Ensure these functions are pure and do not depend on component state to guarantee they work correctly when moved outside `SettingsPage`.

### Step 2: Add "Add User" Button & Modal State
1. Open `src/pages/UsersPage.tsx`.
2. Import `Plus` from `lucide-react`.
3. Locate the page heading area (`<h1>Users</h1>`) and add an "Add User" button in the same flex container. Apply consistent spacing and typography.
4. Declare the following state variables inside the `UsersPage` component:
   - `isModalOpen` (boolean, default `false`)
   - `newUser` (object matching `User` shape minus `id`, default `{ name: '', email: '', role: '', status: 'Active' as User['status'] }`)
   - `errors` (Record<string, string | undefined>, default `{}`)
5. Import `useToast` from `../components/Toast` and destructure `showToast`.

### Step 3: Build the Modal UI
1. Conditionally render a modal overlay when `isModalOpen` is `true`.
2. **Backdrop**: A `fixed inset-0` div with `bg-black/50` that closes the modal when clicked (`onClick={() => setIsModalOpen(false)}`).
3. **Modal Container**: A centered `div` with:
   - `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg`
   - `bg-slate-900/40 border border-slate-800 rounded-2xl p-6`
   - `animate-in fade-in duration-700` (matching other pages' entrance animations)
4. **Header**: Add an `<h2>` for "Add New User" and a `Cancel` button that resets the form and closes the modal.

### Step 4: Implement Form Fields
1. Replicate the input styling from `SettingsPage.tsx` (slate-900 background, border-slate-800, rounded-lg, white text, placeholder styling).
2. Add controlled inputs for each field, applying the `newUser` state to `value` and an `onChange` handler that updates `newUser`.
   - **Name**: `<input type="text" icon={<User />} />` (inline `lucide-react` icons for visual consistency)
   - **Email**: `<input type="email" icon={<Mail />} />`
   - **Role**: `<select>` dropdown with options: `Admin`, `Manager`, `User`.
   - **Status**: `<select>` dropdown with options: `Active`, `Inactive`, `Deactivated`. Default to `"Active"`.
3. **Inline Errors**: Below each input, conditionally render `errors[fieldName]` in `text-red-400 text-sm`.

### Step 5: Validation & Submission Logic
1. **Blur Validation**: Add `onBlur` handlers to inputs that call `validateRequired` or `validateEmail` and update the `errors` state for the specific field.
2. **Form Validity**: Compute `isFormValid` by checking that `errors` has no truthy values and that all `newUser` fields are non-empty.
3. **Submit Handler**:
   - Run validation immediately on submit to catch edge cases not caught by blur.
   - **Duplicate Check**: Iterate through `mockUsers`. If `newUser.email` matches an existing email, set `errors.email = 'Email already exists'` and call `showToast('Email already exists', 'error')`. Return early.
   - **Success Path**:
     - Generate a unique ID: `const id = crypto.randomUUID() || Date.now().toString()`
     - Update state immutably: `setMockUsers(prev => [...prev, { id, ...newUser }])`
     - Reset form: `setNewUser({ name: '', email: '', role: '', status: 'Active' as User['status'] })`
     - Clear errors: `setErrors({})`
     - Close modal: `setIsModalOpen(false)`
     - Show success toast: `showToast('User added successfully', 'success')`

### Step 6: Cleanup & Accessibility
1. Ensure the `Cancel` button resets the form state (`newUser`, `errors`) and closes the modal.
2. Verify that the new user appears in the table immediately with the existing `StatusBadge` component. No changes to `StatusBadge` are required.
3. If possible, add `tabIndex={0}` and `onKeyDown` handling to the modal container to support the `Escape` key for closing, following standard modal patterns.

## Risks
- **State Mutation**: Ensure `mockUsers` is updated immutably using the spread operator (`[...prev, newEntry]`) to trigger React re-renders correctly.
- **Validation Overlap**: Ensure `validateRequired` and `validateEmail` do not conflict if triggered on the same field simultaneously. The existing `useProfileForm` pattern overwrites the specific field's error key, which is safe.
- **Icon Imports**: Verify that `lucide-react` exports `UserCog` or `BadgeCheck` for the Role/Status icons to match the visual language of `SettingsPage`. If unavailable, fall back to `User` and `Activity`.

```json
{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "The `validateRequired` and `validateEmail` functions in `useProfileForm.ts` are pure utility functions that do not depend on the `ProfileFormData` state, so they can be safely exported for reuse in `UsersPage`.", "risk": "low"}, {"statement": "The `StatusBadge` component is locally defined within `UsersPage.tsx` and will be reused as-is for the new user's status column.", "risk": "low"}, {"statement": "Generating user IDs via `crypto.randomUUID()` or `Date.now().toString()` is acceptable since no unique ID constraints are specified beyond the `id: string` type.", "risk": "low"}]}}
```
