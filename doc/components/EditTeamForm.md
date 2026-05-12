# EditTeamForm Component Documentation

## Component Purpose

The `EditTeamForm` component is a complex React form component for editing team information in the FUTY application. It handles team profile management including club association, age group selection, ground assignment, kit colors, team statistics, contact information, and profile image upload with real-time preview and client-side validation. The component features dynamic relationships between clubs and age groups, with automatic team name generation.

**Key Responsibility:** Provide an editable interface for comprehensive team profile management with complex data relationships and validation.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditTeamForm.jsx` |
| **Type** | Client-Side React Component |
| **Framework** | Next.js with React Server Components |
| **Props** | `team` object containing existing team data |
| **Related Models** | Teams, Clubs, AgeGroups, Grounds |
| **Related Actions** | `updateTeam` server action |
| **Related Components** | `ClubDropdown`, `GroundDropdown`, `SubmitButton` |
| **External Libraries** | TomSelect for enhanced dropdowns |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `team` | `Object` | Yes | Team data object with existing information |

### Team Object Structure

```javascript
{
  _id: ObjectId,
  name: String, // Auto-generated: "Club Name - Age Group"
  club: ObjectId, // Reference to club
  age_groups: ObjectId, // Reference to age group
  ground: ObjectId, // Reference to ground
  shirt: String, // Home kit shirt color
  shorts: String, // Home kit shorts color
  socks: String, // Home kit socks color
  attack: Number, // Team attack rating (0-100)
  midfield: Number, // Team midfield rating (0-100)
  defence: Number, // Team defence rating (0-100)
  email: String,
  phone: String,
  image: String (URL path)
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `clubId` | `String` | `team.club \|\| ''` | Selected club ID |
| `ageGroups` | `Array` | `[]` | Available age groups for selected club |
| `selectedage` | `String` | `team.age_groups \|\| ''` | Selected age group ID |
| `teamName` | `String` | `team.name \|\| ''` | Auto-generated team name |
| `clubName` | `String` | `''` | Current club name |
| `selectedAgeGroupId` | `String` | `''` | Selected age group ID for API calls |
| `selectedAgeName` | `String` | `''` | Formatted age group name |
| `preview` | `String` | Team image or default | Image preview URL |
| `clientErrors` | `Object` | `{}` | Form validation errors |
| `state` | `Object` | Server action state | Form submission state |

---

## Key Features

### 1. **Dynamic Club-Age Group Relationship**
- Club selection triggers age group fetching
- Age groups filtered by club's league membership
- Automatic team name generation: "Club Name - Age Group"
- Real-time updates when selections change

### 2. **Enhanced Dropdown Selection**
- TomSelect library for improved UX
- Sorted age group options
- Placeholder text and search functionality
- Pre-selection for existing data

### 3. **Team Statistics Management**
- Attack, midfield, and defence ratings (0-100)
- Input validation and character limits
- Visual feedback for valid ranges

### 4. **Kit Color Management**
- Home kit colors: shirt, shorts, socks
- Separate color inputs for each component
- Visual organization in grouped sections

### 5. **Duplicate Prevention**
- API validation to prevent duplicate club-age group combinations
- Client-side error display for existing combinations

### 6. **Image Upload & Preview**
- File input validation for image types only
- Real-time image preview display
- Preserves existing image if no new image uploaded
- Default profile picture fallback

### 7. **Form Validation**
- Client-side validation using Zod schema (`TeamSchema`)
- Server-side duplicate checking
- Displays inline error messages
- Prevents submission with validation errors

---

## Form Fields

### Team Identity

| Field | Name | Type | Validation | Notes |
|-------|------|------|-----------|-------|
| Team Name | `name` | `text` (readonly) | Auto-generated | "Club Name - Age Group" format |
| Club | `club` | dropdown | Required | ClubDropdown component |
| Age Group | `age_groups` | select (TomSelect) | Required | Filtered by club selection |
| Ground | `ground` | dropdown | Required | GroundDropdown component |

### Kit Colors (Home)

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Shirt Colour | `shirt` | `text` | Optional |
| Shorts Colour | `shorts` | `text` | Optional |
| Socks Colour | `socks` | `text` | Optional |

### Team Statistics

| Field | Name | Type | Validation | Range |
|-------|------|------|-----------|-------|
| Attack | `attack` | `number` | 0-100 | 0-100 |
| Midfield | `midfield` | `number` | 0-100 | 0-100 |
| Defence | `defence` | `number` | 0-100 | 0-100 |

### Contact Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Email | `email` | `email` | Required, valid email |
| Telephone | `phone` | `text` | Required |

### Media

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Profile Image | `image` | file | Image format only, 3MB max |

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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/teams">
        Back
      </Link>
    </>
  );
}
```

---

## Dynamic Data Flow

### Club Selection → Age Groups
```javascript
useEffect(() => {
  if (!clubId) {
    setAgeGroups([]);
    return;
  }

  fetch(`/api/clubs/age-groups?clubid=${clubId}`)
    .then(res => res.json())
    .then(data => {
      if (data.clubs.age_groups) {
        setclubName(data.clubs.name);
        setAgeGroups(data.clubs.age_groups);
      }
    });
}, [clubId]);
```

### Age Group Selection → Team Name Generation
```javascript
useEffect(() => {
  if (selectedAgeGroupId && clubName) {
    fetch(`/api/agegroups/age-groups?agegroupId=${selectedAgeGroupId}`)
      .then(res => res.json())
      .then(data => {
        const ageName = data?.agegroupname?.age_group;
        if (ageName) {
          const formattedAge = ageName
            .replace(/under\s*/i, "U")
            .replace(/\s+/g, "");
          setselectedAgeName(formattedAge);
          setTeamName(`${clubName} - ${formattedAge}`);
        }
      });
  }
}, [selectedAgeGroupId, clubName]);
```

---

## Methods & Handlers

### TomSelect Initialization
```javascript
useEffect(() => {
  if (!selectRef.current) return;

  // Destroy previous instance
  if (tomSelectRef.current) {
    tomSelectRef.current.destroy();
  }

  // Initialize new TomSelect
  if (ageGroups.length > 0) {
    tomSelectRef.current = new TomSelect(selectRef.current, {
      placeholder: "Choose an Age Group",
      sortField: { field: "text", direction: "asc" }
    });

    // Preselect if editing
    if (selectedage) {
      tomSelectRef.current.setValue(selectedage, true);
    }
  }
}, [ageGroups]);
```

### handleUploadClick()
```javascript
const handleUploadClick = () => {
  fileInputRef.current.click();
};
```

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
  const result = TeamSchema(true).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    setClientErrors(result.error.flatten().fieldErrors);
    return;
  }

  // Duplicate check
  const res = await fetch(
    `/api/teams/check-club-age?club=${raw.club}&age_groups=${raw.age_groups}&id=${team._id}`
  );
  const { exists } = await res.json();
  if (exists) {
    setClientErrors({ age_groups: ["This club and age group combination already exists"] });
    return;
  }

  setClientErrors({});
  startTransition(() => {
    formAction(formData);
  });
};
```

