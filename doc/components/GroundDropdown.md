# GroundDropdown Component Documentation

## Component Purpose

The `GroundDropdown` component is a reusable React dropdown that displays available sports grounds and allows users to select one using an enhanced TomSelect interface. It fetches ground data from an API and provides a searchable, user-friendly selection experience.

**Key Responsibility:** Render an enhanced ground selection dropdown with TomSelect integration for forms requiring ground assignment.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/GroundDropdown.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `ground` (string), `clienterror` (string) |
| **Dependencies** | `useState`, `useEffect`, `useRef`, `tom-select` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/grounds` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `ground` | `String` | No | Pre-selected ground ID to initialize the dropdown |
| `clienterror` | `String` | No | Error message to display below the dropdown |

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `grounds` | `Array` | `[]` | List of all available grounds fetched from API |
| `selectedClub` | `String` | `props.ground ? props.ground : ''` | Currently selected ground ID |

### Refs

| Ref | Type | Purpose |
|-----|------|---------|
| `selectRef` | `Ref<HTMLSelectElement>` | Reference to the select element for TomSelect initialization |
| `tomSelectRef` | `Ref<TomSelect>` | Reference to the TomSelect instance |

---

## Key Features

- Dynamically fetches ground list from API on mount
- Enhanced dropdown with TomSelect (searchable, sortable)
- Pre-selects ground based on props
- Controlled component with change handler
- Form-integrated (field name is `ground`)
- Bootstrap styling integration
- Error message display support

---

## Component Structure

```jsx
export default function GroundDropdown(props) {
  // State and refs setup
  // API fetch effect
  // TomSelect initialization effects

  return (
    <div className="left-info-box">
      <div className="left-row row">
        {/* Label column */}
        <div className="left-info-col">
          <select name="ground" ref={selectRef} ...>
            {/* Ground options */}
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
}
```

**Purpose:** Updates the `selectedClub` state when user selects a different ground.

**Behavior:** Called by TomSelect when selection changes, keeps component state in sync.

---

## TomSelect Configuration

### Initialization

```javascript
tomSelectRef.current = new TomSelect(selectRef.current, {
  create: false,
  placeholder: "Choose a Ground",
  sortField: { field: "text", direction: "asc" },
  onChange: (value) => {
    setSelectedClub(value);
  },
});
```

**Configuration Options:**
- `create: false` — No new options can be created
- `placeholder` — Placeholder text when no selection
- `sortField` — Alphabetical sorting by display text
- `onChange` — Callback when selection changes

### Effects Management

Two useEffect hooks manage TomSelect:

1. **Grounds Load Effect:** Initializes TomSelect after grounds are fetched
2. **Selection Sync Effect:** Keeps TomSelect synced with `selectedClub` changes

---

## Rendering Logic

### Select Element

```jsx
<select
  className="form-control"
  name="ground"
  ref={selectRef}
  defaultValue={selectedClub}
>
  <option value="">Choose a Ground</option>
  {grounds.map((ground) => (
    <option key={ground._id} value={ground._id}>
      {ground.name}
    </option>
  ))}
</select>
```

**Features:**
- Standard HTML select element enhanced by TomSelect
- Form field name: `ground`
- Options populated from API data
- Unique keys based on ground `_id`
- Display text uses `ground.name`

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

### Grounds Endpoint

**URL:** `/api/grounds`  
**Method:** `GET`  
**Response Format:**

```json
{
  "grounds": [
    {
      "_id": "ground-id-1",
      "name": "Main Stadium"
    },
    {
      "_id": "ground-id-2",
      "name": "Training Field A"
    }
  ]
}
```

**Error Handling:** Errors are logged to console but don't affect UI; component renders with empty dropdown if API fails.

---

## Usage Example

### Basic Usage (No Pre-selection)

```jsx
import GroundDropdown from '@/components/GroundDropdown';

export default function TeamForm() {
  return <GroundDropdown />;
}
```

### With Pre-selected Ground

```jsx
import GroundDropdown from '@/components/GroundDropdown';

export default function EditTeamForm({ team }) {
  return <GroundDropdown ground={team.ground} />;
}
```

### With Error Display

```jsx
import GroundDropdown from '@/components/GroundDropdown';

export default function TeamForm({ errors }) {
  return <GroundDropdown clienterror={errors.ground} />;
}
```

### In a Form

```jsx
<form onSubmit={handleSubmit}>
  <GroundDropdown ground={existingGroundId} clienterror={errors.ground} />
  <input type="submit" value="Save" />
</form>
```

When submitted, the form will include the selected ground ID as `ground` parameter.

---

## Form Submission Integration

When used inside a form, the selected ground contributes to form submission:

```javascript
// If ground with ID "ground-123" is selected
const formData = new FormData(form);
// formData will include:
// ground: "ground-123"

// When converted to object:
// { ground: "ground-123" }
```

---

## Behavior Notes

- Component fetches grounds on mount only (does not refetch on prop changes)
- Pre-selected state is set during initial render and synced with TomSelect
- TomSelect provides search and sorting functionality
- Component uses controlled pattern with `onChange` handler
- Selection state is maintained in component state and synced with TomSelect

---

## Known Issues / Considerations

1. **Variable Name Confusion:** `selectedClub` should be `selectedGround` for clarity

2. **Silent Error Handling:** API errors are logged but don't provide user feedback

3. **No Loading State:** Component doesn't show loading indicator while fetching grounds

4. **Prop Update Handling:** Changing `ground` prop after mount may not update the component properly

---

## Accessibility Considerations

- TomSelect provides keyboard navigation and screen reader support
- Select element has proper labeling
- Error messages are associated with the input

---

## Future Enhancements

- [ ] Rename `selectedClub` to `selectedGround` for clarity
- [ ] Add loading indicator while fetching grounds
- [ ] Add error message if API request fails
- [ ] Improve prop update handling (use effect to sync with props)
- [ ] Add ground filtering/search beyond TomSelect
- [ ] Add ground details preview on selection
- [ ] Add max selection limit (if needed)

---

## Support & Maintenance

- Verify that `/api/grounds` endpoint returns the expected structure
- Ensure grounds are stored with `_id` and `name` properties
- Monitor for prop updates that won't be reflected in component state
- Consider adding error handling and user feedback for API failures
- Ensure TomSelect is properly installed: `npm install tom-select`
