# Players Validation Documentation

## Validation Purpose

The `players.js` validation module provides Zod schema validation for player user account operations in the FUTY application. It ensures data integrity for player registration, profile management, and performance attributes with comprehensive validation for personal information, contact details, and player statistics.

**Key Responsibility:** Validate player user data structures for registration and profile management operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/players.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Player registration and profile update operations |

---

## Schema Definition

### PlayersSchema Function

```javascript
export const PlayersSchema = (isEdit = false) => z.object({
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

### Player Attributes

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `palyer_position` | `string` | Optional | No specific validation | - |
| `palyer_pace` | `string` | Optional | No specific validation | - |
| `palyer_skill` | `string` | Optional | No specific validation | - |
| `palyer_power` | `string` | Optional | No specific validation | - |
| `palyer_defence` | `string` | Optional | No specific validation | - |
| `palyer_teamwork` | `string` | Optional | No specific validation | - |
| `palyer_discipline` | `string` | Optional | No specific validation | - |
| `palyer_rating` | `string` | Optional | No specific validation | - |

### Profile Image

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `profile_image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

### Security

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `password` | `string` | Yes (create)<br>Optional (edit) | Minimum 7 characters | "Password must be at least 7 characters long" |

### Manager Association

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `palyer_manger_id` | `string` | Yes | Minimum 1 character | "Manager is required" |

---

## Usage Examples

### Example 1: Player Registration Validation
```javascript
import { PlayersSchema } from '@/lib/validation/players';

export async function registerPlayer(req, res) {
  try {
    const validatedData = PlayersSchema(false).parse({
      name: req.body.firstName,
      surname: req.body.lastName,
      nick_name: req.body.nickName,
      email: req.body.email,
      telephone: req.body.phone,
      post_code: req.body.postCode,
      password: req.body.password,
      profile_image: req.file,
      profile_description: req.body.description,
      palyer_manger_id: req.body.managerId,
      palyer_position: req.body.position,
      palyer_pace: req.body.pace,
      palyer_skill: req.body.skill,
      palyer_power: req.body.power,
      palyer_defence: req.body.defence,
      palyer_teamwork: req.body.teamwork,
      palyer_discipline: req.body.discipline,
      palyer_rating: req.body.rating,
      account_type: 'player'
    });

    // Create player account with validated data
    const player = await User.create({
      ...validatedData,
      role: 'player'
    });

    res.status(201).json(player);
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

### Example 2: Player Profile Update Validation
```javascript
export async function updatePlayerProfile(req, res) {
  try {
    const validatedData = PlayersSchema(true).parse({
      name: req.body.firstName,
      surname: req.body.lastName,
      nick_name: req.body.nickName,
      email: req.body.email,
      telephone: req.body.phone,
      post_code: req.body.postCode,
      profile_image: req.file,
      profile_description: req.body.description,
      palyer_manger_id: req.body.managerId,
      palyer_position: req.body.position,
      palyer_pace: req.body.pace,
      palyer_skill: req.body.skill,
      palyer_power: req.body.power,
      palyer_defence: req.body.defence,
      palyer_teamwork: req.body.teamwork,
      palyer_discipline: req.body.discipline,
      palyer_rating: req.body.rating,
      // password is optional in edit mode
      ...(req.body.password && { password: req.body.password })
    });

    const player = await User.findByIdAndUpdate(
      req.user.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
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

### Example 3: Player Account Setup
```javascript
export async function setupPlayerAccount(req, res) {
  try {
    const validationResult = PlayersSchema(false).safeParse({
      name: req.body.firstName,
      surname: req.body.lastName,
      nick_name: req.body.nickName,
      email: req.body.email,
      telephone: req.body.phone,
      post_code: req.body.postCode,
      password: req.body.password,
      profile_image: req.file,
      profile_description: req.body.description,
      palyer_manger_id: req.body.managerId,
      palyer_position: req.body.position,
      palyer_pace: req.body.pace,
      palyer_skill: req.body.skill,
      palyer_power: req.body.power,
      palyer_defence: req.body.defence,
      palyer_teamwork: req.body.teamwork,
      palyer_discipline: req.body.discipline,
      palyer_rating: req.body.rating,
      account_type: req.body.accountType || 'player'
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process player account setup...
    res.json({ success: true, message: 'Player account created successfully' });
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
      minimum: 1,
      type: 'string',
      inclusive: true,
      exact: false,
      message: 'Manager is required',
      path: ['palyer_manger_id']
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
| **Required Manager** | `too_small` | "Manager is required" |

---

## Business Rules

### 1. **Player Identity**
- **Rule:** Players must provide complete personal information
- **Required Fields:** First name, email, phone, password, manager association
- **Purpose:** Ensure proper player identification and team management

### 2. **Manager Association**
- **Rule:** Players must be associated with a manager
- **Required Field:** palyer_manger_id with minimum 1 character
- **Purpose:** Establish player-manager relationship for team organization

### 3. **Player Attributes**
- **Rule:** Players can have detailed performance attributes
- **Optional Fields:** Position, pace, skill, power, defence, teamwork, discipline, rating
- **Purpose:** Enhanced player profiles for team selection and performance tracking

### 4. **Contact Information**
- **Rule:** Players must provide valid contact details
- **Required Fields:** Email and telephone
- **Purpose:** Enable communication for team coordination and match arrangements

### 5. **Profile Enhancement**
- **Rule:** Players can provide detailed profile information
- **Optional Fields:** Nickname, description, post code
- **Purpose:** Enhanced player profiles for better team matching

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
| **Manager Validation** | String length validation | Add manager existence validation |

---

## Testing Examples

### Valid Player Data
```javascript
const validPlayer = {
  name: "John",
  surname: "Doe",
  nick_name: "Johnny",
  email: "john.doe@example.com",
  telephone: "1234567890",
  post_code: "SW1A 1AA",
  password: "securepassword123",
  profile_description: "Skilled midfielder with excellent passing range",
  palyer_manger_id: "manager123",
  palyer_position: "Midfielder",
  palyer_pace: "8",
  palyer_skill: "9",
  palyer_power: "7",
  palyer_defence: "6",
  palyer_teamwork: "9",
  palyer_discipline: "8",
  palyer_rating: "8.5",
  account_type: "player"
};
```

### Invalid Player Data Examples
```javascript
// Invalid name (too short)
const invalidName = {
  ...validPlayer,
  name: "J" // Less than 2 characters
};

// Invalid email
const invalidEmail = {
  ...validPlayer,
  email: "not-an-email" // Invalid format
};

// Missing manager
const missingManager = {
  ...validPlayer,
  palyer_manger_id: "" // Empty string
};

// Invalid phone (non-digits)
const invalidPhone = {
  ...validPlayer,
  telephone: "123-456-7890" // Contains dashes
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial players validation schema with performance attributes |

---

## Future Enhancements

- [ ] Add manager existence validation
- [ ] Implement attribute range validation (1-10 scale)
- [ ] Add position validation against predefined positions
- [ ] Support for multiple player images
- [ ] Add player availability validation
- [ ] Implement skill assessment validation
- [ ] Add player contract validation

---

## Related Files

- **Users Model:** Player account data structure
- **PlayerInvitations Model:** Player invitation management
- **Teams Model:** Team association through managers

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
