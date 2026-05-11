# Authentication

## Login Process

1. User submits email/password
2. API validates credentials
3. JWT token generated
4. Token stored in HTTP-only cookie
5. Middleware verifies token

## Protected Routes

- /admin/dashboard
- /admin/leagues
- /admin/managers