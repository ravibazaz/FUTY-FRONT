
# GET /api/uploads/categories/[filename]

## Purpose

Serves uploaded files from the `categories` file upload directory.

## File Location

`app/api/uploads/categories/[filename]/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Reads the `filename` path parameter.
- Serves the file from `uploads/categories/{filename}` on disk.
- Returns `Content-Type` based on the file extension.
- Returns `404` if the file is not found.

## Path Parameters

- `filename`: the name of the uploaded file to fetch

## Response

- Binary file content with the correct MIME type.
- `404` JSON response when the file does not exist.

## Notes

- Intended as a public media/file-serving endpoint.
