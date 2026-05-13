
# POST /api/users/managerinvitationcodecheck

## Purpose

Validates a manager invitation code and returns the team, club, league, and age group details.

## File Location

`app/api/users/managerinvitationcodecheck/route.js`

## HTTP Method

POST

## Authentication Required

No

## Behavior

- Validates `manager_invitation_code`.
- Looks up the invitation record.
- Returns manager details along with the referenced team and populated club/league/age group metadata.

## Request Body

```json
{
  "manager_invitation_code": "string"
}
```

## Response

```json
{
  "success": true,
  "data": { /* manager invitation record */ },
  "message": "Found invitation code"
}
```

## Notes

- Returns an error when the code is invalid.
