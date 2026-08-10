# SAM-3: Add Pagination & Search in Users

## Description
Add pagination and search functionality to the Users page to improve usability when managing a growing list of users.

## Acceptance Criteria
1. Search input field
   - Positioned above the users table, aligned to the right or integrated into the header area
   - Filters users by name, email, or role
   - Case-insensitive matching
   - Updates results in real-time as user types
2. Pagination controls
   - Displayed below the users table
   - Shows page numbers (1, 2, 3, ...) and previous/next buttons
   - Highlights the current page with an indigo background
   - Disables previous button when on the first page
   - Disables next button when on the last page
3. Combined behavior
   - Search filters first, then pagination applies to the filtered results
   - Current page resets to 1 when search query changes
   - Shows "No users found" message when search yields no results
   - Displays total count (e.g., "Showing 1-10 of 50 users")

## Implementation Notes
- Add state for `searchQuery` (string) and `currentPage` (number)
- Calculate `filteredUsers` by filtering `users` array based on `searchQuery` against name, email, and role fields
- Calculate `paginatedUsers` by slicing `filteredUsers` for the current page
- Use a constant `ITEMS_PER_PAGE = 10`
- Calculate `totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)`
- Render `paginatedUsers` in the table body instead of `users`
- Derive page range for the "Showing X-Y of Z users" text

## UI Notes
- Search input should match the existing form input style (slate-800 background, slate-300 text, rounded-lg border, slate-400 placeholder)
- Pagination controls should be centered below the table with adequate spacing
- Use existing Tailwind CSS utility classes for consistency
- Maintain the dark theme styling (slate-900, slate-800, slate-400, slate-300, slate-200, slate-200, indigo-600, indigo-500)
- Use the `animate-in fade-in duration-200` animation pattern for page transitions
- Add a search icon (from lucide-react, e.g., `Search`) inside the search input

## Assumptions
1. Users are stored in component state (not fetched from an API)
2. Search filters by name, email, and role (all three fields)
3. Default pagination size is 10 users per page
4. Search is client-side and case-insensitive
5. Current page resets to 1 when search query changes
6. No debouncing is implemented for search (filters on every keystroke)
7. A "No users found" message is displayed when search yields no results
8. Full pagination is used (page numbers, prev/next) rather than just prev/next
9. The search input is placed in the same row as the "Add User" button in the header section

{"clarification": {"needed": false, "assumptions": [{"statement": "Users are stored in component state (not fetched from an API)", "risk": "low"}, {"statement": "Search filters by name, email, and role (all three fields)", "risk": "low"}, {"statement": "Default pagination size is 10 users per page", "risk": "low"}, {"statement": "Search is client-side and case-insensitive", "risk": "low"}, {"statement": "Current page resets to 1 when search query changes", "risk": "low"}, {"statement": "No debouncing is implemented for search (filters on every keystroke)", "risk": "low"}, {"statement": "A 'No users found' message is displayed when search yields no results", "risk": "low"}, {"statement": "Full pagination is used (page numbers, prev/next) rather than just prev/next", "risk": "low"}, {"statement": "The search input is placed in the same row as the 'Add User' button in the header section", "risk": "low"}]}}
