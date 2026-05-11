# Chat Manager Module Documentation

## Module Purpose

The `chatManager` module provides an in-memory chat room management system for real-time messaging in the FUTY application. It implements an event-driven architecture using the EventTarget API to handle chat events like messages, typing indicators, presence updates, and read receipts.

**Key Responsibility:** Manage chat rooms and facilitate event-based communication between users in real-time conversations.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/chatManager.js` |
| **Type** | In-memory Event Manager |
| **Dependencies** | None (uses native EventTarget) |
| **Exports** | `chatManager` (singleton instance) |
| **Usage Pattern** | Event-driven messaging system |

---

## Architecture

### Core Classes

| Class | Purpose | Key Features |
|-------|---------|--------------|
| **ChatRoom** | Individual chat room instance | EventTarget-based, message dispatching |
| **ChatManager** | Room registry and management | Singleton pattern, room lifecycle |

### Design Patterns

- **Singleton Pattern:** Global `chatManager` instance
- **EventTarget API:** Native browser event system for messaging
- **Factory Pattern:** Room creation on-demand
- **Observer Pattern:** Event-driven communication

---

## API Reference

### ChatManager Class

#### Constructor
```javascript
new ChatManager()
```

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `getRoom(roomId)` | `getRoom(string): ChatRoom` | Get or create chat room by ID |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `rooms` | `Map<string, ChatRoom>` | Registry of active chat rooms |

### ChatRoom Class

#### Constructor
```javascript
new ChatRoom()
```

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `send(eventName, data)` | `send(string, any): void` | Dispatch chat event with data |

#### Events

| Event Type | Data Structure | Purpose |
|------------|----------------|---------|
| `"message"` | `{ event: "message", data: messageData }` | Text messages |
| `"typing"` | `{ event: "typing", data: typingData }` | Typing indicators |
| `"presence"` | `{ event: "presence", data: presenceData }` | User presence updates |
| `"read"` | `{ event: "read", data: readData }` | Message read receipts |

---

## Request Flow

```
User A sends message → chatManager.getRoom(roomId)
        ↓
  Room created/fetched
        ↓
  room.send("message", messageData)
        ↓
  Event dispatched to all listeners
        ↓
  User B receives event
```

---

## Usage Examples

### Example 1: Basic Message Sending
```javascript
import { chatManager } from '@/lib/chatManager';

