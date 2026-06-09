**Title:** Admin Preplayers Page (`app/admin/preplayers/page.js`)

## Overview

This admin page displays pre-signup players in a searchable DataTable. It fetches player records from `/api/players/presignup`, shows them in a paginated table, and provides actions for view, edit, and delete.

Implementation: [app/admin/preplayers/page.js](app/admin/preplayers/page.js#L1-L200)

## Behavior

- Uses client-side React with `"use client"`.
- Loads pre-signup player data from `/api/players/presignup`.
- Displays a toast notification if a `toastMessage` cookie is present.
- Initializes a jQuery DataTable and destroys it on cleanup.

## UI Elements

- Breadcrumb: `> Players - Pre Signup`
- Page title: `Players  - Pre Signup`
- New player button linking to `/admin/players/new`
- Table columns: Name, Phone, Email, Friendlies, Last Activity, Action
- Each row includes links to view or edit and a delete button.

## Data Handling

- Fetch request: `fetch("/api/players/presignup")`
- Expects response JSON with `result.players`
- Uses `setPlayers(result.players || [])`

## Notes

- The table includes hard-coded values for `Friendlies` and `Last Activity`.
- Phone and email links currently use static example hrefs.
- `DeleteButton` is used to delete player records with a server action.

## Recommendations

- Replace static placeholders with real metrics and links.
- Add explicit loading and error UI states.
- Consider moving away from global jQuery DataTables to a React-friendly table.

*Document generated from the admin preplayers page implementation.*