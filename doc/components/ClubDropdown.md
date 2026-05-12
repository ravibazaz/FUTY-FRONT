# ClubDropdown Component Documentation

## Component Purpose

The `ClubDropdown` component is a reusable React dropdown that displays available clubs and allows users to select one using an enhanced TomSelect interface. It fetches club data from an API and provides a searchable, user-friendly selection experience with optional change callback support.

**Key Responsibility:** Render an enhanced club selection dropdown with TomSelect integration for forms requiring club assignment.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/ClubDropdown.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `club` (string), `clienterror` (string), `onClubChange` (function) |
| **Dependencies** | `useState`, `useEffect`, `useRef`, `tom-select` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/clubs` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `club` | `String` | No | Pre-selected club ID to initialize the dropdown |
| `clienterror` | `String` | No | Error message to display below the dropdown |
| `onClubChange` | `Function` | No | Callback function called when selection changes |

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `clubs` | `Array` | `[]` | List of all available clubs fetched from API |
| `selectedClub` | `String` | `props.club ? props.club : ''` | Currently selected club ID |

### Refs

| Ref | Type | Purpose |
|-----|------|---------|
| `selectRef` | `Ref<HTMLSelectElement>` | Reference to the select element for TomSelect initialization |
| `tomSelectRef` | `Ref<TomSelect>` | Reference to the TomSelect instance |

---

## Key Features

- Dynamically fetches club list from API on mount
- Enhanced dropdown with TomSelect (searchable, sortable)
- Pre-selects club based on props
- Controlled component with change handler
- Optional callback when selection changes
- Form-integrated (field name is `club`)
- Bootstrap styling integration
- Error message display support

---

## Component Structure

```jsx
export default function ClubDropdown(props) {
  // State and refs setup
  // API fetch effect
  // TomSelect initialization effects

  return (
    <div className="left-info-box">
      <div className="left-row row">
        {/* Label column */}
        <div className="left-info-col">
          <select name="club" ref={selectRef} ...>
            {/* Club options */}
          </select>
          {/* Error display */}
        </div>
      </div>
    </div>
  );
}
```

---

## Methods & Handlers

### onChange Handler

```javascript
onChange: (value) => {
  setSelectedClub(value);
  if (typeof props.onClubChange === "function") {
    props.onClubChange(value);
  }
}
```

**Purpose:** Updates the `selectedClub` state and calls the optional callback when user selects a different club.

**Behavior:** 
- Updates component state
- Calls `props.onClubChange(value)` if the callback function is provided
- Allows parent components to react to selection changes

---

## TomSelect Configuration

### Initialization

```javascript
tomSelectRef.current = new TomSelect(selectRef.current, {
  create: false,
  placeholder: "Choose a club",
  sortField: { field: "text", direction: "asc" },
  onChange: (value) => {
    setSelectedClub(value);
    if (typeof props.onClubChange === "function") {
      props.onClubChange(value);
    }
  },
});
```

**Configuration Options:**
- `create: false` — No new options can be created
- `placeholder` — Placeholder text when no selection
- `sortField` — Alphabetical sorting by display text
- `onChange` — Callback when selection changes (updates state and calls prop callback)

### Effects Management

Two useEffect hooks manage TomSelect:

1. **Clubs Load Effect:** Initializes TomSelect after clubs are fetched
2. **Selection Sync Effect:** Keeps TomSelect synced with `selectedClub` changes

---

## Rendering Logic

### Select Element

```jsx
<select
  className="form-control"
  name="club"
  ref={selectRef}
  defaultValue={selectedClub}
>
  <option value="">Choose a club</option>
  {clubs.map((club) => (
    <option key={club._id} value={club._id}>
      {club.name}
    </option>
  ))}
</select>
```

**Features:**
- Standard HTML select element enhanced by TomSelect
- Form field name: `club`
- Options populated from API data
- Unique keys based on club `_id`
- Display text uses `club.name`

### Error Display

```jsx
{props.clienterror && (
  <span className="invalid-feedback" style={{ display: "block" }}>
    {props.clienterror}
  </span>
)}
```

**Behavior:** Shows error message passed via props below the dropdown.

---

## Styling & Layout

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.left-info-box` | Container block for the entire section |
| `.left-row` | Row layout wrapper |
| `.left-label-col` | Label column (left side) |
| `.left-info-col` | Input column (right side) |
| `.form-control` | Standard select styling |
| `.invalid-feedback` | Error message styling |
| `.label-text` | Label text styling |
| `.info-text` | Info text container |
| `.mb-0` | Remove margin-bottom |
| `.px-0` | Remove horizontal padding |

