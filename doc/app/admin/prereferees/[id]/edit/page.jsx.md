**Title:** Edit Referee Page (`app/admin/prereferees/[id]/edit/page.jsx`)

## Overview

This server-rendered page loads a referee record by ID and renders the `EditPlayersForm` component for editing, using the current user data.

Implementation: [app/admin/prereferees/[id]/edit/page.jsx](app/admin/prereferees/[id]/edit/page.jsx#L1-L40)

## Behavior

- Uses Next.js App Router server rendering.
- Connects to MongoDB via `connectDB()`.
- Loads the referee document by `params.id`.
- Serializes the loaded user using `JSON.parse(JSON.stringify(user))`.
- Passes the user data into `EditPlayersForm`.

## Route Details

- Path: `/admin/prereferees/[id]/edit`
- Parameter: `params.id` (MongoDB ID)

## Dependencies

- `connectDB` from `@/lib/db`
- `User` model from `@/lib/models/Users`
- `EditPlayersForm` component from `@/components/EditPlayersForm`

## Notes

- This page does not perform any data validation itself; the edit form component handles updates.
- No not-found handling is implemented for invalid IDs.

## Recommendations

- Add a fallback or `notFound()` response for missing records.
- Confirm that `EditPlayersForm` supports referee-specific fields.

*Document generated from the admin prereferees edit page implementation.*