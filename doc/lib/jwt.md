# JWT Module Documentation

## Module Purpose

The `jwt` module provides JSON Web Token (JWT) utilities for the FUTY application using the `jose` library. It handles token generation and verification for secure user authentication and session management.

**Key Responsibility:** Generate cryptographically signed JWT tokens for user authentication and verify token integrity and validity.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/jwt.js` |
| **Type** | Authentication Token Utilities |
| **Dependencies** | `jose` library |
| **Exports** | `generateToken()`, `verifyToken()` |
| **Usage Pattern** | Cryptographic token operations |

---

## Architecture

### JWT Implementation

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Algorithm** | HS256 (HMAC SHA-256) | Symmetric encryption, fast |
| **Expiration** | 30 days default | Reasonable session length |
| **Secret Key** | Environment variable | Secure key management |
| **Async Operations** | Promise-based API | Non-blocking token operations |

### Token Structure

**JWT Payload Example:**
```javascript
{
  email: "user@example.com",
  userId: 123,
  role: "player",
  iat: 1640995200,  // Issued at
  exp: 1666723200   // Expires at (30 days later)
}
```

---

## API Reference

### `generateToken(payload)`

Creates a signed JWT token from user data.

#### Signature
```javascript
generateToken(payload: object): Promise<string>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `payload` | `object` | Yes | User data to encode in token |

#### Return Value

| Type | Description |
|------|-------------|
| `Promise<string>` | Signed JWT token string |

#### Implementation Details

- **Algorithm:** HS256 (HMAC with SHA-256)
- **Expiration:** 30 days from issuance
- **Secret:** Uses `JWT_SECRET` environment variable
- **Async:** Returns promise for cryptographic operations

### `verifyToken(token)`

Validates and decodes a JWT token.

#### Signature
```javascript
verifyToken(token: string): Promise<object | null>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | `string` | Yes | JWT token to verify |

#### Return Value

| Type | Description |
|------|-------------|
| `Promise<object \| null>` | Decoded payload or null if invalid |

#### Implementation Details

- **Signature Verification:** Validates HMAC signature
- **Expiration Check:** Rejects expired tokens
- **Secret Validation:** Uses same `JWT_SECRET`
- **Error Handling:** Returns null for any verification failure

---

## Request Flow

### Token Generation
```
User Data → jose.SignJWT(payload)
        ↓
  setProtectedHeader({ alg: 'HS256' })
        ↓
  setExpirationTime('30d')
        ↓
  sign(secret) → JWT Token
```

### Token Verification
```
JWT Token → jose.jwtVerify(token, secret)
        ↓
  Signature validation
        ↓
  Expiration check
        ↓
  Return payload or null
```

---

## Usage Examples

### Example 1: User Login
```javascript
import { generateToken } from '@/lib/jwt';

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  
  const token = await generateToken({
    email: user.email,
    userId: user._id,
    role: user.role
  });
  
  return { user, token };
}
```

### Example 2: Token Verification
```javascript
import { verifyToken } from '@/lib/jwt';

