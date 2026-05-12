# LeagueTable Component Documentation

## Component Purpose

The `LeagueTable` component displays a paginated, searchable table of leagues with filtering capabilities. It provides CRUD operations including viewing, editing, and deleting leagues, with real-time search and status filtering.

**Key Responsibility:** Render and manage the leagues listing page with search, filter, and pagination functionality.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/LeagueTable.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with hooks |
| **Props** | None |
| **Dependencies** | `DeleteLeagueButton`, `deleteLeague` action, `Link`, `useRouter` |
| **Client-side Only** | Yes (`"use client"`) |
| **API Endpoint** | `/api/leagues` |

---

## Key Features

- Paginated league listing with search and filtering
- Real-time search by league name
- Status filtering (All, Active, Inactive)
- Edit and delete actions for each league
- "New League" creation link
- Bootstrap table styling with DataTables integration
- Responsive design for mobile devices

---

## Component Structure

```jsx
'use client';

import { useState, useEffect } from 'react';
import DeleteLeagueButton from "@/components/DeleteLeagueButton";
import { deleteLeague } from "@/actions/leaguesActions";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function LeagueTable() {
  // State management and API integration
  // Search and filter functionality
  // Table rendering with actions
}
```

---

## State Management

### Core State Variables

```jsx
const [leagues, setLeagues] = useState([]);
const [q, setQ] = useState('');
const [filter, setFilter] = useState('');
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [Pages, setPages] = useState(1);
const [Limit, setLimit] = useState(1);
```

| State | Type | Purpose |
|-------|------|---------|
| `leagues` | Array | Current page of league data |
| `q` | String | Search query string |
| `filter` | String | Status filter ('', 'active', 'inactive') |
| `page` | Number | Current page number |
| `totalPages` | Number | Total number of pages |
| `Pages` | Number | Alias for total pages |
| `Limit` | Number | Items per page |

---

## API Integration

### Fetch Data Function

```jsx
const fetchData = async (search = '', status = '', pageNo = 1) => {
  const res = await fetch(`/api/leagues?q=${search}&filter=${status}&page=${pageNo}`);
  const data = await res.json();
 
  setLeagues(data.leagues);
  setTotalPages(data.total);
  setPages(data.pages);
  setLimit(data.limit);
};
```

**API Endpoint:** `/api/leagues`  
**Method:** GET  
**Query Parameters:**
- `q`: Search query (league name)
- `filter`: Status filter ('active', 'inactive', or empty for all)
- `page`: Page number for pagination

**Response Structure:**
```json
{
  "leagues": [...],
  "total": 100,
  "pages": 10,
  "limit": 10
}
```

---

## Effects and Event Handlers

### Data Fetching Effect

```jsx
useEffect(() => {
  fetchData(q, filter, page);
}, [page]);
```

- Fetches data when page changes
- Maintains search and filter state across pagination

### Search Handler

```jsx
const handleSearch = (e) => {
  e.preventDefault();
  setPage(1); // Reset to page 1 when new search
  fetchData(q, filter, 1);
};
```

- Prevents form submission default
- Resets to first page for new search
- Triggers API call with current search/filter

### Reset Handler

```jsx
const handleReset = async () => {
  setQ('');
  setFilter('');
  fetchData();
};
```

- Clears search query and filter
- Fetches all leagues without filters

---

## UI Components

### Search and Filter Form

```jsx
<form onSubmit={handleSearch} id='create-course-form' className="form-inline mb-3">
  <div className="input-group input-group-sm mr-2" style={{ width: "200px" }}>
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      type="text"
      className="form-control"
      placeholder="Search..."
    />
  </div>

  <div className="input-group input-group-sm mr-2" style={{ width: "150px" }}>
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="form-control"
    >
      <option value="">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>

  <button type="submit" className="btn btn-secondary btn-sm mr-2">
    Search
  </button>
  <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm mr-2">
    Reset Search
  </button>

  <Link href="/admin/leagues/new" className="btn btn-primary btn-sm ml-auto">
    + New League
  </Link>
</form>
```

**Features:**
- Search input with controlled value
- Status filter dropdown
- Search and reset buttons
- "New League" creation link

### Data Table

