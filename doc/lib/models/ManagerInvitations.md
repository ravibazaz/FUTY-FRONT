# ManagerInvitations Model Documentation

## Model Purpose

The `ManagerInvitations` model represents manager invitations in the FUTY application. It tracks invitations sent to managers for team management roles, including invitation codes, manager information, and acceptance status.

**Key Responsibility:** Store manager invitation data with acceptance tracking.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/ManagerInvitations.js` |
| **Collection Name** | `managerinvitations` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users (admin), Teams |
| **Special Features** | Invitation code tracking, acceptance management |

---

## Schema Definition

### Invitation Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `manager_email` | `String` | Yes | Email of the invited manager |
| `manager_name` | `String` | No | Full name of the invited manager |
| `manager_phone` | `String` | No | Phone number of the invited manager |
| `manager_nick_name` | `String` | No | Nickname of the invited manager (trimmed, default: empty) |
| `manager_address` | `String` | No | Address of the invited manager (trimmed, default: empty) |
| `manager_invitation_code` | `String` | No | Unique invitation code (trimmed, default: empty) |
| `accepted_by` | `String` | No | Identifier of who accepted (default: empty) |

### Organizational Relationships

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | `ObjectId` | No | Reference to Users collection (admin sending invitation) |
| `team_id` | `ObjectId` | No | Reference to Teams collection (team to manage) |

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
| **Manager Email** | `manager_email` | Lookup invitations by email |
| **Invitation Code** | `manager_invitation_code` | Lookup invitations by code |
| **Team Invitations** | `team_id` | Find invitations for team |
| **Admin Invitations** | `user_id` | Find invitations sent by admin |
| **Creation Date** | `createdAt` | Sort invitations by date |

---

## Usage Examples

### Example 1: Send Manager Invitation
```javascript
import ManagerInvitation from '@/lib/models/ManagerInvitations';

export async function sendManagerInvitation(invitationData, adminId, teamId) {
  const invitation = new ManagerInvitation({
    user_id: adminId,
    team_id: teamId,
    manager_email: invitationData.email,
    manager_name: invitationData.name,
    manager_phone: invitationData.phone,
    manager_nick_name: invitationData.nickName,
    manager_address: invitationData.address,
    manager_invitation_code: generateInvitationCode()
  });

  return await invitation.save();
}

function generateInvitationCode() {
  return 'MGR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
```

### Example 2: Get Team Invitations
```javascript
export async function getTeamInvitations(teamId) {
  return await ManagerInvitation.find({ team_id: teamId })
    .populate('user_id', 'name email')
    .sort({ createdAt: -1 });
}
```

### Example 3: Accept Manager Invitation
```javascript
export async function acceptManagerInvitation(invitationCode, managerId) {
  return await ManagerInvitation.findOneAndUpdate(
    { manager_invitation_code: invitationCode },
    {
      accepted_by: managerId
    },
    { new: true }
  );
}
```

### Example 4: Check Invitation Status
```javascript
export async function checkInvitationStatus(email) {
  const invitation = await ManagerInvitation.findOne({ manager_email: email });

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
export async function getInvitationStats(teamId) {
  const invitations = await ManagerInvitation.find({ team_id: teamId });

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

### 1. **Manager Invitation**
- **Rule:** Invitations are sent to managers for team roles
- **Required Field:** Manager email
- **Purpose:** Enable manager recruitment

### 2. **Unique Invitation Codes**
- **Rule:** Each invitation has a unique code
- **Format:** Combination of timestamp and random string
- **Purpose:** Secure invitation tracking and acceptance

### 3. **Team Association**
- **Rule:** Invitations link to specific teams
- **Reference:** `team_id` field
- **Purpose:** Assign managers to teams

### 4. **Acceptance Tracking**
- **Rule:** Track who accepted invitations
- **Field:** `accepted_by` for acceptor identifier
- **Purpose:** Monitor invitation conversion

### 5. **Manager Information**
- **Rule:** Collect comprehensive manager data
- **Fields:** Email, name, phone, nickname, address
- **Purpose:** Build manager profiles

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Email Lookups** | String matching | Add index on email |
| **Code Lookups** | String matching | Add index on invitation code |
| **Team Queries** | Reference queries | Ensure team index optimization |
| **Bulk Operations** | Individual operations | Implement batch invitation |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial manager invitations model |

---

## Future Enhancements

- [ ] Add invitation expiration
- [ ] Implement email notification system
- [ ] Add invitation templates
- [ ] Support for bulk invitations
- [ ] Add invitation resend functionality
- [ ] Implement invitation tracking
- [ ] Add manager qualification validation

---

## Related Models

- **Users Model:** Admin and manager information
- **Teams Model:** Team association for managers

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
