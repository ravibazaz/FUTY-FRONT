# TournamentAccepted Model Documentation

## Model Purpose

The `TournamentAccepted` model represents tournament acceptance records in the FUTY application. It tracks users who have accepted invitations to participate in tournaments, including contact information and acceptance details for tournament management.

**Key Responsibility:** Store tournament participation acceptance records.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/TournamentAccepted.js` |
| **Collection Name** | `tournamentaccepted` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Users, Tournaments |
| **Special Features** | Acceptance tracking, contact information |

---

## Schema Definition

### Contact Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `String` | No | Contact email (default: empty) |
| `contact` | `String` | No | Contact information (default: empty) |
| `notes` | `String` | No | Additional notes (default: empty) |

### Tournament Relationships

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accepted_by_user` | `ObjectId` | No | Reference to User collection (accepting user) |
| `tournament_id` | `ObjectId` | No | Reference to Tournaments collection |
| `accepted_by` | `String` | No | Acceptance identifier (default: empty) |

### Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `createdAt` | `Date` | No | Acceptance creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Tournament Acceptances** | `tournament_id` | Find acceptances for tournament |
| **User Acceptances** | `accepted_by_user` | Find tournaments accepted by user |
| **Acceptance Date** | `createdAt` | Sort acceptances by date |

---

## Usage Examples

### Example 1: Accept Tournament Invitation
```javascript
import TournamentAccepted from '@/lib/models/TournamentAccepted';

export async function acceptTournamentInvitation(acceptanceData) {
  const acceptance = new TournamentAccepted({
    email: acceptanceData.email,
    contact: acceptanceData.contact,
    notes: acceptanceData.notes,
    accepted_by_user: acceptanceData.userId,
    tournament_id: acceptanceData.tournamentId,
    accepted_by: acceptanceData.acceptedBy
  });

  return await acceptance.save();
}
```

### Example 2: Get Tournament Participants
```javascript
export async function getTournamentParticipants(tournamentId) {
  return await TournamentAccepted.find({ tournament_id: tournamentId })
    .populate('accepted_by_user', 'name email telephone')
    .sort({ createdAt: -1 });
}
```

### Example 3: Get User's Tournament Acceptances
```javascript
export async function getUserTournamentAcceptances(userId) {
  return await TournamentAccepted.find({ accepted_by_user: userId })
    .populate('tournament_id', 'title startDate endDate')
    .sort({ createdAt: -1 });
}
```

### Example 4: Check Tournament Acceptance
```javascript
export async function checkTournamentAcceptance(userId, tournamentId) {
  const acceptance = await TournamentAccepted.findOne({
    accepted_by_user: userId,
    tournament_id: tournamentId
  });

  return {
    accepted: !!acceptance,
    acceptance
  };
}
```

### Example 5: Tournament Acceptance Statistics
```javascript
export async function getTournamentAcceptanceStats(tournamentId) {
  const acceptances = await TournamentAccepted.find({ tournament_id: tournamentId });

  return {
    totalAcceptances: acceptances.length,
    uniqueParticipants: new Set(acceptances.map(a => a.accepted_by_user.toString())).size,
    acceptances
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **ObjectId Format** | Mongoose ObjectId validation | Automatic validation |
| **String Defaults** | Default empty strings | Automatic default assignment |
| **Date Defaults** | Default Date.now() | Automatic timestamp assignment |

---

## Business Rules

### 1. **Tournament Participation**
- **Rule:** Track users who accept tournament invitations
- **References:** tournament_id and accepted_by_user
- **Purpose:** Manage tournament registrations

### 2. **Contact Information**
- **Rule:** Store participant contact details
- **Fields:** Email, contact, notes
- **Purpose:** Communication and coordination

### 3. **Acceptance Tracking**
- **Rule:** Record acceptance identifiers
- **Field:** accepted_by for tracking
- **Purpose:** Audit trail of acceptances

### 4. **Unique Participation**
- **Rule:** Users can accept multiple tournaments
- **Structure:** One record per user-tournament combination
- **Purpose:** Flexible tournament participation

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Tournament Queries** | Reference lookups | Add tournament_id index |
| **User Queries** | Reference lookups | Add accepted_by_user index |
| **Duplicate Prevention** | Application logic | Implement unique constraints |
| **Bulk Operations** | Individual operations | Batch acceptance processing |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial tournament acceptance model |

---

## Future Enhancements

- [ ] Add acceptance status (confirmed/pending/cancelled)
- [ ] Implement acceptance deadlines
- [ ] Add payment confirmation
- [ ] Support for team acceptances
- [ ] Add acceptance notifications
- [ ] Implement waitlist functionality
- [ ] Add acceptance withdrawal

---

## Related Models

- **Users Model:** Participant information
- **Tournaments Model:** Tournament details

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
