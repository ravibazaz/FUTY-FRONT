# GET /api/groundfacilities

## Purpose

Retrieve all ground facility definitions from the database.

## File Location

`app/api/groundfacilities/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB using `connectDB()`.
- Queries the `GroundFacilities` collection for all documents.
- Returns a JSON payload containing the raw `groundfacilities` array.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "groundfacilities": [
    {
      "_id": "...",
      "facilities": "Grass Pitch",
      "description": "Full-size grass playing field",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

## Implementation Notes

- This endpoint is public and does not enforce authentication.
- It returns unpaginated results for the entire collection.
- Consumers should consider client-side pagination if the collection grows large.

## Imports

- `import { connectDB } from '@/lib/db';`
- `import GroundFacilities from '@/lib/models/GroundFacilities';`

## Notes

- The response structure differs from application routes that return `success`/`message` keys.
