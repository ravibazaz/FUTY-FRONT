# POST /api/adverts/createorder

## Purpose
Creates a new order history record for a store product after authentication.
This endpoint captures order data, copies product images, and logs the purchase in the order history.

## File Location
`app/api/adverts/createorder/route.js`

## HTTP Method
POST

## Authentication Required
Yes

## Behavior
- Protects the route with `protectApiRoute(req)` middleware.
- Returns authentication error if the user is not authenticated.
- On success:
  - Parses the JSON request body.
  - Fetches the store product using `Stores.findById(data.product_id)`.
  - Copies the store image to a new timestamped filename.
  - Creates an `OrderHistories` document with:
    - Original order data from the request.
    - Store metadata (title, price, size, color, etc.).
    - New timestamped image path.
    - Authenticated user ID.
  - Returns a success message.

## Request Body
JSON object with required and optional fields:
```json
{
  "product_id": "...",
  "quantity": 2,
  "size": "M",
  "color": "Blue",
  "...otherOrderData": "..."
}
```

## Response Example
```json
{
  "success": true,
  "message": "Order created successfully!"
}
```

## Implementation Details
- Imports:
  - `NextResponse` from `next/server`
  - `connectDB` from `@/lib/db`
  - `protectApiRoute` from `@/lib/middleware`
  - `OrderHistories` model from `@/lib/models/OrderHistories`
  - `path` and file system utilities
  - `Stores` model from `@/lib/models/Stores`
- Handler steps:
  1. Call `protectApiRoute(req)` and return error if authentication fails.
  2. Extract authenticated `user` from middleware result.
  3. Parse `req.json()` to get order data.
  4. Fetch the store product by `product_id`.
  5. If product not found, return error.
  6. Copy the store image to a new timestamped filename.
  7. Create an `OrderHistories` document with merged data and metadata.
  8. Return success response.

## Image Handling
- Reads the original image path from the store product.
- Generates a new filename with timestamp: `${basename}-${Date.now()}${ext}`.
- Copies the file to the new timestamped path.
- Stores the new path in the order history.

## Security
- Requires valid authentication.
- Protected by the `protectApiRoute` middleware.
- Associates the order with the authenticated user ID.

## Notes
- Image copying may fail gracefully if the original file does not exist.
- The order history stores denormalized store data for historical accuracy.
- Useful for purchase tracking and order management features.