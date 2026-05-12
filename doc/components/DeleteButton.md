# DeleteButton Component Documentation

## Component Purpose

The `DeleteButton` component is a reusable React button that triggers a SweetAlert2 confirmation dialog before submitting a delete form. It provides a safe deletion workflow by requiring user confirmation before the action is executed.

**Key Responsibility:** Render a red delete button with confirmation protection for destructive actions.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/DeleteButton.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `id` (string/number) |
| **Dependencies** | `sweetalert2` |
| **Client-side Only** | Yes (`"use client"`) |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `String \| Number` | Yes | Unique identifier used to target the associated delete form (`delete-form-{id}`) |

---

## Key Features

- Non-destructive UI interaction with SweetAlert2 confirmation dialog
- Programmatic form submission using `requestSubmit()`
- Red styling to indicate destructive action
- Customizable warning message and button colors
- Cancel option to prevent accidental deletion

---

## Component Structure

```jsx
export default function DeleteButton({ id }) {
  const handleDelete = async () => {
    // Show SweetAlert2 confirmation dialog
    // If confirmed, submit the delete form
  };

  return (
    <button type="button" onClick={handleDelete} ...>
      Delete
    </button>
  );
}
```

---

## Methods & Handlers

### handleDelete()

```javascript
const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You cannot undo this action!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    document.getElementById(`delete-form-${id}`).requestSubmit();
  }
};
```

**Purpose:** 
- Displays a warning dialog using SweetAlert2
- On confirmation, submits the form with ID `delete-form-{id}`
- On cancellation, does nothing

**Behavior:**
- Red confirm button: `#e3342f`
- Blue cancel button: `#3085d6`
- Warning icon displayed
- Modal prevents other interactions until resolved

---

## Styling & Layout

### CSS Classes

- `.btn-common-text` — Standard button styling
- `.ps-2` — Padding-start (left padding)

### Inline Styles

```javascript
style={{ color: 'red' }}
```

- Red text color to indicate destructive action

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `sweetalert2` | Confirmation dialog display |

---

## Usage Example

```jsx
import DeleteButton from '@/components/DeleteButton';

export default function AdminList() {
  return (
    <>
      <DeleteButton id="user-123" />
      <form id="delete-form-user-123" action="/api/delete" method="POST">
        {/* Hidden form for deletion */}
      </form>
    </>
  );
}
```

---

## Expected Form Structure

The component assumes a corresponding form exists in the DOM:

```html
<form id="delete-form-{id}" action="/api/delete" method="POST">
  <!-- Hidden inputs or data -->
</form>
```

When the delete is confirmed, this form is submitted programmatically.

---

## Behavior Notes

- The component uses `requestSubmit()` instead of `submit()` to trigger form validation and submission events.
- The component is client-side only (`"use client"`), required for SweetAlert2 and DOM manipulation.
- No error handling is included—ensure the target form exists in the DOM to prevent errors.

---

## Accessibility Considerations

- Button is labeled "Delete" with clear intent
- SweetAlert2 dialog includes confirmation text: "You cannot undo this action!"
- Cancel option available to prevent accidental deletion
- Consider adding keyboard support if needed for accessibility compliance

---

## Security Notes

- Ensure the associated form includes CSRF tokens or proper authentication
- Backend should verify user permissions before processing the delete
- The form should be POST (or DELETE) method, not GET

---

## Future Enhancements

- [ ] Add customizable button text (not just "Delete")
- [ ] Add customizable dialog title and message
- [ ] Add loading state while deletion is in progress
- [ ] Add error feedback if deletion fails
- [ ] Add optional success callback after successful deletion

---

## Support & Maintenance

- Verify that the target form (`delete-form-{id}`) exists in the DOM before rendering this button.
- Ensure SweetAlert2 is installed: `npm install sweetalert2`.
- Check that the form's `action` endpoint is correct and handles deletion properly.
