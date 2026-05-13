
# POST /api/users/faninvitationcodecheck

## Purpose

Validates a fan invitation code and returns the associated manager details.

## File Location

`app/api/users/faninvitationcodecheck/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates `fan_invitation_code`.
- Looks up the invitation record.
- Populates the inviting manager and the manager's team/club/league.

## Request Body

```json
{
  "fan_invitation_code": "string"
}
```

## Response

```json
{
  "success": true,
  "data": { /* invitation and manager details */ },
  "message": "Found invitation code"
}
```

## Notes

- Returns `success: false` when the code is invalid.
