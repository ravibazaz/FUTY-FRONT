# ShowImagesWithAlertClick Component Documentation

## Component Purpose

The `ShowImagesWithAlertClick` component renders a list of image thumbnails and displays a larger image preview in a SweetAlert2 modal when an image is clicked. It is used for image galleries or preview panels where users need to inspect images in a popup.

**Key Responsibility:** Render thumbnails from an image array and show a modal preview on click.

---

## Component Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `components/ShowImagesWithAlertClick.jsx` |
| **Type** | Client-side React Component |
| **Framework** | Next.js with React Hooks |
| **Props** | `images` array |
| **Dependencies** | `sweetalert2`, `next/image` |

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `images` | `Array<string>` | Optional | Array of image URL paths used to render thumbnails |

### Expected Image Format

- Image paths are stored as strings
- Rendered with `src={'/api' + link}` for each image
- Works with relative API image endpoints

---

## State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `selectedImages` | `Array<string>  String` | `props.images || ''` | Stores the image array for rendering |

**Note:** The component initializes selected images from props and does not update them after mount.

---

## Key Features

- Thumbnail grid layout with responsive image rendering
- Modal preview using SweetAlert2 on image click
- Default placeholder image when no images are provided
- Uses Next.js `Image` for optimized image rendering
- Supports `blob:` URLs via `unoptimized` prop

---

## Rendering Logic

### Thumbnail Rendering

If `selectedImages.length > 0`, the component renders each image thumbnail:

```jsx
selectedImages.map((l, index) => (
  <Image
    key={index}
    src={'/api' + l}
    width={82}
    height={82}
    sizes="82px"
    alt="Club Badge"
    unoptimized={l?.startsWith('blob:')}
    onClick={() => handleDelete(l)}
  />
))
```

### Placeholder Rendering

If no images are available, a fallback image is displayed:

```jsx
<Image
  src={'/images/club-badge.jpg'}
  width={82}
  height={82}
  alt="Profile Image"
  title="test"
/>
```

---

## Methods & Handlers

### handleDelete(link)

```javascript
const handleDelete = async (link) => {
  const result = await Swal.fire({
    imageUrl: '/api' + link,
    imageAlt: 'Custom image',
    showConfirmButton: false,
    allowOutsideClick: true,
    animation: true,
    showCloseButton: true
  });
};
```

**Purpose:** Opens a SweetAlert2 modal showing the selected image.

**Features:**
- Uses `imageUrl` for modal preview
- Allows closing by clicking outside modal
- Shows a close button
- No confirm button by design

---

## Styling & Layout

### Container
- `.d-flex.flex-wrap.gap-15` provides a flexible thumbnail grid
- `style={{ cursor: 'pointer' }}` makes thumbnails appear interactive

### Image Thumbnails
- Fixed size of `82x82`
- Uses `sizes="82px"` to optimize layout
- Next.js `Image` handles responsive image generation

---

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `sweetalert2` | Image preview modal |
| `next/image` | Optimized image rendering |
| `useState` | Local component state |

---

## Usage Example

```jsx
import ShowImagesWithAlertClick from '@/components/ShowImagesWithAlertClick';

const images = ['/uploads/photo1.jpg', '/uploads/photo2.jpg'];

function Gallery() {
  return <ShowImagesWithAlertClick images={images} />;
}
```

---

## Behavior Notes

- The component prepends `/api` to each image path when rendering and previewing images.
- Clicking a preview opens the same image in the SweetAlert2 modal.
- If `props.images` is empty or missing, a fallback badge image is displayed.
- `selectedImages` is not updated after initial render; the component is static once mounted.

---

## Future Enhancements

- [ ] Add caption or title support for each image
- [ ] Add image deletion confirmation and backend deletion callback
- [ ] Add lightbox navigation between images
- [ ] Add image zoom controls or fullscreen mode
- [ ] Support custom base URL instead of hardcoded `/api`
- [ ] Convert component to support controlled `images` prop updates

---

## Related Components

- Any gallery or image upload component that provides images to preview

---

## Support & Maintenance

For issues or updates, review the component's SweetAlert2 configuration and ensure image paths are valid under `/api`.
