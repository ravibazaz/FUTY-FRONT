# Sidebar Component Documentation

## Component Purpose

The `Sidebar` component is a responsive navigation sidebar for the FUTY admin dashboard. It provides hierarchical navigation with collapsible submenus, active state highlighting, and mobile-responsive offcanvas functionality. The sidebar organizes admin functionality into logical groups including leagues, teams, users, facilities, and system settings.

**Key Responsibility:** Provide organized, accessible navigation for admin dashboard functionality with responsive design and active state management.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/Sidebar.jsx` |
| **Type** | Client-Side React Component |
| **Framework** | Next.js with React Server Components |
| **Props** | None |
| **Related Components** | `LogoutButton` component |
| **Dependencies** | Next.js Link, usePathname, Bootstrap |

---

## Navigation Structure

### Main Navigation Items

| Section | Path | Description |
|---------|------|-------------|
| **Leagues** | `/admin/leagues` | League management and administration |
| **Clubs** | `/admin/clubs` | Club profile and management |
| **Teams** | `/admin/teams` | Team management with sub-sections |
| **Managers** | `/admin/managers` | Manager user accounts |
| **Referees** | `/admin/referees` | Referee user accounts |
| **Players** | `/admin/players` | Player user accounts |
| **Fans** | `/admin/fans` | Fan user accounts |
| **Grounds** | `/admin/grounds` | Ground facilities with sub-sections |
| **Friendlies** | `/admin/friendlies` | Friendly match management |
| **Tournaments** | `/admin/tournaments` | Tournament organization |
| **Adverts** | `/admin/adverts` | Advertising management |
| **Stores** | `/admin/stores` | Store management with sub-sections |
| **Settings** | `/admin/settings` | System settings with sub-sections |

### Submenu Structure

#### Teams Submenu
- **Teams**: `/admin/teams` - Main team management
- **Manager Invitation**: `/admin/teams/invitationmanagers` - Manager invitation system

#### Grounds Submenu
- **Grounds**: `/admin/grounds` - Ground facility management
- **Facilities**: `/admin/groundfacilities` - Ground facility features

#### Stores Submenu
- **Products**: `/admin/stores` - Product catalog management
- **Vendors**: `/admin/vendors` - Vendor management
- **Categories**: `/admin/categories` - Product category management

#### Settings Submenu
- **Age Groups**: `/admin/agegroups` - Age group configuration
- **Profile**: `/admin/profiles` - Admin profile management

---

## Key Features

### 1. **Active State Management**
- Uses `usePathname()` hook for current route detection
- Applies `active` class to current navigation items
- Supports nested active states for submenus
- Complex logic for teams submenu active states

### 2. **Responsive Design**
- Desktop: Fixed sidebar layout
- Mobile: Offcanvas slide-out menu
- Bootstrap responsive classes (`col-md-3`, `col-lg-3`, `col-xl-2`)
- Touch-friendly navigation

### 3. **Collapsible Submenus**
- Bootstrap collapse functionality
- Expandable/collapsible sections
- Maintains state during navigation
- Accessible with proper ARIA attributes

### 4. **Logo Integration**
- FUTY logo display in sidebar
- Different versions for desktop and mobile
- Links to dashboard home

### 5. **Logout Functionality**
- Integrated `LogoutButton` component
- Positioned at bottom of sidebar
- Separate from main navigation

---

## Component Structure

### Main Container
```jsx
<div className="sidebar col-md-3 col-lg-3 col-xl-2 p-0 bg-primary">
```

### Offcanvas Mobile Menu
```jsx
<div className="offcanvas-md offcanvas-end" tabIndex="-1" id="sidebarMenu">
```

### Navigation List
```jsx
<ul className="nav flex-column">
  {/* Main navigation items */}
</ul>
```

### Submenu Structure
```jsx
<li className="nav-item with-submenu">
  <a className="nav-link collapsed" href="#submenu4" data-bs-toggle="collapse">
    <span className="link-text">Teams</span>
  </a>
  <div className="collapse submenu" id="submenu4">
    {/* Submenu items */}
  </div>
