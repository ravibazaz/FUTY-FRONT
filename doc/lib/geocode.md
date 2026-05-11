# Geocoding Module Documentation

## Module Purpose

The `geocode` module provides location services for the FUTY application by interfacing with the Google Maps Geocoding API. It converts UK postal codes into geographic coordinates (latitude/longitude) and calculates distances between coordinates using the Haversine formula.

**Key Responsibility:** Convert postal codes to geographic coordinates and calculate distances for location-based features in the football application.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/geocode.js` |
| **Type** | Geographic Utility Functions |
| **Dependencies** | Google Maps API |
| **Exports** | `getLatLng()`, `getDistance()` |
| **Usage Pattern** | Async API calls and mathematical calculations |

---

## API Reference

### `getLatLng(postcode)`

Converts a UK postal code to latitude and longitude coordinates.

#### Signature
```javascript
getLatLng(postcode: string): Promise<{lat: number, lng: number}>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `postcode` | `string` | Yes | UK postal code (e.g., "SW1A 1AA") |

#### Return Value

| Type | Description |
|------|-------------|
| `Promise<{lat: number, lng: number}>` | Geographic coordinates |

#### Implementation Details

- **API Endpoint:** Google Maps Geocoding API
- **Country Bias:** Appends ", UK" to focus on UK locations
- **Caching:** Uses Next.js `force-cache` for response caching
- **Error Handling:** Throws errors for failed API calls

### `getDistance(lat1, lng1, lat2, lng2)`

Calculates the great-circle distance between two geographic points.

#### Signature
```javascript
getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat1` | `number` | Yes | Latitude of first point (degrees) |
| `lng1` | `number` | Yes | Longitude of first point (degrees) |
| `lat2` | `number` | Yes | Latitude of second point (degrees) |
| `lng2` | `number` | Yes | Longitude of second point (degrees) |

#### Return Value

| Type | Description |
|------|-------------|
| `number` | Distance in kilometers |

#### Implementation Details

- **Formula:** Haversine formula for great-circle distance
- **Earth Radius:** Uses 6371 km (mean Earth radius)
- **Precision:** Returns distance with full decimal precision
- **Units:** Kilometers only

---

## Request Flow

### Geocoding Flow
```
Postal Code → Google Maps API
        ↓
  API Response Validation
        ↓
  Extract lat/lng from results[0]
        ↓
  Return coordinates
```

### Distance Calculation Flow
```
Two coordinate pairs → Haversine formula
        ↓
  Convert to radians
        ↓
  Calculate angular distance
        ↓
  Convert to kilometers
        ↓
  Return distance
```

---

## Usage Examples

### Example 1: Basic Geocoding
```javascript
import { getLatLng } from '@/lib/geocode';

export async function getStadiumLocation(stadiumName, postcode) {
  try {
    const coords = await getLatLng(postcode);
    console.log(`${stadiumName} coordinates:`, coords);
    // Output: { lat: 51.5560, lng: -0.2795 }
    
  } catch (error) {
    console.error('Geocoding failed:', error.message);
  }
}
```

### Example 2: Distance Calculation
```javascript
import { getDistance } from '@/lib/geocode';

export function calculateTravelDistance(teamA, teamB) {
  const distance = getDistance(
    teamA.lat, teamA.lng,
    teamB.lat, teamB.lng
  );
  
  return `${distance.toFixed(1)} km`;
}
```

### Example 3: Team Proximity Search
```javascript
import { getLatLng, getDistance } from '@/lib/geocode';

export async function findNearbyTeams(targetPostcode, maxDistance = 50) {
  const targetCoords = await getLatLng(targetPostcode);
  const teams = await Team.find().populate('ground');
  
  return teams.filter(team => {
    if (!team.ground?.lat || !team.ground?.lng) return false;
    
    const distance = getDistance(
      targetCoords.lat, targetCoords.lng,
      team.ground.lat, team.ground.lng
    );
    
    return distance <= maxDistance;
  });
}
```

### Example 4: Match Scheduling
```javascript
export async function scheduleMatch(homeTeam, awayTeam) {
  const distance = getDistance(
    homeTeam.ground.lat, homeTeam.ground.lng,
    awayTeam.ground.lat, awayTeam.ground.lng
  );
  
  // Calculate travel time (rough estimate: 50 km/h average)
  const travelTime = distance / 50; // hours
  
  return {
    distance: `${distance.toFixed(1)} km`,
    estimatedTravel: `${travelTime.toFixed(1)} hours`,
    isLocalDerby: distance < 100 // Within 100km
  };
}
```

