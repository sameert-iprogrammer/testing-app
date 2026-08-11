# SAM-7: Notifications Panel

## Story Metadata
- **JIRA Key**: SAM-7
- **Title**: Notifications panel
- **Description**: On notification icon click, show notification panel with mock data

## Acceptance Criteria
1. A notification bell icon is visible in the dashboard header.
2. Clicking the notification bell icon toggles the display of a notification panel (dropdown).
3. The panel remains open while focused and closes when clicking outside of it.
4. The panel displays a list of mock notifications (at least 3 items).
5. Each notification item renders a title, a short description/message, a timestamp, and a visual indicator for read/unread status.
6. Clicking on a notification item marks it as read and updates its UI state accordingly.
7. All functionality operates on local mock data with zero network requests.

## UI Notes
- **Placement**: Top-right area of the `DashboardHeader` in `src/components/DashboardLayout.tsx`, adjacent to the existing download/user controls.
- **Icon**: Use the `Bell` or `BellRing` icon from `lucide-react` (consistent with the project's existing icon set in `Toast.tsx`).
- **Dropdown Panel Styling**:
  - Rendered as an absolutely positioned dropdown overlay with a white/dark background, rounded corners, and a subtle shadow.
  - Text and spacing should follow existing Tailwind utility conventions (e.g., `text-sm`, `font-medium`, `px-4 py-2` spacing).
  - Include a footer/link labeled "View all notifications" (non-functional or console-logs for v1).
  - Unread notifications should have a distinct background or accent color compared to read ones.

## Implementation Notes
- **Files to Modify/Create**:
  - `src/components/DashboardLayout.tsx`: Import `lucide-react` bell icon. Add click state and dropdown rendering logic inside `DashboardHeader`.
  - `src/components/NotificationPanel.tsx` (New): Renders the dropdown container and maps over the mock notification array.
  - `src/components/NotificationItem.tsx` (New): Renders a single notification row with read/unread styling and click handler.
- **State Management**:
  - Use a local `useState` hook within `DashboardHeader` or a lightweight custom hook (e.g., `useNotifications`) to track `isOpen`, the notification list, and `read` status.
  - Mock data structure example:
    ```typescript
    interface Notification {
      id: string;
      title: string;
      message: string;
      timestamp: string;
      read: boolean;
    }
    ```
- **Click-Outside Behavior**: Implement using a `useEffect` with a `useRef` targeting the panel element to detect clicks outside and set `isOpen(false)`.
- **Dependencies**: Leverage `lucide-react` for icons. Utilize existing Tailwind CSS configuration.

## Open Questions
- Should the notification panel support grouping by date (e.g., "Today", "Yesterday")? → *Assumption: Flat list for SAM-7; grouping can be added in a follow-up story.*
- Is there an existing global event bus or context preferred for cross-component state? → *Assumption: Local state within the header is sufficient for this isolated UI toggle.*

## Assumptions
1. The dashboard header layout has enough horizontal space to accommodate the new bell icon without breaking responsiveness or overlapping the download button.
2. "Mock data" will be statically defined in the component or a dedicated constants file, matching the style of `mockReports` in `src/pages/ReportsPage.tsx`.
3. Marking a notification as read is a local UI-only action; it does not need to persist across refreshes or sync with a backend for this story.
4. The notification panel will not navigate to new routes; clicking an item will only update state and optionally log a console message.

## Resolved Decisions
- **Dropdown vs. Modal**: The notification panel is implemented as a header-anchored dropdown rather than a full-screen modal or persistent sidebar, to align with standard dashboard UI patterns and minimize layout disruption.
- **Icon Selection**: `lucide-react`'s `Bell` icon is used as the trigger, maintaining consistency with the project's existing reliance on `lucide-react` (already used in `Toast.tsx` for `CheckCircle2` and `AlertCircle`).
- **State Scope**: Local component state is preferred over global context for this story to keep the implementation scoped, testable, and aligned with the "mock data" requirement without introducing unnecessary state architecture.
