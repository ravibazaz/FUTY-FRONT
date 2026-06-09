**Title:** Resend Login Code for Mobile (POST /api/users/resendcodeformobile)

## Overview

This endpoint allows an existing user to request that their login OTP (one-time password) be resent to their mobile number. It validates the provided telephone and country code, locates the user record, generates a numeric OTP, sends it via Twilio SMS, and updates the user's `login_code`, `isVerified`, and `isActive` flags.

Implementation: [app/api/users/resendcodeformobile/route.js](app/api/users/resendcodeformobile/route.js#L1-L200)

## Endpoint

- Method: POST
- Path: `/api/users/resendcodeformobile`
- Auth: public (requires only telephone + country_code)
- Content-Type: `application/json`

## Request Schema (validated with Zod)

- `telephone` (string, required): digits only; 10–11 characters enforced
- `country_code` (string, required): country dialing code (e.g. `+44` or `44`)

Validation failures return a JSON object with field-level messages.

## Workflow / Behaviour

1. Validate the incoming payload with Zod.
2. Connect to MongoDB via `connectDB()`.
3. Find the user by `telephone`. If no user is found, respond with an error message.
4. Generate a random numeric OTP (implementation uses a 5-digit number).
5. Send the OTP using Twilio: `client.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to: country_code + telephone })`.
6. Update the user document with `{ login_code: <otp>, isVerified: false, isActive: false }`.
7. Return a success response if SMS send and update succeed.

## Example Request

POST /api/users/resendcodeformobile

```json
{
  "telephone": "07123456789",
  "country_code": "+44"
}
```

## Example Success Response

```json
{
  "success": true,
  "message": "Sent login OTP successfully to your telephone"
}
```

## Error Responses

- Validation error: 400 (response contains field-level messages)
- Telephone not found: 404/200 depending on implementation (current code returns 200 with message "Telephone does not exists")
- SMS sending failure: current implementation returns a 200 with `message: "SMS sending failed"` — consider returning 502/503
- Internal server error: 500 (current code returns 200 with generic message)

## Environment Variables Used

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

## Security & Operational Notes

- Rate-limit this endpoint to prevent abuse and excessive SMS charges.
- Ensure Twilio credentials are secured and rotated as needed.
- Consider switching to 6-digit OTPs and adding expiration/attempt limits.
- Log SMS send failures and monitor for Twilio delivery issues.

## References

- Implementation: [app/api/users/resendcodeformobile/route.js](app/api/users/resendcodeformobile/route.js#L1-L200)
- User model: [lib/models/Users](lib/models/Users)

*Document generated from source implementation.*