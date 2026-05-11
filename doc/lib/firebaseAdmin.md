# Firebase Admin Module Documentation

## Module Purpose

The `firebaseAdmin` module initializes and exports a Firebase Admin SDK instance for the FUTY application. It provides server-side access to Firebase services including Cloud Messaging (FCM) for push notifications, Authentication, and Firestore.

**Key Responsibility:** Configure and provide Firebase Admin SDK instance with service account credentials for server-side Firebase operations.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/firebaseAdmin.js` |
| **Type** | Firebase Admin SDK Configuration |
| **Dependencies** | `firebase-admin` |
| **Exports** | `admin` (Firebase Admin instance) |
| **Usage Pattern** | Singleton Firebase Admin SDK instance |

---

## Architecture

### Initialization Strategy

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Singleton Pattern** | Global admin instance | Prevents multiple initializations |
| **Service Account Auth** | JSON credentials file | Secure server authentication |
| **Lazy Initialization** | Checks `admin.apps.length` | Avoids duplicate app initialization |
| **Default App** | No app name specified | Uses Firebase default app |

### Security Model

- **Service Account:** Uses dedicated service account credentials
- **Server-Only:** Admin SDK for server-side operations only
- **Full Access:** Administrative privileges for Firebase services
- **Credential Isolation:** Credentials stored in separate JSON file

---

## API Reference

### Exported Instance

| Export | Type | Description |
|--------|------|-------------|
| `admin` | `FirebaseAdmin` | Initialized Firebase Admin SDK instance |

### Available Services

| Service | Access Pattern | Purpose |
|---------|----------------|---------|
| **Messaging** | `admin.messaging()` | Push notifications (FCM) |
| **Auth** | `admin.auth()` | User authentication management |
| **Firestore** | `admin.firestore()` | NoSQL database operations |
| **Storage** | `admin.storage()` | File storage operations |

---

## Configuration

### Service Account File

**Location:** `@/futy-d1fc9-firebase-adminsdk-fbsvc-f64b92cf17.json`

**Required Fields:**
```json
{
  "type": "service_account",
  "project_id": "futy-d1fc9",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "...@futy-d1fc9.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### Initialization Options

| Option | Value | Description |
|--------|-------|-------------|
| **App Check** | `admin.apps.length` | Prevents duplicate initialization |
| **Credentials** | Service account JSON | Authentication method |
| **Project** | `futy-d1fc9` | Firebase project identifier |

---

## Usage Examples

### Example 1: Push Notifications
```javascript
import admin from '@/lib/firebaseAdmin';

export async function sendPushNotification(token, title, body) {
  try {
    const message = {
      token,
      notification: { title, body },
      data: { customKey: 'customValue' }
    };
    
    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
    
  } catch (error) {
    console.error('Push notification failed:', error);
  }
}
```

### Example 2: User Authentication
```javascript
import admin from '@/lib/firebaseAdmin';

export async function verifyFirebaseToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
    
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
```

### Example 3: Firestore Operations
```javascript
import admin from '@/lib/firebaseAdmin';

export async function getUserData(userId) {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      return null;
    }
    
  } catch (error) {
    console.error('Firestore operation failed:', error);
  }
}
```

### Example 4: File Storage
```javascript
import admin from '@/lib/firebaseAdmin';

export async function uploadFile(fileBuffer, fileName) {
  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileName);
    
    await file.save(fileBuffer, {
      metadata: { contentType: 'image/jpeg' },
      public: true
    });
    
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
  } catch (error) {
    console.error('File upload failed:', error);
  }
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **App Initialization** | Checks existing apps before init | Skips if already initialized |
| **Service Account** | Validates JSON credential file | Firebase initialization error |
| **Environment** | Works in server environments only | Client-side usage errors |
| **Permissions** | Service account must have required scopes | Firebase permission errors |

---

## Response Examples

### Successful Initialization
```javascript
import admin from '@/lib/firebaseAdmin';
// admin is now ready to use
console.log(admin.app.name); // '[DEFAULT]'
```

### Messaging Response
```javascript
const response = await admin.messaging().send(message);
// Response: "projects/futy-d1fc9/messages/123456789"
```

### Authentication Response
```javascript
const decodedToken = await admin.auth().verifyIdToken(token);
// Response: { uid: 'user123', email: 'user@example.com', ... }
```

---

## Error Handling

### Current State
**Firebase Error Handling:** Relies on Firebase Admin SDK's built-in error handling and throws specific Firebase errors.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **Credential File Missing** | JSON file not found | Initialization failure | **Validate file existence** |
| **Invalid Credentials** | Wrong service account | Authentication failure | **Check credential format** |
| **Network Issues** | Firebase unreachable | Service unavailability | **Implement retry logic** |
| **Permission Denied** | Insufficient service account permissions | Operation failure | **Review IAM roles** |

### Recommended Error Handling Pattern
```javascript
import admin from '@/lib/firebaseAdmin';

export async function safeFirebaseOperation(operation) {
  try {
    return await operation(admin);
  } catch (error) {
    console.error('Firebase operation failed:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'messaging/invalid-registration-token') {
      // Handle invalid FCM token
    } else if (error.code === 'auth/id-token-expired') {
      // Handle expired token
    }
    
    throw error;
  }
}
```

---

## Security Considerations

### 1. **Service Account Security**
- **Credential Storage:** Service account JSON stored securely
- **Access Control:** Service account has minimal required permissions
- **Key Rotation:** Regular rotation of service account keys
- **Environment Isolation:** Different credentials for different environments

### 2. **Server-Side Only**
- **No Client Exposure:** Admin SDK never exposed to client-side code
- **Server Authorization:** All operations authorized server-side
- **Token Validation:** Client tokens verified before use

### 3. **Data Protection**
- **Encryption:** All Firebase communications use TLS
- **Access Logging:** Firebase provides audit logging
- **Data Residency:** Consider data location requirements

### 4. **Rate Limiting**
- **Firebase Quotas:** Respect Firebase API quotas and limits
- **Request Throttling:** Implement client-side rate limiting
- **Error Handling:** Graceful handling of quota exceeded errors

---

## Important Business Rules

### 1. **Singleton Initialization**
- **Rule:** Only one Firebase Admin instance exists per application
- **Enforcement:** `admin.apps.length` check prevents duplicates
- **Business Impact:** Efficient resource usage and consistent configuration

### 2. **Service Account Authentication**
- **Rule:** All Firebase operations use service account credentials
- **Implication:** Administrative access to all Firebase services
- **Security:** Server-side operations with full service access

### 3. **Project Consistency**
- **Rule:** All operations target the `futy-d1fc9` Firebase project
- **Enforcement:** Hardcoded in service account credentials
- **Data Integrity:** Ensures all data belongs to correct project

### 4. **Error Transparency**
- **Rule:** Firebase errors are propagated with full context
- **Implication:** Calling code must handle Firebase-specific errors
- **Debugging:** Detailed error information for troubleshooting

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **Push Notifications** | User alerts and messaging |
| **User Management** | Firebase Auth user operations |
| **Real-time Data** | Firestore database operations |
| **File Storage** | Media upload and serving |
| **Analytics** | Firebase Analytics integration |

### Common Integration Patterns

```javascript
// Pattern 1: Notification System
import admin from '@/lib/firebaseAdmin';
import { createAndSendNotification } from '@/lib/notify';

export async function notifyUser(userId, notificationData) {
  const user = await User.findById(userId);
  if (user.fcmToken) {
    await createAndSendNotification({
      userId,
      fcmToken: user.fcmToken,
      ...notificationData
    });
  }
}

// Pattern 2: Auth Integration
export async function linkFirebaseAccount(userId, firebaseUid) {
  // Link local user with Firebase user
  await User.findByIdAndUpdate(userId, { firebaseUid });
}

// Pattern 3: Storage Integration
export async function saveUserAvatar(userId, imageBuffer) {
  const fileName = `avatars/${userId}.jpg`;
  const url = await uploadFile(imageBuffer, fileName);
  
  await User.findByIdAndUpdate(userId, { avatarUrl: url });
  return url;
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Initialization Time** | ~100-300ms | One-time setup cost |
| **Subsequent Operations** | Varies by service | Firebase API latency |
| **Memory Usage** | Minimal | Singleton instance |
| **Concurrent Operations** | High | Firebase handles concurrency |

---

## Configuration Requirements

### Environment Setup

| Requirement | Description | Criticality |
|-------------|-------------|-------------|
| **Service Account JSON** | Firebase credentials file | **Required** |
| **Project Access** | IAM permissions for service account | **Required** |
| **Network Access** | Outbound HTTPS to Firebase APIs | **Required** |
| **Node.js Version** | Compatible with Firebase Admin SDK | **Required** |

### Firebase Project Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| **Project ID** | `futy-d1fc9` | Unique project identifier |
| **Service Account** | Custom service account | Server authentication |
| **API Keys** | Generated by Firebase | Client-side usage |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial Firebase Admin SDK setup |

---

## Future Enhancements

- [ ] Add Firebase service-specific error handling
- [ ] Implement connection pooling for better performance
- [ ] Add Firebase Analytics integration
- [ ] Support for multiple Firebase projects
- [ ] Add credential validation on startup
- [ ] Implement Firebase Remote Config
- [ ] Add Firebase Cloud Functions integration

---

## Related Modules

- `@/lib/notify` - Push notification sending using this admin instance
- `@/lib/models/Notification` - Notification data persistence
- `@/lib/models/User` - User FCM token storage

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
