# Formatter Module Documentation

## Module Purpose

The `formatter` module provides internationalization and formatting utilities for the FUTY application. It offers date formatting, number formatting, and currency formatting functions using native JavaScript Intl API for consistent, localized presentation of data.

**Key Responsibility:** Format dates, numbers, and currencies according to locale-specific conventions for consistent user interface presentation.

---

## Module Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/formatter.js` |
| **Type** | Internationalization Utilities |
| **Dependencies** | None (uses native Intl API) |
| **Exports** | `formatDate()` |
| **Usage Pattern** | Pure functions for data formatting |

---

## API Reference

### `formatDate(dateString, locale)`

Formats a date string into a localized, human-readable format.

#### Signature
```javascript
formatDate(dateString: string, locale: string = 'en-US'): string
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `dateString` | `string` | Yes | - | ISO date string or date string |
| `locale` | `string` | No | `'en-US'` | BCP 47 locale identifier |

#### Return Value

| Type | Description |
|------|-------------|
| `string` | Localized date string (e.g., "December 25, 2023") |

#### Implementation Details

- **Date Parsing:** Uses `new Date(dateString)` for parsing
- **Intl.DateTimeFormat:** Leverages browser Intl API
- **Default Options:** `{ year: 'numeric', month: 'long', day: 'numeric' }`
- **Locale Support:** Accepts any valid BCP 47 locale

---

## Request Flow

```
Input Date String → new Date() parsing
        ↓
  Intl.DateTimeFormat(locale, options)
        ↓
  Localized date string
        ↓
  Return formatted result
```

---

## Usage Examples

### Example 1: Basic Date Formatting
```javascript
import { formatDate } from '@/lib/formatter';

const dateString = '2023-12-25T10:30:00Z';
const formatted = formatDate(dateString);
// Output: "December 25, 2023" (en-US locale)
```

### Example 2: Different Locales
```javascript
const date = '2023-12-25';

// English (US)
formatDate(date, 'en-US'); // "December 25, 2023"

// English (UK)
formatDate(date, 'en-GB'); // "25 December 2023"

// Spanish
formatDate(date, 'es-ES'); // "25 de diciembre de 2023"

// French
formatDate(date, 'fr-FR'); // "25 décembre 2023"
```

### Example 3: In React Components
```javascript
import { formatDate } from '@/lib/formatter';

export function EventCard({ event }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>Date: {formatDate(event.date)}</p>
      <p>Location: {event.location}</p>
    </div>
  );
}
```

### Example 4: API Response Formatting
```javascript
import { formatDate } from '@/lib/formatter';

