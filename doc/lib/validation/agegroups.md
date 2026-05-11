# AgeGroups Validation Documentation

## Validation Purpose

The `agegroups.js` validation module provides Zod schema validation for age group-related operations in the FUTY application. It ensures data integrity for age group categories used in player classification and team organization.

**Key Responsibility:** Validate age group data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/agegroups.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Age group creation and update operations |

---

## Schema Definition

### AgeGroupSchema Function

```javascript
export const AgeGroupSchema = (isEdit = false) => z.object({
  age_group: z.string().min(1, "Age Group title is required"),
  description: z.string().optional(),
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Age Group Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `age_group` | `string` | Yes | Minimum 1 character | "Age Group title is required" |
| `description` | `string` | Optional | No specific validation | - |

---

## Usage Examples

### Example 1: Age Group Creation Validation
```javascript
import { AgeGroupSchema } from '@/lib/validation/agegroups';

export async function createAgeGroup(req, res) {
  try {
    const validatedData = AgeGroupSchema(false).parse(req.body);

    // Create age group with validated data
    const ageGroup = await AgeGroup.create(validatedData);

    res.status(201).json(ageGroup);
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

### Example 2: Age Group Update Validation
```javascript
export async function updateAgeGroup(req, res) {
  try {
    const validatedData = AgeGroupSchema(true).parse(req.body);

    const ageGroup = await AgeGroup.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!ageGroup) {
      return res.status(404).json({ error: 'Age group not found' });
    }

    res.json(ageGroup);
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

### Example 3: Age Group Setup
```javascript
export async function setupAgeGroup(req, res) {
  try {
    const validationResult = AgeGroupSchema(false).safeParse({
      age_group: req.body.name,
      description: req.body.description
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process age group setup...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Age group setup failed' });
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
      message: 'Age Group title is required',
      path: ['age_group']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Field** | `too_small` | "Age Group title is required" |

---

## Business Rules

### 1. **Age Group Identity**
- **Rule:** Age groups must have a descriptive title
- **Minimum Length:** At least 1 character
- **Purpose:** Clear age group identification for player categorization

### 2. **Optional Description**
- **Rule:** Age group descriptions are optional
- **Purpose:** Provide additional context about age group criteria
- **Flexibility:** Can be added post-creation

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Validation Speed** | Synchronous validation | Fast validation for simple schema |
| **Error Messages** | Clear custom messages | Maintain user-friendly error messages |
| **Schema Complexity** | Minimal fields | Efficient for high-volume operations |

---

## Testing Examples

### Valid Age Group Data
```javascript
const validAgeGroup = {
  age_group: "Under 18",
  description: "Players aged 16-17 years old"
};
```

### Invalid Age Group Data Examples
```javascript
// Invalid age group (empty)
const invalidAgeGroup = {
  age_group: "", // Empty string
  description: "Players aged 16-17 years old"
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial age groups validation schema |

---

## Future Enhancements

- [ ] Add age range validation (min/max age)
- [ ] Implement age group uniqueness validation
- [ ] Add age group category validation
- [ ] Support for age group hierarchies
- [ ] Add age calculation validation
- [ ] Implement age group transition rules

---

## Related Files

- **Age Groups Model:** Age group data structure definition
- **Players Validation:** Player age group assignment validation

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
