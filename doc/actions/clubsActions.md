# Clubs Actions Documentation

## Actions Purpose

The `clubsActions.js` file contains server actions for managing sports clubs in the FUTY system. It handles comprehensive club information including contact details, leadership positions, league affiliations, and image management with full CRUD operations.

**Key Responsibility:** Manage club entities with complex organizational data and image handling.

---

## Actions Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `actions/clubsActions.js` |
| **Type** | Next.js Server Actions |
| **Framework** | Next.js with server-side execution |
| **Database** | MongoDB with Mongoose |
| **Validation** | Zod schema validation |
| **File Handling** | Image upload with UUID naming |
| **Operations** | Create, Update, Delete clubs |
| **Complexity** | Multi-contact club management |

---

## Key Features

- Club creation with comprehensive contact information
- Club updating with optional image replacement
- Club deletion with image cleanup
- Multiple contact roles (Secretary, CWO - Club Welfare Officer)
- League affiliation management
- Age group associations
- Image upload and management
- Toast notifications and redirects

---

## Club Data Fields

### Core Information

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Club name |
| `email` | String | Primary club email |
| `phone` | String | Club phone number |
| `league` | String | Associated league |
| `age_groups` | Array | Associated age groups |
| `image` | String | Club logo/image path |

### Leadership Contacts

| Field | Type | Description |
|-------|------|-------------|
| `secretary_name` | String | Club secretary name |
| `secretary_website` | String | Club secretary website |
| `cwo_name` | String | Club Welfare Officer name |
| `cwo_email` | String | CWO email address |
| `cwo_phone` | String | CWO phone number |

---

## Create Club Action

### Function Signature

```javascript
export async function createClub(prevState, formData)
```

### Process Flow

```javascript
const raw = Object.fromEntries(formData.entries());
const imageFile = formData.get("image");
const age_groups = formData.getAll("age_groups");
const result = ClubSchema(false).safeParse({ ...raw, image: imageFile });

// Image upload with UUID naming
const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
const filePath = path.join(process.cwd(), "uploads/clubs", uniqueName);
await fs.mkdir(path.dirname(filePath), { recursive: true });
const arrayBuffer = await imageFile.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
await fs.writeFile(filePath, buffer);

// Database creation
await Clubs.create({
  ...result.data,
  age_groups: age_groups,
  image: `/uploads/clubs/${uniqueName}`,
});

cookieStore.set("toastMessage", "Club Added");
redirect("/admin/clubs");
```

---

## Update Club Action

### Function Signature

```javascript
export async function updateClub(id, prevState, formData)
```

### Complex Update Fields

```javascript
const { name, secretary_name, secretary_website, phone,
        cwo_name, cwo_email, cwo_phone, email, league } = result.data;
const imageFile = formData.get("image");
const age_groups = formData.getAll("age_groups");
```

- Handles multiple contact updates
- Manages league and age group associations
- Supports image replacement

---

## File Upload Configuration

### Upload Directory

- **Path:** `uploads/clubs/`
- **Naming:** UUID for creation, timestamp for updates
- **Cleanup:** Automatic old image deletion

---

## Database Schema

### Club Document Structure

```javascript
{
  name: String,              // Club name
  email: String,             // Primary email
  phone: String,             // Phone number
  league: String,            // League affiliation
  age_groups: [String],      // Associated age groups
  image: String,             // Logo image path

  // Leadership contacts
  secretary_name: String,    // Club secretary
  secretary_website: String, // Secretary website
  cwo_name: String,          // Club Welfare Officer
  cwo_email: String,         // CWO email
  cwo_phone: String,         // CWO phone

  isActive: Boolean,         // Active status
  // Timestamps added by Mongoose
}
```

---

## Validation Schema

### ClubSchema Structure

```javascript
// Creation validation
ClubSchema(false).safeParse({
  name: string().min(1),
  email: string().email(),
  phone: string(),
  league: string(),
  secretary_name: string(),
  cwo_name: string(),
  cwo_email: string().email(),
  age_groups: array(),
  image: File // Required
});

// Update validation
ClubSchema(true).safeParse({
  // ... fields
  image: File // Optional
});
```

---

## Usage Examples

### Create Club Form

```jsx
'use client';
import { createClub } from '@/actions/clubsActions';

export default function CreateClubForm() {
  const [state, formAction] = useActionState(createClub, null);

  return (
    <form action={formAction} encType="multipart/form-data">
      <input name="name" placeholder="Club Name" required />
      <input name="email" type="email" placeholder="Club Email" />
      <input name="phone" placeholder="Phone Number" />

      {/* Leadership Contacts */}
      <input name="secretary_name" placeholder="Secretary Name" />
      <input name="cwo_name" placeholder="CWO Name" required />
      <input name="cwo_email" type="email" placeholder="CWO Email" required />

      {/* Affiliations */}
      <select name="league">
        {/* League options */}
      </select>
      <select name="age_groups" multiple>
        {/* Age group options */}
      </select>

      <input name="image" type="file" accept="image/*" />
      <button type="submit">Create Club</button>
    </form>
  );
}
```

### Club Contact Display

```jsx
export default function ClubContacts({ club }) {
  return (
    <div className="club-contacts">
      <div className="primary-contact">
        <h4>Club Secretary</h4>
        <p>{club.secretary_name}</p>
        <p>{club.secretary_website}</p>
      </div>

      <div className="welfare-officer">
        <h4>Club Welfare Officer</h4>
        <p>{club.cwo_name}</p>
        <p>{club.cwo_email}</p>
        <p>{club.cwo_phone}</p>
      </div>
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
| `ClubSchema` | `@/lib/validation/clubs` | Data validation |
| `uuidv4` | `uuid` | Unique naming |
| `path` | `path` | File paths |
| `fs` | `fs` | File operations |
| `Clubs` | `@/lib/models/Clubs` | Database model |

---

## Security Considerations

- Email validation for contact addresses
- File upload validation through schema
- Server-side operations only
- Image files isolated from web root

---

## Performance Notes

- Complex document structure
- Multiple contact field updates
- Image upload operations
- Array field management (age_groups)

---

## Known Issues / Considerations

1. **CWO Requirement:** CWO fields are required but may not apply to all clubs
2. **Multiple Contacts:** Complex contact management may need simplification
3. **League Validation:** League references may need existence validation

---

## Future Enhancements

- [ ] Add club address/location fields
- [ ] Implement club membership statistics
- [ ] Add club social media links
- [ ] Support multiple club images/photos
- [ ] Add club registration dates
- [ ] Implement club status workflows
- [ ] Add club communication preferences
- [ ] Support for club sub-teams/divisions

---

## Testing Recommendations

- Test club creation with all contact fields
- Test image upload and replacement
- Verify age group associations
- Test league affiliation updates
- Validate email format requirements
- Test CWO field requirements
- Verify contact information updates

---

## Support & Maintenance

- Monitor club data complexity
- Update validation for new requirements
- Regular backup of club images
- Audit contact information accuracy
- Monitor database query performance
- Update contact field requirements based on regulations
