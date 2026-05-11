# Managers Validation Documentation

## Validation Purpose

The `managers.js` validation module provides Zod schema validation for manager user account operations in the FUTY application. It ensures data integrity for manager registration, profile management, and team association with comprehensive validation for personal information, contact details, and managerial attributes.

**Key Responsibility:** Validate manager user data structures for registration and profile management operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/managers.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Manager registration and profile update operations |

---

## Schema Definition

### ManagersSchema Function

```javascript
export const ManagersSchema = (isEdit = false) => z.object({
  // Field validations with conditional logic for edit mode
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates (affects password requirements)

---

## Field Validations

### Personal Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `name` | `string` | Yes | Minimum 2 characters | "First Name is required" |
| `surname` | `string` | Optional | No specific validation | - |
| `nick_name` | `string` | Optional | No specific validation | - |
| `account_type` | `string` | Optional | No specific validation | - |

### Contact Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `email` | `string` | Yes | - Required<br>- Valid email format<br>- Trimmed | - "Email is required"<br>- "Invalid email format" |
| `telephone` | `string` | Yes | - 10-11 digits<br>- Digits only (0-9)<br>- Trimmed | - "Telephone must be at least 10 digits."<br>- "Telephone must be at most 11 digits."<br>- "Digits only (0–9)" |
| `post_code` | `string` | Optional | No specific validation | - |

### Profile Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `profile_description` | `string` | Optional | No specific validation | - |
| `travel_distance` | `string` | Optional | No specific validation | - |
| `playing_style` | `string` | Optional | No specific validation | - |

### Profile Image

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `profile_image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

### Security

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `password` | `string` | Yes (create)<br>Optional (edit) | Minimum 7 characters | "Password must be at least 7 characters long" |

### Team Association

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `team_id` | `string` | Yes | Minimum 2 characters | "Team is required" |

---

## Usage Examples

### Example 1: Manager Registration Validation
```javascript
import { ManagersSchema } from '@/lib/validation/managers';

export async function registerManager(req, res) {
  try {
    const validatedData = ManagersSchema(false).parse({
      name: req.body.firstName,
      surname: req.body.lastName,
      nick_name: req.body.nickName,
      email: req.body.email,
      telephone: req.body.phone,
      post_code: req.body.postCode,
      password: req.body.password,
      profile_image: req.file,
      profile_description: req.body.description,
      travel_distance: req.body.travelDistance,
      playing_style: req.body.playingStyle,
      team_id: req.body.teamId,
      account_type: 'manager'
    });

    // Create manager account with validated data
    const manager = await User.create({
      ...validatedData,
      role: 'manager'
    });

    res.status(201).json(manager);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    res.status(500).json({ error: 'Registration failed' });
  }
}
```

### Example 2: Manager Profile Update Validation
```javascript
export async function updateManagerProfile(req, res) {
  try {
    const validatedData = ManagersSchema(true).parse({
      name: req.body.firstName,
      surname: req.body.lastName,
      nick_name: req.body.nickName,
      email: req.body.email,
      telephone: req.body.phone,
      post_code: req.body.postCode,
      profile_image: req.file,
      profile_description: req.body.description,
      travel_distance: req.body.travelDistance,
      playing_style: req.body.playingStyle,
      team_id: req.body.teamId,
      // password is optional in edit mode
      ...(req.body.password && { password: req.body.password })
    });

    const manager = await User.findByIdAndUpdate(
      req.user.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    res.json(manager);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    res.status(500).json({ error: 'Profile update failed' });
  }
}
```

