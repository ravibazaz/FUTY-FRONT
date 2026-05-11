# Stores Validation Documentation

## Validation Purpose

The `stores.js` validation module provides Zod schema validation for product/store operations in the FUTY application. It ensures data integrity for product listings, pricing, categorization, and product information with comprehensive validation for commercial product data.

**Key Responsibility:** Validate product data structures for store listings and product management operations.

---

## Validation Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/validation/stores.js` |
| **Library** | Zod |
| **Schema Type** | Dynamic schema with edit mode support |
| **Validation Scope** | Product creation and update operations |

---

## Schema Definition

### StoresSchema Function

```javascript
export const StoresSchema = (isEdit = false) => z.object({
  // Field validations...
});
```

**Parameters:**
- `isEdit` (boolean, default: false): Determines validation strictness for updates

---

## Field Validations

### Core Product Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `title` | `string` | Yes | Minimum 1 character | "Product title is required" |
| `category` | `string` | Yes | Minimum 1 character | "Category is required" |
| `content` | `string` | Optional | No specific validation | - |

### Pricing Information

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `price` | `number` | Yes | - Required<br>- Non-negative<br>- Max 2 decimal places<br>- String preprocessing | - "Price is required"<br>- "Price cannot be negative"<br>- "Price can have at most 2 decimal places" |

### Product Attributes

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `discount` | `string` | Optional | No specific validation | - |
| `size` | `string` | Optional | No specific validation | - |
| `color` | `string` | Optional | No specific validation | - |
| `material` | `string` | Optional | No specific validation | - |
| `product_code` | `string` | Optional | No specific validation | - |
| `other_product_info` | `string` | Optional | No specific validation | - |
| `shipping_cost` | `string` | Optional | No specific validation | - |

### Product Image

| Field | Type | Required | Validation Rules | Error Messages |
|-------|------|----------|------------------|---------------|
| `image` | `File/any` | Optional | - File type: JPEG, PNG, GIF, WebP<br>- Max size: 3MB<br>- Existing files pass validation | - "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed."<br>- "File size is too large. Max limit is 3MB." |

---

## Usage Examples

### Example 1: Product Creation Validation
```javascript
import { StoresSchema } from '@/lib/validation/stores';

export async function createProduct(req, res) {
  try {
    const validatedData = StoresSchema(false).parse({
      title: req.body.productName,
      category: req.body.category,
      price: req.body.price,
      content: req.body.description,
      image: req.file,
      discount: req.body.discount,
      size: req.body.size,
      color: req.body.color,
      material: req.body.material,
      product_code: req.body.productCode,
      other_product_info: req.body.additionalInfo,
      shipping_cost: req.body.shippingCost
    });

    // Create product with validated data
    const product = await Store.create(validatedData);

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    res.status(500).json({ error: 'Product creation failed' });
  }
}
```

### Example 2: Product Update Validation
```javascript
export async function updateProduct(req, res) {
  try {
    const validatedData = StoresSchema(true).parse(req.body);

    const product = await Store.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    res.status(500).json({ error: 'Product update failed' });
  }
}
```

### Example 3: Product Listing Setup
```javascript
export async function setupProductListing(req, res) {
  try {
    const validationResult = StoresSchema(false).safeParse({
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      content: req.body.description,
      image: req.file,
      discount: req.body.discount,
      size: req.body.size,
      color: req.body.color,
      material: req.body.material,
      product_code: req.body.code,
      other_product_info: req.body.info,
      shipping_cost: req.body.shipping
    });

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.errors
      });
    }

    // Process product listing setup...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Product setup failed' });
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
      message: 'Product title is required',
      path: ['title']
    },
    {
      code: 'custom',
      message: 'Price is required',
      path: ['price']
    },
    {
      code: 'custom',
      message: 'Price can have at most 2 decimal places',
      path: ['price']
    }
  ]
}
```

### Custom Error Messages

| Validation Type | Error Code | Message |
|----------------|------------|---------|
| **Required Title** | `too_small` | "Product title is required" |
| **Required Category** | `too_small` | "Category is required" |
| **Price Required** | `custom` | "Price is required" |
| **Price Negative** | `too_small` | "Price cannot be negative" |
| **Price Decimals** | `custom` | "Price can have at most 2 decimal places" |
| **File Type** | `custom` | "Invalid image file. Only JPEG, PNG, GIF, or WebP are allowed." |
| **File Size** | `custom` | "File size is too large. Max limit is 3MB." |

---

## Business Rules

### 1. **Product Identity**
- **Rule:** Products must have a title and category
- **Required Fields:** Title and category with minimum 1 character
- **Purpose:** Clear product identification and categorization

### 2. **Pricing Structure**
- **Rule:** Products must have valid pricing information
- **Validation:** Non-negative numbers with max 2 decimal places
- **Preprocessing:** String-to-number conversion for flexible input
- **Purpose:** Accurate pricing for e-commerce transactions

### 3. **Product Attributes**
- **Rule:** Products can have various descriptive attributes
- **Optional Fields:** Size, color, material, product code, shipping cost
- **Purpose:** Detailed product specifications for customer decisions

### 4. **Product Image**
- **Rule:** Product images must be valid formats under 3MB
- **Formats:** JPEG, PNG, GIF, WebP
- **Flexibility:** Existing images don't require re-upload

### 5. **Discount Information**
- **Rule:** Discount information is optional but can be specified
- **Purpose:** Support promotional pricing and sales

### 6. **Shipping Costs**
- **Rule:** Shipping costs can be specified per product
- **Purpose:** Transparent shipping pricing for customers

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Price Preprocessing** | String-to-number conversion | Consider client-side number input |
| **File Validation** | Client-side pre-validation | Implement server-side file scanning |
| **Category Validation** | String length validation | Add category existence validation |
| **Bulk Operations** | Individual validation | Implement batch product validation |

---

## Testing Examples

### Valid Product Data
```javascript
const validProduct = {
  title: "Professional Football Boots",
  category: "Footwear",
  price: 89.99,
  content: "High-quality football boots for professional players",
  discount: "10%",
  size: "UK 9",
  color: "Black/White",
  material: "Synthetic Leather",
  product_code: "FB-001",
  other_product_info: "Waterproof and lightweight design",
  shipping_cost: "£5.99"
};
```

### Invalid Product Data Examples
```javascript
// Invalid title (empty)
const invalidTitle = {
  ...validProduct,
  title: "" // Empty string
};

// Invalid price (negative)
const invalidPrice = {
  ...validProduct,
  price: -10 // Negative price
};

// Invalid price (too many decimals)
const invalidDecimals = {
  ...validProduct,
  price: 89.999 // More than 2 decimal places
};

// Invalid file type
const invalidFile = {
  ...validProduct,
  image: new File([''], 'product.txt', { type: 'text/plain' })
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial stores validation schema with product pricing |

---

## Future Enhancements

- [ ] Add category existence validation
- [ ] Implement price range validation
- [ ] Add product code uniqueness validation
- [ ] Support for multiple product images
- [ ] Add inventory/quantity validation
- [ ] Implement product weight validation for shipping
- [ ] Add product availability validation
- [ ] Support for product variants (size/color combinations)

---

## Related Files

- **Stores Model:** Product data structure definition
- **Categories Model:** Product categorization
- **Carts Model:** Product cart functionality

---

## Support & Maintenance

For questions or issues related to this validation schema, please refer to the main project documentation or contact the development team.
