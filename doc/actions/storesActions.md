# Stores Actions Documentation

## Actions Purpose

The `storesActions.js` file contains server actions for managing stores/products in the FUTY e-commerce system. It provides complete CRUD operations for store items including creation, updating, and deletion with image upload handling, product validation, and inventory management.

**Key Responsibility:** Handle all store/product-related server operations with file management and e-commerce data validation.

---

## Actions Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `actions/storesActions.js` |
| **Type** | Next.js Server Actions |
| **Framework** | Next.js with server-side execution |
| **Database** | MongoDB with Mongoose |
| **Validation** | Zod schema validation |
| **File Handling** | Image upload with UUID naming |
| **Operations** | Create, Update, Delete stores/products |
| **E-commerce** | Product catalog management |

---

## Key Features

- Product creation with image upload and validation
- Product updating with optional image replacement
- Product deletion with image cleanup
- Comprehensive product data validation
- UUID-based file naming for uniqueness
- E-commerce specific fields (price, discount, shipping, etc.)
- Toast message notifications
- Server-side redirects after operations

---

## Actions Structure

```javascript
"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StoresSchema } from "@/lib/validation/stores";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Stores from "@/lib/models/Stores";

// Utility functions and CRUD operations
```

---

## Create Store Action

### Function Signature

```javascript
export async function createStores(prevState, formData)
```

### Process Flow

#### 1. Form Data Processing

```javascript
const raw = Object.fromEntries(formData.entries());
const imageFile = formData.get("image");
const result = StoresSchema(false).safeParse({ ...raw, image: imageFile });
```

- Extracts form data and image file
- Validates using StoresSchema for creation

#### 2. Image Upload

```javascript
const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
const filePath = path.join(process.cwd(), "uploads/stores", uniqueName);
await fs.mkdir(path.dirname(filePath), { recursive: true });
const arrayBuffer = await imageFile.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
await fs.writeFile(filePath, buffer);
```

- Generates unique filename with UUID
- Creates uploads directory structure
- Saves image file to disk

#### 3. Database Creation

```javascript
await connectDB();
await Stores.create({
  ...result.data,
  image: `/uploads/stores/${uniqueName}`,
});
```

- Creates store document with validated data
- Stores relative image path

#### 4. Success Response

```javascript
cookieStore.set("toastMessage", "Store Added");
redirect("/admin/stores");
```

---

## Update Store Action

### Function Signature

```javascript
export async function updateStore(id, prevState, formData)
```

### Key Features

#### Conditional Image Update

```javascript
if (imageFile && imageFile.size > 0) {
  // Handle new image upload
  const imageName = `${Date.now()}_${imageFile.name}`;
  const imagePath = path.join(uploadsFolder, imageName);
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) console.error('Error writing file:', err);
  });

  // Delete old image
  if (store.image) {
    const oldImagePath = path.join(process.cwd(), store.image);
    await fs.unlink(oldImagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }

  // Update with new image
  const updateData = {
    title, content, category, price, discount, shipping_cost,
    size, color, material, product_code, other_product_info,
    image: `/uploads/stores/${imageName}`
  };
} else {
  // Update without image
  const updateData = {
    title, content, category, price, discount, shipping_cost,
    size, color, material, product_code, other_product_info
  };
}
```

---

## Delete Store Action

### Function Signature

```javascript
export async function deleteStore(id)
```

### Process Flow

#### 1. Database Lookup

```javascript
await connectDB();
const store = await Stores.findById(id);
if (!store) {
  throw new Error("Store not found");
}
```

#### 2. Image Cleanup

```javascript
if (store.image) {
  const imagePath = path.join(process.cwd(), store.image);
  await fs.unlink(imagePath).catch((err) => {
    console.warn(`Failed to delete image: ${err.message}`);
  });
}
```

#### 3. Database Deletion

```javascript
await Stores.findByIdAndDelete(id);
cookieStore.set("toastMessage", "Deleted");
redirect("/admin/stores");
```

---

## Product Data Fields

### Core Product Information

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Product name/title |
| `content` | String | Product description |
| `category` | String | Product category |
| `price` | Number | Base price |
| `discount` | Number | Discount amount/percentage |
| `shipping_cost` | Number | Shipping cost |
| `size` | String | Product size |
| `color` | String | Product color |
| `material` | String | Product material |
| `product_code` | String | Unique product code/SKU |
| `other_product_info` | String | Additional product information |
| `image` | String | Relative path to product image |

---

## Validation Schema

### StoresSchema Structure

