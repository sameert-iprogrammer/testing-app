# SAM-6: Notifications panel

## Story Metadata
- **JIRA Key:** SAM-6
- **Title:** Notifications panel
- **Description:** On notification icon click, show notification panel with mock notifications

## Objective
Implement a static notification panel in the application header that toggles on icon click and displays mock notification data, establishing the UI foundation for future dynamic notification features.

## Acceptance Criteria
1. **Header Icon Placement:** The dashboard header contains a bell/notification icon.
2. **Toggle Visibility:** Clicking the notification icon toggles the visibility of the notification panel (open when hidden, close when open).
3. **Mock Data Rendering:** The panel displays a list of mock notifications containing at least a title, timestamp, and message/type.
4. **Static Display:** Clicking or interacting with individual notification items does not alter their visual state (e.g., no "mark as read" logic).
5. **Dismissal:** The panel can be dismissed by clicking outside the panel area or clicking the notification icon again.
6. **Styling Consistency:** The panel UI and typography align with the existing Tailwind CSS design system and `lucide-react` iconography.

## Requirements & Features
### Data Structure
- Mock notifications will be an array of objects in local state.
- Fields: `id` (string), `title` (string), `message` (string), `timestamp` (string), `type` (string, e.g., 'info', 'alert').

### UI/UX
- **Anchor:** The panel is anchored to the header/notification icon.
- **Dropdown Style:** Uses a dropdown/popover layout with a scrollable list if the mock data exceeds the viewport height.
- **Icons:** Utilize `lucide-react` for notification icons (e.g., `Bell`, `Info`, `AlertCircle`).

### Component Architecture
- **Placement:** Integrate into `src/components/DashboardLayout.tsx` (specifically within `DashboardHeader`).
- **Panel Component:** Implement a `NotificationPanel` component to handle the dropdown logic and mock data rendering.
- **State Management:** Local React state (`useState`) for the `isOpen` boolean of the panel.

## UI Notes
- Match the existing `DashboardLayout.tsx` header layout (flexbox, gap, padding).
- Use Tailwind for absolute positioning of the dropdown panel relative to the icon.
- Ensure sufficient `z-index` to float above other dashboard content.
- Use existing font families and text utilities from `tailwind.config.js`.

## Implementation Notes
- Reuse the `mockReports` data pattern from `src/pages/ReportsPage.tsx` for defining the `mockNotifications` array.
- Use `lucide-react@^1.14.0` for the bell icon (`Bell` from `lucide-react`).
- The panel should not trigger any API calls or side effects; it is strictly a UI and mock-data demonstration.
- Add a visual divider or "No notifications" state placeholder if the array is empty (though mock data will be pre-populated).

## Resolved Decisions
- **Question:** Should clicking a notification item mark it as read visually within the panel?
- **Answer:** No, static display only.

## Assumptions
1. The notification icon will be placed on the right side of the `DashboardHeader` in `src/components/DashboardLayout.tsx`.
2. The mock notification panel will behave as a dropdown, opening downwards from the icon.
3. Time formats for mock data will use standard ISO strings or a simple date format to avoid external date-parsing dependencies for this story.
4. No external libraries (like `react-hot-toast` or `floating-ui`) will be used; vanilla Tailwind and React state will be sufficient for the dropdown positioning and visibility.
