## Context Budget
The implementation is strictly scoped to `src/pages/UsersPage.tsx`. All required state management patterns (e.g., `useState`), type definitions (`User` interface), and styling conventions (Tailwind CSS, dark slate/indigo theme, `lucide-react` icons) are already established in this file and the broader repository. No external API calls, additional files, or state management libraries are required.

## Files to Touch
- Modify `src/pages/UsersPage.tsx`

## Implementation Plan
1. **Update Imports**:
   - Add `Search` to the existing `lucide-react` import statement in `src/pages/UsersPage.tsx`.
   - If not already present, ensure `useMemo` is imported from `react` (standard practice for derived state filtering).

2. **Add State and Constants**:
   - Define a constant `ITEMS_PER_PAGE = 10`.
   - Add `const [searchQuery, setSearchQuery] = useState('');`
   - Add `const [currentPage, setCurrentPage] = useState(1);`
   - Update the `searchQuery` setter to reset pagination: `setSearchQuery((e) => { setSearchQuery(e); setCurrentPage(1); });` or handle the reset via a `useEffect` watching `searchQuery`.

3. **Calculate Filtered and Paginated Data**:
   - Derive `filteredUsers` by filtering the existing `users` state array (assuming it is named `users` based on the context of `handleNewUserChange`) where the `name`, `email`, or `role` fields contain the lowercased `searchQuery`.
   - Derive `paginatedUsers` by slicing `filteredUsers`:
     ```typescript
     const paginatedUsers = filteredUsers.slice(
       (currentPage - 1) * ITEMS_PER_PAGE,
       currentPage * ITEMS_PER_PAGE
     );
     ```
   - Calculate `totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)`.

4. **Implement "No Users Found" Handling**:
   - When rendering the table body, check if `filteredUsers.length === 0`.
   - If true, display a centered message (e.g., "No users found") instead of the table rows. Use the existing dark theme styling.

5. **Update the Header (Search Input)**:
   - Locate the existing header area containing the "Add User" button.
   - Insert the search input in the same row. 
   - Apply the styling pattern matching the existing form inputs (`src/pages/SettingsPage.tsx` form style):
     - `className`: `bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm pl-10 w-64`
   - Add the `<Search />` icon from `lucide-react` positioned absolutely inside the input container (`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500`).

6. **Update the Table Body**:
   - Change the data source for the `<tbody>` to iterate over `paginatedUsers` instead of the full `users` array.

7. **Add Pagination Controls**:
   - Render a pagination footer below the table.
   - Display a summary text (e.g., `Showing 1-${Math.min(ITEMS_PER_PAGE, filteredUsers.length)} of ${filteredUsers.length} users`).
   - Add "Previous" and "Next" buttons:
     - Disable "Previous" when `currentPage === 1`.
     - Disable "Next" when `currentPage === totalPages` (or if `totalPages === 0`).
   - Render page number buttons (e.g., 1, 2, 3...). 
   - Highlight the active page with an indigo background (`bg-indigo-600`) and ensure the current page is disabled to prevent redundant clicks.
   - Center the controls and apply the `animate-in fade-in duration-200` animation pattern for transitions where applicable.

## Open Questions
N/A - All ambiguities have been resolved via the assumptions below.

{"clarification": {"needed": false, "assumptions": [{"statement": "The user list is stored in a `useState` hook within `UsersPage.tsx` named `users`.", "risk": "low"}, {"statement": "The header containing the 'Add User' button uses a flexbox layout.", "risk": "low"}, {"statement": "The `users` array contains objects strictly conforming to the `User` interface defined in `src/pages/UsersPage.tsx`.", "risk": "low"}]}}
