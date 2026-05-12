# EditStoreForm Component Documentation

## Component Purpose

The `EditStoreForm` component is a React form used to edit product information in the FUTY store admin portal. It supports updating product details, pricing, specifications, and image upload with live preview and enhanced category selection via TomSelect.

**Key Responsibility:** Provide admin users with a comprehensive product editing interface that includes validation, image upload, and enhanced select controls.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditStoreForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `store` object |
| **Related Models** | Stores/Products |
| **Related Actions** | `updateStore` server action |
| **Dependencies** | `next/image`, `next/link`, `StoresSchema`, `useActionState`, `useFormStatus`, `tom-select` |
| **API Endpoints** | `/api/categories` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `store` | `Object` | Yes | Existing product data used to prefill the form |

### Expected Store Object Structure

```javascript
{
  _id: String,
  title: String,
  category: String,        // Category ID
  content: String,         // Description
  price: String,
  discount: String,
  shipping_cost: String,
  size: String,
  color: String,
  material: String,
  product_code: String,
  other_product_info: String,
  image: String            // Image path
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `categories` | `Array` | `[]` | List of all available product categories fetched from API |
| `selectedCategory` | `String` | `store.category ? store.category : ''` | Currently selected category ID |
| `clientErrors` | `Object` | `{}` | Client-side validation errors |
| `preview` | `String` | `store.image ? '/api' + store.image : '/images/club-badge.jpg'` | Current image preview URL |
| `state` | `Object` | Server action state | Track server response/errors from `useActionState` |

### Refs

| Ref | Type | Purpose |
|-----|------|---------|
| `fileInputRef` | `Ref<HTMLInputElement>` | Reference to hidden file input element |
| `previewsRef` | `Ref<HTMLDivElement>` | Unused reference (legacy code) |
| `selectRef` | `Ref<HTMLSelectElement>` | Reference to category select element for TomSelect |
| `tomSelectRef` | `Ref<TomSelect>` | Reference to TomSelect instance |

---

## Key Features

- Editable fields for comprehensive product information
- Enhanced category selection with TomSelect (searchable dropdown)
- Product image upload with live preview
- Pricing fields (price, discount, shipping cost)
- Product specifications (size, color, material, product code)
- Client-side validation via `StoresSchema`
- Server-side validation via `updateStore` action
- Asynchronous category fetching
- Inline validation message rendering

---

## Form Fields

| Field | Name | Type | Validation |
|-------|------|------|-----------|
| Title | `title` | `text` | Required |
| Category | `category` | `select` (TomSelect) | Required |
| Description | `content` | `textarea` | Optional |
| Price | `price` | `text` | Optional |
| Discount | `discount` | `number` | Optional |
| Shipping Cost | `shipping_cost` | `number` | Optional |
| Size | `size` | `select` | Optional |
| Color | `color` | `text` | Optional |
| Material | `material` | `text` | Optional |
| Product Code | `product_code` | `text` | Optional |
| Other Info | `other_product_info` | `textarea` | Optional |
| Image | `image` | `file` | Image-only |

---

## Component Structure

### SubmitButton

```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <input 
        className="btn-common-text mt-30 mb-30" 
        disabled={pending} 
        type="submit" 
        value={pending ? "Editing" : "Save"}
      />
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/stores">
        Back
      </Link>
    </>
  );
}
```

---

## Methods & Handlers

### handleUploadClick()

```javascript
const handleUploadClick = () => {
  fileInputRef.current.click();
};
```

**Purpose:** Opens the hidden file input to select a product image.

### handleFileChange(e)

```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  }
};
```

**Purpose:** Converts the selected image to a data URL and updates the preview.

### handleSubmit(e)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const raw = Object.fromEntries(formData.entries());

  // Handle image file
  const imageFile = e.target.image.files[0];
  if (imageFile) {
    formData.set("image", imageFile);
  } else {
    formData.delete("image");
  }

  // Validate with schema
  const result = StoresSchema(true).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    setClientErrors(result.error.flatten().fieldErrors);
    return;
  }

  setClientErrors({});
  startTransition(() => {
    formAction(formData);
  });
};
```

**Purpose:** Runs validation and submits the product update.

---

## TomSelect Integration

### Category Selection

The component uses TomSelect to enhance the category select dropdown:

```javascript
tomSelectRef.current = new TomSelect(selectRef.current, {
  create: false,
  placeholder: "Choose a Category",
  sortField: { field: "text", direction: "asc" },
});
```

