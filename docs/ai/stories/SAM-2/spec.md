# SAM-2: Add User functionality

## Story
- **JIRA Key**: SAM-2
- **Title**: Add User functionality
- **Description**: Add “Add” user functionality in the listing

## Overview
Add the ability to create new users from the Users listing page. This includes a modal form to input user details, validation logic matching the existing SettingsPage pattern, and state updates to display the newly added user in the table.

## Acceptance Criteria
1. UsersPage displays an "Add User" button (with a Plus icon from lucide-react) next to the page heading
2. Clicking "Add User" opens a centered modal dialog with a form
3. The form collects the following fields matching the `User` interface:
   - Name (text input, required)
   - Email (email input, required, validated format)
   - Role (dropdown select, required)
   - Status (dropdown select with Active/Inactive/Deactivated, required; defaults to Active)
4. Form validation follows the SettingsPage/useProfileForm pattern:
   - Inline error messages appear below invalid fields
   - Submit button is disabled until all required fields are valid
   - Email format validation rejects malformed addresses
5. On successful submission:
   - The new user object is added to the local `mockUsers` state
   - The modal closes
   - A success toast notification appears via `useToast`
   - The table updates to include the new user
6. If validation fails or an error occurs:
   - Inline errors remain visible
   - An error toast is displayed if submission fails
7. UI styling matches the existing app:
   - Modal backdrop is semi-transparent with dark theme
   - Form container uses `bg-slate-900/40 border border-slate-800 rounded-2xl`
   - Input fields follow the same styling as SettingsPage
   - Primary button uses `bg-indigo-600 hover:bg-indigo-500` pattern
   - Submit button disabled state uses `disabled:opacity-50 disabled:cursor-not-allowed`

## Implementation Notes
- **State Management**: Add `useState` for `modalOpen`, `formData`, and `formErrors` within UsersPage
- **Form Hook**: Either extract validation logic to a new hook (e.g., `useAddUserForm`) or implement inline following `useProfileForm` patterns
- **Validation**: Reuse the same email regex and required-field checks from `useProfileForm`
- **Toast**: Use `useToast()` hook from `Toast.tsx` for success/error feedback
- **Modal**: Implement inline (no third-party modal library); use absolute positioning, backdrop, and focus management
- **Data**: Update `mockUsers` array via state setter; spread previous users and append the new object
- **ID Generation**: Generate a unique ID for the new user (e.g., `crypto.randomUUID()` or incrementing counter)

## Technical Approach
1. **Add state to UsersPage**:
   ```ts
   const [modalOpen, setModalOpen] = useState(false);
   const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' as User['status'] });
   const [errors, setErrors] = useState<Record<string, string | undefined>>({});
   ```
2. **Create validation function**:
   - `validateRequired(value, fieldName)` → error message or undefined
   - `validateEmail(email)` → error message or undefined
   - Run on blur and on submit
3. **Build modal JSX**:
   - Backdrop `<div>` with `onClick={() => setModalOpen(false)}`
   - Centered card with form
   - Submit button calls validation, then updates state and closes modal
   - Cancel button clears errors and closes modal
4. **Update mockUsers**:
   - `setMockUsers(prev => [...prev, { id: generateId(), ...newUser }])`
5. **Cleanup on mount/cancel**: Reset form fields

## UI Notes
- Layout: The "Add User" button should sit in the same flex container as the existing `<h1>Users</h1>` heading
- Modal dimensions: `max-w-lg` width, vertically centered
- Field icons: Consider using lucide-react icons similar to SettingsPage (`User`, `Mail`, `MapPin` equivalent for Role/Status)
- StatusBadge: Reuse for the new user in the table row; no changes needed to the component
- Animation: Optional fade-in for modal consistent with `animate-in fade-in duration-700` pattern used elsewhere

## Assumptions
1. The **Role** field uses a dropdown with predefined options (Admin, Manager, User, etc.) rather than free text. This follows the existing pattern of controlled selections in the app and simplifies validation.
2. **Status defaults to "Active"** when creating a new user. This aligns with the `User['status']` type union and the common convention of new users being active by default.
3. Adding a user updates **local state only** (mock data). No API calls or backend integration are required for this story, consistent with the current mock-based implementation.
4. The **modal** is implemented inline with a backdrop overlay, not a separate route or side panel. This matches the scope of a lightweight action in a listing page.
5. A simple unique ID generator (e.g., `Date.now().toString()` or random UUID) is sufficient for new user IDs; no sequence or naming convention is required.
6. The existing `StatusBadge` component is reused without modification to display the status of newly added users.

## Open Questions
1. What are the predefined options for the Role field when adding a user? (See Q1)
2. Should the system prevent adding a user with an email that already exists in the mock data? (See Q2)

```json
{
  "clarification": {
    "needed": true,
    "questions": [
      {
        "id": "q1",
        "question": "What are the valid predefined options for the Role field when adding a user?",
        "whyItMatters": "The existing User interface defines role as a string but does not constrain allowed values. The implementation must choose between a dropdown with fixed options or a free-text input, which significantly changes the UI component and validation logic.",
        "impactIfWrong": "Using the wrong approach could create invalid role values, require rework of the form component, or break downstream filtering/sorting that assumes fixed role values.",
        "options": [
          {
            "key": "opt_a",
            "label": "Dropdown with fixed options (e.g., Admin, Manager, User)",
            "consequence": "User selects from predefined roles; easier validation, consistent data, simpler implementation"
          },
          {
            "key": "opt_b",
            "label": "Free text input",
            "consequence": "User types any role; more flexibility but requires additional validation and risk of inconsistent data"
          }
        ],
        "default": "opt_a",
        "allowFreeText": false,
        "blocking": true
      },
      {
        "id": "q2",
        "question": "Should the system prevent adding a user with an email that already exists in the mock data?",
        "whyItMatters": "Duplicate email handling affects both validation logic and user experience. Blocking duplicates enforces data integrity; allowing them simplifies implementation but may cause confusion.",
        "impactIfWrong": "Allowing duplicates could lead to ambiguous user records or require duplicate-checking logic to be added later; blocking without a clear error message frustrates users.",
        "options": [
          {
            "key": "opt_a",
            "label": "Block duplicate emails with inline error and toast",
            "consequence": "User sees clear error, must use a different email; enforces unique constraint"
          },
          {
            "key": "opt_b",
            "label": "Allow duplicate emails",
            "consequence": "No additional validation; simpler implementation but potential data integrity issues"
          }
        ],
        "default": "opt_a",
        "allowFreeText": false,
        "blocking": true
      }
    ],
    "assumptions": [
      {
        "statement": "The modal will be implemented inline with a semi-transparent backdrop and centered card, using the existing dark theme styling (slate-900/40, slate-800 borders).",
        "risk": "low"
      },
      {
        "statement": "Adding a user updates local state only (mock data via setMockUsers); no API calls or backend integration are required for this story.",
        "risk": "low"
      },
      {
        "statement": "The Status field defaults to 'Active' when creating a new user.",
        "risk": "low"
      },
      {
        "statement": "The form requires Name, Email, Role, and Status fields, matching the existing User interface definition.",
        "risk": "low"
      },
      {
        "statement": "A simple ID generator (Date.now().toString() or crypto.randomUUID()) is sufficient for new user IDs; no specific sequence or naming convention is enforced.",
        "risk": "low"
      }
    ]
  }
}
```
