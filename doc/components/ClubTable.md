# ClubTable Component Documentation

## Component Purpose

The `ClubTable` component renders a responsive table of clubs for the FUTY admin dashboard. It integrates with DataTables to provide search and table enhancements, and includes navigation links to view or edit each club.

**Key Responsibility:** Display club records in a searchable/admin table with quick access links.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/ClubTable.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `clubs` |
| **Related Pages** | `/admin/clubs/[id]/view`, `/admin/clubs/[id]/edit` |
| **Dependencies** | `next/link`, DataTables via global `window.$` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `clubs` | `Array<Object>` | Yes | List of club records to render |

### Club Record Shape

Each club item should contain at least:

```javascript
{
  _id: String,
  name: String,
  secretary_name: String,
  phone: String
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `clubs` | `Array` | `props.clubs || ''` | Stores club list for rendering |

---

## Key Features

- Responsive Bootstrap table layout
- DataTables integration for search and enhanced table UI
- Conditional rendering when club data is available
- View and edit links for each club record
- Uses Next.js `Link` for client-side navigation

---

## Table Columns

| Column | Description |
|--------|-------------|
| Club Name | Club name with link to club view page |
| Secretary Name | Club secretary's full name |
| Telephone | Club telephone number |
| Edit | Link to the club edit page |

---

## DataTables Integration

### Setup

The component initializes DataTables when running in the browser and club records are present:

```javascript
useEffect(() => {
  if (typeof window !== "undefined" && window.$ && clubs.length > 0) {
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
}, [clubs]);
```

### Behavior

- Adds a search placeholder label
- Removes table length selection control
- Destroys and re-initializes on club data changes
- Ensures cleanup when component unmounts

---

## Rendering Logic

### Conditional Rendering

The table is only rendered if `clubs.length > 0`:

```jsx
{clubs.length > 0 && (
  <div className="single-bottom-table-cont mt-30">
    ...
  </div>
)}
```

### Table Rows

Each row uses club data and renders view/edit links:

```jsx
clubs.map((l) => (
  <tr key={l._id}>
    <td className="text-nowrap">
      <Link href={`/admin/clubs/${l._id}/view`}>{l.name}</Link>
    </td>
    <td className="text-nowrap">{l.secretary_name}</td>
    <td className="text-nowrap">{l.phone}</td>
    <td className="text-nowrap">
      <Link className="text-green" href={`/admin/clubs/${l._id}/edit`}>Edit</Link>
    </td>
  </tr>
))
```

---

## Styling & Layout

### CSS Classes

- `.single-bottom-table-cont` — Table section wrapper
- `.mt-30` — Top margin spacing
- `.fs-14` — Font size for section title
- `.fw-bold` — Bold section title
- `.table-responsive` — Responsive table container
- `.common-datatable` — DataTable wrapper styles
- `.table` — Bootstrap table style
- `.text-nowrap` — Prevent table cell wrapping

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `next/link` | Client-side page navigation |
| `window.$` (DataTables) | Table search and behavior enhancements |

---

## Usage Example

```jsx
import ClubTable from '@/components/ClubTable';

function ClubsPage({ clubs }) {
  return <ClubTable clubs={clubs} />;
}
```

---

## Behavior Notes

- Requires jQuery/DataTables available globally in the browser.
- Does not render if `props.clubs` is empty.
- Uses `Link` for navigation to club detail and edit pages.
- The table ID `#example` must remain unique if multiple tables coexist.

---

## Future Enhancements

- [ ] Add delete or view details actions
- [ ] Add empty state messaging when no clubs exist
- [ ] Support sorting and pagination options explicitly
- [ ] Replace `window.$` dependency with a React-friendly table library
- [ ] Add club status or league columns for richer context

---

## Support & Maintenance

If the table fails to initialize, verify that DataTables and jQuery are loaded before render and that `window.$` is available in the browser environment.
