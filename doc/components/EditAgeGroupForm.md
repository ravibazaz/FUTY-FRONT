# EditAgeGroupForm Component Documentation

## Component Purpose

The `EditAgeGroupForm` component is a React form used to edit age group information in the FUTY admin portal. It supports updating the age group title and description with client-side and server-side validation.

**Key Responsibility:** Provide admin users with a simple age group editing interface for managing age group names and descriptions.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditAgeGroupForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `agegroups` object |
| **Related Models** | Age Groups |
| **Related Actions** | `updateAgeGroups` server action |
| **Dependencies** | `next/image`, `next/link`, `AgeGroupSchema`, `useActionState`, `useFormStatus` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `agegroups` | `Object` | Yes | Existing age group data used to prefill the form |

### Expected Age Groups Object Structure

```javascript
{
  _id: String,
  age_group: String,      // Age group title/name
  description: String     // Age group description
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

- Editable age group title/name field
- Editable age group description textarea
- Client-side validation via `AgeGroupSchema`
- Server-side validation via `updateAgeGroups` action
- Inline validation message rendering
- Simple two-field form for quick edits
- Asynchronous form submission with loading state

---

## Form Fields

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Title | `age_group` | `text` | Required (schema rules apply) |
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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/agegroups">
        Back
      </Link>
    </>
  );
}
```

**Features:**
- Submit button displays "Editing" when form is submitting, "Save" otherwise
- Submit button is disabled while submission is pending
- Back link navigates to `/admin/agegroups` list
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
  const result = AgeGroupSchema(true).safeParse(
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

**Purpose:** Runs validation and submits the age group update.

**Behavior:**
- Prevents default form submission
- Creates `FormData` from form inputs
- Validates all fields using `AgeGroupSchema`
- Displays client-side errors if validation fails
- Clears error state if validation passes
- Submits via server action using `startTransition`

---

## Rendering Logic

### Age Group Title Field

```jsx
<input 
  className="form-control" 
  name="age_group" 
  defaultValue={agegroups.age_group} 
  type="text"
/>
```

- Prefilled with existing age group name
- Text input type
- Validation errors displayed inline below input

### Description Field

```jsx
<textarea 
  className="form-control" 
  defaultValue={agegroups.description} 
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
| `.btn-common-text` — Submit button styling |
| `.mt-30`, `.mb-30`, `.ps-3` — Spacing utilities |

### Responsive Layout

- `.col-md-5`, `.col-lg-4`, `.col-xl-4` — Label column (responsive)
- `.col-md-7`, `.col-lg-8`, `.col-xl-8` — Input column (responsive)

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateAgeGroups` | Server action for age group update (bound to agegroups._id) |
| `AgeGroupSchema` | Zod validation schema |
| `useFormStatus` | Submit status display |
| `useActionState` | Handles action state |
| `Image` | Next.js image rendering (currently unused) |
| `Link` | Navigation back to admin list |

---

## Usage Example

```jsx
import EditAgeGroupForm from '@/components/EditAgeGroupForm';

export default function AgeGroupEditPage({ agegroups }) {
  return <EditAgeGroupForm agegroups={agegroups} />;
}
```

---

## Behavior Notes

- The form prefills both fields with existing age group data via `defaultValue` attributes
- Form uses uncontrolled component pattern with `defaultValue` (not `value`)
- Validation occurs on form submission, not on individual field changes
- Both client-side and server-side validation are performed
- `fileInputRef` and `previewsRef` are declared but unused (legacy code cleanup opportunity)
- Form uses `startTransition` for better loading state handling
- No success message is shown after save (delegates to parent or server action)

---

## Known Issues / Considerations

1. **Typo in Label:** "Descripton" should be "Description"

2. **Unused Refs:** `fileInputRef` and `previewsRef` are declared but never used (likely copied from other forms)

3. **No Image Support:** Unlike other edit forms, this component doesn't support image uploads despite having image-related refs

---

## Validation

The `AgeGroupSchema` validates:
- Required fields: likely `age_group`
- Optional fields: likely `description`
- Field-specific rules defined in schema

---

## Future Enhancements

- [ ] Fix typo: "Descripton" → "Description"
- [ ] Remove unused `fileInputRef` and `previewsRef` refs
- [ ] Add success toast notification after save
- [ ] Add age range validation (min/max age fields)
- [ ] Add age group ordering/priority
- [ ] Add form auto-save functionality
- [ ] Consider adding image support if age groups need icons

---

## Support & Maintenance

If updates fail, verify that:
- `updateAgeGroups` is correctly exported from `@/actions/agegroupActions`
- `AgeGroupSchema` is properly configured in `@/lib/validation/agegroups`
- Age group object structure matches expected format (`_id`, `age_group`, `description`)
- Form submission is not blocked by validation errors
