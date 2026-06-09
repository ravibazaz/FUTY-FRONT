**Title:** Admin Premanagers Page (`app/admin/premanagers/page.js`)

## Overview

This admin page displays pre-signup manager records in a searchable table. It loads manager data from `/api/managers/presignup`, initializes a jQuery DataTable, and provides links to view, edit, or delete each entry.

Implementation: [app/admin/premanagers/page.js](app/admin/premanagers/page.js#L1-L200)

## Behavior

- Uses client-side React with `"use client"`.
- Fetches pre-signup managers from the API endpoint `/api/managers/presignup`.
- Displays toast notifications when a `toastMessage` cookie is present.
- Initializes and destroys a DataTable instance based on the loaded data.

## UI Structure

- Breadcrumb: `> Managers - Pre Signup`
- Page title: `Managers - Pre Signup`
- New manager button: `/admin/managers/new`
- Table columns: Name, Phone, Email, Friendlies, Last Activity, Action
- Actions: view manager details, edit manager, delete manager

## Data Handling

- Fetches managers with `fetch("/api/managers/presignup")`.
- Expects response JSON with `result.managers`.
- Uses `setManagers(result.managers || [])`.
- Handles fetch errors by logging to console.

## Notes

- The component uses `DeleteButton` and the `deleteManager` action.
- Hard-coded links for phone and email values exist in the table rows.
- The `Friendlies` column is currently rendered with a static `6` value.
- `Last Activity` is hard-coded as `1 Nov`.

## Recommendations

- Replace hard-coded values with real manager metrics.
- Add loading and error UI states instead of `Loading...` alone.
- Consider migrating from global jQuery DataTables to a React-friendly table solution.

*Document generated from the admin premanagers page implementation.*