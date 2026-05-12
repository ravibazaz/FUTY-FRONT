# FriendliesTable Component Documentation

## Component Purpose

The `FriendliesTable` component renders a responsive, searchable table of friendly matches using the DataTables jQuery plugin. It is designed to display friendly match records with date, team, time, opposition, venue, status, opposing manager, score, outcome, and an edit link.

**Key Responsibility:** Present friendly match data in a data table with client-side search and pagination support.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/FriendliesTable.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `friendlies`, `label` |
| **Dependencies** | `next/link`, `formatDate` helper, DataTables via global `window.$` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `friendlies` | `Array<Object>` | Yes | Array of friendly match records to display in the table |
| `label` | `String` | Optional | Section title displayed above the table |

### Friendly Record Shape

Each record expected by the component should follow a lightweight structure:

```javascript
{
  date: String,
  time: String,
  team_id: { name: String },
  ground_id: { name: String },
  // Additional fields may exist but only these values are used for rendering
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `friendlies` | `Array` | `props.friendlies || ''` | Holds the list of friendly match records for rendering |

**Note:** The component initializes state from props and does not update state after mount unless props change via re-render.

---

## Key Features

- Responsive table layout using Bootstrap classes
- DataTables integration for search and UI enhancements
- Conditional rendering when the `friendlies` list is empty
- Rendered content includes links and text values
- Uses `formatDate` helper to format friendly match dates

---

## Table Columns

| Column | Rendered Value |
|--------|----------------|
| Date | `formatDate(l.date)` |
| Team | `l.team_id?.name` |
| Time | `l.time` |
| Opposition | Hardcoded placeholder “CPR U14s” |
| Ground | `l.ground_id?.name` |
| Status | Hardcoded “Complete” |
| Opp Manager | Hardcoded placeholder “Marc Waters” |
| Score | Hardcoded placeholder `3-2` |
| Outcome | Hardcoded placeholder “Win” |
| Edit | Hardcoded edit link |

**Important:** Several columns currently render static placeholder values rather than dynamic data.

---

## DataTables Integration

### Initialization

The component initializes DataTables when rendered in the browser and when `friendlies` contains rows:

```javascript
useEffect(() => {
  if (typeof window !== "undefined" && window.$ && friendlies.length > 0) {
    const $ = window.$;

    if ($.fn.DataTable.isDataTable("#friendlies-table")) {
      $("#friendlies-table").DataTable().destroy();
    }

    const table = $("#friendlies-table").DataTable({
      language: { searchPlaceholder: "Search" },
      lengthChange: false
    });

    return () => {
      if ($.fn.DataTable.isDataTable("#friendlies-table")) {
        $("#friendlies-table").DataTable().destroy();
      }
    };
  }
}, [friendlies]);
```

### Behavior

- Adds search input placeholder text
- Disables length change dropdown
- Destroys and re-initializes DataTables on data updates
- Includes cleanup to prevent duplicate DataTable initialization

---

## Rendering Logic

### Conditional Table Rendering

The table is only rendered when `friendlies.length > 0`:

```jsx
{friendlies.length > 0 && (
  <div className="single-bottom-table-cont mt-30">
    <h2 className="fs-14 fw-bold mb-20">{props.label}</h2>
    ...
  </div>
)}
```

### Table Body

The rows are generated from the `friendlies` array using `.map()`:

```jsx
friendlies.map((l, index) => (
  <tr key={index}>
    <td className="text-nowrap">{formatDate(l.date)}</td>
    <td className="text-nowrap"><a href="#">{l.team_id?.name}</a></td>
    <td className="text-nowrap">{l.time}</td>
    <td className="text-nowrap"><a href="#">CPR U14s</a></td>
    <td className="text-nowrap"><a href="#">{l.ground_id?.name}</a></td>
    <td className="text-nowrap">Complete</td>
    <td className="text-nowrap"><a href="#">Marc Waters</a></td>
    <td className="text-nowrap">3-2</td>
    <td className="text-nowrap">Win</td>
    <td className="text-nowrap"><a className="text-green" href="#">Edit</a></td>
  </tr>
))
```

---

## Styling & Layout

### CSS Classes

- `.single-bottom-table-cont` — Container for table section
- `.mt-30` — Top margin spacing
- `.fs-14` — Font size styling
- `.fw-bold` — Bold title font
- `.table-responsive` — Responsive table container
- `.common-datatable` — DataTable styling wrapper
- `.table` — Bootstrap table styling
- `.text-nowrap` — Prevents text wrapping in table cells

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `Link` | Navigation links (currently not used for external routing) |
| `formatDate` | Formats friendly match dates |
| `window.$` / DataTables | Table enhancements and search |

---

## Usage Example

```jsx
import FriendliesTable from '@/components/FriendliesTable';

export default function Page({ friendlies }) {
  return <FriendliesTable friendlies={friendlies} label="Upcoming Friendlies" />;
}
```

---

## Behavior Notes

- The component requires the DataTables plugin to be available globally on `window.$`.
- It does not render anything if `friendlies` is empty or falsy.
- Static placeholders are used for columns not currently backed by data.
- The `Link` import is present but current row links use plain `<a>` tags.

---

## Future Enhancements

- [ ] Replace hardcoded placeholder values (`Opposition`, `Status`, `Opp Manager`, `Score`, `Outcome`) with dynamic data
- [ ] Use actual `Link` components for navigation to friendly detail/edit pages
- [ ] Add table row actions for delete or view details
- [ ] Support an empty-state message when no friendlies are available
- [ ] Add sorting columns and pagination options via DataTables configuration
- [ ] Refactor to support controlled updates when `props.friendlies` changes

---

## Support & Maintenance

If this component stops initializing, verify that DataTables and jQuery are loaded before rendering and that `window.$` is available in the browser environment.
