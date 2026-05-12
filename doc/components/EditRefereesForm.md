# EditRefereesForm Component Documentation

## Component Purpose

The `EditRefereesForm` component is a React form used to edit referee profiles in the FUTY admin portal. It supports updating personal details, contact information, referee level and fee, profile image upload, and optional password changes.

**Key Responsibility:** Provide admin users with a referee profile editing interface that includes validation and file upload support.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditrRefereesForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `user` object |
| **Related Models** | Referees |
| **Related Actions** | `updateRefreee` server action |
| **Dependencies** | `next/image`, `next/link`, `RefereesSchema`, `useActionState`, `useFormStatus` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `Object` | Yes | Existing referee data used to prefill the form |

### Expected User Object Structure

```javascript
{
  _id: String,
  name: String,
  email: String,
  telephone: String,
  post_code: String,
  travel_distance: String,
  profile_description: String,
  nick_name: String,
  referee_lavel: String,
  referee_fee: String,
  profile_image: String
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `preview` | `String` | `user.profile_image ? '/api' + user.profile_image : '/images/profile-picture.jpg'` | Current image preview URL |
| `showPassword` | `Boolean` | `false` | Password visibility toggle |
| `clientErrors` | `Object` | `{}` | Client-side validation errors |
| `state` | `Object` | Server action state | Track server response/errors from `useActionState` |

---

## Key Features

- Editable fields for referee details and contact information
- Profile image upload with live preview
- Optional password update with toggle visibility
- Asynchronous email uniqueness check before submitting
- Client-side validation via `RefereesSchema`
- Uses `updateRefreee` server action for updates
- Inline validation message rendering

---

## Form Fields

| Field | Name | Type | Validation |
|------|------|------|-----------|
| Name | `name` | `text` | Required |
| Email | `email` | `text` | Required, unique |
| Telephone | `telephone` | `text` | Required |
| Postcode | `post_code` | `text` | Optional |
| Travel Distance | `travel_distance` | `text` | Optional |
| Profile Text | `profile_description` | `textarea` | Optional |
| Nickname | `nick_name` | `text` | Optional |
| Referee Level | `referee_lavel` | `text` | Optional |
| Referee Fee | `referee_fee` | `text` | Optional |
| Profile Image | `profile_image` | `file` | Image-only |
| Password | `password` | `password` | Optional, schema rules apply |

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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/referees">
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

**Purpose:** Opens the hidden file input to select a profile image.

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

**Purpose:** Converts the selected image to a data URL and updates the preview.

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

  const result = RefereesSchema(true).safeParse(Object.fromEntries(formData.entries()));
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

**Purpose:** Runs validation and email uniqueness checks, then submits the referee update.

---

## Rendering Logic

### Profile Image Upload

- The component renders an image preview using `next/image`.
- Clicking the image activates the hidden file input.
- New image selection updates the preview immediately.

### Error Display

- Field-related validation errors appear inline beneath each input.
- Uses `clientErrors` from Zod or API response.

---

## Styling & Layout

### CSS Classes

- `.main-body` — Main page container
- `.body-top` — Top breadcrumb and settings row
- `.body-title-bar` — Page title section
- `.left-info-box` — Field container block
- `.left-row` — Row wrapper for label/input pair
- `.left-label-col` — Label cell
- `.left-info-col` — Input cell
- `.form-control` — Standard input styling
- `.upload-box` — Image upload area
- `.password-container` — Password input layout
- `.eye-icon` — Password visibility toggle
- `.invalid-feedback` — Validation text styling
- `.btn-common-text` — Submit button styling

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateRefreee` | Server action for referee update |
| `RefereesSchema` | Zod validation schema |
| `useFormStatus` | Submit status display |
| `useActionState` | Handles action state |
| `Image` | Next.js image rendering |
| `Link` | Navigation back to admin list |

---

## Usage Example

```jsx
import EditRefereesForm from '@/components/EditrRefereesForm';

export default function RefereeEditPage({ user }) {
  return <EditRefereesForm user={user} />;
}
```

---

## Behavior Notes

- The form includes a profile image preview, but no explicit image validation beyond file type.
- It performs an async email uniqueness check using `/api/check-email`.
- Password is optional and can be left blank to preserve the current password.
- The default preview falls back to `/images/profile-picture.jpg` when no image exists.

---

## Future Enhancements

- [ ] Add referee certification or qualification fields
- [ ] Add inline phone/fee validation before submit
- [ ] Improve password handling with confirm password field
- [ ] Add toast or inline success state after save
- [ ] Add access control to show/hide referee-specific fields

---

## Support & Maintenance

If updates fail, verify that `updateRefreee` is correctly exported and that `/api/check-email` is reachable from the browser.
