# Adverts Model Documentation

## Model Purpose

The `Adverts` model represents advertising campaigns in the FUTY application. It stores advertisement content, scheduling information, placement details, and campaign management data. Advertisements support time-based activation and page-specific placement.

**Key Responsibility:** Store advertisement campaign information with scheduling and placement management.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Adverts.js` |
| **Collection Name** | `adverts` |
| **Type** | Mongoose Schema Model |
| **Relationships** | None direct (page-based placement) |
| **Special Features** | Campaign scheduling, multi-page placement, time-based activation |

---

## Schema Definition

### Core Advertisement Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `String` | No | Advertisement campaign name |
| `isActive` | `Boolean` | No | Advertisement active status (default: true) |

### Content & Media

| Field | Type | Description |
|-------|------|-------------|
| `image` | `String` | Advertisement image/banner URL |
| `content` | `String` | Advertisement content/description |
| `link` | `String` | Advertisement external link |

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
| `pages` | `Array<String>` | Pages where advertisement appears |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Advertisement creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Active Ads** | `isActive` | Active advertisement queries |
| **Campaign Dates** | `startAt`, `endAt` | Campaign scheduling queries |
| **Page Placement** | `pages` | Find advertisements by page placement |

---

## Usage Examples

### Example 1: Advertisement Creation
```javascript
import Advert from '@/lib/models/Adverts';

export async function createAdvert(advertData) {
  const advert = new Advert({
    name: advertData.campaignName,
    image: advertData.imageUrl,
    content: advertData.description,
    link: advertData.externalLink,
    startAt: new Date(advertData.startDate),
    date: advertData.startDate,
    time: advertData.startTime,
    endAt: new Date(advertData.endDate),
    end_date: advertData.endDate,
    end_time: advertData.endTime,
    pages: advertData.pagePlacements,
    isActive: true
  });

  return await advert.save();
}
```

### Example 2: Active Advertisements
```javascript
export async function getActiveAdverts() {
  const now = new Date();

  return await Advert.find({
    isActive: true,
    startAt: { $lte: now },
    endAt: { $gte: now }
  })
  .select('name image content link pages')
  .sort({ createdAt: -1 });
}
```

### Example 3: Page Advertisements
```javascript
export async function getPageAdverts(pageName) {
  const now = new Date();

  return await Advert.find({
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
export async function updateCampaignDates(advertId, dates) {
  return await Advert.findByIdAndUpdate(advertId, {
    startAt: new Date(dates.startDate),
    date: dates.startDate,
    time: dates.startTime,
    endAt: new Date(dates.endDate),
    end_date: dates.endDate,
    end_time: dates.endTime
  }, { new: true });
}
```

### Example 5: Advertisement Statistics
```javascript
export async function getAdvertStats() {
  const total = await Advert.countDocuments();
  const active = await Advert.countDocuments({ isActive: true });
  const currentCampaigns = await Advert.countDocuments({
    isActive: true,
    startAt: { $lte: new Date() },
    endAt: { $gte: new Date() }
  });

  const pageDistribution = await Advert.aggregate([
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
| **Date Defaults** | Default Date.now() | Automatic timestamp assignment |
| **Boolean Defaults** | Default `isActive: true` | Automatic value assignment |
| **Array Validation** | Pages array validation | Validation errors |

---

## Business Rules

### 1. **Campaign Scheduling**
- **Rule:** Advertisements have start and end dates for campaign management
- **Dual Format:** Both Date objects and string representations
- **Purpose:** Precise advertisement timing and budget control

### 2. **Page Placement**
- **Rule:** Advertisements can be placed on multiple pages
- **Array Field:** `pages` contains page identifiers
- **Purpose:** Targeted advertising placement

### 3. **Active Status**
- **Rule:** Advertisements can be active or inactive
- **Default:** New advertisements are active
- **Impact:** Inactive advertisements don't appear in campaigns

### 4. **Time-Based Activation**
- **Rule:** Advertisements are only shown during their active period
- **Validation:** Current time must be between start and end dates
- **Purpose:** Automated campaign management

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
| 1.0.0 | Current | Initial adverts model with campaign scheduling |

---

## Future Enhancements

- [ ] Add advertisement categories and types
- [ ] Implement campaign budgeting and pricing
- [ ] Add advertisement performance analytics
- [ ] Support for advertisement contracts and agreements
- [ ] Add advertisement approval workflow
- [ ] Implement advertisement targeting (user-based, location-based)
- [ ] Add advertisement click tracking
- [ ] Support for A/B testing of advertisements
- [ ] Add advertisement scheduling templates

---

## Related Models

- **Page-based relationships:** Advertisements appear on various application pages
- **No direct model relationships:** Placement determined by page array

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
