# Authentication Module Documentation

## Module Purpose

The `auth` module provides server-side authentication utilities for the FUTY application. It handles JWT token verification and user authentication status checks using Next.js cookies.

**Key Responsibility:** Verify user authentication status by validating JWT tokens stored in HTTP cookies.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/auth.js` |
| **Type** | Server Component (Next.js 15) |
| **Dependencies** | `next/headers`, `@/lib/jwt` |
| **Exports** | `isAuthenticated()` |
| **Usage Pattern** | Server-side authentication check |

---

## API Reference

### `isAuthenticated()`

Checks if the current request contains a valid authentication token.

#### Signature
```javascript
isAuthenticated(): Promise<boolean>
```

#### Parameters
None

#### Return Value

| Type | Description |
|------|-------------|
| `Promise<boolean>` | `true` if user is authenticated, `false` otherwise |

#### Implementation Details

- **Cookie Access:** Retrieves `auth_token` from request cookies
- **Token Verification:** Uses `verifyToken()` from JWT module
- **Error Handling:** Returns `false` for any verification failure
- **Async Operation:** Handles cookie access and token verification asynchronously

---

## Request Flow

```
Client Request → Server Component
        ↓
  Extract auth_token cookie
        ↓
  verifyToken(token)
        ↓
  Valid Token? → Yes: true
        ↓           No: false
  Return boolean
```

---

## Usage Examples

### Example 1: Basic Authentication Check
```javascript
import { isAuthenticated } from '@/lib/auth';

export default async function ProtectedPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    return <div>Please log in to access this page.</div>;
  }
  
  return <div>Welcome to the protected content!</div>;
}
```

### Example 2: Conditional Rendering
```javascript
export default async function Header() {
  const isLoggedIn = await isAuthenticated();
  
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        {isLoggedIn ? (
          <Link href="/profile">Profile</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
```

### Example 3: API Route Protection
```javascript
export async function GET() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    return Response.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  // Proceed with authenticated request
  return Response.json({ data: 'Protected data' });
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Cookie Presence** | Checks for `auth_token` cookie existence | Returns `false` if missing |
| **Token Format** | Relies on JWT module validation | Returns `false` for invalid tokens |
| **Token Expiration** | JWT module handles expiration | Returns `false` for expired tokens |
| **Server Context** | Must be called in server components | Runtime error if used in client |

---

## Response Examples

| Scenario | Cookie Value | Token Valid | Return Value |
|----------|--------------|-------------|--------------|
| **Valid Token** | `eyJhbGciOiJIUzI1NiIs...` | ✅ Valid | `true` |
| **Missing Cookie** | `null` | N/A | `false` |
| **Invalid Token** | `invalid.jwt.token` | ❌ Invalid | `false` |
| **Expired Token** | `eyJhbGciOiJIUzI1NiIs...` | ❌ Expired | `false` |

---

## Error Handling

### Current State
**Silent Failure:** Function returns `false` for all authentication failures without throwing errors.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **Cookie Access Error** | Server environment issues | Returns `false` | **Add error logging** |
| **JWT Module Failure** | `verifyToken()` throws | Returns `false` | **Wrap in try-catch** |
| **Environment Variables** | Missing `JWT_SECRET` | Token verification fails | **Validate environment setup** |

### Recommended Error Handling Pattern
```javascript
export async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) return false;
    
    const payload = await verifyToken(token);
    return !!payload;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}
```

---

## Security Considerations

### 1. **Token Storage**
- **Secure Cookies:** Tokens stored in HTTP-only cookies (assumed)
- **Same-Site Policy:** Should use `SameSite` attribute for CSRF protection
- **HTTPS Only:** Cookies should be `secure` in production

### 2. **Token Validation**
- **Signature Verification:** Uses HS256 algorithm for token integrity
- **Expiration Checks:** 30-day expiration enforced by JWT module
- **Payload Trust:** Only trusts verified token payloads

### 3. **Server-Side Only**
- **Server Components:** Function only works in Next.js server components
- **No Client Exposure:** Cannot be used in client-side code
- **Request Context:** Validates authentication per request

### 4. **Error Information Leakage**
- **Silent Failures:** Doesn't reveal why authentication failed
- **Security by Obscurity:** Prevents enumeration attacks
- **Logging:** Consider logging failed attempts for monitoring

---

## Important Business Rules

### 1. **Authentication State**
- **Rule:** Authentication status must be checked on every protected request
- **Enforcement:** Function called in server components before rendering
- **Business Impact:** Ensures only authenticated users access protected content

### 2. **Token Validity**
- **Rule:** Only valid, non-expired tokens are accepted
- **Enforcement:** JWT verification with signature and expiration checks
- **Reliability:** Prevents use of tampered or expired credentials

### 3. **Cookie Dependency**
- **Rule:** Authentication relies on `auth_token` cookie presence
- **Implication:** Cookie must be set during login process
- **Session Management:** Cookie expiration should align with token expiration

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **Server Components** | Page-level authentication checks |
| **API Routes** | Route protection before processing |
| **Layout Components** | Conditional navigation/header rendering |
| **Middleware** | Request-level authentication validation |

### Common Calling Patterns

```javascript
// Pattern 1: Page Protection
export default async function Dashboard() {
  const authenticated = await isAuthenticated();
  if (!authenticated) redirect('/login');
  // Render dashboard
}

// Pattern 2: Conditional UI
export async function UserMenu() {
  const isLoggedIn = await isAuthenticated();
  return isLoggedIn ? <UserDropdown /> : <LoginButton />;
}

// Pattern 3: API Route Guard
export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Process authenticated request
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Execution Time** | ~1-5ms | Depends on JWT verification complexity |
| **I/O Operations** | Cookie read + JWT verify | Minimal overhead |
| **Caching** | None | Must validate on each request |
| **Async Impact** | Non-blocking | Uses async/await pattern |

---

## Dependencies

| Module | Purpose | Version |
|--------|---------|---------|
| `next/headers` | Cookie access in server components | Next.js 15+ |
| `@/lib/jwt` | Token verification logic | Local module |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial implementation |

---

## Future Enhancements

- [ ] Add detailed error logging for failed authentications
- [ ] Implement rate limiting for authentication checks
- [ ] Add support for multiple authentication methods
- [ ] Implement session refresh logic
- [ ] Add JSDoc comments for better IDE support

---

## Related Modules

- `@/lib/jwt` - JWT token generation and verification
- `@/lib/middleware` - API route protection middleware

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
