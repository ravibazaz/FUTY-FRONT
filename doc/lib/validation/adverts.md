# Adverts Validation Documentation

## Validation Purpose

The `adverts.js` validation module provides Zod schema validation for advertisement-related operations in the FUTY application. It ensures data integrity for advertisement campaigns, including content validation, scheduling requirements, and image upload constraints.

**Key Responsibility:** Validate advertisement data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/adverts.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Advertisement creation and update operations |

---

## Schema Definition

### AdvertsSchema Function

```javascript
export const AdvertsSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Core Advertisement Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `name` | `string` | Yes | Minimum 1 character | "Advert title is required" |

### Content & Links

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `link` | `string` | Yes | Valid URL format | "Enter a valid URL" |
| `content` | `string` | Optional | No specific validation | - |

### Campaign Scheduling

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `date` | `string` | Yes | Minimum 1 character | "Start date is required" |
| `time` | `string` | Yes | Minimum 1 character | "Start time is required" |
| `end_date` | `string` | Yes | Minimum 1 character | "End date is required" |
| `end_time` | `string` | Yes | Minimum 1 character | "End time is required" |

### Image Upload

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

### Page Placement

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `pages` | `string` | Optional | No specific validation | - |

---

## Usage Examples

### Example 1: Advertisement Creation Validation
```javascript
import { AdvertsSchema } from '@/lib/validation/adverts';

export async function createAdvert(req, res) {
  try {
    const validatedData = AdvertsSchema(false).parse(req.body);
    
    // Create advertisement with validated data
    const advert = await Advert.create(validatedData);
    
    res.status(201).json(advert);
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

### Example 2: Advertisement Update Validation
```javascript
export async function updateAdvert(req, res) {
  try {
    const validatedData = AdvertsSchema(true).parse(req.body);
    
    const advert = await Advert.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!advert) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }
    
    res.json(advert);
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

### Example 3: Campaign Setup
```javascript
export async function setupAdvertCampaign(req, res) {
  try {
    const validationResult = AdvertsSchema(false).safeParse({
      name: req.body.campaignName,
      link: req.body.externalLink,
      content: req.body.description,
      image: req.file,
      date: req.body.startDate,
      time: req.body.startTime,
      end_date: req.body.endDate,
      end_time: req.body.endTime,
      pages: req.body.pagePlacement
    });
    
    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }
    
    // Process campaign setup...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Campaign setup failed' });
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
      minimum: 1,
      type: 'string',
      inclusive: true,
      exact: false,
      message: 'Advert title is required',
      path: ['name']
    },
    {
      code: 'custom',
      message: 'Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed.',
      path: ['image']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Field** | `too_small` | "Advert title is required" |
| **URL Format** | `invalid_string` | "Enter a valid URL" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **Campaign Identity**
- **Rule:** Advertisement campaigns must have a name
- **Minimum Length:** At least 1 character
- **Purpose:** Clear campaign identification

### 2. **External Links**
- **Rule:** Advertisements must link to valid external URLs
- **Validation:** Standard URL format checking
- **Purpose:** Ensure valid advertisement destinations

### 3. **Scheduling Requirements**
- **Rule:** All campaign dates and times are required
- **Fields:** Start date, start time, end date, end time
- **Purpose:** Complete campaign scheduling information

### 4. **Image Upload Constraints**
- **Rule:** Only specific image formats accepted
- **Size Limit:** 3MB maximum file size
- **Flexibility:** Existing images don't require re-upload

### 5. **Page Placement**
- **Rule:** Page placement is optional but recommended
- **Purpose:** Flexible advertisement targeting
- **Default:** Can be configured post-creation

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

### Valid Advertisement Data
```javascript
const validAdvert = {
  name: "Summer Football Gear Sale",
  link: "https://sportsstore.com/summer-sale",
  content: "Get 30% off on all football equipment this summer!",
  date: "2024-06-01",
  time: "09:00",
  end_date: "2024-08-31",
  end_time: "23:59",
  pages: "home,shop"
};
```

### Invalid Advertisement Data Examples
```javascript
// Invalid name (empty)
const invalidName = {
  ...validAdvert,
  name: "" // Empty string
};

// Invalid URL
const invalidUrl = {
  ...validAdvert,
  link: "not-a-url" // Invalid URL format
};

// Missing required dates
const missingDates = {
  ...validAdvert,
  date: "", // Empty start date
  time: "", // Empty start time
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial adverts validation schema with campaign scheduling |

---

## Future Enhancements

- [ ] Add date format validation (ISO 8601)
- [ ] Implement date range validation (end after start)
- [ ] Add page placement validation against available pages
- [ ] Support for multiple image uploads
- [ ] Add campaign budget validation
- [ ] Implement advertisement category validation
- [ ] Add link validation (check if URL is accessible)
- [ ] Support for advertisement templates

---

## Related Files

- `@/lib/models/Adverts.js` - Advertisement model definition
- `@/lib/validation/vendors.js` - Similar vendor validation schema

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
