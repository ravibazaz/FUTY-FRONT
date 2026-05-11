# PlayerInvitations Model Documentation

## Model Purpose

The `PlayerInvitations` model represents player invitations in the FUTY application. It tracks invitations sent to players for team membership, including invitation codes, player information, and acceptance status for player recruitment management.

**Key Responsibility:** Store player invitation data with acceptance tracking.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/PlayerInvitations.js` |
| **Collection Name** | `playerinvitations` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (managers) |
| **Special Features** | Invitation code tracking, acceptance management |

---

## Schema Definition

### Invitation Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `player_email` | `String` | Yes | Email of the invited player |
| `player_name` | `String` | No | Full name of the invited player |
| `player_phone` | `String` | No | Phone number of the invited player |
| `player_nick_name` | `String` | No | Nickname of the invited player (trimmed, default: empty) |
| `player_address` | `String` | No | Address of the invited player (trimmed, default: empty) |
| `player_invitation_code` | `String` | No | Unique invitation code (trimmed, default: empty) |
| `accepted_by` | `String` | No | Identifier of who accepted (default: empty) |

### Organizational Relationships

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `manager_id` | `ObjectId` | No | Reference to User collection (inviting manager) |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
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
| **Player Email** | `player_email` | Lookup invitations by email |
| **Invitation Code** | `player_invitation_code` | Lookup invitations by code |
| **Manager Invitations** | `manager_id` | Find invitations sent by manager |
| **Creation Date** | `createdAt` | Sort invitations by date |

---

## Usage Examples

### Example 1: Send Player Invitation
```javascript
import PlayerInvitation from '@/lib/models/PlayerInvitations';

export async function sendPlayerInvitation(invitationData, managerId) {
  const invitation = new PlayerInvitation({
    manager_id: managerId,
    player_email: invitationData.email,
    player_name: invitationData.name,
    player_phone: invitationData.phone,
    player_nick_name: invitationData.nickName,
    player_address: invitationData.address,
    player_invitation_code: generateInvitationCode()
  });

  return await invitation.save();
}

function generateInvitationCode() {
  return 'PLY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
```

### Example 2: Get Manager's Invitations
```javascript
export async function getManagerInvitations(managerId) {
  return await PlayerInvitation.find({ manager_id: managerId })
    .sort({ createdAt: -1 });
}
```

### Example 3: Accept Player Invitation
```javascript
export async function acceptPlayerInvitation(invitationCode, playerId) {
  return await PlayerInvitation.findOneAndUpdate(
    { player_invitation_code: invitationCode },
    {
      accepted_by: playerId
    },
    { new: true }
  );
}
```

### Example 4: Check Invitation Status
```javascript
export async function checkInvitationStatus(email) {
  const invitation = await PlayerInvitation.findOne({ player_email: email });

  if (!invitation) {
    return { status: 'not_invited' };
  }

  return {
    status: invitation.accepted_by ? 'accepted' : 'pending',
    invitation
  };
}
```

### Example 5: Invitation Statistics
```javascript
export async function getInvitationStats(managerId) {
  const invitations = await PlayerInvitation.find({ manager_id: managerId });

  const total = invitations.length;
  const accepted = invitations.filter(inv => inv.accepted_by).length;
  const pending = total - accepted;

  return {
    total,
    accepted,
    pending,
    acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0
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

### 1. **Player Invitation**
- **Rule:** Invitations are sent to players for team roles
- **Required Field:** Player email
- **Purpose:** Enable player recruitment

### 2. **Unique Invitation Codes**
- **Rule:** Each invitation has a unique code
- **Format:** Combination of timestamp and random string
- **Purpose:** Secure invitation tracking and acceptance

### 3. **Manager Association**
- **Rule:** Invitations link to inviting managers
- **Reference:** `manager_id` field
- **Purpose:** Track invitation source

### 4. **Acceptance Tracking**
- **Rule:** Track who accepted invitations
- **Field:** `accepted_by` for acceptor identifier
- **Purpose:** Monitor invitation conversion

### 5. **Player Information**
- **Rule:** Collect comprehensive player data
- **Fields:** Email, name, phone, nickname, address
- **Purpose:** Build player profiles

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Email Lookups** | String matching | Add index on email |
| **Code Lookups** | String matching | Add index on invitation code |
| **Manager Queries** | Reference queries | Ensure manager index optimization |
| **Bulk Operations** | Individual operations | Implement batch invitation |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial player invitations model |

---

## Future Enhancements

- [ ] Add invitation expiration
- [ ] Implement email notification system
- [ ] Add invitation templates
- [ ] Support for bulk invitations
- [ ] Add invitation resend functionality
- [ ] Implement invitation tracking
- [ ] Add player qualification validation

---

## Related Models

- **Users Model:** Manager and player information

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
