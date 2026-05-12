# Admin Creation Page: Teams New

## Purpose & Responsibility

Create new teams entries

**Key Responsibility:** Provide server-side processing, database operations, and API integration.

---

## Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `app/admin/teams/new/page.js` |
| **Component Type** | Server Component |
| **Route Type** | Creation Page |
| **Framework** | Next.js App Router |
| **Client-side** | Yes (`"use client"`) |
| **Server-side** | Yes |
| **Styling** | Bootstrap CSS classes |

## Key Features & Capabilities

- Client-side React component with interactive UI
- Manages local state and side effects with React Hooks
- Responsive Bootstrap design
- Server-side processing with Next.js server capabilities
- Database operations via Mongoose ORM
- Authentication and authorization via HTTP cookies
- Client-side API calls to backend routes
- Real-time data fetching and rendering
- Error handling for API failures
- Form handling with client and server validation
- Error feedback and success notifications

## Dependencies

| Dependency | Purpose |
|---|---|
| React Hooks | State and side-effect management |
| React Hooks | State and side-effect management |
| Server Actions | Backend form handling and operations |
| `next/link` | Client-side navigation and routing |

## Code Structure & Imports

```javascript
import { useFormStatus } from "react-dom";
import { useActionState, useState, useRef, useTransition, useEffect } from "react";
import { createTeam } from "@/actions/teamsActions";
import { TeamSchema } from "@/lib/validation/teams";
import Image from "next/image";
import ClubDropdown from "@/components/ClubDropdown";
import GroundDropdown from "@/components/GroundDropdown";
import Link from "next/link";
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.bootstrap5.css";
```

## Implementation Details

**Server-side Processing:**
- Database connection via `connectDB()`
- Authentication using cookies
- Data validation and sanitization
- Server-side redirects on success

**State Management:**
- Local component state with `useState`
- Side effects with `useEffect`
- Client-side data fetching from API routes

**Form Handling:**
- Server Action integration with `useActionState`
- Form validation with Zod schemas
- Client-side error display

## Notes & Context

- Allows admins to create new teams records
- Contains form with validation
- Submits to server action for database storage