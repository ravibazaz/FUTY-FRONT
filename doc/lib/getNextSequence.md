# Sequence Generator Module Documentation

## Module Purpose

The `getNextSequence` module provides auto-incrementing sequence number generation for the FUTY application using MongoDB counters. It ensures unique, sequential IDs for database records that require human-readable or ordered identifiers.

**Key Responsibility:** Generate sequential numbers for database records using a centralized counter collection, ensuring uniqueness across the application.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/getNextSequence.js` |
| **Type** | Database Sequence Generator |
| **Dependencies** | `@/lib/models/Counter.js` |
| **Exports** | `getNextSequence()` |
| **Usage Pattern** | Atomic database increment operations |

---

## Architecture

### Counter Collection Strategy

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Atomic Operations** | MongoDB `$inc` operator | Thread-safe increments |
| **Upsert Behavior** | `upsert: true` flag | Auto-creates counters |
| **Model-Specific** | Per-model counter tracking | Independent sequences |
| **Return New Value** | `new: true` option | Returns incremented value |

### Database Schema

**Counter Document Structure:**
```javascript
{
  _id: ObjectId,
  model: "User",     // Model name identifier
  seq: 42           // Current sequence value
}
```

---

## API Reference

### `getNextSequence(modelName)`

Generates the next sequential number for a given model.

#### Signature
```javascript
getNextSequence(modelName: string): Promise<number>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `modelName` | `string` | Yes | Name of the model (e.g., "User", "Team") |

#### Return Value

| Type | Description |
|------|-------------|
| `Promise<number>` | Next sequential number for the model |

#### Implementation Details

- **Atomic Operation:** Uses `findOneAndUpdate` with `$inc`
- **Upsert:** Creates counter document if it doesn't exist
- **Thread Safety:** MongoDB ensures atomicity
- **Starting Value:** First call returns 1, then increments

---

## Request Flow

```
Model Name → Counter.findOneAndUpdate()
        ↓
  $inc: { seq: 1 } with upsert: true
        ↓
  MongoDB atomic operation
        ↓
  Return new sequence value
```

---

## Usage Examples

### Example 1: User Registration
```javascript
import { getNextSequence } from '@/lib/getNextSequence';

export async function createUser(userData) {
  const userId = await getNextSequence('User');
  
  const user = await User.create({
    ...userData,
    userId,  // Human-readable ID like 1001, 1002, etc.
    createdAt: new Date()
  });
  
  return user;
}
```

### Example 2: Order Number Generation
```javascript
export async function createOrder(orderData) {
  const orderNumber = await getNextSequence('Order');
  
  const order = await Order.create({
    ...orderData,
    orderNumber: `ORD-${orderNumber.toString().padStart(6, '0')}`,
    // Output: "ORD-000001", "ORD-000002", etc.
  });
  
  return order;
}
```

### Example 3: Tournament Registration
```javascript
export async function registerTeamForTournament(teamId, tournamentId) {
  const registrationNumber = await getNextSequence('TournamentRegistration');
  
  const registration = await TournamentAccepted.create({
    teamId,
    tournamentId,
    registrationNumber,
    registeredAt: new Date()
  });
  
  return registration;
}
```

### Example 4: Invoice Generation
```javascript
export async function generateInvoice(orderId) {
  const invoiceNumber = await getNextSequence('Invoice');
  
  const invoice = await Invoice.create({
    orderId,
    invoiceNumber,
    invoiceCode: `INV-${new Date().getFullYear()}-${invoiceNumber}`,
    issuedAt: new Date()
  });
  
  return invoice;
}
```

