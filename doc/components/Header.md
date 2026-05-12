# Header Component Documentation

## Component Purpose

The `Header` component provides the top navigation bar for the FUTY admin dashboard. It displays the FUTY logo and includes mobile navigation controls for accessing the sidebar menu.

**Key Responsibility:** Render the main header with logo and mobile navigation toggle.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/Header.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with Link component |
| **Props** | None |
| **Dependencies** | `Link` from `next/link` |
| **Client-side Only** | Yes (`"use client"`) |
| **Styling** | Bootstrap CSS classes |

---

## Key Features

- Displays FUTY logo linking to admin dashboard
- Mobile-responsive navigation toggle for sidebar
- Bootstrap navbar styling with sticky positioning
- FontAwesome icons for navigation elements
- Responsive design for mobile and desktop

---

## Component Structure

```jsx
"use client";
import Link from 'next/link'

export default function Header() {
  return (
    <>
      <header className="navbar sticky-top flex-md-nowrap p-0">
        <Link className="navbar-brand for-mobile col-md-3 col-lg-2 me-0" href="/admin/dashboard">
          <img className="logo" src="/images/logo.png" alt="FUTY" />
        </Link>
        <ul className="navbar-nav flex-row d-md-none">
          <li className="nav-item text-nowrap">
            <button className="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
              <i className="fa-solid fa-bars fs-4"></i>
            </button>
          </li>
        </ul>
      </header>
    </>
  );
}
```

---

## Header Elements

### Logo Section

```jsx
<Link className="navbar-brand for-mobile col-md-3 col-lg-2 me-0" href="/admin/dashboard">
  <img className="logo" src="/images/logo.png" alt="FUTY" />
</Link>
```

- **Link Destination:** `/admin/dashboard`
- **Logo Image:** `/images/logo.png`
- **Alt Text:** "FUTY"
- **Responsive Classes:** `col-md-3 col-lg-2` for grid layout
- **Mobile Class:** `for-mobile` for mobile-specific styling

### Mobile Navigation

```jsx
<ul className="navbar-nav flex-row d-md-none">
  <li className="nav-item text-nowrap">
    <button className="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu"
      aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
      <i className="fa-solid fa-bars fs-4"></i>
    </button>
  </li>
</ul>
```

- **Visibility:** `d-md-none` (hidden on medium screens and up)
- **Icon:** FontAwesome bars icon (`fa-bars`)
- **Bootstrap Toggle:** `data-bs-toggle="offcanvas"`
- **Target:** `#sidebarMenu` offcanvas element
- **Accessibility:** Proper ARIA labels

---

## CSS Classes Used

| Class | Purpose |
|-------|---------|
| `navbar` | Bootstrap navbar base class |
| `sticky-top` | Makes header stick to top of viewport |
| `flex-md-nowrap` | Prevents flex wrapping on medium+ screens |
| `p-0` | Removes padding |
| `navbar-brand` | Styles the logo link |
| `for-mobile` | Custom class for mobile logo styling |
| `col-md-3 col-lg-2` | Bootstrap grid columns for responsive width |
| `me-0` | Removes right margin |
| `navbar-nav` | Styles navigation list |
| `flex-row` | Horizontal navigation layout |
| `d-md-none` | Hide on medium screens and larger |
| `nav-item` | Styles navigation list item |
| `text-nowrap` | Prevents text wrapping |
| `nav-link` | Styles navigation link/button |
| `px-3` | Horizontal padding |
| `text-white` | White text color |
| `fs-4` | Large font size for icon |

---

## Bootstrap Integration

- Uses Bootstrap navbar component
- Offcanvas toggle for mobile sidebar
- Responsive grid system (`col-md-3 col-lg-2`)
- Utility classes for spacing and colors

---

## FontAwesome Icons

| Icon | Class | Purpose |
|------|-------|---------|
| Bars | `fa-solid fa-bars` | Mobile menu toggle button |

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `Link` | `next/link` | Client-side navigation to dashboard |

---

## Usage Example

### Basic Usage in Layout

```jsx
import Header from '@/components/Header';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Header />
      <div className="container-fluid">
        <div className="row">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### With Sidebar Integration

```jsx
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
```

---

## Behavior Notes

- Header remains sticky at top of page
- Logo is clickable and navigates to dashboard
- Mobile menu button only visible on small screens
- Offcanvas sidebar controlled by Bootstrap JavaScript
- Responsive layout adjusts based on screen size

---

## Responsive Behavior

- **Desktop (lg+):** Logo takes 2/12 columns, no mobile menu
- **Tablet (md):** Logo takes 3/12 columns, no mobile menu
- **Mobile (sm):** Logo full width, mobile menu visible

---

## Accessibility Features

- Proper ARIA labels for screen readers
- Semantic HTML structure (`<header>`, `<nav>`)
- Keyboard navigation support
- Alt text for logo image

---

## Known Issues / Considerations

1. **Sidebar Dependency:** Requires `#sidebarMenu` element to exist for toggle to work

2. **Image Loading:** Logo image `/images/logo.png` must exist

3. **Bootstrap JS:** Requires Bootstrap JavaScript for offcanvas functionality

4. **FontAwesome:** Requires FontAwesome CSS for icons

5. **Mobile Breakpoints:** Uses Bootstrap's default breakpoints for responsive behavior

---

## Security Notes

- Links to internal admin routes only
- No user input or dynamic content
- Static image loading from same domain

---

## Future Enhancements

- [ ] Add user profile dropdown or avatar
- [ ] Include notification bell or alerts
- [ ] Add search functionality (currently commented out)
- [ ] Implement breadcrumb navigation
- [ ] Add language selector for internationalization
- [ ] Include admin user menu with logout option
- [ ] Add loading states for navigation
- [ ] Implement keyboard shortcuts for navigation
- [ ] Add theme toggle (dark/light mode)

---

## Testing Recommendations

- Test logo click navigation to `/admin/dashboard`
- Verify mobile menu toggle shows/hides sidebar
- Check responsive behavior on different screen sizes
- Test accessibility with screen readers
- Verify logo image loads correctly
- Test keyboard navigation
- Check Bootstrap offcanvas integration

---

## Support & Maintenance

- Ensure `/images/logo.png` exists in public directory
- Verify Bootstrap and FontAwesome are loaded
- Test with different sidebar implementations
- Monitor responsive behavior on various devices
- Update logo or styling as brand guidelines change
- Ensure offcanvas target ID matches sidebar component
- Test component integration with different admin layouts
