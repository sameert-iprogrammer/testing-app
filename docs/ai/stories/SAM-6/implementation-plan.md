# Implementation Plan: SAM-6 (Notifications Panel)

## Story Overview
This story implements a static, dropdown-style notifications panel anchored to the dashboard header. The user can toggle the panel's visibility by clicking a bell icon. The panel displays mock data with titles, messages, timestamps, and type-based icons. Interaction with individual items is read-only (static), and the panel dismisses when the icon is clicked again or when a click occurs outside the panel area.

## Resolved Decisions
- **Static Display:** Clicking a notification item will not alter its visual state (no "mark as read" logic).
- **No External Libraries:** The dropdown positioning and click-outside detection will use vanilla Tailwind CSS and React state/hooks.
- **Mock Data Structure:** Data will contain `id` (string), `title` (string), `message` (string), `timestamp` (string), and `type` (string).

## Open Questions & Assumptions
All identified ambiguities have been resolved via assumptions below to ensure the implementation can proceed without blocking.

| ID | Ambiguity | Assumption / Default | Risk |
|---|---|---|---|
| A1 | **Click-outside dismissal logic** | A simple `useEffect` with a `mousedown` event listener on the `document` will be used within `DashboardLayout.tsx` to handle dismissal. | Low |
| A2 | **Notification panel DOM structure** | The `NotificationPanel` component will be rendered as an absolute-positioned child immediately following the Bell icon button within the `DashboardHeader`'s flex container. The parent container will be `relative` to ensure correct positioning. | Low |
| A3 | **Mock data location** | The `mockNotifications` array will be defined as a constant directly inside `src/components/NotificationPanel.tsx` to keep it localized to the component responsible for rendering it. | Low |

## Context Budget
To implement this story efficiently, the code-implementer agent should focus reading on the following context:
- `src/components/DashboardLayout.tsx`: To understand the exact structure of `DashboardHeader` and where to inject the Bell icon and panel state.
- `src/components/Toast.tsx` and `src/components/ProtectedRoute.tsx`: For minor style references (e.g., border radius, padding, text utilities) if needed, though Tailwind classes should handle most styling.
- `tailwind.config.js`: To confirm standard color palettes and font families are available.

## Implementation Steps

### Step 1: Create `src/components/NotificationPanel.tsx`
1. **Define Interfaces:**
   - Export `MockNotification` interface with fields: `id`, `title`, `message`, `timestamp`, and `type`.
   - Export `NotificationPanelProps` interface: `{ isOpen: boolean; onClose: () => void }`.
   *(Note: Use `import type` for these interfaces when importing them into other files due to `verbatimModuleSyntax: true` in `tsconfig`.)*

2. **Define Mock Data:**
   - Create a constant `mockNotifications` array containing at least 3-4 mock notification objects.
   - Ensure types are varied (e.g., `'info'`, `'alert'`) to demonstrate icon mapping.

3. **Implement Component:**
   - Import `Info`, `AlertCircle`, and `Bell` from `lucide-react`.
   - Create the `NotificationPanel` function component.
   - If `!isOpen`, return `null`.
   - Render a container `div` with absolute positioning classes: `absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto`.
   - Render a header area (e.g., "Notifications").
   - Map over `mockNotifications` to render notification items:
     - Use `type` to conditionally render an icon (e.g., `Info` for 'info', `AlertCircle` for 'alert').
     - Display `title` (bold), `message` (text-slate-400), and `timestamp` (text-xs text-slate-500).
     - Ensure click handlers on items call `onClose()` or do nothing (per static display requirement).

### Step 2: Modify `src/components/DashboardLayout.tsx`
1. **Imports:**
   - Import `Bell` from `lucide-react`.
   - Import `NotificationPanel` from `./NotificationPanel`.
   - Ensure `React`, `useState`, and `useEffect` are imported from `react`.

2. **State & Side Effects:**
   - Inside `DashboardLayout`, add `const [isNotificationOpen, setIsNotificationOpen] = useState(false);`.
   - Add a `useEffect` hook for click-outside dismissal:
     - Listen to `mousedown` on `document`.
     - If the click target does not match the Bell icon or the notification panel, call `setIsNotificationOpen(false)`.

3. **Header Integration:**
   - Inside the `DashboardHeader` function/component:
     - Add a `div` wrapper with `relative` class to house the notification icon and the panel.
     - Add a button with `id="notification-icon"` containing the `Bell` icon.
     - Wire the button's `onClick` to toggle `setIsNotificationOpen(!isNotificationOpen)`.
     - Immediately after the button, render `<NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />`.
     - Style the button to match existing header icon styling (e.g., using the same text color, hover effects, and padding as the download or logout icons).

## Files to Touch
- `src/components/NotificationPanel.tsx` (Create)
- `src/components/DashboardLayout.tsx` (Modify)
