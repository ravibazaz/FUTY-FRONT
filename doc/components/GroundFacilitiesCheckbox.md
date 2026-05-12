# GroundFacilitiesCheckbox Component Documentation

## Component Purpose

The `GroundFacilitiesCheckbox` component is a reusable React checkbox list that displays available ground facilities and allows users to select multiple facilities. It fetches the facility list from an API and pre-selects facilities that are already associated with a ground.

**Key Responsibility:** Render and manage facility selection checkboxes for ground editing forms.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/GroundFacilitiesCheckbox.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `facilities` (array of facility IDs) |
| **Dependencies** | `useState`, `useEffect` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/groundfacilities` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `facilities` | `Array<String>` | No | Array of facility IDs that should be pre-checked |

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `facilities` | `Array` | `[]` | List of all available ground facilities fetched from API |
| `selectedfacilities` | `Array \| String` | `props.facilities ? props.facilities : ''` | Currently selected facility IDs (pre-populated from props) |

---

## Hooks

### useEffect

```javascript
useEffect(() => {
  const fetchFacilities = async () => {
    try {
      const response = await fetch("/api/groundfacilities");
      const data = await response.json();
      setFacilities(data.groundfacilities);
    } catch (error) {
      // Error handling (currently silent)
    }
  };
  fetchFacilities();
}, []);
```

**Purpose:** 
- Runs on component mount (dependency array is empty)
- Fetches the list of available ground facilities from the API
- Populates the `facilities` state with the response
- Silently catches and ignores errors

**Behavior:**
- Called once when component mounts
- Makes async API call to `/api/groundfacilities`
- Expected response structure: `{ groundfacilities: [...] }`

---

## Key Features

- Dynamically fetches facility list from API on mount
- Pre-selects facilities passed in via props
- Renders checkboxes for all available facilities
- Multiple facilities can be selected
- Form-integrated (checkbox name is `facilities`)
- Bootstrap form styling

---

## Rendering Logic

### Layout Structure

```
├─ left-info-box (container)
│  └─ left-row (row wrapper)
│     ├─ left-label-col (label cell)
│     │  └─ "Facilities" label
│     └─ left-info-col (input cell)
│        └─ form-check containers (one per facility)
│           ├─ form-check-input (checkbox)
│           └─ form-check-label (facility name)
```

### Checkbox Rendering

For each facility from the API:

```jsx
<div className="form-check" key={facility._id}>
  <input 
    className="form-check-input" 
    name="facilities"  
    defaultChecked={selectedfacilities.includes(facility._id)}
    type="checkbox" 
    value={facility._id} 
  />
  <label className="form-check-label">
    {facility.facilities}
  </label>
</div>
```

**Features:**
- Unique key based on facility `_id`
- Input name is `facilities` (form submission friendly)
- Value is facility `_id`
- Default checked state based on props
- Label displays facility name from `facility.facilities` property

---

## Styling & Layout

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.left-info-box` | Container block for the entire section |
| `.left-row` | Row layout wrapper |
| `.left-label-col` | Label column (left side) |
| `.left-info-col` | Input column (right side) |
| `.form-check` | Bootstrap checkbox wrapper |
| `.form-check-input` | Checkbox input styling |
| `.form-check-label` | Label styling for checkbox |
| `.label-text` | Label text styling |
| `.info-text` | Info text container |
| `.mb-0` | Remove margin-bottom |
| `.px-0` | Remove horizontal padding |

### Responsive Layout

- `.col-md-5`, `.col-lg-4`, `.col-xl-4` — Label column (responsive)
- `.col-md-7`, `.col-lg-8`, `.col-xl-8` — Input column (responsive)

---

## API Integration

### Endpoint

**URL:** `/api/groundfacilities`  
**Method:** `GET`  
**Response Format:**

```json
{
  "groundfacilities": [
    {
      "_id": "facility-id-1",
      "facilities": "Parking"
    },
    {
      "_id": "facility-id-2",
      "facilities": "Floodlights"
    },
    {
      "_id": "facility-id-3",
      "facilities": "Changing Rooms"
    }
  ]
}
```

**Error Handling:** Errors are silently caught and ignored; component renders empty list if API fails.

---

## Usage Example

### Basic Usage (No Pre-selected Facilities)

```jsx
import GroundFacilitiesCheckbox from '@/components/GroundFacilitiesCheckbox';

export default function EditGroundForm() {
  return <GroundFacilitiesCheckbox />;
}
```

### With Pre-selected Facilities

```jsx
import GroundFacilitiesCheckbox from '@/components/GroundFacilitiesCheckbox';

export default function EditGroundForm({ ground }) {
  return <GroundFacilitiesCheckbox facilities={ground.facilities} />;
}
```

### In a Form

```jsx
<form onSubmit={handleSubmit}>
  <GroundFacilitiesCheckbox facilities={existingFacilities} />
  <input type="submit" value="Save" />
</form>
```

When submitted, the form will include all checked facility IDs as `facilities[]` parameters.

---

## Form Submission Integration

When used inside a form, selected checkboxes contribute to form submission:

```javascript
// If facilities with IDs "1" and "3" are checked
const formData = new FormData(form);
// formData will include:
// facilities: "1"
// facilities: "3"

// When converted to object:
// { facilities: ["1", "3"] }
```

---

## Behavior Notes

- Component fetches facilities on mount only (does not refetch on prop changes)
- Pre-selected state is set during initial render and does not update if props change
- No explicit error handling or error state (errors silently fail)
- Checkboxes use `defaultChecked` (uncontrolled component pattern)
- Component name is `AgeCheckbox` but handles facilities (likely a copy-paste leftover)

---

## Known Issues / Considerations

1. **Name Mismatch:** Component is exported as `AgeCheckbox` but handles facilities (should be renamed to `GroundFacilitiesCheckbox` or similar for clarity)

2. **Prop Type Handling:** `selectedfacilities` state accepts both arrays and empty strings, which could cause issues:
   ```javascript
   // This handles both:
   selectedfacilities = []        // Array
   selectedfacilities = ''        // String (if props.facilities is falsy)
   
   // But includes() expects an array
   selectedfacilities.includes(facility._id)  // May fail if string
   ```

3. **Silent Error Handling:** API errors are silently ignored, resulting in an empty facility list with no user feedback

4. **No Loading State:** Component doesn't show loading indicator while fetching facilities

5. **No Prop Update:** Changing `facilities` prop after mount won't update the component

---

## Accessibility Considerations

- Checkboxes have associated labels via `form-check-label`
- Unique IDs on each facility checkbox would improve accessibility (currently missing)
- Consider adding `id` attributes to checkboxes for better label association

---

## Future Enhancements

- [ ] Rename component to `GroundFacilitiesCheckbox` (fix name mismatch)
- [ ] Add loading indicator while fetching facilities
- [ ] Add error message if API request fails
- [ ] Fix prop-based state updates (use effect to sync with props)
- [ ] Add unique `id` attributes to each checkbox for accessibility
- [ ] Convert to controlled component pattern
- [ ] Add `aria-label` attributes for better accessibility
- [ ] Add facility filtering/search
- [ ] Add max selection limit (if needed)

---

## Support & Maintenance

- Verify that `/api/groundfacilities` endpoint returns the expected structure
- Ensure facilities are stored with `_id` and `facilities` properties
- Monitor for prop updates that won't be reflected in component state
- Consider adding error handling and user feedback for API failures
