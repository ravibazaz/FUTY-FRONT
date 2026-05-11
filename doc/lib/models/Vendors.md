# Vendors Model Documentation

## Model Purpose

The `Vendors` model represents business vendors and sponsors in the FUTY application. It stores vendor information, promotional content, contact details, and advertising campaign data including scheduling and page placement.

**Key Responsibility:** Store vendor profiles and manage advertising campaigns with scheduling and placement information.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Vendors.js` |
| **Collection Name** | `vendors` |
| **Type** | Mongoose Schema Model |
| **Relationships** | None direct (page-based placement) |
| **Special Features** | Campaign scheduling, multi-page placement, promotional content |

---

## Schema Definition

### Core Vendor Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String` | No | Vendor/business name |
| `isActive` | `Boolean` | No | Vendor active status (default: true) |

### Content & Media

| Field | Type | Description |
|-------|------|-------------|
| `image` | `String` | Vendor logo/banner image URL |
| `content` | `String` | Promotional content/description |
| `link` | `String` | Vendor website/external link |

### Contact Information

| Field | Type | Description |
|-------|------|-------------|
| `email` | `String` | Contact email address |
| `phone` | `String` | Contact phone number |

### Campaign Scheduling

| Field | Type | Description |
|-------|------|-------------|
| `startAt` | `Date` | Campaign start timestamp (default: now) |
| `date` | `String` | Campaign start date (string format) |
| `time` | `String` | Campaign start time |
| `endAt` | `Date` | Campaign end timestamp (default: now) |
| `end_date` | `String` | Campaign end date (string format) |
| `end_time` | `String` | Campaign end time |

### Advertising Placement

| Field | Type | Description |
|-------|------|-------------|
| `pages` | `Array<String>` | Pages where vendor appears |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Vendor creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Active Vendors** | `isActive` | Active vendor queries |
| **Campaign Dates** | `startAt`, `endAt` | Campaign scheduling queries |
| **Page Placement** | `pages` | Find vendors by page placement |

---

## Usage Examples

### Example 1: Vendor Creation
```javascript
import Vendor from '@/lib/models/Vendors';

export async function createVendor(vendorData) {
  const vendor = new Vendor({
    name: vendorData.name,
    image: vendorData.logoUrl,
    content: vendorData.description,
    link: vendorData.website,
    email: vendorData.email,
    phone: vendorData.phone,
    startAt: new Date(vendorData.startDate),
    date: vendorData.startDate,
    time: vendorData.startTime,
    endAt: new Date(vendorData.endDate),
    end_date: vendorData.endDate,
    end_time: vendorData.endTime,
    pages: vendorData.pagePlacements,
    isActive: true
  });

  return await vendor.save();
}
```

### Example 2: Active Campaign Vendors
```javascript
export async function getActiveVendors() {
  const now = new Date();
  
  return await Vendor.find({
    isActive: true,
    startAt: { $lte: now },
    endAt: { $gte: now }
  })
  .select('name image content link')
  .sort({ name: 1 });
}
```

### Example 3: Vendors by Page
```javascript
export async function getVendorsForPage(pageName) {
  const now = new Date();
  
  return await Vendor.find({
    isActive: true,
    pages: pageName,
    startAt: { $lte: now },
    endAt: { $gte: now }
  })
  .select('name image content link')
  .sort({ createdAt: -1 });
}
```

### Example 4: Campaign Management
```javascript
export async function updateCampaignDates(vendorId, dates) {
  return await Vendor.findByIdAndUpdate(vendorId, {
    startAt: new Date(dates.startDate),
    date: dates.startDate,
    time: dates.startTime,
    endAt: new Date(dates.endDate),
    end_date: dates.endDate,
    end_time: dates.endTime
  }, { new: true });
}
```

### Example 5: Vendor Statistics
```javascript
export async function getVendorStats() {
  const total = await Vendor.countDocuments();
  const active = await Vendor.countDocuments({ isActive: true });
  const currentCampaigns = await Vendor.countDocuments({
    isActive: true,
    startAt: { $lte: new Date() },
    endAt: { $gte: new Date() }
  });
  
  const pageDistribution = await Vendor.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$pages' },
    { $group: { _id: '$pages', count: { $sum: 1 } } }
  ]);
  
  return {
    total,
    active,
    inactive: total - active,
    currentCampaigns,
    pageDistribution: pageDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **Boolean Defaults** | Default `isActive: true` | Automatic value assignment |
| **Date Defaults** | Default timestamps | Automatic value assignment |
| **Array Validation** | Pages array validation | Validation errors |

---

## Business Rules

### 1. **Campaign Scheduling**
- **Rule:** Vendors have start and end dates for advertising campaigns
- **Dual Format:** Both Date objects and string representations
- **Purpose:** Precise campaign timing and management

### 2. **Page Placement**
- **Rule:** Vendors can be placed on multiple pages
- **Array Field:** `pages` contains page identifiers
- **Purpose:** Targeted advertising placement

### 3. **Active Status**
- **Rule:** Vendors can be active or inactive
- **Default:** New vendors are active
- **Impact:** Inactive vendors don't appear in advertising

### 4. **Contact Requirements**
- **Rule:** Vendors should have contact information
- **Optional:** Email and phone are not required but recommended
- **Purpose:** Business relationship management

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Date Queries** | Range queries on dates | Ensure proper indexing for date ranges |
| **Array Queries** | Page array operations | Consider indexing for array queries |
| **Active Filtering** | Boolean status queries | Add compound indexes with active status |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial vendor model with campaign scheduling |

---

## Future Enhancements

- [ ] Add vendor categories and types
- [ ] Implement campaign budgeting and pricing
- [ ] Add vendor performance analytics
- [ ] Support for vendor contracts and agreements
- [ ] Add vendor approval workflow
- [ ] Implement vendor rating and review system
- [ ] Add vendor location and service areas
- [ ] Support for vendor promotions and discounts
- [ ] Add vendor interaction tracking

---

## Related Models

- **Page-based relationships:** Vendors appear on various application pages
- **No direct model relationships:** Placement determined by page array

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
