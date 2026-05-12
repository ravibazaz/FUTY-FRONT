# Categories Actions Documentation

## Actions Purpose

The `categoriesActions.js` file contains server actions for managing product categories in the FUTY e-commerce system. It handles hierarchical category structures with parent-child relationships, supporting both main categories and subcategories with image upload and validation.

**Key Responsibility:** Manage category hierarchy with CRUD operations, image handling, and parent-child relationships.

---

## Actions Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `actions/categoriesActions.js` |
| **Type** | Next.js Server Actions |
| **Framework** | Next.js with server-side execution |
| **Database** | MongoDB with Mongoose |
| **Validation** | Zod schema validation |
| **File Handling** | Image upload with UUID naming |
| **Operations** | Create, Update, Delete categories |
| **Hierarchy** | Parent-child category relationships |

---

## Key Features

- Hierarchical category management (main/sub categories)
- Category creation with image upload
- Category updating with optional image replacement
- Category deletion with image cleanup
- Parent category relationship handling
- Category type differentiation (Main/Sub)
- Automatic parent_id nullification for main categories
- Toast notifications and redirects

---

## Category Types

### Main Categories

- **Type:** `'Main'`
- **parent_cat_id:** `null`
- **Purpose:** Top-level categories
- **Hierarchy:** Root level

### Sub Categories

- **Type:** `'Sub'` (inferred)
- **parent_cat_id:** Reference to parent category ID
- **Purpose:** Child categories under main categories
- **Hierarchy:** Nested under main categories

---

## Create Category Action

### Function Signature

```javascript
export async function createCategory(prevState, formData)
```

### Process Flow

#### 1. Form Data Processing

```javascript
const raw = Object.fromEntries(formData.entries());
const imageFile = formData.get("image");
const type = formData.get("type");
const result = CategoriesSchema(false).safeParse({ ...raw, image: imageFile });
```

- Extracts form data, image, and category type
- Validates using CategoriesSchema

#### 2. Parent Category Logic

```javascript
await Categories.create({
  ...result.data,
  parent_cat_id: result.parent_cat_id ? parent_cat_id : null,
  image: `/uploads/categories/${uniqueName}`,
});
```

- Sets parent_cat_id based on category type
- Main categories have null parent_cat_id

#### 3. Image Upload and Database Creation

- Generates unique filename with UUID
- Saves image to `uploads/categories/`
- Creates category document with validated data

---

## Update Category Action

### Function Signature

```javascript
export async function updateCategory(id, prevState, formData)
```

### Hierarchical Update Logic

```javascript
const updateData = {
  title,
  content,
  parent_cat_id: type == 'Main' ? null : parent_cat_id,
  image: `/uploads/categories/${imageName}`,
};
```

- **Main Category:** Forces `parent_cat_id = null`
- **Sub Category:** Preserves or sets parent relationship
- Prevents invalid hierarchical relationships

---

## Delete Category Action

### Function Signature

```javascript
export async function deleteCategory(id)
```

### Deletion Considerations

- **Cascade Delete:** May need to handle subcategories
- **Image Cleanup:** Removes associated category images
- **Relationship Integrity:** Consider impact on products using this category

---

## Category Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Category name |
| `content` | String | Category description |
| `parent_cat_id` | ObjectId/null | Parent category reference |
| `type` | String | Category type ('Main'/'Sub') |
| `image` | String | Relative path to category image |
| `isActive` | Boolean | Category active status |

---

## Validation Schema

### CategoriesSchema Structure

```javascript
// Creation validation
CategoriesSchema(false).safeParse({
  title: string().min(1),
  content: string(),
  parent_cat_id: string().optional(),
  type: string(), // 'Main' or 'Sub'
  image: File // Required for creation
});

// Update validation
CategoriesSchema(true).safeParse({
  // ... fields
  image: File // Optional for updates
});
```

---

## File Upload Configuration

### Upload Directory

- **Path:** `uploads/categories/`
- **Naming:** UUID for creation, timestamp for updates
- **Cleanup:** Automatic old image deletion

