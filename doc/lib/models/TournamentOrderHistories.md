# TournamentOrderHistories Model Documentation

## Model Purpose

The `TournamentOrderHistories` model represents payment and order records for tournament participation in the FUTY application. It tracks tournament registration payments, amounts, currency, and payment status for financial management.

**Key Responsibility:** Store tournament payment and order transaction records.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/TournamentOrderHistories.js` |
| **Collection Name** | `tournamentorderhistories` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Tournaments, Users |
| **Special Features** | Payment tracking, transaction status, Stripe integration |

---

## Schema Definition

### Payment Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | `Number` | No | Payment amount |
| `currency` | `String` | No | Currency code (e.g., USD, EUR) |
| `status` | `String` | No | Payment status (default: "pending") |
| `paymentIntentId` | `String` | No | Stripe payment intent ID |

### References

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tournament_Id` | `ObjectId` | No | Reference to Tournaments collection |
| `created_by_user_Id` | `ObjectId` | No | Reference to User collection (payment creator) |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `createdAt` | `Date` | No | Transaction creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Tournament Orders** | `tournament_Id` | Find orders for tournament |
| **User Orders** | `created_by_user_Id` | Find orders by user |
| **Payment Status** | `status` | Filter by payment status |
| **Creation Date** | `createdAt` | Sort orders by date |

---

## Usage Examples

### Example 1: Create Tournament Payment Record
```javascript
import TournamentOrderHistory from '@/lib/models/TournamentOrderHistories';

export async function createTournamentOrder(orderData) {
  const order = new TournamentOrderHistory({
    amount: orderData.amount,
    currency: orderData.currency,
    status: 'pending',
    paymentIntentId: orderData.paymentIntentId,
    tournament_Id: orderData.tournamentId,
    created_by_user_Id: orderData.userId
  });

  return await order.save();
}
```

### Example 2: Get Tournament Orders
```javascript
export async function getTournamentOrders(tournamentId) {
  return await TournamentOrderHistory.find({ tournament_Id: tournamentId })
    .populate('created_by_user_Id', 'name email')
    .sort({ createdAt: -1 });
}
```

### Example 3: Update Payment Status
```javascript
export async function updatePaymentStatus(orderId, status) {
  return await TournamentOrderHistory.findByIdAndUpdate(
    orderId,
    { status: status },
    { new: true }
  );
}
```

### Example 4: Get User Tournament Payments
```javascript
export async function getUserTournamentPayments(userId) {
  return await TournamentOrderHistory.find({ created_by_user_Id: userId })
    .populate('tournament_Id', 'title')
    .sort({ createdAt: -1 });
}
```

### Example 5: Tournament Revenue Statistics
```javascript
export async function getTournamentRevenue(tournamentId) {
  const orders = await TournamentOrderHistory.find({
    tournament_Id: tournamentId,
    status: 'completed'
  });

  const revenue = {
    total: 0,
    count: 0,
    byCurrency: {}
  };

  orders.forEach(order => {
    if (order.status === 'completed') {
      revenue.total += order.amount;
      revenue.count += 1;
      if (!revenue.byCurrency[order.currency]) {
        revenue.byCurrency[order.currency] = 0;
      }
      revenue.byCurrency[order.currency] += order.amount;
    }
  });

  return revenue;
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Amount** | Number type validation | Type validation |
| **Currency** | String validation | Type validation |
| **Status Default** | Default "pending" | Automatic assignment |
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |

---

## Business Rules

### 1. **Tournament Payment Tracking**
- **Rule:** All tournament payments are recorded
- **References:** tournament_Id and created_by_user_Id
- **Purpose:** Financial audit trail

### 2. **Payment Status Management**
- **Rule:** Track payment status through lifecycle
- **Status Values:** pending, completed, failed, refunded
- **Purpose:** Payment process tracking

### 3. **Multi-Currency Support**
- **Rule:** Support different currencies
- **Fields:** `currency` and `amount`
- **Purpose:** International tournament support

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Tournament Queries** | Reference lookups | Add tournament_Id index |
| **User Queries** | Reference lookups | Add created_by_user_Id index |
| **Status Filtering** | String matching | Add status index |
| **Analytics Queries** | Aggregation operations | Pre-compute common analytics |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial tournament order history model |

---

## Future Enhancements

- [ ] Add refund tracking
- [ ] Implement payment retry logic
- [ ] Add invoice generation
- [ ] Support for partial payments
- [ ] Add payment confirmation emails

---

## Related Models

- **Tournaments Model:** Tournament details
- **Users Model:** Payment creator information

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
