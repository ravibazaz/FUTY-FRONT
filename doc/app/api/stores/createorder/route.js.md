
# POST /api/stores/createorder

## Purpose

Creates an order history record for an authenticated user and preserves the store product image.

## File Location

`app/api/stores/createorder/route.js`

## HTTP Method

POST

## Authentication Required

Yes - protected by `protectApiRoute(req)`.

## Behavior

- Authenticates the request.
- Reads JSON body containing `product_id` and order fields.
- Loads the referenced product from `Stores`.
- Copies the product image file to a new timestamped filename.
- Creates an `OrderHistories` document with product metadata and purchaser details.

## Request Body

```json
{
  "product_id": "string",
  "quantity": 1,
  "shipping_address": "string"
}
```

## Response

```json
{
  "success": true,
  "message": "Order created successfully!"
}
```

## Implementation Details

- Uses `Stores.findById(product_id)` to validate the product.
- Copies the existing product image using `fs.copyFile()`.
- Links the order to the authenticated user using `purchased_by`.

## Notes

- Protected endpoint.
- No additional validation beyond product existence is performed.
