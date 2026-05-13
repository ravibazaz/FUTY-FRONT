
# POST /api/push/send

## Purpose

Sends a Firebase push notification to a single device token using the server-side Firebase Admin SDK.

## File Location

`app/api/push/send/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Reads JSON body from the request.
- Builds an FCM message payload with `token`, `notification.title`, `notification.body`, and optional `data`.
- Sends the message using `admin.messaging().send(message)`.
- Returns success with the sent message ID, or an error message if the send fails.

## Request Body

```json
{
  "token": "string",
  "title": "Notification Title",
  "body": "Notification body text",
  "data": {
    "key": "value"
  }
}
```

## Response

### Success Response (200)

```json
{
  "success": true,
  "messageId": "string"
}
```

### Failure Response (200)

```json
{
  "success": false,
  "error": "string"
}
```

## Implementation Details

- Uses `admin` from `@/lib/firebaseAdmin` and `NextResponse` from `next/server`.
- The endpoint runs under the `nodejs` runtime.
- No authentication or validation is enforced by this handler.

## Security Notes

- This endpoint is public, so the client must ensure message payloads are trusted.
- Invalid tokens or Firebase failures return a `success: false` response with error details.
