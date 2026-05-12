# Grounds Actions Documentation

## Actions Purpose

The `groundsActions.js` file manages sports ground/venue operations with advanced features including multiple image uploads, geolocation services, and facility associations.

**Key Responsibility:** Handle ground management with geospatial data and multi-image support.

---

## Key Features

- Multiple image upload support
- Geocoding integration for location coordinates
- Facility association management
- Complex ground data validation
- Image gallery management

---

## Special Features

### Geocoding Integration

```javascript
import { getLatLng } from "@/lib/geocode";
const geo = await getLatLng(formData.get("pin"));
```

- Converts postal codes/addresses to latitude/longitude
- Integrates with mapping services

### Multiple Image Upload

```javascript
const imageFiles = formData.getAll("images");
// Process multiple files
for (const file of imageFiles) {
  const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.name)}`;
  // Upload each file
}
```

- Supports multiple ground images
- Unique naming with timestamp + UUID

---

## Database Schema

```javascript
{
  name: String,
  address: String,
  pin: String,           // Postal code
  coordinates: {         // From geocoding
    lat: Number,
    lng: Number
  },
  facilities: [String],  // Associated facilities
  images: [String],      // Array of image paths
  // ... other fields
}
```

---

## Usage Notes

- Requires geocoding service configuration
- Handles complex image gallery management
- Supports facility associations
- Advanced validation for geospatial data
