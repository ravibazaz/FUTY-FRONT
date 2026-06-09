**Title:** Admin Prefans Page (`app/admin/prefans/page.js`)

## Overview

This page renders the admin interface for "Fans - Pre Signup" within the Futy dashboard. It fetches pre-signup fan records, displays them in a searchable DataTable, and provides edit/delete actions for each fan.

Implementation: [app/admin/prefans/page.js](app/admin/prefans/page.js#L1-L200)

## Page Behavior

- Uses React client-side rendering with `"use client"`.
- Fetches pre-signup fan data from `/api/fans/presignup` when the component mounts.
- Renders a table of fans with columns: Name, Phone, Email, Last Activity, and Action.
- Initializes a jQuery DataTable when `fans` data is available.
- Displays a toast notification if a `toastMessage` cookie exists, then clears the cookie.

## UI Elements

- Breadcrumb label: `> Fans - Pre Signup`
- Page title: `Fans - Pre Signup`
- Button: `New Fans` linking to `/admin/fans/new`
- Action links for each fan:
  - View: `/admin/fans/${id}/view`
  - Edit: `/admin/fans/${id}/edit`
- Delete action via `DeleteButton` component and server action `deleteFans`.

## Data Fetching

- Fetch request: `fetch("/api/fans/presignup")`
- Response handling: expects JSON with `result.fans` and stores them in state.
- Error handling: logs failures to the console.

## DataTable Integration

- Uses global `window.$` to initialize DataTables.
- Ensures an existing table instance is destroyed before reinitializing.
- Adds custom layout classes and a reset button for the search input.
- Cleans up the DataTable on component unmount.

## Dependencies

- `useState`, `useEffect` from React
- `DeleteButton` component from `@/components/DeleteButton`
- `deleteFans` action from `@/actions/fansActions`
- `Link` from `next/link`
- `Image` from `next/image`
- `SweetAlert2` for toast notifications

## Route / Navigation Links

- Admin pre-fans page URL: `/admin/prefans`
- New fan creation: `/admin/fans/new`
- Fan details view: `/admin/fans/${id}/view`
- Fan edit page: `/admin/fans/${id}/edit`

## Notes

- The page imports `DeleteLeagueButton` from `@/components/DeleteLeagueButton`, but this component is not used in the current implementation.
- The `Last Activity` column currently displays a hard-coded date (`12 Nov`).
- The page relies on global jQuery/DataTables objects, so the app must load those scripts in the admin layout or page context.
- The `toastMessage` mechanism uses cookies and SweetAlert2 to show success messages from previous actions.

## Recommended Improvements

- Replace the hard-coded `Last Activity` value with real activity data.
- Add explicit loading and error UI states for better UX.
- Avoid window-global DataTable usage by migrating to a React-friendly table library or custom table component.

*Document generated from the admin `prefans` page implementation.*