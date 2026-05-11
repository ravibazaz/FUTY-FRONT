# Teams Model Documentation

## Model Purpose

The `Teams` model represents football teams in the FUTY application, storing team information, kit colors, formation preferences, and relationships to clubs, grounds, age groups, and users. It supports virtual population for retrieving all team managers and players.

**Key Responsibility:** Store team organizational data and manage relationships between teams, players, managers, clubs, and venues.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Teams.js` |
| **Collection Name** | `teams` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (players/managers), Clubs, Grounds, AgeGroups |
| **Special Features** | Virtual population, kit customization, formation preferences |

---

## Schema Definition

### Core Team Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String` | Yes | Team name |
| `phone` | `String` | No | Team contact phone |
| `email` | `String` | No | Team contact email |
| `image` | `String` | No | Team logo/badge URL |
| `isActive` | `Boolean` | No | Team active status (default: true) |

### Kit & Appearance

| Field | Type | Description |
|-------|------|-------------|
| `shirt` | `String` | Primary shirt color |
| `shorts` | `String` | Shorts color |
| `socks` | `String` | Socks color |

### Formation & Tactics

| Field | Type | Description |
|-------|------|-------------|
| `attack` | `String` | Attacking formation/style preference |
| `midfield` | `String` | Midfield formation/style preference |
| `defence` | `String` | Defensive formation/style preference |

### Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `ground` | `ObjectId` | `Grounds` | Home ground/venue |
| `club` | `ObjectId` | `Clubs` | Affiliated club |
| `age_groups` | `ObjectId` | `AgeGroups` | Age group category |
| `user` | `ObjectId` | `User` | Primary team manager/owner |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Team creation timestamp |

---

## Virtual Fields

### Managers Virtual

```javascript
TeamSchema.virtual("managers", {
  ref: "User",           // Referenced model
  localField: "_id",     // Field in Teams collection
  foreignField: "team_id", // Field in User collection
  justOne: false         // Returns array (multiple managers)
});
```

**Purpose:** Retrieve all users who manage this team
**Population:** Automatically included when `toObject()` or `toJSON()` is called
**Usage:** `team.managers` returns array of manager user objects

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Club Lookup** | `club` | Find teams by club |
| **Ground Lookup** | `ground` | Find teams by venue |
| **Age Group** | `age_groups` | Filter by age category |
| **Active Teams** | `isActive` | Active team queries |
| **Manager Lookup** | `user` | Find teams by manager |

---

## Usage Examples

### Example 1: Team Creation
```javascript
import Team from '@/lib/models/Teams';

export async function createTeam(teamData, managerId) {
  const team = new Team({
    name: teamData.name,
    email: teamData.email,
    phone: teamData.phone,
    shirt: teamData.kit.shirt || 'blue',
    shorts: teamData.kit.shorts || 'white',
    socks: teamData.kit.socks || 'blue',
    attack: teamData.formation.attack || '4-3-3',
    midfield: teamData.formation.midfield || 'balanced',
    defence: teamData.formation.defence || '4-4-2',
    ground: teamData.groundId,
    club: teamData.clubId,
    age_groups: teamData.ageGroupId,
    user: managerId,
    isActive: true
  });

  return await team.save();
}
```

### Example 2: Team Roster with Managers
```javascript
export async function getTeamWithRoster(teamId) {
  const team = await Team.findById(teamId)
    .populate('ground')
    .populate('club')
    .populate('age_groups')
    .populate('user', 'name email telephone')
    .populate('managers', 'name email telephone account_type');

  // Get players separately (not virtual)
  const players = await User.find({
    team_id: teamId,
    account_type: 'player',
    isActive: true
  }).select('name palyer_position palyer_rating profile_image');

  return {
    ...team.toObject(),
    players
  };
}
```

### Example 3: Find Teams by Club
```javascript
export async function getClubTeams(clubId) {
  return await Team.find({
    club: clubId,
    isActive: true
  })
  .populate('ground', 'name location')
  .populate('age_groups', 'name')
  .sort({ name: 1 });
}
```