### Example 5: Sequential Document IDs
```javascript
export async function createDocument(docType, content) {
  const docId = await getNextSequence(docType);
  
  const document = await Document.create({
    docType,
    docId,
    content,
    createdAt: new Date()
  });
  
  return document;
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Model Name** | Accepts any string as model identifier | No validation; creates counter |
| **Database Connection** | Assumes active MongoDB connection | Throws connection errors |
| **Counter Document** | Auto-creates if not exists | Upsert handles missing documents |
| **Concurrent Access** | MongoDB handles race conditions | Atomic operations guarantee uniqueness |

---

## Response Examples

| Call | Counter State | Return Value | New Counter State |
|------|---------------|--------------|-------------------|
| `getNextSequence('User')` | `{model: 'User', seq: 0}` | `1` | `{model: 'User', seq: 1}` |
| `getNextSequence('User')` | `{model: 'User', seq: 1}` | `2` | `{model: 'User', seq: 2}` |
| `getNextSequence('Order')` | Non-existent | `1` | `{model: 'Order', seq: 1}` |

---

## Error Handling

### Current State
**Database Error Propagation:** Relies on Mongoose error handling for database connection and operation failures.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **Connection Failure** | MongoDB unreachable | Sequence generation fails | **Implement retry logic** |
| **Duplicate Counters** | Race condition in counter creation | Potential duplicates | **MongoDB atomicity prevents this** |
| **Counter Corruption** | Manual counter modification | Sequence gaps/jumps | **Add counter validation** |
| **High Contention** | Many concurrent requests | Performance degradation | **Monitor sequence usage** |

### Recommended Error Handling Pattern
```javascript
export async function getNextSequence(modelName) {
  try {
    const counter = await Counter.findOneAndUpdate(
      { model: modelName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    return counter.seq;
    
  } catch (error) {
    console.error(`Failed to get next sequence for ${modelName}:`, error);
    
    // Fallback: generate timestamp-based ID
    return Date.now();
  }
}
```

---

## Security Considerations

### 1. **Sequence Predictability**
- **Information Disclosure:** Sequential IDs reveal business metrics
- **Risk:** Competitors can estimate user base size
- **Mitigation:** Use UUIDs for public-facing IDs, sequences for internal use

### 2. **Race Conditions**
- **Atomic Operations:** MongoDB ensures thread safety
- **No Duplicates:** Guaranteed unique sequences
- **Performance:** Minimal contention for different models

### 3. **Access Control**
- **Database Security:** Counter collection should be protected
- **Application Layer:** Only authorized operations can generate sequences
- **Audit Trail:** Consider logging sequence generation

### 4. **Resource Usage**
- **Storage Growth:** Counter collection grows with new models
- **Index Requirements:** Model field should be indexed
- **Cleanup:** No automatic cleanup of unused counters

---

## Important Business Rules

### 1. **Uniqueness Guarantee**
- **Rule:** Each model has unique, gap-free sequences
- **Enforcement:** Atomic MongoDB operations
- **Business Impact:** Reliable ID generation for business records

### 2. **Auto-Creation**
- **Rule:** Counters created automatically on first use
- **Implication:** No manual setup required for new models
- **Scalability:** Easy addition of new sequenced entities

### 3. **Starting Value**
- **Rule:** Sequences start at 1 for new models
- **Consistency:** Predictable numbering across the application
- **Business Logic:** Human-readable IDs starting from 1

### 4. **Model Isolation**
- **Rule:** Each model maintains independent sequence
- **Separation:** User IDs don't conflict with Order IDs
- **Flexibility:** Different models can have different numbering schemes

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **User Management** | Customer ID generation |
| **Order Processing** | Invoice/order number creation |
| **Tournament Management** | Registration number assignment |
| **Document Management** | Sequential document numbering |
| **Reporting** | Transaction ID generation |

### Common Integration Patterns

```javascript
// Pattern 1: Model Pre-save Hook
UserSchema.pre('save', async function(next) {
  if (this.isNew && !this.userId) {
    this.userId = await getNextSequence('User');
  }
  next();
});

// Pattern 2: Service Layer Integration
export class OrderService {
  async createOrder(orderData) {
    const orderNumber = await getNextSequence('Order');
    return await Order.create({
      ...orderData,
      orderNumber
    });
  }
}

// Pattern 3: Batch Processing
export async function createBulkOrders(ordersData) {
  const orders = [];
  for (const orderData of ordersData) {
    const orderNumber = await getNextSequence('Order');
    orders.push({
      ...orderData,
      orderNumber
    });
  }
  return await Order.insertMany(orders);
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Generation Time** | ~5-20ms | Database round-trip time |
| **Concurrent Safety** | Guaranteed | MongoDB atomic operations |
| **Scalability** | High | Independent counters per model |
| **Storage Impact** | Minimal | One document per model |

---

## Database Schema

### Counter Collection

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | `ObjectId` | Auto | MongoDB document ID |
| `model` | `String` | Yes | Model name identifier |
| `seq` | `Number` | Yes | Current sequence value |

### Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Primary** | `_id` | Document identification |
| **Model** | `model` | Fast counter lookups |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial sequence generation implementation |

---

## Future Enhancements

- [ ] Add sequence number formatting options
- [ ] Implement sequence number padding (001, 002, etc.)
- [ ] Add support for custom starting values
- [ ] Implement sequence number ranges/reservations
- [ ] Add sequence reset functionality
- [ ] Support for date-prefixed sequences
- [ ] Add sequence usage analytics
- [ ] Implement sequence number validation

---

## Related Modules

- `@/lib/models/Counter.js` - Counter collection schema
- All models using sequential IDs - Consumer modules

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
