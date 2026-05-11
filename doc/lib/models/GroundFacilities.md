# GroundFacilities Model Documentation

## Model Purpose

The `GroundFacilities` model represents amenities and facilities available at football grounds in the FUTY application. It stores facility names and descriptions, serving as reference data for ground capabilities and venue features.

**Key Responsibility:** Define and manage facility types available at football venues.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/GroundFacilities.js` |
| **Collection Name** | `groundfacilities` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Grounds (referenced in facilities array) |
| **Special Features** | Reference data for venue amenities |

---

## Schema Definition

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `facilities` | `String` | No | Facility name (e.g., "Changing Rooms", "Floodlights") |
| `description` | `String` | No | Detailed description of the facility |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Facility creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Facility Name** | `facilities` | Facility lookup and uniqueness |
| **Creation Date** | `createdAt` | Chronological sorting |

---

## Usage Examples

### Example 1: Facility Creation
```javascript
import GroundFacility from '@/lib/models/GroundFacilities';

export async function createFacility(facilityData) {
  const facility = new GroundFacility({
    facilities: facilityData.name,
    description: facilityData.description
  });

  return await facility.save();
}
```

### Example 2: Get All Facilities
```javascript
export async function getAllFacilities() {
  return await GroundFacility.find({})
    .sort({ facilities: 1 });
}
```

### Example 3: Find Grounds with Specific Facility
```javascript
export async function findGroundsWithFacility(facilityId) {
  return await Ground.find({
    facilities: facilityId,
    isActive: true
  })
  .select('name add1 county')
  .sort({ name: 1 });
}
```

### Example 4: Facility Usage Statistics
```javascript
export async function getFacilityStats(facilityId) {
  const facility = await GroundFacility.findById(facilityId);
  
  const groundCount = await Ground.countDocuments({
    facilities: facilityId,
    isActive: true
  });
  
  return {
    facility: facility.facilities,
    description: facility.description,
    groundsCount: groundCount
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `facilities` | `Grounds` | Referenced in grounds | Get grounds with this facility |

### Reverse Population Example
```javascript
export async function getFacilityWithGrounds(facilityId) {
  const facility = await GroundFacility.findById(facilityId);
  
  const grounds = await Ground.find({
    facilities: facilityId,
    isActive: true
  })
  .select('name add1 county')
  .sort({ name: 1 });
  
  return {
    ...facility.toObject(),
    grounds
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

### 1. **Facility Naming**
- **Rule:** Facilities should have clear, descriptive names
- **Examples:** "Changing Rooms", "Floodlights", "Car Parking", "Refreshments"
- **Purpose:** Clear identification of venue capabilities

### 2. **Description Requirements**
- **Rule:** Facilities should include detailed descriptions
- **Purpose:** Explain facility features, capacity, and usage
- **Optional:** Descriptions can be added post-creation

### 3. **Ground Association**
- **Rule:** Facilities are referenced by grounds
- **Relationship:** Many-to-many through array references
- **Purpose:** Detail venue amenities and capabilities

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Query Patterns** | Simple lookups | Add caching for frequently accessed facilities |
| **Indexing** | Minimal indexes | Add unique constraint on facilities if required |
| **Relationships** | Reverse lookups | Consider denormalization for performance |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial ground facilities model |

---

## Future Enhancements

- [ ] Add facility categories (e.g., "Pitch", "Buildings", "Parking")
- [ ] Implement facility capacity and specifications
- [ ] Add facility availability and booking integration
- [ ] Support for facility images and media
- [ ] Add facility maintenance schedules
- [ ] Implement facility rating and condition tracking
- [ ] Add facility cost and pricing information

---

## Related Models

- `@/lib/models/Grounds.js` - Grounds with these facilities
- `@/lib/models/Bookings.js` - Facility booking references

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
