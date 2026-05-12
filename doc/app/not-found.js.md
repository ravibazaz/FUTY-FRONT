# Not Found Page Documentation

## File Location
`app/not-found.js`

## Purpose
Displays a user-friendly 404-style error page when a route cannot be resolved within the app.

## Key Responsibilities
- Shows a clear "Not Found" message.
- Provides a navigation link back to the homepage.

## Implementation Details
- Imports `Link` from `next/link`.
- Renders:
  - `<h2>Not Found</h2>`
  - `<p>Could not find requested resource</p>`
  - `<Link href="/">Return Home</Link>`

## Notes
- This component is used by Next.js when a route does not exist in the app router.
- It is the local route-level not-found UI for the app root.
