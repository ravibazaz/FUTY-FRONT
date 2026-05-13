# GET /api/grounds

## Purpose

Retrieve all ground records from the system.

## File Location

`app/api/grounds/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries the `Grounds` collection for every document.
- Returns a JSON payload with the raw `grounds` array.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "grounds": [
    {
      "_id": "...",
      "name": "Central Sports Ground",
      "add1": "123 Field Way",
      "add2": "West District",
      "add3": "Cityville",
      "images": ["/uploads/grounds/1.jpg"],
      "location": {
        "type": "Point",
        "coordinates": [ -0.123, 51.500 ]
      }
    }
  ]
}
```

## Implementation Notes

- The route returns unpaginated results.
- This endpoint is public and does not require authentication.
- It uses `Response.json(...)` instead of `NextResponse`.

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Grounds from '@/lib/models/Grounds';`

## Notes

- If the collection contains many records, clients should implement client-side pagination.
