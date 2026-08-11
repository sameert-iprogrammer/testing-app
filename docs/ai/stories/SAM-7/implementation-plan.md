## Context Budget
The implementer only needs to inspect the existing structure of `DashboardHeader` within `src/components/DashboardLayout.tsx` to identify where to inject the new bell trigger and panel. Mock data formatting should mirror the array style in `src/pages/ReportsPage.tsx` to satisfy Tailwind and TypeScript conventions. No full repository scans are required.

## Files to Touch
- `src/components/DashboardLayout.tsx` (Modify)
- `src/components/NotificationItem.tsx` (Create)
- `src/components/NotificationPanel.tsx` (Create)

## Implementation Steps

### 1. Create `src/components/NotificationItem.tsx`
- Define a `NotificationItemProps` interface accepting:
  - `title: string`
  - `message: string`
  - `timestamp: string`
  - `read: boolean`
  - `onClick: () => void`
- Render a `<div>` with conditional styling:
  - Unread: Apply a subtle background or left accent border (e.g., `bg-slate-800/50 border-l-2 border-indigo-500`) to distinguish from read items.
  - Read: Default background (e.g., `bg-transparent` or `bg-slate-900/20`).
- Use existing Tailwind text utilities (`text-sm`, `font-medium`, `text-slate-300`, `text-slate-400`) consistent with `DashboardPage.tsx` and `SettingsPage.tsx`.
- Attach `onClick` to the container to allow marking as read from anywhere in the row.

### 2. Create `src/components/NotificationPanel.tsx`
- Define a `NotificationPanelProps` interface accepting:
  - `isOpen: boolean`
  - `notifications: Notification[]`
  - `onClose: () => void`
  - `onMarkRead: (id: string) => void`
- Render an absolutely positioned dropdown container:
  - Positioning: `absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-lg border border-slate-800 bg-slate-900/90 backdrop-blur-sm z-50`
  - Use `scrollbar-hide` or standard overflow utilities if needed, though native scrollbars match the current design system.
- Map `notifications` to render `<NotificationItem />` components.
- Append a footer `<div>` at the bottom containing a non-functional link/button labeled "View all notifications". Wire its click handler to `console.log('View all notifications clicked')`.

### 3. Update `src/components/DashboardLayout.tsx`
- Import `Bell` from `lucide-react` and the newly created `NotificationPanel`.
- Inside `DashboardHeader`, define the local `Notification` interface:
  ```typescript
  interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }
  ```
- Initialize state using `useState`:
  - `const [isPanelOpen, setIsPanelOpen] = useState(false);`
  - `const [notifications, setNotifications] = useState<Notification[]>([ ...mock data ... ]);` (At least 3 items, following `mockReports` static array style).
- Implement `handleMarkRead(id: string)`:
  ```typescript
  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n)); // Toggle to read
    setIsPanelOpen(false); // Optional: close panel on click, or leave open per UX preference. Spec says updates UI state.
  };
  ```
- Implement click-outside logic:
  ```typescript
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && !isFocused) {
        setIsPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFocused]);
  ```
- Wire up the `Bell` icon in the top-right controls area of `DashboardHeader`:
  - Wrap icon in a `<button>` with `onClick={() => setIsPanelOpen(prev => !prev)}`.
  - Add `onFocus={() => setIsFocused(true)}` and `onBlur={() => setIsFocused(false)}` to the wrapper or panel to satisfy "remains open while focused".
- Render `<NotificationPanel ref={panelRef} isOpen={isPanelOpen} notifications={notifications} onClose={() => setIsPanelOpen(false)} onMarkRead={handleMarkRead} />` conditionally or unconditionally positioned absolutely relative to the header controls.

## Resolved decisions
- Dropdown vs. Modal: Implemented as a header-anchored dropdown overlay to align with standard dashboard UI patterns and minimize layout disruption.
- Icon Selection: `lucide-react`'s `Bell` icon is used as the trigger, maintaining consistency with the project's existing reliance on `lucide-react`.
- State Scope: Local component state within `DashboardHeader` is preferred over global context for this story to keep the implementation scoped and aligned with the "mock data" requirement.

## Open Questions
None.

{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "DashboardHeader currently renders a horizontal flex row of controls (e.g., download button, user avatar) in the top-right corner, providing sufficient space for the new bell icon without breaking responsiveness.", "risk": "low"}, {"statement": "Notification mock data will be defined locally within DashboardHeader to maintain zero network dependencies, matching the style of mockReports in ReportsPage.tsx.", "risk": "low"}]}}
