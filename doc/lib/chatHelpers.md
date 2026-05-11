# Chat Helpers Module Documentation

## Module Purpose

The `chatHelpers` module provides utility functions for managing chat room identifiers in the FUTY application. It ensures consistent, bidirectional chat room identification by generating deterministic room IDs from pairs of user identifiers.

**Key Responsibility:** Generate stable, unique chat room identifiers that remain consistent regardless of the order in which user IDs are provided.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/chatHelpers.js` |
| **Type** | ES6 Module (Utility) |
| **Dependencies** | None |
| **Exports** | `getChatRoom()` |
| **Usage Pattern** | Pure function (no side effects) |

---

## API Reference

### `getChatRoom(userA, userB)`

Generates a consistent chat room identifier from two user IDs.

#### Signature
```javascript
getChatRoom(userA: string | number, userB: string | number): string
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userA` | `string \| number` | Yes | First user identifier |
| `userB` | `string \| number` | Yes | Second user identifier |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| Room ID | `string` | Concatenated, sorted user IDs joined with underscore (e.g., `"user1_user2"`) |

#### Implementation Details

- **Input Conversion:** Both parameters are converted to strings using `String()`
- **Sorting:** User IDs are sorted alphabetically to ensure bidirectional consistency
- **Delimiter:** Sorted IDs are joined with `"_"`
- **Determinism:** Same user pair always produces identical output

---

## Request Flow

```
User A initiates chat          User B joins chat
        ↓                              ↓
getChatRoom(userA, userB) ← ─ ─ → getChatRoom(userB, userA)
        ↓                              ↓
    "userA_userB" ← ─ ─ ─ ─ ─ ─ ─ ─ "userA_userB"
        ↓                              ↓
  Subscribe to Room          Subscribe to Room
  (Same Room ID)            (Same Room ID)
```

---

## Usage Examples

### Example 1: Basic Room Creation
```javascript
import { getChatRoom } from './lib/chatHelpers.js';

const roomId = getChatRoom('user123', 'user456');
console.log(roomId); // Output: "user123_user456"
```

### Example 2: Bidirectional Consistency
```javascript
const room1 = getChatRoom('alice', 'bob');
const room2 = getChatRoom('bob', 'alice');

