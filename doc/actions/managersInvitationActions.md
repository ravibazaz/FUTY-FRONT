# Managers Invitation Actions Documentation

## Actions Purpose

Manager invitation system with email notifications and invitation code generation.

**Key Responsibility:** Handle manager invitation workflow with secure code generation and email delivery.

---

## Key Features

- Invitation code generation
- Email notification system
- Manager invitation tracking
- Secure invitation workflow

---

## Special Features

### Invitation Code Generation

```javascript
const uniqueId = `${Date.now()}`;
const message = `<p>Invitation Code : ${uniqueId}</p>`;
```

- Timestamp-based unique codes
- Email delivery integration

### Email Integration

```javascript
const res2 = await fetch(process.env.BREVO_REST_URL, {
  method: "POST",
  // Email sending logic
});
```

- Brevo email service integration
- HTML email templates
- Invitation code delivery

---

## Process Flow

1. Generate unique invitation code
2. Create invitation record
3. Send email with invitation code
4. Track invitation status

---

## Security Considerations

- Unique invitation codes
- Email-based delivery
- Code expiration handling
- Secure invitation validation
