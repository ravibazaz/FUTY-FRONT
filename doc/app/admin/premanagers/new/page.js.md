**Title:** Add New Manager Page (`app/admin/premanagers/new/page.js`)

## Overview

This page allows administrators to add a new manager record. It performs form validation, loads a team list from `/api/teams`, and uses a server action (`createManagers`) to submit data.

Implementation: [app/admin/premanagers/new/page.js](app/admin/premanagers/new/page.js#L1-L250)

## Behavior

- Uses client-side React with `"use client"`.
- Loads available teams from `/api/teams` on mount.
- Implements `TomSelect` for the team dropdown.
- Validates input with `ManagersSchema(false)` from `@/lib/validation/managers`.
- Checks email uniqueness via `/api/check-email?email=...` before submission.
- Uses a server action (`createManagers`) with FormData.
- Shows a preview for the selected profile image.

## Form Fields

- `name`
- `email`
- `telephone`
- `post_code`
- `travel_distance`
- `team_id`
- `profile_description`
- `nick_name`
- `win`, `style`, `trophy`
- `profile_image`
- `password`

## UI Elements

- Breadcrumb: `> Managers`
- Title: `Add New Manager`
- Team selector shows league and club metadata when selected.
- Submit button disables while the form is pending.
- Back link to `/admin/managers`

## Notes

- Uses `createManagers` from `@/actions/managersActions`.
- The `TomSelect` dropdown is initialized after teams are fetched.
- Client-side form validation is combined with server-side action submission.
- Unique email validation occurs before the action is invoked.

## Recommendations

- Add a visible validation summary for user feedback.
- Improve accessibility on the team dropdown and file upload control.
- Handle empty team fetch results and network failures more clearly.

*Document generated from the admin premanagers new page implementation.*