**Title:** Admin Prereferees Page (`app/admin/prereferees/page.js`)

## Overview

This admin page lists referee pre-signup entries in a searchable DataTable. It fetches records from `/api/referees/presignup` and provides links to view, edit, or delete each referee.

Implementation: [app/admin/prereferees/page.js](app/admin/prereferees/page.js#L1-L200)

## Behavior

- Uses client-side React with `"use client"`.
- Fetches pre-signup referees from `/api/referees/presignup`.
- Shows toast notifications when a `toastMessage` cookie is present.
- Initializes a jQuery DataTable for table functionality.

## UI Elements

- Breadcrumb: `> Referees - Pre Signup`
- Page title: `Referees - Pre Signup`
- `New Referee` button linking to `/admin/referees/new`
- Table columns: Name, Phone, Email, Friendlies, Last Activity, Action
- Actions: view referee, edit referee, delete referee

## Data Handling

- API request: `fetch("/api/referees/presignup")`
- Expected response JSON shape: `{ referees: [...] }`
- Uses `setReferees(result.referees || [])`

## Notes

- Static values are used for `Friendlies` and `Last Activity`.
- Phone and email links use fixed example hrefs instead of dynamic values.
- The delete action uses `DeleteButton` and the `deleteRefree` action.

## Recommendations

- Replace placeholder metrics with actual data fields.
- Add clearer loading/error UI states.
- Consider replacing global jQuery DataTables with a React-friendly table solution.

*Document generated from the admin prereferees page implementation.*