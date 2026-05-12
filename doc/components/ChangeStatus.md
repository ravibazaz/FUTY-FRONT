# ChangeStatus Component Documentation

## Component Purpose

The `ChangeStatus` component is a reusable React toggle switch that allows administrators to change a user's active/inactive status. It provides immediate visual feedback and makes API calls to update the status on the server.

**Key Responsibility:** Render a toggle switch for user status management with real-time API updates.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/ChangeStatus.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `userdetails` (boolean), `id` (string/number) |
| **Dependencies** | `useState` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/change-status` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `userdetails` | `Boolean` | Yes | Initial active status of the user (true = active, false = inactive) |
| `id` | `String \| Number` | Yes | Unique identifier of the user whose status is being changed |

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `checked` | `Boolean` | `userdetails` | Current checked state of the toggle switch |
| `status` | `String` | `userdetails ? 'Active' : 'Inactive'` | Display text showing current status |

---

## Key Features

- Toggle switch UI for status changes
- Immediate visual feedback with status text
- Asynchronous API call to update status on server
- Optimistic UI updates (updates UI immediately)
- Error handling for API failures
- Bootstrap/custom toggle switch styling

---

## Component Structure

```jsx
export default function ChangeStatus({ userdetails, id }) {
  // State management
  // Status change handler

  return (
    <div className="toggle-switch-cont">
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={...} />
        <span className="switch round"></span>
      </label>
      <span className="switch-label-text fs-12">{status}</span>
    </div>
  );
}
```

---

## Methods & Handlers

### changeStatus(isChecked)

```javascript
const changeStatus = async (isChecked) => {
  setChecked(isChecked);
  const res = await fetch(`/api/change-status?id=${id}&isActive=${isChecked}`);
  const { msg } = await res.json();

  if (msg) {
    setStatus(isChecked ? 'Active' : 'Inactive');
  }
};
```

**Purpose:** Handles toggle switch changes by updating both local state and server state.

**Behavior:**
- Immediately updates local `checked` state (optimistic update)
- Makes API call to `/api/change-status` with user ID and new status
- Updates `status` text based on API response
- If API fails, the UI shows the optimistic change but status text may not update

**Parameters:**
- `isChecked` (boolean): New checked state from the toggle switch

---

## Rendering Logic

### Toggle Switch

```jsx
<label className="toggle-switch">
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => changeStatus(e.target.checked)}
  />
  <span className="switch round"></span>
</label>
```

**Features:**
- Standard checkbox input styled as a toggle switch
- Controlled component using `checked` prop
- `onChange` handler triggers status update

### Status Label

```jsx
<span className="switch-label-text fs-12">{status}</span>
```

**Behavior:** Displays "Active" or "Inactive" text next to the toggle switch.

---

## Styling & Layout

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.toggle-switch-cont` | Container for the entire toggle switch component |
| `.toggle-switch` | Label wrapper for the toggle switch styling |
| `.switch` | Toggle switch track styling |
| `.round` | Round toggle switch slider styling |
| `.switch-label-text` | Status text styling |
| `.fs-12` | Font size utility class (12px) |

### Layout Structure

```
├─ toggle-switch-cont (container)
│  ├─ toggle-switch (label)
│  │  ├─ input[type="checkbox"] (hidden)
│  │  └─ switch round (visual toggle)
│  └─ switch-label-text (status text)
```

---

## API Integration

### Change Status Endpoint

**URL:** `/api/change-status`  
**Method:** `GET` (Note: Should ideally be POST/PUT for status changes)  
**Query Parameters:**
- `id`: User ID (string/number)
- `isActive`: New status (boolean as string)

**Response Format:**

```json
{
  "msg": "Status updated successfully"
}
```

**Error Handling:** 
- API errors are not explicitly handled
- Component assumes success if `msg` is present in response
- No rollback of optimistic updates on failure

---

## Usage Example

### Basic Usage

```jsx
import ChangeStatus from '@/components/ChangeStatus';

export default function UserList({ users }) {
  return (
    <table>
      {users.map(user => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>
            <ChangeStatus 
              userdetails={user.isActive} 
              id={user.id} 
            />
          </td>
        </tr>
      ))}
    </table>
  );
}
```

### In Admin Panel

```jsx
import ChangeStatus from '@/components/ChangeStatus';

export default function AdminUserRow({ user }) {
  return (
    <div className="user-row">
      <span>{user.name}</span>
      <ChangeStatus userdetails={user.active} id={user._id} />
    </div>
  );
}
```

---

## Behavior Notes

- Component uses optimistic updates - UI changes immediately when toggled
- API call happens asynchronously after UI update
- Status text only updates after successful API response
- If API fails, toggle remains in new position but status text may not change
- Component is self-contained and doesn't communicate changes to parent components

---

## Known Issues / Considerations

1. **HTTP Method:** Uses GET for status changes (should be POST/PUT for data modification)

2. **Error Handling:** No explicit error handling or user feedback for API failures

3. **Optimistic Updates:** UI updates immediately but doesn't rollback on API failure

4. **No Loading State:** No visual indication during API call

5. **Accessibility:** May need additional ARIA attributes for screen readers

6. **Query Parameters:** Passing boolean as query parameter may have encoding issues

---

## Accessibility Considerations

- Checkbox input is properly labeled through the toggle switch styling
- Consider adding `aria-label` or `aria-labelledby` for better screen reader support
- Keyboard navigation should work with standard checkbox behavior
- Status text provides clear indication of current state

---

## Future Enhancements

- [ ] Change API method from GET to POST/PUT
- [ ] Add error handling and user feedback for API failures
- [ ] Add loading spinner during API call
- [ ] Implement rollback on API failure
- [ ] Add success/error toast notifications
- [ ] Add ARIA attributes for better accessibility
- [ ] Add confirmation dialog for status changes
- [ ] Add audit logging for status changes

---

## Support & Maintenance

- Verify that `/api/change-status` endpoint accepts the expected parameters
- Ensure the API returns the expected response format with `msg` field
- Monitor for API failures that don't provide user feedback
- Consider implementing proper error handling and rollback mechanisms
- Test accessibility with screen readers and keyboard navigation
