# Leagues Actions Documentation

## Actions Purpose

The `leaguesActions.js` file contains server actions for managing leagues in the FUTY admin system. It provides complete CRUD operations including creation, updating, and deletion of leagues with image upload handling, validation, and proper error management.

**Key Responsibility:** Handle all league-related server operations with file management and data validation.

---

## Actions Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `actions/leaguesActions.js` |
| **Type** | Next.js Server Actions |
| **Framework** | Next.js with server-side execution |
| **Database** | MongoDB with Mongoose |
| **Validation** | Zod schema validation |
| **File Handling** | Image upload with UUID naming |
| **Operations** | Create, Update, Delete leagues |

---

## Key Features

- League creation with image upload and validation
- League updating with optional image replacement
- League deletion with image cleanup
- Zod schema validation for data integrity
- UUID-based file naming for uniqueness
- Automatic old image deletion on updates
- Toast message notifications
- Server-side redirects after operations

---

## Actions Structure

```javascript
"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LeaguesSchema } from "@/lib/validation/leagues";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Leagues from "@/lib/models/Leagues";

// Utility functions and CRUD operations
```

---

## Utility Functions

### File Existence Check

```javascript
const fileExists = async (filePath) => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    console.log('no uokid');
    return false;
  }
};
```

- Checks if a file exists at given path
- Uses Node.js `fs.access()` for efficient checking
- Returns boolean result

---

## Create League Action

### Function Signature

```javascript
export async function createLeagues(prevState, formData)
```

### Parameters

- `prevState`: Previous form state (for error handling)
- `formData`: FormData object containing league data and image

### Process Flow

#### 1. Cookie and User Validation

```javascript
const cookieStore = await cookies();
const userId = cookieStore.get("user_id")?.value;
```

- Accesses cookie store for user identification
- Extracts user_id for audit purposes

#### 2. Form Data Processing

```javascript
const raw = Object.fromEntries(formData.entries());
const imageFile = formData.get("image");
const age_groups = formData.getAll("age_groups");
```

- Converts FormData to plain object
- Extracts single image file
- Gets all selected age groups (multiple select)

#### 3. Validation

```javascript
const result = LeaguesSchema(false).safeParse({ ...raw, image: imageFile });
if (!result.success)
  return { success: false, errors: result.error.flatten().fieldErrors };
```

- Uses Zod schema for validation
- `false` parameter indicates creation (not update)
- Returns flattened field errors on validation failure

#### 4. Image Processing

```javascript
const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
const filePath = path.join(process.cwd(), "uploads/leagues", uniqueName);
await fs.mkdir(path.dirname(filePath), { recursive: true });
const arrayBuffer = await imageFile.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
await fs.writeFile(filePath, buffer);
```

- Generates unique filename with UUID
- Creates uploads directory if needed
- Converts file to buffer and saves

#### 5. Database Creation

```javascript
await connectDB();
await Leagues.create({
  ...result.data,
  age_groups: age_groups,
  image: `/uploads/leagues/${uniqueName}`,
});
```

- Connects to database
- Creates league document with validated data
- Stores relative image path

#### 6. Success Handling

```javascript
cookieStore.set("toastMessage", "League Added");
redirect("/admin/leagues");
```

- Sets success toast message
- Redirects to leagues listing page

---

## Update League Action

### Function Signature

```javascript
export async function updateLeague(id, prevState, formData)
```

### Parameters

- `id`: League ID to update
- `prevState`: Previous form state
- `formData`: Updated form data

### Key Differences from Create

#### Image Handling Logic

```javascript
if (imageFile && imageFile.size > 0) {
  // New image uploaded - process and replace
  const imageName = `${Date.now()}_${imageFile.name}`;
  const imagePath = path.join(uploadsFolder, imageName);
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

  fs.writeFile(imagePath, imageBuffer, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return { success: false, error: 'Failed to save image' };
    }
  });

  // Delete old image
  if (league.image) {
    const oldImagePath = path.join(process.cwd(), league.image);
    try {
      await fs.unlink(oldImagePath).catch((err) => {
        console.warn(`Failed to delete image: ${err.message}`);
      });
    } catch (err) {
      console.warn(`Failed to delete old image: ${err.message}`);
    }
  }

  // Update with new image
  const updateData = { ...fields, image: `/uploads/leagues/${imageName}` };
  await Leagues.findByIdAndUpdate(id, updateData, { new: true });
} else {
  // No new image - update other fields only
  const updateData = { ...fields };
  await Leagues.findByIdAndUpdate(id, updateData, { new: true });
}
```

- Checks if new image uploaded
- Saves new image with timestamp naming
- Deletes old image file
- Updates database with/without image path

---

## Delete League Action

### Function Signature

```javascript
export async function deleteLeague(id)
```

### Process Flow

#### 1. Database Connection and Lookup

```javascript
await connectDB();
const league = await Leagues.findById(id);
if (!league) {
  throw new Error("League not found");
}
```

#### 2. Image Cleanup

```javascript
if (league.image) {
  const imagePath = path.join(process.cwd(), league.image);
  try {
    await fs.unlink(imagePath);
  } catch (err) {
    console.warn(`Failed to delete image: ${err.message}`);
  }
}
```

#### 3. Database Deletion

