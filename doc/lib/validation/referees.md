# Referees Validation Documentation

## Validation Purpose

The `referees.js` validation module provides Zod schema validation for referee user account operations in the FUTY application. It ensures data integrity for referee registration, profile management, and officiating credentials with comprehensive validation for personal information, contact details, and referee qualifications.

**Key Responsibility:** Validate referee user data structures for registration and profile management operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/referees.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Referee registration and profile update operations |

---

## Schema Definition

### RefereesSchema Function

```javascript
export const RefereesSchema = (isEdit = false) => z.object({
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

### Referee Qualifications

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `referee_lavel` | `string` | Optional | No specific validation | - |
| `referee_fee` | `string` | Optional | No specific validation | - |

### Profile Image

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `profile_image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

### Security

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `password` | `string` | Yes (create)<br>Optional (edit) | Minimum 7 characters | "Password must be at least 7 characters long" |

---

## Usage Examples

### Example 1: Referee Registration Validation
```javascript
import { RefereesSchema } from '@/lib/validation/referees';

export async function registerReferee(req, res) {
  try {
    const validatedData = RefereesSchema(false).parse({
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
      referee_lavel: req.body.refereeLevel,
      referee_fee: req.body.refereeFee,
      account_type: 'referee'
    });

    // Create referee account with validated data
    const referee = await User.create({
      ...validatedData,
      role: 'referee'
    });

    res.status(201).json(referee);
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

### Example 2: Referee Profile Update Validation
```javascript
export async function updateRefereeProfile(req, res) {
  try {
    const validatedData = RefereesSchema(true).parse({
      name: req.body.firstName,
      surname: req.body.lastName,
      nick_name: req.body.nickName,
      email: req.body.email,
      telephone: req.body.phone,
      post_code: req.body.postCode,
      profile_image: req.file,
      profile_description: req.body.description,
      travel_distance: req.body.travelDistance,
      referee_lavel: req.body.refereeLevel,
      referee_fee: req.body.refereeFee,
      // password is optional in edit mode
      ...(req.body.password && { password: req.body.password })
    });

    const referee = await User.findByIdAndUpdate(
      req.user.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!referee) {
      return res.status(404).json({ error: 'Referee not found' });
    }

    res.json(referee);
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

### Example 3: Referee Account Setup
```javascript
export async function setupRefereeAccount(req, res) {
  try {
    const validationResult = RefereesSchema(false).safeParse({
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
      referee_lavel: req.body.refereeLevel,
      referee_fee: req.body.refereeFee,
      account_type: req.body.accountType || 'referee'
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process referee account setup...
    res.json({ success: true, message: 'Referee account created successfully' });
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

---

## Business Rules

### 1. **Referee Identity**
- **Rule:** Referees must provide complete personal information
- **Required Fields:** First name, email, phone, password
- **Purpose:** Ensure proper referee identification and officiating credentials

### 2. **Referee Qualifications**
- **Rule:** Referees can specify their officiating level and fees
- **Optional Fields:** Referee level and fee
- **Purpose:** Match appropriate referees to competitions and budgets

### 3. **Contact Information**
- **Rule:** Referees must provide valid contact details
- **Required Fields:** Email and telephone
- **Purpose:** Enable communication for match assignments and coordination

### 4. **Profile Enhancement**
- **Rule:** Referees can provide detailed profile information
- **Optional Fields:** Nickname, description, travel distance, post code
- **Purpose:** Enhanced referee profiles for better match assignments

### 5. **Profile Image**
- **Rule:** Profile images must be valid formats under 3MB
- **Formats:** JPEG, PNG, GIF, WebP
- **Flexibility:** Existing images don't require re-upload

### 6. **Password Security**
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
| **Phone Validation** | Regex pattern matching | Consider phone number formatting |

---

## Testing Examples

### Valid Referee Data
```javascript
const validReferee = {
  name: "John",
  surname: "Smith",
  nick_name: "Johnny",
  email: "john.smith@example.com",
  telephone: "1234567890",
  post_code: "SW1A 1AA",
  password: "securepassword123",
  profile_description: "Experienced referee with 10 years officiating experience",
  travel_distance: "50km",
  referee_lavel: "Level 2",
  referee_fee: "£50 per match",
  account_type: "referee"
};
```

### Invalid Referee Data Examples
```javascript
// Invalid name (too short)
const invalidName = {
  ...validReferee,
  name: "J" // Less than 2 characters
};

// Invalid email
const invalidEmail = {
  ...validReferee,
  email: "not-an-email" // Invalid format
};

// Invalid phone (non-digits)
const invalidPhone = {
  ...validReferee,
  telephone: "123-456-7890" // Contains dashes
};

// Invalid file size
const invalidFile = {
  ...validReferee,
  profile_image: new File([''], 'large.jpg', { size: 5 * 1024 * 1024 }) // 5MB file
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial referees validation schema with officiating credentials |

---

## Future Enhancements

- [ ] Add referee certification validation
- [ ] Implement referee level validation against predefined levels
- [ ] Add fee format validation (currency, ranges)
- [ ] Support for referee availability schedules
- [ ] Add referee experience validation
- [ ] Implement referee rating system validation
- [ ] Add referee assignment history validation

---

## Related Files

- **Users Model:** Referee account data structure
- **Tournaments Model:** Match officiating assignments
- **Friendlies Model:** Friendly match referee assignments

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
