# Grounds Validation Documentation

## Validation Purpose

The `grounds.js` validation module provides Zod schema validation for ground/venue-related operations in the FUTY application. It ensures data integrity for venue creation and updates, including address information, descriptions, and image uploads.

**Key Responsibility:** Validate ground data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/grounds.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Ground creation and update operations |

---

## Schema Definition

### GroundSchema Function

```javascript
export const GroundSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Core Ground Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `name` | `string` | Yes | Minimum 2 characters | "Ground Name is required" |
| `add1` | `string` | Yes | Minimum 2 characters | "Address 1 is required" |
| `content` | `string` | Yes | Minimum 2 characters | "Description is required" |
| `pin` | `string` | Yes | Minimum 1 character | "Post code is required" |

### Address Information (Optional)

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `add2` | `string` | Optional | No specific validation | - |
| `add3` | `string` | Optional | No specific validation | - |

### Geospatial Coordinates

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `lat` | `string` | Optional | No specific validation | - |
| `long` | `string` | Optional | No specific validation | - |

### Image Upload

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `images` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB per file<br>- Supports single or multiple files<br>- At least one valid file required if uploading | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

---

## Usage Examples

### Example 1: Ground Creation Validation
```javascript
import { GroundSchema } from '@/lib/validation/grounds';

export async function createGround(req, res) {
  try {
    const validatedData = GroundSchema(false).parse(req.body);
    
    // Create ground with validated data
    const ground = await Ground.create(validatedData);
    
    res.status(201).json(ground);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Example 2: Ground Update Validation
```javascript
export async function updateGround(req, res) {
  try {
    const validatedData = GroundSchema(true).parse(req.body);
    
    const ground = await Ground.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!ground) {
      return res.status(404).json({ error: 'Ground not found' });
    }
    
    res.json(ground);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Example 3: Multiple Image Upload
```javascript
export async function uploadGroundImages(req, res) {
  try {
    const formData = new FormData();
    
    // Validate multiple uploaded files
    const validationResult = GroundSchema(false).safeParse({
      name: req.body.name,
      add1: req.body.address1,
      content: req.body.description,
      pin: req.body.postcode,
      add2: req.body.address2,
      add3: req.body.address3,
      lat: req.body.latitude,
      long: req.body.longitude,
      images: req.files, // Array of Multer file objects
    });
    
    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }
    
    // Process validated data...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
}
```

---

## Error Handling

### Zod Validation Errors

```javascript
// Error structure from Zod
{
  errors: [
    {
      code: 'too_small',
      minimum: 2,
      type: 'string',
      inclusive: true,
      exact: false,
      message: 'Ground Name is required',
      path: ['name']
    },
    {
      code: 'custom',
      message: 'Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed.',
      path: ['images']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Field** | `too_small` | "Ground Name is required" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **Address Structure**
- **Rule:** Primary address (add1) and postcode are required
- **Optional:** Additional address lines can be provided
- **Purpose:** Complete venue location information

### 2. **Geospatial Coordinates**
- **Rule:** Latitude and longitude are optional but recommended
- **Format:** Stored as strings (consider numeric conversion)
- **Purpose:** Enable location-based features and mapping

### 3. **Content Description**
- **Rule:** Ground description is required
- **Minimum Length:** At least 2 characters
- **Purpose:** Provide venue information to users

### 4. **Image Upload Flexibility**
- **Rule:** Support for single or multiple image uploads
- **Validation:** All uploaded files must meet criteria
- **Size Limit:** 3MB per file
- **Formats:** JPEG, PNG, GIF, WebP only

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Validation Speed** | Synchronous validation | Consider async for file processing |
| **Multiple Files** | Array validation | Implement parallel file validation |
| **Error Messages** | Detailed custom messages | Balance detail with performance |
| **File Validation** | Client-side pre-validation | Implement server-side file scanning |

---

## Testing Examples

### Valid Ground Data
```javascript
const validGround = {
  name: "Wembley Stadium",
  add1: "Wembley Park",
  content: "Iconic national stadium hosting major football events",
  pin: "HA9 0WS",
  add2: "London",
  add3: "England",
  lat: "51.5560",
  long: "-0.2795"
};
```

### Invalid Ground Data Examples
```javascript
// Invalid name (too short)
const invalidName = {
  ...validGround,
  name: "A" // Less than 2 characters
};

// Invalid address
const invalidAddress = {
  ...validGround,
  add1: "A" // Less than 2 characters
};

// Invalid file type
const invalidFile = {
  ...validGround,
  images: [new File([''], 'test.txt', { type: 'text/plain' })]
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial ground validation schema with image upload support |

---

## Future Enhancements

- [ ] Add coordinate format validation (latitude/longitude ranges)
- [ ] Implement postcode format validation
- [ ] Add address geocoding validation
- [ ] Support for more image formats
- [ ] Add image dimension validation
- [ ] Implement ground capacity validation
- [ ] Add facility validation
- [ ] Support for video uploads

---

## Related Files

- `@/lib/models/Grounds.js` - Ground model definition
- `@/lib/validation/groundfacilities.js` - Ground facilities validation
- `@/lib/validation/teams.js` - Team validation schema

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
