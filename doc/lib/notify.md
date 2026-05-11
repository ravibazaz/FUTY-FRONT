# Notification Module Documentation

## Module Purpose

The `notify` module provides push notification functionality for the FUTY application using Firebase Cloud Messaging (FCM). It handles creating database notification records and sending push notifications to user devices with FCM tokens.

**Key Responsibility:** Create persistent notification records in the database and deliver real-time push notifications to users' mobile devices.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/notify.js` |
| **Type** | Push Notification Service |
| **Dependencies** | Firebase Admin SDK, Notification model |
| **Exports** | `createAndSendNotification()` |
| **Usage Pattern** | Database + FCM notification dispatch |

---

## Architecture

### Notification Flow

| Step | Process | Data Storage |
|------|---------|--------------|
| **Data Validation** | Validate input parameters | N/A |
| **Database Storage** | Create notification record | MongoDB Notification collection |
| **FCM Preparation** | Format FCM message payload | In-memory processing |
| **Push Delivery** | Send to FCM service | Firebase Cloud Messaging |
| **Response Handling** | Process delivery confirmation | Return notification record |

### Dual Storage Strategy

- **Database Persistence:** Notifications stored for history and retrieval
- **Push Delivery:** Real-time delivery to user devices
- **Independent Operations:** Database success doesn't depend on FCM success

---

## API Reference

### `createAndSendNotification(options)`

Creates a notification record and sends a push notification via FCM.

#### Signature
```javascript
createAndSendNotification(options: {
  userId: string,
  fcmToken?: string,
  title: string,
  body: string,
  type: string,
  data?: object
}): Promise<Notification>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | `string` | Yes | Target user ID for notification |
| `fcmToken` | `string` | No | FCM registration token for push delivery |
| `title` | `string` | Yes | Notification title |
| `body` | `string` | Yes | Notification body text |
| `type` | `string` | Yes | Notification category/type |
| `data` | `object` | No | Additional custom data payload |

#### Return Value

| Type | Description |
|------|-------------|
| `Promise<Notification>` | Created notification database record |

#### Implementation Details

- **Database First:** Creates notification record before attempting FCM send
- **FCM Optional:** Push delivery only if FCM token provided
- **Data Serialization:** Custom data converted to string key-value pairs
- **Error Resilience:** FCM failures don't prevent database storage

---

## Request Flow

```
Notification Request → Validate parameters
        ↓
  Notification.create() → Database storage
        ↓
  Check fcmToken present?
        ↓
  Yes → Format FCM message
        ↓
  admin.messaging().send()
        ↓
  Return notification record
```

---

## Usage Examples

### Example 1: Match Invitation
```javascript
import { createAndSendNotification } from '@/lib/notify';

