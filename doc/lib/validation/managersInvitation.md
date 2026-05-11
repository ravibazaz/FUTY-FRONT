# ManagersInvitation Validation Documentation

## Validation Purpose

The `managersInvitation.js` validation module provides Zod schema validation for manager invitation operations in the FUTY application. It ensures data integrity for manager recruitment and team association invitations.

**Key Responsibility:** Validate manager invitation data structures for invitation creation and management operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/managersInvitation.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Manager invitation creation and update operations |

---

## Schema Definition

### ManagersSchema Function

```javascript
export const ManagersSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Manager Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `manager_name` | `string` | Yes | Minimum 2 characters | "First Name is required" |
| `manager_nick_name` | `string` | Optional | No specific validation | - |
| `manager_address` | `string` | Optional | No specific validation | - |

### Contact Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `manager_email` | `string` | Yes | - Required<br>- Valid email format<br>- Trimmed | - "Email is required"<br>- "Invalid email format" |
| `manager_phone` | `string` | Yes | - 10-11 digits<br>- Digits only (0-9)<br>- Trimmed | - "Telephone must be at least 10 digits."<br>- "Telephone must be at most 11 digits."<br>- "Digits only (0–9)" |

### Association Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `user_id` | `string` | Optional | No specific validation | - |
| `team_id` | `string` | Yes | Minimum 2 characters | "Team is required" |

---

## Usage Examples

### Example 1: Manager Invitation Creation Validation
```javascript
import { ManagersSchema } from '@/lib/validation/managersInvitation';

export async function createManagerInvitation(req, res) {
  try {
    const validatedData = ManagersSchema(false).parse(req.body);

    // Create manager invitation with validated data
    const invitation = await ManagerInvitation.create(validatedData);

    res.status(201).json(invitation);
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

### Example 2: Manager Invitation Update Validation
```javascript
export async function updateManagerInvitation(req, res) {
  try {
    const validatedData = ManagersSchema(true).parse(req.body);

    const invitation = await ManagerInvitation.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!invitation) {
      return res.status(404).json({ error: 'Manager invitation not found' });
    }

    res.json(invitation);
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

### Example 3: Manager Invitation Setup
```javascript
export async function setupManagerInvitation(req, res) {
  try {
    const validationResult = ManagersSchema(false).safeParse({
      manager_name: req.body.firstName,
      manager_email: req.body.email,
      manager_phone: req.body.phone,
      manager_nick_name: req.body.nickName,
      manager_address: req.body.address,
      user_id: req.body.userId,
      team_id: req.body.teamId
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process manager invitation setup...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Invitation setup failed' });
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
      path: ['manager_name']
    },
    {
      code: 'custom',
      message: 'Invalid email format',
      path: ['manager_email']
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
| **Phone Length Min** | `too_small` | "Telephone must be at least 10 digits." |
| **Phone Length Max** | `too_big` | "Telephone must be at most 11 digits." |
| **Phone Format** | `invalid_string` | "Digits only (0–9)" |
| **Required Team** | `too_small` | "Team is required" |

---

## Business Rules

### 1. **Manager Invitation Identity**
- **Rule:** Manager invitations must include complete contact information
- **Required Fields:** Name, email, phone, team association
- **Purpose:** Ensure proper manager identification for team recruitment

### 2. **Team Association**
- **Rule:** Invitations must be linked to a specific team
- **Required Field:** team_id with minimum 2 characters
- **Purpose:** Establish team-manager relationship through invitation

### 3. **Contact Validation**
- **Rule:** Manager contact information must be valid
- **Email:** Standard email format validation
- **Phone:** 10-11 digit numeric validation
- **Purpose:** Enable communication for invitation process

### 4. **Optional Profile Information**
- **Rule:** Additional profile details are optional
- **Fields:** Nickname and address
- **Purpose:** Enhanced manager profiles for better team matching

### 5. **User Association**
- **Rule:** Invitations can be linked to existing users
- **Optional:** user_id for existing platform users
- **Purpose:** Handle both new and existing user invitations

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Email Validation** | Regex-based validation | Consider additional email verification |
| **Phone Validation** | Regex pattern matching | Consider phone number formatting |
| **Team Validation** | String length validation | Add team existence validation |
| **User Validation** | Optional field validation | Add user existence validation when provided |

---

## Testing Examples

### Valid Manager Invitation Data
```javascript
const validInvitation = {
  manager_name: "John Smith",
  manager_email: "john.smith@example.com",
  manager_phone: "1234567890",
  manager_nick_name: "Johnny",
  manager_address: "123 Football Street",
  user_id: "user123",
  team_id: "team456"
};
```

### Invalid Manager Invitation Data Examples
```javascript
// Invalid name (too short)
const invalidName = {
  ...validInvitation,
  manager_name: "J" // Less than 2 characters
};

// Invalid email
const invalidEmail = {
  ...validInvitation,
  manager_email: "not-an-email" // Invalid format
};

// Missing team
const missingTeam = {
  ...validInvitation,
  team_id: "A" // Less than 2 characters
};

// Invalid phone (non-digits)
const invalidPhone = {
  ...validInvitation,
  manager_phone: "123-456-7890" // Contains dashes
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial managers invitation validation schema |

---

## Future Enhancements

- [ ] Add team existence validation
- [ ] Implement user existence validation
- [ ] Add invitation expiration validation
- [ ] Support for bulk invitations
- [ ] Add invitation priority levels
- [ ] Implement invitation templates
- [ ] Add manager qualification validation

---

## Related Files

- **ManagerInvitations Model:** Manager invitation data structure
- **Teams Model:** Team association validation
- **Users Model:** User association validation

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