export async function getEvents() {
  const events = await Event.find();
  
  return events.map(event => ({
    ...event.toObject(),
    formattedDate: formatDate(event.date),
    formattedCreatedAt: formatDate(event.createdAt, 'en-GB')
  }));
}
```

### Example 5: User Profile Display
```javascript
export function UserProfile({ user, locale }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Member since: {formatDate(user.createdAt, locale)}</p>
      <p>Last login: {formatDate(user.lastLogin, locale)}</p>
    </div>
  );
}
```

---

## Validations

| Validation | Behavior | Error Handling |
|-----------|----------|----------------|
| **Date String** | Accepts any string parseable by Date() | Invalid dates return "Invalid Date" |
| **Locale** | Accepts any string; falls back to 'en-US' | Invalid locales use default formatting |
| **Null/Undefined** | No explicit validation | May throw or return unexpected results |
| **Date Object** | Accepts Date objects (converted to string) | Standard Date parsing behavior |

---

## Response Examples

| Input | Locale | Output | Notes |
|-------|--------|--------|-------|
| `'2023-12-25'` | `'en-US'` | `"December 25, 2023"` | Default locale |
| `'2023-12-25'` | `'en-GB'` | `"25 December 2023"` | Day-month-year format |
| `'2023-12-25'` | `'de-DE'` | `"25. Dezember 2023"` | German format |
| `'2023-01-01T00:00:00Z'` | `'en-US'` | `"January 1, 2023"` | Ignores time component |
| `new Date()` | `'en-US'` | `"December 25, 2023"` | Accepts Date objects |

---

## Error Handling

### Current State
**Minimal Error Handling:** Relies on JavaScript's Date parsing and Intl API error handling.

### Potential Issues & Mitigation

| Issue | Scenario | Impact | Recommendation |
|-------|----------|--------|-----------------|
| **Invalid Date** | Unparseable date string | Returns "Invalid Date" | **Validate date strings** |
| **Unsupported Locale** | Invalid locale code | Falls back to default | **Use known locale codes** |
| **Browser Compatibility** | Old browsers without Intl | May not work | **Add polyfill support** |
| **Timezone Issues** | Date parsing inconsistencies | Wrong date display | **Use ISO strings consistently** |

### Recommended Error Handling Pattern
```javascript
export function formatDate(dateString, locale = 'en-US') {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string provided to formatDate:', dateString);
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    
  } catch (error) {
    console.error('Date formatting failed:', error);
    return 'Date Unavailable';
  }
}
```

---

## Security Considerations

### 1. **Input Validation**
- **Date Injection:** Malformed date strings could cause parsing errors
- **Locale Injection:** Invalid locale codes are handled gracefully
- **XSS Prevention:** Output is safe for HTML rendering

### 2. **Data Exposure**
- **No Sensitive Data:** Only formats display data
- **Timezone Safety:** Uses client-side timezone for display
- **Consistency:** Same input always produces same output

### 3. **Performance**
- **Caching:** No built-in caching of Intl instances
- **Memory Usage:** Minimal, creates new Intl instances per call
- **Execution Speed:** Fast native API calls

---

## Important Business Rules

### 1. **Locale Consistency**
- **Rule:** Applications should use consistent locale across formatting
- **Implication:** User experience consistency
- **Implementation:** Default to 'en-US' with user preference override

### 2. **Date Format Standards**
- **Rule:** Dates displayed in human-readable format
- **Enforcement:** Long month names, full years
- **Business Impact:** Improved user experience and accessibility

### 3. **Timezone Handling**
- **Rule:** Dates formatted in user's local timezone
- **Guarantee:** Client-side rendering shows local time
- **Server-Side Note:** Server-rendered dates may show server timezone

### 4. **Error Resilience**
- **Rule:** Invalid dates should not break the application
- **Implication:** Graceful degradation for bad data
- **Reliability:** Application continues to function with invalid dates

---

## Integration Points

### Typical Usage Contexts

| Context | Example |
|---------|---------|
| **UI Components** | Display dates in React components |
| **API Responses** | Format dates for client consumption |
| **Reports** | Human-readable date formatting |
| **User Profiles** | Registration dates, last login |
| **Event Listings** | Match dates, tournament schedules |

### Common Calling Patterns

```javascript
// Pattern 1: Component Integration
export function DateDisplay({ date, locale }) {
  return <span>{formatDate(date, locale)}</span>;
}

// Pattern 2: API Response Formatting
export async function getFormattedEvents() {
  const events = await Event.find();
  return events.map(event => ({
    ...event.toObject(),
    displayDate: formatDate(event.date)
  }));
}

// Pattern 3: User Preferences
export function getUserLocale(user) {
  return user.preferences?.locale || 'en-US';
}

export function formatUserDate(user, date) {
  return formatDate(date, getUserLocale(user));
}
```

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **Execution Time** | < 1ms | Native Intl API performance |
| **Memory Usage** | Minimal | No persistent state |
| **Caching** | None | Creates new instances per call |
| **Browser Support** | Modern browsers | Requires Intl API support |

---

## Browser Compatibility

### Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| **Chrome** | 24+ | Full Intl support |
| **Firefox** | 29+ | Full Intl support |
| **Safari** | 10+ | Full Intl support |
| **Edge** | 12+ | Full Intl support |

### Polyfill Recommendation

For older browsers, consider using `intl` polyfill:
```javascript
import 'intl';
import 'intl/locale-data/jsonp/en.js';
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial date formatting implementation |

---

## Future Enhancements

- [ ] Add number formatting functions
- [ ] Add currency formatting functions
- [ ] Implement date/time formatting options
- [ ] Add relative time formatting ("2 hours ago")
- [ ] Support for custom date format patterns
- [ ] Add timezone conversion utilities
- [ ] Implement caching for Intl instances
- [ ] Add validation for date strings

---

## Related Modules

- (None currently documented)

---

## Support & Maintenance

For questions or issues related to this module, please refer to the main project documentation or contact the development team.
