
# GET /api/teams/invitationmanagers

## Purpose

Returns all manager invitation records.

## File Location

`app/api/teams/invitationmanagers/route.js`

## HTTP Method

GET

## Authentication Required

No

## Behavior

- Connects to MongoDB.
- Returns all documents from the `ManagerInvitations` collection.

## Request Body

None

## Response

```json
{
  "managers": [
    {
      "_id": "string",
      "manager_email": "string",
      "manager_name": "string",
      "team_id": "string"
    }
  ]
}
```

## Notes

- Public endpoint.
