# Carts Model Documentation

## Model Purpose

The `Carts` model represents shopping cart items in the FUTY e-commerce system. It tracks products added to user carts, maintaining relationships between users and products for purchase management.

**Key Responsibility:** Store shopping cart items with user and product associations.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Carts.js` |
| **Collection Name** | `carts` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Stores (product), Users (customer) |
| **Special Features** | Product cart management, user association |

---

## Schema Definition

### Cart Item Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | `ObjectId` | Yes | Reference to Stores collection (product) |
| `added_by` | `ObjectId` | Yes | Reference to Users collection (customer) |
| `createdAt` | `Date` | No | Cart item addition timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **User Cart** | `added_by` | Find all items in user's cart |
| **Product Cart** | `product_id` | Find cart items for specific product |
| **User-Product** | `added_by`, `product_id` | Unique cart items per user |
| **Recent Items** | `createdAt` | Sort cart items by addition time |

---

## Usage Examples

### Example 1: Add Item to Cart
```javascript
import Cart from '@/lib/models/Carts';

export async function addToCart(userId, productId) {
  // Check if item already exists in cart
  const existingItem = await Cart.findOne({
    added_by: userId,
    product_id: productId
  });

  if (existingItem) {
    // Item already in cart, could implement quantity logic here
    return existingItem;
  }

  const cartItem = new Cart({
    product_id: productId,
    added_by: userId
  });

  return await cartItem.save();
}
```

### Example 2: Get User's Cart
```javascript
export async function getUserCart(userId) {
  return await Cart.find({ added_by: userId })
    .populate('product_id', 'title price image discount shipping_cost')
    .sort({ createdAt: -1 });
}
```

### Example 3: Remove from Cart
```javascript
export async function removeFromCart(userId, productId) {
  return await Cart.findOneAndDelete({
    added_by: userId,
    product_id: productId
  });
}
```

### Example 4: Clear User Cart
```javascript
export async function clearUserCart(userId) {
  return await Cart.deleteMany({ added_by: userId });
}
```

### Example 5: Cart Statistics
```javascript
export async function getCartStats(userId) {
  const cartItems = await Cart.find({ added_by: userId });
  const totalItems = cartItems.length;

  // Get populated cart with product details
  const populatedCart = await Cart.find({ added_by: userId })
    .populate('product_id', 'price discount');

  const totalValue = populatedCart.reduce((sum, item) => {
    const product = item.product_id;
    const price = product.price - (product.price * (product.discount || 0) / 100);
    return sum + price;
  }, 0);

  return {
    totalItems,
    totalValue: Math.round(totalValue * 100) / 100,
    items: populatedCart
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |
| **Reference Existence** | Foreign key constraints | Application-level validation |
| **Date Defaults** | Default Date.now() | Automatic timestamp assignment |

---

## Business Rules

### 1. **Cart Item Uniqueness**
- **Rule:** Each user can have only one instance of each product in cart
- **Implementation:** Check for existing items before adding
- **Purpose:** Prevent duplicate cart entries

### 2. **User Association**
- **Rule:** All cart items must be associated with a user
- **Reference:** `added_by` field references Users collection
- **Purpose:** Track cart ownership

### 3. **Product Reference**
- **Rule:** Cart items must reference valid products
- **Reference:** `product_id` field references Stores collection
- **Purpose:** Ensure cart items point to existing products

### 4. **Timestamp Tracking**
- **Rule:** Cart addition time is automatically recorded
- **Purpose:** Track when items were added to cart

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Query Performance** | Basic queries | Add compound indexes for user-product combinations |
| **Population Queries** | Product population | Consider selective field population |
| **Bulk Operations** | Individual operations | Implement batch cart operations |
| **Cart Size Limits** | No limits | Consider implementing cart size restrictions |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial carts model with user-product relationships |

---

## Future Enhancements

- [ ] Add quantity field for multiple product units
- [ ] Implement cart expiration (remove old items)
- [ ] Add cart item notes or customization options
- [ ] Support for cart sharing between devices
- [ ] Add cart backup and restore functionality
- [ ] Implement abandoned cart recovery
- [ ] Add cart item priority or ordering
- [ ] Support for cart templates or saved carts

---

## Related Models

- **Users Model:** Cart ownership and user management
- **Stores Model:** Product information and pricing
- **OrderHistories Model:** Cart conversion to orders

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
