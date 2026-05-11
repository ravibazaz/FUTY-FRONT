# Grounds Model Documentation

## Model Purpose

The `Grounds` model represents football venues and playing facilities in the FUTY application. It stores location information, facility details, geospatial coordinates, and relationships to users and ground facilities. Grounds serve as venues for matches and training.

**Key Responsibility:** Store venue information with geospatial indexing for location-based queries and facility management.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Grounds.js` |
| **Collection Name** | `grounds` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (owners/managers), GroundFacilities |
| **Special Features** | Geospatial indexing, facility arrays, location services |

---

## Schema Definition

### Core Ground Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String` | No | Ground/venue name |
| `isActive` | `Boolean` | No | Ground active status (default: true) |
| `isHomeGround` | `String` | No | Home ground designation (default: 'No') |

### Address Information

| Field | Type | Description |
|-------|------|-------------|
| `add1` | `String` | Address line 1 |
| `add2` | `String` | Address line 2 |
| `add3` | `String` | Address line 3 |
| `pin` | `String` | Postal code |
| `county` | `String` | County/region |

### Location & Geospatial

| Field | Type | Description |
|-------|------|-------------|
| `lat` | `Number` | Latitude coordinate |
| `long` | `Number` | Longitude coordinate |
| `location` | `GeoJSON Point` | MongoDB geospatial point `[lng, lat]` |

### Content & Media

| Field | Type | Description |
|-------|------|-------------|
| `content` | `String` | Ground description/content |
| `images` | `Array<String>` | Array of image URLs |

### Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `facilities` | `Array<ObjectId>` | `GroundFacilities` | Available facilities |
| `user` | `ObjectId` | `User` | Ground owner/manager |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Ground creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Geospatial** | `location` | 2dsphere | Location-based queries and distance calculations |
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Active Grounds** | `isActive` | Active venue queries |
| **Home Grounds** | `isHomeGround` | Home ground filtering |
| **Owner Lookup** | `user` | Find grounds by owner |
| **County Search** | `county` | Regional filtering |

---

## Usage Examples

### Example 1: Ground Creation
```javascript
import Ground from '@/lib/models/Grounds';

export async function createGround(groundData, ownerId) {
  const ground = new Ground({
    name: groundData.name,
    add1: groundData.address1,
    add2: groundData.address2,
    add3: groundData.address3,
    pin: groundData.postcode,
    county: groundData.county,
    content: groundData.description,
    lat: groundData.latitude,
    long: groundData.longitude,
    location: {
      type: 'Point',
      coordinates: [groundData.longitude, groundData.latitude] // [lng, lat]
    },
    images: groundData.imageUrls,
    facilities: groundData.facilityIds,
    user: ownerId,
    isActive: true,
    isHomeGround: groundData.isHomeGround || 'No'
  });

  return await ground.save();
}
```

### Example 2: Nearby Grounds Search
```javascript
export async function findNearbyGrounds(lat, lng, radiusKm = 50) {
  return await Ground.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat] // [lng, lat] order
        },
        $maxDistance: radiusKm * 1000 // Convert to meters
      }
    },
    isActive: true
  })
  .populate('facilities', 'name type')
  .populate('user', 'name telephone');
}
```

### Example 3: Ground Details with Facilities
```javascript
export async function getGroundDetails(groundId) {
  return await Ground.findById(groundId)
    .populate('facilities')
    .populate('user', 'name email telephone');
}
```

### Example 4: Grounds by County
```javascript
export async function getGroundsByCounty(county) {
  return await Ground.find({
    county: new RegExp(county, 'i'), // Case-insensitive search
    isActive: true
  })
  .select('name add1 pin county lat long')
  .sort({ name: 1 });
}
```

### Example 5: Home Grounds
```javascript
export async function getHomeGrounds() {
  return await Ground.find({
    isHomeGround: 'Yes',
    isActive: true
  })
  .populate('user', 'name')
  .sort({ name: 1 });
}
```

### Example 6: Ground Availability Check
```javascript
export async function checkGroundAvailability(groundId, date, timeSlot) {
  // Check if ground has any bookings for the specified time
  const existingBooking = await Booking.findOne({
    ground: groundId,
    date: date,
    timeSlot: timeSlot,
    status: { $in: ['confirmed', 'pending'] }
  });

  const ground = await Ground.findById(groundId)
    .populate('facilities');

  return {
    ground: ground.name,
    available: !existingBooking,
    facilities: ground.facilities,
    address: {
      line1: ground.add1,
      line2: ground.add2,
      county: ground.county,
      postcode: ground.pin
    },
    coordinates: {
      lat: ground.lat,
      lng: ground.long
    }
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `facilities` | `GroundFacilities` | All facility fields | Get available amenities |
| `user` | `User` | All user fields | Get ground owner/manager |

### Complex Population Example
```javascript
export async function getGroundWithFacilities(groundId) {
  return await Ground.findById(groundId)
    .populate('facilities', 'name type capacity description')
    .populate('user', 'name email telephone account_type');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **GeoJSON Format** | Location point validation | Invalid location errors |
| **Coordinate Range** | Latitude (-90 to 90), Longitude (-180 to 180) | Range validation errors |
| **Enum Values** | Location type must be 'Point' | Validation errors |
| **Array Validation** | Facilities array validation | Validation errors |

---

## Business Rules

### 1. **Geospatial Indexing**
- **Rule:** Grounds must have valid geospatial coordinates
- **Format:** GeoJSON Point with `[longitude, latitude]` coordinates
- **Indexing:** 2dsphere index for efficient location queries

### 2. **Home Ground Designation**
- **Rule:** Grounds can be designated as home grounds
- **Values:** 'Yes' or 'No' (default)
- **Purpose:** Identify primary venues for teams

### 3. **Facility Management**
- **Rule:** Grounds can have multiple facilities
- **Array Relationship:** Reference to GroundFacilities collection
- **Purpose:** Detailed venue capabilities and amenities

### 4. **Address Structure**
- **Rule:** Complete address information required
- **Components:** Three address lines, postcode, county
- **Purpose:** Accurate location and navigation

### 5. **Ground Activation**
- **Rule:** Grounds can be active or inactive
- **Default:** New grounds are active
- **Impact:** Inactive grounds don't appear in venue listings

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Geospatial Queries** | 2dsphere index | Optimize query patterns for common radii |
| **Population** | Facility array population | Consider selective field population |
| **Image Arrays** | String array storage | Implement image optimization |
| **Location Updates** | Coordinate validation | Batch update operations for bulk changes |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial ground model with geospatial features |

---

## Future Enhancements

- [ ] Add ground capacity and dimensions
- [ ] Implement ground booking system integration
- [ ] Add ground maintenance schedules
- [ ] Support for ground certifications (safety, quality)
- [ ] Add ground statistics (usage, popularity)
- [ ] Implement ground rating and review system
- [ ] Add ground accessibility information
- [ ] Support for multiple ground owners/managers
- [ ] Add ground pricing and availability calendar

---

## Related Models

- `@/lib/models/GroundFacilities.js` - Ground amenities
- `@/lib/models/Teams.js` - Home teams
- `@/lib/models/Users.js` - Ground owners
- `@/lib/models/Bookings.js` - Ground bookings

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
