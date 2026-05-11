# Notification Model Documentation

## Model Purpose

The `Notification` model represents user notifications in the FUTY application. It stores notification content, delivery status, and relationships to users. Notifications support various types including chat messages, system announcements, and friend requests.

**Key Responsibility:** Store and manage user notifications with read status tracking and type categorization.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Notification.js` |
| **Collection Name** | `notifications` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (recipients) |
| **Special Features** | Read status tracking, type categorization, automatic timestamps |

---

## Schema Definition

### Core Notification Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `ObjectId` | Yes | Recipient user ID (indexed) |
| `title` | `String` | No | Notification title/headline |
| `body` | `String` | No | Notification message content |
| `type` | `String` | No | Notification type (chat, system, friend_request, etc.) |

### Status Tracking

| Field | Type | Description |
|-------|------|-------------|
| `isRead` | `Boolean` | Read status (default: false) |
| `readAt` | `Date` | Timestamp when notification was read |

### Additional Data

| Field | Type | Description |
|-------|------|-------------|
| `data` | `Object` | Extra payload data (chat room ID, message ID, etc.) |

### Automatic Timestamps

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Notification creation timestamp |
| `updatedAt` | `Date` | Last update timestamp |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **User ID** | `userId` | Index | Fast user notification queries |
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Read Status** | `isRead` | Filter unread notifications |
| **Type** | `type` | Filter by notification type |
| **Created Date** | `createdAt` | Chronological sorting |
| **Compound** | `userId + isRead` | User's unread notifications |

---

## Usage Examples

### Example 1: Create Notification
```javascript
import Notification from '@/lib/models/Notification';

export async function createNotification(userId, notificationData) {
  const notification = new Notification({
    userId: userId,
    title: notificationData.title,
    body: notificationData.body,
    type: notificationData.type, // 'chat', 'system', 'friend_request'
    data: notificationData.data || {}
  });

  return await notification.save();
}
```

### Example 2: Get User Notifications
```javascript
export async function getUserNotifications(userId, options = {}) {
  const { page = 1, limit = 20, unreadOnly = false } = options;
  
  const query = { userId };
  if (unreadOnly) {
    query.isRead = false;
  }
  
  return await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
}
```

### Example 3: Mark as Read
```javascript
export async function markAsRead(notificationId, userId) {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId }, // Ensure user owns notification
    { 
      isRead: true, 
      readAt: new Date() 
    },
    { new: true }
  );
}
```

### Example 4: Bulk Mark as Read
```javascript
export async function markAllAsRead(userId) {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
  
  return result.modifiedCount;
}
```

### Example 5: Notification Statistics
```javascript
export async function getNotificationStats(userId) {
  const total = await Notification.countDocuments({ userId });
  const unread = await Notification.countDocuments({ userId, isRead: false });
  const byType = await Notification.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);
  
  return {
    total,
    unread,
    read: total - unread,
    byType: byType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
}
```

### Example 6: Chat Message Notification
```javascript
export async function notifyChatMessage(chatRoomId, senderId, message, recipients) {
  const notifications = recipients
    .filter(recipientId => recipientId !== senderId) // Don't notify sender
    .map(recipientId => ({
      userId: recipientId,
      title: 'New Message',
      body: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      type: 'chat',
      data: {
        chatRoomId,
        senderId,
        messageId: message._id
      }
    }));
  
  return await Notification.insertMany(notifications);
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `userId` | `User` | All user fields | Get notification recipient details |

### Population Example
```javascript
export async function getNotificationsWithUser(userId) {
  return await Notification.find({ userId })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Required Fields** | `userId` required | Mongoose validation errors |
| **ObjectId Format** | User ID validation | Cast errors |
| **Boolean Defaults** | `isRead: false` | Automatic value assignment |
| **Object Defaults** | `data: {}` | Default empty object |

---

## Business Rules

### 1. **Notification Types**
- **Rule:** Notifications must specify a type for categorization
- **Common Types:** 'chat', 'system', 'friend_request', 'match_invite', 'team_update'
- **Purpose:** Enable filtering and appropriate handling

### 2. **Read Status Tracking**
- **Rule:** Notifications track read status and timestamp
- **Automatic:** `readAt` set when `isRead` becomes true
- **Purpose:** User experience and notification management

### 3. **User Ownership**
- **Rule:** Notifications are strictly tied to recipient users
- **Security:** Users can only access their own notifications
- **Indexing:** `userId` indexed for fast user-specific queries

### 4. **Data Payload**
- **Rule:** Extra data can be stored in the `data` object
- **Flexibility:** Support various notification types with different payloads
- **Examples:** Chat room IDs, match details, user references

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Indexing** | User ID indexed | Add compound indexes for common queries |
| **Pagination** | Manual implementation | Consider cursor-based pagination for large datasets |
| **Bulk Operations** | Individual updates | Implement batch operations for bulk actions |
| **Data Size** | Flexible data object | Monitor and limit data payload sizes |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial notification model with read tracking |

---

## Future Enhancements

- [ ] Add notification priority levels
- [ ] Implement notification expiration/cleanup
- [ ] Add notification delivery preferences per user
- [ ] Support for scheduled notifications
- [ ] Add notification templates and localization
- [ ] Implement push notification integration status
- [ ] Add notification archiving and history
- [ ] Support for notification threads/conversations
- [ ] Add notification analytics and engagement metrics

---

## Related Models

- `@/lib/models/Users.js` - Notification recipients
- `@/lib/models/Chat.js` - Chat-related notifications
- `@/lib/models/Matches.js` - Match-related notifications

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
