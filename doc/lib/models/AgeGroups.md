# AgeGroups Model Documentation

## Model Purpose

The `AgeGroups` model represents age categories for football players and teams in the FUTY application. It stores age group names, descriptions, and serves as a reference for organizing competitions and team classifications by age.

**Key Responsibility:** Define and manage age categories for player and team organization.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/AgeGroups.js` |
| **Collection Name** | `agegroups` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Clubs, Teams, Users (players) |
| **Special Features** | Age-based categorization, competition organization |

---

## Schema Definition

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `age_group` | `String` | No | Age group name (e.g., "Under 18", "Senior") |
| `description` | `String` | No | Detailed description of the age group |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Age group creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Age Group Name** | `age_group` | Unique age group lookup |
| **Creation Date** | `createdAt` | Chronological sorting |

---

## Usage Examples

### Example 1: Age Group Creation
```javascript
import AgeGroup from '@/lib/models/AgeGroups';

export async function createAgeGroup(ageGroupData) {
  const ageGroup = new AgeGroup({
    age_group: ageGroupData.name,
    description: ageGroupData.description
  });

  return await ageGroup.save();
}
```

### Example 2: Get All Age Groups
```javascript
export async function getAllAgeGroups() {
  return await AgeGroup.find({})
    .sort({ age_group: 1 });
}
```

### Example 3: Find Teams by Age Group
```javascript
export async function getTeamsByAgeGroup(ageGroupId) {
  return await Team.find({
    age_groups: ageGroupId,
    isActive: true
  })
  .populate('club', 'name')
  .populate('user', 'name')
  .sort({ name: 1 });
}
```

### Example 4: Age Group Statistics
```javascript
export async function getAgeGroupStats(ageGroupId) {
  const ageGroup = await AgeGroup.findById(ageGroupId);
  
  const teamCount = await Team.countDocuments({
    age_groups: ageGroupId,
    isActive: true
  });
  
  const clubCount = await Club.countDocuments({
    age_groups: ageGroupId,
    isActive: true
  });
  
  const playerCount = await User.countDocuments({
    team_id: { $in: await Team.find({ age_groups: ageGroupId }).distinct('_id') },
    account_type: 'player',
    isActive: true
  });
  
  return {
    ageGroup: ageGroup.age_group,
    description: ageGroup.description,
    teams: teamCount,
    clubs: clubCount,
    players: playerCount
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `age_groups` | `Clubs` | Referenced in clubs | Get clubs supporting this age group |
| `age_groups` | `Teams` | Referenced in teams | Get teams in this age group |

### Reverse Population Example
```javascript
export async function getAgeGroupWithEntities(ageGroupId) {
  const ageGroup = await AgeGroup.findById(ageGroupId);
  
  const clubs = await Club.find({
    age_groups: ageGroupId,
    isActive: true
  }).select('name');
  
  const teams = await Team.find({
    age_groups: ageGroupId,
    isActive: true
  })
  .populate('club', 'name')
  .select('name club');
  
  return {
    ...ageGroup.toObject(),
    clubs,
    teams
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **String Fields** | Basic string validation | Mongoose validation |
| **Date Defaults** | Automatic timestamp | Default value assignment |

---

## Business Rules

### 1. **Age Group Naming**
- **Rule:** Age groups should have clear, descriptive names
- **Examples:** "Under 18", "Senior", "Veterans", "Youth"
- **Purpose:** Clear categorization for competitions

### 2. **Description Requirements**
- **Rule:** Age groups should include detailed descriptions
- **Purpose:** Explain age ranges, eligibility, and competition rules
- **Optional:** Descriptions can be added post-creation

### 3. **Club and Team Association**
- **Rule:** Age groups are referenced by clubs and teams
- **Relationship:** Many-to-many through array references
- **Purpose:** Organize competitions by age categories

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Query Patterns** | Simple lookups | Add caching for frequently accessed age groups |
| **Indexing** | Minimal indexes | Add unique constraint on age_group if required |
| **Relationships** | Reverse lookups | Consider denormalization for performance |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial age groups model |

---

## Future Enhancements

- [ ] Add age range fields (min_age, max_age)
- [ ] Implement age validation for players
- [ ] Add competition categories per age group
- [ ] Support for seasonal age groups
- [ ] Add age group statistics and analytics
- [ ] Implement age group progression tracking
- [ ] Add certification requirements per age group

---

## Related Models

- `@/lib/models/Clubs.js` - Club age group support
- `@/lib/models/Teams.js` - Team age classification
- `@/lib/models/Users.js` - Player age eligibility

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
