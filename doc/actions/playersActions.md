# Players Actions Documentation

## Actions Purpose

Player management with user account creation, profile management, and location services.

**Key Responsibility:** Manage player profiles with integrated user accounts and geospatial data.

---

## Key Features

- Player profile creation with user account
- Password hashing for player accounts
- Geocoding for player locations
- Image upload support
- Complex player data validation

---

## Special Features

### User Account Integration

```javascript
import bcrypt from "bcryptjs";
import Users from "@/lib/models/Users";

// Create user account alongside player profile
const hashedPassword = await bcrypt.hash(password, 10);
await Users.create({ ...userData, password: hashedPassword });
```

### Geospatial Player Data

```javascript
const geo = await getLatLng(formData.get("postal_code"));
```

- Player location geocoding
- Address to coordinates conversion

---

## Database Relationships

- **Player Profile:** Extended player information
- **User Account:** Login credentials and authentication
- **Geographic Data:** Location coordinates for mapping

---

## Security Notes

- Password hashing with bcrypt
- Secure user account creation
- Location privacy considerations
