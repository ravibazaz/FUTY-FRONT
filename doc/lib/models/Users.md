# Users Model Documentation

## Model Purpose

The `Users` model represents user accounts in the FUTY application, encompassing players, managers, referees, and fans. It stores comprehensive user profile information including personal details, football-specific attributes, location data, and relationships to teams, clubs, and grounds.

**Key Responsibility:** Store and manage user account data with football-specific attributes and geospatial location information.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Users.js` |
| **Collection Name** | `users` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Teams, Clubs, Grounds, Users (self-referencing) |
| **Special Features** | Geospatial indexing, auto-increment (commented), playing style analytics |

---

## Schema Definition

### Core User Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `String` | Yes | Unique email address for authentication |
| `password` | `String` | Yes | Hashed password for authentication |
| `name` | `String` | Yes | User's first name |
| `surname` | `String` | No | User's last name |
| `nick_name` | `String` | No | User's display nickname |
| `telephone` | `String` | Yes | Contact phone number |
| `account_type` | `String` | Yes | User role: player/manager/referee/fan |

### Location & Geospatial

| Field | Type | Description |
|-------|------|-------------|
| `post_code` | `String` | UK postal code for location services |
| `lat` | `Number` | Latitude coordinate |
| `long` | `Number` | Longitude coordinate |
| `location` | `GeoJSON Point` | MongoDB geospatial point `[lng, lat]` |

### Football-Specific Attributes

| Field | Type | Description |
|-------|------|-------------|
| `palyer_position` | `String` | Player position (GK, DEF, MID, FWD) |
| `palyer_pace` | `Number` | Player speed rating (1-100) |
| `palyer_skill` | `Number` | Player technical skill rating (1-100) |
| `palyer_power` | `Number` | Player physical power rating (1-100) |
| `palyer_defence` | `Number` | Player defensive ability rating (1-100) |
| `palyer_teamwork` | `Number` | Player teamwork rating (1-100) |
| `palyer_discipline` | `Number` | Player discipline rating (1-100) |
| `palyer_rating` | `Number` | Overall player rating |

### Referee-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| `referee_lavel` | `String` | Referee certification level |
| `referee_fee` | `String` | Referee match fee |

### Profile & Media

| Field | Type | Description |
|-------|------|-------------|
| `profile_description` | `String` | User biography/description |
| `profile_image` | `String` | Profile image URL |
| `travel_distance` | `String` | Maximum travel distance for matches |

### Authentication & Verification

| Field | Type | Description |
|-------|------|-------------|
| `login_code` | `String` | Temporary login verification code |
| `isVerified` | `Boolean` | Email/phone verification status |
| `isActive` | `Boolean` | Account active status |
| `fcmtoken` | `String` | Firebase Cloud Messaging token |

### Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `ground_id` | `ObjectId` | `Grounds` | User's preferred home ground |
| `club_id` | `ObjectId` | `Clubs` | User's affiliated club |
| `team_id` | `ObjectId` | `Teams` | User's current team |
| `palyer_manger_id` | `ObjectId` | `User` | Player's manager (self-reference) |
| `fan_manger_id` | `ObjectId` | `User` | Fan's manager (self-reference) |

### Playing Style Analytics

| Field | Type | Description |
|-------|------|-------------|
| `playing_style.win` | `Object` | Win style preferences with percentage |
| `playing_style.style` | `Object` | Playing style preferences with percentage |
| `playing_style.trophy` | `Object` | Trophy/achievement focus with percentage |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Email Unique** | `email` | Unique | Authentication and user lookup |
| **Geospatial** | `location` | 2dsphere | Location-based queries |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Team Lookup** | `team_id` | Team member queries |
| **Club Lookup** | `club_id` | Club member queries |
| **Account Type** | `account_type` | Role-based filtering |
| **Active Users** | `isActive` | Active user queries |

---

## Usage Examples

### Example 1: User Registration
```javascript
import User from '@/lib/models/Users';

