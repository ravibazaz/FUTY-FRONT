# GET /api/agegroups

## Purpose
Returns the complete list of age group records from the FUTY database.
This endpoint is used for age group selection, dropdown population, and any feature that requires the full set of available age groups.

## File Location
`app/api/agegroups/route.js`

## HTTP Method
GET

## Authentication Required
No

## Behavior
- Establishes a MongoDB connection via `connectDB()`.
- Queries the `AgeGroups` collection for every document.
- Returns all age groups in a single JSON response.
- No filtering, pagination, or search is applied.

## Query Parameters
- None

## Request Body
- None

## Response Example
```json
{
  "agegroups": [
    {
      "_id": "6432f88f1e197c1d8a1b4d2f",
      "age_group": "U12",
      "createdAt": "2024-02-05T12:00:00.000Z",
      "updatedAt": "2024-02-05T12:00:00.000Z"
    },
    {
      "_id": "6432f8901e197c1d8a1b4d30",
      "age_group": "U14",
      "createdAt": "2024-02-05T12:00:00.000Z",
      "updatedAt": "2024-02-05T12:00:00.000Z"
    }
  ]
}
```

## Implementation Details
- Imports:
  - `connectDB` from `@/lib/db`
  - `AgeGroups` model from `@/lib/models/AgeGroups`
- Handler steps:
  1. Call `await connectDB()`.
  2. Execute `AgeGroups.find()`.
  3. Return `Response.json({ agegroups })`.

## Notes
- This is a public, read-only endpoint.
- It returns all age groups without any query-based filtering.
- Suitable for UI dropdowns and admin lists where the full set is required.
