# Counter Model Documentation

## Model Purpose

The `Counter` model provides sequential ID generation for other models in the FUTY application. It maintains sequence counters for different model types, enabling auto-incrementing IDs similar to SQL databases.

**Key Responsibility:** Generate and maintain sequential counters for model identification.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Counter.js` |
| **Collection Name** | `counters` |
| **Type** | Mongoose Schema Model |
| **Relationships** | None direct (references all models) |
| **Special Features** | Sequential ID generation, atomic increments |

---

## Schema Definition

### Counter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | `String` | Yes | Name of the model this counter is for (unique) |
| `seq` | `Number` | No | Current sequence number (default: 0) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Model Name** | `model` | Unique | Ensure one counter per model type |
| **Default** | `_id` | Primary | Document identification |

---

## Usage Examples

### Example 1: Get Next Sequence Number
```javascript
import Counter from '@/lib/models/Counter';

export async function getNextSequence(modelName) {
  const counter = await Counter.findOneAndUpdate(
    { model: modelName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}
```

### Example 2: Initialize Counter for Model
```javascript
export async function initializeCounter(modelName, startValue = 0) {
  const existingCounter = await Counter.findOne({ model: modelName });

  if (!existingCounter) {
    const counter = new Counter({
      model: modelName,
      seq: startValue
    });

    return await counter.save();
  }

  return existingCounter;
}
```

### Example 3: Reset Counter
```javascript
export async function resetCounter(modelName, newValue = 0) {
  return await Counter.findOneAndUpdate(
    { model: modelName },
    { seq: newValue },
    { new: true, upsert: true }
  );
}
```

### Example 4: Get Current Sequence
```javascript
export async function getCurrentSequence(modelName) {
  const counter = await Counter.findOne({ model: modelName });
  return counter ? counter.seq : 0;
}
```

### Example 5: Counter Statistics
```javascript
export async function getCounterStats() {
  const counters = await Counter.find({});
  const stats = {};

  counters.forEach(counter => {
    stats[counter.model] = counter.seq;
  });

  return {
    totalCounters: counters.length,
    counters: stats,
    highestSequence: Math.max(...counters.map(c => c.seq))
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Model Name Uniqueness** | Unique index on model | Duplicate key error |
| **Sequence Number** | Number type validation | Type validation |
| **Required Fields** | Required validation | Validation errors |

---

## Business Rules

### 1. **Model-Specific Counters**
- **Rule:** Each model type has its own counter
- **Uniqueness:** Model name must be unique
- **Purpose:** Independent sequence generation per model

### 2. **Atomic Increments**
- **Rule:** Sequence increments are atomic operations
- **Implementation:** MongoDB `$inc` operator
- **Purpose:** Prevent race conditions in ID generation

### 3. **Auto-Initialization**
- **Rule:** Counters are created automatically when first accessed
- **Upsert:** `upsert: true` in findOneAndUpdate
- **Purpose:** No manual counter setup required

### 4. **Sequential IDs**
- **Rule:** Generated IDs are sequential and gap-free
- **Purpose:** Predictable ID generation for external systems

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Atomic Operations** | Single document updates | High performance for ID generation |
| **Index Usage** | Unique index on model | Fast lookups by model name |
| **Concurrent Access** | MongoDB atomic operations | Safe for high-concurrency scenarios |
| **Storage Size** | Minimal document size | Efficient storage for counters |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial counter model for sequential ID generation |

---

## Future Enhancements

- [ ] Add counter ranges for different environments
- [ ] Implement counter batch allocation
- [ ] Add counter reset scheduling
- [ ] Support for custom increment values
- [ ] Add counter usage analytics
- [ ] Implement counter backup and restore
- [ ] Add counter validation ranges
- [ ] Support for hierarchical counters

---

## Related Models

- **All Models:** Counter provides ID generation for any model requiring sequential IDs
- **No Direct Relationships:** Counter is a utility model referenced by ID generation functions

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
