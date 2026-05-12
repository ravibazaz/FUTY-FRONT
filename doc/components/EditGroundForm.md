# EditGroundForm Component Documentation

## Component Purpose

The `EditGroundForm` component is a React form used to edit sports ground/facility information in the FUTY admin portal. It supports updating ground details, location coordinates, description, facilities, and multiple image uploads with live previews.

**Key Responsibility:** Provide admin users with a ground/facility profile editing interface that includes validation and multi-image upload support.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditGroundForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `ground` object |
| **Related Models** | Grounds |
| **Related Actions** | `updateGround` server action |
| **Dependencies** | `next/image`, `next/link`, `GroundSchema`, `useActionState`, `useFormStatus` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `ground` | `Object` | Yes | Existing ground data used to prefill the form |

### Expected Ground Object Structure

```javascript
{
  _id: String,
  name: String,
  add1: String,        // Address line 1
  add2: String,        // Address line 2 (optional)
  add3: String,        // Address line 3 (optional)
  lat: String,         // Latitude
  long: String,        // Longitude
  content: String,     // Description
  pin: String,         // Postcode
  facilities: Array,   // Array of facility names/IDs
  images: Array        // Array of image paths
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `clientErrors` | `Object` | `{}` | Client-side validation errors |
| `state` | `Object` | Server action state | Track server response/errors from `useActionState` |

### Refs

| Ref | Type | Purpose |
|-----|------|---------|
| `fileInputRef` | `Ref<HTMLInputElement>` | Reference to hidden file input element |
| `previewsRef` | `Ref<HTMLDivElement>` | Reference to image previews container |

---

## Key Features

- Editable fields for ground name, address, and location coordinates
- Ground description with textarea
- Postcode/PIN field
- Ground facilities selection via checkbox component
- Multiple image upload with duplicate prevention
- Live image preview rendering
- Asynchronous form submission with validation
- Client-side validation via `GroundSchema`
- Uses `updateGround` server action for updates
- Inline validation message rendering

---

## Form Fields

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Name | `name` | `text` | Required |
| Address 1 | `add1` | `text` | Required |
| Address 2 | `add2` | `text` | Optional |
| Address 3 | `add3` | `text` | Optional |
| Latitude | `lat` | `text` | Optional |
| Longitude | `long` | `text` | Optional |
| Description | `content` | `textarea` | Optional |
| Postcode | `pin` | `text` | Optional |
| Facilities | (via component) | checkboxes | Optional |
| Images | `images` | `file` | Image-only, multiple allowed |

---

## Component Structure

### SubmitButton

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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/grounds">
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

**Purpose:** Opens the hidden file input to select ground images.

### handleFileChange(e)

```javascript
const handleFileChange = (e) => {
  let allFiles = [];
  for (let file of e.target.files) {
    // Check for duplicate files if needed
    if (!allFiles.some(f => f.name === file.name && f.size === file.size)) {
      allFiles.push(file);
    }
  }
  previewsRef.current.innerHTML = '';
  allFiles.forEach(file => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        previewsRef.current.appendChild(img)
      }
      reader.readAsDataURL(file);
    }
  });
};
```

**Purpose:** 
- Extracts selected files from the input element
- Filters out duplicate files (by name and size)
- Converts each image to data URL
- Appends preview image elements to the previews container
- Only processes image files

### handleSubmit(e)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const raw = Object.fromEntries(formData.entries());

  // Handle image files
  const imageFiles = e.target.images.files;
  if (imageFiles && imageFiles.length > 0) {
    formData.delete("images");
    for (const file of imageFiles) {
      formData.append("images", file);
    }
  } else {
    formData.delete("images");
  }

  // Validate with schema
  const result = GroundSchema(true).safeParse(
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

**Purpose:** Runs validation and submits the ground update.

**Behavior:**
- Prevents default form submission
- Rebuilds `FormData` to properly handle multiple image files
- Validates all fields using `GroundSchema`
- Displays client-side errors if validation fails
- Submits via server action if validation passes

---

## Rendering Logic

### Address Fields

Three separate address fields (`add1`, `add2`, `add3`) for flexible address entry:
- `add1` is required
- `add2` and `add3` are optional

### Location Coordinates

- `lat` (latitude) and `long` (longitude) for mapping
- Both optional fields
- Accepts text input for coordinate values

### Ground Facilities

- Uses child component `GroundFacilitiesCheckbox` for facility selection
- Passes existing `facilities` array to component

### Image Upload

- Click on upload box triggers hidden file input
- Multiple images can be selected
- Duplicates are prevented during selection
- Existing images display as previews
- New image selections update the preview immediately
- Fallback to `/images/club-badge.jpg` if no images exist

### Error Display

- Field-related validation errors appear inline beneath each input
- Errors come from `clientErrors` (client validation) or `state.errors` (server validation)

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
- `.previews` — Image preview container
- `.invalid-feedback` — Validation text styling
- `.btn-common-text` — Submit button styling
- `.mt-30`, `.mb-30`, `.ps-3` — Spacing utilities

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateGround` | Server action for ground update (bound to ground._id) |
| `GroundSchema` | Zod validation schema |
| `useFormStatus` | Submit status display |
| `useActionState` | Handles action state |
| `Image` | Next.js image rendering |
| `Link` | Navigation back to admin list |
| `GroundFacilitiesCheckbox` | Child component for facility selection |

---

## Usage Example

```jsx
import EditGroundForm from '@/components/EditGroundForm';

export default function GroundEditPage({ ground }) {
  return <EditGroundForm ground={ground} />;
}
```

---

## Behavior Notes

- The form prefills all fields with existing ground data via `defaultValue` attributes
- Multiple images are supported; new selections replace existing previews (only for new uploads)
- Existing images remain on the server and display as previews
- Postcode (`pin`) field can receive validation errors from both client and server
- Facilities are managed through the separate `GroundFacilitiesCheckbox` component
- The form validates before submission to provide immediate feedback

---

## Image Upload Behavior

**New Images:**
- When user selects new images, they generate data URLs
- Previews update dynamically in the preview container

**Existing Images:**
- Display from the server using `/api{imagePath}` URL format
- Persist unless user explicitly uploads new images

---

## Validation

The `GroundSchema` validates:
- Required fields: `name`, `add1`
- Optional fields: `add2`, `add3`, `lat`, `long`, `content`, `pin`, `images`
- Image type validation (image files only)

---

## Future Enhancements

- [ ] Add image deletion for individual existing images
- [ ] Add search/autocomplete for address fields
- [ ] Add map picker for latitude/longitude
- [ ] Add drag-and-drop for image upload
- [ ] Add image reordering capability
- [ ] Improve duplicate file detection logic
- [ ] Add success/error toast notifications
- [ ] Add ground opening hours editor

---

## Support & Maintenance

If updates fail, verify that:
- `updateGround` is correctly exported from `@/actions/groundsActions`
- `GroundSchema` is properly configured in `@/lib/validation/grounds`
- `GroundFacilitiesCheckbox` component is available and functioning
- Image API endpoint `/api{imagePath}` is accessible
- Ground object structure matches expected format
