# Login Action Documentation

## Action Purpose

The `loginAction` handles user authentication for the FUTY admin dashboard. It validates credentials, generates JWT tokens, and manages secure cookie-based sessions with automatic redirection to the admin dashboard.

**Key Responsibility:** Authenticate admin users and establish secure sessions.

---

## Action Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `actions/loginAction.js` |
| **Type** | Next.js Server Action |
| **Framework** | Next.js with server-side execution |
| **Authentication** | JWT tokens with HTTP-only cookies |
| **Database** | MongoDB with Mongoose |
| **Validation** | Email/password credential check |
| **Redirect** | `/admin/dashboard` on success |

---

## Key Features

- Admin-only authentication (account_type: 'Admin')
- Password hashing verification with bcrypt
- JWT token generation and secure cookie storage
- Automatic redirection after successful login
- Error handling for invalid credentials
- Cookie-based session management

---

## Action Structure

```javascript
'use server';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import User from '@/lib/models/Users';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState, formData) {
  // Authentication logic
}
```

---

## Authentication Flow

### 1. Cookie Store Access

```javascript
const cookieStore = await cookies();
```

- Accesses Next.js cookie store for session management
- Required for server-side cookie operations

### 2. Form Data Extraction

```javascript
const email = formData.get("email");
const password = formData.get("password");
```

- Extracts email and password from FormData
- Standard form submission handling

### 3. Database Connection

```javascript
await connectDB();
```

- Establishes MongoDB connection
- Required before any database operations

### 4. User Lookup

```javascript
const user = await User.findOne({ email: email, account_type: 'Admin' });
```

- Queries User collection for matching email
- Restricts access to Admin account types only
- Returns user document or null

### 5. Password Verification

```javascript
if (!user || !(await bcrypt.compare(password, user.password))) {
  return { error: "Invalid email or password" };
}
```

- Compares provided password with stored hash
- Uses bcrypt for secure password verification
- Returns error object for invalid credentials

### 6. Token Generation

```javascript
const token = await generateToken({ email: user.email, user_id: user.id });
```

- Generates JWT token with user email and ID
- Uses custom `generateToken` utility function
- Token contains user identification data

### 7. Cookie Storage

```javascript
cookieStore.set('auth_token', token, {
  path: '/',
  httpOnly: true,
  secure: false,  // Explicitly false during local testing
  sameSite: 'Lax',
  maxAge: 60 * 60 * 24,  // 1 day
});
```

**Cookie Configuration:**
- **Name:** `auth_token`
- **Path:** `/` (all routes)
- **HttpOnly:** `true` (prevents JavaScript access)
- **Secure:** `false` (allows HTTP for local development)
- **SameSite:** `Lax` (balanced CSRF protection)
- **MaxAge:** 86400 seconds (24 hours)

### 8. Redirection

```javascript
redirect("/admin/dashboard");
```

- Redirects to admin dashboard on successful authentication
- Uses Next.js `redirect()` for server-side navigation
- Ends request processing

---

## Error Handling

### Invalid Credentials

```javascript
return { error: "Invalid email or password" };
```

- Returned when user not found or password doesn't match
- Generic error message prevents user enumeration
- No specific details about which credential is invalid

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `connectDB` | `@/lib/db` | MongoDB connection |
| `generateToken` | `@/lib/jwt` | JWT token creation |
| `User` | `@/lib/models/Users` | User data model |
| `bcrypt` | `bcryptjs` | Password hashing/verification |
| `cookies` | `next/headers` | Cookie management |
| `redirect` | `next/navigation` | Server-side redirection |

---

## Security Features

- **Admin-Only Access:** Restricts login to Admin account types
- **Password Hashing:** Uses bcrypt for secure password verification
- **HTTP-Only Cookies:** Prevents JavaScript access to tokens
- **JWT Tokens:** Stateless authentication with expiration
- **Secure Headers:** Appropriate cookie security settings
- **CSRF Protection:** SameSite cookie attribute

---

## Usage Example

### In Login Component

```jsx
'use client';
import { loginAction } from '@/actions/loginAction';
import { useActionState } from 'react';

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```

### With Form Validation

```jsx
export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  const handleSubmit = async (formData) => {
    // Client-side validation
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    return formAction(formData);
  };

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Database Schema

### User Model Requirements

```javascript
// Expected User document structure
{
  email: String,      // Required, unique
  password: String,   // Required, bcrypt hash
  account_type: String, // Must be 'Admin' for login
  // other fields...
}
```

---

## API Response Format

### Success Response

- **HTTP Status:** 302 (Redirect)
- **Location:** `/admin/dashboard`
- **Cookies:** `auth_token` set with JWT

### Error Response

```javascript
{
  error: "Invalid email or password"
}
```

---

## Behavior Notes

- Action runs on server-side only
- Form data processed securely server-side
- Cookies set before redirection
- No client-side exposure of authentication logic
- Automatic cleanup of form data after processing

---

## Environment Considerations

### Development

- `secure: false` allows HTTP cookies for local testing
- Consider using `secure: true` for HTTPS-only in production

### Production

- Set `secure: true` for HTTPS-only cookies
- Consider shorter token expiration
- Implement token refresh mechanisms
- Add rate limiting for login attempts

---

## Known Issues / Considerations

1. **Cookie Security:** `secure: false` in development may allow HTTP interception
2. **Token Expiration:** 24-hour expiration may be too long for sensitive admin access
3. **Error Messages:** Generic error prevents user enumeration but reduces UX
4. **Account Type Check:** Hard-coded 'Admin' check may need flexibility
5. **No Rate Limiting:** No protection against brute force attacks

---

## Future Enhancements

- [ ] Implement rate limiting for login attempts
- [ ] Add two-factor authentication (2FA)
- [ ] Implement account lockout after failed attempts
- [ ] Add login attempt logging and monitoring
- [ ] Support for "Remember Me" functionality
- [ ] Add password reset functionality
- [ ] Implement session management and concurrent login limits
- [ ] Add login notifications and alerts
- [ ] Support OAuth/social login providers
- [ ] Add device tracking and management

---

## Testing Recommendations

- Test valid admin login flow
- Test invalid email/password combinations
- Test non-admin account types are rejected
- Verify cookie is set correctly
- Test redirection after successful login
- Check token expiration behavior
- Test cookie security settings
- Verify database connection handling
- Test error response format
- Check bcrypt password verification

---

## Support & Maintenance

- Ensure MongoDB connection is stable
- Monitor JWT token generation performance
- Update cookie security settings for production
- Regularly rotate JWT secrets
- Monitor failed login attempts for security
- Update bcrypt cost factor as hardware improves
- Test with different account types and permissions
- Verify redirect URLs are correct
- Check cookie domain settings for multi-domain deployments
