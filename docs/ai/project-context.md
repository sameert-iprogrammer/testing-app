# Project Context

## Overview
- React 19 + TypeScript single-page application named `testing-app` (version 0.0.0).
- Bundled with Vite; UI styled with Tailwind CSS (v4 via `@tailwindcss/postcss`).
- Provides a small authenticated dashboard app with login, a dashboard, reports, and settings pages.
- Uses `react-router-dom` v7 for client-side routing and `lucide-react` for icons.
- Includes an Excel export utility (`xlsx`) and a sample-report generator.

## Architecture
- **Entry**: `src/main.tsx` mounts the React app; `src/App.tsx` defines the top-level component and routing.
- **Routing**: `react-router-dom` routes are defined in `App.tsx`. `ProtectedRoute` (`src/components/ProtectedRoute.tsx`) guards authenticated pages.
- **Layout**: `DashboardLayout` (`src/components/DashboardLayout.tsx`) wraps authenticated pages and contains `DashboardHeader` with logout and download actions.
- **Pages** (`src/pages/`):
  - `LoginPage` — email/password form (`handleSubmit`).
  - `DashboardPage` — stat cards (`StatCard`) and transaction list (`TransactionItem`).
  - `ReportsPage` — report list with `StatusBadge`.
  - `SettingsPage` — profile form using `useProfileForm`.
- **State / hooks** (`src/hooks/`):
  - `useAuth` — authentication state with `login(email, password)` and `logout()`.
  - `useProfileForm` — profile form state, validation (`validateEmail`, `validateRequired`), and `handleSubmit` that accepts a toast callback.
- **Toasts**: `Toast` (`src/components/Toast.tsx`) provides `ToastProvider`, `useToast`, and `ToastDisplay`.
- **Utilities** (`src/utils/`):
  - `generateSampleReport` — generates a sample report (used by the reports/download flow).
- **Styling**: Tailwind CSS configured via `tailwind.config.js`, `postcss.config.js`, and `src/index.css`.
- **Public assets**: `public/favicon.svg`, `public/icons.svg`; source assets in `src/assets/`.

## Tech stack
- **Language**: TypeScript (strict config via `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.json`).
- **Framework**: React 19 (`react`, `react-dom`).
- **Build tool**: Vite (`vite.config.ts`); React plugin via `@vitejs/plugin-react`.
- **Routing**: `react-router-dom` v7.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, `autoprefixer`).
- **Icons**: `lucide-react`.
- **Excel**: `xlsx` (used for report export).
- **Linting**: ESLint (`eslint.config.js`, `@eslint/js`).
- **Node types**: `@types/node`.

## Conventions
- Function components defined with `function` declarations (e.g., `def DashboardPage()`); props typed inline or via named interfaces.
- Interfaces for props/state are declared at module scope (e.g., `LayoutProps`, `AuthState`, `ProfileFormData`, `FormErrors`, `ToastState`).
- Hooks expose an object with state and methods (e.g., `useAuth` returns `login`, `logout`; `useProfileForm` returns handlers and validators).
- Page components live in `src/pages/`, shared UI in `src/components/`, hooks in `src/hooks/`, utilities in `src/utils/`.
- Styling via Tailwind utility classes in JSX; global styles in `src/index.css`.
- Toasts are consumed via the `useToast` hook; `useProfileForm.handleSubmit` receives a `showToast(message, type)` callback.
- ESLint is configured at the repo root (`eslint.config.js`) and run via `npm run lint`.

## Key paths
| Path | Purpose |
|---|---|
| `src/main.tsx` | React entry point; mounts the app |
| `src/App.tsx` | Top-level component; defines routes |
| `src/index.css` | Global styles / Tailwind entry |
| `src/components/DashboardLayout.tsx` | Authenticated layout with header, logout, download |
| `src/components/ProtectedRoute.tsx` | Route guard for authenticated pages |
| `src/components/Toast.tsx` | Toast provider, hook, and display component |
| `src/hooks/useAuth.ts` | Authentication state (`login`, `logout`) |
| `src/hooks/useProfileForm.ts` | Profile form state, validation, submit |
| `src/pages/LoginPage.tsx` | Login form page |
| `src/pages/DashboardPage.tsx` | Dashboard with stat cards and transactions |
| `src/pages/ReportsPage.tsx` | Reports list with status badges |
| `src/pages/SettingsPage.tsx` | Settings / profile form page |
| `src/utils/generateSampleReport.ts` | Generates a sample report |
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration (Tailwind + autoprefixer) |
| `eslint.config.js` | ESLint configuration |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | TypeScript configuration |
| `index.html` | Vite HTML entry |
| `public/favicon.svg`, `public/icons.svg` | Public static assets |
| `src/assets/react.svg`, `src/assets/vite.svg` | Source static assets |

## Build & test commands
- `npm run dev` — start Vite dev server (`vite`).
- `npm run build` — type-check and build (`tsc -b && vite build`).
- `npm run lint` — run ESLint (`eslint .`).
- `npm run preview` — preview the production build (`vite preview`).
- Test: Unknown (no test script or test framework is declared in `package.json` or visible in the repository map).