```javascript
// Creation validation (isUpdate = false)
StoresSchema(false).safeParse({
  title: string,
  content: string,
  category: string,
  price: number,
  // ... other fields
  image: File // Required for creation
});

// Update validation (isUpdate = true)
StoresSchema(true).safeParse({
  // ... fields
  image: File // Optional for updates
});
```

---

## File Upload Configuration

### Upload Directory

- **Path:** `uploads/stores/`
- **Auto-creation:** Recursive directory creation
- **Naming:** UUID for creation, timestamp for updates

### Image Handling

- **Formats:** Determined by file extension
- **Validation:** Through Zod schema
- **Cleanup:** Automatic old image deletion

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `connectDB` | `@/lib/db` | Database connection |
| `cookies` | `next/headers` | Session management |
| `redirect` | `next/navigation` | Server redirects |
| `StoresSchema` | `@/lib/validation/stores` | Data validation |
| `uuidv4` | `uuid` | Unique naming |
| `path` | `path` | File paths |
| `fs` | `fs` | File operations |
| `Stores` | `@/lib/models/Stores` | Database model |

---

## Database Schema

### Store Document Structure

```javascript
{
  title: String,           // Product title
  content: String,         // Product description
  category: String,        // Product category
  price: Number,           // Base price
  discount: Number,        // Discount amount
  shipping_cost: Number,   // Shipping cost
  size: String,            // Product size
  color: String,           // Product color
  material: String,        // Product material
  product_code: String,    // SKU/Product code
  other_product_info: String, // Additional info
  image: String,           // Image path
  isActive: Boolean,       // Active status
  // Timestamps added by Mongoose
}
```

---

## Usage Examples

### Create Product Form

```jsx
'use client';
import { createStores } from '@/actions/storesActions';

export default function CreateProductForm() {
  const [state, formAction] = useActionState(createStores, null);

  return (
    <form action={formAction} encType="multipart/form-data">
      <input name="title" placeholder="Product Title" required />
      <textarea name="content" placeholder="Description" />
      <input name="price" type="number" step="0.01" />
      <input name="category" placeholder="Category" />
      <input name="image" type="file" accept="image/*" />
      <button type="submit">Create Product</button>
    </form>
  );
}
```

### Update Product Form

```jsx
export default function UpdateProductForm({ productId }) {
  const [state, formAction] = useActionState(
    updateStore.bind(null, productId),
    null
  );

  return (
    <form action={formAction} encType="multipart/form-data">
      {/* Product fields */}
      <input name="image" type="file" accept="image/*" />
      <button type="submit">Update Product</button>
    </form>
  );
}
```

---

## E-commerce Features

- **Pricing:** Base price with discount support
- **Shipping:** Configurable shipping costs
- **Inventory:** Size, color, material specifications
- **Categorization:** Product category management
- **SKUs:** Unique product codes
- **Rich Content:** Detailed product descriptions

---

## Security Considerations

- File upload validation through schema
- UUID prevents filename conflicts
- Server-side only operations
- User authentication required
- Image files isolated from web root

---

## Performance Notes

- Asynchronous file operations
- Database connection pooling
- Image cleanup after operations
- Unique file naming prevents conflicts

---

## Known Issues / Considerations

1. **File Size:** No explicit size limits implemented
2. **Image Optimization:** No resizing or compression
3. **Validation:** Limited to schema validation
4. **Error Handling:** Basic error logging
5. **Bulk Operations:** No bulk create/update support

---

## Future Enhancements

- [ ] Add image optimization and resizing
- [ ] Implement inventory quantity tracking
- [ ] Add product variants (size/color combinations)
- [ ] Support multiple product images
- [ ] Add SEO fields (meta title, description)
- [ ] Implement product reviews and ratings
- [ ] Add bulk import/export functionality
- [ ] Support for digital products
- [ ] Add product tags and collections
- [ ] Implement advanced pricing rules
- [ ] Add product analytics and reporting

---

## Testing Recommendations

- Test product creation with/without images
- Test price calculations with discounts
- Test image upload and replacement
- Verify product deletion and cleanup
- Test validation for all required fields
- Check file system error handling
- Test database constraint validation
- Verify toast messages and redirects
- Test with various image formats

---

## Support & Maintenance

- Monitor upload directory usage
- Implement backup strategies for product images
- Regular cleanup of orphaned files
- Update validation schemas for new requirements
- Monitor database performance
- Implement product data migration scripts
- Regular security audits of file operations
- Test with large product catalogs