---

## Database Schema

### Category Document Structure

```javascript
{
  title: String,           // Category title
  content: String,         // Category description
  parent_cat_id: ObjectId, // Reference to parent category (null for main)
  type: String,            // 'Main' or 'Sub'
  image: String,           // Image path
  isActive: Boolean,       // Active status
  // Timestamps added by Mongoose
}
```

---

## Hierarchical Relationships

### Parent-Child Structure

```javascript
// Main Category
{
  _id: ObjectId("..."),
  title: "Electronics",
  parent_cat_id: null,
  type: "Main"
}

// Sub Category
{
  _id: ObjectId("..."),
  title: "Smartphones",
  parent_cat_id: ObjectId("..."), // References Electronics
  type: "Sub"
}
```

---

## Usage Examples

### Create Category Form

```jsx
'use client';
import { createCategory } from '@/actions/categoriesActions';

export default function CreateCategoryForm() {
  const [state, formAction] = useActionState(createCategory, null);

  return (
    <form action={formAction} encType="multipart/form-data">
      <input name="title" placeholder="Category Title" required />
      <select name="type">
        <option value="Main">Main Category</option>
        <option value="Sub">Sub Category</option>
      </select>
      <select name="parent_cat_id">
        {/* Main categories for parent selection */}
      </select>
      <input name="image" type="file" accept="image/*" />
      <button type="submit">Create Category</button>
    </form>
  );
}
```

### Hierarchical Category Display

```jsx
export default function CategoryTree({ categories }) {
  const mainCategories = categories.filter(cat => !cat.parent_cat_id);
  const subCategories = categories.filter(cat => cat.parent_cat_id);

  return (
    <div>
      {mainCategories.map(main => (
        <div key={main._id}>
          <h3>{main.title}</h3>
          <ul>
            {subCategories
              .filter(sub => sub.parent_cat_id === main._id)
              .map(sub => (
                <li key={sub._id}>{sub.title}</li>
              ))
            }
          </ul>
        </div>
      ))}
    </div>
  );
}
```

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `connectDB` | `@/lib/db` | Database connection |
| `cookies` | `next/headers` | Session management |
| `redirect` | `next/navigation` | Server redirects |
| `CategoriesSchema` | `@/lib/validation/categories` | Data validation |
| `uuidv4` | `uuid` | Unique naming |
| `path` | `path` | File paths |
| `fs` | `fs` | File operations |
| `Categories` | `@/lib/models/Categories` | Database model |

---

## Security Considerations

- Hierarchical relationship validation
- File upload security through schema
- Parent-child relationship integrity
- Server-side type enforcement

---

## Performance Notes

- Hierarchical queries may need optimization
- Image cleanup operations
- Category tree building for UI
- Database indexing on parent_cat_id

---

## Known Issues / Considerations

1. **Cascade Delete:** Subcategories not automatically deleted
2. **Orphaned Subs:** Subcategories can exist without valid parents
3. **Type Validation:** Type field not strongly validated
4. **Circular References:** No protection against circular parent relationships

---

## Future Enhancements

- [ ] Implement cascade delete for subcategories
- [ ] Add category tree validation
- [ ] Support unlimited nesting levels
- [ ] Add category sorting and ordering
- [ ] Implement category SEO fields
- [ ] Add category icons/symbols
- [ ] Support category templates
- [ ] Add category analytics
- [ ] Implement bulk category operations
- [ ] Add category import/export

---

## Testing Recommendations

- Test main category creation
- Test subcategory creation with parent selection
- Test hierarchical updates and type changes
- Verify parent-child relationship integrity
- Test image upload and replacement
- Test category deletion scenarios
- Verify validation for different category types
- Test with deep category hierarchies

---

## Support & Maintenance

- Monitor category hierarchy depth
- Implement category tree rebuilding
- Regular cleanup of orphaned subcategories
- Update validation for new category types
- Monitor database query performance
- Implement category backup strategies
- Regular audit of category relationships
