# Teams Validation Documentation

## Validation Purpose

The `teams.js` validation module provides Zod schema validation for team-related operations in the FUTY application. It ensures data integrity for team creation and updates, including contact information, kit customization, and relationship references.

**Key Responsibility:** Validate team data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/teams.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Team creation and update operations |

---

## Schema Definition

### TeamSchema Function

```javascript
export const TeamSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Core Team Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `name` | `string` | Optional | No specific validation | - |
| `ground` | `string` | Yes | Minimum 2 characters | "Ground is required" |
| `club` | `string` | Yes | Minimum 2 characters | "Club is required" |

### Contact Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `phone` | `string` | Yes | - 10-11 digits<br>- Digits only (0-9)<br>- Trimmed whitespace | - "Telephone must be at least 10 digits."<br>- "Telephone must be at most 11 digits."<br>- "Digits only (0–9)" |
| `email` | `string` | Yes | - Valid email format<br>- Trimmed whitespace<br>- Custom validation | - "Email is required"<br>- "Invalid email format" |

### Image Upload

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

### Kit Customization

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `shirt` | `string` | Optional | No specific validation | - |
| `shorts` | `string` | Optional | No specific validation | - |
| `socks` | `string` | Optional | No specific validation | - |

### Formation Preferences

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `attack` | `string` | Optional | No specific validation | - |
| `midfield` | `string` | Optional | No specific validation | - |
| `defence` | `string` | Optional | No specific validation | - |
| `age_groups` | `string` | Optional | No specific validation | - |

---

## Usage Examples

### Example 1: Team Creation Validation
```javascript
import { TeamSchema } from '@/lib/validation/teams';

export async function createTeam(req, res) {
  try {
    const validatedData = TeamSchema(false).parse(req.body);
    
    // Create team with validated data
    const team = await Team.create(validatedData);
    
    res.status(201).json(team);
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

### Example 2: Team Update Validation
```javascript
export async function updateTeam(req, res) {
  try {
    const validatedData = TeamSchema(true).parse(req.body);
    
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(team);
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
export async function uploadTeamLogo(req, res) {
  try {
    const formData = new FormData();
    
    // Validate the uploaded file
    const validationResult = TeamSchema(false).safeParse({
      name: req.body.name,
      ground: req.body.ground,
      club: req.body.club,
      phone: req.body.phone,
      email: req.body.email,
      image: req.file, // Multer file object
      shirt: req.body.shirt,
      shorts: req.body.shorts,
      socks: req.body.socks,
      attack: req.body.attack,
      midfield: req.body.midfield,
      defence: req.body.defence,
      age_groups: req.body.age_groups
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

### Example 4: Bulk Team Import
```javascript
export async function importTeams(teamsData) {
  const validationResults = [];
  
  for (const teamData of teamsData) {
    const result = TeamSchema(false).safeParse(teamData);
    validationResults.push({
      data: teamData,
      isValid: result.success,
      errors: result.success ? null : result.error.errors
    });
  }
  
  const validTeams = validationResults
    .filter(result => result.isValid)
    .map(result => result.data);
  
  const invalidTeams = validationResults
    .filter(result => !result.isValid);
  
  return {
    valid: validTeams,
    invalid: invalidTeams,
    summary: {
      total: teamsData.length,
      valid: validTeams.length,
      invalid: invalidTeams.length
    }
  };
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
      minimum: 10,
      type: 'string',
      inclusive: true,
      exact: false,
      message: 'Telephone must be at least 10 digits.',
      path: ['phone']
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
| **Required Field** | `custom` | "Email is required" |
| **Invalid Format** | `custom` | "Invalid email format" |
| **Length Minimum** | `too_small` | "Telephone must be at least 10 digits." |
| **Length Maximum** | `too_small` | "Telephone must be at most 11 digits." |
| **Regex Pattern** | `invalid_string` | "Digits only (0–9)" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **Edit Mode Flexibility**
- **Rule:** Validation strictness can be adjusted for updates
- **Implementation:** `isEdit` parameter controls required fields
- **Purpose:** Allow partial updates without requiring all fields

### 2. **Contact Information Standards**
- **Rule:** Phone numbers must be 10-11 digits, UK format
- **Validation:** Regex pattern ensures numeric-only input
- **Trimming:** Automatic whitespace removal

### 3. **Email Validation**
- **Rule:** Standard email format required
- **Custom Validation:** Super refine for detailed error messages
- **Required:** Email is mandatory for team contact

### 4. **Image Upload Constraints**
- **Rule:** Only specific image formats accepted
- **Size Limit:** 3MB maximum file size
- **Flexibility:** Existing images don't require re-upload

### 5. **Optional Customization**
- **Rule:** Kit colors and formation preferences are optional
- **Purpose:** Allow teams to customize gradually
- **Default Values:** Can be set in application logic

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

### Valid Team Data
```javascript
const validTeam = {
  name: "Arsenal FC",
  ground: "Emirates Stadium",
  club: "Arsenal Club",
  phone: "02012345678",
  email: "contact@arsenal.com",
  shirt: "red",
  shorts: "white",
  socks: "red",
  attack: "4-3-3",
  midfield: "balanced",
  defence: "4-4-2",
  age_groups: "senior"
};
```

### Invalid Team Data Examples
```javascript
// Invalid phone (too short)
const invalidPhone = {
  ...validTeam,
  phone: "123456789" // 9 digits
};

// Invalid email
const invalidEmail = {
  ...validTeam,
  email: "invalid-email" // Missing domain
};

// Invalid file type
const invalidFile = {
  ...validTeam,
  image: new File([''], 'test.txt', { type: 'text/plain' })
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial team validation schema with comprehensive rules |

---

## Future Enhancements

- [ ] Add team name uniqueness validation
- [ ] Implement ground and club reference validation
- [ ] Add age group validation against existing groups
- [ ] Support for multiple image formats
- [ ] Add team URL/website validation
- [ ] Implement team code/name format validation
- [ ] Add validation for formation string formats

---

## Related Files

- `@/lib/models/Teams.js` - Team model definition
- `@/lib/validation/clubs.js` - Club validation schema
- `@/lib/validation/grounds.js` - Ground validation schema

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
