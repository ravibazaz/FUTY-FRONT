# Home Page Documentation

## File Location
`app/page.js`

## Purpose
Renders the public login page for FUTY and checks authentication before showing the login form.

## Key Responsibilities
- Redirects authenticated users to `/admin/dashboard`.
- Displays a login form for unauthenticated users.
- Uses `loginAction` to submit credentials.
- Provides password show/hide UI.

## Implementation Details
- File type: Client-side React component (`"use client"`).
- Imports:
  - `useFormState` from `react-dom`
  - `useActionState`, `useState`, and `useEffect` from `react`
  - `loginAction` from `@/actions/loginAction`
  - `useRouter` from `next/navigation`
  - `Image` from `next/image`
- Authentication flow:
  1. On mount, fetch `/api/check-auth`.
  2. If authenticated, redirect to `/admin/dashboard`.
  3. Otherwise, render the login form.
- Login form behavior:
  - Uses `useActionState(loginAction)` to process form submission.
  - Toggles password visibility.
  - Displays errors returned by `loginAction`.

## Form Fields
- `email` — email input field
- `password` — password input field with toggle visibility

## Notes
- The page shows a loading state while the auth check completes.
- It uses custom CSS classes for the login form layout.
- The login form action is handled by a server action, making the page interactive but secure.
