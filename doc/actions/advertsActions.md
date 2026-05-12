# Adverts Actions Documentation

## Actions Purpose

Advertising and promotional content management for the FUTY platform.

**Key Responsibility:** Manage advertisements, banners, and promotional materials.

---

## Key Features

- Advertisement creation and management
- Banner image upload and management
- Advertising campaign tracking
- Promotional content scheduling
- Advertisement targeting and analytics

---

## Special Features

### Advertising Assets

```javascript
const imageFile = formData.get("image");
// Advertisement banner/image upload
const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
```

### Campaign Management

- Advertisement scheduling
- Target audience definition
- Campaign performance tracking
- Budget and billing management

---

## Database Schema

```javascript
{
  title: String,
  content: String,
  image: String,        // Advertisement banner
  target_url: String,   // Click destination
  start_date: Date,
  end_date: Date,
  isActive: Boolean,
  // ... other advertising fields
}
```

---

## Advertising Features

- Banner advertisement management
- Promotional campaign creation
- Advertisement scheduling and rotation
- Click tracking and analytics
- Revenue and performance reporting

---

## Usage Notes

- Image optimization for web delivery
- Advertisement approval workflows
- Targeting and segmentation
- Performance monitoring and reporting