console.log(room1 === room2); // Output: true (both are "alice_bob")
```

### Example 3: Numeric User IDs
```javascript
const roomId = getChatRoom(101, 202);
console.log(roomId); // Output: "101_202"
```

### Example 4: Mixed Input Types
```javascript
const roomId = getChatRoom('user001', 42);
console.log(roomId); // Output: "42_user001" (sorted alphabetically)
```

### Example 5: Real-world Chat Subscription
```javascript
// Subscribe to chat updates
function subscribeToChat(userA, userB) {
  const roomId = getChatRoom(userA, userB);
  
  // Subscribe to WebSocket, database, or message broker
  socket.emit('subscribe', { room: roomId });
  
  return roomId;
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Null/Undefined Input** | No validation; will convert to string `"null"` or `"undefined"` | **⚠️ See Security Considerations** |
| **Type Conversion** | Automatically converts numbers and objects to strings | Relies on JavaScript's `String()` coercion |
| **Empty Strings** | Accepts empty strings; produces `"_"` or similar | **⚠️ Should be validated by caller** |
| **Duplicate IDs** | `getChatRoom('user1', 'user1')` → `"user1_user1"` | Self-chat is technically possible |

---

## Response Examples

| Input | Output | Notes |
|-------|--------|-------|
| `getChatRoom('alice', 'bob')` | `"alice_bob"` | Alphabetically sorted |
| `getChatRoom('bob', 'alice')` | `"alice_bob"` | Same as above (consistency) |
| `getChatRoom(5, 3)` | `"3_5"` | Numeric sorting as strings |
| `getChatRoom('user-001', 'user-002')` | `"user-001_user-002"` | Special chars preserved |
| `getChatRoom('xyz', 'abc')` | `"abc_xyz"` | ASCII-order sorting |

---

## Error Handling

### Current State
**⚠️ No explicit error handling.** The function relies on JavaScript's type coercion and does not throw errors.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **Null Input** | `getChatRoom(null, 'user2')` | Produces `"null_user2"` | **Validate inputs before call** |
| **Undefined Input** | `getChatRoom(undefined, 'user2')` | Produces `"undefined_user2"` | **Use default values or guards** |
| **Missing Arguments** | `getChatRoom('user1')` | Second param is `undefined` | **Require both parameters** |
| **Object Input** | `getChatRoom({}, 'user2')` | Produces `"[object Object]_user2"` | **Type-check inputs** |
| **Empty String** | `getChatRoom('', 'user2')` | Produces `"_user2"` | **Validate non-empty IDs** |

### Recommended Input Validation Pattern
```javascript
export function getChatRoom(userA, userB) {
  // Validate inputs
  if (!userA || !userB) {
    throw new Error('Both userA and userB must be provided');
  }
  
  // Existing logic
  return [String(userA), String(userB)].sort().join("_");
}
```

---

## Security Considerations

### 1. **Input Validation**
- ⚠️ **No input sanitization** — Function accepts any truthy value and converts to string
- **Risk:** Potential for injection attacks if room IDs are used in queries or contexts without further validation
- **Mitigation:** Validate and sanitize user IDs at the application layer before passing to this function

### 2. **User ID Exposure**
- **Risk:** Room ID contains plaintext user identifiers
- **Concern:** If room IDs are logged, cached, or transmitted without encryption, user identities are exposed
- **Mitigation:** 
  - Use HTTPS/TLS for all communications
  - Encrypt sensitive data at rest
  - Minimize logging of room IDs

### 3. **Authorization**
- ⚠️ **No authorization checks** — Function generates room IDs without verifying user permissions
- **Risk:** Any code can generate room IDs for arbitrary user pairs
- **Mitigation:** Implement authorization checks at the calling layer:
  ```javascript
  // Example: Verify current user is one of the participants
  function authorizeChat(currentUserId, userA, userB) {
    if (currentUserId !== userA && currentUserId !== userB) {
      throw new Error('Unauthorized: Not a participant in this chat');
    }
    return getChatRoom(userA, userB);
  }
  ```

### 4. **Deterministic Collision Risk**
- **Low Risk:** Sorting ensures consistency but doesn't validate uniqueness across different user pairs
- **Mitigation:** Use robust user ID formats (UUIDs, non-sequential IDs) to minimize collisions

### 5. **Type Coercion Attacks**
- **Risk:** JavaScript's `String()` coercion can produce unexpected results
- **Example:** `String({valueOf: () => 'fake'})` → Allows object-based injection
- **Mitigation:** Enforce strict input types:
  ```javascript
  if (typeof userA !== 'string' && typeof userA !== 'number') {
    throw new TypeError('User ID must be a string or number');
  }
  ```

---

## Important Business Rules

### 1. **Bidirectional Consistency**
- **Rule:** A chat room between UserA and UserB must have the identical room ID regardless of who initiates
- **Enforcement:** Sorting ensures this invariant
- **Business Impact:** Ensures both users can reliably reconnect to the same conversation

### 2. **One Room Per User Pair**
- **Rule:** Only one chat room exists per unique pair of users
- **Implication:** Group chats are not supported by this function
- **Scalability Note:** For group chats, a different naming scheme would be required

### 3. **Permanent Room Identity**
- **Rule:** Room IDs must not change during a chat session
- **Guarantee:** Pure function ensures same inputs always produce same output
- **Reliability:** Room ID can be stored and retrieved consistently

### 4. **User ID Format Responsibility**
- **Rule:** Application must ensure user IDs are unique and properly validated
- **This Module's Responsibility:** Only combines provided IDs; does not validate their uniqueness
- **Calling Code's Responsibility:** Validate user IDs exist and are authorized before calling

### 5. **Privacy by Design**
- **Rule:** Minimize user identity exposure in room IDs
- **Current Implementation:** Room ID contains plaintext identifiers
- **Future Consideration:** For enhanced privacy, consider hashing user pairs:
  ```javascript
  import crypto from 'crypto';
  
  export function getChatRoomHashed(userA, userB) {
    const sorted = [String(userA), String(userB)].sort().join("_");
    return crypto.createHash('sha256').update(sorted).digest('hex');
  }
  ```

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **Real-time Chat** | WebSocket subscribe to room channel |
| **Message Queuing** | Route messages via room ID to broker topics |
| **Database Queries** | Fetch chat history by room ID |
| **Session Management** | Track active rooms per user |
| **Notifications** | Broadcast updates to room subscribers |

### Common Calling Patterns

```javascript
// Pattern 1: Chat subscription
const room = getChatRoom(currentUser, otherUser);
socket.emit('join_room', room);

// Pattern 2: Message persistence
db.collection('messages').insertOne({
  room: getChatRoom(userA, userB),
  message: content,
  timestamp: Date.now()
});

// Pattern 3: Notification routing
pubsub.publish(getChatRoom(sender, recipient), {
  type: 'message',
  payload: messageData
});
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Time Complexity** | O(n log n) | Where n = 2 (sorting 2 strings) |
| **Space Complexity** | O(1) | Constant space allocation |
| **Execution Time** | < 1ms | Negligible performance impact |
| **Cacheability** | Highly cacheable | Deterministic function with small output space |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial release |

---

## Future Enhancements

- [ ] Add input validation for null/undefined checks
- [ ] Support group chat room IDs (multiple participants)
- [ ] Add optional hashing for privacy-enhanced room identifiers
- [ ] Implement room ID versioning for backward compatibility
- [ ] Add JSDoc comments for IDE support

---

## Related Modules

- (None currently documented)

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