---

## API Integration

### Club Age Groups API
```
GET /api/clubs/age-groups?clubid=${clubId}
```
**Response:**
```javascript
{
  clubs: {
    name: "Club Name",
    age_groups: [
      { _id: ObjectId, age_group: "Under 10" },
      { _id: ObjectId, age_group: "Under 12" }
    ]
  }
}
```

### Age Group Name API
```
GET /api/agegroups/age-groups?agegroupId=${ageGroupId}
```
**Response:**
```javascript
{
  agegroupname: {
    age_group: "Under 10"
  }
}
```

### Duplicate Check API
```
GET /api/teams/check-club-age?club=${clubId}&age_groups=${ageGroupId}&id=${teamId}
```
**Response:**
```javascript
{
  exists: true|false
}
```

---

## Styling & Layout

### CSS Classes
- `.main-body` - Main container
- `.body-top` - Top navigation bar
- `.body-title-bar` - Page title section
- `.left-info-box` - Form field container
- `.left-info-box-group` - Grouped related fields
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
| `updateTeam` server action | Form submission handler |
| `TeamSchema` validation | Zod schema for form validation |
| `ClubDropdown` component | Club selection dropdown |
| `GroundDropdown` component | Ground selection dropdown |
| `useFormStatus` React DOM | Submit button state tracking |
| `useActionState` React | Server action state management |
| `TomSelect` library | Enhanced dropdown selection |
| `useState`, `useRef`, `useEffect` React | State and lifecycle management |
| `Image` Next.js | Optimized image component |
| `Link` Next.js | Navigation links |

