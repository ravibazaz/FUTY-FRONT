
# POST /api/tournamentaccepted/add

## Purpose

Creates a tournament acceptance record and sends a push notification to the tournament creator.

## File Location

`app/api/tournamentaccepted/add/route.js`

## HTTP Method

POST

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the user.
- Accepts multipart/form-data payload.
- Validates required fields with Zod:
  - `email`
  - `contact`
  - `notes`
  - `accepted_by`
- Creates a new `TournamentAccepted` document.
- Looks up the tournament by `tournament_id` and sends an FCM notification to its creator.

## Form Fields

- `email` (string)
- `contact` (string)
- `notes` (string)
- `accepted_by` (string)
- `tournament_id` (string)

## Response

### Success

```json
{
  "success": true,
  "message": "Successfully accepted tournament!"
}
```

### Failure

- Validation errors return `success: false` and field-specific messages.
- Other failures return `success: false` with the error message.

## Notes

- Uses `createAndSendNotification` to notify the tournament creator.
- The endpoint accepts form-data, not JSON.
