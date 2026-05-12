# GET /api/teams/list/[club_id]/[ageGroupId]

## Purpose

Returns API data for the endpoint.

## File Location

`app/api/teams/list/[club_id]/[ageGroupId]/route.js`

## HTTP Method

GET

## Authentication Required

Yes

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Protects the route with `protectApiRoute(req)` and returns authentication errors.
- Parses query parameters from the request URL.
- Returns structured JSON response to the client.
- Reads age group data from the `AgeGroups` collection.
- Uses MongoDB aggregation for advanced filtering.

## Query Parameters

- `q`

## Request Body

- None

## Response Example

```json
{
  "success": true,
  "message": "...",
  "data": ...
}
```

## Imports

- `import { NextResponse } from "next/server";`
- `import { protectApiRoute } from "@/lib/middleware";`
- `import { connectDB } from '@/lib/db';`
- `import Teams from "@/lib/models/Teams";`
- `import AgeGroups from "@/lib/models/AgeGroups";`
- `import mongoose from 'mongoose';`

## Notes

- This endpoint is protected and requires valid authentication.