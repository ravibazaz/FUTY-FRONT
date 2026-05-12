# Footer Component Documentation

## Component Purpose

The `Footer` component is a script loader that includes essential JavaScript libraries and custom scripts required for the FUTY admin dashboard functionality. It loads jQuery, Bootstrap, Chart.js, and dashboard-specific JavaScript files.

**Key Responsibility:** Load external and internal JavaScript dependencies for dashboard functionality.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/Footer.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with Script components |
| **Props** | None |
| **Dependencies** | Next.js Script component |
| **Client-side Only** | Yes (`"use client"`) |

---

## Key Features

- Loads jQuery 3.7.1 from CDN
- Loads Bootstrap bundle JavaScript
- Loads Chart.js 4.3.2 from CDN with integrity check
- Loads custom dashboard JavaScript
- Uses Next.js Script optimization with `strategy="afterInteractive"`
- Ensures scripts load after page becomes interactive

---

## Component Structure

```jsx
export default function Footer() {
  return (
    <>
      <script src="https://code.jquery.com/jquery-3.7.1.js" strategy="afterInteractive"></script>
      <script src="/js/bootstrap.bundle.min.js" className="astro-vvvwv3sm" strategy="afterInteractive"></script>
      <script 
        src="https://cdn.jsdelivr.net/npm/chart.js@4.3.2/dist/chart.umd.js" 
        integrity="sha384-eI7PSr3L1XLISH8JdDII5YN/njoSsxfbrkCTnJrzXt+ENP5MOVBxD+l6sEG4zoLp" 
        crossOrigin="anonymous" 
        className="astro-vvvwv3sm" 
        strategy="afterInteractive"
      ></script>
      <script src="/js/dashboard.js" strategy="afterInteractive" className="astro-vvvwv3sm"></script>
    </>
  );
}
```

---

## Script Loading Strategy

All scripts use `strategy="afterInteractive"`, which means:

- Scripts load after the page becomes interactive
- Non-blocking script loading
- Scripts execute after React hydration
- Better performance as scripts don't block initial page render

---

## Loaded Scripts

### 1. jQuery 3.7.1

```jsx
<script src="https://code.jquery.com/jquery-3.7.1.js" strategy="afterInteractive"></script>
```

**Purpose:** Provides jQuery library for DOM manipulation and AJAX requests.

**Source:** jQuery CDN  
**Version:** 3.7.1  
**Loading:** After page becomes interactive

### 2. Bootstrap Bundle

```jsx
<script src="/js/bootstrap.bundle.min.js" className="astro-vvvwv3sm" strategy="afterInteractive"></script>
```

**Purpose:** Includes Bootstrap JavaScript components (modals, dropdowns, tooltips, etc.) and Popper.js.

**Source:** Local `/js/bootstrap.bundle.min.js`  
**Includes:** Bootstrap JS + Popper.js  
**Loading:** After page becomes interactive

### 3. Chart.js 4.3.2

```jsx
<script 
  src="https://cdn.jsdelivr.net/npm/chart.js@4.3.2/dist/chart.umd.js" 
  integrity="sha384-eI7PSr3L1XLISH8JdDII5YN/njoSsxfbrkCTnJrzXt+ENP5MOVBxD+l6sEG4zoLp" 
  crossOrigin="anonymous" 
  className="astro-vvvwv3sm" 
  strategy="afterInteractive"
/>
```

**Purpose:** Provides Chart.js library for creating charts and graphs in the dashboard.

**Source:** jsDelivr CDN  
**Version:** 4.3.2  
**Integrity:** SHA-384 hash for security  
**Cross-Origin:** Anonymous CORS  
**Loading:** After page becomes interactive

### 4. Dashboard JavaScript

```jsx
<script src="/js/dashboard.js" strategy="afterInteractive" className="astro-vvvwv3sm"></script>
```

**Purpose:** Custom JavaScript for dashboard-specific functionality.

**Source:** Local `/js/dashboard.js`  
**Contents:** Custom dashboard logic, interactions, initializations  
**Loading:** After page becomes interactive

---

## Dependencies

| Library | Version | Purpose | Source |
|---------|---------|---------|--------|
| jQuery | 3.7.1 | DOM manipulation, AJAX | CDN |
| Bootstrap | Bundle | UI components, interactions | Local |
| Chart.js | 4.3.2 | Charts and graphs | CDN |
| Dashboard JS | Custom | Dashboard functionality | Local |

---

## Usage Example

### Basic Usage

```jsx
import Footer from '@/components/Footer';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### In App Layout

```jsx
import Footer from '@/components/Footer';

export default function RootLayout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

---

## Behavior Notes

- Component renders no visible content, only script tags
- Scripts are loaded asynchronously after page interaction
- Order of script loading is preserved (jQuery → Bootstrap → Chart.js → Dashboard)
- Scripts are essential for dashboard functionality
- Component should be included in the root layout

---

## Performance Considerations

- Uses `strategy="afterInteractive"` for optimal loading
- Scripts load after React hydration completes
- Non-blocking script execution
- CDN resources have integrity checks for security

---

## Known Issues / Considerations

1. **jQuery Dependency:** Many components may depend on jQuery being available globally

2. **Script Order:** Scripts must load in the correct order (jQuery before Bootstrap, etc.)

3. **CDN Reliability:** Chart.js depends on jsDelivr CDN availability

4. **Local Files:** `/js/bootstrap.bundle.min.js` and `/js/dashboard.js` must exist

5. **Global Pollution:** Scripts add global variables (`$`, `jQuery`, `Chart`, etc.)

---

## Security Notes

- Chart.js script includes Subresource Integrity (SRI) hash
- Cross-origin anonymous loading for Chart.js
- Local scripts should be served securely

---

## Future Enhancements

- [ ] Consider migrating away from jQuery to modern JavaScript
- [ ] Evaluate using ES6 modules instead of global scripts
- [ ] Add error handling for script loading failures
- [ ] Consider lazy loading scripts only when needed
- [ ] Add version pinning for better cache control
- [ ] Consider using Next.js built-in script optimization features

---

## Support & Maintenance

- Ensure all local script files exist: `/js/bootstrap.bundle.min.js`, `/js/dashboard.js`
- Verify CDN availability for external scripts
- Check for jQuery conflicts with other libraries
- Monitor Chart.js version updates and update integrity hash
- Test dashboard functionality when scripts fail to load
- Consider script loading fallbacks for production
