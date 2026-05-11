# OrderHistories Model Documentation

## Model Purpose

The `OrderHistories` model represents purchase order records in the FUTY application. It tracks product orders with comprehensive details including pricing, quantities, discounts, shipping, and customer information for order management and history.

**Key Responsibility:** Store complete order transaction records with product and pricing details.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/OrderHistories.js` |
| **Collection Name** | `orderhistories` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Stores (products), Users (customers) |
| **Special Features** | Comprehensive pricing calculations, product attribute tracking |

---

## Schema Definition

### Product Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_product_title` | `String` | No | Product title/name |
| `order_product_image` | `String` | No | Product image URL |
| `product_id` | `ObjectId` | No | Reference to Stores collection |

### Pricing & Quantities

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_product_price` | `Number` | Yes | Unit price (min: 0) |
| `order_total_price` | `Number` | Yes | Total order price (min: 0) |
| `order_quantity` | `Number` | Yes | Quantity ordered (min: 0) |
| `order_product_discount` | `Number` | No | Discount amount (default: 0, min: 0) |
| `order_product_shipping_cost` | `Number` | No | Shipping cost (default: 0, min: 0) |

### Product Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_product_size` | `String` | No | Product size |
| `order_product_color` | `String` | No | Product color |
| `order_product_material` | `String` | No | Product material |
| `order_product_product_code` | `String` | No | Product code |
| `order_product_other_product_info` | `String` | No | Additional product information |

### Customer Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `purchased_by` | `ObjectId` | No | Reference to User collection (customer) |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `createdAt` | `Date` | No | Order creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Customer Orders** | `purchased_by` | Find orders by customer |
| **Product Orders** | `product_id` | Find orders for specific product |
| **Order Date** | `createdAt` | Sort orders by date |
| **Price Range** | `order_total_price` | Filter orders by price range |

---

## Usage Examples

### Example 1: Create Order History
```javascript
import OrderHistory from '@/lib/models/OrderHistories';

export async function createOrderHistory(orderData) {
  const order = new OrderHistory({
    order_product_title: orderData.product.title,
    order_product_image: orderData.product.image,
    product_id: orderData.product.id,
    order_product_price: orderData.unitPrice,
    order_total_price: orderData.totalPrice,
    order_quantity: orderData.quantity,
    order_product_discount: orderData.discount || 0,
    order_product_shipping_cost: orderData.shipping || 0,
    order_product_size: orderData.size,
    order_product_color: orderData.color,
    order_product_material: orderData.material,
    order_product_product_code: orderData.productCode,
    purchased_by: orderData.customerId
  });

  return await order.save();
}
```

### Example 2: Get Customer Order History
```javascript
export async function getCustomerOrderHistory(customerId) {
  return await OrderHistory.find({ purchased_by: customerId })
    .populate('product_id', 'title category price')
    .sort({ createdAt: -1 });
}
```

### Example 3: Get Product Sales History
```javascript
export async function getProductSalesHistory(productId) {
  return await OrderHistory.find({ product_id: productId })
    .populate('purchased_by', 'name email')
    .sort({ createdAt: -1 });
}
```

### Example 4: Calculate Order Total
```javascript
export async function calculateOrderTotal(orderId) {
  const order = await OrderHistory.findById(orderId);

  if (!order) return null;

  const subtotal = order.order_product_price * order.order_quantity;
  const discount = order.order_product_discount;
  const shipping = order.order_product_shipping_cost;
  const total = subtotal - discount + shipping;

  return {
    subtotal,
    discount,
    shipping,
    total,
    matches: total === order.order_total_price
  };
}
```

### Example 5: Get Orders by Date Range
```javascript
export async function getOrdersByDateRange(startDate, endDate) {
  return await OrderHistory.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .populate('purchased_by', 'name')
    .populate('product_id', 'title')
    .sort({ createdAt: -1 });
}
```

### Example 6: Get Top Selling Products
```javascript
export async function getTopSellingProducts(limit = 10) {
  const topProducts = await OrderHistory.aggregate([
    {
      $group: {
        _id: '$product_id',
        totalQuantity: { $sum: '$order_quantity' },
        totalRevenue: { $sum: '$order_total_price' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $sort: { totalQuantity: -1 }
    },
    {
      $limit: limit
    }
  ]);

  // Populate product details
  const productIds = topProducts.map(item => item._id);
  const products = await OrderHistory.populate(topProducts, {
    path: '_id',
    select: 'order_product_title order_product_image'
  });

  return products;
}
```

### Example 7: Get Customer Spending Analytics
```javascript
export async function getCustomerSpendingAnalytics(customerId) {
  const analytics = await OrderHistory.aggregate([
    { $match: { purchased_by: customerId } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$order_total_price' },
        averageOrderValue: { $avg: '$order_total_price' },
        totalItems: { $sum: '$order_quantity' },
        firstOrder: { $min: '$createdAt' },
        lastOrder: { $max: '$createdAt' }
      }
    }
  ]);

  return analytics[0] || {
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    totalItems: 0,
    firstOrder: null,
    lastOrder: null
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Price Required** | Required validation | Validation errors |
| **Price Non-negative** | Min: 0 validation | Validation errors |
| **Quantity Required** | Required validation | Validation errors |
| **Quantity Non-negative** | Min: 0 validation | Validation errors |
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |

---

## Business Rules

### 1. **Comprehensive Order Tracking**
- **Rule:** Orders include all product and pricing details
- **Fields:** Title, image, price, quantity, discounts, shipping
- **Purpose:** Complete order audit trail

### 2. **Product Attribute Preservation**
- **Rule:** Store product attributes at time of purchase
- **Fields:** Size, color, material, product code
- **Purpose:** Historical product configuration tracking

### 3. **Pricing Validation**
- **Rule:** All monetary values must be non-negative
- **Validation:** Min: 0 for all price fields
- **Purpose:** Prevent invalid financial data

### 4. **Customer Order History**
- **Rule:** Track all customer purchases
- **Reference:** `purchased_by` field
- **Purpose:** Customer purchase analytics

### 5. **Order Total Calculation**
- **Rule:** Total price reflects all costs
- **Formula:** (price × quantity) - discount + shipping
- **Purpose:** Accurate order value tracking

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Customer Queries** | Reference lookups | Add purchased_by index |
| **Product Queries** | Reference lookups | Add product_id index |
| **Date Range Queries** | Date filtering | Add createdAt index |
| **Analytics Queries** | Aggregation operations | Consider pre-computed analytics |
| **Bulk Operations** | Individual operations | Implement batch order processing |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial order history model |

---

## Future Enhancements

- [ ] Add order status tracking
- [ ] Implement order refunds
- [ ] Add shipping tracking
- [ ] Support for order modifications
- [ ] Add order payment information
- [ ] Implement order reviews/ratings
- [ ] Add order delivery confirmation
- [ ] Support for partial deliveries
- [ ] Add order cancellation tracking

---

## Related Models

- **Stores Model:** Product information
- **Users Model:** Customer information

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
