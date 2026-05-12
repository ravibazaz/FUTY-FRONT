# Admin Page Route: Leagues   Copy

## Purpose & Responsibility

Admin page route

**Key Responsibility:** Render interactive UI with state management and user interactions.

---

## Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `app/admin/leagues - Copy/page.js` |
| **Component Type** | Client Component |
| **Route Type** | Page Route |
| **Framework** | Next.js App Router |
| **Client-side** | Yes (`"use client"`) |
| **Styling** | Bootstrap CSS classes |

## Key Features & Capabilities

- Client-side React component with interactive UI
- Manages local state and side effects with React Hooks
- Responsive Bootstrap design
- DataTables integration for dynamic tabular data
- Search, filter, sort, and pagination functionality
- SweetAlert2 notifications and confirmations
- Toast messages for operation feedback
- Safe delete operations with confirmations
- Server-side delete actions

## Dependencies

| Dependency | Purpose |
|---|---|
| React Hooks | State and side-effect management |
| React Hooks | State and side-effect management |
| Server Actions | Backend form handling and operations |
| SweetAlert2 | Notifications, confirmations, and toasts |
| `next/link` | Client-side navigation and routing |
| `next/navigation` | Router and navigation utilities |

## Code Structure & Imports

```javascript
import { useState, useEffect } from "react";
import DeleteLeagueButton from "@/components/DeleteLeagueButton"; // adjust path
import { deleteLeague } from "@/actions/leaguesActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
```

## Implementation Details

**State Management:**
- Local component state with `useState`
- Side effects with `useEffect`
- Client-side data fetching from API routes

## Notes & Context
