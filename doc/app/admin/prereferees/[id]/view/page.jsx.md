**Title:** View Referee Page (`app/admin/prereferees/[id]/view/page.jsx`)

## Overview

This server-rendered page displays a referee's profile details, contact information, and profile image. It loads the referee record by ID and renders the data for admin review.

Implementation: [app/admin/prereferees/[id]/view/page.jsx](app/admin/prereferees/[id]/view/page.jsx#L1-L260)

## Behavior

- Uses server-side rendering with Next.js App Router.
- Connects to MongoDB via `connectDB()`.
- Loads the referee record by `params.id` and populates the manager/team hierarchy.
- Displays the profile image using the dynamically imported `ShowImagesWithAlertClick` component.

## UI Elements

- Breadcrumb: `> Player`
- Page title: referee name
- `ChangeStatus` control for active status
- Contact details: manager name, email, telephone, postcode
- Player fields: profile text, nickname, referee level, referee fee
- Links to edit and back to `/admin/players`

## Notes

- The page uses `User.findById(id).populate(...)` to load nested `palyer_manger_id` relationships.
- `profile_image` is served through `/api` when present.
- Some links currently point to the manager route namespace, which may be inconsistent for referee pages.
- The page includes hard-coded `Last Activity` text.

## Recommendations

- Update route links to the correct referee edit path if needed.
- Add error handling for missing referee records.
- Replace static UI placeholders with live data where available.

*Document generated from the admin prereferees view page implementation.*