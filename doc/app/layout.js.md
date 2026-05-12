# Root Layout Documentation

## File Location
`app/layout.js`

## Purpose
Defines the application root layout for the FUTY website.
This file configures global metadata, shared page structure, and page-level scripts for the app.

## Key Responsibilities
- Sets page metadata for title and description.
- Wraps the entire application in `<html>` and `<body>` elements.
- Includes shared header and footer components.
- Loads global CSS and third-party scripts.

## Implementation Details
- Imports:
  - `Footer` from `@/components/Footer`
  - `HeaderBottom` from `@/components/HeaderBottom`
  - `HeaderTop` from `@/components/HeaderTop`
  - `LoginCSS` from `@/components/LoginCSS`
  - `Script` from `next/script`
  - `NextTopLoader` from `nextjs-toploader`
- Exports `metadata` object:
  - `title`: `FUTY : Friendly App`
  - `description`: `FUTY : Friendly App`
- Renders:
  - `<HeaderTop />`, `<HeaderBottom />`, and `<LoginCSS />` inside `<head>`
  - `NextTopLoader` and `children` inside `<body>`
  - Scripts for DataTables before interactive rendering

## Structure
- `<html lang="en" data-bs-theme="auto">`
- `<head>` contains shared header content and CSS injection components
- `<body>` contains the route content and global JavaScript assets

## Notes
- This layout applies to all app routes unless overridden by a nested layout.
- The page loader component ensures progress feedback during navigation.
- The DataTables scripts are loaded globally for any pages that use table-driven UI.