### Example 4: Update Team Kit
```javascript
export async function updateTeamKit(teamId, kitColors) {
  return await Team.findByIdAndUpdate(teamId, {
    shirt: kitColors.shirt,
    shorts: kitColors.shorts,
    socks: kitColors.socks
  }, { new: true });
}
```

### Example 5: Team Statistics
```javascript
export async function getTeamStats(teamId) {
  const team = await Team.findById(teamId);
  
  const playerCount = await User.countDocuments({
    team_id: teamId,
    account_type: 'player',
    isActive: true
  });
  
  const managerCount = await User.countDocuments({
    team_id: teamId,
    account_type: { $in: ['manager', 'coach'] },
    isActive: true
  });
  
  const matchesPlayed = await Match.countDocuments({
    $or: [
      { teamA: teamId },
      { teamB: teamId }
    ]
  });
  
  return {
    team: team.name,
    players: playerCount,
    managers: managerCount,
    matchesPlayed,
    formation: {
      attack: team.attack,
      midfield: team.midfield,
      defence: team.defence
    }
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `ground` | `Grounds` | All ground fields | Get home venue details |
| `club` | `Clubs` | All club fields | Get club affiliation |
| `age_groups` | `AgeGroups` | All age group fields | Get age category |
| `user` | `User` | Selected fields | Get primary manager |
| `managers` | `User` | Selected fields | Get all team managers (virtual) |

### Complex Population Example
```javascript
export async function getTeamDashboard(teamId) {
  return await Team.findById(teamId)
    .populate('ground', 'name address lat lng')
    .populate('club', 'name league')
    .populate('age_groups', 'name min_age max_age')
    .populate('user', 'name email telephone')
    .populate('managers', 'name email account_type');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Required Fields** | Schema-level requirements | Mongoose validation errors |
| **ObjectId Format** | Mongoose ObjectId validation | Cast errors |
| **Boolean Defaults** | Default `isActive: true` | Automatic value assignment |
| **String Trimming** | No trimming applied | Preserve exact values |

---

## Business Rules

### 1. **Team Activation**
- **Rule:** Teams can be active or inactive
- **Default:** New teams are active by default
- **Impact:** Inactive teams don't appear in public listings

### 2. **Manager Relationships**
- **Rule:** Teams have one primary manager (`user`) and can have multiple managers
- **Virtual Population:** Managers are retrieved via virtual field
- **Self-Reference:** Managers are User documents with `team_id` reference

### 3. **Club Affiliation**
- **Rule:** Teams belong to clubs for league participation
- **Optional:** Teams can exist without club affiliation
- **Hierarchy:** Club → Team → Players

### 4. **Age Group Classification**
- **Rule:** Teams are categorized by age groups
- **Purpose:** Age-appropriate competition and development
- **Validation:** References valid AgeGroups documents

### 5. **Kit Customization**
- **Rule:** Teams can customize their kit colors
- **Flexibility:** Free-form color values
- **Display:** Used for team representation in UI

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Virtual Population** | Automatic on serialization | Consider explicit population for performance |
| **Indexing** | Minimal indexes | Add compound indexes for common queries |
| **Population Depth** | Multiple populate calls | Optimize with selective field population |
| **Query Patterns** | Team-centric queries | Consider denormalization for frequent access |

---

## Migration Notes

### Commented Auto-Increment
```javascript
// TeamSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     this.ID = await getNextSequence("Teams");
//   }
//   next();
// });
```

**Status:** Auto-increment functionality is commented out
**Reason:** Performance considerations for team creation
**Alternative:** Use creation timestamp or manual ID assignment

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial team model with relationships and virtuals |

---

## Future Enhancements

- [ ] Implement auto-increment ID generation
- [ ] Add team statistics and performance metrics
- [ ] Support for multiple kit variations
- [ ] Add team social features (followers, likes)
- [ ] Implement team messaging and announcements
- [ ] Add team photo galleries
- [ ] Support for team sponsors and partnerships
- [ ] Add team achievement and trophy tracking

---

## Related Models

- `@/lib/models/Users.js` - Team players and managers
- `@/lib/models/Clubs.js` - Club affiliation
- `@/lib/models/Grounds.js` - Home venue
- `@/lib/models/AgeGroups.js` - Age classification
- `@/lib/models/Matches.js` - Team match history

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
