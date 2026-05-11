# Friendlies Model Documentation

## Model Purpose

The `Friendlies` model manages friendly football matches in the FUTY application. It tracks match scheduling, team participation, venue information, match status, and score recording for casual football games between teams.

**Key Responsibility:** Store friendly match information with team relationships and match outcome tracking.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Friendlies.js` |
| **Collection Name** | `friendlies` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Teams, Users (managers), Grounds, Leagues |
| **Special Features** | Match status tracking, score recording, acceptance workflow |

---

## Schema Definition

### Match Basic Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String` | No | Friendly match name/title (default: empty) |
| `date` | `Date` | No | Match date (default: now) |
| `time` | `String` | No | Match time (default: current time string) |
| `description` | `String` | No | Match description/details (default: empty) |

### Team and Organization References

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `team_id` | `ObjectId` | Yes | Reference to Teams collection (organizing team) |
| `manager_id` | `ObjectId` | Yes | Reference to Users collection (match organizer/manager) |
| `ground_id` | `ObjectId` | Yes | Reference to Grounds collection (match venue) |
| `league_id` | `ObjectId` | Yes | Reference to Leagues collection (associated league) |

### Match Status and Workflow

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `String` | No | Match status: "Friendly Posted" or "Friendly Accepted" (default: "Friendly Posted") |

### Score Recording

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `created_by_user_score` | `String` | No | Score recorded by match creator (default: empty) |
| `accepted_by_user_score` | `String` | No | Score recorded by accepting user (default: empty) |

### Acceptance Workflow

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `created_by_user` | `ObjectId` | Yes | Reference to Users collection (match creator) |
| `accepted_by_user` | `ObjectId` | Yes | Reference to Users collection (match acceptor) |
| `accepteddAt` | `Date` | No | Match acceptance timestamp (default: empty) |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `createdAt` | `Date` | No | Match creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Team Friendlies** | `team_id` | Find all friendlies for a team |
| **Manager Friendlies** | `manager_id` | Find friendlies organized by manager |
| **Ground Usage** | `ground_id` | Find friendlies at specific ground |
| **League Friendlies** | `league_id` | Find friendlies in specific league |
| **Match Status** | `status` | Filter by match status |
| **Match Date** | `date` | Sort and filter by match date |
| **Created By** | `created_by_user` | Find friendlies created by user |

---

## Usage Examples

### Example 1: Create Friendly Match
```javascript
import Friendlie from '@/lib/models/Friendlies';

export async function createFriendlyMatch(matchData) {
  const friendly = new Friendlie({
    name: matchData.name,
    date: new Date(matchData.date),
    time: matchData.time,
    team_id: matchData.teamId,
    manager_id: matchData.managerId,
    ground_id: matchData.groundId,
    league_id: matchData.leagueId,
    description: matchData.description,
    created_by_user: matchData.creatorId,
    status: "Friendly Posted"
  });

  return await friendly.save();
}
```

### Example 2: Accept Friendly Match
```javascript
export async function acceptFriendlyMatch(friendlyId, acceptorId) {
  return await Friendlie.findByIdAndUpdate(
    friendlyId,
    {
      accepted_by_user: acceptorId,
      status: "Friendly Accepted",
      accepteddAt: new Date()
    },
    { new: true }
  );
}
```

### Example 3: Get Team Friendlies
```javascript
export async function getTeamFriendlies(teamId) {
  return await Friendlie.find({ team_id: teamId })
    .populate('team_id', 'name logo')
    .populate('manager_id', 'name')
    .populate('ground_id', 'name location')
    .populate('league_id', 'name')
    .populate('created_by_user', 'name')
    .populate('accepted_by_user', 'name')
    .sort({ date: -1 });
}
```

### Example 4: Record Match Scores
```javascript
export async function recordMatchScore(friendlyId, scores, recorderId) {
  const friendly = await Friendlie.findById(friendlyId);

  if (!friendly) {
    throw new Error('Friendly match not found');
  }

  const updateData = {};

  // Determine who is recording the score
  if (recorderId.toString() === friendly.created_by_user.toString()) {
    updateData.created_by_user_score = scores;
  } else if (recorderId.toString() === friendly.accepted_by_user.toString()) {
    updateData.accepted_by_user_score = scores;
  } else {
    throw new Error('Unauthorized to record score');
  }

  return await Friendlie.findByIdAndUpdate(friendlyId, updateData, { new: true });
}
```

### Example 5: Friendly Match Statistics
```javascript
export async function getFriendlyStats(teamId) {
  const friendlies = await Friendlie.find({
    $or: [
      { team_id: teamId },
      { accepted_by_user: teamId }
    ]
  });

  const total = friendlies.length;
  const posted = friendlies.filter(f => f.status === 'Friendly Posted').length;
  const accepted = friendlies.filter(f => f.status === 'Friendly Accepted').length;

  const upcoming = friendlies.filter(f =>
    f.date > new Date() && f.status === 'Friendly Accepted'
  ).length;

  const completed = friendlies.filter(f =>
    f.date <= new Date() && f.status === 'Friendly Accepted' &&
    (f.created_by_user_score || f.accepted_by_user_score)
  ).length;

  return {
    total,
    posted,
    accepted,
    upcoming,
    completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Status Enum** | Enum validation for status field | Invalid status error |
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |
| **Date Defaults** | Default Date.now() | Automatic timestamp assignment |
| **String Defaults** | Default empty strings | Automatic value assignment |

---

## Business Rules

### 1. **Match Status Workflow**
- **Rule:** Friendlies progress from "Posted" to "Accepted" status
- **Enum Values:** Only "Friendly Posted" and "Friendly Accepted" allowed
- **Purpose:** Track match organization lifecycle

### 2. **Dual Score Recording**
- **Rule:** Both teams can record match scores independently
- **Fields:** Separate score fields for creator and acceptor
- **Purpose:** Enable score verification and dispute resolution

### 3. **Team and Manager Association**
- **Rule:** Friendlies are organized by teams and managed by users
- **References:** Multiple user and team relationships
- **Purpose:** Link matches to organizational structure

### 4. **Venue and League Context**
- **Rule:** Friendlies occur at specific grounds within leagues
- **References:** Ground and league associations
- **Purpose:** Provide match location and competitive context

### 5. **Acceptance Tracking**
- **Rule:** Track who accepted matches and when
- **Fields:** Acceptor user and acceptance timestamp
- **Purpose:** Monitor match confirmation process

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Multiple Populations** | Complex population queries | Consider view models for frequent queries |
| **Date Filtering** | Date-based queries | Ensure proper indexing for date ranges |
| **Status Queries** | Enum field queries | Add index on status field |
| **Team Queries** | Reference queries | Compound indexes for team-related queries |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial friendlies model with match scheduling and scoring |

---

## Future Enhancements

- [ ] Add match result confirmation workflow
- [ ] Implement match cancellation functionality
- [ ] Add match attendance tracking
- [ ] Support for match photos and highlights
- [ ] Add match rating and feedback system
- [ ] Implement match rescheduling options
- [ ] Add match cost and payment tracking
- [ ] Support for tournament-style friendlies
- [ ] Add match analytics and statistics

---

## Related Models

- **Teams Model:** Team participation in friendlies
- **Users Model:** Managers and match participants
- **Grounds Model:** Match venue information
- **Leagues Model:** League context for matches

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