**Features:**
- Searchable dropdown
- No option creation (existing categories only)
- Alphabetical sorting
- Pre-selection in edit mode
- Proper cleanup on unmount

### Initialization Effects

Two useEffect hooks manage TomSelect:

1. **Categories Load Effect:** Initializes TomSelect after categories are fetched
2. **Selection Sync Effect:** Keeps TomSelect synced with `selectedCategory` changes

---

## Rendering Logic

### Category Dropdown

- Fetches categories from `/api/categories` on mount
- Renders standard `<select>` element
- TomSelect enhances it with search and better UX
- Pre-selects existing category in edit mode

### Size Dropdown

Hard-coded size options:
- S, M, L, XL, XLL, XLLL, 4XL, 5XL

### Image Upload

- Click on upload box triggers hidden file input
- New image selection updates the preview immediately
- Fallback to `/images/club-badge.jpg` if no image exists

### Error Display

- Field-related validation errors appear inline beneath each input
- Errors come from `clientErrors` (client validation) or `state.errors` (server validation)

---

## Styling & Layout

### CSS Classes

- `.main-body` — Main page container
- `.body-top` — Top breadcrumb and settings row
- `.body-title-bar` — Page title section
- `.left-info-box` — Field container block
- `.left-row` — Row wrapper for label/input pair
- `.left-label-col` — Label cell
- `.left-info-col` — Input cell
- `.form-control` — Standard input/textarea styling
- `.upload-box` — Image upload area
- `.invalid-feedback` — Validation text styling
- `.btn-common-text` — Submit button styling
- `.mt-30`, `.mb-30`, `.ps-3` — Spacing utilities

### TomSelect Styling

- Uses `tom-select/dist/css/tom-select.bootstrap5.css`
- Integrates with Bootstrap 5 styling

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `updateStore` | Server action for product update (bound to store._id) |
| `StoresSchema` | Zod validation schema |
| `useFormStatus` | Submit status display |
| `useActionState` | Handles action state |
| `Image` | Next.js image rendering |
| `Link` | Navigation back to admin list |
| `TomSelect` | Enhanced select dropdown |
| `tom-select` CSS | TomSelect styling |

---

## API Integration

### Categories Endpoint

**URL:** `/api/categories`  
**Method:** `GET`  
**Response Format:**

```json
{
  "categories": [
    {
      "_id": "category-id-1",
      "title": "Apparel"
    },
    {
      "_id": "category-id-2",
      "title": "Equipment"
    }
  ]
}
```

---

## Usage Example

```jsx
import EditStoreForm from '@/components/EditStoreForm';

export default function ProductEditPage({ store }) {
  return <EditStoreForm store={store} />;
}
```

---

## Behavior Notes

- The form prefills all fields with existing product data via `defaultValue` attributes
- Category selection uses TomSelect for better UX
- Image upload replaces existing preview (only for new uploads)
- Existing images remain on the server and display as previews
- Form validates before submission to provide immediate feedback
- Size options are hard-coded (not fetched from API)

---

## Known Issues / Considerations

1. **Typo in Console Error:** `console.error("Error fetching Caegory:", error);` should be "Category"

2. **Typo in Label:** "Descripton" should be "Description"

3. **Unused Ref:** `previewsRef` is declared but never used

4. **Hard-coded Sizes:** Size options are not configurable via API

---

## Validation

The `StoresSchema` validates:
- Required fields: `title`, `category`
- Optional fields: `content`, `price`, `discount`, `shipping_cost`, `size`, `color`, `material`, `product_code`, `other_product_info`, `image`
- Image type validation (image files only)

---

## Future Enhancements

- [ ] Fix typos: "Descripton" → "Description", "Caegory" → "Category"
- [ ] Remove unused `previewsRef` ref
- [ ] Make size options configurable via API
- [ ] Add image deletion for existing images
- [ ] Add success/error toast notifications
- [ ] Add product availability/stock fields
- [ ] Add multiple image upload support
- [ ] Add category creation in TomSelect
- [ ] Add form auto-save functionality

---

## Support & Maintenance

If updates fail, verify that:
- `updateStore` is correctly exported from `@/actions/storesActions`
- `StoresSchema` is properly configured in `@/lib/validation/stores`
- `/api/categories` endpoint returns the expected structure
- TomSelect is properly installed: `npm install tom-select`
- Store object structure matches expected format
