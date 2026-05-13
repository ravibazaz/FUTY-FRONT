# GET /api/fans

## Purpose
Returns all users that are registered as fans.
This endpoint is used to retrieve the complete fan directory for reporting or administrative use.

## File Location
`app/api/fans/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Connects to MongoDB via `connectDB()`.
- Queries the `Users` collection for records with `account_type: "Fan"`.
- Returns the resulting fan user documents.
- No pagination or filtering is applied.

## Query Parameters
- None

## Request Body
- None

## Response Example
```json
{
  "fans": [
    {
      "_id": "6432f88f1e197c1d8a1b4d2f",
      "name": "John",
      "surname": "Doe",
      "account_type": "Fan",
      "profile_image": "/uploads/users/john.jpg",
      "fan_manger_id": "6432f88f1e197c1d8a1b4d30",
      "createdAt": "2024-02-10T08:00:00.000Z",
      "updatedAt": "2024-02-10T08:00:00.000Z"
    }
  ]
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `Users` model from `@/lib/models/Users`
- Handler steps:
  1. Call `await connectDB()`.
  2. Execute `Users.find({ account_type: "Fan" })`.
  3. Return `Response.json({ fans })`.

## Notes
- This endpoint is public and returns all fan users without authentication.
- For large user sets, consider adding search and pagination in the future.
- Only users with `account_type: "Fan"` are returned.
