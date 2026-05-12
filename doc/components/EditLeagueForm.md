# EditLeagueForm Component Documentation

## Component Purpose

The `EditLeagueForm` component is a React form component for editing league information in the FUTY application. It handles league profile management including title, leadership details (president, chairman, secretary), contact information, website, description, age groups selection, and league badge image upload with real-time image preview and client-side validation.

**Key Responsibility:** Provide an editable interface for league profile management with validation and image handling.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditLeagueForm.jsx` |
| **Type** | Client-Side React Component |
| **Framework** | Next.js with React Server Components |
| **Props** | `league` object containing existing league data |
| **Related Models** | Leagues, AgeGroups |
| **Related Actions** | `updateLeague` server action |
| **Related Components** | `AgeCheckbox` component |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `league` | `Object` | Yes | League data object with existing information |

### League Object Structure

```javascript
{
  _id: ObjectId,
  title: String,
  p_name: String, // President name
  c_name: String, // Chairman name
  s_name: String, // Secretary name
  email: String,
  telephone: String,
  website: String,
  content: String, // Description
  age_groups: [ObjectId], // Array of age group IDs
  image: String (URL path)
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `preview` | `String` | `league.image \|\| default` | Image preview URL |
| `clientErrors` | `Object` | `{}` | Form validation errors |
| `state` | `Object` | Server action state | Form submission state from server action |

---

## Key Features

### 1. **Leadership Information**
- President, Chairman, and Secretary details
- Contact information for each role
- Email and telephone validation

### 2. **Age Groups Management**
- Uses `AgeCheckbox` component for age group selection
- Fetches all available age groups from API
- Multi-select checkboxes for league age groups
- Pre-selects existing league age groups

### 3. **Image Upload & Preview**
- File input validation for image types only
- Real-time image preview display
- Preserves existing image if no new image uploaded
- Default league badge image fallback
- Uses Next.js Image component

### 4. **Form Validation**
- Client-side validation using Zod schema (`LeaguesSchema`)
- Displays inline error messages
- Prevents submission with validation errors
- Validates image before submission

### 5. **Server Integration**
- Uses `updateLeague` server action for form submission
- Binds league ID to action
- Uses `useFormStatus` for submit button pending state
- Handles FormData with proper file encoding

---

## Form Fields

### Basic Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Title | `title` | `text` | Required, minimum 1 character |
| Website | `website` | `text` | Valid URL format or empty |
| Description | `content` | `textarea` | Optional |

### Leadership Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| President Name | `p_name` | `text` | Required, minimum 1 character |
| Chairman Name | `c_name` | `text` | Required, minimum 1 character |
| Chairman Email | `email` | `email` | Required, valid email format |
| Chairman Telephone | `telephone` | `number` | Required, minimum 1 character |
| Secretary Name | `s_name` | `text` | Required, minimum 1 character |

### Organization

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Age Groups | `age_groups` | checkboxes | Multi-select from AgeCheckbox component |

### Media

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| League Image | `image` | file | Image format only, 3MB max |

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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/leagues">
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
- Includes Back link to leagues list
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
  const result = LeaguesSchema(true).safeParse(
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
- Validates with LeaguesSchema
- Shows client-side errors
- Uses `startTransition` for server action
- Clears errors on successful validation

---

## AgeCheckbox Component Integration

### AgeCheckbox Component
The `EditLeagueForm` includes the `AgeCheckbox` component for managing league age groups:

```javascript
<AgeCheckbox age_groups={league.age_groups}></AgeCheckbox>
```

**AgeCheckbox Features:**
- Fetches all available age groups from `/api/agegroups`
- Displays checkboxes for multi-select
- Pre-selects existing league age groups
- Submits selected age group IDs as `age_groups` array

**API Integration:**
```
GET /api/agegroups
```

**Response Format:**
```javascript
{
  agegroups: [
    { _id: ObjectId, age_group: "U-10" },
    { _id: ObjectId, age_group: "U-12" },
    ...
  ]
}
```

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
- Tablet (col-md): 7/12 width for left section
- Large (col-lg): 8/12 width for left section
- Extra-Large (col-xl): 7/10 width for main body

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateLeague` server action | Form submission handler |
| `LeaguesSchema` validation | Zod schema for form validation |
| `useFormStatus` React DOM | Submit button state tracking |
| `useActionState` React | Server action state management |
| `useState`, `useRef` React | Local state and refs |
| `Image` Next.js | Optimized image component |
| `Link` Next.js | Navigation links |
| `AgeCheckbox` component | Age group selection |

---

## Usage Example

```javascript
import EditLeagueForm from '@/components/EditLeagueForm';

// In a server component or page
export default function LeagueEditPage({ params }) {
  const league = await fetchLeague(params.leagueId);

  return <EditLeagueForm league={league} />;
}
```

---

## Error Handling

### Client-Side Validation Errors
```javascript
{clientErrors.title && (
  <span className="invalid-feedback" style={{ display: "block" }}>
    {clientErrors.title}
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
- AgeCheckbox handles fetch errors silently
- Form submission errors handled by server action

---

## Features & Capabilities

### 1. **Leadership Management**
- Comprehensive leadership structure (President, Chairman, Secretary)
- Contact information for each role
- Email and telephone validation

### 2. **Age Group Organization**
- Dynamic age group selection
- Multi-select checkboxes
- Pre-populated with existing selections
- Fetched from centralized API

### 3. **Real-time Updates**
- Image preview updates on file selection
- Form status updates during submission
- Age groups loaded on component mount

### 4. **Data Preservation**
- Existing league data pre-fills all fields
- Selected age groups are checked
- Current image displays as preview
- Existing image preserved if no new image uploaded

### 5. **Validation Integration**
- Uses Zod schema for consistent validation
- Matches server-side validation rules
- Prevents invalid data submission

### 6. **User Experience**
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
  updateLeague.bind(null, league._id),
  { success: null, errors: {} }
);
```
- Binds league ID to server action
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
| **API Calls** | Age groups fetched once on mount |

---

## Accessibility

- Form labels clearly associated with inputs
- Error messages linked to relevant fields
- Semantic HTML structure
- Keyboard navigation support
- Image alt text provided
- Checkbox labels properly associated

---

## Future Enhancements

- [ ] Add drag-and-drop image upload
- [ ] Support for multiple images
- [ ] Real-time form field validation
- [ ] Auto-save draft functionality
- [ ] Success/error toast notifications
- [ ] Undo/redo for form changes
- [ ] Field-level help text
- [ ] Loading skeleton for age groups
- [ ] League status management (active/inactive)

---

## Related Components

- **AgeCheckbox:** Age group selection component
- **SubmitButton:** Form submission button with loading state

---

## Related Pages

- `/admin/leagues` - Leagues list page
- `/admin/leagues/[id]` - League detail page

---

## Related Server Actions

- `updateLeague(leagueId, formData)` - Updates league in database

---

## Related API Endpoints

- `GET /api/agegroups` - Fetches all available age groups

---

## Support & Maintenance

For questions or issues related to this component, please refer to the main project documentation or contact the development team.
