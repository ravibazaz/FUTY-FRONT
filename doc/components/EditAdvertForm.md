# EditAdvertForm Component Documentation

## Component Purpose

The `EditAdvertForm` component is a React form component for editing advert entries in the FUTY admin dashboard. It allows admins to update advert title, destination link, description, scheduling, page visibility, and advert image with live preview and validation.

**Key Responsibility:** Provide a complete advert editing interface with validation and image upload.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditAdvertForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `adverts` object |
| **Related Models** | Adverts |
| **Related Actions** | `updateAdvert` server action |
| **Dependencies** | `sweetalert2` not used here, `next/image` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `adverts` | `Object` | Yes | Existing advert payload to populate form fields |

### Expected Advert Object Structure

```javascript
{
  _id: ObjectId,
  name: String,
  link: String,
  content: String,
  date: String,      // Start date
  time: String,      // Start time
  end_date: String,  // End date
  end_time: String,  // End time
  pages: [String],   // Pages where advert should display
  image: String      // Image path
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `selectedpages` | `Array<string> String` | `adverts.pages || ''` | Tracks selected pages for checkbox defaults |
| `preview` | `String` | `adverts.image ? '/api' + adverts.image : '/images/club-badge.jpg'` | Stores image preview URL |
| `clientErrors` | `Object` | `{}` | Validation error messages |

---

## Key Features

- Editable fields for advert content, schedule, and destination link
- Page selection via checkboxes for Manager, Friendly, and Home
- Image upload box with live preview
- Client-side validation using `AdvertsSchema`
- Server action binding for advert updates
- Preserves existing image when no new file is selected

---

## Form Fields

### Primary Advert Fields

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Title | `name` | `text` | Required |
| Link | `link` | `text` | Required, valid URL |
| Description | `content` | `textarea` | Optional |

### Schedule

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Start Date | `date` | `date` | Required |
| Start Time | `time` | `time` | Required |
| End Date | `end_date` | `date` | Optional |
| End Time | `end_time` | `time` | Optional |

### Visibility

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Pages | `pages` | `checkbox[]` | Optional |

### Media

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Advert image | `image` | `file` | Image-only, 3MB max |

---

## Component Structure

### Sub-Component: SubmitButton

```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <input
        className="btn-common-text mt-30 mb-30"
        disabled={pending}
        type="submit"
        value={pending ? "Editing" : "Save"}
      />
      <Link className="btn-common-text mt-30 mb-30 ps-3" href={'/admin/adverts'}>
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

**Purpose:** Opens the hidden file picker when the advert image preview area is clicked.

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

**Purpose:** Loads the chosen image file and updates the preview state.

### handleSubmit(e)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const raw = Object.fromEntries(formData.entries());

  const imageFile = e.target.image.files[0];
  if (imageFile) {
    formData.set("image", imageFile);
  } else {
    formData.delete("image");
  }

  const result = AdvertsSchema(true).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    setClientErrors(result.error.flatten().fieldErrors);
    return;
  }

  setClientErrors({});
  startTransition(() => {
    formAction(formData);
  });
};
```

**Purpose:** Validates the form and submits the advert update request.

---

## Rendering Logic

### Image Preview

- Uses Next.js `Image` component to render the current or fallback advert image.
- Image area is clickable and opens the hidden file input.
- Supports live preview for newly selected image files.

### Page Checkboxes

- `Manager`, `Friendly`, and `Home` checkboxes are rendered with `defaultChecked` based on `selectedpages`.
- Each checkbox uses the same `name="pages"` so they can be submitted as an array.

### Error Display

- Validation errors are shown inline using `clientErrors`.
- Each field conditionally renders an `.invalid-feedback` span.

---

## Styling & Layout

### CSS Classes

- `.main-body` — Main form container
- `.body-top` — Header row with breadcrumb and settings icon
- `.body-title-bar` — Page title section
- `.left-info-box` — Field section wrapper
- `.left-row` — Grid row layout
- `.left-label-col` — Label column
- `.left-info-col` — Input column
- `.upload-box` — Image upload preview area
- `.form-control` — Input styling
- `.invalid-feedback` — Inline validation styling
- `.btn-common-text` — Button styling

### Responsive Grid

- Uses Bootstrap column classes for responsive layout
- `col-md-9 col-lg-9 col-xl-10` for main form width
- `col-md-5 / col-md-7` layout for labels and inputs

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateAdvert` action | Updates advert data on submit |
| `AdvertsSchema` validation | Zod schema for client-side validation |
| `useFormStatus` | Submit state tracking |
| `useActionState` | Server action state management |
| `useState`, `useRef`, `useEffect` | React hooks for component state |
| `Image` | Next.js optimized image rendering |
| `Link` | Navigation back to adverts list |

---

## Usage Example

```jsx
import EditAdvertForm from '@/components/EditAdvertForm';

function AdvertEditPage({ advert }) {
  return <EditAdvertForm adverts={advert} />;
}
```

---

## Behavior Notes

- `selectedpages` is initialized from `adverts.pages` and used only for checkbox defaults.
- Existing advert image is preserved unless a new image is uploaded.
- The component expects `AdvertsSchema(true)` to accept form input from `FormData`.
- `formAction` is bound to `updateAdvert(adverts._id)`.

---

## Future Enhancements

- [ ] Convert pages checkbox inputs to controlled state
- [ ] Add image validation feedback before submission
- [ ] Add a preview caption or image alt editing field
- [ ] Introduce date/time validation for start/end ranges
- [ ] Add a page visibility summary or tag list
- [ ] Support multiple advert images
- [ ] Add a rich-text editor for description

---

## Related Components

- `SubmitButton` — Inline submit control

---

## Related Pages

- `/admin/adverts` — Advert listing page
- `/admin/adverts/[id]` — Advert detail page

---

## Related Actions

- `updateAdvert(advertId, formData)` — Submit advert updates to the backend

---

## Support & Maintenance

If you update form field names or validation, ensure `AdvertsSchema` stays aligned with the request payload and `FormData` entries.
