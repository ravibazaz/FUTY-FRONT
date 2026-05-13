
# GET /api/tournaments/add

## Purpose

Returns all tournaments.

## File Location

`app/api/tournaments/add/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB.
- Returns all `Tournaments` documents.

## Notes

- This path duplicates the root tournaments list behavior.
