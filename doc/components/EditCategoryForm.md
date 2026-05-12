# EditCategoryForm Component Documentation

## Component Purpose

The `EditCategoryForm` component is a React form used to edit product category information in the FUTY store admin portal. It supports creating both main categories and sub-categories with conditional parent category selection, description, and image upload with live preview.

**Key Responsibility:** Provide admin users with a category editing interface that includes hierarchical category management and validation.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/EditCategoryForm.jsx` |
| **Type** | Client-side React component |
| **Framework** | Next.js with React Hooks |
| **Props** | `category` object |
| **Related Models** | Categories |
| **Related Actions** | `updateCategory` server action |
| **Dependencies** | `next/image`, `next/link`, `CategoriesSchema`, `useActionState`, `useFormStatus`, `tom-select` |
| **API Endpoints** | `/api/categories` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `category` | `Object` | Yes | Existing category data used to prefill the form |

### Expected Category Object Structure

```javascript
{
  _id: String,
  title: String,
  parent_cat_id: String,    // Parent category ID (for sub-categories)
  content: String,          // Description
  image: String             // Image path
}
```

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `type` | `String` | `category.parent_cat_id ? 'Sub' : 'Main'` | Category type: "Main" or "Sub" |
| `categories` | `Array` | `[]` | List of all available categories for parent selection |
| `selectedClub` | `String` | `category.parent_cat_id ? category.parent_cat_id : ''` | Selected parent category ID |
| `clientErrors` | `Object` | `{}` | Client-side validation errors |
| `preview` | `String` | `category.image ? '/api' + category.image : '/images/club-badge.jpg'` | Current image preview URL |
| `state` | `Object` | Server action state | Track server response/errors from `useActionState` |

### Refs

| Ref | Type | Purpose |
|-----|------|---------|
| `fileInputRef` | `Ref<HTMLInputElement>` | Reference to hidden file input element |
| `previewsRef` | `Ref<HTMLDivElement>` | Unused reference (legacy code) |
| `selectRef` | `Ref<HTMLSelectElement>` | Reference to parent category select element for TomSelect |
| `tomSelectRef` | `Ref<TomSelect>` | Reference to TomSelect instance |

---

## Key Features

- Editable category title and description
- Category type selection (Main/Sub) with conditional parent selection
- Enhanced parent category selection with TomSelect (when type is "Sub")
- Category image upload with live preview
- Client-side validation via `CategoriesSchema`
- Server-side validation via `updateCategory` action
- Asynchronous category fetching for parent selection
- Inline validation message rendering

---

## Form Fields

| Field | Name | Type | Validation | Conditional |
|-------|------|------|-----------|-------------|
| Title | `title` | `text` | Required | Always |
| Type | `type` | `select` | Required | Always |
| Parent Category | `parent_cat_id` | `select` (TomSelect) | Required (when type="Sub") | Only when type="Sub" |
| Description | `content` | `textarea` | Optional | Always |
| Image | `image` | `file` | Image-only | Always |

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
      <Link className="btn-common-text mt-30 mb-30 ps-3" href="/admin/categories">
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

**Purpose:** Opens the hidden file input to select a category image.

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

  // Set category type and handle image
  formData.set("type", type);
  const imageFile = e.target.image.files[0];
  if (imageFile) {
    formData.set("image", imageFile);
  } else {
    formData.delete("image");
  }

  // Validate with schema
  const result = CategoriesSchema(true).safeParse(
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

**Purpose:** Runs validation and submits the category update.

---

## Conditional Rendering Logic

### Parent Category Selection

The parent category field only renders when `type === 'Sub'`:

```jsx
{type == 'Sub' && (
  <div className="left-info-box">
    {/* Parent category select with TomSelect */}
  </div>
)}
```

**Behavior:**
- When type changes to "Sub", the parent category field appears
- When type changes to "Main", the parent category field disappears
- TomSelect is reinitialized when type changes (via dependency array)

---

## TomSelect Integration

### Parent Category Selection

When type is "Sub", TomSelect enhances the parent category dropdown:

```javascript
tomSelectRef.current = new TomSelect(selectRef.current, {
  create: false,
  placeholder: "Choose a Sub Category",
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

1. **Categories Load Effect:** Initializes TomSelect after categories are fetched and when type changes
2. **Selection Sync Effect:** Keeps TomSelect synced with `selectedClub` changes

---

## Rendering Logic

### Category Type Selection

- Dropdown with "Main Category" and "Sub Category" options
- Controlled component (uses `value` and `onChange`)
- Determines whether parent category field is shown

### Parent Category Dropdown

- Only shown when type is "Sub"
- Fetches all categories from `/api/categories`
- Uses TomSelect for enhanced UX
- Pre-selects existing parent category in edit mode

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
| `updateCategory` | Server action for category update (bound to category._id) |
| `CategoriesSchema` | Zod validation schema |
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
import EditCategoryForm from '@/components/EditCategoryForm';

export default function CategoryEditPage({ category }) {
  return <EditCategoryForm category={category} />;
}
```

---

## Behavior Notes

- The form prefills all fields with existing category data via `defaultValue` attributes
- Category type determines whether parent category selection is shown
- Parent category selection uses TomSelect for better UX when available
- Image upload replaces existing preview (only for new uploads)
- Existing images remain on the server and display as previews
- Form validates before submission to provide immediate feedback

---

## Known Issues / Considerations

1. **Component Name Mismatch:** Exported as `EditStoreForm` but should be `EditCategoryForm`

2. **Typo in Console Error:** `console.error("Error fetching Caegory:", error);` should be "Category"

3. **Typo in Label:** "Descripton" should be "Description"

4. **Unused Ref:** `previewsRef` is declared but never used

5. **Variable Name Confusion:** `selectedClub` should be `selectedCategory` for clarity

---

## Validation

The `CategoriesSchema` validates:
- Required fields: `title`, `type`
- Conditional required: `parent_cat_id` when `type === "Sub"`
- Optional fields: `content`, `image`
- Image type validation (image files only)

---

## Future Enhancements

- [ ] Rename component to `EditCategoryForm` (fix export name)
- [ ] Fix typos: "Descripton" → "Description", "Caegory" → "Category"
- [ ] Remove unused `previewsRef` ref
- [ ] Rename `selectedClub` to `selectedCategory` for clarity
- [ ] Add success/error toast notifications
- [ ] Add category hierarchy display
- [ ] Add image deletion for existing images
- [ ] Add category ordering/priority fields
- [ ] Add form auto-save functionality

---

## Support & Maintenance

If updates fail, verify that:
- `updateCategory` is correctly exported from `@/actions/categoriesActions`
- `CategoriesSchema` is properly configured in `@/lib/validation/categories`
- `/api/categories` endpoint returns the expected structure
- TomSelect is properly installed: `npm install tom-select`
- Category object structure matches expected format
