# MIS‑18: Requests Page

## Overview
Add a new **RequestsPage** that displays a list of requests. The page should follow the existing React/React‑Router patterns used by `DashboardPage`, `ReportsPage`, and `SettingsPage` and be protected by `ProtectedRoute`.

## Requirements
- Create `src/pages/RequestsPage.tsx` as a functional React component.
- Use the project’s styling conventions (Tailwind classes, `useToast`, `useState`).
- Render mock request data that follows a structure similar to `mockReports` used in `ReportsPage`.
- Provide a download/action button that can be disabled while loading, mirroring the pattern in `DashboardHeader`.
- Register the route `/requests` behind `ProtectedRoute` (e.g., inside the same router configuration used by `DashboardPage`).

## Mock Data
```tsx
export const mockRequests = [
  { id: "req-1", title: "Request A", status: "pending", createdAt: "2025‑01‑15" },
  { id: "req-2", title: "Request B", status: "approved", createdAt: "2025‑01‑12" },
  { id: "req-3", title: "Request C", status: "rejected", createdAt: "2025‑01‑10" },
];
```
*(Adjust fields as needed to match the actual data shape used elsewhere.)*

## Component
- **`RequestsPage`** receives no props beyond routing context.
- State `isDownloading` controls a disabled download button.
- Table or list renders each request’s `id`, `title`, `status`, and `createdAt`.
- On download success/failure, show a toast (`useToast`) similar to `DashboardHeader`.

```tsx
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Download } from "lucide-react";

export const RequestsPage: React.FC = () => {
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // TODO: replace with actual report‑generation logic
      // await generateSampleReport();
      showToast("Report downloaded successfully.", "success");
    } catch {
      showToast("Failed to download report. Please try again.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Requests</h1>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          aria-label="Download sample requests report"
          aria-busy={isDownloading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={16} /> Download Report
            </>
          )}
        </button>
      </div>

      <table className="w-full border border-slate-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {mockRequests.map((req) => (
            <tr key={req.id} className="border-b border-slate-700 hover:bg-slate-900">
              <td className="p-3">{req.id}</td>
              <td className="p-3">{req.title}</td>
              <td className="p-3">{req.status}</td>
              <td className="p-3">{req.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
```

## Routing
Add the following route to the application’s main router (the same file where `DashboardPage` is registered):

```tsx
<Route
  path="/requests"
  element={
    <ProtectedRoute>
      <RequestsPage />
    </ProtectedRoute>
  }
/>
```

Ensure `ProtectedRoute` is imported from the project’s routing utilities.

## Styling
- Use the same Tailwind utility classes seen in `DashboardLayout.tsx` (e.g., `h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md` for headers, `text-slate-400`, `flex items-center gap-4`, etc.).
- Keep the component’s container padding and typography consistent with `ReportsPage` and `SettingsPage`.

## Testing
1. **Manual verification** – run `npm run dev` and navigate to `http://localhost:5173/requests`. The page should render the request table and the download button should be functional (toast messages appear on success/failure).
2. **Lint** – execute `npm run lint`; no errors should be reported for the new file.
3. **Build** – run `npm run build`; the TypeScript compiler and Vite should succeed.
4. **Unit tests** – if the project uses React Testing Library, add a simple test that renders `RequestsPage` and checks that the table rows contain the expected mock data.

## Steps to Verify Existing Behaviour (if the page already exists)
- Confirm that `src/pages/RequestsPage.tsx` exists and matches the component structure above.
- Verify that the route `/requests` is defined behind `ProtectedRoute` in the router config.
- Ensure the mock data structure aligns with any existing API or backend expectations.
- Run the above lint/build commands to confirm no regressions.
