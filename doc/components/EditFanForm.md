# EditFanForm Component Documentation

## Component Purpose

The `EditFanForm` component provides a form interface for editing fan profile data in the FUTY administration dashboard. It supports fan name, email, telephone, profile image upload, optional password updates, and client-side validation.

**Key Responsibility:** Enable admins to update fan profile details and enforce validation rules before submission.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditFanForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `user` object |
| **Related Models** | Fans |
| **Related Actions** | `updateFan` server action |
| **Dependencies** | `next/image`, `next/link`, `FansSchema`, `useActionState`, `useFormStatus` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `Object` | Yes | Existing fan data used to populate form fields |

### Expected User Object Structure

```javascript
{
  _id: String,
  name: String,
  email: String,
  telephone: String,
  profile_image: String
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `preview` | `String` | `user.profile_image ? '/api' + user.profile_image : '/images/profile-picture.jpg'` | Current profile image preview URL |
| `showPassword` | `Boolean` | `false` | Toggles password visibility |
| `clientErrors` | `Object` | `{}` | Stores validation errors returned by Zod or API checks |
| `state` | `Object` | Server action state | Handles submit state from `useActionState` |

---

## Key Features

- Prefills fan name, email, telephone fields from existing data
- Image upload with live preview
- Optional password update with visibility toggle
- Client-side validation using `FansSchema`
- Email uniqueness check before submission
- Uses server action binding via `updateFan`
- Inline validation feedback

---

## Form Fields

| Field | Name | Type | Validation |
|------|------|------|-----------|
| Name | `name` | `text` | Required |
| Email | `email` | `email` | Required, unique |
| Telephone | `telephone` | `text` | Required |
| Profile image | `profile_image` | `file` | Image types only |
| Password | `password` | `password` | Optional, minimum length depends on schema |

---

## Component Structure

### SubmitButton

```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" className="btn-common-text" disabled={pending}>
        {pending ? "Editing" : "Save"}
      </button>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/fans">
        Back
      </Link>
    </>
  );
}
```

---

## Methods & Handlers

### handleUploadClick()

```javascript
const handleUploadClick = () => {
  fileInputRef.current.click();
};
```

**Purpose:** Opens the hidden file input for profile image selection.

### handleFileChange(e)

```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  }
};
```

**Purpose:** Updates the image preview when the user selects a new file.

### handleSubmit(e)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const raw = Object.fromEntries(formData.entries());

  const imageFile = e.target.profile_image.files[0];
  if (imageFile) {
    formData.set("profile_image", imageFile);
  } else {
    formData.delete("profile_image");
  }

  const result = FansSchema(true).safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    setClientErrors(result.error.flatten().fieldErrors);
    return;
  }

  const res = await fetch(`/api/check-email?email=${raw.email}&id=${user._id}`);
  const { exists } = await res.json();
  if (exists) {
    setClientErrors({ email: ["Email already exists"] });
    return;
  }

  setClientErrors({});
  startTransition(() => {
    formAction(formData);
  });
};
```

**Purpose:** Validates form data, checks email uniqueness, and submits the update.

---

## Rendering Logic

### Profile Image Upload

- Displays existing profile image if available, otherwise fallback image
- Clicking the image area opens file picker
- Replaces preview once a new image is selected

### Inline Error Display

- Each field renders an `.invalid-feedback` span when `clientErrors` contains a matching key

---

## Styling & Layout

### CSS Classes

- `.main-body` — Main page container
- `.body-top` — Header and breadcrumb section
- `.body-title-bar` — Page title wrapper
- `.left-info-box` — Field section wrapper
- `.left-row` — Layout row for label/input pairs
- `.left-label-col` — Label column
- `.left-info-col` — Input column
- `.form-control` — Standard input styling
- `.upload-box` — Profile image upload area
- `.password-container` — Password input wrapper
- `.eye-icon` — Password visibility toggle
- `.invalid-feedback` — Validation message style
- `.btn-common-text` — Submit button style

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateFan` | Server action for updating fan profiles |
| `FansSchema` | Zod schema for validation |
| `useFormStatus` | Submit button loading state |
| `useActionState` | Server action state management |
| `Image` | Next.js optimized image rendering |
| `Link` | Navigation back to fan listing |

---

## Usage Example

```jsx
import EditFanForm from '@/components/EditFanForm';

export default function FanEditPage({ user }) {
  return <EditFanForm user={user} />;
}
```

---

## Behavior Notes

- Uses a preview URL with `/api` prepended to existing fan profile images.
- The component performs an asynchronous email uniqueness check before submission.
- The password field is optional and toggles visibility with a click.
- `FansSchema(true)` is expected to validate raw form values created from FormData.

---

## Future Enhancements

- [ ] Add explicit profile image crop or resize support
- [ ] Show success/error toast after submit
- [ ] Add a confirm-password field for password changes
- [ ] Support controlled `showPassword` state with keyboard accessibility
- [ ] Add inline validation as the user types

---

## Support & Maintenance

If fan updates fail, ensure the `FansSchema` matches the expected form input and that `/api/check-email` is available.
