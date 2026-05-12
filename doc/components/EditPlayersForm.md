# EditPlayersForm Component Documentation

## Component Purpose

The `EditPlayersForm` component is a React form used to edit player profiles in the FUTY admin interface. It supports updating player details, manager assignment, contact information, player skills, profile image upload, and optional password changes.

**Key Responsibility:** Provide a complete player profile editing experience with dynamic manager selection and validation.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditPlayersForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `user` object |
| **Related Models** | Players, Managers |
| **Related Actions** | `updatePlayers` server action |
| **Related Components** | `SubmitButton` sub-component |
| **External Libraries** | `TomSelect` for enhanced manager dropdown |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `Object` | Yes | Player object used to prefill form fields |

### Expected User Object Structure

```javascript
{
  _id: String,
  name: String,
  email: String,
  telephone: String,
  post_code: String,
  profile_description: String,
  nick_name: String,
  palyer_manger_id: String,
  palyer_position: Number,
  palyer_pace: Number,
  palyer_skill: Number,
  palyer_power: Number,
  palyer_defence: Number,
  palyer_teamwork: Number,
  palyer_discipline: Number,
  palyer_rating: Number,
  profile_image: String
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `managers` | `Array` | `[]` | Loaded manager list for dropdown |
| `selectedCategory` | `String` | `user.palyer_manger_id || ''` | Selected manager id |
| `showPassword` | `Boolean` | `false` | Password visibility toggle |
| `preview` | `String` | Player profile image or fallback |
| `clientErrors` | `Object` | `{}` | Form validation errors |
| `state` | `Object` | Server action state | Submission state from `useActionState` |

---

## Key Features

- Dynamic manager selection via `TomSelect`
- Email uniqueness check before final submit
- Image upload with live preview and fallback image
- Password visibility toggle
- Skill rating fields with numeric bounds
- Client-side validation using `PlayersSchema`
- Server action binding for efficient updates

---

## Form Fields

### Manager Assignment

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Invited By | `palyer_manger_id` | `select` | Required |

### Personal Details

| Field | Name | Type | Validation |
|------|------|------|-----------|
| Name | `name` | `text` | Required |
| Email | `email` | `email` | Required, unique |
| Telephone | `telephone` | `text` | Required |
| Postcode | `post_code` | `text` | Optional |

### Profile Details

| Field | Name | Type | Validation |
|------|------|------|-----------|
| Profile Text | `profile_description` | `textarea` | Optional |
| Nickname | `nick_name` | `text` | Optional |

### Player Metrics

| Field | Name | Type | Validation | Notes |
|------|------|------|-----------|-------|
| Position | `palyer_position` | `number` | 0-100 | Numeric rating |
| Pace | `palyer_pace` | `number` | 0-100 | Numeric rating |
| Skill | `palyer_skill` | `number` | 0-100 | Numeric rating |
| Power | `palyer_power` | `number` | 0-100 | Numeric rating |
| Defence | `palyer_defence` | `number` | 0-100 | Numeric rating |
| Teamwork | `palyer_teamwork` | `number` | 0-100 | Numeric rating |
| Discipline | `palyer_discipline` | `number` | 0-100 | Numeric rating |
| Rating | `palyer_rating` | `number` | 0-100 | Numeric rating |

### Security

| Field | Name | Type | Validation |
|------|------|------|-----------|
| Password | `password` | `password` | Optional |

### Media

| Field | Name | Type | Validation |
|------|------|------|-----------|
| Profile image | `profile_image` | `file` | Image-only, 3MB max |

---

## Component Structure

### SubmitButton Sub-Component

```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" className="btn-common-text" disabled={pending}>
        {pending ? "Editing" : "Save"}
      </button>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/players">
        Back
      </Link>
    </>
  );
}
```

---

## Dynamic Behavior

### Manager Fetch & TomSelect Initialization

```javascript
useEffect(() => {
  const fetchManagers = async () => {
    const response = await fetch("/api/managers");
    const data = await response.json();
    setManagers(data.managers);
  };
  fetchManagers();
}, []);
```

```javascript
useEffect(() => {
  if (!selectRef.current || managers.length === 0) return;
  tomSelectRef.current?.destroy();
  tomSelectRef.current = new TomSelect(selectRef.current, {
    create: false,
    placeholder: "Choose a Manager",
    sortField: { field: "text", direction: "asc" }
  });
  if (selectedCategory) {
    tomSelectRef.current.setValue(selectedCategory, true);
  }
  return () => {
    tomSelectRef.current?.destroy();
    tomSelectRef.current = null;
  };
}, [managers]);
```

### Password Visibility Toggle

```javascript
const [showPassword, setShowPassword] = useState(false);
// toggled with the eye icon next to the input
```

---

## Methods & Handlers

### handleUploadClick()

```javascript
const handleUploadClick = () => {
  fileInputRef.current.click();
};
```

**Purpose:** Opens the hidden file input when the profile image area is clicked.

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

**Purpose:** Loads image file previews into component state.

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

  const result = PlayersSchema(true).safeParse(Object.fromEntries(formData.entries()));
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

**Purpose:** Validates form data, checks email uniqueness, and submits via server action.

---

## Validation & Error Handling

- Uses `PlayersSchema(true)` for client-side validation.
- Displays validation messages via `clientErrors`.
- Checks for duplicate email addresses through `/api/check-email`.
- Supports server-side errors through `state.errors`.

---

## Styling & Layout

### CSS Classes

- `.main-body` — Main container
- `.body-top` — Top breadcrumb row
- `.body-title-bar` — Page header section
- `.left-info-box` — Each field section wrapper
- `.left-row` — Grid row container
- `.left-label-col` / `.left-info-col` — Label and input columns
- `.form-control` — Input styling
- `.upload-box` — Image upload preview container
- `.password-container` — Password field wrapper
- `.eye-icon` — Password visibility toggle
- `.invalid-feedback` — Validation message styling
- `.btn-common-text` — Submit button styling

### Responsive Layout

- Mobile-first full width
- `col-md-7` and `col-lg-8` layout for input columns
- `col-xl-10` main page width

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updatePlayers` | Update player record server action |
| `PlayersSchema` | Zod validation schema |
| `useFormStatus` | Submit button pending state |
| `useActionState` | Server action state management |
| `TomSelect` | Enhanced manager dropdown experience |
| `Image` | Optimized Next.js image rendering |
| `Link` | Back navigation link |

---

## Usage Example

```jsx
import EditPlayersForm from '@/components/EditPlayersForm';

export default function EditPlayerPage({ params }) {
  const player = await fetchPlayer(params.playerId);
  return <EditPlayersForm user={player} />;
}
```

---

## Behavior Notes

- Manager dropdown is loaded on mount using `/api/managers`.
- Selected manager is prefilled using `user.palyer_manger_id`.
- Profile image preview uses `user.profile_image` or a fallback image.
- Email uniqueness check runs before the form is submitted.
- The password field is optional and hidden by default.

---

## Future Enhancements

- [ ] Add manager filter by team or league
- [ ] Add inline validation for metric fields
- [ ] Show quantitative skill meter or progress bars
- [ ] Add image crop/resize support before upload
- [ ] Support controlled checkbox or select state for manager assignment
- [ ] Add success/failure toast notifications
- [ ] Improve accessibility for the custom `TomSelect` dropdown

---

## Support & Maintenance

If the component stops working, verify that the manager API endpoint returns `data.managers`, and confirm that `TomSelect` is available in the browser environment.
