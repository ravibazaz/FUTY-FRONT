# API Middleware Module Documentation

## Module Purpose

The `middleware` module provides API route protection and user context enrichment for the FUTY application. It validates JWT tokens from request headers and populates user data with related team, club, league, and ground information through database population.

**Key Responsibility:** Authenticate API requests and provide comprehensive user context including team affiliations, club details, league information, and ground locations.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/middleware.js` |
| **Type** | API Authentication Middleware |
| **Dependencies** | JWT, User models, Mongoose population |
| **Exports** | `protectApiRoute()` |
| **Usage Pattern** | Request preprocessing for protected routes |

---

## Architecture

### Authentication Flow

| Step | Process | Data Involved |
|------|---------|---------------|
| **Header Extraction** | Extract Bearer token | `Authorization: Bearer <token>` |
| **Token Validation** | Verify JWT signature | Token payload extraction |
| **User Lookup** | Find user by email | User document retrieval |
| **Data Population** | Load related entities | Team, club, league, ground data |
| **Context Return** | Provide enriched user object | Complete user context |

### Data Population Chain

```
User → Team → Ground
   ↓      ↓
  Club → League
   ↓
 Ground (duplicate resolution)
```

---

## API Reference

### `protectApiRoute(req)`

Authenticates API requests and returns user context with populated relationships.

#### Signature
```javascript
protectApiRoute(req: Request): Promise<{success: boolean, user?: object, message?: string}>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `req` | `NextRequest` | Yes | Next.js API route request object |

#### Return Value

| Type | Description |
|------|-------------|
| `Promise<object>` | Authentication result with user data or error message |

#### Success Response
```javascript
{
  success: true,
  user: {
    _id: "...",
    email: "user@example.com",
    team_id: {
      name: "Team Name",
      ground: { name: "Stadium", lat: 51.5, lng: -0.1 },
      club: {
        name: "Club Name",
        league: { title: "Premier League" }
      }
    }
    // ... other user fields
  }
}
```

#### Error Response
```javascript
{
  success: false,
  message: "Unauthorized: Invalid or expired token"
}
```

---

## Request Flow

```
API Request → Extract Authorization Header
        ↓
  Validate Bearer token format
        ↓
  verifyToken() → Decode JWT
        ↓
  User.findOne({ email: payload.email })
        ↓
  Populate team_id with ground, club, league
        ↓
  Return { success: true, user }
```

---

## Usage Examples

### Example 1: Protected API Route
```javascript
import { protectApiRoute } from '@/lib/middleware';

export async function GET(request) {
  const authResult = await protectApiRoute(request);
  
  if (!authResult.success) {
    return Response.json(
      { error: authResult.message },
      { status: 401 }
    );
  }
  
  const { user } = authResult;
  
  // Proceed with authenticated request
  return Response.json({ 
    message: `Hello ${user.email}!`,
    team: user.team_id?.name 
  });
}
```

### Example 2: User Profile API
```javascript
export async function GET(request) {
  const authResult = await protectApiRoute(request);
  
  if (!authResult.success) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { user } = authResult;
  
  // User has full team/club/league context
  return Response.json({
    user: {
      id: user._id,
      email: user.email,
      team: user.team_id?.name,
      club: user.team_id?.club?.name,
      league: user.team_id?.club?.league?.title,
      ground: user.team_id?.ground?.name,
      location: user.team_id?.ground ? {
        lat: user.team_id.ground.lat,
        lng: user.team_id.ground.lng
      } : null
    }
  });
}
```

### Example 3: Team-Based Authorization
```javascript
export async function POST(request) {
  const authResult = await protectApiRoute(request);
  
  if (!authResult.success) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { user } = authResult;
  const { teamId } = await request.json();
  
  // Check if user belongs to the team
  if (user.team_id?._id.toString() !== teamId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Proceed with team-specific operation
  return Response.json({ success: true });
}
```

### Example 4: League-Specific Data
```javascript
export async function GET(request) {
  const authResult = await protectApiRoute(request);
  
  if (!authResult.success) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { user } = authResult;
  
  // Get matches from user's league
  const leagueId = user.team_id?.club?.league?._id;
  
  if (!leagueId) {
    return Response.json({ error: 'No league affiliation' }, { status: 400 });
  }
  
  const matches = await Match.find({ leagueId });
  return Response.json({ matches });
}
```