---

## Usage Example

```javascript
import EditTeamForm from '@/components/EditTeamForm';

// In a server component or page
export default function TeamEditPage({ params }) {
  const team = await fetchTeam(params.teamId);

  return <EditTeamForm team={team} />;
}
```

---

## Error Handling

### Client-Side Validation Errors
- Zod schema validation errors
- Duplicate club-age group combination errors
- Image upload validation errors
- Required field validation

### API Error Handling
- Club age groups fetch errors
- Age group name fetch errors
- Duplicate check API errors

### TomSelect Error Handling
- Graceful degradation if TomSelect fails to initialize
- Cleanup on component unmount

---

## Features & Capabilities

### 1. **Dynamic Team Name Generation**
- Automatic name creation based on club and age group
- Formatting: "Club Name - U10" (Under 10 → U10)
- Real-time updates when selections change

### 2. **Advanced Dropdown Management**
- TomSelect for enhanced user experience
- Sorted options alphabetically
- Search and filter functionality
- Pre-selection for existing data

### 3. **Team Statistics Validation**
- Numeric input with range validation (0-100)
- Character limit enforcement
- Visual feedback for valid ranges

### 4. **Duplicate Prevention System**
- API-based validation before submission
- Prevents duplicate club-age group combinations
- User-friendly error messages

### 5. **Complex State Management**
- Multiple interdependent state variables
- useEffect chains for data fetching
- Proper cleanup and initialization

---

## Technical Details

### Form Encoding
- Uses `FormData` for multipart/form-data encoding
- Handles file uploads properly
- Converts to object for validation

### Server Action Binding
```javascript
const [state, formAction] = useActionState(
  updateTeam.bind(null, team._id),
  { success: null, errors: {} }
);
```

### Image Preview Generation
- Uses FileReader API with `readAsDataURL`
- Creates data URL for preview
- Displayed via Next.js Image component

### TomSelect Lifecycle
- Initialization when age groups change
- Proper cleanup on unmount
- Pre-selection for edit mode

---

## Browser Compatibility

| Feature | Browser Support |
|---------|-----------------|
| FileReader API | All modern browsers |
| FormData | All modern browsers |
| TomSelect | All modern browsers |
| CSS Grid/Flexbox | All modern browsers |
| Next.js Image | All modern browsers |

---

## Performance Considerations

| Aspect | Details |
|--------|---------|
| **API Calls** | Multiple API calls for dynamic data |
| **Bundle Size** | TomSelect library adds ~50KB |
| **Re-renders** | Multiple useEffect dependencies |
| **Image Optimization** | Next.js Image component handles optimization |
| **Form Submission** | Server action for efficient updates |

---

## Accessibility

- Form labels clearly associated with inputs
- Error messages linked to relevant fields
- TomSelect provides keyboard navigation
- Screen reader support for dynamic content
- Image alt text provided
- Semantic HTML structure

---

## Future Enhancements

- [ ] Add away kit color management
- [ ] Implement team logo upload separate from profile image
- [ ] Add team formation/captain selection
- [ ] Include team history and achievements
- [ ] Add bulk team creation for multiple age groups
- [ ] Implement team transfer/player management
- [ ] Add team statistics tracking over time
- [ ] Include social media links
- [ ] Add team sponsor information
- [ ] Implement team merge/split functionality

---

## Related Components

- **ClubDropdown:** Club selection with search
- **GroundDropdown:** Ground selection with search
- **SubmitButton:** Form submission with loading state

---

## Related Pages

- `/admin/teams` - Teams list page
- `/admin/teams/[id]` - Team detail page

---

## Related Server Actions

- `updateTeam(teamId, formData)` - Updates team in database

---

## Related API Endpoints

- `GET /api/clubs/age-groups` - Fetches age groups for a club
- `GET /api/agegroups/age-groups` - Fetches age group details
- `GET /api/teams/check-club-age` - Checks for duplicate combinations

---

## Support & Maintenance

For questions or issues related to this component, please refer to the main project documentation or contact the development team.
