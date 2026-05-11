# Leagues Validation Documentation

## Validation Purpose

The `leagues.js` validation module provides Zod schema validation for league-related operations in the FUTY application. It ensures data integrity for football league management, including organizational information, contact details, and league branding.

**Key Responsibility:** Validate league data structures for creation and management operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/leagues.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | League creation and update operations |

---

## Schema Definition

### LeaguesSchema Function

```javascript
export const LeaguesSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### League Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `title` | `string` | Yes | Minimum 1 character | "League title is required" |
| `content` | `string` | Optional | No specific validation | - |
| `age_groups` | `string` | Optional | No specific validation | - |

### Leadership Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `p_name` | `string` | Yes | Minimum 1 character | "President Name is required" |
| `c_name` | `string` | Yes | Minimum 1 character | "Chairman Name is required" |
| `s_name` | `string` | Yes | Minimum 1 character | "Secretary Name is required" |

### Contact Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `telephone` | `string` | Yes | Minimum 1 character | "Telephone is required" |
| `email` | `string` | Yes | - Required<br>- Valid email format<br>- Trimmed | - "Email is required"<br>- "Invalid email format" |
| `website` | `string` | Optional | Valid URL format or empty | "Enter a valid URL" |

### League Branding

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

---

## Usage Examples

### Example 1: League Creation Validation
```javascript
import { LeaguesSchema } from '@/lib/validation/leagues';

export async function createLeague(req, res) {
  try {
    const validatedData = LeaguesSchema(false).parse(req.body);

    // Create league with validated data
    const league = await League.create(validatedData);

    res.status(201).json(league);
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

### Example 2: League Update Validation
```javascript
export async function updateLeague(req, res) {
  try {
    const validatedData = LeaguesSchema(true).parse(req.body);

    const league = await League.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    res.json(league);
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

### Example 3: League Setup
```javascript
export async function setupLeague(req, res) {
  try {
    const validationResult = LeaguesSchema(false).safeParse({
      title: req.body.leagueName,
      p_name: req.body.presidentName,
      c_name: req.body.chairmanName,
      s_name: req.body.secretaryName,
      telephone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
      image: req.file,
      content: req.body.description,
      age_groups: req.body.ageGroups
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process league setup...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'League setup failed' });
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
      message: 'League title is required',
      path: ['title']
    },
    {
      code: 'custom',
      message: 'Invalid email format',
      path: ['email']
    },
    {
      code: 'invalid_string',
      validation: 'url',
      message: 'Enter a valid URL',
      path: ['website']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Title** | `too_small` | "League title is required" |
| **Required President** | `too_small` | "President Name is required" |
| **Required Chairman** | `too_small` | "Chairman Name is required" |
| **Required Secretary** | `too_small` | "Secretary Name is required" |
| **Required Phone** | `too_small` | "Telephone is required" |
| **Email Required** | `custom` | "Email is required" |
| **Email Format** | `custom` | "Invalid email format" |
| **URL Format** | `invalid_string` | "Enter a valid URL" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **League Identity**
- **Rule:** Leagues must have a title and complete leadership information
- **Required Fields:** Title, president, chairman, secretary names
- **Purpose:** Proper league identification and governance structure

### 2. **Contact Information**
- **Rule:** Leagues must provide contact details for communication
- **Required Fields:** Telephone and email
- **Purpose:** Enable league communication and coordination

### 3. **Website Validation**
- **Rule:** League websites must be valid URLs when provided
- **Optional:** Can be empty if no website exists
- **Purpose:** Ensure valid external links

### 4. **Email Validation**
- **Rule:** League email addresses must be valid and required
- **Format:** Standard email regex validation
- **Purpose:** Enable official league communication

### 5. **Branding Assets**
- **Rule:** League logos/images must be valid formats under 3MB
- **Formats:** JPEG, PNG, GIF, WebP
- **Flexibility:** Existing images don't require re-upload

### 6. **Age Group Classification**
- **Rule:** Age groups help categorize league competitions
- **Optional:** Can be configured based on league structure
- **Purpose:** League organization and competition management

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Email Validation** | Regex-based validation | Consider additional email verification |
| **URL Validation** | Basic URL validation | Add website accessibility checks |
| **File Validation** | Client-side pre-validation | Implement server-side file scanning |
| **Multiple Required Fields** | Sequential validation | Optimize for bulk operations |

---

## Testing Examples

### Valid League Data
```javascript
const validLeague = {
  title: "Premier Football League",
  p_name: "John Smith",
  c_name: "Jane Doe",
  s_name: "Bob Johnson",
  telephone: "1234567890",
  email: "info@premierleague.com",
  website: "https://premierleague.com",
  content: "The premier football league for professional teams",
  age_groups: "Senior, U18, U16"
};
```

### Invalid League Data Examples
```javascript
// Invalid title (empty)
const invalidTitle = {
  ...validLeague,
  title: "" // Empty string
};

// Invalid email
const invalidEmail = {
  ...validLeague,
  email: "not-an-email" // Invalid format
};

// Invalid website URL
const invalidWebsite = {
  ...validLeague,
  website: "not-a-website" // Invalid URL
};

// Invalid file type
const invalidFile = {
  ...validLeague,
  image: new File([''], 'logo.txt', { type: 'text/plain' })
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial leagues validation schema with comprehensive league management |

---

## Future Enhancements

- [ ] Add league registration number validation
- [ ] Implement league membership validation
- [ ] Add league location/address validation
- [ ] Support for multiple league contacts
- [ ] Add league founding date validation
- [ ] Implement league status validation
- [ ] Add league competition rules validation

---

## Related Files

- **Leagues Model:** League data structure definition
- **Teams Model:** Team league participation
- **Tournaments Model:** League tournament management

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
