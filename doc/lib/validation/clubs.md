# Clubs Validation Documentation

## Validation Purpose

The `clubs.js` validation module provides Zod schema validation for club-related operations in the FUTY application. It ensures data integrity for club creation and updates, including contact information for both secretary and welfare officer roles, league affiliation, and image uploads.

**Key Responsibility:** Validate club data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/clubs.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Club creation and update operations |

---

## Schema Definition

### ClubSchema Function

```javascript
export const ClubSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Core Club Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `name` | `string` | Yes | Minimum 2 characters | "Club Name is required" |
| `league` | `string` | Yes | Minimum 2 characters | "League is required" |

### Secretary Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `secretary_name` | `string` | Yes | Minimum 2 characters | "Secretary Name is required" |
| `phone` | `string` | Yes | - 10-11 digits<br>- Digits only (0-9)<br>- Trimmed whitespace | - "Telephone must be at least 10 digits."<br>- "Telephone must be at most 11 digits."<br>- "Digits only (0–9)" |
| `secretary_website` | `string` | Optional | - Valid URL format<br>- Can be empty string | "Enter a valid URL" |
| `email` | `string` | Yes | - Valid email format<br>- Trimmed whitespace<br>- Custom validation | - "Email is required"<br>- "Invalid email format" |

### Club Welfare Officer (CWO) Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `cwo_name` | `string` | Yes | Minimum 2 characters | "Cwo Name is required" |
| `cwo_phone` | `string` | Yes | - 10-11 digits<br>- Digits only (0-9)<br>- Trimmed whitespace | - "Cwo PHone must be at least 10 digits."<br>- "Cwo PHone must be at most 11 digits."<br>- "Digits only (0–9)" |
| `cwo_email` | `string` | Yes | - Valid email format<br>- Trimmed whitespace<br>- Custom validation | - "Email is required"<br>- "Invalid email format" |

### Image Upload

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

---

## Usage Examples

### Example 1: Club Creation Validation
```javascript
import { ClubSchema } from '@/lib/validation/clubs';

export async function createClub(req, res) {
  try {
    const validatedData = ClubSchema(false).parse(req.body);
    
    // Create club with validated data
    const club = await Club.create(validatedData);
    
    res.status(201).json(club);
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

### Example 2: Club Update Validation
```javascript
export async function updateClub(req, res) {
  try {
    const validatedData = ClubSchema(true).parse(req.body);
    
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    res.json(club);
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

### Example 3: Form Data Handling
```javascript
export async function uploadClubLogo(req, res) {
  try {
    const formData = new FormData();
    
    // Validate the uploaded file
    const validationResult = ClubSchema(false).safeParse({
      name: req.body.name,
      secretary_name: req.body.secretaryName,
      cwo_name: req.body.cwoName,
      cwo_phone: req.body.cwoPhone,
      secretary_website: req.body.website,
      phone: req.body.phone,
      league: req.body.league,
      email: req.body.email,
      cwo_email: req.body.cwoEmail,
      image: req.file, // Multer file object
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
      message: 'Club Name is required',
      path: ['name']
    },
    {
      code: 'custom',
      message: 'Invalid email format',
      path: ['email']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Field** | `too_small` | "Club Name is required" |
| **Invalid Format** | `custom` | "Invalid email format" |
| **Length Minimum** | `too_small` | "Telephone must be at least 10 digits." |
| **Length Maximum** | `too_small` | "Telephone must be at most 11 digits." |
| **Regex Pattern** | `invalid_string` | "Digits only (0–9)" |
| **URL Format** | `invalid_string` | "Enter a valid URL" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **Dual Contact Structure**
- **Rule:** Clubs must provide both secretary and CWO contact information
- **Validation:** Both names and contact details are required
- **Compliance:** Supports governance and child welfare requirements

### 2. **Contact Information Standards**
- **Rule:** Phone numbers must be 10-11 digits, UK format
- **Validation:** Regex pattern ensures numeric-only input
- **Trimming:** Automatic whitespace removal

### 3. **Email Validation**
- **Rule:** Both secretary and CWO emails must be valid
- **Custom Validation:** Super refine for detailed error messages
- **Required:** Both email addresses are mandatory

### 4. **Website Validation**
- **Rule:** Secretary website must be a valid URL if provided
- **Optional:** Can be left empty
- **Format:** Standard URL validation

### 5. **League Affiliation**
- **Rule:** Clubs must be affiliated with a league
- **Required:** League reference is mandatory
- **Purpose:** Organized competition structure

### 6. **Image Upload Constraints**
- **Rule:** Only specific image formats accepted
- **Size Limit:** 3MB maximum file size
- **Flexibility:** Existing images don't require re-upload

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Validation Speed** | Synchronous validation | Consider async for file processing |
| **Error Messages** | Detailed custom messages | Balance detail with performance |
| **File Validation** | Client-side pre-validation | Implement server-side file scanning |
| **Bulk Operations** | Individual validation | Batch validation for imports |

---

## Testing Examples

### Valid Club Data
```javascript
const validClub = {
  name: "Chelsea FC",
  secretary_name: "John Smith",
  cwo_name: "Sarah Johnson",
  cwo_phone: "07123456789",
  secretary_website: "https://chelsea-fc.co.uk",
  phone: "02012345678",
  league: "premier-league-id",
  email: "secretary@chelsea-fc.co.uk",
  cwo_email: "cwo@chelsea-fc.co.uk"
};
```

### Invalid Club Data Examples
```javascript
// Invalid name (too short)
const invalidName = {
  ...validClub,
  name: "A" // Less than 2 characters
};

// Invalid phone (too short)
const invalidPhone = {
  ...validClub,
  phone: "123456789" // 9 digits
};

// Invalid email
const invalidEmail = {
  ...validClub,
  email: "invalid-email" // Missing domain
};

// Invalid website
const invalidWebsite = {
  ...validClub,
  secretary_website: "not-a-url" // Invalid URL format
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial club validation schema with dual contact structure |

---

## Future Enhancements

- [ ] Add club name uniqueness validation
- [ ] Implement league reference validation
- [ ] Add CWO qualification validation
- [ ] Support for multiple secretaries/CWOs
- [ ] Add club registration number validation
- [ ] Implement address validation
- [ ] Add club establishment date validation

---

## Related Files

- `@/lib/models/Clubs.js` - Club model definition
- `@/lib/validation/leagues.js` - League validation schema
- `@/lib/validation/teams.js` - Team validation schema

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
