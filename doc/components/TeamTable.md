# TeamTable Component Documentation

## Component Purpose

The `TeamTable` component renders a responsive admin table of teams for the FUTY dashboard. It integrates with DataTables for search and table enhancements and provides navigation links to view and edit each team.

**Key Responsibility:** Display team records in a searchable table with direct view/edit actions.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/TeamTable.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `teams` |
| **Related Pages** | `/admin/teams/[id]/view`, `/admin/teams/[id]/edit` |
| **Dependencies** | `next/link`, DataTables via global `window.$` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `teams` | `Array<Object>` | Yes | List of team records to render |

### Team Record Shape

Each team item should contain at least:

```javascript
{
  _id: String,
  name: String,
  phone: String,
  email: String
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `teams` | `Array` | `props.teams || ''` | Stores the list of teams for rendering |

---

## Key Features

- Responsive table layout using Bootstrap classes
- DataTables integration for search and table enhancements
- Conditional rendering when team data exists
- View and edit links for each team record
- Uses Next.js `Link` for client-side navigation

---

## Table Columns

| Column | Description |
|--------|-------------|
| Team | Team name with link to view page |
| Phone | Team telephone number |
| Email | Team email address |
| Edit | Link to edit the team record |

---

## DataTables Integration

### Initialization

The component initializes DataTables when rendered in the browser and when team data is present:

```javascript
useEffect(() => {
  if (typeof window !== "undefined" && window.$ && teams.length > 0) {
    const $ = window.$;

    if ($.fn.DataTable.isDataTable("#example")) {
      $("#example").DataTable().destroy();
    }

    $("#example").DataTable({
      language: { searchPlaceholder: "Search" },
      lengthChange: false
    });

    return () => {
      if ($.fn.DataTable.isDataTable("#example")) {
        $("#example").DataTable().destroy();
      }
    };
  }
}, [teams]);
```

### Behavior

- Adds a search placeholder to the DataTable
- Disables the rows-per-page dropdown
- Destroys and re-initializes the DataTable when data changes
- Ensures cleanup on component unmount

---

## Rendering Logic

### Conditional Rendering

The table renders only if `teams.length > 0`:

```jsx
{teams.length > 0 && (
  <div className="single-bottom-table-cont mt-30">
    ...
  </div>
)}
```

### Table Rows

Each row is generated from the `teams` array:

```jsx
teams.map((l) => (
  <tr key={l._id}>
    <td className="text-nowrap">
      <Link href={`/admin/teams/${l._id}/view`}>{l.name}</Link>
    </td>
    <td className="text-nowrap">{l.phone}</td>
    <td className="text-nowrap">{l.email}</td>
    <td className="text-nowrap">
      <Link className="text-green" href={`/admin/teams/${l._id}/edit`}>Edit</Link>
    </td>
  </tr>
))
```

---

## Styling & Layout

### CSS Classes

- `.single-bottom-table-cont` — Section wrapper for the table
- `.mt-30` — Top margin spacing
- `.fs-14` — Font size for title text
- `.fw-bold` — Bold title font weight
- `.table-responsive` — Responsive table wrapper
- `.common-datatable` — DataTable wrapper style
- `.table` — Bootstrap table styling
- `.text-nowrap` — Prevents wrapping within table cells

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `next/link` | Client-side navigation links |
| `window.$` / DataTables | Table search and UI enhancements |

---

## Usage Example

```jsx
import TeamTable from '@/components/TeamTable';

function TeamsPage({ teams }) {
  return <TeamTable teams={teams} />;
}
```

---

## Behavior Notes

- Requires jQuery/DataTables to be loaded globally on `window.$`.
- Does not render when `props.teams` is empty.
- The table ID `#example` must be unique if multiple tables are used on the same page.

---

## Future Enhancements

- [ ] Add row actions for delete or view details
- [ ] Display additional fields such as club, age group, or status
- [ ] Show empty-state UI when no teams are available
- [ ] Refactor away from global DataTables dependency to a React table library
- [ ] Add selectable rows or bulk actions

---

## Support & Maintenance

If the table fails to initialize, verify that DataTables and jQuery are available before render and that `window.$` is defined in the browser environment.
