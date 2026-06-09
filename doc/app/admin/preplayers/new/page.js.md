**Title:** Add New Player Page (`app/admin/preplayers/new/page.js`)

## Overview

This page provides an admin form to add a new player record. It validates input, loads managers for selection, and submits via the `createPlayers` server action.

Implementation: [app/admin/preplayers/new/page.js](app/admin/preplayers/new/page.js#L1-L260)

## Behavior

- Uses client-side React with `"use client"`.
- Fetches manager options from `/api/managers`.
- Initializes a `TomSelect` dropdown for `palyer_manger_id`.
- Uses `PlayersSchema(false)` for client-side validation.
- Performs an asynchronous email uniqueness check against `/api/check-email?email=...`.
- Submits the form using a Next.js server action (`createPlayers`).
- Displays a profile-image preview when an image is selected.

## Form Fields

- `palyer_manger_id` (select)
- `name`
- `email`
- `telephone`
- `post_code`
- `profile_description`
- `nick_name`
- `referee_lavel`
- `referee_fee`
- `profile_image`
- `password`

## UI Elements

- Breadcrumb: `> Player`
- Title: `Add New Player`
- Back link to `/admin/players`
- Submit button displays `Adding` when pending.

## Notes

- The page imports `createPlayers` from `@/actions/playersActions`.
- The manager select dropdown is populated only after `/api/managers` returns data.
- Client-side validation and server action submission are combined.
- The page currently does not show a dedicated submission success message beyond navigation or action state.

## Recommendations

- Add better feedback for `createPlayers` success or failure.
- Improve accessibility on the select and file upload controls.
- Validate manager selection and provide a clearer placeholder.

*Document generated from the admin preplayers new page implementation.*