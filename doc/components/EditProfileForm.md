# EditProfileForm Component Documentation

## Component Purpose

The `EditProfileForm` component allows admin users to update their profile information in the FUTY dashboard. It supports name, email, telephone, optional password changes, and profile image rendering via preview state.

**Key Responsibility:** Provide a secure admin profile edit form with validation and email uniqueness checking.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditProfileForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `user` object |
| **Related Actions** | `updateProfile` server action |
| **Dependencies** | `sweetalert2`, `zod`, `next/image`, `useActionState`, `useFormStatus` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `Object` | Yes | Existing admin profile data to prepopulate form fields |

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
| `clientErrors` | `Object` | `{}` | Tracks validation errors returned by Zod or API checks |
| `preview` | `String` | `user.profile_image ? '/api' + user.profile_image : '/images/profile-picture.jpg'` | Tracks the profile image preview URL |
| `state` | `Object` | Server action state | Tracks submission success/errors from `useActionState` |

---

## Key Features

- Validates name, email, telephone, and password with `zod`
- Checks email uniqueness using `/api/check-email`
- Displays inline validation feedback
- Supports profile editing via `updateProfile` server action
- Uses SweetAlert2 toast notifications for server-side messages stored in cookies
- Provides a simple admin form layout with next/link navigation support

---

## Validation Schema

### `ProfileSchema`

- `name`: Required string with minimum length 2
- `email`: Required string with email format validation
- `password`: Optional string, minimum 7 characters if provided
- `telephone`: Required numeric string, 10-11 digits only

```javascript
export const ProfileSchema = z.object({
  name: z.string().min(2, "First Name is required"),
  email: z.string().trim().superRefine((val, ctx) => { ... }),
  password: z.string().optional().refine((val) => !val || val.length >= 7, {
    message: "Password must be at least 7 characters long",
  }),
  telephone: z.string().trim().min(10, { message: "Telephone must be at least 10 digits." })
    .max(11, { message: "Telephone must be at most 11 digits." })
    .regex(/^\d+$/, { message: " Digits only (0–9)" }),
});
```

---

## Form Fields

| Field | Name | Type | Validation |
|------|------|------|-----------|
| Name | `name` | `text` | Required, minimum 2 characters |
| Email | `email` | `email` | Required, valid email format |
| Telephone | `telephone` | `text` | Required, 10-11 digits only |
| Password | `password` | `password` | Optional, minimum 7 characters if present |

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
    </>
  );
}
```

---

## Methods & Handlers

### handleSubmit(e)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const raw = Object.fromEntries(formData.entries());

  const result = ProfileSchema.safeParse(Object.fromEntries(formData.entries()));
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

**Purpose:** Validates input, checks email uniqueness, and submits profile updates.

---

## Toast Notification Behavior

### SweetAlert2 Toast

A toast is displayed when a `toastMessage` cookie is present:

```javascript
useEffect(() => {
  const toastMessage = document.cookie
    .split("; ")
    .find((row) => row.startsWith("toastMessage="));

  if (toastMessage) {
    Toast.fire({
      icon: "success",
      title: decodeURIComponent(toastMessage.split("=")[1]),
    });
    document.cookie = "toastMessage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }
}, []);
```

**Purpose:** Displays success feedback after redirects or action completion via cookie.

---

## Rendering Logic

### Profile Form

The form renders admin profile fields in a left-aligned layout:

- Name input
- Email input
- Telephone input
- Password input
- Submit button

### Error Display

Each field conditionally shows an inline `.invalid-feedback` message when validation fails.

---

## Styling & Layout

### CSS Classes

- `.main-body` — Main page container
- `.body-top` — Breadcrumb/header row
- `.body-title-bar` — Title section
- `.left-info-box` — Section wrapper for each field
- `.left-row` — Field row layout
- `.left-label-col` — Label column
- `.left-info-col` — Input column
- `.form-control` — Standard input styling
- `.invalid-feedback` — Validation error styling
- `.btn-common-text` — Submit button styling

### Responsive Layout

- The form uses Bootstrap grid classes for responsive width
- `col-md-7`, `col-lg-8`, `col-xl-10` provide scaling across breakpoints

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateProfile` | Server action for profile updates |
| `ProfileSchema` | Client-side Zod validation |
| `SweetAlert2` | Toast notification UI |
| `useActionState` | Server action state management |
| `useFormStatus` | Submit button pending state |
| `next/image` | Icon rendering and image support |
| `zod` | Schema validation library |

---

## Usage Example

```jsx
import EditProfileForm from '@/components/EditProfileForm';

function AdminProfilePage({ user }) {
  return <EditProfileForm user={user} />;
}
```

---

## Behavior Notes

- No direct image upload input is present, but `preview` is initialized for display logic.
- Email uniqueness is verified before invoking the update action.
- Password is optional: empty value is allowed, but if provided must be at least 7 characters.
- Toast messages are triggered by a `toastMessage` cookie and cleared afterward.

---

## Future Enhancements

- [ ] Add profile image upload/editing directly into the form
- [ ] Include a confirm-password field for password updates
- [ ] Add a success notification directly after form submit without cookies
- [ ] Add field-level help text or placeholders
- [ ] Add phone validation feedback before submission
- [ ] Replace cookie-driven toast with server action state feedback

---

## Support & Maintenance

If profile updates fail, verify that `updateProfile` action returns proper cookies or responses, and that the `/api/check-email` endpoint is available.
