# Leagues Model Documentation

## Model Purpose

The `Leagues` model represents football leagues and competitions in the FUTY application. It stores league information, contact details, organizational structure, and relationships to clubs, age groups, and administrators. Leagues serve as the competitive framework for organized football.

**Key Responsibility:** Store league organizational data and manage relationships between leagues, clubs, and competitions.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Leagues.js` |
| **Collection Name** | `leagues` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (administrators), Clubs, AgeGroups |
| **Special Features** | Virtual population for clubs, multiple contact roles |

---

## Schema Definition

### Core League Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `String` | No | League name/title |
| `content` | `String` | No | League description/content |
| `isActive` | `Boolean` | No | League active status (default: true) |

### Contact Information

| Field | Type | Description |
|-------|------|-------------|
| `c_name` | `String` | Chairman name |
| `p_name` | `String` | President name |
| `s_name` | `String` | Secretary name |
| `email` | `String` | Contact email |
| `telephone` | `String` | Contact phone |
| `website` | `String` | League website URL |

### Media

| Field | Type | Description |
|-------|------|-------------|
| `image` | `String` | League logo/banner URL |

### Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `user` | `ObjectId` | `User` | League administrator |
| `age_groups` | `Array<ObjectId>` | `AgeGroups` | Supported age groups |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | League creation timestamp (default: now) |

---

## Virtual Fields

### Clubs Virtual

```javascript
LeaguesSchema.virtual("clubs", {
  ref: "Clubs",         // Referenced model
  localField: "_id",    // Field in Leagues collection
  foreignField: "league", // Field in Clubs collection
  justOne: false        // Returns array (multiple clubs)
});
```

**Purpose:** Retrieve all clubs affiliated with this league
**Population:** Automatically included when `toObject()` or `toJSON()` is called
**Usage:** `league.clubs` returns array of club objects

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Active Leagues** | `isActive` | Active league queries |
| **Administrator** | `user` | Find leagues by admin |
| **Age Groups** | `age_groups` | Leagues supporting specific ages |

---

## Usage Examples

### Example 1: League Creation
```javascript
import League from '@/lib/models/Leagues';

export async function createLeague(leagueData, adminId) {
  const league = new League({
    title: leagueData.title,
    content: leagueData.description,
    image: leagueData.logoUrl,
    c_name: leagueData.chairmanName,
    p_name: leagueData.presidentName,
    website: leagueData.website,
    s_name: leagueData.secretaryName,
    email: leagueData.email,
    telephone: leagueData.phone,
    user: adminId,
    age_groups: leagueData.ageGroupIds,
    isActive: true
  });

  return await league.save();
}
```

### Example 2: League with Clubs
```javascript
export async function getLeagueWithClubs(leagueId) {
  const league = await League.findById(leagueId)
    .populate('user', 'name email telephone')
    .populate('age_groups', 'age_group description');

  // Clubs are available via virtual population
  return league;
}
```

### Example 3: League Contact Directory
```javascript
export async function getLeagueContacts(leagueId) {
  const league = await League.findById(leagueId)
    .select('title c_name p_name s_name email telephone website');

  return {
    league: league.title,
    chairman: league.c_name,
    president: league.p_name,
    secretary: league.s_name,
    contact: {
      email: league.email,
      phone: league.telephone,
      website: league.website
    }
  };
}
```

### Example 4: Leagues by Age Group
```javascript
export async function getLeaguesByAgeGroup(ageGroupId) {
  return await League.find({
    age_groups: ageGroupId,
    isActive: true
  })
  .select('title content image')
  .sort({ title: 1 });
}
```

### Example 5: League Statistics
```javascript
export async function getLeagueStats(leagueId) {
  const league = await League.findById(leagueId);
  
  const clubCount = await Club.countDocuments({
    league: leagueId,
    isActive: true
  });
  
  const teamCount = await Team.countDocuments({
    club: { $in: await Club.find({ league: leagueId }).distinct('_id') },
    isActive: true
  });
  
  const playerCount = await User.countDocuments({
    team_id: { $in: await Team.find({
      club: { $in: await Club.find({ league: leagueId }).distinct('_id') }
    }).distinct('_id') },
    account_type: 'player',
    isActive: true
  });
  
  return {
    league: league.title,
    clubs: clubCount,
    teams: teamCount,
    players: playerCount,
    ageGroups: league.age_groups?.length || 0
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `user` | `User` | All user fields | Get league administrator |
| `age_groups` | `AgeGroups` | All age group fields | Get supported age categories |
| `clubs` | `Clubs` | Virtual population | Get affiliated clubs |

### Complex Population Example
```javascript
export async function getLeagueDashboard(leagueId) {
  return await League.findById(leagueId)
    .populate('user', 'name email telephone')
    .populate('age_groups', 'age_group description');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **ObjectId Format** | Mongoose ObjectId validation | Cast errors |
| **Boolean Defaults** | Default `isActive: true` | Automatic value assignment |
| **Array Validation** | Age groups array validation | Validation errors |

---

## Business Rules

### 1. **Multiple Leadership Roles**
- **Rule:** Leagues have chairman, president, and secretary roles
- **Purpose:** Distributed governance and responsibility
- **Contact:** Multiple contact points for league administration

### 2. **Age Group Organization**
- **Rule:** Leagues support multiple age groups
- **Array Relationship:** Multiple age groups per league
- **Purpose:** Age-appropriate competition structures

### 3. **Club Affiliation**
- **Rule:** Leagues contain multiple affiliated clubs
- **Virtual Population:** Clubs reference the league
- **Hierarchy:** League → Clubs → Teams → Players

### 4. **Administrator Assignment**
- **Rule:** Each league has a primary administrator user
- **Single Reference:** One main admin per league
- **Purpose:** Centralized league management

### 5. **League Activation**
- **Rule:** Leagues can be active or inactive
- **Default:** New leagues are active
- **Impact:** Inactive leagues don't appear in competition listings

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Virtual Population** | Automatic on serialization | Consider explicit population for performance |
| **Indexing** | Minimal indexes | Add compound indexes for common queries |
| **Array Queries** | Age group array operations | Consider indexing for array queries |

---

## Migration Notes

### Commented Auto-Increment
```javascript
// LeaguesSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     this.ID = await getNextSequence("Leagues");
//   }
//   next();
// });
```

**Status:** Auto-increment functionality is commented out
**Reason:** Performance considerations for league creation
**Alternative:** Use creation timestamp or manual ID assignment

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial league model with virtual club population |

---

## Future Enhancements

- [ ] Implement auto-increment ID generation
- [ ] Add league season and fixture management
- [ ] Support for league tables and standings
- [ ] Add league statistics and performance metrics
- [ ] Implement league social features (news, announcements)
- [ ] Add league sponsorship and partnership management
- [ ] Support for league merchandise and branding
- [ ] Add league achievement and trophy tracking
- [ ] Implement league membership and fee management

---

## Related Models

- `@/lib/models/Clubs.js` - Affiliated clubs
- `@/lib/models/AgeGroups.js` - Supported age categories
- `@/lib/models/Users.js` - League administrators
- `@/lib/models/Fixtures.js` - League matches

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
