# Categories Validation Documentation

## Validation Purpose

The `categories.js` validation module provides Zod schema validation for category-related operations in the FUTY application. It ensures data integrity for product categories, including name validation, image upload constraints, and hierarchical relationships.

**Key Responsibility:** Validate category data structures for API endpoints and database operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/categories.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Category creation and update operations |

---

## Schema Definition

### CategoriesSchema Function

```javascript
export const CategoriesSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Core Category Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `title` | `string` | Yes | Minimum 1 character | "Category title is required" |

### Content & Media

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `content` | `string` | Optional | No specific validation | - |

### Image Upload

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

### Hierarchical Relationships

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `parent_cat_id` | `string` | Optional | No specific validation | - |

---

## Usage Examples

### Example 1: Category Creation Validation
```javascript
import { CategoriesSchema } from '@/lib/validation/categories';

export async function createCategory(req, res) {
  try {
    const validatedData = CategoriesSchema(false).parse(req.body);
    
    // Create category with validated data
    const category = await Category.create(validatedData);
    
    res.status(201).json(category);
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

### Example 2: Category Update Validation
```javascript
export async function updateCategory(req, res) {
  try {
    const validatedData = CategoriesSchema(true).parse(req.body);
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
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

### Example 3: Category Hierarchy Setup
```javascript
export async function setupCategoryHierarchy(req, res) {
  try {
    const validationResult = CategoriesSchema(false).safeParse({
      title: req.body.name,
      content: req.body.description,
      image: req.file,
      parent_cat_id: req.body.parentId
    });
    
    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }
    
    // Process category hierarchy...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Category setup failed' });
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
      message: 'Category title is required',
      path: ['title']
    },
    {
      code: 'custom',
      message: 'Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed.',
      path: ['image']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Field** | `too_small` | "Category title is required" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **Category Identity**
- **Rule:** Categories must have a title/name
- **Minimum Length:** At least 1 character
- **Purpose:** Clear category identification

### 2. **Hierarchical Flexibility**
- **Rule:** Parent category is optional for flexible hierarchy
- **Self-Reference:** Parent can reference another category
- **Root Categories:** No parent creates top-level categories

### 3. **Content Description**
- **Rule:** Category descriptions are optional
- **Purpose:** Provide additional category information
- **Flexibility:** Can be added post-creation

### 4. **Image Upload Constraints**
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

### Valid Category Data
```javascript
const validCategory = {
  title: "Football Boots",
  content: "Professional and amateur football boots for all skill levels",
  parent_cat_id: "footwear-category-id"
};
```

### Invalid Category Data Examples
```javascript
// Invalid title (empty)
const invalidTitle = {
  ...validCategory,
  title: "" // Empty string
};

// Invalid file type
const invalidFile = {
  ...validCategory,
  image: new File([''], 'test.txt', { type: 'text/plain' })
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial categories validation schema with hierarchy support |

---

## Future Enhancements

- [ ] Add category title uniqueness validation
- [ ] Implement parent category existence validation
- [ ] Add category depth limits (prevent infinite hierarchies)
- [ ] Support for category icons
- [ ] Add category color/theme validation
- [ ] Implement category SEO field validation
- [ ] Add category sorting order validation

---

## Related Files

- `@/lib/models/Categories.js` - Category model definition
- `@/lib/validation/stores.js` - Product validation schema

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
