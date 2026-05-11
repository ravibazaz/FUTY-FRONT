# FanInvitations Model Documentation

## Model Purpose

The `FanInvitations` model manages fan invitations sent by managers in the FUTY application. It tracks invitation details, fan information, invitation codes, and acceptance status for fan recruitment and relationship management.

**Key Responsibility:** Store and track fan invitations with manager relationships and acceptance status.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/FanInvitations.js` |
| **Collection Name** | `faninvitations` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (manager) |
| **Special Features** | Invitation code tracking, acceptance management |

---

## Schema Definition

### Invitation Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `manager_id` | `ObjectId` | Yes | Reference to Users collection (manager sending invitation) |
| `fan_email` | `String` | Yes | Email address of the invited fan |
| `fan_name` | `String` | No | Full name of the invited fan |
| `fan_phone` | `String` | No | Phone number of the invited fan |
| `fan_nick_name` | `String` | No | Nickname of the invited fan (trimmed, default: empty) |
| `fan_address` | `String` | No | Address of the invited fan (trimmed, default: empty) |
| `fan_invitation_code` | `String` | No | Unique invitation code for tracking (trimmed, default: empty) |
| `accepted_by` | `String` | No | Identifier of who accepted the invitation (default: empty) |
| `createdAt` | `Date` | No | Invitation creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Manager Invitations** | `manager_id` | Find all invitations sent by a manager |
| **Fan Email** | `fan_email` | Check if fan email already invited |
| **Invitation Code** | `fan_invitation_code` | Lookup invitations by code |
| **Acceptance Status** | `accepted_by` | Find accepted/rejected invitations |
| **Creation Time** | `createdAt` | Sort invitations by creation date |

---

## Usage Examples

### Example 1: Send Fan Invitation
```javascript
import FanInvitation from '@/lib/models/FanInvitations';

export async function sendFanInvitation(managerId, fanData) {
  const invitation = new FanInvitation({
    manager_id: managerId,
    fan_email: fanData.email,
    fan_name: fanData.name,
    fan_phone: fanData.phone,
    fan_nick_name: fanData.nickName,
    fan_address: fanData.address,
    fan_invitation_code: generateInvitationCode()
  });

  return await invitation.save();
}

function generateInvitationCode() {
  return 'FAN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
```

### Example 2: Get Manager Invitations
```javascript
export async function getManagerInvitations(managerId) {
  return await FanInvitation.find({ manager_id: managerId })
    .populate('manager_id', 'name email')
    .sort({ createdAt: -1 });
}
```

### Example 3: Accept Invitation
```javascript
export async function acceptInvitation(invitationCode, userId) {
  return await FanInvitation.findOneAndUpdate(
    { fan_invitation_code: invitationCode },
    {
      accepted_by: userId,
      updatedAt: new Date()
    },
    { new: true }
  );
}
```

### Example 4: Check Invitation Status
```javascript
export async function checkInvitationStatus(email) {
  const invitation = await FanInvitation.findOne({ fan_email: email });

  if (!invitation) {
    return { status: 'not_invited' };
  }

  return {
    status: invitation.accepted_by ? 'accepted' : 'pending',
    invitation: invitation
  };
}
```

### Example 5: Invitation Statistics
```javascript
export async function getInvitationStats(managerId) {
  const invitations = await FanInvitation.find({ manager_id: managerId });

  const total = invitations.length;
  const accepted = invitations.filter(inv => inv.accepted_by).length;
  const pending = total - accepted;

  const recentInvitations = invitations.filter(inv =>
    (Date.now() - inv.createdAt.getTime()) < (30 * 24 * 60 * 60 * 1000) // Last 30 days
  ).length;

  return {
    total,
    accepted,
    pending,
    acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
    recentInvitations
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Email Required** | Required validation | Validation errors |
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |
| **String Trimming** | Trim middleware | Automatic whitespace removal |
| **Date Defaults** | Default Date.now() | Automatic timestamp assignment |

---

## Business Rules

### 1. **Manager-Fan Relationship**
- **Rule:** Invitations are sent by managers to potential fans
- **Reference:** `manager_id` links to Users collection
- **Purpose:** Track invitation source and relationship building

### 2. **Unique Invitation Codes**
- **Rule:** Each invitation should have a unique code for tracking
- **Generation:** Combination of timestamp and random string
- **Purpose:** Enable invitation acceptance and verification

### 3. **Acceptance Tracking**
- **Rule:** Track who accepted invitations
- **Field:** `accepted_by` stores acceptor identifier
- **Purpose:** Monitor invitation conversion rates

### 4. **Fan Information Collection**
- **Rule:** Collect comprehensive fan contact information
- **Fields:** Email, name, phone, nickname, address
- **Purpose:** Build fan profiles and contact databases

### 5. **Invitation Lifecycle**
- **Rule:** Invitations have creation and acceptance timestamps
- **Purpose:** Track invitation effectiveness over time

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Email Lookups** | Basic queries | Add unique index on fan_email if needed |
| **Code Lookups** | String matching | Add index on invitation codes |
| **Manager Queries** | Reference queries | Ensure proper indexing on manager_id |
| **Bulk Operations** | Individual operations | Implement batch invitation sending |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial fan invitations model with acceptance tracking |

---

## Future Enhancements

- [ ] Add invitation expiration dates
- [ ] Implement invitation email templates
- [ ] Add invitation resend functionality
- [ ] Support for bulk invitation imports
- [ ] Add invitation analytics and reporting
- [ ] Implement invitation QR codes
- [ ] Add invitation categories/types
- [ ] Support for invitation follow-ups
- [ ] Add invitation source tracking

---

## Related Models

- **Users Model:** Manager information and invitation relationships
- **ManagerRelationShips Model:** Manager-fan relationship management
- **Notification Model:** Invitation-related notifications

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
