# ManagerFriendLies Model Documentation

## Model Purpose

The `ManagerFriendLies` model (friendly matches for managers) represents casual friendly football matches organized or managed by managers in the FUTY application. It tracks match details, teams, venues, scores, and outcomes for manager-initiated friendly matches.

**Key Responsibility:** Store friendly match information managed by team managers.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/ManagerFriendLies.js` |
| **Collection Name** | `managerfriendles` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Teams, Users (managers), Grounds |
| **Special Features** | Match outcome tracking, score recording |

---

## Schema Definition

### Match Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | `Date` | No | Match date (default: now) |
| `time` | `String` | No | Match time |
| `status` | `String` | No | Match status |
| `scores` | `String` | No | Final match scores |
| `outcome` | `String` | No | Match outcome (win/draw/loss) |

### Team and Venue References

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `op_team_id` | `ObjectId` | No | Reference to opponent Teams collection |
| `manager_id` | `ObjectId` | No | Reference to Users collection (manager) |
| `ground_id` | `ObjectId` | No | Reference to Grounds collection (match venue) |

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
| **Manager Matches** | `manager_id` | Find matches managed by user |
| **Team Matches** | `op_team_id` | Find matches involving team |
| **Venue Matches** | `ground_id` | Find matches at specific ground |
| **Match Date** | `date` | Sort matches by date |

---

## Usage Examples

### Example 1: Create Manager Friendly
```javascript
import ManagerFriendlie from '@/lib/models/ManagerFriendLies';

export async function createManagerFriendly(matchData) {
  const friendly = new ManagerFriendlie({
    date: new Date(matchData.date),
    time: matchData.time,
    op_team_id: matchData.opponentTeamId,
    manager_id: matchData.managerId,
    ground_id: matchData.groundId,
    status: 'Scheduled'
  });

  return await friendly.save();
}
```

### Example 2: Get Manager's Friendly Matches
```javascript
export async function getManagerFriendlies(managerId) {
  return await ManagerFriendlie.find({ manager_id: managerId })
    .populate('op_team_id', 'name')
    .populate('ground_id', 'name location')
    .sort({ date: -1 });
}
```

### Example 3: Record Match Result
```javascript
export async function recordFriendlyResult(friendlyId, scores, outcome) {
  return await ManagerFriendlie.findByIdAndUpdate(
    friendlyId,
    {
      scores: scores,
      outcome: outcome,
      status: 'Completed'
    },
    { new: true }
  );
}
```

### Example 4: Get Team's Friendly Matches
```javascript
export async function getTeamFriendlies(teamId) {
  return await ManagerFriendlie.find({ op_team_id: teamId })
    .populate('manager_id', 'name')
    .populate('ground_id', 'name')
    .sort({ date: -1 });
}
```

### Example 5: Manager Friendly Statistics
```javascript
export async function getManagerFriendlyStats(managerId) {
  const matches = await ManagerFriendlie.find({ manager_id: managerId });

  const total = matches.length;
  const completed = matches.filter(m => m.status === 'Completed').length;
  const scheduled = matches.filter(m => m.status === 'Scheduled').length;

  const wins = matches.filter(m => m.outcome === 'win').length;
  const draws = matches.filter(m => m.outcome === 'draw').length;
  const losses = matches.filter(m => m.outcome === 'loss').length;

  return {
    total,
    completed,
    scheduled,
    wins,
    draws,
    losses,
    winRate: total > 0 ? Math.round((wins / total) * 100) : 0
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |
| **Date Validation** | Date type validation | Type validation |
| **Status Values** | String matching | Application-level validation |

---

## Business Rules

### 1. **Match Organization**
- **Rule:** Managers organize friendly matches
- **Reference:** `manager_id` links to Users
- **Purpose:** Track match responsibility

### 2. **Team Participation**
- **Rule:** Friendly matches involve opponent teams
- **Reference:** `op_team_id` for opponent team
- **Purpose:** Facilitate inter-team matches

### 3. **Venue Association**
- **Rule:** Matches occur at specific grounds
- **Reference:** `ground_id` for match location
- **Purpose:** Venue coordination and booking

### 4. **Result Recording**
- **Rule:** Match outcomes can be recorded
- **Fields:** Scores and outcome tracking
- **Purpose:** Historical record and statistics

### 5. **Status Tracking**
- **Rule:** Matches progress through lifecycle
- **Status Values:** "Scheduled", "Completed", etc.
- **Purpose:** Match workflow management

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Multiple Populations** | Reference queries | Ensure proper index optimization |
| **Date Filtering** | Date-based queries | Add compound indexes |
| **Status Queries** | String matching | Add status field index |
| **Bulk Operations** | Individual operations | Implement batch operations |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial manager friendly matches model |

---

## Future Enhancements

- [ ] Add match roster/lineups
- [ ] Implement player performance tracking
- [ ] Add match statistics (possession, shots, etc.)
- [ ] Support for match videos/highlights
- [ ] Add match attendance tracking
- [ ] Implement player injury recording
- [ ] Add match review/rating system
- [ ] Support for match photos

---

## Related Models

- **Users Model:** Manager information
- **Teams Model:** Team participation
- **Grounds Model:** Match venues

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