export async function registerUser(userData) {
  const user = new User({
    email: userData.email,
    password: await hashPassword(userData.password),
    name: userData.name,
    telephone: userData.phone,
    account_type: userData.role, // 'player', 'manager', etc.
    post_code: userData.postcode,
    isVerified: false,
    isActive: true
  });

  return await user.save();
}
```

### Example 2: Player Profile Update
```javascript
export async function updatePlayerStats(userId, stats) {
  return await User.findByIdAndUpdate(userId, {
    palyer_pace: stats.pace,
    palyer_skill: stats.skill,
    palyer_power: stats.power,
    palyer_defence: stats.defence,
    palyer_rating: calculateOverallRating(stats)
  }, { new: true });
}
```

### Example 3: Location-Based Search
```javascript
export async function findNearbyPlayers(lat, lng, radiusKm = 50) {
  return await User.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat] // Note: [lng, lat] order
        },
        $maxDistance: radiusKm * 1000 // Convert to meters
      }
    },
    account_type: 'player',
    isActive: true
  });
}
```

### Example 4: Team Roster Query
```javascript
export async function getTeamPlayers(teamId) {
  return await User.find({
    team_id: teamId,
    account_type: 'player',
    isActive: true
  }).select('name palyer_position palyer_rating profile_image');
}
```

### Example 5: Manager Assignment
```javascript
export async function assignPlayerToManager(playerId, managerId) {
  return await User.findByIdAndUpdate(playerId, {
    palyer_manger_id: managerId
  }, { new: true });
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `team_id` | `Teams` | All team fields | Get user's team details |
| `club_id` | `Clubs` | All club fields | Get user's club details |
| `ground_id` | `Grounds` | All ground fields | Get user's home ground |
| `palyer_manger_id` | `User` | Manager details | Get player's manager |
| `fan_manger_id` | `User` | Manager details | Get fan's manager |

### Complex Population Example
```javascript
export async function getUserWithFullContext(userId) {
  return await User.findById(userId)
    .populate('team_id')
    .populate('club_id')
    .populate('ground_id')
    .populate('palyer_manger_id', 'name email telephone')
    .populate('fan_manger_id', 'name email telephone');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Required Fields** | Schema-level `required: true` | Mongoose validation errors |
| **Unique Email** | `unique: true` on email | Duplicate key errors |
| **String Trimming** | `trim: true` on strings | Automatic whitespace removal |
| **Geospatial Format** | GeoJSON Point validation | Invalid location errors |
| **Enum Values** | Limited account_type values | Validation errors |

---

## Business Rules

### 1. **Account Types**
- **Rule:** Users must have a valid account type (player/manager/referee/fan)
- **Enforcement:** Required field with no enum restriction
- **Business Impact:** Role-based feature access and permissions

### 2. **Geospatial Data**
- **Rule:** Location data should be consistent between post_code and coordinates
- **Implication:** Geocoding service should update both fields
- **Validation:** GeoJSON Point format for MongoDB geospatial queries

### 3. **Player Ratings**
- **Rule:** Player attributes should be numeric values 1-100
- **Current State:** Stored as strings (potential improvement)
- **Business Impact:** Enables player comparison and team selection

### 4. **Manager Relationships**
- **Rule:** Players and fans can have assigned managers
- **Self-Reference:** Uses same User model for manager relationships
- **Hierarchy:** Supports multi-level management structures

### 5. **Verification Status**
- **Rule:** New accounts start unverified and require email/phone verification
- **Activation:** Accounts can be deactivated for violations
- **Access Control:** Unverified accounts may have limited features

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Indexing** | Email unique index | Add compound indexes for common queries |
| **Geospatial** | 2dsphere index | Optimize for location-based searches |
| **Population** | Multiple populate calls | Consider denormalization for frequently accessed data |
| **String Storage** | Ratings as strings | Convert to numbers for mathematical operations |

---

## Migration Notes

### Commented Auto-Increment
```javascript
// UserSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     this.ID = await getNextSequence("User");
//   }
//   next();
// });
```

**Status:** Auto-increment functionality is commented out
**Reason:** Potential performance impact on user registration
**Alternative:** UUID or timestamp-based IDs for new users

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial user model with comprehensive football attributes |

---

## Future Enhancements

- [ ] Convert player ratings to numeric fields
- [ ] Add validation for rating ranges (1-100)
- [ ] Implement auto-increment ID generation
- [ ] Add user preferences and settings
- [ ] Add social features (friends, followers)
- [ ] Implement user statistics and achievements
- [ ] Add notification preferences
- [ ] Support for multiple profile images

---

## Related Models

- `@/lib/models/Teams.js` - Team membership
- `@/lib/models/Clubs.js` - Club affiliation
- `@/lib/models/Grounds.js` - Home ground association
- `@/lib/models/Notification.js` - User notifications

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
