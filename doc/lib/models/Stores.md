# Stores Model Documentation

## Model Purpose

The `Stores` model represents products available for purchase in the FUTY application. It stores product information, pricing, inventory details, and relationships to categories and users. Products support discount pricing, shipping costs, and various product attributes.

**Key Responsibility:** Store product catalog information with pricing and categorization for e-commerce functionality.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Stores.js` |
| **Collection Name** | `stores` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Categories, Users (sellers) |
| **Special Features** | Pricing calculations, product attributes, discount system |

---

## Schema Definition

### Core Product Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `String` | No | Product name/title |
| `isActive` | `Boolean` | No | Product active status (default: true) |

### Content & Media

| Field | Type | Description |
|-------|------|-------------|
| `content` | `String` | Product description |
| `image` | `String` | Product image URL |

### Pricing Information

| Field | Type | Description |
|-------|------|-------------|
| `price` | `Number` | Base product price (required, min: 0) |
| `discount` | `Number` | Discount amount/percentage (default: 0) |
| `shipping_cost` | `Number` | Shipping cost (default: 0) |

### Product Attributes

| Field | Type | Description |
|-------|------|-------------|
| `size` | `String` | Product size specification |
| `color` | `String` | Product color |
| `material` | `String` | Product material |
| `product_code` | `String` | Unique product code/SKU |
| `other_product_info` | `String` | Additional product information |

### Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `category` | `ObjectId` | `Categories` | Product category |
| `user` | `ObjectId` | `User` | Product seller/owner |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Product creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Category Lookup** | `category` | Find products by category |
| **Active Products** | `isActive` | Active product queries |
| **Seller Lookup** | `user` | Find products by seller |
| **Price Range** | `price` | Price-based filtering |
| **Product Code** | `product_code` | Unique product lookup |

---

## Usage Examples

### Example 1: Product Creation
```javascript
import Store from '@/lib/models/Stores';

export async function createProduct(productData, sellerId) {
  const product = new Store({
    title: productData.name,
    content: productData.description,
    image: productData.imageUrl,
    price: productData.price,
    discount: productData.discount || 0,
    shipping_cost: productData.shippingCost || 0,
    size: productData.size,
    color: productData.color,
    material: productData.material,
    product_code: productData.sku,
    other_product_info: productData.additionalInfo,
    category: productData.categoryId,
    user: sellerId,
    isActive: true
  });

  return await product.save();
}
```

### Example 2: Product Catalog
```javascript
export async function getProductCatalog(options = {}) {
  const { category, minPrice, maxPrice, seller } = options;

  const query = { isActive: true };

  if (category) query.category = category;
  if (seller) query.user = seller;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  return await Store.find(query)
    .populate('category', 'title')
    .populate('user', 'name')
    .sort({ createdAt: -1 });
}
```

### Example 3: Product Pricing
```javascript
export async function calculateProductPrice(productId) {
  const product = await Store.findById(productId);

  const basePrice = product.price;
  const discountAmount = product.discount;
  const shippingCost = product.shipping_cost;

  // Assuming discount is a percentage if < 1, or fixed amount if >= 1
  const discountValue = discountAmount < 1 ?
    basePrice * discountAmount :
    discountAmount;

  const finalPrice = Math.max(0, basePrice - discountValue);
  const totalPrice = finalPrice + shippingCost;

  return {
    product: product.title,
    basePrice,
    discount: discountValue,
    shippingCost,
    finalPrice,
    totalPrice
  };
}
```

### Example 4: Category Products
```javascript
export async function getCategoryProducts(categoryId) {
  return await Store.find({
    category: categoryId,
    isActive: true
  })
  .populate('user', 'name')
  .select('title price discount image product_code')
  .sort({ price: 1 });
}
```

### Example 5: Product Search
```javascript
export async function searchProducts(searchTerm) {
  return await Store.find({
    isActive: true,
    $or: [
      { title: new RegExp(searchTerm, 'i') },
      { content: new RegExp(searchTerm, 'i') },
      { product_code: new RegExp(searchTerm, 'i') }
    ]
  })
  .populate('category', 'title')
  .limit(20);
}
```

### Example 6: Seller Products
```javascript
export async function getSellerProducts(sellerId) {
  const products = await Store.find({
    user: sellerId
  })
  .populate('category', 'title')
  .sort({ createdAt: -1 });

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0)
  };

  return {
    products,
    stats
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `category` | `Categories` | All category fields | Get product category details |
| `user` | `User` | All user fields | Get seller information |

### Complex Population Example
```javascript
export async function getProductDetails(productId) {
  return await Store.findById(productId)
    .populate('category', 'title content image')
    .populate('user', 'name email telephone');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Price Validation** | `min: 0` constraint | Validation errors for negative prices |
| **Required Price** | `required: true` | Mongoose validation errors |
| **Boolean Defaults** | Default `isActive: true` | Automatic value assignment |
| **Number Defaults** | Default `discount: 0`, `shipping_cost: 0` | Automatic value assignment |

---

## Business Rules

### 1. **Pricing Structure**
- **Rule:** Products have base price, discount, and shipping cost
- **Calculation:** Final price = base price - discount + shipping
- **Validation:** Prices cannot be negative

### 2. **Discount System**
- **Rule:** Discounts can be percentage or fixed amount
- **Flexibility:** Support for both discount types
- **Calculation:** Automatic discount application

### 3. **Product Categorization**
- **Rule:** Products belong to categories for organization
- **Hierarchy:** Support for category-based browsing
- **Navigation:** Category relationships enable product discovery

### 4. **Seller Management**
- **Rule:** Products are associated with sellers/users
- **Ownership:** Users can manage their product listings
- **Marketplace:** Support for multiple sellers

### 5. **Product Activation**
- **Rule:** Products can be active or inactive
- **Default:** New products are active
- **Management:** Inactive products don't appear in catalogs

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Price Queries** | Range queries on price | Ensure proper indexing for price filtering |
| **Search Queries** | Regex search on multiple fields | Consider text indexes for better search performance |
| **Category Queries** | Category-based filtering | Add compound indexes for category + active status |
| **Seller Queries** | User-based filtering | Optimize for seller dashboard queries |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial store model with pricing and categorization |

---

## Future Enhancements

- [ ] Add product inventory tracking
- [ ] Implement product variants (size, color combinations)
- [ ] Add product reviews and ratings
- [ ] Support for product images gallery
- [ ] Add product tags and keywords
- [ ] Implement product recommendations
- [ ] Add product analytics and sales tracking
- [ ] Support for bulk product operations
- [ ] Add product expiration dates
- [ ] Implement product comparison features

---

## Related Models

- `@/lib/models/Categories.js` - Product categorization
- `@/lib/models/Users.js` - Product sellers
- `@/lib/models/Carts.js` - Shopping cart functionality
- `@/lib/models/OrderHistories.js` - Purchase tracking

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
