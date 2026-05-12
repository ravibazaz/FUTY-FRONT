# Page Module CSS Documentation

## File Location
`app/page.module.css`

## Purpose
Provides scoped styling for the root landing page and layout components.

## Key Responsibilities
- Defines responsive layout and spacing for the login page.
- Creates hover and dark mode styling rules.
- Configures typography, button styles, and footer layout.

## Key Classes
- `.page`
  - Uses CSS Grid with three rows and centered content.
  - Sets padding, gap, min-height, and font family.
  - Defines color variables for light and dark themes.
- `.main`
  - Uses vertical flex layout with a gap between sections.
- `.ctas`
  - Styles call-to-action buttons with spacing and responsive layout.
- `.footer`
  - Aligns footer links and supports wrapping on smaller screens.

## Dark Mode
- Uses `@media (prefers-color-scheme: dark)` to adjust colors for dark theme.
- Changes button hover variables and page background variables.
- Enables `color-scheme: dark` for the HTML element.

## Responsive Behavior
- `@media (max-width: 600px)` adjusts padding, button sizes, and layout.
- Ensures button stacking and centered footer layout on narrow screens.

## Notes
- This module is imported only by the root page component.
- It defines modern, accessible spacing and hover states for an app landing page.
