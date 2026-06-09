**Title:** Add New Referee Page (`app/admin/prereferees/new/page.js`)

## Overview

This admin page provides a form to add a new referee. It validates input using `RefereesSchema`, checks for duplicate email addresses, and submits the data through the `createReferees` server action.

Implementation: [app/admin/prereferees/new/page.js](app/admin/prereferees/new/page.js#L1-L220)

## Behavior

- Uses client-side React with `"use client"`.
- Uses `useActionState`, `useState`, `useRef`, and `useTransition`.
- Validates the form with `RefereesSchema(false)`.
- Performs an async email uniqueness check using `/api/check-email?email=...`.
- Submits form data via `createReferees`.
- Displays a profile image preview when a file is selected.

## Form Fields

- `name`
- `email`
- `telephone`
- `post_code`
- `travel_distance`
- `profile_description`
- `nick_name`
- `referee_lavel`
- `referee_fee`
- `profile_image`
- `password`

## UI Elements

- Breadcrumb: `> Referee`
- Title: `Add New Referee`
- Submit button disabled while pending
- Back link to `/admin/referees`

## Notes

- The page uses `createReferees` from `@/actions/refereesActions`.
- Client validation and server-side action state both display errors.
- No explicit submission success notification is rendered beyond action state.

## Recommendations

- Add clearer success/failure feedback after submission.
- Improve accessibility for the file upload and input fields.
- Validate postal code and travel distance more explicitly if required.

*Document generated from the admin prereferees new page implementation.*