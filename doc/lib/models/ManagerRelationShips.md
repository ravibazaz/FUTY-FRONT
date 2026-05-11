# ManagerRelationShips Model Documentation

## Model Purpose

The `ManagerRelationShips` model represents relationships between managers and various football entities (teams, clubs, leagues) in the FUTY application. It tracks managerial connections and performance metrics like win records and playing styles.

**Key Responsibility:** Store manager-entity relationships with performance tracking.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/ManagerRelationShips.js` |
| **Collection Name** | `managerrelationships` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Teams, Clubs, Leagues, Users |
| **Special Features** | Performance metrics, multi-entity relationships |

---

## Schema Definition

### Entity Relationships

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `team_id` | `ObjectId` | No | Reference to Teams collection |
| `club_id` | `ObjectId` | No | Reference to Clubs collection |
| `league_id` | `ObjectId` | No | Reference to Leagues collection |
| `manager_id` | `ObjectId` | No | Reference to User collection (manager) |

### Performance Metrics

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `win` | `String` | No | Win record or statistics |
| `style` | `String` | No | Playing style preference |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `createdAt` | `Date` | No | Relationship creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Manager Relationships** | `manager_id` | Find all relationships for a manager |
| **Team Managers** | `team_id` | Find managers for a team |
| **Club Managers** | `club_id` | Find managers for a club |
| **League Managers** | `league_id` | Find managers in a league |
| **Creation Date** | `createdAt` | Sort relationships by date |

---

## Usage Examples

### Example 1: Create Manager Relationship
```javascript
import ManagerRelationShip from '@/lib/models/ManagerRelationShips';

export async function createManagerRelationship(managerData) {
  const relationship = new ManagerRelationShip({
    manager_id: managerData.managerId,
    team_id: managerData.teamId,
    club_id: managerData.clubId,
    league_id: managerData.leagueId,
    win: managerData.winRecord,
    style: managerData.playingStyle
  });

  return await relationship.save();
}
```

### Example 2: Get Manager's Teams
```javascript
export async function getManagerTeams(managerId) {
  return await ManagerRelationShip.find({ manager_id: managerId })
    .populate('team_id', 'name')
    .populate('club_id', 'name')
    .populate('league_id', 'title');
}
```

### Example 3: Get Team Managers
```javascript
export async function getTeamManagers(teamId) {
  return await ManagerRelationShip.find({ team_id: teamId })
    .populate('manager_id', 'name email telephone')
    .select('win style createdAt');
}
```

### Example 4: Update Manager Performance
```javascript
export async function updateManagerPerformance(relationshipId, performance) {
  return await ManagerRelationShip.findByIdAndUpdate(
    relationshipId,
    {
      win: performance.winRecord,
      style: performance.playingStyle
    },
    { new: true }
  );
}
```

### Example 5: Get League Managers
```javascript
export async function getLeagueManagers(leagueId) {
  return await ManagerRelationShip.find({ league_id: leagueId })
    .populate('manager_id', 'name profile_image')
    .populate('team_id', 'name')
    .sort({ createdAt: -1 });
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |
| **Date Defaults** | Default Date.now() | Automatic timestamp assignment |

---

## Business Rules

### 1. **Multi-Entity Relationships**
- **Rule:** Managers can be related to teams, clubs, and leagues
- **References:** team_id, club_id, league_id
- **Purpose:** Flexible managerial associations

### 2. **Performance Tracking**
- **Rule:** Track manager performance metrics
- **Fields:** win and style attributes
- **Purpose:** Manager evaluation and statistics

### 3. **Relationship Flexibility**
- **Rule:** Relationships can exist at different levels
- **Structure:** Team, club, or league level associations
- **Purpose:** Hierarchical management structure

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Multiple Populations** | Reference queries | Ensure proper index optimization |
| **Relationship Queries** | Multi-field lookups | Add compound indexes |
| **Performance Updates** | Field updates | Batch update operations |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial manager relationships model |

---

## Future Enhancements

- [ ] Add relationship status (active/inactive)
- [ ] Implement relationship duration tracking
- [ ] Add performance analytics
- [ ] Support for multiple concurrent relationships
- [ ] Add relationship approval workflow
- [ ] Implement relationship history

---

## Related Models

- **Users Model:** Manager information
- **Teams Model:** Team associations
- **Clubs Model:** Club associations
- **Leagues Model:** League associations

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
