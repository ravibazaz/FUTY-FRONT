# EditManagerForm Component Documentation

## Component Purpose

The `EditManagerForm` component is a React form component for editing manager information in the FUTY application. It handles comprehensive manager profile management including personal details, team assignment, performance statistics, contact information, and profile image upload with real-time preview and client-side validation. The component features dynamic team selection with automatic display of league and club information.

**Key Responsibility:** Provide an editable interface for comprehensive manager profile management with team relationships and validation.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditMangerForm.jsx` |
| **Type** | Client-Side React Component |
| **Framework** | Next.js with React Server Components |
| **Props** | `user` object containing existing manager data |
| **Related Models** | Managers, Teams, Clubs, Leagues |
| **Related Actions** | `updateManager` server action |
| **Related Components** | `SubmitButton` component |
| **External Libraries** | TomSelect for enhanced dropdowns |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `Object` | Yes | Manager data object with existing information |

### Manager Object Structure

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  telephone: String,
  post_code: String,
  travel_distance: String,
  team_id: {
    _id: ObjectId,
    name: String,
    club: {
      name: String,
      league: {
        title: String
      }
    }
  },
  profile_description: String,
  nick_name: String,
  playing_style: {
    win: { percentage: Number },
    style: { percentage: Number },
    trophy: { percentage: Number }
  },
  profile_image: String (URL path)
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `teams` | `Array` | `[]` | All available teams for selection |
| `showPassword` | `Boolean` | `false` | Password visibility toggle |
| `selectedClub` | `String` | Current club name | Display selected club |
| `selectedLeague` | `String` | Current league name | Display selected league |
| `selectedTeam` | `String` | Current team ID | Selected team for form |
| `preview` | `String` | Manager image or default | Image preview URL |
| `clientErrors` | `Object` | `{}` | Form validation errors |
| `state` | `Object` | Server action state | Form submission state |

---

## Key Features

### 1. **Dynamic Team Selection**
- Fetches all available teams on component mount
- TomSelect enhanced dropdown with search and sorting
- Automatic display of league and club information
- Pre-selection for existing team assignment

### 2. **Performance Statistics**
- Win percentage, style percentage, and trophy percentage
- Input validation with range constraints (0-100)
- Character limit enforcement for numeric inputs

### 3. **Contact Information Management**
- Email with uniqueness validation
- Telephone and postcode fields
- Travel distance specification

### 4. **Profile Management**
- Profile description textarea
- Nickname field
- Profile image upload with preview

### 5. **Password Management**
- Optional password update
- Password visibility toggle with eye icon
- Secure password input handling

### 6. **Email Uniqueness Validation**
- API-based email uniqueness check
- Prevents duplicate email addresses
- Client-side error display

### 7. **Image Upload & Preview**
- File input validation for image types only
- Real-time image preview display
- Preserves existing image if no new image uploaded
- Default profile picture fallback

---

## Form Fields

### Personal Information

| Field | Name | Type | Validation | Notes |
|-------|------|------|-----------|-------|
| Name | `name` | `text` | Required | Manager's full name |
| Email | `email` | `email` | Required, unique | Email uniqueness validation |
| Telephone | `telephone` | `text` | Required | Contact telephone |
| Postcode | `post_code` | `text` | Optional | Postal code |
| Travel Distance | `travel_distance` | `text` | Optional | Travel distance specification |

### Team Assignment

| Field | Name | Type | Validation | Notes |
|-------|------|------|-----------|-------|
| Team | `team_id` | select (TomSelect) | Required | Team selection with league/club display |

### Profile Information

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Profile Description | `profile_description` | `textarea` | Optional |
| Nickname | `nick_name` | `text` | Optional |

### Performance Statistics

| Field | Name | Type | Validation | Range |
|-------|------|------|-----------|-------|
| Win % | `win` | `number` | 0-100 | 0-100 |
| Style % | `style` | `number` | 0-100 | 0-100 |
| Trophies % | `trophy` | `number` | 0-100 | 0-100 |

### Security

| Field | Name | Type | Validation | Notes |
|-------|------|------|-----------|-------|
| Password | `password` | `password` | Optional | Password visibility toggle |

### Media

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Profile Image | `profile_image` | file | Image format only, 3MB max |

---

## Component Structure

### Sub-Component: SubmitButton

```javascript
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" className="btn-common-text" disabled={pending}>
        {pending ? "Editing" : "Save"}
      </button>
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/managers">
        Back
      </Link>
    </>
  );
}
```

---

## Dynamic Team Selection

### Teams Data Fetching
```javascript
useEffect(() => {
  fetch(`/api/teams`)
    .then(res => res.json())
    .then(data => {
      setTeams(data.teams);
    });
}, []);
```

### TomSelect Initialization
```javascript
useEffect(() => {
  if (!selectRef.current || teams.length === 0) return;

  tomSelectRef.current = new TomSelect(selectRef.current, {
    create: false,
    placeholder: "Choose a Team",
    sortField: { field: "text", direction: "asc" },
    onChange: (value) => {
      const selectedOption = selectRef.current.querySelector(
        `option[value="${value}"]`
      );
      const clubName = selectedOption.dataset.club || "";
      const leagueName = selectedOption.dataset.league || "";
      setSelectedClub(clubName);
      setSelectedLeage(leagueName);
    },
  });

  if (selectedTeam) {
    tomSelectRef.current.setValue(selectedTeam, true);
  }
}, [teams]);
```

### Team Options Rendering
```javascript
{teams.map((team) => (
  <option
    key={team._id}
    data-club={team?.club?.name}
    data-league={team?.club?.league?.title}
    value={team._id}
  >
    {team.name}
  </option>
))}
```

---

## Methods & Handlers

### Password Visibility Toggle
```javascript
const [showPassword, setShowPassword] = useState(false);
// Toggle with: setShowPassword((prev) => !prev)
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
  const imageFile = e.target.profile_image.files[0];
  if (imageFile) {
    formData.set("profile_image", imageFile);
  } else {
    formData.delete("profile_image");
  }

  // Zod validation
  const result = ManagersSchema(true).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    setClientErrors(result.error.flatten().fieldErrors);
    return;
  }

  // Email uniqueness check
  const res = await fetch(
    `/api/check-email?email=${raw.email}&id=${user._id}`
  );
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

