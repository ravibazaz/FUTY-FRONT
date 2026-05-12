# AgeCheckbox Component Documentation

## Component Purpose

The `AgeCheckbox` component is a reusable React checkbox list that displays available age groups and allows users to select multiple age groups. It fetches the age group list from an API and pre-selects age groups that are already associated with an entity (like a team or player).

**Key Responsibility:** Render and manage age group selection checkboxes for forms requiring age group filtering or assignment.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/AgeCheckbox.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `age_groups` (array of age group IDs) |
| **Dependencies** | `useState`, `useEffect` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/agegroups` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `age_groups` | `Array<String>` | No | Array of age group IDs that should be pre-checked |

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `agegroups` | `Array` | `[]` | List of all available age groups fetched from API |
| `selectedage` | `Array \| String` | `props.age_groups ? props.age_groups : ''` | Currently selected age group IDs (pre-populated from props) |

---

## Hooks

### useEffect

```javascript
useEffect(() => {
  const fetchAgeGroups = async () => {
    try {
      const response = await fetch("/api/agegroups");
      const data = await response.json();
      setAgegroups(data.agegroups);
    } catch (error) {
      // Error handling (currently silent)
    }
  };
  fetchAgeGroups();
}, []);
```

**Purpose:** 
- Runs on component mount (dependency array is empty)
- Fetches the list of available age groups from the API
- Populates the `agegroups` state with the response
- Silently catches and ignores errors

**Behavior:**
- Called once when component mounts
- Makes async API call to `/api/agegroups`
- Expected response structure: `{ agegroups: [...] }`

---

## Key Features

- Dynamically fetches age group list from API on mount
- Pre-selects age groups passed in via props
- Renders checkboxes for all available age groups
- Multiple age groups can be selected
- Form-integrated (checkbox name is `age_groups`)
- Bootstrap form styling

---

## Rendering Logic

### Layout Structure

```
├─ left-info-box (container)
│  └─ left-row (row wrapper)
│     ├─ left-label-col (label cell)
│     │  └─ "Age Groups" label
│     └─ left-info-col (input cell)
│        └─ form-check containers (one per age group)
│           ├─ form-check-input (checkbox)
│           └─ form-check-label (age group name)
```

### Checkbox Rendering

For each age group from the API:

```jsx
<div className="form-check" key={agegroup._id}>
  <input 
    className="form-check-input" 
    name="age_groups"  
    defaultChecked={selectedage.includes(agegroup._id)}
    type="checkbox" 
    value={agegroup._id} 
  />
  <label className="form-check-label">
    {agegroup.age_group}
  </label>
</div>
```

**Features:**
- Unique key based on age group `_id`
- Input name is `age_groups` (form submission friendly)
- Value is age group `_id`
- Default checked state based on props
- Label displays age group name from `agegroup.age_group` property

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

**URL:** `/api/agegroups`  
**Method:** `GET`  
**Response Format:**

```json
{
  "agegroups": [
    {
      "_id": "age-group-id-1",
      "age_group": "Under 11"
    },
    {
      "_id": "age-group-id-2",
      "age_group": "Under 13"
    },
    {
      "_id": "age-group-id-3",
      "age_group": "Under 15"
    }
  ]
}
```

**Error Handling:** Errors are silently caught and ignored; component renders empty list if API fails.

---

## Usage Example

### Basic Usage (No Pre-selected Age Groups)

```jsx
import AgeCheckbox from '@/components/AgeCheckbox';

export default function EditTeamForm() {
  return <AgeCheckbox />;
}
```

### With Pre-selected Age Groups

```jsx
import AgeCheckbox from '@/components/AgeCheckbox';

export default function EditTeamForm({ team }) {
  return <AgeCheckbox age_groups={team.age_groups} />;
}
```

### In a Form

```jsx
<form onSubmit={handleSubmit}>
  <AgeCheckbox age_groups={existingAgeGroups} />
  <input type="submit" value="Save" />
</form>
```

When submitted, the form will include all checked age group IDs as `age_groups[]` parameters.

---

## Form Submission Integration

When used inside a form, selected checkboxes contribute to form submission:

```javascript
// If age groups with IDs "1" and "3" are checked
const formData = new FormData(form);
// formData will include:
// age_groups: "1"
// age_groups: "3"

// When converted to object:
// { age_groups: ["1", "3"] }
```

---

## Behavior Notes

- Component fetches age groups on mount only (does not refetch on prop changes)
- Pre-selected state is set during initial render and does not update if props change
- No explicit error handling or error state (errors silently fail)
- Checkboxes use `defaultChecked` (uncontrolled component pattern)
- Component name matches its purpose (unlike some similar components)

---

## Known Issues / Considerations

1. **Prop Type Handling:** `selectedage` state accepts both arrays and empty strings, which could cause issues:
   ```javascript
   // This handles both:
   selectedage = []        // Array
   selectedage = ''        // String (if props.age_groups is falsy)
   
   // But includes() expects an array
   selectedage.includes(agegroup._id)  // May fail if string
   ```

2. **Silent Error Handling:** API errors are silently ignored, resulting in an empty age group list with no user feedback

3. **No Loading State:** Component doesn't show loading indicator while fetching age groups

4. **No Prop Update:** Changing `age_groups` prop after mount won't update the component

---

## Accessibility Considerations

- Checkboxes have associated labels via `form-check-label`
- Unique IDs on each age group checkbox would improve accessibility (currently missing)
- Consider adding `id` attributes to checkboxes for better label association

---

## Future Enhancements

- [ ] Add loading indicator while fetching age groups
- [ ] Add error message if API request fails
- [ ] Fix prop-based state updates (use effect to sync with props)
- [ ] Add unique `id` attributes to each checkbox for accessibility
- [ ] Convert to controlled component pattern
- [ ] Add `aria-label` attributes for better accessibility
- [ ] Add age group filtering/search
- [ ] Add max selection limit (if needed)

---

## Support & Maintenance

- Verify that `/api/agegroups` endpoint returns the expected structure
- Ensure age groups are stored with `_id` and `age_group` properties
- Monitor for prop updates that won't be reflected in component state
- Consider adding error handling and user feedback for API failures
