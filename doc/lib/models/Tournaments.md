# Tournaments Model Documentation

## Model Purpose

The `Tournaments` model represents football tournaments and competitions in the FUTY application. It stores tournament details, scheduling information, entry fees, team registrations, and relationships to teams, managers, leagues, grounds, and clubs. Tournaments support virtual population for retrieving all tournament order histories.

**Key Responsibility:** Store tournament information and manage competition organization with financial tracking and team registrations.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Tournaments.js` |
| **Collection Name** | `tournaments` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Teams, Users (managers), Leagues, Grounds, Clubs |
| **Special Features** | Virtual population for order histories, financial tracking |

---

## Schema Definition

### Core Tournament Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String` | No | Tournament name |
| `isActive` | `Boolean` | No | Tournament active status (default: true) |

### Scheduling Information

| Field | Type | Description |
|-------|------|-------------|
| `date` | `Date` | Tournament start date (default: now) |
| `time` | `String` | Tournament start time (default: current time) |
| `closing_date` | `Date` | Registration closing date (default: now) |

### Venue & Organization

| Field | Type | Description |
|-------|------|-------------|
| `venue` | `String` | Tournament venue description |
| `ground` | `ObjectId` | Primary tournament ground (Grounds reference) |
| `club` | `ObjectId` | Host club (Clubs reference) |

### Financial Information

| Field | Type | Description |
|-------|------|-------------|
| `total_amount` | `String` | Total tournament prize pool |
| `cost_per_team_entry` | `String` | Entry fee per team |

### Competition Structure

| Field | Type | Description |
|-------|------|-------------|
| `no_of_categories` | `String` | Number of age/division categories |
| `no_of_teams_per_category` | `String` | Maximum teams per category |

### Content & Media

| Field | Type | Description |
|-------|------|-------------|
| `description` | `String` | Tournament description |
| `images` | `Array<String>` | Tournament image URLs |

### Results & Outcomes

| Field | Type | Description |
|-------|------|-------------|
| `score` | `String` | Final tournament scores |
| `outcome` | `String` | Tournament results/outcomes |

### Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `team_id` | `ObjectId` | `Teams` | Organizing team |
| `manager_id` | `ObjectId` | `User` | Tournament manager |
| `league_id` | `ObjectId` | `Leagues` | Affiliated league |
| `created_by_user` | `ObjectId` | `User` | User who created the tournament |
| `accepted_by` | `String` | - | Acceptance status/details |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Tournament creation timestamp (default: now) |

---

## Virtual Fields

### Tournament Order Histories Virtual

```javascript
TournamentSchema.virtual("tournamentorderhistories", {
  ref: "TournamentOrderHistories",         // Referenced model
  localField: "_id",                       // Field in Tournaments collection
  foreignField: "tournament_Id",           // Field in TournamentOrderHistories collection
  justOne: false                           // Returns array (multiple order histories)
});
```

**Purpose:** Retrieve all order histories for this tournament
**Population:** Automatically included when `toObject()` or `toJSON()` is called
**Usage:** `tournament.tournamentorderhistories` returns array of order history objects

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Date Queries** | `date`, `closing_date` | Tournament scheduling queries |
| **League Lookup** | `league_id` | Find tournaments by league |
| **Ground Lookup** | `ground` | Find tournaments by venue |
| **Manager Lookup** | `manager_id` | Find tournaments by manager |
| **Team Lookup** | `team_id` | Find tournaments by organizing team |

---

## Usage Examples

### Example 1: Tournament Creation
```javascript
import Tournament from '@/lib/models/Tournaments';

export async function createTournament(tournamentData, creatorId) {
  const tournament = new Tournament({
    name: tournamentData.name,
    date: new Date(tournamentData.startDate),
    time: tournamentData.startTime,
    venue: tournamentData.venue,
    total_amount: tournamentData.prizePool,
    closing_date: new Date(tournamentData.registrationDeadline),
    no_of_categories: tournamentData.categories,
    no_of_teams_per_category: tournamentData.teamsPerCategory,
    cost_per_team_entry: tournamentData.entryFee,
    description: tournamentData.description,
    team_id: tournamentData.organizingTeamId,
    manager_id: tournamentData.managerId,
    league_id: tournamentData.leagueId,
    ground: tournamentData.groundId,
    club: tournamentData.clubId,
    created_by_user: creatorId,
    images: tournamentData.imageUrls
  });

  return await tournament.save();
}
```

### Example 2: Tournament with Order Histories
```javascript
export async function getTournamentDetails(tournamentId) {
  const tournament = await Tournament.findById(tournamentId)
    .populate('team_id', 'name')
    .populate('manager_id', 'name email')
    .populate('league_id', 'title')
    .populate('ground', 'name')
    .populate('club', 'name')
    .populate('created_by_user', 'name');

  // Order histories are available via virtual population
  return tournament;
}
```

