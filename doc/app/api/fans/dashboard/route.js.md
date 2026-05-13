# GET /api/fans/dashboard

## Purpose
Returns the personalized dashboard data for an authenticated fan user.
This endpoint compiles fan profile information, random adverts, and prioritized friendly match suggestions.

## File Location
`app/api/fans/dashboard/route.js`

## HTTP Method
GET

## Authentication Required
Yes

## Behavior
- Protects the route using `protectApiRoute(req)`.
- Returns an auth error if the request is not authenticated.
- Connects to MongoDB via `connectDB()`.
- Fetches one random advert for display.
- Loads the authenticated fan user's profile and associated manager/team/club/league/age group details.
- Computes two prioritized friendly match suggestions:
  - `league_friendly_by_priority1` for friendlies in the user's league, preferably created by the fan's manager.
  - `league_friendly_by_priority2` as a secondary friendly recommendation when the primary result is unavailable.
- Also returns upcoming friendlies created by other users and the manager's next scheduled friendly.
- Returns all these items in a consolidated dashboard payload.

## Query Parameters
- None

## Request Body
- None

## Response Example
```json
{
  "success": true,
  "message": "Welcome to the Fan Dashboard!",
  "data": {
    "fan_profile": {
      "_id": "6432f88f1e197c1d8a1b4d2f",
      "name": "John",
      "surname": "Doe",
      "profile_image": "/uploads/users/john.jpg",
      "fan_manger_id": {
        "_id": "6432f88f1e197c1d8a1b4d30",
        "name": "Manager Name",
        "team_id": {
          "_id": "6432f88f1e197c1d8a1b4d31",
          "label": "Team A",
          "name": "Team A Name",
          "club": {
            "_id": "6432f88f1e197c1d8a1b4d32",
            "name": "Club Name",
            "league": {
              "_id": "6432f88f1e197c1d8a1b4d33",
              "label": "Premier League",
              "title": "Top League"
            }
          }
        }
      }
    },
    "random_advert": {
      "name": "Summer Cup",
      "image": "/uploads/adverts/summer-cup.jpg",
      "link": "https://example.com",
      "content": "Register now for the summer cup"
    },
    "show_next_applicable_friendly_created_by_others_recent_date_limit_one": { /* friendly doc */ },
    "the_managers_next_upcomng_schedule_friendly_recent_date_limit_one": { /* friendly doc */ },
    "league_friendly_by_priority1": { /* friendly doc */ },
    "league_friendly_by_priority2": { /* friendly doc */ }
  }
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `protectApiRoute` from `@/lib/middleware`
  - `connectDB` from `@/lib/db`
  - `Users` model from `@/lib/models/Users`
  - `Teams` model from `@/lib/models/Teams`
  - `Clubs` model from `@/lib/models/Clubs`
  - `Leagues` model from `@/lib/models/Leagues`
  - `AgeGroups` model from `@/lib/models/AgeGroups`
  - `Adverts` model from `@/lib/models/Adverts`
  - `Friendlies` model from `@/lib/models/Friendlies`
- Handler steps:
  1. Authenticate with `protectApiRoute(req)`.
  2. Connect to the database.
  3. Select a random active advert using `Adverts.aggregate([{$sample:{size:1}}])`.
  4. Fetch fan profile details with nested population of manager, team, club, league, age groups, and ground.
  5. Determine the fan's league ID from the populated team/club/league relationship.
  6. Attempt to find a priority friendly within the user's league and created by the fan manager.
  7. If that fails, fallback to a league friendly in the same league created by another user.
  8. If still unavailable, select a random friendly from another league.
  9. Build a secondary prioritized friendly and additional dashboard items.
 10. Return all dashboard data in the response.

## Security
- Requires valid authentication.
- Uses `protectApiRoute` to prevent anonymous access.

## Notes
- This endpoint performs multiple complex queries and deep population chains.
- The fan profile includes manager, team, club, league, and age group information.
- The friendly selection logic prefers matches in the user's league and by the fan manager.
- If no suitable friendlies exist, the endpoint uses random league selection as fallback.
- Heavy database operations mean this endpoint is best used sparingly or cached where possible.