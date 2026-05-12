# Admin Creation Page: Tournaments New

## Purpose & Responsibility

Create new tournaments entries

**Key Responsibility:** Render interactive UI with state management and user interactions.

---

## Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `app/admin/tournaments/new/page.js` |
| **Component Type** | Client Component |
| **Route Type** | Creation Page |
| **Framework** | Next.js App Router |
| **Client-side** | Yes (`"use client"`) |
| **Styling** | Bootstrap CSS classes |

## Key Features & Capabilities

- Client-side React component with interactive UI
- Manages local state and side effects with React Hooks
- Responsive Bootstrap design
- Form handling with client and server validation
- Error feedback and success notifications

## Dependencies

| Dependency | Purpose |
|---|---|
| React Hooks | State and side-effect management |
| Server Actions | Backend form handling and operations |

## Code Structure & Imports

```javascript
import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import { createLeagues } from "@/actions/leaguesActions";
import { LeaguesSchema } from "@/lib/validation/leagues";
```

## Implementation Details

**State Management:**
- Local component state with `useState`
- Side effects with `useEffect`
- Client-side data fetching from API routes

**Form Handling:**
- Server Action integration with `useActionState`
- Form validation with Zod schemas
- Client-side error display

## Notes & Context

- Allows admins to create new tournaments records
- Contains form with validation
- Submits to server action for database storage