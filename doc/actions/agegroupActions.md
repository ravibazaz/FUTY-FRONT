# Age Groups Actions Documentation

## Actions Purpose

The `agegroupActions.js` file contains server actions for managing age groups in the FUTY sports management system. It provides basic CRUD operations for age group categories without image handling, focusing on simple data management for youth sports classifications.

**Key Responsibility:** Handle age group CRUD operations with validation and basic data management.

---

## Actions Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `actions/agegroupActions.js` |
| **Type** | Next.js Server Actions |
| **Framework** | Next.js with server-side execution |
| **Database** | MongoDB with Mongoose |
| **Validation** | Zod schema validation |
| **File Handling** | None (no images) |
| **Operations** | Create, Update, Delete age groups |
| **Use Case** | Youth sports age classifications |

---

## Key Features

- Age group creation with validation
- Age group updating
- Age group deletion
- Simple data structure (no images)
- Toast notifications
- Server-side redirects

---

## Actions Structure

```javascript
"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AgeGroupSchema } from "@/lib/validation/agegroups";
import AgeGroups from "@/lib/models/AgeGroups";

// CRUD operations without file handling
```

---

## Create Age Group Action

### Function Signature

```javascript
export async function createAgeGrouups(prevState, formData)
```

### Process Flow

```javascript
const raw = Object.fromEntries(formData.entries());
const result = AgeGroupSchema(false).safeParse({ ...raw });

if (!result.success)
  return { success: false, errors: result.error.flatten().fieldErrors };

await connectDB();
await AgeGroups.create({ ...result.data });

cookieStore.set("toastMessage", "Age Group Added");
redirect("/admin/agegroups");
```

---

## Update Age Group Action

### Function Signature

```javascript
export async function updateAgeGroups(id, prevState, formData)
```

### Process Flow

```javascript
const raw = Object.fromEntries(formData.entries());
const result = AgeGroupSchema(true).safeParse(raw);

if (!result.success)
  return { success: false, errors: result.error.flatten().fieldErrors };

const { age_group, description } = result.data;

await connectDB();
const agegroup = await AgeGroups.findById(id);

if (!agegroup) {
  return { success: false, error: "Age Group not found" };
}

const updateData = { age_group, description };
await AgeGroups.findByIdAndUpdate(id, updateData);

cookieStore.set("toastMessage", "Age Group Updated");
redirect("/admin/agegroups");
```

---

## Delete Age Group Action

### Function Signature

```javascript
export async function deleteAgeGroup(id)
```

### Process Flow

```javascript
await connectDB();
const store = await AgeGroups.findById(id);
if (!store) {
  throw new Error("Store not found");
}

// Note: Image cleanup code exists but age groups don't have images
// This appears to be copy-paste error from stores actions

await AgeGroups.findByIdAndDelete(id);
cookieStore.set("toastMessage", "Deleted");
redirect("/admin/agegroups");
```

---

## Age Group Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `age_group` | String | Age group name (e.g., "U-12", "U-16") |
| `description` | String | Age group description |
| `isActive` | Boolean | Active status |

---

## Validation Schema

### AgeGroupSchema Structure

```javascript
// Creation validation
AgeGroupSchema(false).safeParse({
  age_group: string().min(1),
  description: string()
});

// Update validation
AgeGroupSchema(true).safeParse({
  age_group: string().min(1),
  description: string()
});
```

---

## Database Schema

### Age Group Document Structure

```javascript
{
  age_group: String,      // Age group identifier
  description: String,    // Detailed description
  isActive: Boolean,      // Active status
  // Timestamps added by Mongoose
}
```

---

## Usage Examples

### Create Age Group Form

```jsx
'use client';
import { createAgeGrouups } from '@/actions/agegroupActions';

export default function CreateAgeGroupForm() {
  const [state, formAction] = useActionState(createAgeGrouups, null);

  return (
    <form action={formAction}>
      <input name="age_group" placeholder="Age Group (e.g., U-12)" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit">Create Age Group</button>
      {state?.errors && <pre>{JSON.stringify(state.errors)}</pre>}
    </form>
  );
}
```

### Age Group List

```jsx
export default function AgeGroupList({ ageGroups }) {
  return (
    <div>
      {ageGroups.map(group => (
        <div key={group._id}>
          <h3>{group.age_group}</h3>
          <p>{group.description}</p>
          <span>{group.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `connectDB` | `@/lib/db` | Database connection |
| `cookies` | `next/headers` | Session management |
| `redirect` | `next/navigation` | Server redirects |
| `AgeGroupSchema` | `@/lib/validation/agegroups` | Data validation |
| `AgeGroups` | `@/lib/models/AgeGroups` | Database model |

---

## Code Quality Notes

### Issues Found

1. **Function Name Typo:** `createAgeGrouups` should be `createAgeGroups`
2. **Unused Image Code:** Delete function has image cleanup code but age groups don't have images
3. **Error Message:** Delete function throws "Store not found" instead of "Age Group not found"

### Recommended Fixes

```javascript
// Fix function name
export async function createAgeGroups(prevState, formData)

// Fix error message
throw new Error("Age Group not found");

// Remove unused image cleanup code
// Remove fs.unlink and path.join imports if not needed elsewhere
```

---

## Security Considerations

- Basic validation through Zod schema
- Server-side operations only
- No file uploads (reduced attack surface)

---

## Performance Notes

- Lightweight operations (no file handling)
- Simple database queries
- Minimal memory usage

---

## Future Enhancements

- [ ] Fix function naming typo
- [ ] Remove unused image cleanup code
- [ ] Add age range validation
- [ ] Add age group ordering/sorting
- [ ] Implement age group statistics
- [ ] Add age group templates
- [ ] Support for custom age group rules

---

## Testing Recommendations

- Test age group creation and validation
- Test update operations
- Test deletion functionality
- Verify error handling for non-existent groups
- Test with various age group formats

---

## Support & Maintenance

- Fix identified code quality issues
- Monitor database performance
- Update validation rules as needed
- Regular cleanup of inactive age groups
