
# POST /api/users/playerinvitationcodecheck

## Purpose

Validates a player invitation code and returns the associated manager and team details.

## File Location

`app/api/users/playerinvitationcodecheck/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates `player_invitation_code`.
- Looks up the invitation record.
- Populates the inviting manager and the manager's team/club/league.

## Request Body

```json
{
  "player_invitation_code": "string"
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

- Returns `success: false` if the code is invalid.
