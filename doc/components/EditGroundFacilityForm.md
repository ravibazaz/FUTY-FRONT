# EditGroundFacilityForm Component Documentation

## Component Purpose

The `EditGroundFacilityForm` component is a React form used to edit individual ground facility entries in the FUTY admin portal. It supports updating the facility title and description with client-side and server-side validation.

**Key Responsibility:** Provide admin users with a ground facility editing interface for managing facility names and descriptions.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditGroundFacilityForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `groundfacilities` object |
| **Related Models** | Ground Facilities |
| **Related Actions** | `updateGroundFacilities` server action |
| **Dependencies** | `next/image`, `next/link`, `GroundFacilitiesSchema`, `useActionState`, `useFormStatus` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `groundfacilities` | `Object` | Yes | Existing ground facility data used to prefill the form |

### Expected Ground Facilities Object Structure

```javascript
{
  _id: String,
  facilities: String,      // Facility title/name
  description: String      // Facility description
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
| `fileInputRef` | `Ref<HTMLInputElement>` | Unused reference (legacy code) |
| `previewsRef` | `Ref<HTMLDivElement>` | Unused reference (legacy code) |

---

## Key Features

- Editable facility title/name field
- Editable facility description textarea
- Client-side validation via `GroundFacilitiesSchema`
- Server-side validation via `updateGroundFacilities` action
- Inline validation message rendering
- Simple two-field form for quick edits
- Asynchronous form submission with loading state

---

## Form Fields

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Title | `facilities` | `text` | Required (schema rules apply) |
| Description | `description` | `textarea` | Optional (schema rules apply) |

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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/groundfacilities">
        Back
      </Link>
    </>
  );
}
```

**Features:**
- Submit button displays "Editing" when form is submitting, "Save" otherwise
- Submit button is disabled while submission is pending
- Back link navigates to `/admin/groundfacilities` list
- Spacing classes for consistent button layout

---

## Methods & Handlers

### handleSubmit(e)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const raw = Object.fromEntries(formData.entries());

  // Validate with schema
  const result = GroundFacilitiesSchema(true).safeParse(
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

**Purpose:** Runs validation and submits the facility update.

**Behavior:**
- Prevents default form submission
- Creates `FormData` from form inputs
- Validates all fields using `GroundFacilitiesSchema`
- Displays client-side errors if validation fails
- Clears error state if validation passes
- Submits via server action using `startTransition`

---

## Rendering Logic

### Facility Title Field

```jsx
<input 
  className="form-control" 
  name="facilities" 
  defaultValue={groundfacilities.facilities} 
  type="text"
/>
```

- Prefilled with existing facility name
- Text input type
- Validation errors displayed inline below input

### Description Field

```jsx
<textarea 
  className="form-control" 
  defaultValue={groundfacilities.description} 
  name="description"
/>
```

- Prefilled with existing description
- Textarea for multi-line input
- Validation errors displayed inline below input

### Error Display

- Field-related validation errors appear inline beneath each input
- Errors come from `clientErrors` object
- Errors displayed with `.invalid-feedback` styling

---

## Styling & Layout

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.main-body` — Main page container |
| `.body-top` — Top breadcrumb and settings row |
| `.body-title-bar` — Page title section |
| `.left-info-box` — Field container block |
| `.left-row` — Row wrapper for label/input pair |
| `.left-label-col` — Label cell (responsive) |
| `.left-info-col` — Input cell (responsive) |
| `.form-control` — Standard input/textarea styling |
| `.invalid-feedback` — Validation error text styling |
| `.btn-common-text` — Button styling |
| `.mt-30`, `.mb-30`, `.ps-3` — Spacing utilities |

### Responsive Layout

- `.col-md-5`, `.col-lg-4`, `.col-xl-4` — Label column (responsive)
- `.col-md-7`, `.col-lg-8`, `.col-xl-8` — Input column (responsive)

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateGroundFacilities` | Server action for facility update (bound to groundfacilities._id) |
| `GroundFacilitiesSchema` | Zod validation schema |
| `useFormStatus` | Submit status display |
| `useActionState` | Handles action state |
| `Image` | Next.js image rendering (currently unused) |
| `Link` | Navigation back to admin list |

---

## Usage Example

```jsx
import EditGroundFacilityForm from '@/components/EditGroundFacilityForm';

export default function FacilityEditPage({ groundfacilities }) {
  return <EditGroundFacilityForm groundfacilities={groundfacilities} />;
}
```

---

## Behavior Notes

- The form prefills both fields with existing ground facility data via `defaultValue` attributes
- Form uses uncontrolled component pattern with `defaultValue` (not `value`)
- Validation occurs on form submission, not on individual field changes
- Both client-side and server-side validation are performed
- `fileInputRef` and `previewsRef` are declared but unused (legacy code cleanup opportunity)
- Form uses `startTransition` for better loading state handling
- No success message is shown after save (delegates to parent or server action)

---

## Typo Note

- The label reads "Descripton" (should be "Description")

---

## Validation

The `GroundFacilitiesSchema` validates:
- Required fields: likely `facilities`
- Optional fields: likely `description`
- Field-specific rules defined in schema

---

## Future Enhancements

- [ ] Remove unused `fileInputRef` and `previewsRef` refs
- [ ] Fix typo: "Descripton" → "Description"
- [ ] Add success toast notification after save
- [ ] Add character count indicators for description
- [ ] Add description length limits or preview
- [ ] Add facility icon upload if needed
- [ ] Improve error message formatting
- [ ] Add keyboard shortcuts (e.g., Ctrl+S to save)

---

## Support & Maintenance

If updates fail, verify that:
- `updateGroundFacilities` is correctly exported from `@/actions/groundfacilitiesActions`
- `GroundFacilitiesSchema` is properly configured in `@/lib/validation/groundfacilities`
- Ground facility object structure matches expected format (`_id`, `facilities`, `description`)
- Form submission is not blocked by validation errors