export async function sendMatchInvite(playerId, matchDetails) {
  const player = await User.findById(playerId);
  
  await createAndSendNotification({
    userId: playerId,
    fcmToken: player.fcmToken,
    title: 'Match Invitation',
    body: `You've been invited to play in ${matchDetails.teamName}`,
    type: 'match_invite',
    data: {
      matchId: matchDetails.matchId,
      teamId: matchDetails.teamId,
      date: matchDetails.date
    }
  });
}
```

### Example 2: Tournament Update
```javascript
export async function notifyTournamentUpdate(tournamentId, updateType) {
  const tournament = await Tournament.findById(tournamentId)
    .populate('participants');
  
  const notifications = tournament.participants.map(participant => 
    createAndSendNotification({
      userId: participant._id,
      fcmToken: participant.fcmToken,
      title: 'Tournament Update',
      body: `Tournament ${tournament.name} has been ${updateType}`,
      type: 'tournament_update',
      data: {
        tournamentId: tournament._id,
        updateType,
        tournamentName: tournament.name
      }
    })
  );
  
  await Promise.all(notifications);
}
```

### Example 3: Team Message Notification
```javascript
export async function notifyTeamMessage(teamId, senderId, message) {
  const team = await Team.findById(teamId).populate('players');
  const sender = await User.findById(senderId);
  
  const notifications = team.players
    .filter(player => player._id.toString() !== senderId)
    .map(player => 
      createAndSendNotification({
        userId: player._id,
        fcmToken: player.fcmToken,
        title: `New message from ${sender.name}`,
        body: message.content.substring(0, 100) + '...',
        type: 'team_message',
        data: {
          teamId,
          senderId,
          messageId: message._id,
          senderName: sender.name
        }
      })
    );
  
  await Promise.all(notifications);
}
```

### Example 4: League Announcement
```javascript
export async function broadcastLeagueAnnouncement(leagueId, announcement) {
  const league = await League.findById(leagueId).populate({
    path: 'teams',
    populate: { path: 'players' }
  });
  
  const allPlayers = league.teams.flatMap(team => team.players);
  
  const notifications = allPlayers.map(player =>
    createAndSendNotification({
      userId: player._id,
      fcmToken: player.fcmToken,
      title: `League Announcement: ${league.title}`,
      body: announcement.title,
      type: 'league_announcement',
      data: {
        leagueId,
        announcementId: announcement._id,
        leagueName: league.title
      }
    })
  );
  
  await Promise.all(notifications);
}
```

### Example 5: Payment Confirmation
```javascript
export async function notifyPaymentSuccess(orderId) {
  const order = await Order.findById(orderId).populate('user');
  
  await createAndSendNotification({
    userId: order.user._id,
    fcmToken: order.user.fcmToken,
    title: 'Payment Successful',
    body: `Your payment of £${order.amount} has been processed`,
    type: 'payment_success',
    data: {
      orderId: order._id,
      amount: order.amount,
      paymentMethod: order.paymentMethod
    }
  });
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Required Fields** | Checks userId, title, body, type | Function throws if missing |
| **FCM Token** | Optional; push skipped if missing | No error; database record created |
| **Data Types** | Accepts any object for data parameter | Automatic string conversion for FCM |
| **Database Connection** | Assumes MongoDB availability | Throws connection errors |

---

## Response Examples

### Successful Notification Creation
```javascript
const notification = await createAndSendNotification({
  userId: 'user123',
  fcmToken: 'fcm_token_here',
  title: 'Match Started',
  body: 'Your match is now in progress',
  type: 'match_start',
  data: { matchId: 'match456' }
});

// Response: Notification document with _id, timestamps, etc.
```

### FCM Delivery Response
```javascript
// FCM send response (handled internally)
{
  name: 'projects/futy-d1fc9/messages/123456789'
}
```

### Database Notification Record
```javascript
{
  _id: ObjectId('...'),
  userId: 'user123',
  title: 'Match Started',
  body: 'Your match is now in progress',
  type: 'match_start',
  data: { matchId: 'match456' },
  createdAt: ISODate('2023-12-01T10:00:00Z'),
  read: false
}
```

---

## Error Handling

### Current State
**Partial Error Handling:** Database operations throw errors, FCM failures are logged but don't prevent function completion.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **FCM Token Invalid** | Expired or invalid token | Push delivery fails | **Update user FCM tokens** |
| **FCM Quota Exceeded** | API rate limits hit | Push delivery fails | **Implement retry logic** |
| **Database Failure** | MongoDB unavailable | Notification not stored | **Add transaction support** |
| **Network Issues** | FCM unreachable | Push delivery fails | **Queue for later retry** |

### Recommended Error Handling Pattern
```javascript
export async function createAndSendNotification({
  userId,
  fcmToken,
  title,
  body,
  type,
  data = {},
}) {
  try {
    // Create database record
    const notif = await Notification.create({
      userId,
      title,
      body,
      type,
      data,
    });

    // Attempt FCM delivery
    if (fcmToken) {
      try {
        await admin.messaging().send({
          token: fcmToken,
          notification: { title, body },
          data: Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, String(v)])
          ),
        });
      } catch (fcmError) {
        console.error('FCM send failed:', fcmError);
        // Don't throw - notification is still created
      }
    }

    return notif;
    
  } catch (error) {
    console.error('Notification creation failed:', error);
    throw error;
  }
}
```

---

## Security Considerations

### 1. **FCM Token Handling**
- **Token Privacy:** FCM tokens stored securely in user records
- **Token Validation:** No validation of token format or validity
- **Token Updates:** Application responsible for token refresh

### 2. **Data Sanitization**
- **Input Validation:** No sanitization of title/body content
- **XSS Prevention:** Content should be sanitized before display
- **Data Serialization:** Custom data converted to strings for FCM

### 3. **Access Control**
- **User Targeting:** Only sends to specified userId
- **Authorization:** No validation that sender can notify recipient
- **Rate Limiting:** No built-in rate limiting for notifications

### 4. **Privacy**
- **Notification Content:** May contain sensitive match/team information
- **Data Exposure:** Custom data sent to user's device
- **Retention Policy:** Notifications stored indefinitely

---

## Important Business Rules

### 1. **Notification Persistence**
- **Rule:** All notifications must be stored in database regardless of push delivery
- **Enforcement:** Database creation happens before FCM attempt
- **Business Impact:** Notification history available even if push fails

### 2. **Optional Push Delivery**
- **Rule:** Push notifications only sent if FCM token available
- **Implication:** Users without tokens still get database records
- **Fallback:** In-app notification system can show database records

### 3. **Data Serialization**
- **Rule:** Custom data must be serializable for FCM transport
- **Enforcement:** Automatic string conversion of all data values
- **Compatibility:** Ensures FCM accepts all data types

### 4. **Independent Operations**
- **Rule:** FCM failure doesn't prevent database storage
- **Reliability:** Notifications always recorded even with delivery issues
- **User Experience:** Users can see notifications in app even if push fails

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **Match Management** | Match invitations, updates, results |
| **Team Communication** | Team messages, announcements |
| **Tournament System** | Registration confirmations, updates |
| **Payment Processing** | Transaction confirmations |
| **League Management** | League announcements, fixtures |

### Common Integration Patterns

```javascript
// Pattern 1: Event-Driven Notifications
export async function handleMatchEvent(matchId, eventType, eventData) {
  const match = await Match.findById(matchId).populate('teamA teamB');
  
  const notifications = [];
  
  // Notify both teams
  for (const team of [match.teamA, match.teamB]) {
    for (const player of team.players) {
      notifications.push(
        createAndSendNotification({
          userId: player._id,
          fcmToken: player.fcmToken,
          title: `Match ${eventType}`,
          body: getEventMessage(eventType, match),
          type: `match_${eventType}`,
          data: { matchId, ...eventData }
        })
      );
    }
  }
  
  await Promise.all(notifications);
}

// Pattern 2: Bulk Notifications
export async function notifyAllUsers(title, body, type, data = {}) {
  const users = await User.find({ fcmToken: { $exists: true } });
  
  const notifications = users.map(user =>
    createAndSendNotification({
      userId: user._id,
      fcmToken: user.fcmToken,
      title,
      body,
      type,
      data
    })
  );
  
  return await Promise.all(notifications);
}

// Pattern 3: User Preference Filtering
export async function sendCategorizedNotification(userId, category, notification) {
  const user = await User.findById(userId);
  
  // Check user preferences
  if (user.notificationPreferences?.[category] === false) {
    return; // User disabled this category
  }
  
  await createAndSendNotification({
    userId,
    fcmToken: user.fcmToken,
    ...notification
  });
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Database Operation** | ~10-50ms | Notification creation |
| **FCM Delivery** | ~100-500ms | Firebase network latency |
| **Total Operation** | ~50-300ms | End-to-end notification |
| **Concurrent Operations** | High | Independent per notification |

---

## FCM Configuration

### Message Payload Structure

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `token` | `string` | FCM registration token | Yes |
| `notification` | `object` | Visible notification content | No |
| `data` | `object` | Custom key-value data | No |

### Notification Types

| Type | Purpose | Example Usage |
|------|---------|---------------|
| `match_invite` | Match participation invites | Team selection |
| `tournament_update` | Tournament status changes | Registration, results |
| `team_message` | Team communication | Coach announcements |
| `league_announcement` | League-wide notices | Fixture changes |
| `payment_success` | Transaction confirmations | Order completions |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial notification system with FCM integration |

---

## Future Enhancements

- [ ] Add notification preferences and filtering
- [ ] Implement notification queuing for failed deliveries
- [ ] Add support for scheduled notifications
- [ ] Implement notification templates
- [ ] Add notification analytics and tracking
- [ ] Support for rich media notifications
- [ ] Add notification batching for bulk operations
- [ ] Implement notification expiration and cleanup

---

## Related Modules

- `@/lib/firebaseAdmin.js` - Firebase Admin SDK for FCM
- `@/lib/models/Notification.js` - Notification data persistence
- `@/lib/models/User.js` - User FCM token storage

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