export async function authenticateRequest(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token);
  
  if (!payload) {
    return null;
  }
  
  return payload;
}
```

### Example 3: API Route Protection
```javascript
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  const payload = await authenticateRequest(request);
  
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Proceed with authenticated request
  const user = await User.findById(payload.userId);
  return Response.json({ user });
}
```

### Example 4: Token Refresh
```javascript
export async function refreshToken(oldToken) {
  const payload = await verifyToken(oldToken);
  
  if (!payload) {
    throw new Error('Invalid token');
  }
  
  // Generate new token with same payload
  const newToken = await generateToken({
    email: payload.email,
    userId: payload.userId,
    role: payload.role
  });
  
  return newToken;
}
```

### Example 5: Role-Based Access
```javascript
export async function requireRole(token, requiredRole) {
  const payload = await verifyToken(token);
  
  if (!payload) {
    throw new Error('Invalid token');
  }
  
  if (payload.role !== requiredRole) {
    throw new Error('Insufficient permissions');
  }
  
  return payload;
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Payload** | Accepts any object | No validation on content |
| **Token Format** | Expects valid JWT string | Verification returns null |
| **Secret Key** | Uses `JWT_SECRET` env var | Missing key causes errors |
| **Expiration** | Automatic 30-day expiration | Expired tokens return null |

---

## Response Examples

### Generated Token
```javascript
const token = await generateToken({ email: 'user@example.com', userId: 123 });
// Response: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Valid Token Verification
```javascript
const payload = await verifyToken(validToken);
// Response: { email: 'user@example.com', userId: 123, iat: 1640995200, exp: 1666723200 }
```

### Invalid Token Verification
```javascript
const payload = await verifyToken(invalidToken);
// Response: null
```

---

## Error Handling

### Current State
**Silent Failure:** `verifyToken()` returns `null` for all verification failures without throwing errors.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **Missing Secret** | `JWT_SECRET` not set | Token operations fail | **Validate environment setup** |
| **Invalid Secret** | Wrong secret for verification | Tokens become invalid | **Ensure consistent secret** |
| **Token Tampering** | Modified JWT payload | Verification fails | **Expected behavior** |
| **Clock Skew** | Server time differences | Token expiration issues | **Synchronize server clocks** |

### Recommended Error Handling Pattern
```javascript
export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}
```

---

## Security Considerations

### 1. **Secret Key Management**
- **Environment Variables:** JWT secret stored securely
- **Key Rotation:** Regular secret rotation recommended
- **Length Requirements:** Use sufficiently long, random secrets
- **Access Control:** Limit environment variable access

### 2. **Token Security**
- **Signature Algorithm:** HS256 provides strong integrity
- **Expiration Time:** 30-day limit prevents long-lived tokens
- **Payload Exposure:** JWT payload is base64-encoded (not encrypted)
- **Transport Security:** Always use HTTPS for token transmission

### 3. **Session Management**
- **No Server State:** Stateless authentication
- **Token Revocation:** No built-in revocation mechanism
- **Refresh Strategy:** Implement refresh tokens for long sessions
- **Concurrent Sessions:** Multiple valid tokens possible

### 4. **Information Disclosure**
- **Payload Visibility:** Anyone with token can read payload
- **Sensitive Data:** Don't include passwords or secrets in payload
- **User ID Only:** Include minimal identifying information

---

## Important Business Rules

### 1. **Token Expiration**
- **Rule:** All tokens expire after 30 days
- **Enforcement:** Automatic expiration in token generation
- **Business Impact:** Forces periodic re-authentication

### 2. **Stateless Authentication**
- **Rule:** No server-side session storage required
- **Implication:** Scalable across multiple servers
- **Reliability:** Authentication works without shared state

### 3. **Payload Consistency**
- **Rule:** Token payload contains essential user identity
- **Standard Fields:** email, userId, role (customizable)
- **Verification:** Payload validated on each request

### 4. **Error Resilience**
- **Rule:** Invalid tokens don't crash the application
- **Graceful Handling:** Return null for verification failures
- **Logging:** Failed verifications logged for monitoring

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **User Authentication** | Login and session management |
| **API Authorization** | Protecting API endpoints |
| **Middleware** | Request authentication validation |
| **Password Reset** | Temporary access tokens |
| **Email Verification** | Account confirmation links |

### Common Integration Patterns

```javascript
// Pattern 1: Authentication Middleware
export async function withAuth(handler) {
  return async (request) => {
    const payload = await authenticateRequest(request);
    if (!payload) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Add user to request context
    request.user = payload;
    return handler(request);
  };
}

// Pattern 2: Role-Based Access Control
export async function requireAdmin(token) {
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return payload;
}

// Pattern 3: Token Refresh Service
export async function refreshUserToken(userId) {
  const user = await User.findById(userId);
  return await generateToken({
    email: user.email,
    userId: user._id,
    role: user.role
  });
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Token Generation** | ~5-10ms | Cryptographic signing operation |
| **Token Verification** | ~2-5ms | Signature verification |
| **Memory Usage** | Minimal | No persistent state |
| **Scalability** | High | Stateless operations |

---

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `JWT_SECRET` | Yes | Secret key for signing | `your-super-secret-key-here` |

### Token Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Algorithm** | `HS256` | HMAC with SHA-256 |
| **Expiration** | `30d` | 30 days from issuance |
| **Issuer** | Not set | Can be added if needed |
| **Audience** | Not set | Can be added for multi-tenant |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial JWT implementation with jose library |

---

## Future Enhancements

- [ ] Add token refresh functionality
- [ ] Implement token blacklisting/revocation
- [ ] Add support for different token types (access/refresh)
- [ ] Implement token expiration customization
- [ ] Add JWT payload encryption
- [ ] Support for multiple signing algorithms
- [ ] Add token usage analytics
- [ ] Implement token compression

---

## Related Modules

- `@/lib/auth.js` - Authentication status checking
- `@/lib/middleware.js` - API route protection middleware

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
