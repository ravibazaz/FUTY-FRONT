# POST /api/grounds/add

## Purpose

Create a new ground record with geolocation and uploaded images.

## File Location

`app/api/grounds/add/route.js`

## HTTP Method

POST

## Authentication Required

Yes

## Behavior

- Validates the authenticated user via `protectApiRoute(req)`.
- Parses multipart `FormData` from the request.
- Converts form entries into a plain object and collects `images` entries.
- Resolves a postal code to latitude/longitude using `getLatLng(pin)`.
- Validates required fields using the `GroundSchema` Zod schema.
- Saves image data as files under `uploads/grounds` and stores their paths.
- Creates a new `Grounds` document with location coordinates and facility details.
- Returns the newly created ground document in the response.

## Request Body

- Multipart `FormData`
- Required fields:
  - `name`
  - `add1`
  - `content`
  - `county`
  - `pin`
  - `lat`
  - `long`
  - `isHomeGround`
- Optional fields:
  - `images`: one or more Base64-encoded image values
  - `facilities`: repeated field entries representing ground features

## Response Example

Success:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Central Sports Ground",
    "add1": "123 Field Way",
    "content": "Full-size pitch with floodlights",
    "county": "Cityshire",
    "pin": "AB12 3CD",
    "lat": "51.500",
    "long": "-0.123",
    "images": ["/uploads/grounds/1700000000_ab12cd.jpg"],
    "location": {
      "type": "Point",
      "coordinates": [ -0.123, 51.500 ]
    }
  },
  "message": "Successfully added ground!"
}
```

Validation error:

```json
{
  "success": false,
  "message": {
    "name": "Ground Name is required",
    "pin": "Post Code is required"
  }
}
```

## Implementation Notes

- The route stores images as files on disk and saves their generated URLs.
- `lat` and `long` values are overwritten by `getLatLng(pin)` results.
- The schema enforces Base64-encoded image strings.
- The response uses HTTP 200 for both success and validation failures.

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Grounds from "@/lib/models/Grounds";`
- `import { z } from "zod";`
- `import { v4 as uuidv4 } from "uuid";`
- `import path from "path";`
- `import { promises as fs } from "fs";`
- `import { getLatLng } from "@/lib/geocode";`

## Notes

- This endpoint is protected and requires authentication.
- It writes uploaded images to `uploads/grounds`.