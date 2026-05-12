# Global Not Found Page Documentation

## File Location
`app/global-not-found.js`

## Purpose
Provides a global not-found page for any route that cannot be found across the entire app.

## Key Responsibilities
- Supplies a global 404 fallback page.
- Includes metadata for the not-found route.
- Displays a link back to the home page.

## Implementation Details
- Imports `Link` from `next/link`.
- Exports `metadata` object:
  - `title`: `Not Found`
  - `description`: `The page you are looking for does not exist.`
- Renders a full HTML document with:
  - `<html lang="en">`
  - `<body>` containing heading, message, and return link

## Notes
- This file is used by Next.js when the requested page is not present anywhere in the app.
- It provides a consistent fallback even if nested route-level not-found pages are not defined.
