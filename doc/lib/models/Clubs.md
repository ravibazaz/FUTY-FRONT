# Clubs Model Documentation

## Model Purpose

The `Clubs` model represents football clubs in the FUTY application, storing organizational information, contact details, league affiliations, and relationships to users, leagues, and age groups. Clubs serve as the organizational umbrella for multiple teams.

**Key Responsibility:** Store club organizational data and manage relationships between clubs, teams, leagues, and administrators.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Clubs.js` |
| **Collection Name** | `clubs` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (secretary/CWO), Leagues, AgeGroups, Teams |
| **Special Features** | Multiple contact roles, league affiliation, age group management |

---

## Schema Definition

### Core Club Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String` | No | Club name |
| `isActive` | `Boolean` | No | Club active status (default: true) |

### Contact Information - Secretary

| Field | Type | Description |
|-------|------|-------------|
| `secretary_name` | `String` | Club secretary name |
| `phone` | `String` | Secretary phone number |
| `email` | `String` | Secretary email address |
| `secretary_website` | `String` | Club website URL |

### Contact Information - Club Welfare Officer (CWO)

| Field | Type | Description |
|-------|------|-------------|
| `cwo_name` | `String` | Club Welfare Officer name |
| `cwo_phone` | `String` | CWO phone number |
| `cwo_email` | `String` | CWO email address |

### Media & Branding

| Field | Type | Description |
|-------|------|-------------|
| `image` | `String` | Club logo/badge URL |

### Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `league` | `ObjectId` | `Leagues` | Affiliated league |
| `user` | `ObjectId` | `User` | Primary club administrator |
| `age_groups` | `Array<ObjectId>` | `AgeGroups` | Supported age groups |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Club creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **League Lookup** | `league` | Find clubs by league |
| **Active Clubs** | `isActive` | Active club queries |
| **Administrator** | `user` | Find clubs by admin |
| **Age Groups** | `age_groups` | Clubs supporting specific ages |

---

## Usage Examples

### Example 1: Club Creation
```javascript
import Club from '@/lib/models/Clubs';

export async function createClub(clubData, adminId) {
  const club = new Club({
    name: clubData.name,
    secretary_name: clubData.secretaryName,
    secretary_website: clubData.website,
    phone: clubData.secretaryPhone,
    email: clubData.secretaryEmail,
    cwo_name: clubData.cwoName,
    cwo_phone: clubData.cwoPhone,
    cwo_email: clubData.cwoEmail,
    image: clubData.logoUrl,
    league: clubData.leagueId,
    user: adminId,
    age_groups: clubData.ageGroupIds,
    isActive: true
  });

  return await club.save();
}
```

### Example 2: Club with Full Details
```javascript
export async function getClubDetails(clubId) {
  return await Club.findById(clubId)
    .populate('league', 'name season')
    .populate('user', 'name email telephone')
    .populate('age_groups', 'name min_age max_age');
}
```

### Example 3: Find Clubs by League
```javascript
export async function getLeagueClubs(leagueId) {
  return await Club.find({
    league: leagueId,
    isActive: true
  })
  .populate('user', 'name email')
  .sort({ name: 1 });
}
```

### Example 4: Club Contact Directory
```javascript
export async function getClubContacts(clubId) {
  const club = await Club.findById(clubId)
    .select('name secretary_name secretary_website phone email cwo_name cwo_phone cwo_email');

  return {
    club: club.name,
    secretary: {
      name: club.secretary_name,
      phone: club.phone,
      email: club.email,
      website: club.secretary_website
    },
    welfareOfficer: {
      name: club.cwo_name,
      phone: club.cwo_phone,
      email: club.cwo_email
    }
  };
}
```

### Example 5: Club Teams Overview
```javascript
export async function getClubTeamsOverview(clubId) {
  const club = await Club.findById(clubId)
    .populate('age_groups', 'name');

  const teams = await Team.find({ club: clubId, isActive: true })
    .populate('ground', 'name')
    .populate('user', 'name')
    .sort({ name: 1 });

  const teamCount = await Team.countDocuments({
    club: clubId,
    isActive: true
  });

  return {
    club: club.name,
    totalTeams: teamCount,
    ageGroups: club.age_groups,
    teams: teams.map(team => ({
      id: team._id,
      name: team.name,
      manager: team.user?.name,
      ground: team.ground?.name,
      ageGroup: team.age_groups?.name
    }))
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `league` | `Leagues` | All league fields | Get league affiliation |
| `user` | `User` | All user fields | Get club administrator |
| `age_groups` | `AgeGroups` | All age group fields | Get supported age categories |

### Complex Population Example
```javascript
export async function getClubDashboard(clubId) {
  return await Club.findById(clubId)
    .populate('league', 'name season fixtures')
    .populate('user', 'name email telephone')
    .populate('age_groups', 'name min_age max_age description');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **ObjectId Format** | Mongoose ObjectId validation | Cast errors |
| **Boolean Defaults** | Default `isActive: true` | Automatic value assignment |
| **Array Validation** | Mongoose array validation | Validation errors |
| **Reference Integrity** | Foreign key constraints | Population errors |

---

## Business Rules

### 1. **Dual Contact Structure**
- **Rule:** Clubs have both secretary and welfare officer contacts
- **Purpose:** Separation of administrative and welfare responsibilities
- **Compliance:** Supports child protection and governance requirements

### 2. **League Affiliation**
- **Rule:** Clubs belong to leagues for organized competition
- **Optional:** Clubs can exist without league affiliation
- **Hierarchy:** League → Club → Teams → Players

### 3. **Age Group Management**
- **Rule:** Clubs support multiple age groups
- **Array Relationship:** Multiple age groups per club
- **Purpose:** Age-appropriate team organization

### 4. **Administrator Assignment**
- **Rule:** Each club has a primary administrator user
- **Single Reference:** One main admin per club
- **Delegation:** Additional roles can be managed through teams

### 5. **Club Activation**
- **Rule:** Clubs can be active or inactive
- **Default:** New clubs are active
- **Impact:** Inactive clubs don't appear in public listings

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Indexing** | Minimal indexes | Add compound indexes for common queries |
| **Population Depth** | Multiple populate calls | Optimize with selective field population |
| **Array Queries** | Age group array operations | Consider indexing for array queries |
| **Reference Loading** | Eager population | Implement lazy loading for performance |

---

## Migration Notes

### Commented Auto-Increment
```javascript
// ClubSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     this.ID = await getNextSequence("Clubs");
//   }
//   next();
// });
```

**Status:** Auto-increment functionality is commented out
**Reason:** Performance considerations for club creation
**Alternative:** Use creation timestamp or manual ID assignment

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial club model with dual contact structure |

---

## Future Enhancements

- [ ] Implement auto-increment ID generation
- [ ] Add club statistics and performance metrics
- [ ] Support for club sponsors and partnerships
- [ ] Add club social features (followers, likes)
- [ ] Implement club messaging and announcements
- [ ] Add club photo galleries and media
- [ ] Support for club merchandise and branding
- [ ] Add club achievement and trophy tracking
- [ ] Implement club membership management

---

## Related Models

- `@/lib/models/Teams.js` - Club teams
- `@/lib/models/Leagues.js` - League affiliation
- `@/lib/models/AgeGroups.js` - Supported age categories
- `@/lib/models/Users.js` - Club administrators

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