### Example 3: Manager Account Setup
```javascript
export async function setupManagerAccount(req, res) {
  try {
    const validationResult = ManagersSchema(false).safeParse({
      name: req.body.firstName,
      surname: req.body.lastName,
      nick_name: req.body.nickName,
      email: req.body.email,
      telephone: req.body.phone,
      post_code: req.body.postCode,
      password: req.body.password,
      profile_image: req.file,
      profile_description: req.body.description,
      travel_distance: req.body.travelDistance,
      playing_style: req.body.playingStyle,
      team_id: req.body.teamId,
      account_type: req.body.accountType || 'manager'
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process manager account setup...
    res.json({ success: true, message: 'Manager account created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Account setup failed' });
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
      message: 'First Name is required',
      path: ['name']
    },
    {
      code: 'custom',
      message: 'Invalid email format',
      path: ['email']
    },
    {
      code: 'too_small',
      minimum: 2,
      type: 'string',
      inclusive: true,
      exact: false,
      message: 'Team is required',
      path: ['team_id']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Name** | `too_small` | "First Name is required" |
| **Email Required** | `custom` | "Email is required" |
| **Email Format** | `custom` | "Invalid email format" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |
| **Password Length** | `too_small` | "Password must be at least 7 characters long" |
| **Phone Length Min** | `too_small` | "Telephone must be at least 10 digits." |
| **Phone Length Max** | `too_big` | "Telephone must be at most 11 digits." |
| **Phone Format** | `invalid_string` | "Digits only (0–9)" |
| **Required Team** | `too_small` | "Team is required" |

---

## Business Rules

### 1. **Manager Identity**
- **Rule:** Managers must provide complete personal information
- **Required Fields:** First name, email, phone, password, team association
- **Purpose:** Ensure proper manager identification and team leadership

### 2. **Team Association**
- **Rule:** Managers must be associated with a specific team
- **Required Field:** team_id with minimum 2 characters
- **Purpose:** Establish managerial responsibility and team management

### 3. **Profile Enhancement**
- **Rule:** Managers can provide detailed profile information
- **Optional Fields:** Nickname, description, travel distance, playing style
- **Purpose:** Enhanced manager profiles for better team matching

### 4. **Contact Information**
- **Rule:** Managers must provide valid contact details
- **Required Fields:** Email and telephone
- **Purpose:** Enable communication for team coordination

### 5. **Location Information**
- **Rule:** Post code helps with geographical team matching
- **Optional:** Can be used for local team discovery
- **Purpose:** Location-based team and player connections

### 6. **Profile Image**
- **Rule:** Profile images must be valid formats under 3MB
- **Formats:** JPEG, PNG, GIF, WebP
- **Flexibility:** Existing images don't require re-upload

### 7. **Password Security**
- **Rule:** Passwords must be at least 7 characters
- **Edit Mode:** Password optional for profile updates
- **Purpose:** Basic password security requirements

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Email Validation** | Regex-based validation | Consider additional email verification |
| **File Validation** | Client-side pre-validation | Implement server-side file scanning |
| **Password Validation** | Length-only validation | Add complexity requirements |
| **Team Validation** | String length validation | Add team existence validation |

---

## Testing Examples

### Valid Manager Data
```javascript
const validManager = {
  name: "John",
  surname: "Smith",
  nick_name: "Johnny",
  email: "john.smith@example.com",
  telephone: "1234567890",
  post_code: "SW1A 1AA",
  password: "securepassword123",
  profile_description: "Experienced football manager with 10 years coaching",
  travel_distance: "50km",
  playing_style: "Attacking",
  team_id: "team123",
  account_type: "manager"
};
```

### Invalid Manager Data Examples
```javascript
// Invalid name (too short)
const invalidName = {
  ...validManager,
  name: "J" // Less than 2 characters
};

// Invalid email
const invalidEmail = {
  ...validManager,
  email: "not-an-email" // Invalid format
};

// Missing team
const missingTeam = {
  ...validManager,
  team_id: "A" // Less than 2 characters
};

// Invalid phone (non-digits)
const invalidPhone = {
  ...validManager,
  telephone: "123-456-7890" // Contains dashes
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial managers validation schema with team association |

---

## Future Enhancements

- [ ] Add team existence validation
- [ ] Implement manager certification validation
- [ ] Add experience level validation
- [ ] Support for multiple team associations
- [ ] Add manager availability validation
- [ ] Implement skill assessment validation
- [ ] Add reference/contact validation

---

## Related Files

- **Users Model:** Manager account data structure
- **Teams Model:** Team association and management
- **ManagerInvitations Model:** Manager invitation management

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
