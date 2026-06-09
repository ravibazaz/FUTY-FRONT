**Title:** View Fan Page (`app/admin/prefans/[id]/view/page.jsx`)

## Overview

This page displays detailed fan information for a selected user, including contact details, profile image preview, and status controls.

Implementation: [app/admin/prefans/[id]/view/page.jsx](app/admin/prefans/[id]/view/page.jsx#L1-L200)

## Behavior

- Uses server-side rendering with Next.js App Router.
- Connects to MongoDB via `connectDB()`.
- Loads the user record by `id` using `User.findById(id).lean()`.
- Resolves the profile image preview URL from `userdetails.profile_image`.
- Renders `ChangeStatus` and a dynamic `ShowImagesWithAlertClick` component.

## UI Elements

- Page title: user name
- Status control via `<ChangeStatus>` component
- `Last Activity` label with hard-coded value `12 Nov`
- Contact details section with email, telephone, and verified badge
- Profile image display via dynamic component
- Edit link to `/admin/fans/${id}/edit`
- Back link to `/admin/fans`

## Route Details

- URL pattern: `/admin/prefans/[id]/view`
- Uses `params.id` as the MongoDB ID of the fan.

## Dependencies

- `ChangeStatus` from `@/components/ChangeStatus`
- `connectDB` from `@/lib/db`
- `User` from `@/lib/models/Users`
- `Image` from `next/image`
- `Link` from `next/link`
- `dynamic` from `next/dynamic`
- `ShowImagesWithAlertClick` loaded dynamically

## Notes

- The page uses `dynamic` import with fallback loading UI for `ShowImagesWithAlertClick`.
- The `profile_image` URL is prefixed with `/api` when present.
- The phone link and email link values are static examples and may not reflect actual data formatting.
- No explicit 404 or not-found handling is implemented when the user is missing.

## Recommended Improvements

- Replace hard-coded last-activity text with live activity data.
- Add a not-found page for missing fan records.
- Use proper `href` formatting for phone and email links based on actual user data.

*Document generated from the admin view fan page implementation.*