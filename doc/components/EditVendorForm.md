# EditVendorForm Component Documentation

## Component Purpose

The `EditVendorForm` component is a React form component for editing vendor information in the FUTY application. It provides an interface for managing vendor profiles including business name, contact information (email and telephone), website link, description, and vendor logo image upload with real-time preview and client-side validation.

**Key Responsibility:** Provide an editable interface for vendor profile management with validation and image handling.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditVendorForm.jsx` |
| **Type** | Client-Side React Component |
| **Framework** | Next.js with React Server Components |
| **Props** | `vendors` object containing existing vendor data |
| **Related Models** | Vendors |
| **Related Actions** | `updateVendor` server action |
| **Related Components** | `SubmitButton` component |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `vendors` | `Object` | Yes | Vendor data object with existing information |

### Vendor Object Structure

```javascript
{
  _id: ObjectId,
  name: String, // Vendor business name
  link: String, // Website URL
  email: String,
  phone: String, // Telephone number
  content: String, // Description
  image: String (URL path)
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `preview` | `String` | `vendors.image \|\| default` | Image preview URL |
| `clientErrors` | `Object` | `{}` | Form validation errors |
| `state` | `Object` | Server action state | Form submission state from server action |

---

## Key Features

### 1. **Vendor Information Management**
- Business name editing
- Website link management
- Contact information (email and telephone)
- Business description textarea

### 2. **Image Upload & Preview**
- File input validation for image types only
- Real-time image preview display
- Preserves existing image if no new image uploaded
- Default vendor badge image fallback
- Uses Next.js Image component

### 3. **Form Validation**
- Client-side validation using Zod schema (`VendorsSchema`)
- Displays inline error messages
- Prevents submission with validation errors
- Validates image before submission

### 4. **Server Integration**
- Uses `updateVendor` server action for form submission
- Binds vendor ID to action
- Uses `useFormStatus` for submit button pending state
- Handles FormData with proper file encoding

---

## Form Fields

### Basic Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Vendor Name | `name` | `text` | Required, minimum 1 character |
| Website Link | `link` | `text` | Valid URL format or empty |
| Email | `email` | `email` | Required, valid email format |
| Telephone | `phone` | `text` | Required, minimum 1 character |
| Description | `content` | `textarea` | Optional |

### Media

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Vendor Image | `image` | file | Image format only, 3MB max |

---

## Component Structure

### Sub-Component: SubmitButton

```javascript
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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/vendors">
        Back
      </Link>
    </>
  );
}
```

**Features:**
- Uses React's `useFormStatus` hook
- Shows "Editing" text while form is submitting
- Displays "Save" text normally
- Includes Back link to vendors list
- Disables submit button during submission

---

## Methods & Handlers

### handleUploadClick()
```javascript
const handleUploadClick = () => {
  fileInputRef.current.click();
};
```
**Purpose:** Triggers hidden file input when upload box is clicked

---

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
**Purpose:** Handles file selection and creates image preview

**Features:**
- Validates file is an image type
- Converts file to data URL for preview
- Updates preview state in real-time
- Only accepts image files

---

### handleSubmit(e)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // File handling
  const imageFile = e.target.image.files[0];
  if (imageFile) {
    formData.set("image", imageFile);
  } else {
    formData.delete("image");
  }

  // Zod validation
  const result = VendorsSchema(true).safeParse(
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

**Purpose:** Handles form submission with validation and image handling

**Features:**
- Prevents default form submission
- Collects FormData from form fields
- Handles image file upload logic
- Validates with VendorsSchema
- Shows client-side errors
- Uses `startTransition` for server action
- Clears errors on successful validation

---

## Styling & Layout

### CSS Classes
- `.main-body` - Main container
- `.body-top` - Top navigation bar
- `.body-title-bar` - Page title section
- `.left-info-box` - Form field container
- `.left-row` - Row layout
- `.left-label-col` - Label column
- `.left-info-col` - Input column
- `.upload-box` - Image upload area
- `.form-control` - Input styling
- `.invalid-feedback` - Error message styling
- `.btn-common-text` - Button styling

### Responsive Grid
- Mobile: Full width
- Tablet (col-md): 9/12 width for main body
- Large (col-lg): 9/12 width for main body
- Extra-Large (col-xl): 10/12 width for main body

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateVendor` server action | Form submission handler |
| `VendorsSchema` validation | Zod schema for form validation |
| `useFormStatus` React DOM | Submit button state tracking |
| `useActionState` React | Server action state management |
| `useState`, `useRef` React | Local state and refs |
| `Image` Next.js | Optimized image component |
| `Link` Next.js | Navigation links |

---

## Usage Example

```javascript
import EditVendorForm from '@/components/EditVendorForm';

// In a server component or page
export default function VendorEditPage({ params }) {
  const vendor = await fetchVendor(params.vendorId);

  return <EditVendorForm vendors={vendor} />;
}
```

---

## Error Handling

### Client-Side Validation Errors
```javascript
{clientErrors.name && (
  <span className="invalid-feedback" style={{ display: "block" }}>
    {clientErrors.name}
  </span>
)}
```

- Displays inline error messages for each field
- Prevents form submission if validation fails
- Clears errors on successful validation

### Image Upload Validation
- Validates file type is image
- Rejects non-image files
- Shows error if image validation fails

### API Errors
- Form submission errors handled by server action

---

## Features & Capabilities

### 1. **Vendor Profile Management**
- Comprehensive vendor information editing
- Contact information management
- Website link management
- Business description editing

### 2. **Real-time Updates**
- Image preview updates on file selection
- Form status updates during submission

### 3. **Data Preservation**
- Existing vendor data pre-fills all fields
- Current image displays as preview
- Existing image preserved if no new image uploaded

### 4. **Validation Integration**
- Uses Zod schema for consistent validation
- Matches server-side validation rules
- Prevents invalid data submission

### 5. **User Experience**
- Loading state on submit button
- Clear error messages
- Image preview for feedback
- Responsive layout
- Back button for easy navigation

---

## Technical Details

### Form Encoding
- Uses `FormData` for multipart/form-data encoding
- Handles file uploads properly
- Converts to object for validation

### Server Action Binding
```javascript
const [state, formAction] = useActionState(
  updateVendor.bind(null, vendors._id),
  { success: null, errors: {} }
);
```
- Binds vendor ID to server action
- Manages form submission state
- Provides default state value

### Image Preview Generation
- Uses FileReader API with `readAsDataURL`
- Creates data URL for preview
- Displayed via Next.js Image component

---

## Browser Compatibility

| Feature | Browser Support |
|---------|-----------------|
| FileReader API | All modern browsers |
| FormData | All modern browsers |
| CSS Grid | All modern browsers |
| Next.js Image | All modern browsers |

---

## Performance Considerations

| Aspect | Details |
|--------|---------|
| **Image Optimization** | Next.js Image component handles optimization |
| **Bundle Size** | Lightweight component with minimal dependencies |
| **Form Submission** | Server action for efficient updates |
| **State Updates** | Minimal re-renders with targeted state updates |

---

## Accessibility

- Form labels clearly associated with inputs
- Error messages linked to relevant fields
- Semantic HTML structure
- Keyboard navigation support
- Image alt text provided

---

## Future Enhancements

- [ ] Add drag-and-drop image upload
- [ ] Support for multiple images
- [ ] Real-time form field validation
- [ ] Auto-save draft functionality
- [ ] Success/error toast notifications
- [ ] Undo/redo for form changes
- [ ] Field-level help text
- [ ] Vendor status management (active/inactive)
- [ ] Vendor category management
- [ ] Social media links integration

---

## Related Components

- **SubmitButton:** Form submission button with loading state

---

## Related Pages

- `/admin/vendors` - Vendors list page
- `/admin/vendors/[id]` - Vendor detail page

---

## Related Server Actions

- `updateVendor(vendorId, formData)` - Updates vendor in database

---

## Related API Endpoints

- None directly (uses server actions)

---

## Support & Maintenance

For questions or issues related to this component, please refer to the main project documentation or contact the development team.
