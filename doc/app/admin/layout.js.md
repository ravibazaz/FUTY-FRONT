# Admin Layout Component: 

## Purpose & Responsibility

Shared layout wrapper for all admin routes

---

## Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `app/admin/layout.js` |
| **Component Type** | Client Component |
| **Route Type** | Layout Component |
| **Framework** | Next.js App Router |
| **Styling** | Bootstrap CSS classes |

## Key Features & Capabilities

- Wraps all admin routes with shared layout
- Provides Header and Sidebar navigation
- Maintains consistent admin UI structure

## Dependencies

| Dependency | Purpose |
|---|---|
| React Hooks | State and side-effect management |

## Code Structure & Imports

```javascript
import Header from "@/components/Header";
import Sidebar from '@/components/Sidebar';
```

## Implementation Details

## Notes & Context

- Critical wrapper component for entire admin dashboard
- Imports and renders `Header` and `Sidebar` components
- Uses Bootstrap grid system (`container-fluid`, `row`)
- Renders `children` prop for nested routes