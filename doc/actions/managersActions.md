# Managers Actions Documentation

## Actions Purpose

Manager profile management with user account creation and location services.

**Key Responsibility:** Handle manager profiles with integrated authentication and geospatial data.

---

## Key Features

- Manager profile creation with user accounts
- Password hashing and secure authentication
- Geocoding for manager locations
- Image upload support
- Manager-specific validation

---

## Special Features

### Manager Account Creation

```javascript
// Similar to players but for managerial roles
const hashedPassword = await bcrypt.hash(password, 10);
await Users.create({
  ...managerData,
  password: hashedPassword,
  account_type: 'Manager'
});
```

### Geographic Manager Data

```javascript
const geo = await getLatLng(formData.get("post_code"));
```

- Manager location mapping
- Address geocoding integration

---

## Role Differentiation

- **Account Type:** 'Manager' vs 'Player' vs 'Admin'
- **Permissions:** Manager-specific access levels
- **Profile Fields:** Manager-specific information

---

## Security Considerations

- Role-based account creation
- Secure password hashing
- Geographic data privacy
