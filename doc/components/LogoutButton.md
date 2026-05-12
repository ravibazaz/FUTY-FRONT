# LogoutButton Component Documentation

## Component Purpose

The `LogoutButton` component provides a secure logout functionality for the FUTY admin dashboard. It handles user logout by calling the logout API endpoint and safely redirects users back to the login page.

**Key Responsibility:** Handle user logout with API call and client-side redirection.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/LogoutButton.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with navigation hooks |
| **Props** | None |
| **Dependencies** | `useRouter` from `next/navigation` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/logout` (GET request) |

---

## Key Features

- Asynchronous logout API call
- Client-side redirection to login page
- Error handling with console logging
- Prevents default link navigation
- Bootstrap navigation styling
- Secure logout process

---

## Component Structure

```jsx
"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault(); // stop <a> default navigation
    try {
      const res = await fetch("/api/logout", { method: "GET" });

      if (!res.ok) throw new Error("Logout failed");

      // Now safely redirect on client
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <li className="nav-item">
      <a className="nav-link" href="#" onClick={handleLogout}>
        <span className="link-text">Sign Out</span>
      </a>
    </li>
  );
}
```

---

## Logout Flow

### 1. Event Handling

```jsx
const handleLogout = async (e) => {
  e.preventDefault(); // stop <a> default navigation
```

- Prevents default `<a>` tag navigation behavior
- Allows custom async logout logic

### 2. API Call

```jsx
const res = await fetch("/api/logout", { method: "GET" });
```

- Makes GET request to `/api/logout` endpoint
- Uses native `fetch` API for HTTP request
- Asynchronous operation with `await`

### 3. Response Validation

```jsx
if (!res.ok) throw new Error("Logout failed");
```

- Checks if response status is OK (200-299)
- Throws error for failed logout attempts

### 4. Redirection

```jsx
router.push("/");
```

- Uses Next.js `useRouter` hook for client-side navigation
- Redirects to root path `/` (login page)
- Safe client-side redirect after successful logout

### 5. Error Handling

```jsx
} catch (error) {
  console.error("Logout failed:", error);
}
```

- Catches all errors (network, API, validation)
- Logs errors to browser console
- No user-facing error display (silent failure)

---

## Navigation Hook Usage

```jsx
import { useRouter } from "next/navigation";
const router = useRouter();
```

- Imports `useRouter` from Next.js navigation
- Gets router instance for programmatic navigation
- Enables client-side routing without full page reload

---

## Rendered Output

```jsx
<li className="nav-item">
  <a className="nav-link" href="#" onClick={handleLogout}>
    <span className="link-text">Sign Out</span>
  </a>
</li>
```

- **Container:** Bootstrap navigation list item
- **Link:** Anchor tag with dummy `href="#"` 
- **Text:** "Sign Out" wrapped in span with `link-text` class
- **Event:** `onClick` handler for logout logic

---

## CSS Classes Used

| Class | Purpose |
|-------|---------|
| `nav-item` | Bootstrap navigation list item |
| `nav-link` | Bootstrap navigation link styling |
| `link-text` | Custom class for link text styling |

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `useRouter` | `next/navigation` | Client-side navigation and routing |

---

## API Requirements

### Logout Endpoint

- **URL:** `/api/logout`
- **Method:** GET
- **Purpose:** Server-side logout logic (session cleanup, token invalidation)
- **Response:** Success status for successful logout
- **Error Handling:** Non-2xx status codes trigger error

---

## Usage Example

### In Navigation Component

```jsx
import LogoutButton from '@/components/LogoutButton';

export default function Navigation() {
  return (
    <nav>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="/dashboard">Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/settings">Settings</a>
        </li>
        <LogoutButton />
      </ul>
    </nav>
  );
}
```

### In Sidebar Component

```jsx
import LogoutButton from '@/components/LogoutButton';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="nav flex-column">
        {/* Other navigation items */}
        <LogoutButton />
      </ul>
    </div>
  );
}
```

---

## Behavior Notes

- Clicking "Sign Out" triggers async logout process
- Page remains on current URL during logout API call
- Successful logout redirects to login page (`/`)
- Failed logout logs error but stays on current page
- No loading states or user feedback during logout

---

## Error Scenarios

| Scenario | Behavior |
|----------|----------|
| **Network Error** | Console error, stays on page |
| **API Error (4xx/5xx)** | Console error, stays on page |
| **Server Unavailable** | Console error, stays on page |
| **Invalid Response** | Console error, stays on page |

---

## Security Considerations

- **API Call:** Server-side session/token cleanup required
- **Client Redirect:** Only after successful API response
- **No Sensitive Data:** No tokens or credentials in component
- **Error Handling:** Failed logout doesn't expose sensitive information

---

## Known Issues / Considerations

1. **Silent Failures:** Logout failures only logged to console, no user feedback

2. **API Dependency:** Requires `/api/logout` endpoint to exist and function properly

3. **Navigation Hook:** Only works in Next.js App Router context

4. **No Loading State:** Users get no feedback during logout process

5. **Console Logging:** Errors only visible in developer tools

---

## Future Enhancements

- [ ] Add loading spinner during logout process
- [ ] Show user-friendly error messages on logout failure
- [ ] Add confirmation dialog before logout
- [ ] Implement logout timeout handling
- [ ] Add success toast notification
- [ ] Support for multiple logout endpoints
- [ ] Add analytics tracking for logout events
- [ ] Implement progressive enhancement for non-JS users
- [ ] Add keyboard shortcut support (Ctrl+Shift+L)
- [ ] Support for logout reasons (timeout, manual, forced)

---

## Testing Recommendations

- Test successful logout flow (API call + redirect)
- Test network failure scenarios
- Test API error responses (404, 500, etc.)
- Verify redirect to login page on success
- Check console error logging on failures
- Test component rendering in navigation
- Verify Bootstrap styling integration
- Test accessibility (keyboard navigation, screen readers)

---

## Support & Maintenance

- Ensure `/api/logout` endpoint exists and handles logout properly
- Monitor API response formats and error codes
- Test logout flow after authentication system changes
- Verify Next.js router integration works correctly
- Check for console errors in production logs
- Update error handling based on user feedback
- Test component with different navigation implementations
- Monitor logout success/failure rates