</li>
```

---

## Active State Logic

### Basic Active State
```javascript
className={`nav-link ${pathname.startsWith('/admin/leagues') ? 'active' : ''}`}
```
- Uses `pathname.startsWith()` for section matching
- Applies to main navigation items

### Complex Active State (Teams)
```javascript
className={`nav-link ${
  pathname === "/admin/teams" ||
  (pathname.startsWith("/admin/teams/") &&
   !pathname.startsWith("/admin/teams/invitationmanagers"))
  ? "active" : ""
}`}
```
- Handles teams main page and sub-pages
- Excludes invitation managers from teams active state

### Manager Invitation Active State
```javascript
className={`nav-link ${
  pathname === "/admin/teams/invitationmanagers" ||
  pathname.startsWith("/admin/teams/invitationmanagers/")
  ? "active" : ""
}`}
```
- Specific matching for invitation managers section

---

## Styling & Layout

### CSS Classes
- `.sidebar` - Main sidebar container
- `.offcanvas-md` - Mobile offcanvas behavior
- `.offcanvas-end` - Slide from right side
- `.nav` - Bootstrap navigation
- `.nav-item` - Individual navigation items
- `.nav-link` - Navigation links
- `.with-submenu` - Items with dropdown submenus
- `.submenu` - Submenu container
- `.active` - Active state styling
- `.collapsed` - Bootstrap collapse state

### Responsive Breakpoints
- **Mobile (< 768px)**: Offcanvas menu
- **Tablet (≥ 768px)**: Fixed sidebar (col-md-3)
- **Large (≥ 992px)**: Fixed sidebar (col-lg-3)
- **Extra Large (≥ 1200px)**: Fixed sidebar (col-xl-2)

### Color Scheme
- Primary background (`bg-primary`)
- White text and close button (`btn-close-white`)
- Active state highlighting

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `Link` Next.js | Client-side navigation |
| `usePathname` Next.js | Current route detection |
| `LogoutButton` | User logout functionality |
| Bootstrap | Responsive design and collapse functionality |

---

## Usage Example

```javascript
import Sidebar from '@/components/Sidebar';

// In admin layout or dashboard page
export default function AdminLayout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <main className="col-md-9 col-lg-9 col-xl-10">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## Navigation Flow

### User Journey
1. **Dashboard Access**: Logo links to `/admin/dashboard`
2. **Section Navigation**: Click main navigation items
3. **Submenu Access**: Click parent item to expand submenu
4. **Active Indication**: Current page highlighted
5. **Mobile Navigation**: Hamburger menu triggers offcanvas
6. **Logout**: Bottom logout button

### URL Patterns
- `/admin/leagues` - League management
- `/admin/clubs` - Club management
- `/admin/teams` - Team overview
- `/admin/teams/invitationmanagers` - Manager invitations
- `/admin/grounds` - Ground facilities
- `/admin/groundfacilities` - Facility management
- `/admin/stores` - Product catalog
- `/admin/vendors` - Vendor management
- `/admin/categories` - Product categories
- `/admin/agegroups` - Age group settings
- `/admin/profiles` - Admin profiles

---

## Accessibility Features

### ARIA Attributes
- `aria-labelledby="sidebarMenuLabel"` - Screen reader support
- `aria-expanded="false"` - Collapse state indication
- `aria-label="Close"` - Close button description

### Keyboard Navigation
- Tab navigation through menu items
- Enter/Space to activate links
- Escape to close offcanvas menu
- Focus management for mobile menu

### Semantic HTML
- Proper heading hierarchy
- Semantic navigation structure
- Screen reader friendly markup

---

## Performance Considerations

| Aspect | Details |
|--------|---------|
| **Bundle Size** | Lightweight component with minimal dependencies |
| **Rendering** | Client-side only, no server rendering needed |
| **Navigation** | Next.js Link with prefetch disabled for admin routes |
| **State Updates** | Minimal re-renders, pathname changes trigger updates |

---

## Browser Compatibility

| Feature | Browser Support |
|---------|-----------------|
| Next.js Link | All modern browsers |
| usePathname | Next.js 13+ compatible browsers |
| Bootstrap Collapse | All modern browsers |
| CSS Grid/Flexbox | All modern browsers |

---

## Future Enhancements

- [ ] Add search functionality within sidebar
- [ ] Implement keyboard shortcuts for navigation
- [ ] Add user avatar/profile picture
- [ ] Include notification badges for pending items
- [ ] Add quick actions menu
- [ ] Implement drag-and-drop menu reordering
- [ ] Add favorite/bookmark functionality
- [ ] Include breadcrumb navigation
- [ ] Add context-aware menu items
- [ ] Implement role-based menu visibility

---

## Related Components

- **LogoutButton:** User authentication logout functionality

---

## Related Pages

- `/admin/dashboard` - Main admin dashboard
- All `/admin/*` routes - Admin functionality pages

---

## Related API Endpoints

- None directly (purely navigational component)

---

## Maintenance Notes

### Adding New Navigation Items
1. Add new `<li className="nav-item">` element
2. Include proper `pathname.startsWith()` logic for active state
3. Use `prefetch={false}` for admin routes
4. Follow existing naming conventions

### Adding Submenus
1. Add `with-submenu` class to parent `li`
2. Create collapsible `div` with unique ID
3. Add submenu links inside collapse container
4. Update active state logic for submenu items

### Mobile Responsiveness
- Test offcanvas behavior on mobile devices
- Ensure touch targets are adequate size
- Verify accessibility with screen readers

---

## Support & Maintenance

For questions or issues related to this component, please refer to the main project documentation or contact the development team.