### Example 3: Upcoming Tournaments
```javascript
export async function getUpcomingTournaments() {
  const now = new Date();

  return await Tournament.find({
    date: { $gte: now },
    closing_date: { $gte: now }
  })
  .populate('ground', 'name county')
  .populate('league_id', 'title')
  .sort({ date: 1 });
}
```

### Example 4: Tournament Registration Check
```javascript
export async function checkTournamentRegistration(tournamentId, teamId) {
  const tournament = await Tournament.findById(tournamentId);

  // Check if registration is still open
  const now = new Date();
  if (now > tournament.closing_date) {
    return { canRegister: false, reason: 'Registration closed' };
  }

  // Check if team is already registered
  const existingRegistration = await TournamentOrderHistories.findOne({
    tournament_Id: tournamentId,
    team_id: teamId
  });

  if (existingRegistration) {
    return { canRegister: false, reason: 'Team already registered' };
  }

  return {
    canRegister: true,
    tournament: {
      name: tournament.name,
      entryFee: tournament.cost_per_team_entry,
      categories: tournament.no_of_categories,
      maxTeamsPerCategory: tournament.no_of_teams_per_category
    }
  };
}
```

### Example 5: Tournament Statistics
```javascript
export async function getTournamentStats(tournamentId) {
  const tournament = await Tournament.findById(tournamentId);

  const registrationCount = await TournamentOrderHistories.countDocuments({
    tournament_Id: tournamentId
  });

  const totalRevenue = registrationCount * parseFloat(tournament.cost_per_team_entry || 0);

  return {
    tournament: tournament.name,
    registrations: registrationCount,
    maxCapacity: parseInt(tournament.no_of_categories) * parseInt(tournament.no_of_teams_per_category),
    revenue: totalRevenue,
    prizePool: tournament.total_amount,
    status: new Date() > tournament.closing_date ? 'Closed' : 'Open'
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `team_id` | `Teams` | All team fields | Get organizing team details |
| `manager_id` | `User` | All user fields | Get tournament manager |
| `league_id` | `Leagues` | All league fields | Get affiliated league |
| `ground` | `Grounds` | All ground fields | Get tournament venue |
| `club` | `Clubs` | All club fields | Get host club |
| `created_by_user` | `User` | All user fields | Get tournament creator |
| `tournamentorderhistories` | `TournamentOrderHistories` | Virtual population | Get all registrations |

### Complex Population Example
```javascript
export async function getTournamentDashboard(tournamentId) {
  return await Tournament.findById(tournamentId)
    .populate('team_id', 'name image')
    .populate('manager_id', 'name email telephone')
    .populate('league_id', 'title image')
    .populate('ground', 'name add1 county')
    .populate('club', 'name secretary_name');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Date Validation** | Default Date.now() | Automatic timestamp assignment |
| **ObjectId Format** | Mongoose ObjectId validation | Cast errors |
| **String Defaults** | Default empty strings | Automatic value assignment |
| **Array Validation** | Images array validation | Validation errors |

---

## Business Rules

### 1. **Tournament Scheduling**
- **Rule:** Tournaments have start dates, times, and registration deadlines
- **Validation:** Closing date must be before tournament date
- **Purpose:** Organized competition timing

### 2. **Financial Structure**
- **Rule:** Tournaments have entry fees and prize pools
- **Tracking:** Cost per team and total amount fields
- **Revenue:** Calculated from registrations × entry fee

### 3. **Capacity Management**
- **Rule:** Tournaments have category and team limits
- **Structure:** Number of categories × teams per category = total capacity
- **Registration:** Check against existing registrations

### 4. **Multi-Relationship Management**
- **Rule:** Tournaments connect teams, managers, leagues, grounds, and clubs
- **Purpose:** Comprehensive tournament organization
- **Hierarchy:** League → Club → Ground → Tournament → Teams

### 5. **Virtual Order Tracking**
- **Rule:** Tournament registrations tracked via virtual population
- **Reference:** TournamentOrderHistories collection
- **Purpose:** Efficient registration management

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Virtual Population** | Automatic on serialization | Consider explicit population for performance |
| **Date Queries** | Range queries on dates | Ensure proper indexing for scheduling queries |
| **Relationship Queries** | Multiple populate calls | Optimize with selective field population |
| **Registration Checks** | Separate count queries | Consider caching registration counts |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial tournament model with virtual order histories |

---

## Future Enhancements

- [ ] Add tournament brackets and fixtures
- [ ] Implement tournament status tracking (upcoming, active, completed)
- [ ] Add tournament categories and divisions
- [ ] Support for tournament sponsors
- [ ] Add tournament statistics and analytics
- [ ] Implement tournament notifications
- [ ] Add tournament refund policies
- [ ] Support for multi-day tournaments
- [ ] Add tournament media galleries

---

## Related Models

- `@/lib/models/TournamentOrderHistories.js` - Registration tracking
- `@/lib/models/Teams.js` - Participating teams
- `@/lib/models/Leagues.js` - League affiliation
- `@/lib/models/Grounds.js` - Tournament venues
- `@/lib/models/Clubs.js` - Host clubs

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
