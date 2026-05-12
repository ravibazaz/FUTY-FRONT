# Global CSS Documentation

## File Location
`app/globals.css`

## Purpose
Defines global styling variables and browser defaults for the FUTY app.

## Key Responsibilities
- Sets base color variables for light and dark mode.
- Normalizes browser defaults for HTML and body.
- Applies a global box-sizing rule.
- Ensures links inherit text color and remove default underlines.

## Key Styles
- `:root` defines `--background` and `--foreground` colors.
- Dark mode uses `prefers-color-scheme: dark` to invert background and foreground.
- `html, body` prevent horizontal overflow and enforce a maximum width.
- `body` uses a sans-serif system font stack and smooths text rendering.
- Universal selector `*` resets margin and padding, and sets `box-sizing: border-box`.
- `a` elements inherit text color and remove `text-decoration`.

## Notes
- This stylesheet is applied globally by Next.js across the entire application.
- It is ideal for base theming and default browser normalization.
