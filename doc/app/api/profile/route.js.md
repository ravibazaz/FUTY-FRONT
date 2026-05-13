# GET /api/profile

## Purpose

Returns authenticated profile data together with notification and friendly match usage summaries.

## File Location

`app/api/profile/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Verifies the authenticated user using `protectApiRoute(req)`.
- Connects to the database using `connectDB()`.
- Counts unread notifications for the authenticated user.
- Computes friendly creation and acceptance totals for the current week, current month, and all time.
- Returns the authenticated user object plus summary metrics.

## Query Parameters

None

## Request Body

None

## Response

### Success Response (200)

```json
{
  "success": true,
  "message": "Welcome to the profile page!",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "account_type": "string",
    "profile_image": "string"
  },
  "unreadcount": 5,
  "total_friendlys_created_by_me_in_this_week": 2,
  "total_friendlys_created_by_me_in_this_month": 8,
  "total_friendlys_created_by_me_yet": 27,
  "total_friendlys_accepted_by_me_in_this_week": 1,
  "total_friendlys_accepted_by_me_in_this_month": 4,
  "total_friendlys_accepted_by_me_yet": 15
}
```

### Error Responses

- **401 Unauthorized**: Missing or invalid authentication.
- **500 Internal Server Error**: Database or query failure.

## Implementation Details

- Uses `Notification.countDocuments()` to count unread notifications where `isRead` is false.
- Uses MongoDB aggregation with `$facet` to compute friendly counts grouped by week, month, and total.
- The week uses Monday as the start of the week.
- Counts friendlies created by the user (`created_by_user`) and accepted by the user (`accepted_by_user`).
- Uses `.lean()`? Not used here; the endpoint returns raw aggregation results.

## Security Notes

- Protected endpoint returns personal user data and activity summaries.
- No open query parameters are accepted.
- Depends on correct authentication middleware behavior.

## Usage Notes

- Use this endpoint to populate a profile dashboard with unread notification count and friendly statistics.
- The `accepted_by_user` aggregation uses the field name `accepteddAt` as written in source; if the schema differs, accepted counts may be incorrect.