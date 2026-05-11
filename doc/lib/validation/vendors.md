# Vendors Validation Documentation

## Validation Purpose

The `vendors.js` validation module provides Zod schema validation for vendor/advertiser-related operations in the FUTY application. It ensures data integrity for vendor profiles and advertising campaigns, including contact information, website validation, and image uploads.

**Key Responsibility:** Validate vendor data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/vendors.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Vendor creation and update operations |

---

## Schema Definition

### VendorsSchema Function

```javascript
export const VendorsSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Core Vendor Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `name` | `string` | Yes | Minimum 1 character | "Vendor title is required" |
| `link` | `string` | Yes | Valid URL format | "Enter a valid URL" |

### Contact Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `phone` | `string` | Yes | - 10-11 digits<br>- Digits only (0-9)<br>- Trimmed whitespace | - "Telephone must be at least 10 digits."<br>- "Telephone must be at most 11 digits."<br>- "Digits only (0–9)" |
| `email` | `string` | Yes | - Valid email format<br>- Trimmed whitespace<br>- Custom validation | - "Email is required"<br>- "Invalid email format" |

### Image Upload

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

### Campaign Information (Optional)

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `content` | `string` | Optional | No specific validation | - |
| `date` | `string` | Optional | No specific validation | - |
| `time` | `string` | Optional | No specific validation | - |
| `end_date` | `string` | Optional | No specific validation | - |
| `end_time` | `string` | Optional | No specific validation | - |
| `pages` | `string` | Optional | No specific validation | - |

---

## Usage Examples

### Example 1: Vendor Creation Validation
```javascript
import { VendorsSchema } from '@/lib/validation/vendors';

export async function createVendor(req, res) {
  try {
    const validatedData = VendorsSchema(false).parse(req.body);
    
    // Create vendor with validated data
    const vendor = await Vendor.create(validatedData);
    
    res.status(201).json(vendor);
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

### Example 2: Vendor Update Validation
```javascript
export async function updateVendor(req, res) {
  try {
    const validatedData = VendorsSchema(true).parse(req.body);
    
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json(vendor);
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
export async function setupVendorCampaign(req, res) {
  try {
    const validationResult = VendorsSchema(false).safeParse({
      name: req.body.name,
      link: req.body.website,
      phone: req.body.phone,
      email: req.body.email,
      image: req.file,
      content: req.body.description,
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
      message: 'Vendor title is required',
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
| **Required Field** | `too_small` | "Vendor title is required" |
| **Invalid Format** | `custom` | "Invalid email format" |
| **URL Format** | `invalid_string` | "Enter a valid URL" |
| **Length Minimum** | `too_small` | "Telephone must be at least 10 digits." |
| **Length Maximum** | `too_small` | "Telephone must be at most 11 digits." |
| **Regex Pattern** | `invalid_string` | "Digits only (0–9)" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **Vendor Identity**
- **Rule:** Vendor name is required (minimum 1 character)
- **Purpose:** Clear identification of business/vendor
- **Flexibility:** Allows for various business name lengths

### 2. **Website Validation**
- **Rule:** Vendor website must be a valid URL
- **Required:** Website link is mandatory
- **Purpose:** Ensure valid external links for advertising

### 3. **Contact Information Standards**
- **Rule:** Phone numbers must be 10-11 digits, UK format
- **Validation:** Regex pattern ensures numeric-only input
- **Trimming:** Automatic whitespace removal

### 4. **Email Validation**
- **Rule:** Email must be valid format
- **Custom Validation:** Super refine for detailed error messages
- **Required:** Email address is mandatory for vendor contact

### 5. **Campaign Flexibility**
- **Rule:** Campaign dates, times, and page placements are optional
- **Purpose:** Allow vendors to set up campaigns gradually
- **Default Values:** Can be configured in application logic

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

### Valid Vendor Data
```javascript
const validVendor = {
  name: "SportsPro Equipment",
  link: "https://sportspro.com",
  phone: "02012345678",
  email: "contact@sportspro.com",
  content: "Premium football equipment and gear",
  date: "2024-01-15",
  time: "09:00",
  end_date: "2024-12-31",
  end_time: "23:59",
  pages: "home,shop"
};
```

### Invalid Vendor Data Examples
```javascript
// Invalid name (empty)
const invalidName = {
  ...validVendor,
  name: "" // Empty string
};

// Invalid URL
const invalidUrl = {
  ...validVendor,
  link: "not-a-url" // Invalid URL format
};

// Invalid phone (too short)
const invalidPhone = {
  ...validVendor,
  phone: "123456789" // 9 digits
};

// Invalid email
const invalidEmail = {
  ...validVendor,
  email: "invalid-email" // Missing domain
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial vendor validation schema with campaign support |

---

## Future Enhancements

- [ ] Add vendor category validation
- [ ] Implement campaign date range validation
- [ ] Add page placement validation against available pages
- [ ] Support for multiple contact emails/phones
- [ ] Add vendor registration number validation
- [ ] Implement address validation for vendors
- [ ] Add campaign budget validation
- [ ] Support for multiple image uploads

---

## Related Files

- `@/lib/models/Vendors.js` - Vendor model definition
- `@/lib/validation/teams.js` - Team validation schema
- `@/lib/validation/clubs.js` - Club validation schema

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