### Responsive Layout

- `.col-md-5`, `.col-lg-4`, `.col-xl-4` — Label column (responsive)
- `.col-md-7`, `.col-lg-8`, `.col-xl-8` — Input column (responsive)

### TomSelect Styling

- Uses `tom-select/dist/css/tom-select.bootstrap5.css`
- Integrates with Bootstrap 5 styling

---

## API Integration

### Clubs Endpoint

**URL:** `/api/clubs`  
**Method:** `GET`  
**Response Format:**

```json
{
  "clubs": [
    {
      "_id": "club-id-1",
      "name": "Manchester United FC"
    },
    {
      "_id": "club-id-2",
      "name": "Liverpool FC"
    }
  ]
}
```

**Error Handling:** Errors are logged to console but don't affect UI; component renders with empty dropdown if API fails.

---

## Usage Example

### Basic Usage (No Pre-selection)

```jsx
import ClubDropdown from '@/components/ClubDropdown';

export default function PlayerForm() {
  return <ClubDropdown />;
}
```

### With Pre-selected Club

```jsx
import ClubDropdown from '@/components/ClubDropdown';

export default function EditPlayerForm({ player }) {
  return <ClubDropdown club={player.club} />;
}
```

### With Change Callback

```jsx
import ClubDropdown from '@/components/ClubDropdown';

export default function TeamForm() {
  const handleClubChange = (clubId) => {
    console.log('Selected club:', clubId);
    // Perform additional logic
  };

  return <ClubDropdown onClubChange={handleClubChange} />;
}
```

### With Error Display

```jsx
import ClubDropdown from '@/components/ClubDropdown';

export default function PlayerForm({ errors }) {
  return <ClubDropdown clienterror={errors.club} />;
}
```

### In a Form

```jsx
<form onSubmit={handleSubmit}>
  <ClubDropdown club={existingClubId} clienterror={errors.club} />
  <input type="submit" value="Save" />
</form>
```

When submitted, the form will include the selected club ID as `club` parameter.

---

## Form Submission Integration

When used inside a form, the selected club contributes to form submission:

```javascript
// If club with ID "club-123" is selected
const formData = new FormData(form);
// formData will include:
// club: "club-123"

// When converted to object:
// { club: "club-123" }
```

---

## Behavior Notes

- Component fetches clubs on mount only (does not refetch on prop changes)
- Pre-selected state is set during initial render and synced with TomSelect
- TomSelect provides search and sorting functionality
- Component uses controlled pattern with `onChange` handler
- Selection state is maintained in component state and synced with TomSelect
- Optional `onClubChange` callback allows parent components to react to changes

---

## Known Issues / Considerations

1. **Silent Error Handling:** API errors are logged but don't provide user feedback

2. **No Loading State:** Component doesn't show loading indicator while fetching clubs

3. **Prop Update Handling:** Changing `club` prop after mount may not update the component properly

4. **Callback Safety:** The component checks if `onClubChange` is a function before calling it

---

## Accessibility Considerations

- TomSelect provides keyboard navigation and screen reader support
- Select element has proper labeling
- Error messages are associated with the input

---

## Future Enhancements

- [ ] Add loading indicator while fetching clubs
- [ ] Add error message if API request fails
- [ ] Improve prop update handling (use effect to sync with props)
- [ ] Add club filtering/search beyond TomSelect
- [ ] Add club details preview on selection
- [ ] Add max selection limit (if needed)
- [ ] Add club creation option in TomSelect

---

## Support & Maintenance

- Verify that `/api/clubs` endpoint returns the expected structure
- Ensure clubs are stored with `_id` and `name` properties
- Monitor for prop updates that won't be reflected in component state
- Consider adding error handling and user feedback for API failures
- Ensure TomSelect is properly installed: `npm install tom-select`