function sendMessage(roomId, messageData) {
  const room = chatManager.getRoom(roomId);
  room.send('message', {
    senderId: 'user123',
    content: 'Hello!',
    timestamp: Date.now()
  });
}
```

### Example 2: Event Listening
```javascript
function setupChatListener(roomId) {
  const room = chatManager.getRoom(roomId);
  
  room.addEventListener('event', (event) => {
    const { event: eventType, data } = JSON.parse(event.data);
    
    switch (eventType) {
      case 'message':
        displayMessage(data);
        break;
      case 'typing':
        showTypingIndicator(data);
        break;
      case 'presence':
        updatePresence(data);
        break;
    }
  });
}
```

### Example 3: Typing Indicator
```javascript
function handleTyping(roomId, userId, isTyping) {
  const room = chatManager.getRoom(roomId);
  room.send('typing', {
    userId,
    isTyping,
    timestamp: Date.now()
  });
}
```

### Example 4: Presence Updates
```javascript
function updatePresence(roomId, userId, status) {
  const room = chatManager.getRoom(roomId);
  room.send('presence', {
    userId,
    status, // 'online', 'offline', 'away'
    timestamp: Date.now()
  });
}
```

### Example 5: Read Receipts
```javascript
function markAsRead(roomId, userId, messageIds) {
  const room = chatManager.getRoom(roomId);
  room.send('read', {
    userId,
    messageIds,
    timestamp: Date.now()
  });
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Room ID** | Accepts any string as room ID | No validation; creates room on-demand |
| **Event Names** | No restrictions on event names | Accepts any string |
| **Event Data** | Accepts any data type | JSON serialization required for complex objects |
| **Listener Registration** | Standard EventTarget validation | Native browser error handling |

---

## Response Examples

### Message Event
```json
{
  "event": "message",
  "data": {
    "senderId": "user123",
    "content": "Hello everyone!",
    "timestamp": 1640995200000,
    "messageId": "msg_456"
  }
}
```

### Typing Event
```json
{
  "event": "typing",
  "data": {
    "userId": "user123",
    "isTyping": true,
    "timestamp": 1640995200000
  }
}
```

### Presence Event
```json
{
  "event": "presence",
  "data": {
    "userId": "user123",
    "status": "online",
    "timestamp": 1640995200000
  }
}
```

### Read Event
```json
{
  "event": "read",
  "data": {
    "userId": "user123",
    "messageIds": ["msg_456", "msg_457"],
    "timestamp": 1640995200000
  }
}
```

---

## Error Handling

### Current State
**Minimal Error Handling:** Relies on EventTarget's native error handling.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **JSON Serialization** | Complex objects in data | Event dispatch fails | **Validate data before sending** |
| **Memory Leaks** | Rooms never cleaned up | Memory accumulation | **Implement garbage collection** |
| **Event Listener Limits** | Too many listeners per room | Performance degradation | **Monitor listener counts** |
| **Global State** | Singleton conflicts | State corruption | **Add instance isolation** |

### Recommended Enhancements
```javascript
class ChatManager {
  constructor() {
    this.rooms = new Map();
    this.maxRooms = 1000; // Limit room count
    this.cleanupInterval = setInterval(() => this.gc(), 300000); // 5min cleanup
  }
  
  gc() {
    // Remove empty rooms
    for (const [roomId, room] of this.rooms) {
      if (room.listenerCount === 0) {
        this.rooms.delete(roomId);
      }
    }
  }
}
```

---

## Security Considerations

### 1. **Access Control**
- ⚠️ **No Authorization:** Any code can access any room
- **Risk:** Users can join unauthorized conversations
- **Mitigation:** Implement room access validation at application layer

### 2. **Data Validation**
- ⚠️ **No Input Sanitization:** Accepts any event data
- **Risk:** Malicious data injection, XSS through message content
- **Mitigation:** Validate and sanitize all event data before dispatching

### 3. **Resource Limits**
- **Memory Usage:** Rooms persist in memory indefinitely
- **Risk:** Memory exhaustion from room accumulation
- **Mitigation:** Implement room lifecycle management and cleanup

### 4. **Event Broadcasting**
- **Broadcast Nature:** Events sent to all room listeners
- **Risk:** Sensitive data exposure to unauthorized listeners
- **Mitigation:** Filter recipients based on user permissions

### 5. **Rate Limiting**
- ⚠️ **No Rate Limits:** Unlimited event sending
- **Risk:** DoS attacks through event spam
- **Mitigation:** Implement per-user/per-room rate limiting

---

## Important Business Rules

### 1. **Room Persistence**
- **Rule:** Rooms are created on-demand and persist until server restart
- **Implication:** Room state is lost on server restart
- **Business Impact:** Real-time only; no persistent chat history

### 2. **Event Delivery**
- **Rule:** Events are delivered to all current listeners in a room
- **Guarantee:** No persistence or guaranteed delivery
- **Reliability:** Best-effort delivery within server session

### 3. **Singleton Instance**
- **Rule:** Only one ChatManager instance exists globally
- **Enforcement:** Global variable assignment
- **Scalability:** Not suitable for multi-server deployments

### 4. **Event Format**
- **Rule:** All events must follow `{event, data}` structure
- **Serialization:** Data must be JSON-serializable
- **Consistency:** Standardized event format across the application

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **Real-time Chat** | WebSocket message broadcasting |
| **Typing Indicators** | Live typing status updates |
| **Presence System** | User online/offline status |
| **Read Receipts** | Message delivery confirmation |
| **Live Notifications** | Instant event broadcasting |

### Common Integration Patterns

```javascript
// Pattern 1: WebSocket Integration
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  ws.on('join', (roomId) => {
    const room = chatManager.getRoom(roomId);
    room.addEventListener('event', (event) => {
      ws.send(event.data);
    });
  });
});

// Pattern 2: Database Persistence
room.addEventListener('event', async (event) => {
  const { event: type, data } = JSON.parse(event.data);
  if (type === 'message') {
    await Message.create(data);
  }
});

// Pattern 3: Notification System
room.addEventListener('event', async (event) => {
  const { event: type, data } = JSON.parse(event.data);
  if (type === 'message') {
    await notifyUsersInRoom(roomId, data);
  }
});
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Memory Usage** | O(n) rooms | Linear scaling with active rooms |
| **Event Dispatch** | O(m) listeners | Linear with listeners per room |
| **Creation Time** | < 1ms | Minimal room creation overhead |
| **Persistence** | Session-only | Lost on server restart |

---

## Limitations

### Current Constraints

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **No Persistence** | Messages lost on restart | Use database for persistence |
| **Memory Only** | Limited by server RAM | Implement Redis/external storage |
| **Single Server** | Not horizontally scalable | Use Redis Pub/Sub for multi-server |
| **No History** | No message history | Implement separate history system |

### Scalability Considerations

- **Room Count:** Limited by available memory
- **Concurrent Users:** Limited by server capacity
- **Message Volume:** No built-in rate limiting
- **Data Size:** JSON serialization overhead

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial event-driven chat implementation |

---

## Future Enhancements

- [ ] Add room access control and authorization
- [ ] Implement message persistence and history
- [ ] Add rate limiting and spam protection
- [ ] Support for Redis/external storage
- [ ] Add room cleanup and garbage collection
- [ ] Implement horizontal scaling support
- [ ] Add message encryption
- [ ] Support for file/image sharing events

---

## Related Modules

- `@/lib/chatHelpers` - Chat room ID generation
- `@/lib/models/Message` - Message data persistence
- `@/lib/models/Conversation` - Conversation metadata

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