```jsx
<table className="table table-bordered">
  <thead>
    <tr>
      <th style={{ width: "10px" }}>#</th>
      <th>Name</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {leagues.map((l, index) => (
      <tr key={l._id}>
        <td>{(page - 1) * Limit + index + 1}</td>
        <td>{l.title}</td>
        <td>{l.isActive ? "Active" : "Inactive"}</td>
        <td>
          <div className="d-flex gap-2">
            <Link
              href={`/admin/leagues/${l._id}/edit`}
              className="btn btn-success btn-sm mr-2"
            >
              Edit
            </Link>
            <DeleteLeagueButton
              onDelete={deleteLeague.bind(null, l._id.toString())}
            />
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**Columns:**
- **#:** Row number (calculated: `(page - 1) * Limit + index + 1`)
- **Name:** League title
- **Status:** Active/Inactive based on `isActive` boolean
- **Action:** Edit and Delete buttons

### Pagination Controls

```jsx
<div className="d-flex justify-content-between align-items-center mt-3">
  <button
    className="btn btn-sm btn-outline-secondary"
    disabled={page === 1}
    onClick={() => setPage((p) => p - 1)}
  >
    ⬅ Prev
  </button>

  <span>Page {page} of {totalPages}</span>

  <button
    className="btn btn-sm btn-outline-secondary"
    disabled={page === Pages}
    onClick={() => setPage((p) => p + 1)}
  >
    Next ➡
  </button>
</div>
```

**Features:**
- Previous/Next navigation
- Current page indicator
- Disabled states for boundary pages

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `useState, useEffect` | `react` | State management and effects |
| `DeleteLeagueButton` | `@/components/DeleteLeagueButton` | Delete action component |
| `deleteLeague` | `@/actions/leaguesActions` | Server action for deletion |
| `Link` | `next/link` | Client-side navigation |
| `useRouter` | `next/navigation` | Router instance (imported but not used) |

---

## Usage Example

### Basic Usage

```jsx
import LeagueTable from '@/components/LeagueTable';

export default function LeaguesPage() {
  return (
    <div className="container">
      <h1>Leagues Management</h1>
      <LeagueTable />
    </div>
  );
}
```

### With Custom Layout

```jsx
import LeagueTable from '@/components/LeagueTable';

export default function AdminLeagues() {
  return (
    <div className="admin-content">
      <div className="card">
        <LeagueTable />
      </div>
    </div>
  );
}
```

---

## Behavior Notes

- Component fetches data on mount and page changes
- Search requires explicit submit (no real-time search)
- Filter changes don't auto-submit (requires search button)
- Reset clears all filters and fetches all data
- Pagination maintains search/filter state
- Delete action uses confirmation dialog

---

## Data Flow

1. **Initial Load:** `useEffect` fetches first page of all leagues
2. **Search/Filter:** User inputs → Submit → API call → State update → Re-render
3. **Pagination:** Page change → `useEffect` → API call → State update
4. **Reset:** Clear inputs → API call without parameters → State update

---

## API Error Handling

- No explicit error handling for API failures
- Component assumes API always returns valid data
- Network errors would cause unhandled promise rejections

---

## Performance Considerations

- **Pagination:** Loads only current page data
- **Search:** Server-side search reduces client-side filtering
- **State Updates:** Minimal re-renders with proper state management
- **Dependencies:** Lightweight component with few external deps

---

## Known Issues / Considerations

1. **API Error Handling:** No error states for failed API calls
2. **Loading States:** No loading indicators during API calls
3. **Search UX:** Requires button click, no real-time search
4. **Filter UX:** Filter changes don't auto-apply
5. **Router Import:** `useRouter` imported but not used
6. **State Duplication:** `totalPages` and `Pages` seem redundant

---

## Security Notes

- No direct database access
- Server actions handle data validation
- API endpoints should implement authentication
- Client-side data is read-only display

---

## Future Enhancements

- [ ] Add loading spinners during API calls
- [ ] Implement real-time search with debouncing
- [ ] Add auto-apply for filter changes
- [ ] Add error handling and retry logic
- [ ] Implement bulk actions (delete multiple)
- [ ] Add export functionality (CSV/Excel)
- [ ] Add sorting by columns
- [ ] Implement advanced filters
- [ ] Add refresh button for data updates
- [ ] Add keyboard shortcuts for navigation
- [ ] Implement infinite scroll alternative to pagination

---

## Testing Recommendations

- Test search functionality with various queries
- Verify filter dropdown works correctly
- Test pagination navigation and boundaries
- Check edit/delete button navigation
- Verify API calls with different parameters
- Test reset functionality clears all filters
- Check responsive behavior on mobile
- Test component with empty data states
- Verify Bootstrap table styling
- Test accessibility features

---

## Support & Maintenance

- Ensure `/api/leagues` endpoint exists and works
- Verify `deleteLeague` server action functions
- Test component with different data sizes
- Monitor API performance and response times
- Update component when league data structure changes
- Test with various search queries and edge cases
- Verify pagination works with large datasets
- Check component behavior with slow network connections
