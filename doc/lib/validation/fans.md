# Fans Validation Documentation

## Validation Purpose

The `fans.js` validation module provides Zod schema validation for fan user account operations in the FUTY application. It ensures data integrity for fan registration, profile updates, and account management with comprehensive validation for personal information, contact details, and security requirements.

**Key Responsibility:** Validate fan user data structures for registration and profile management operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/fans.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Fan registration and profile update operations |

---

## Schema Definition

### FansSchema Function

```javascript
export const FansSchema = (isEdit = false) => z.object({
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
| `account_type` | `string` | Optional | No specific validation | - |

### Contact Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `email` | `string` | Yes | - Required<br>- Valid email format<br>- Trimmed | - "Email is required"<br>- "Invalid email format" |
| `telephone` | `string` | Yes | - 10-11 digits<br>- Digits only (0-9)<br>- Trimmed | - "Telephone must be at least 10 digits."<br>- "Telephone must be at most 11 digits."<br>- "Digits only (0–9)" |

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

### Example 1: Fan Registration Validation
```javascript
import { FansSchema } from '@/lib/validation/fans';

export async function registerFan(req, res) {
  try {
    const validatedData = FansSchema(false).parse({
      name: req.body.firstName,
      surname: req.body.lastName,
      email: req.body.email,
      telephone: req.body.phone,
      password: req.body.password,
      profile_image: req.file,
      account_type: 'fan'
    });

    // Create fan account with validated data
    const fan = await User.create({
      ...validatedData,
      role: 'fan'
    });

    res.status(201).json(fan);
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

### Example 2: Fan Profile Update Validation
```javascript
export async function updateFanProfile(req, res) {
  try {
    const validatedData = FansSchema(true).parse({
      name: req.body.firstName,
      surname: req.body.lastName,
      email: req.body.email,
      telephone: req.body.phone,
      profile_image: req.file,
      // password is optional in edit mode
      ...(req.body.password && { password: req.body.password })
    });

    const fan = await User.findByIdAndUpdate(
      req.user.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!fan) {
      return res.status(404).json({ error: 'Fan not found' });
    }

    res.json(fan);
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

### Example 3: Fan Account Setup
```javascript
export async function setupFanAccount(req, res) {
  try {
    const validationResult = FansSchema(false).safeParse({
      name: req.body.firstName,
      surname: req.body.lastName,
      email: req.body.email,
      telephone: req.body.phone,
      password: req.body.password,
      profile_image: req.file,
      account_type: req.body.accountType || 'fan'
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process fan account setup...
    res.json({ success: true, message: 'Fan account created successfully' });
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
      code: 'custom',
      message: 'File size is too large. Max limit is 3MB.',
      path: ['profile_image']
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

### 1. **Fan Identity**
- **Rule:** Fans must provide complete personal information
- **Required Fields:** First name, email, phone, password
- **Purpose:** Ensure proper user identification and contact

### 2. **Email Validation**
- **Rule:** Email addresses must be valid and required
- **Format:** Standard email regex validation
- **Purpose:** Enable communication and account recovery

### 3. **Phone Number Standards**
- **Rule:** Phone numbers must be 10-11 digits only
- **Format:** Numeric characters only
- **Purpose:** Ensure valid contact numbers for SMS/communication

### 4. **Profile Image Constraints**
- **Rule:** Profile images must be valid image formats under 3MB
- **Formats:** JPEG, PNG, GIF, WebP
- **Flexibility:** Existing images don't require re-upload

### 5. **Password Security**
- **Rule:** Passwords must be at least 7 characters
- **Edit Mode:** Password optional for profile updates
- **Purpose:** Basic password security requirements

### 6. **Account Type Classification**
- **Rule:** Account type helps categorize user roles
- **Optional:** Can be set during registration or later
- **Purpose:** User role management and permissions

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

### Valid Fan Data
```javascript
const validFan = {
  name: "John",
  surname: "Doe",
  email: "john.doe@example.com",
  telephone: "1234567890",
  password: "securepassword123",
  account_type: "fan"
};
```

### Invalid Fan Data Examples
```javascript
// Invalid name (too short)
const invalidName = {
  ...validFan,
  name: "J" // Less than 2 characters
};

// Invalid email
const invalidEmail = {
  ...validFan,
  email: "not-an-email" // Invalid format
};

// Invalid phone (non-digits)
const invalidPhone = {
  ...validFan,
  telephone: "123-456-7890" // Contains dashes
};

// Invalid file size
const invalidFile = {
  ...validFan,
  profile_image: new File([''], 'large.jpg', { size: 5 * 1024 * 1024 }) // 5MB file
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial fans validation schema with comprehensive user validation |

---

## Future Enhancements

- [ ] Add email uniqueness validation
- [ ] Implement phone number formatting
- [ ] Add password strength requirements
- [ ] Support for multiple profile images
- [ ] Add social media profile validation
- [ ] Implement address validation
- [ ] Add date of birth validation
- [ ] Support for emergency contact information

---

## Related Files

- **Users Model:** Fan account data structure
- **FanInvitations Model:** Fan invitation management

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
