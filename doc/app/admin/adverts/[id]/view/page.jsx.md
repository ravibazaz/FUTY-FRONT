# Admin Detail View Page: Adverts Id View

## Purpose & Responsibility

View individual adverts records

**Key Responsibility:** Provide server-side processing, database operations, and API integration.

---

## Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `app/admin/adverts/[id]/view/page.jsx` |
| **Component Type** | Server Component |
| **Route Type** | Detail View Page |
| **Framework** | Next.js App Router |
| **Server-side** | Yes |
| **Styling** | Bootstrap CSS classes |

## Key Features & Capabilities

- Server-side processing with Next.js server capabilities
- Database operations via Mongoose ORM
- Authentication and authorization via HTTP cookies

## Dependencies

| Dependency | Purpose |
|---|---|
| Mongoose | Database ORM and models |
| React Hooks | State and side-effect management |
| `next/link` | Client-side navigation and routing |

## Code Structure & Imports

```javascript
import ChangeStatus from "@/components/ChangeStatus";
import ClubDropdown from "@/components/ClubDropdown";
import { connectDB } from "@/lib/db";
import Adverts from "@/lib/models/Adverts";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
```

## Implementation Details

**Server-side Processing:**
- Database connection via `connectDB()`
- Authentication using cookies
- Data validation and sanitization
- Server-side redirects on success

## Notes & Context

- Displays read-only details of adverts records
- Shows all relevant fields and information
- Provides navigation to edit or delete