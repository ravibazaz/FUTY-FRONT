# GroundFacilities Validation Documentation

## Validation Purpose

The `groundfacilities.js` validation module provides Zod schema validation for ground facility-related operations in the FUTY application. It ensures data integrity for facility information used in venue management and booking systems.

**Key Responsibility:** Validate ground facility data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/groundfacilities.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Ground facility creation and update operations |

---

## Schema Definition

### GroundFacilitiesSchema Function

```javascript
export const GroundFacilitiesSchema = (isEdit = false) => z.object({
  facilities: z.string().min(1, "Facilities title is required"),
  description: z.string().optional(),
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Facility Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `facilities` | `string` | Yes | Minimum 1 character | "Facilities title is required" |
| `description` | `string` | Optional | No specific validation | - |

---

## Usage Examples

### Example 1: Ground Facility Creation Validation
```javascript
import { GroundFacilitiesSchema } from '@/lib/validation/groundfacilities';

export async function createGroundFacility(req, res) {
  try {
    const validatedData = GroundFacilitiesSchema(false).parse(req.body);

    // Create ground facility with validated data
    const facility = await GroundFacility.create(validatedData);

    res.status(201).json(facility);
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

### Example 2: Ground Facility Update Validation
```javascript
export async function updateGroundFacility(req, res) {
  try {
    const validatedData = GroundFacilitiesSchema(true).parse(req.body);

    const facility = await GroundFacility.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!facility) {
      return res.status(404).json({ error: 'Ground facility not found' });
    }

    res.json(facility);
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

### Example 3: Facility Setup
```javascript
export async function setupGroundFacility(req, res) {
  try {
    const validationResult = GroundFacilitiesSchema(false).safeParse({
      facilities: req.body.name,
      description: req.body.description
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process facility setup...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Facility setup failed' });
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
      message: 'Facilities title is required',
      path: ['facilities']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Field** | `too_small` | "Facilities title is required" |

---

## Business Rules

### 1. **Facility Identity**
- **Rule:** Ground facilities must have a descriptive title
- **Minimum Length:** At least 1 character
- **Purpose:** Clear facility identification for venue management

### 2. **Optional Description**
- **Rule:** Facility descriptions are optional
- **Purpose:** Provide additional details about facility features
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

### Valid Ground Facility Data
```javascript
const validFacility = {
  facilities: "Changing Rooms",
  description: "Modern changing facilities with showers and lockers"
};
```

### Invalid Ground Facility Data Examples
```javascript
// Invalid facilities (empty)
const invalidFacility = {
  facilities: "", // Empty string
  description: "Modern changing facilities with showers and lockers"
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial ground facilities validation schema |

---

## Future Enhancements

- [ ] Add facility category validation
- [ ] Implement facility capacity validation
- [ ] Add facility availability validation
- [ ] Support for facility pricing validation
- [ ] Add facility maintenance schedule validation
- [ ] Implement facility booking rules validation

---

## Related Files

- **GroundFacilities Model:** Ground facility data structure definition
- **Grounds Model:** Ground venue information

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
