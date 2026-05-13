
# GET /api/referees/dashboard

## Purpose

Retrieves dashboard data for the authenticated referee, including profile details, a random advertisement, and an upcoming friendly match suggestion.

## File Location

`app/api/referees/dashboard/route.js`

## HTTP Method

GET

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request using `protectApiRoute(req)`.
- Connects to MongoDB.
- Selects one random advert with a projection of `name`, `image`, `link`, and `content`.
- Queries friendlies scheduled from today onward and returns one random match with populated relations.
- Loads the authenticated referee profile and returns a dashboard payload.

## Query Parameters

None

## Request Body

None

## Response

```json
{
  "success": true,
  "message": "Welcome to the Referee Dashboard!",
  "data": {
    "referee_profile": { /* referee fields */ },
    "random_advert": { /* advert fields */ },
    "league_friendly_by_priority1": { /* friendly match fields */ }
  }
}
```

## Implementation Details

- Uses aggregation with `$sample` to pick a random advert.
- Finds one upcoming `Friendlies` document and populates `team_id`, `manager_id`, `ground_id`, `league_id`, `created_by_user`, and `accepted_by_user`.
- The referee profile is loaded from `Users.findOne({ _id: user._id })` with selected referee fields.

## Security Notes

- Protected endpoint that returns user-specific data.
- No pagination or filter parameters are supported.
