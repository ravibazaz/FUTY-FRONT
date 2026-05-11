# Conversation Model Documentation

## Model Purpose

The `Conversation` model represents chat conversations in the FUTY messaging system. It manages conversation rooms, participant lists, conversation types, and message tracking including unread counts and last message references.

**Key Responsibility:** Store conversation metadata and manage participant relationships for messaging functionality.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Conversation.js` |
| **Collection Name** | `conversations` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (participants), Messages (virtual) |
| **Special Features** | Virtual population, unread count tracking, room-based messaging |

---

## Schema Definition

### Core Conversation Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roomId` | `String` | Yes | Unique conversation room identifier (e.g., "5_12") |
| `participants` | `Array<ObjectId>` | No | Array of user IDs participating in conversation |
| `conversation_type` | `Array<String>` | No | Types of conversation (group, private, etc.) |
| `participant_name` | `Array<String>` | No | Names of participants for display |
| `lastMessageAt` | `Date` | No | Timestamp of last message in conversation |
| `unreadCount` | `Map<Number>` | No | Unread message count per user ID (default: empty map) |

### Timestamps

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Conversation creation timestamp (auto-generated) |
| `updatedAt` | `Date` | Conversation last update timestamp (auto-generated) |

---

## Virtual Fields

### Last Message Virtual

```javascript
ConversationSchema.virtual('lastMessage', {
  ref: 'Message',
  localField: 'roomId',
  foreignField: 'roomId',
  justOne: true,
  options: { sort: { createdAt: -1 } }
});
```

**Purpose:** Automatically populate the most recent message in the conversation.

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Room ID** | `roomId` | Unique | Ensure unique conversation rooms |
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Participants** | `participants` | Find conversations for specific users |
| **Last Message** | `lastMessageAt` | Sort conversations by recent activity |
| **Updated Time** | `updatedAt` | Conversation list ordering |

---

## Usage Examples

### Example 1: Create Private Conversation
```javascript
import Conversation from '@/lib/models/Conversation';

export async function createPrivateConversation(userId1, userId2) {
  const roomId = [userId1, userId2].sort().join('_');

  const existingConversation = await Conversation.findOne({ roomId });
  if (existingConversation) {
    return existingConversation;
  }

  const conversation = new Conversation({
    roomId,
    participants: [userId1, userId2],
    conversation_type: ['private'],
    participant_name: [], // Will be populated from user data
    unreadCount: new Map([
      [userId1.toString(), 0],
      [userId2.toString(), 0]
    ])
  });

  return await conversation.save();
}
```

### Example 2: Get User Conversations
```javascript
export async function getUserConversations(userId) {
  return await Conversation.find({
    participants: userId
  })
  .populate('participants', 'name avatar')
  .populate('lastMessage')
  .sort({ lastMessageAt: -1 });
}
```

### Example 3: Update Unread Count
```javascript
export async function updateUnreadCount(roomId, userId, increment = 1) {
  const updateQuery = {};
  updateQuery[`unreadCount.${userId}`] = increment;

  return await Conversation.findOneAndUpdate(
    { roomId },
    { $inc: updateQuery },
    { new: true }
  );
}
```

### Example 4: Mark Conversation as Read
```javascript
export async function markAsRead(roomId, userId) {
  const updateQuery = {};
  updateQuery[`unreadCount.${userId}`] = 0;

  return await Conversation.findOneAndUpdate(
    { roomId },
    { $set: updateQuery },
    { new: true }
  );
}
```

### Example 5: Conversation Statistics
```javascript
export async function getConversationStats(userId) {
  const conversations = await Conversation.find({
    participants: userId
  });

  const totalUnread = conversations.reduce((sum, conv) => {
    const userUnread = conv.unreadCount.get(userId.toString()) || 0;
    return sum + userUnread;
  }, 0);

  const activeConversations = conversations.filter(conv =>
    conv.lastMessageAt &&
    (Date.now() - conv.lastMessageAt.getTime()) < (30 * 24 * 60 * 60 * 1000) // 30 days
  ).length;

  return {
    totalConversations: conversations.length,
    totalUnread,
    activeConversations
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Room ID Uniqueness** | Unique index on roomId | Duplicate key error |
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |
| **Map Type** | Map validation for unreadCount | Type validation |

---

## Business Rules

### 1. **Room ID Generation**
- **Rule:** Room IDs are unique identifiers for conversations
- **Format:** Typically user IDs joined with underscore (e.g., "5_12")
- **Purpose:** Enable direct messaging room identification

### 2. **Participant Management**
- **Rule:** Conversations can have multiple participants
- **Array Field:** `participants` contains user ObjectIds
- **Purpose:** Support both private and group conversations

### 3. **Unread Count Tracking**
- **Rule:** Track unread messages per participant
- **Map Structure:** User ID keys with count values
- **Purpose:** Enable notification badges and read status

### 4. **Last Message Reference**
- **Rule:** Conversations track the most recent message
- **Virtual Field:** Populated from Message collection
- **Purpose:** Display conversation previews

### 5. **Conversation Types**
- **Rule:** Support different conversation types
- **Array Field:** `conversation_type` for categorization
- **Purpose:** Enable filtering and different UI treatments

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Unread Count Updates** | Map field updates | Consider separate collection for large participant groups |
| **Participant Queries** | Array queries | Add participant indexes for large user bases |
| **Virtual Population** | Message population | Cache last message data for performance |
| **Real-time Updates** | Polling-based | Implement WebSocket for real-time messaging |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial conversation model with messaging support |

---

## Future Enhancements

- [ ] Add conversation archiving functionality
- [ ] Implement conversation muting options
- [ ] Add conversation categories/tags
- [ ] Support for conversation drafts
- [ ] Add conversation search functionality
- [ ] Implement conversation encryption
- [ ] Add conversation participant roles (admin, member)
- [ ] Support for conversation media sharing
- [ ] Add conversation analytics and metrics

---

## Related Models

- **Users Model:** Conversation participants and user information
- **Message Model:** Individual messages within conversations
- **Notification Model:** Conversation-related notifications

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
