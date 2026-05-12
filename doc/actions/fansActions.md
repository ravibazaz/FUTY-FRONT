# Fans Actions Documentation

## Actions Purpose

Fan/supporter management with user account creation and profile management.

**Key Responsibility:** Handle fan registrations with authentication and profile data.

---

## Key Features

- Fan profile creation with user accounts
- Password hashing for fan authentication
- Profile image upload
- Fan data validation

---

## Special Features

### Fan Account Creation

```javascript
const password = formData.get("password");
const hashedPassword = await bcrypt.hash(password, 10);

await Users.create({
  ...fanData,
  password: hashedPassword,
  account_type: 'Fan'
});
```

### Profile Management

```javascript
const imageFile = formData.get("profile_image");
// Fan profile image handling
```

---

## Database Relationships

- **Fan Profile:** Extended fan information
- **User Account:** Login credentials
- **Profile Image:** Fan avatar/photo

---

## Security Notes

- Secure password hashing
- Profile image validation
- Account type segregation
