# ManagerDropdown Component Documentation

## Component Purpose

The `ManagerDropdown` component is a reusable React dropdown that displays available managers and allows users to select one using a standard HTML select element. It fetches manager data from an API and provides a simple, controlled selection experience.

**Key Responsibility:** Render a manager selection dropdown for forms requiring manager assignment.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/ManagerDropdown.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `manager` (string), `clienterror` (string) |
| **Dependencies** | `useState`, `useEffect` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/managers` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `manager` | `String` | No | Pre-selected manager ID to initialize the dropdown |
| `clienterror` | `String` | No | Error message to display below the dropdown |

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `managers` | `Array` | `[]` | List of all available managers fetched from API |
| `selectedClub` | `String` | `props.manager ? props.manager : ''` | Currently selected manager ID |

---

## Key Features

- Dynamically fetches manager list from API on mount
- Standard HTML select dropdown (no enhanced features)
- Pre-selects manager based on props
- Controlled component with change handler
- Form-integrated (field name is `manager`)
- Bootstrap styling integration
- Error message display support

---

## Component Structure

```jsx
export default function ManagerDropdown(props) {
  // State setup
  // API fetch effect

  return (
    <div className="left-info-box">
      <div className="left-row row">
        {/* Label column */}
        <div className="left-info-col">
          <select name="manager" value={selectedClub} onChange={...}>
            {/* Manager options */}
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
onChange={(e) => setSelectedClub(e.target.value)}
```

**Purpose:** Updates the `selectedClub` state when user selects a different manager.

**Behavior:** Standard select onChange handler that updates component state.

---

## Rendering Logic

### Select Element

```jsx
<select
  className="form-control"
  name="manager"
  value={selectedClub}
  onChange={(e) => setSelectedClub(e.target.value)}
>
  <option value="">Choose a Mansger</option>
  {managers.map((manager) => (
    <option key={manager._id} value={manager._id}>
      {manager.name}
    </option>
  ))}
</select>
```

**Features:**
- Standard HTML select element (no TomSelect enhancement)
- Form field name: `manager`
- Controlled component using `value` and `onChange`
- Options populated from API data
- Unique keys based on manager `_id`
- Display text uses `manager.name`

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

---

## API Integration

### Managers Endpoint

**URL:** `/api/managers`  
**Method:** `GET`  
**Response Format:**

```json
{
  "managers": [
    {
      "_id": "manager-id-1",
      "name": "John Smith"
    },
    {
      "_id": "manager-id-2",
      "name": "Jane Doe"
    }
  ]
}
```

**Error Handling:** Errors are logged to console but don't affect UI; component renders with empty dropdown if API fails.

---

## Usage Example

### Basic Usage (No Pre-selection)

```jsx
import ManagerDropdown from '@/components/ManagerDropdown';

export default function TeamForm() {
  return <ManagerDropdown />;
}
```

### With Pre-selected Manager

```jsx
import ManagerDropdown from '@/components/ManagerDropdown';

export default function EditTeamForm({ team }) {
  return <ManagerDropdown manager={team.manager} />;
}
```

### With Error Display

```jsx
import ManagerDropdown from '@/components/ManagerDropdown';

export default function TeamForm({ errors }) {
  return <ManagerDropdown clienterror={errors.manager} />;
}
```

### In a Form

```jsx
<form onSubmit={handleSubmit}>
  <ManagerDropdown manager={existingManagerId} clienterror={errors.manager} />
  <input type="submit" value="Save" />
</form>
```

When submitted, the form will include the selected manager ID as `manager` parameter.

---

## Form Submission Integration

When used inside a form, the selected manager contributes to form submission:

```javascript
// If manager with ID "manager-123" is selected
const formData = new FormData(form);
// formData will include:
// manager: "manager-123"

// When converted to object:
// { manager: "manager-123" }
```

---

## Behavior Notes

- Component fetches managers on mount only (does not refetch on prop changes)
- Pre-selected state is set during initial render
- Standard HTML select (no search or sorting features)
- Component uses controlled pattern with `value` and `onChange`
- Selection state is maintained in component state

---

## Known Issues / Considerations

1. **Variable Name Confusion:** `selectedClub` should be `selectedManager` for clarity

2. **Function Name Mismatch:** `fetchClubs` function fetches managers (should be `fetchManagers`)

3. **Typo in Placeholder:** "Choose a Mansger" should be "Choose a Manager"

4. **Silent Error Handling:** API errors are logged but don't provide user feedback

5. **No Loading State:** Component doesn't show loading indicator while fetching managers

6. **No Enhanced Features:** Unlike other dropdowns, this doesn't use TomSelect for better UX

---

## Accessibility Considerations

- Standard select element with proper labeling
- Error messages are associated with the input
- Keyboard navigation works with standard select behavior

---

## Future Enhancements

- [ ] Rename `selectedClub` to `selectedManager` for clarity
- [ ] Rename `fetchClubs` to `fetchManagers`
- [ ] Fix typo: "Choose a Mansger" → "Choose a Manager"
- [ ] Add loading indicator while fetching managers
- [ ] Add error message if API request fails
- [ ] Consider upgrading to TomSelect for better UX
- [ ] Add manager search/filtering
- [ ] Add manager details preview on selection

---

## Support & Maintenance

- Verify that `/api/managers` endpoint returns the expected structure
- Ensure managers are stored with `_id` and `name` properties
- Monitor for prop updates that won't be reflected in component state
- Consider adding error handling and user feedback for API failures
- Consider upgrading to TomSelect for consistency with other dropdowns