```javascript
await Leagues.findByIdAndDelete(id);
```

#### 4. Success Handling

```javascript
cookieStore.set("toastMessage", "League Deleted");
redirect("/admin/leagues");
```

---

## Validation Schema

### LeaguesSchema Usage

```javascript
const result = LeaguesSchema(isUpdate).safeParse(data);
```

- `isUpdate`: Boolean flag (false for create, true for update)
- Different validation rules for create vs update operations
- Image validation differs between operations

---

## File Upload Configuration

### Upload Directory

- **Path:** `uploads/leagues/`
- **Location:** Relative to project root
- **Auto-creation:** Directory created if not exists

### File Naming

- **Create:** `${uuidv4()}${extension}` (e.g., `123e4567-e89b-12d3-a456-426614174000.jpg`)
- **Update:** `${Date.now()}_${originalName}` (e.g., `1640995200000_league.jpg`)

### Supported Formats

- Determined by file extension
- No explicit format validation (handled by schema)

---

## Error Handling

### Validation Errors

```javascript
return { success: false, errors: result.error.flatten().fieldErrors };
```

- Returns field-specific validation errors
- Prevents database operations on invalid data

### File System Errors

```javascript
console.warn(`Failed to delete image: ${err.message}`);
```

- Logs file deletion failures but continues operation
- Non-blocking error handling

### Database Errors

- Throws errors for not found records
- Relies on Mongoose error handling

---

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `connectDB` | `@/lib/db` | MongoDB connection |
| `cookies` | `next/headers` | Cookie management |
| `redirect` | `next/navigation` | Server redirects |
| `LeaguesSchema` | `@/lib/validation/leagues` | Data validation |
| `uuidv4` | `uuid` | Unique file naming |
| `path` | `path` | File path operations |
| `fs` | `fs` | File system operations |
| `Leagues` | `@/lib/models/Leagues` | Database model |

---

## Database Schema

### League Document Structure

```javascript
{
  title: String,
  content: String,
  c_name: String,      // Contact name
  s_name: String,      // Secondary name
  email: String,
  p_name: String,      // Primary name
  website: String,
  telephone: String,
  age_groups: [String], // Array of age group IDs
  image: String,       // Relative path to image
  isActive: Boolean,   // Status field
  // timestamps added by Mongoose
}
```

---

## Usage Examples

### Create League Form

```jsx
'use client';
import { createLeagues } from '@/actions/leaguesActions';
import { useActionState } from 'react';

export default function CreateLeagueForm() {
  const [state, formAction] = useActionState(createLeagues, null);

  return (
    <form action={formAction} encType="multipart/form-data">
      <input name="title" required />
      <input name="email" type="email" />
      <input name="image" type="file" accept="image/*" />
      <select name="age_groups" multiple>
        {/* Age group options */}
      </select>
      <button type="submit">Create League</button>
      {state?.errors && <pre>{JSON.stringify(state.errors)}</pre>}
    </form>
  );
}
```

### Update League Form

```jsx
export default function UpdateLeagueForm({ leagueId }) {
  const [state, formAction] = useActionState(
    updateLeague.bind(null, leagueId),
    null
  );

  return (
    <form action={formAction} encType="multipart/form-data">
      {/* Form fields */}
      <button type="submit">Update League</button>
    </form>
  );
}
```

### Delete League Button

```jsx
import { deleteLeague } from '@/actions/leaguesActions';

export default function DeleteButton({ leagueId }) {
  return (
    <form action={deleteLeague.bind(null, leagueId)}>
      <button type="submit">Delete</button>
    </form>
  );
}
```

---

## Security Considerations

- File upload validation through Zod schema
- UUID prevents filename conflicts
- Image files stored outside web root
- User authentication via cookies
- Server-side only operations

---

## Performance Notes

- File operations are asynchronous
- Database connections pooled
- Image cleanup happens after successful operations
- UUID generation for uniqueness
- Directory creation is recursive

---

## Known Issues / Considerations

1. **File Deletion:** Old image deletion failures logged but don't block updates
2. **Validation:** Schema differences between create/update operations
3. **Error Handling:** Limited error feedback to user
4. **File Size:** No explicit file size limits
5. **Image Formats:** No format validation beyond schema

---

## Future Enhancements

- [ ] Add image optimization and resizing
- [ ] Implement file size limits
- [ ] Add image format validation
- [ ] Support multiple image uploads
- [ ] Add image alt text and metadata
- [ ] Implement soft delete with recovery
- [ ] Add league status management
- [ ] Support for league categories/tags
- [ ] Add bulk operations
- [ ] Implement audit logging
- [ ] Add league statistics tracking

---

## Testing Recommendations

- Test league creation with/without images
- Test image upload and path storage
- Test league updates with image replacement
- Test league deletion and image cleanup
- Verify validation error handling
- Test file system error scenarios
- Check database constraint handling
- Test concurrent operations
- Verify cookie and redirect behavior
- Test with various image formats and sizes

---

## Support & Maintenance

- Monitor upload directory disk space
- Clean up orphaned image files
- Update validation schemas as requirements change
- Monitor database performance for large datasets
- Implement backup strategies for uploads
- Regular security audits of file operations
- Update dependencies (uuid, fs operations)
- Test with different file system configurations