---

## API Integration

### Teams API
```
GET /api/teams
```
**Response:**
```javascript
{
  teams: [
    {
      _id: ObjectId,
      name: String,
      club: {
        name: String,
        league: {
          title: String
        }
      }
    }
  ]
}
```

### Email Uniqueness Check API
```
GET /api/check-email?email=${email}&id=${userId}
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
- `.left-row` - Row layout
- `.left-label-col` - Label column
- `.left-info-col` - Input column
- `.upload-box` - Image upload area
- `.password-container` - Password input container
- `.eye-icon` - Password visibility toggle
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
| `updateManager` server action | Form submission handler |
| `ManagersSchema` validation | Zod schema for form validation |
| `useFormStatus` React DOM | Submit button state tracking |
| `useActionState` React | Server action state management |
| `TomSelect` library | Enhanced dropdown selection |
| `useState`, `useRef`, `useEffect` React | State and lifecycle management |
| `Image` Next.js | Optimized image component |
| `Link` Next.js | Navigation links |

---

## Usage Example

```javascript
import EditManagerForm from '@/components/EditMangerForm';

// In a server component or page
export default function ManagerEditPage({ params }) {
  const manager = await fetchManager(params.managerId);

  return <EditManagerForm user={manager} />;
}
```

---

## Error Handling

### Client-Side Validation Errors
- Zod schema validation errors
- Email uniqueness validation errors
- Image upload validation errors
- Required field validation

### API Error Handling
- Teams fetch errors
- Email uniqueness check errors
- Form submission errors handled by server action

### TomSelect Error Handling
- Graceful degradation if TomSelect fails to initialize
- Cleanup on component unmount

---

## Features & Capabilities

### 1. **Team Assignment Management**
- Comprehensive team selection with search
- Automatic league and club information display
- Pre-selection for existing assignments
- Enhanced dropdown with sorting

### 2. **Performance Tracking**
- Multiple performance metrics (win, style, trophy percentages)
- Input validation with range constraints
- Visual feedback for valid ranges

### 3. **Contact Information**
- Complete contact details management
- Email uniqueness validation
- Optional postcode and travel distance

### 4. **Profile Customization**
- Rich profile description
- Nickname support
- Professional image upload

### 5. **Security Features**
- Optional password updates
- Password visibility toggle
- Secure form handling

### 6. **Data Integrity**
- Email uniqueness enforcement
- Comprehensive validation
- Prevents invalid data submission

---

## Technical Details

### Form Encoding
- Uses `FormData` for multipart/form-data encoding
- Handles file uploads properly
- Converts to object for validation

### Server Action Binding
```javascript
const [state, formAction] = useActionState(
  updateManager.bind(null, user._id),
  { success: null, errors: {} }
);
```

### Image Preview Generation
- Uses FileReader API with `readAsDataURL`
- Creates data URL for preview
- Displayed via Next.js Image component

### TomSelect Lifecycle
- Initialization when teams data loads
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
| **API Calls** | Teams fetch on mount, email uniqueness check |
| **Bundle Size** | TomSelect library adds ~50KB |
| **Re-renders** | Multiple useEffect dependencies |
| **Image Optimization** | Next.js Image component handles optimization |
| **Form Submission** | Server action for efficient updates |

---

## Accessibility

- Form labels clearly associated with inputs
- Error messages linked to relevant fields
- TomSelect provides keyboard navigation
- Password visibility toggle with proper labeling
- Image alt text provided
- Screen reader friendly markup

---

## Future Enhancements

- [ ] Add manager role/level selection
- [ ] Include manager qualifications/certifications
- [ ] Add team history and achievements
- [ ] Implement manager performance analytics
- [ ] Add contact preferences (communication methods)
- [ ] Include emergency contact information
- [ ] Add manager availability scheduling
- [ ] Implement bulk manager operations
- [ ] Add manager feedback/rating system
- [ ] Include social media profile links

---

## Related Components

- **SubmitButton:** Form submission with loading state

---

## Related Pages

- `/admin/managers` - Managers list page
- `/admin/managers/[id]` - Manager detail page

---

## Related Server Actions

- `updateManager(managerId, formData)` - Updates manager in database

---

## Related API Endpoints

- `GET /api/teams` - Fetches all available teams
- `GET /api/check-email` - Checks email uniqueness

---

## Support & Maintenance

For questions or issues related to this component, please refer to the main project documentation or contact the development team.