### Example 5: Ground Location Setup
```javascript
import { getLatLng } from '@/lib/geocode';

export async function createGround(name, address, postcode) {
  const coords = await getLatLng(postcode);
  
  const ground = await Ground.create({
    name,
    address,
    postcode,
    lat: coords.lat,
    lng: coords.lng
  });
  
  return ground;
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **API Key** | Checks `GOOGLE_API_KEY` environment variable | API call fails |
| **Postcode Format** | Accepts any string; appends ", UK" | API handles validation |
| **API Response** | Validates `status === "OK"` | Throws error for failed requests |
| **Coordinate Values** | No validation on lat/lng inputs | Mathematical calculation proceeds |

---

## Response Examples

### Successful Geocoding
```javascript
const coords = await getLatLng('SW1A 1AA');
// Response: { lat: 51.4994, lng: -0.1319 }
```

### Distance Calculation
```javascript
const distance = getDistance(51.4994, -0.1319, 53.4808, -2.2426);
// Response: 262.877 (km between London and Manchester)
```

### API Error Response
```javascript
try {
  await getLatLng('INVALID');
} catch (error) {
  // Error: "ZERO_RESULTS"
  console.log(error.message);
}
```

---

## Error Handling

### Current State
**Basic Error Handling:** Throws errors for API failures with status codes and messages.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **API Quota Exceeded** | Too many requests | Service unavailability | **Implement request throttling** |
| **Invalid API Key** | Wrong `GOOGLE_API_KEY` | Authentication failure | **Validate API key format** |
| **Network Issues** | API unreachable | Request timeout | **Add retry logic** |
| **Invalid Postcode** | Non-existent postcode | "ZERO_RESULTS" error | **Validate postcode format** |

### Recommended Error Handling Pattern
```javascript
export async function getLatLng(postcode) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode + ", UK")}&key=${API_KEY}`,
      { cache: "force-cache" }
    );
    
    const data = await response.json();
    
    if (data.status !== "OK") {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
    
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
    
  } catch (error) {
    console.error('Geocoding error:', error);
    
    // Handle specific error types
    if (error.message.includes('ZERO_RESULTS')) {
      throw new Error('Postcode not found');
    }
    
    throw error;
  }
}
```

---

## Security Considerations

### 1. **API Key Protection**
- **Environment Variables:** API key stored securely in environment
- **No Client Exposure:** API calls made server-side only
- **Rate Limiting:** Google API quotas prevent abuse
- **Access Control:** Restrict API key to geocoding operations only

### 2. **Input Validation**
- **Postcode Sanitization:** User input should be validated before geocoding
- **SQL Injection Prevention:** No database operations in this module
- **XSS Prevention:** No HTML output generated

### 3. **Data Privacy**
- **Location Data:** Coordinates stored for legitimate business purposes
- **User Consent:** Location data usage should comply with privacy policies
- **Data Retention:** Location data retained only as needed

### 4. **API Abuse Prevention**
- **Caching:** Next.js caching reduces API calls
- **Request Limits:** Respect Google Maps API quotas
- **Error Handling:** Graceful degradation when API unavailable

---

## Important Business Rules

### 1. **UK Location Focus**
- **Rule:** All geocoding biased towards UK locations
- **Enforcement:** Automatic ", UK" append to all queries
- **Business Impact:** Accurate UK football venue locations

### 2. **Caching Strategy**
- **Rule:** Geocoding results cached for performance
- **Enforcement:** `force-cache` directive in fetch requests
- **Cost Optimization:** Reduces Google API costs

### 3. **Distance Units**
- **Rule:** All distances calculated in kilometers
- **Consistency:** Uniform unit across the application
- **User Experience:** Standard metric measurements

### 4. **Error Resilience**
- **Rule:** Application continues to function when geocoding fails
- **Implication:** Location features degrade gracefully
- **Reliability:** Core functionality not dependent on geocoding

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **Ground Management** | Stadium location setup |
| **Team Operations** | Finding nearby teams |
| **Match Scheduling** | Travel distance calculations |
| **Tournament Planning** | Venue proximity analysis |
| **User Features** | Local team discovery |

### Common Integration Patterns

```javascript
// Pattern 1: Ground Creation
export async function createGroundWithLocation(groundData) {
  const coords = await getLatLng(groundData.postcode);
  return await Ground.create({
    ...groundData,
    lat: coords.lat,
    lng: coords.lng
  });
}

// Pattern 2: Distance-based Queries
export async function findNearbyMatches(userLat, userLng, radius = 50) {
  const grounds = await Ground.find();
  
  return grounds.filter(ground => 
    getDistance(userLat, userLng, ground.lat, ground.lng) <= radius
  );
}

// Pattern 3: Travel Cost Calculation
export function calculateTravelCost(distance, costPerKm = 0.5) {
  return distance * costPerKm;
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Geocoding Time** | ~200-1000ms | Google API latency |
| **Distance Calculation** | < 1ms | Pure mathematical operation |
| **Caching** | Next.js cache | Reduces repeated API calls |
| **API Limits** | Google quotas | 40,000 requests/day free tier |

---

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GOOGLE_API_KEY` | Yes | Google Maps API key | `AIzaSyB...` |

### API Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| **API Endpoint** | `maps.googleapis.com/maps/api/geocode/json` | Geocoding service |
| **Country Bias** | `, UK` | Focus on UK locations |
| **Caching** | `force-cache` | Response caching |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial geocoding and distance calculation |

---

## Future Enhancements

- [ ] Add batch geocoding for multiple postcodes
- [ ] Implement address autocomplete functionality
- [ ] Add support for different countries/regions
- [ ] Implement caching layer for coordinates
- [ ] Add validation for UK postcode formats
- [ ] Support for different distance units (miles)
- [ ] Add timezone information for locations
- [ ] Implement reverse geocoding (coordinates to address)

---

## Related Modules

- `@/lib/models/Grounds` - Stadium location data storage
- `@/lib/models/Teams` - Team location associations

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
