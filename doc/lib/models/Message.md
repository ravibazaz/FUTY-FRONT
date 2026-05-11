# Message Model Documentation

## Model Purpose

The `Message` model represents individual messages in chat conversations within the FUTY application. It supports real-time messaging between users with delivery status tracking, attachments, and message threading through room-based organization.

**Key Responsibility:** Store chat messages with delivery tracking and attachment support.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Message.js` |
| **Collection Name** | `messages` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (sender/receiver) |
| **Special Features** | Message status tracking, attachment support, room-based threading |

---

## Schema Definition

### Message Core

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roomId` | `String` | Yes | Chat room identifier (indexed) |
| `senderId` | `ObjectId` | Yes | Reference to User collection (message sender) |
| `receiverId` | `ObjectId` | Yes | Reference to User collection (message receiver) |
| `text` | `String` | No | Message content (default: empty) |

### Attachments & Media

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `attachments` | `[String]` | No | Array of attachment URLs |

### Delivery Status

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `String` | No | Message status: "sent", "delivered", "seen" (default: "sent") |
| `seenAt` | `Date` | No | Timestamp when message was seen (default: null) |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `createdAt` | `Date` | No | Message creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Room Messages** | `roomId` | Index | Find messages in a chat room |
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Sender Messages** | `senderId` | Find messages sent by user |
| **Receiver Messages** | `receiverId` | Find messages received by user |
| **Message Status** | `status` | Filter by delivery status |
| **Creation Time** | `createdAt` | Sort messages chronologically |
| **Room + Time** | `roomId, createdAt` | Efficient room message pagination |

---

## Usage Examples

### Example 1: Send Message
```javascript
import Message from '@/lib/models/Message';

export async function sendMessage(messageData) {
  const message = new Message({
    roomId: messageData.roomId,
    senderId: messageData.senderId,
    receiverId: messageData.receiverId,
    text: messageData.text,
    attachments: messageData.attachments || [],
    status: 'sent'
  });

  return await message.save();
}
```

### Example 2: Get Room Messages
```javascript
export async function getRoomMessages(roomId, limit = 50, skip = 0) {
  return await Message.find({ roomId })
    .populate('senderId', 'name profile_image')
    .populate('receiverId', 'name profile_image')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
}
```

### Example 3: Mark Messages as Delivered
```javascript
export async function markMessagesDelivered(roomId, userId) {
  return await Message.updateMany(
    {
      roomId,
      receiverId: userId,
      status: 'sent'
    },
    {
      status: 'delivered'
    }
  );
}
```

### Example 4: Mark Message as Seen
```javascript
export async function markMessageSeen(messageId) {
  return await Message.findByIdAndUpdate(
    messageId,
    {
      status: 'seen',
      seenAt: new Date()
    },
    { new: true }
  );
}
```

### Example 5: Get Unread Messages Count
```javascript
export async function getUnreadCount(userId) {
  return await Message.countDocuments({
    receiverId: userId,
    status: { $ne: 'seen' }
  });
}
```

### Example 6: Get User Conversations
```javascript
export async function getUserConversations(userId) {
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ senderId: userId }, { receiverId: userId }]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$roomId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiverId', userId] },
                  { $ne: ['$status', 'seen'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  return conversations;
}
```

### Example 7: Delete Message
```javascript
export async function deleteMessage(messageId, userId) {
  // Only allow sender to delete their own messages
  return await Message.findOneAndDelete({
    _id: messageId,
    senderId: userId
  });
}
```

### Example 8: Search Messages
```javascript
export async function searchMessages(roomId, searchTerm) {
  return await Message.find({
    roomId,
    text: { $regex: searchTerm, $options: 'i' }
  })
    .populate('senderId', 'name')
    .sort({ createdAt: -1 });
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **RoomId Required** | Required validation | Validation errors |
| **SenderId Required** | Required validation | Validation errors |
| **ReceiverId Required** | Required validation | Validation errors |
| **Status Enum** | Enum validation | Invalid status values |
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |

---

## Business Rules

### 1. **Room-Based Messaging**
- **Rule:** Messages belong to chat rooms
- **Field:** `roomId` for conversation grouping
- **Purpose:** Organize messages by conversation

### 2. **Message Delivery Tracking**
- **Rule:** Track message delivery status
- **Status Values:** sent → delivered → seen
- **Purpose:** Message delivery confirmation

### 3. **Attachment Support**
- **Rule:** Messages can include attachments
- **Field:** `attachments` array of URLs
- **Purpose:** Rich media messaging

### 4. **Bi-directional Communication**
- **Rule:** Messages have both sender and receiver
- **References:** senderId and receiverId
- **Purpose:** Two-way conversation support

### 5. **Message Persistence**
- **Rule:** Messages are permanently stored
- **Timestamps:** createdAt and seenAt
- **Purpose:** Conversation history

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Room Queries** | Indexed roomId | Efficient room message retrieval |
| **Pagination** | Sort by createdAt | Use compound indexes for pagination |
| **Status Updates** | Bulk operations | Batch status updates |
| **Unread Counts** | Aggregation queries | Cache unread counts |
| **Search Performance** | Text search | Consider text indexes for search |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial message model with delivery tracking |

---

## Future Enhancements

- [ ] Add message reactions/emojis
- [ ] Implement message threading/replies
- [ ] Add message encryption
- [ ] Support for message editing
- [ ] Add message deletion for all participants
- [ ] Implement message forwarding
- [ ] Add typing indicators
- [ ] Support for voice messages
- [ ] Add message read receipts for groups

---

## Related Models

- **Users Model:** Sender and receiver information
- **Conversation Model:** Chat room context

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
