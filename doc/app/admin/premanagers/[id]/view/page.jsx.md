**Title:** View Manager Page (`app/admin/premanagers/[id]/view/page.jsx`)

## Overview

This page displays a manager's details, contact information, profile image, and friendly match history. It loads the manager record with populated team, club, and league references and fetches today's and archived friendlies.

Implementation: [app/admin/premanagers/[id]/view/page.jsx](app/admin/premanagers/[id]/view/page.jsx#L1-L220)

## Behavior

- Uses server-side rendering with Next.js App Router.
- Connects to MongoDB via `connectDB()`.
- Loads the manager by `id` and populates nested references:
  - `team_id`
  - `club`
  - `league`
- Loads today's and archived friendlies created by the manager.
- Displays the manager's profile image using dynamic import of `ShowImagesWithAlertClick`.

## UI Elements

- Breadcrumb: `> Managers`
- Page title: manager name
- `ChangeStatus` toggle for the manager's active state
- Contact details: email, telephone, postcode
- Manager details: league, club, team, profile text, nickname, win/style/trophy values
- Links to edit manager and back to `/admin/managers`
- `FriendliesTable` widgets for scheduled and archived friendlies

## Data Queries

- `User.findById(id).populate(...)` for manager details
- `Friendlies.find(...)` for today's friendlies and archive friendlies
- Uses `formatDate` import but not directly in JSX content

## Notes

- The page sets a fallback preview image when `profile_image` is missing.
- `FriendliesTable` is rendered with serialized friendlies data.
- The `Profile Image` link is labeled `Profile Imag` in the current implementation.
- Last Activity is hard-coded as `12 Nov`.

## Recommendations

- Display actual last activity or recent event date.
- Add explicit not-found handling for missing manager IDs.
- Improve phone and email link formatting using the actual user data values.
- Remove unused imports if not needed, such as `Teams`, `Clubs`, `Leagues`, `Grounds` where appropriate.

*Document generated from the admin premanagers view page implementation.*