# DeleteLeagueButton Component Documentation

## Component Purpose

The `DeleteLeagueButton` component provides a delete button for leagues with confirmation dialog. It wraps the delete action in a form and shows a browser confirmation dialog before proceeding with the deletion.

**Key Responsibility:** Handle league deletion with user confirmation.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/DeleteLeagueButton.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with server actions |
| **Props** | `onDelete` (server action function) |
| **Dependencies** | None |
| **Client-side Only** | Yes (`"use client"`) |
| **Styling** | Bootstrap CSS classes |

---

## Key Features

- Browser confirmation dialog before deletion
- Form submission with server action
- Bootstrap danger button styling
- Prevents accidental deletions
- Small button size for table actions

---

## Component Structure

```jsx
'use client';

export default function DeleteLeagueButton({ onDelete }) {
  const handleDelete = (e) => {
    if (!confirm('Are you sure you want to delete this league?')) {
      e.preventDefault(); // Cancel submission
    }
  };

  return (
    <form action={onDelete} onSubmit={handleDelete}>
      <button
        type="submit"
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    </form>
  );
}
```

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onDelete` | Function | Yes | Server action function for deleting the league |

---

## Confirmation Flow

### 1. Form Submission

```jsx
<form action={onDelete} onSubmit={handleDelete}>
```

- Uses HTML form with `action` attribute for server action
- `onSubmit` handler for confirmation logic

### 2. Confirmation Dialog

```jsx
const handleDelete = (e) => {
  if (!confirm('Are you sure you want to delete this league?')) {
    e.preventDefault(); // Cancel submission
  }
};
```

- Browser's native `confirm()` dialog
- Message: "Are you sure you want to delete this league?"
- `e.preventDefault()` cancels form submission if user cancels

### 3. Server Action Execution

- If confirmed, form submits to `onDelete` server action
- Server action handles actual deletion logic
- Component doesn't handle success/error states

---

## Rendered Output

```jsx
<form action={onDelete} onSubmit={handleDelete}>
  <button type="submit" className="btn btn-danger btn-sm">
    Delete
  </button>
</form>
```

- **Form:** HTML form element with server action
- **Button:** Bootstrap danger button, small size
- **Text:** "Delete" label

---

## CSS Classes Used

| Class | Purpose |
|-------|---------|
| `btn` | Bootstrap button base class |
| `btn-danger` | Red danger button styling |
| `btn-sm` | Small button size |

---

## Usage Example

### In League Table Row

```jsx
import DeleteLeagueButton from '@/components/DeleteLeagueButton';
import { deleteLeague } from '@/actions/leaguesActions';

export default function LeagueRow({ league }) {
  return (
    <tr>
      <td>{league.title}</td>
      <td>{league.status}</td>
      <td>
        <DeleteLeagueButton
          onDelete={deleteLeague.bind(null, league._id.toString())}
        />
      </td>
    </tr>
  );
}
```

### With Custom Confirmation Message

```jsx
// Note: This component doesn't support custom messages
// For custom confirmation, create a wrapper component

export default function CustomDeleteButton({ league, onDelete }) {
  const handleDelete = (e) => {
    if (!confirm(`Delete league "${league.title}"?`)) {
      e.preventDefault();
    }
  };

  return (
    <form action={onDelete} onSubmit={handleDelete}>
      <button type="submit" className="btn btn-danger btn-sm">
        Delete
      </button>
    </form>
  );
}
```

---

## Behavior Notes

- Clicking "Delete" shows browser confirmation dialog
- Canceling confirmation keeps user on page
- Confirming proceeds with form submission
- No loading states or success feedback
- Relies on server action for actual deletion

---

## Browser Confirmation Dialog

- **Native Dialog:** Uses browser's built-in `confirm()` function
- **Blocking:** Dialog blocks UI until user responds
- **Message:** "Are you sure you want to delete this league?"
- **Options:** OK (confirm) / Cancel (abort)
- **Styling:** Browser-dependent, cannot be customized

---

## Server Action Integration

```jsx
import { deleteLeague } from "@/actions/leaguesActions";

// Usage
<DeleteLeagueButton onDelete={deleteLeague.bind(null, leagueId)} />
```

- Expects server action as `onDelete` prop
- Server action should handle deletion logic
- Component passes form data to server action

---

## Known Issues / Considerations

1. **Browser Dialog:** Cannot be styled or customized
2. **Accessibility:** Native confirm dialog may not be fully accessible
3. **Mobile Experience:** Dialog behavior varies on mobile devices
4. **No Feedback:** No loading or success states
5. **Form Submission:** Relies on server action error handling

---

## Security Notes

- Confirmation prevents accidental deletions
- Server action should validate permissions
- No direct database access in component
- Form submission follows Next.js security patterns

---

## Future Enhancements

- [ ] Replace native confirm with custom modal dialog
- [ ] Add loading spinner during deletion
- [ ] Show success/error toast notifications
- [ ] Add keyboard shortcut support (Delete key)
- [ ] Implement bulk delete confirmation
- [ ] Add undo functionality after deletion
- [ ] Support for soft delete vs hard delete
- [ ] Add deletion reason logging
- [ ] Implement progressive enhancement

---

## Testing Recommendations

- Test confirmation dialog appears on click
- Test canceling confirmation prevents deletion
- Test confirming proceeds with deletion
- Verify server action receives correct data
- Test component in table row context
- Check Bootstrap styling on different screen sizes
- Test accessibility with keyboard navigation
- Verify behavior on mobile devices

---

## Support & Maintenance

- Ensure server action `deleteLeague` exists and works
- Test confirmation dialog on different browsers
- Monitor user feedback on confirmation UX
- Consider replacing with custom modal for better UX
- Update confirmation message if needed
- Test component integration with table layouts
- Verify Bootstrap version compatibility
