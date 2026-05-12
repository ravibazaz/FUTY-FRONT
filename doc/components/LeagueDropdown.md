# LeagueDropdown Component Documentation

## Component Purpose

The `LeagueDropdown` component is a reusable React dropdown that displays available leagues and allows users to select one using an enhanced TomSelect interface. It fetches league data from an API and provides a searchable, user-friendly selection experience with optional change callback support.

**Key Responsibility:** Render an enhanced league selection dropdown with TomSelect integration for forms requiring league assignment.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/LeagueDropdown.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `league` (string), `clienterror` (string), `onLeagueChange` (function) |
| **Dependencies** | `useState`, `useEffect`, `useRef`, `tom-select` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/leagues` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `league` | `String` | No | Pre-selected league ID to initialize the dropdown |
| `clienterror` | `String` | No | Error message to display below the dropdown |
| `onLeagueChange` | `Function` | No | Callback function called when selection changes |

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `leagues` | `Array` | `[]` | List of all available leagues fetched from API |
| `selectedClub` | `String` | `props.league ? props.league : ''` | Currently selected league ID |

### Refs

| Ref | Type | Purpose |
|-----|------|---------|
| `selectRef` | `Ref<HTMLSelectElement>` | Reference to the select element for TomSelect initialization |
| `tomSelectRef` | `Ref<TomSelect>` | Reference to the TomSelect instance |

---

## Key Features

- Dynamically fetches league list from API on mount
- Enhanced dropdown with TomSelect (searchable, sortable)
- Pre-selects league based on props
- Controlled component with change handler
- Optional callback when selection changes
- Form-integrated (field name is `league`)
- Bootstrap styling integration
- Error message display support

---

## Component Structure

```jsx
export default function LeagueDropdown(props) {
  // State and refs setup
  // API fetch effect
  // TomSelect initialization effects

  return (
    <div className="left-info-box">
      <div className="left-row row">
        {/* Label column */}
        <div className="left-info-col">
          <select name="league" ref={selectRef} ...>
            {/* League options */}
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
  if (typeof props.onLeagueChange === "function") {
    props.onLeagueChange(value);
  }
}
```

**Purpose:** Updates the `selectedClub` state and calls the optional callback when user selects a different league.

**Behavior:** 
- Updates component state
- Calls `props.onLeagueChange(value)` if the callback function is provided
- Allows parent components to react to selection changes

---

## TomSelect Configuration

### Initialization

```javascript
tomSelectRef.current = new TomSelect(selectRef.current, {
  create: false,
  placeholder: "Choose a League",
  sortField: { field: "text", direction: "asc" },
  onChange: (value) => {
    setSelectedClub(value);
    if (typeof props.onLeagueChange === "function") {
      props.onLeagueChange(value);
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

1. **Leagues Load Effect:** Initializes TomSelect after leagues are fetched
2. **Selection Sync Effect:** Keeps TomSelect synced with `selectedClub` changes

---

## Rendering Logic

### Select Element

```jsx
<select
  className="form-control"
  name="league"
  ref={selectRef}
  defaultValue={selectedClub}
>
  <option value="">Choose a League</option>
  {leagues.map((league) => (
    <option key={league._id} value={league._id}>
      {league.title}
    </option>
  ))}
</select>
```

**Features:**
- Standard HTML select element enhanced by TomSelect
- Form field name: `league`
- Options populated from API data
- Unique keys based on league `_id`
- Display text uses `league.title`

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

### Leagues Endpoint

**URL:** `/api/leagues`  
**Method:** `GET`  
**Response Format:**

```json
{
  "leagues": [
    {
      "_id": "league-id-1",
      "title": "Premier League"
    },
    {
      "_id": "league-id-2",
      "title": "Championship"
    }
  ]
}
```

**Error Handling:** Errors are logged to console but don't affect UI; component renders with empty dropdown if API fails.

---

## Usage Example

### Basic Usage (No Pre-selection)

```jsx
import LeagueDropdown from '@/components/LeagueDropdown';

export default function TeamForm() {
  return <LeagueDropdown />;
}
```

### With Pre-selected League

```jsx
import LeagueDropdown from '@/components/LeagueDropdown';

export default function EditTeamForm({ team }) {
  return <LeagueDropdown league={team.league} />;
}
```

### With Change Callback

```jsx
import LeagueDropdown from '@/components/LeagueDropdown';

export default function TeamForm() {
  const handleLeagueChange = (leagueId) => {
    console.log('Selected league:', leagueId);
    // Perform additional logic
  };

  return <LeagueDropdown onLeagueChange={handleLeagueChange} />;
}
```

### With Error Display

```jsx
import LeagueDropdown from '@/components/LeagueDropdown';

export default function TeamForm({ errors }) {
  return <LeagueDropdown clienterror={errors.league} />;
}
```

### In a Form

```jsx
<form onSubmit={handleSubmit}>
  <LeagueDropdown league={existingLeagueId} clienterror={errors.league} />
  <input type="submit" value="Save" />
</form>
```

When submitted, the form will include the selected league ID as `league` parameter.

---

## Form Submission Integration

When used inside a form, the selected league contributes to form submission:

```javascript
// If league with ID "league-123" is selected
const formData = new FormData(form);
// formData will include:
// league: "league-123"

// When converted to object:
// { league: "league-123" }
```

---

## Behavior Notes

- Component fetches leagues on mount only (does not refetch on prop changes)
- Pre-selected state is set during initial render and synced with TomSelect
- TomSelect provides search and sorting functionality
- Component uses controlled pattern with `onChange` handler
- Selection state is maintained in component state and synced with TomSelect
- Optional `onLeagueChange` callback allows parent components to react to changes

---

## Known Issues / Considerations

1. **Variable Name Confusion:** `selectedClub` should be `selectedLeague` for clarity

2. **Function Name Mismatch:** `fetchClubs` function fetches leagues (should be `fetchLeagues`)

3. **Silent Error Handling:** API errors are logged but don't provide user feedback

4. **No Loading State:** Component doesn't show loading indicator while fetching leagues

5. **Prop Update Handling:** Changing `league` prop after mount may not update the component properly

---

## Accessibility Considerations

- TomSelect provides keyboard navigation and screen reader support
- Select element has proper labeling
- Error messages are associated with the input

---

## Future Enhancements

- [ ] Rename `selectedClub` to `selectedLeague` for clarity
- [ ] Rename `fetchClubs` to `fetchLeagues`
- [ ] Add loading indicator while fetching leagues
- [ ] Add error message if API request fails
- [ ] Improve prop update handling (use effect to sync with props)
- [ ] Add league filtering/search beyond TomSelect
- [ ] Add league details preview on selection
- [ ] Add max selection limit (if needed)
- [ ] Add league creation option in TomSelect

---

## Support & Maintenance

- Verify that `/api/leagues` endpoint returns the expected structure
- Ensure leagues are stored with `_id` and `title` properties
- Monitor for prop updates that won't be reflected in component state
- Consider adding error handling and user feedback for API failures
- Ensure TomSelect is properly installed: `npm install tom-select`
