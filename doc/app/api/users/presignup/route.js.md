**Title:** Presignup API (POST /api/users/presignup)

## Overview

This document describes the `presignup` endpoint used by the Futy mobile/web clients to perform an initial user pre-registration. The endpoint validates input, creates a database record marked as `user_type: 'presignup'`, sends an OTP by SMS using Twilio, stores a login code, persists an optional profile image, and notifies administrators via Brevo.

Implementation: [app/api/users/presignup/route.js](app/api/users/presignup/route.js#L1-L300)

## Endpoint

- Method: POST
- Path: `/api/users/presignup`
- Auth: public (used for new user pre-registration)
- Content-Type: `application/json`

## Purpose

- Collect minimal user registration details for verification.
- Prevent duplicate signups (email and telephone uniqueness checks).
- Send a one-time password (OTP) to the user's phone for verification.
- Persist a `presignup` user record for later approval or completion flows.

## Request Schema (validated with Zod)

The server expects a JSON body with the following fields (validation rules are enforced in the implementation):

- `email` (string, required): valid email address
- `password` (string, required): at least 7 characters
- `confirm_password` (string, required): must match `password`
- `name` (string, required): at least 2 characters
- `surname` (string, optional)
- `telephone` (string, required): digits only; 10–11 characters in implementation
- `country_code` (string, required): country dialing code (e.g. `+44` or `44`)
- `account_type` (string, required): e.g. `Player`, `Manager`, `Fan`, etc.
- `fcmtoken` (string, optional): device FCM token
- `pre_signup_team` (string, optional)
- `pre_signup_age_group` (string, optional)
- `nick_name` (string, optional)
- `referee_lavel` (string, optional)
- `profile_image` (string, optional): Base64-encoded data URI `data:image/<type>;base64,...`

Validation failures return a JSON object containing the first validation error per field.

## Workflow / Behaviour

1. Validate request body using Zod schema.
2. Connect to MongoDB via `connectDB()`.
3. Check for existing user by `email` and `telephone`. If found, respond with an error (409 / message).
4. Generate a numeric OTP (the implementation uses a 5-digit code in original; currently generates a 5-digit random number).
5. Send the OTP to the user's phone via Twilio (`client.messages.create`). The `to` field is `country_code + telephone`.
6. If `profile_image` is provided as a base64 data URI, the server decodes it and writes it to disk under `uploads/players` (when `account_type === 'Player'`) or a general `uploads` path. The resulting public path is stored on the user record.
7. Hash the password with bcrypt and create a `User` document with `user_type: 'presignup'` and the `login_code` set to the OTP.
8. Send an administrative notification email via Brevo (best-effort; failures are logged but do not block success).
9. Return a success JSON response containing the `login OTP` and `isVerified: false`.

## Example Request

POST /api/users/presignup

```json
{
  "email": "user@example.com",
  "password": "securePass1",
  "confirm_password": "securePass1",
  "name": "John",
  "telephone": "07123456789",
  "country_code": "+44",
  "account_type": "Player",
  "profile_image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

## Example Success Response

```json
{
  "success": true,
  "data": {
    "Login OTP": 12345,
    "User Type": "presignup",
    "isVerified": false
  },
  "message": "User created successfully. Please check login OTP in mobile."
}
```

## Error Responses

- Validation error: 400 (response contains field-level messages)
- Duplicate email/telephone: 409 with explanatory message
- SMS sending failure: original implementation returns a 200 with `message: "SMS sending failed"` — consider updating to return 502/503 for clarity in future.
- Internal server errors: 500 with generic message

## Implementation Notes & Caveats

- The implementation performs server-side validation with Zod and returns a flattened `message` map of first errors per field.
- The route writes uploaded profile images to the filesystem. Ensure the running host allows writes to the `uploads` directory and that the directory is served by the app (or moved to cloud storage in production).
- OTP length and entropy: Consider using a 6-digit OTP for better entropy and standardization.
- SMS delivery errors: Twilio errors are caught and returned as an `SMS sending failed` message in the current code; monitoring/logging should be enabled to surface transient service errors.
- The implementation sends an admin notification via Brevo using `BREVO_REST_URL` and `BREVO_API_KEY`. Failures in notification are logged but do not prevent successful presignup.

## Environment Variables Used

- `TWILIO_ACCOUNT_SID` — Twilio account SID
- `TWILIO_AUTH_TOKEN` — Twilio auth token
- `TWILIO_PHONE_NUMBER` — Twilio 'from' number
- `BREVO_REST_URL` — Brevo REST endpoint for sending transactional emails
- `BREVO_API_KEY` — Brevo API key
- `BREVO_MAIL_FROM` / `MAIL_FROM_NAME` — Sender details for admin notifications

See full environment documentation: [doc/07-environment-variables.md](doc/07-environment-variables.md)

## Security Considerations

- Ensure `JWT_SECRET` and other secrets are not present in repo; use environment variables or secret manager.
- Rate-limit this endpoint to prevent abuse and SMS spam (the implementation does not show explicit rate limiting).
- Validate and sanitize file uploads; the code expects base64 data URIs and writes raw files — consider scanning and/or offloading to object storage.
- Store hashed passwords only (bcrypt used in implementation) and do not log sensitive fields.

## References

- Implementation: [app/api/users/presignup/route.js](app/api/users/presignup/route.js#L1-L300)
- User model: [lib/models/Users](lib/models/Users)
- Environment variables: [doc/07-environment-variables.md](doc/07-environment-variables.md)

---

*Document created by developer docs generator.*