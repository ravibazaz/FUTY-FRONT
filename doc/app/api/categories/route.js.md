# GET /api/categories

## Purpose

Returns active categories with parent details.

## File Location

`app/api/categories/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to the database using `connectDB()` whenever present.
- Reads category data from the `Categories` collection.

## Query Parameters

- None

## Request Body

- None

## Response Example

```json
{
  "categories": [ ... ]
}
```

## Imports

- `import { connectDB } from '@/lib/db';`
- `import Categories from '@/lib/models/Categories';`

## Notes

- Populates parent category metadata using `populate("parent_cat_id")`.