### Example 5: Location-Based Features
```javascript
export async function GET(request) {
  const authResult = await protectApiRoute(request);
  
  if (!authResult.success) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { user } = authResult;
  
  const userLocation = user.team_id?.ground;
  
  if (!userLocation) {
    return Response.json({ error: 'No ground location' }, { status: 400 });
  }
  
  // Find nearby teams or facilities
  const nearbyTeams = await findNearbyTeams(
    userLocation.lat, 
    userLocation.lng
  );
  
  return Response.json({ nearbyTeams });
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Authorization Header** | Checks for Bearer token | Returns 401 if missing |
| **Token Format** | Validates Bearer prefix | Returns 401 if invalid |
| **JWT Verification** | Uses verifyToken function | Returns 401 if invalid |
| **User Existence** | Queries database by email | Returns 401 if not found |
| **Data Population** | Handles missing relationships | Gracefully handles null references |

---

## Response Examples

### Successful Authentication
```javascript
{
  success: true,
  user: {
    _id: "507f1f77bcf86cd799439011",
    email: "player@example.com",
    team_id: {
      name: "Arsenal FC",
      ground: {
        name: "Emirates Stadium",
        lat: 51.5549,
        lng: -0.1084
      },
      club: {
        name: "Arsenal",
        league: {
          title: "Premier League"
        }
      }
    }
  }
}
```

### Authentication Failure
```javascript
{
  success: false,
  message: "Unauthorized: No token provided"
}
```

### Token Expired
```javascript
{
  success: false,
  message: "Unauthorized: Invalid or expired token"
}
```

---

## Error Handling

### Current State
**HTTP Status 200:** Returns success/error in response body with status 200, not standard HTTP status codes.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **Database Connection** | MongoDB unreachable | User lookup fails | **Add connection error handling** |
| **Population Errors** | Missing referenced documents | Incomplete user data | **Handle population failures** |
| **Token Verification** | JWT library errors | Authentication fails | **Wrap in try-catch blocks** |
| **Memory Usage** | Large population chains | Performance impact | **Optimize population queries** |

### Recommended Error Handling Pattern
```javascript
export async function protectApiRoute(req) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Unauthorized: No token provided" };
    }
    
    const token = authHeader.split(" ")[1];
    const userdata = await verifyToken(token);
    
    if (!userdata) {
      return { success: false, message: "Unauthorized: Invalid token" };
    }
    
    const user = await User.findOne({ email: userdata.email })
      .populate(populationConfig)
      .select('-__v -password');
    
    if (!user) {
      return { success: false, message: "Unauthorized: User not found" };
    }
    
    return { success: true, user };
    
  } catch (error) {
    console.error("Middleware error:", error);
    return { success: false, message: "Unauthorized: Authentication failed" };
  }
}
```

---

## Security Considerations

### 1. **Token Validation**
- **JWT Verification:** Proper signature and expiration validation
- **Single Use Assumption:** Tokens validated on each request
- **No Token Storage:** Stateless authentication approach

### 2. **Data Exposure**
- **Population Depth:** Exposes related team/club/league data
- **Sensitive Fields:** Excludes password and version fields
- **Context Awareness:** Provides necessary business context

### 3. **Authorization Scope**
- **User-Based Access:** Authentication confirms user identity
- **Business Logic:** Additional authorization checks needed
- **Data Filtering:** Population provides context for access control

### 4. **Performance Impact**
- **Database Queries:** Multiple population operations per request
- **N+1 Problem:** Potential for inefficient queries
- **Caching Strategy:** No built-in caching of populated data

---

## Important Business Rules

### 1. **Complete User Context**
- **Rule:** User data must include full team/club/league hierarchy
- **Enforcement:** Mandatory population of all relationships
- **Business Impact:** Enables league-specific and team-based features

### 2. **Authentication Required**
- **Rule:** All protected API routes require valid authentication
- **Implication:** No anonymous access to sensitive operations
- **Consistency:** Uniform authentication across all endpoints

### 3. **Data Integrity**
- **Rule:** User relationships must be validated and current
- **Database Constraints:** Foreign key relationships maintained
- **Real-time Updates:** Population reflects current database state

### 4. **Error Transparency**
- **Rule:** Authentication failures provide clear error messages
- **User Experience:** Informative error responses
- **Debugging:** Detailed error logging for troubleshooting

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **API Routes** | Protecting REST endpoints |
| **User Operations** | Profile management, team operations |
| **League Features** | League-specific data access |
| **Match Management** | Team and ground related operations |
| **Notification Systems** | User-specific notifications |

### Common Integration Patterns

```javascript
// Pattern 1: Route Handler Wrapper
export function withAuth(handler) {
  return async (request) => {
    const auth = await protectApiRoute(request);
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 401 });
    }
    
    request.user = auth.user;
    return handler(request);
  };
}

// Pattern 2: Team Authorization
export async function requireTeamAccess(user, teamId) {
  if (user.team_id?._id.toString() !== teamId) {
    throw new Error('Access denied: Not a team member');
  }
}

// Pattern 3: League Context
export async function getUserLeague(user) {
  return user.team_id?.club?.league;
}

// Pattern 4: Location Services
export async function getUserGround(user) {
  return user.team_id?.ground;
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Authentication Time** | ~50-200ms | Database queries + population |
| **Memory Usage** | Variable | Depends on population depth |
| **Database Queries** | 1-5 queries | User lookup + populations |
| **Scalability** | Medium | Database load increases with usage |

---

## Database Relationships

### Population Chain

| Level | Model | Fields Populated | Purpose |
|-------|-------|------------------|---------|
| **1** | User | `team_id` | Get user's team |
| **2** | Team | `ground`, `club` | Get team's location and club |
| **3** | Club | `league` | Get club's league |
| **3** | Ground | (direct) | Location data |
| **4** | League | (direct) | League information |

### Query Optimization

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| **Selective Fields** | `.select('-__v -password')` | Reduce data transfer |
| **Population Filtering** | Specific field selection | Minimize payload |
| **Index Usage** | Email index on User | Fast user lookups |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial middleware with JWT auth and data population |

---

## Future Enhancements

- [ ] Add role-based access control (RBAC)
- [ ] Implement request rate limiting
- [ ] Add API key authentication support
- [ ] Implement token refresh functionality
- [ ] Add request logging and analytics
- [ ] Optimize database queries with caching
- [ ] Add support for multiple authentication methods
- [ ] Implement fine-grained permission system

---

## Related Modules

- `@/lib/jwt.js` - JWT token verification
- `@/lib/models/User.js` - User data model
- `@/lib/models/Teams.js` - Team relationship data
- `@/lib/models/Clubs.js` - Club relationship data
- `@/lib/models/Leagues.js` - League relationship data
- `@/lib/models/Grounds.js` - Ground location data

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
