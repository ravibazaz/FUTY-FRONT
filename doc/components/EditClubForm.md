# EditClubForm Component Documentation

## Component Purpose

The `EditClubForm` component is a React form component for editing club information in the FUTY application. It handles club profile management including name, contact details, secretary information, league association, age groups, and club badge image upload with real-time image preview and client-side validation.

**Key Responsibility:** Provide an editable interface for club profile management with validation and image handling.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditClubForm.jsx` |
| **Type** | Client-Side React Component |
| **Framework** | Next.js with React Server Components |
| **Props** | `club` object containing existing club data |
| **Related Models** | Clubs, Leagues, AgeGroups |
| **Related Actions** | `updateClub` server action |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `club` | `Object` | Yes | Club data object with existing information |

### Club Object Structure

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  secretary_name: String,
  secretary_website: String,
  secretary_email: String,
  cwo_name: String,
  cwo_email: String,
  cwo_phone: String,
  league: ObjectId,
  age_groups: [ObjectId],
  image: String (URL path)
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `leagueId` | `String` | `club.league \|\| ''` | Selected league for filtering age groups |
| `ageGroups` | `Array` | `[]` | Available age groups for selected league |
| `selectedage` | `String/Array` | `club.age_groups` | Currently selected age groups |
| `preview` | `String` | `club.image \|\| default` | Image preview URL |
| `clientErrors` | `Object` | `{}` | Form validation errors |
| `state` | `Object` | Server action state | Form submission state from server action |

---

## Key Features

### 1. **Dynamic Age Groups**
- Age groups populate based on selected league
- Fetches from `/api/leagues/age-groups` endpoint
- Updates automatically when league changes
- Displays checkboxes for multi-select

### 2. **Image Upload & Preview**
- File input validation for image types only
- Real-time image preview display
- Preserves existing image if no new image uploaded
- Default club badge image fallback
- Uses Next.js Image component

### 3. **Form Validation**
- Client-side validation using Zod schema (`ClubSchema`)
- Displays inline error messages
- Prevents submission with validation errors
- Validates image before submission

### 4. **Server Integration**
- Uses `updateClub` server action for form submission
- Binds club ID to action
- Uses `useFormStatus` for submit button pending state
- Handles FormData with proper file encoding

---

## Form Fields

### Basic Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Name | `name` | `text` | Required |
| Secretary Email | `email` | `email` | Email format validation |
| Secretary Phone | `phone` | `text` | Phone format validation |

### Secretary Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Secretary Name | `secretary_name` | `text` | Optional |
| Club Website | `secretary_website` | `text` | URL format |

### CWO (Chief Welfare Officer) Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| CWO Name | `cwo_name` | `text` | Optional |
| CWO Email | `cwo_email` | `email` | Email format |
| CWO Phone | `cwo_phone` | `text` | Phone format |

### Organization

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| League | `league` | dropdown | Required |
| Age Groups | `age_groups` | checkboxes | Multi-select |

### Media

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Club Image | `image` | file | Image format only, 3MB max |

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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/clubs">
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
- Includes Back link to clubs list
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
  const result = ClubSchema(true).safeParse(
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
- Validates with ClubSchema
- Shows client-side errors
- Uses `startTransition` for server action
- Clears errors on successful validation

---

## API Integration

### League Age Groups Endpoint
```
GET /api/leagues/age-groups?league={leagueId}
```

**Response Format:**
```javascript
{
  leagues: {
    age_groups: [
      { _id: ObjectId, age_group: "U-10" },
      { _id: ObjectId, age_group: "U-12" },
      ...
    ]
  }
}
```

**Usage:** Fetched when league is selected

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
| `updateClub` server action | Form submission handler |
| `ClubSchema` validation | Zod schema for form validation |
| `useFormStatus` React DOM | Submit button state tracking |
| `useActionState` React | Server action state management |
| `useState`, `useRef`, `useEffect` React | Local state and refs |
| `Image` Next.js | Optimized image component |
| `Link` Next.js | Navigation links |
| `LeagueDropdown` component | League selection |

---

## Usage Example

```javascript
import EditClubForm from '@/components/EditClubForm';

// In a server component or page
export default function ClubEditPage({ params }) {
  const club = await fetchClub(params.clubId);
  
  return <EditClubForm club={club} />;
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

### Fetch Errors
- Catches and logs errors in age groups fetch
- Silently fails without breaking form

---

## Features & Capabilities

### 1. **Real-time Updates**
- League change triggers age groups fetch
- Image preview updates on file selection
- Form status updates during submission

### 2. **Data Preservation**
- Existing club data pre-fills all fields
- Selected age groups are checked
- Current image displays as preview
- Existing image preserved if no new image uploaded

### 3. **Validation Integration**
- Uses Zod schema for consistent validation
- Matches server-side validation rules
- Prevents invalid data submission

### 4. **User Experience**
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
  updateClub.bind(null, club._id),
  { success: null, errors: {} }
);
```
- Binds club ID to server action
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
- [ ] Loading skeleton for age groups

---

## Related Components

- **LeagueDropdown:** League selection component
- **SubmitButton:** Form submission button with loading state

---

## Related Pages

- `/admin/clubs` - Clubs list page
- `/admin/clubs/[id]` - Club detail page

---

## Related Server Actions

- `updateClub(clubId, formData)` - Updates club in database

---

## Support & Maintenance

For questions or issues related to this component, please refer to the main project documentation or contact the development team.
