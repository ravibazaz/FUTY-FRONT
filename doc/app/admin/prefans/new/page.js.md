**Title:** Add New Fan Page (`app/admin/prefans/new/page.js`)

## Overview

This admin page provides an interface for adding a new fan record. It uses client-side React state, form validation, and Next.js server actions to create fans through the `createFans` action.

Implementation: [app/admin/prefans/new/page.js](app/admin/prefans/new/page.js#L1-L200)

## Behavior

- Uses `"use client"` for client-only React behavior.
- Validates form input with `FansSchema(false)` from `@/lib/validation/fans`.
- Performs an async duplicate email check via `/api/check-email?email=...` before submission.
- Uses FormData and a server action (`createFans`) to submit the fan creation request.
- Shows live profile-image preview when the user selects an image file.
- Disables the submit button while the form is pending.

## Form Fields

- `name` (text)
- `email` (email)
- `telephone` (text)
- `profile_image` (file upload)
- `password` (password)

## UI Elements

- Breadcrumb: `> Fans`
- Title: `Add New Fan`
- Profile image upload widget with preview
- Submit button: `Submit`
- Back link to `/admin/fans`

## Validation and Submission

- Client-side validation with Zod handles immediate feedback.
- If email already exists, the page shows `Email already exists` before sending the server action.
- On successful validation, the form dispatches `formAction(formData)`.

## Notes

- The page imports `createFans` from `@/actions/fansActions`.
- Uses `useState`, `useRef`, `useTransition`, and `useActionState` from React.
- The implementation includes both client-side and action-state error handling.
- The page currently does not display a dedicated loading spinner beyond the submit button state.

## Recommended Improvements

- Add explicit field-level labels and ARIA attributes for accessibility.
- Handle server-side response success and failure more visibly in the UI.
- Add phone or country code fields if required by the main API.

*Document generated from the admin `prefans/new` page implementation.*