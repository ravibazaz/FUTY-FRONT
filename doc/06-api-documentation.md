# API Documentation

## Overview

The Futy League Management System provides a comprehensive REST API for managing sports leagues, teams, tournaments, users, and related entities. The API follows RESTful conventions with JSON responses and uses JWT authentication for protected endpoints.

## API Architecture

### Base URL
```
https://api.futy-league.com
```

### Authentication
Most API endpoints require authentication via JWT tokens sent in the `Authorization` header:
```
Authorization: Bearer <jwt-token>
```

### Response Format
All API responses follow a consistent JSON structure:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": { /* Response data */ },
  "pagination": { /* Pagination info for list endpoints */ }
}
```

### Error Handling
Error responses include appropriate HTTP status codes and detailed error messages:

```json
{
  "success": false,
  "message": "Error description or validation errors",
  "errors": { /* Detailed error information */ }
}
```

## Core API Endpoints

### Authentication Endpoints

#### User Registration
```http
POST /api/users/signup
```
**Purpose**: Register a new user account with role-based invitation codes.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "confirm_password": "securepassword123",
  "name": "John Doe",
  "telephone": "+1234567890",
  "account_type": "Player|Manager|Fan|Referee",
  "invitation_code": "ABC123XYZ" // Required for Player/Manager/Fan
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "Login Code": "123456",
    "isVerified": false
  },
  "message": "User created successfully. Please check login code in email."
}
```

#### User Login
```http
POST /api/users/login
```
**Purpose**: Authenticate user with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fcmtoken": "optional-fcm-token"
}
```

#### Code-Based Login
```http
POST /api/users/loginbycode
```
**Purpose**: Complete account verification using email code.

**Request Body**:
```json
{
  "login_code": "123456"
}
```

### Team Management

#### Get Teams
```http
GET /api/teams
```
**Purpose**: Retrieve all teams with populated club and league information.

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `q`: Search term for team name

**Response**:
```json
{
  "teams": [
    {
      "_id": "team_id",
      "name": "Team Name",
      "club": {
        "name": "Club Name",
        "league": {
          "label": "League Name"
        }
      },
      "ground": {
        "name": "Ground Name"
      }
    }
  ]
}
```

#### Get Team Details
```http
GET /api/teams/[id]
```
**Purpose**: Get detailed information for a specific team.

**Path Parameters**:
- `id`: Team ID

**Response**:
```json
{
  "success": true,
  "message": "Welcome to the Team Detail Page!",
  "data": {
    "_id": "team_id",
    "name": "Team Name",
    "age_groups": [...],
    "club": {...},
    "ground": {...},
    "managers": [...]
  }
}
```

### Tournament Management

#### Get Tournaments
```http
GET /api/tournaments/list
```
**Purpose**: Retrieve tournaments with advanced filtering and distance-based search.

**Query Parameters**:
- `q`: Search term
- `page`: Page number
- `limit`: Items per page
- `radius`: Search radius in kilometers

**Response**:
```json
{
  "success": true,
  "message": "Welcome to the Tournament List!",
  "data": [
    {
      "_id": "tournament_id",
      "name": "Tournament Name",
      "date": "2024-03-15",
      "ground": {
        "name": "Venue Name",
        "lat": 51.5074,
        "long": -0.1278
      },
      "distance": 5.2 // kilometers from user location
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Create Tournament
```http
POST /api/tournaments/add
```
**Purpose**: Create a new tournament with image uploads.

**Request Body** (Form Data):
```
name: Tournament Name
date: 2024-03-15
closing_date: 2024-03-01
description: Tournament description
accepted_by: Contact person
images: [base64-encoded-images]
```

### Referee Management

#### Get Referees
```http
GET /api/referees/list
```
**Purpose**: Search and filter referees with pagination.

**Query Parameters**:
- `q`: Search term (name)
- `page`: Page number
- `limit`: Items per page

**Response**:
```json
{
  "success": true,
  "message": "Welcome to the Referees List!",
  "data": [
    {
      "_id": "referee_id",
      "name": "John Doe",
      "referee_level": "Professional",
      "referee_fee": 150,
      "team_id": {
        "name": "Team Name",
        "club": {
          "name": "Club Name",
          "league": {
            "label": "League Name"
          }
        }
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Referee Dashboard
```http
GET /api/referees/dashboard
```
**Purpose**: Get personalized referee dashboard data.

**Response**:
```json
{
  "success": true,
  "message": "Welcome to the Referee Dashboard!",
  "data": {
    "referee_profile": { /* referee details */ },
    "random_advert": { /* advertisement */ },
    "league_friendly_by_priority1": { /* upcoming match */ }
  }
}
```

### Store/E-commerce

#### Get Store Products
```http
GET /api/stores/list
```
**Purpose**: Retrieve store products with search functionality.

**Query Parameters**:
- `q`: Search term for product title

**Response**:
```json
{
  "success": true,
  "message": "Welcome to the Store List!",
  "data": [
    {
      "_id": "product_id",
      "title": "Product Name",
      "price": 29.99,
      "image": "/uploads/stores/product.jpg",
      "category": "Equipment"
    }
  ]
}
```

#### Create Order
```http
POST /api/stores/createorder
```
**Purpose**: Process a product purchase order.

**Request Body**:
```json
{
  "product_id": "product_id",
  "quantity": 1,
  "shipping_address": "123 Main St, City, Country"
}
```

### Push Notifications

#### Send Push Notification
```http
POST /api/push/send
```
**Purpose**: Send FCM push notification to a device.

**Request Body**:
```json
{
  "token": "fcm-device-token",
  "title": "Notification Title",
  "body": "Notification message",
  "data": {
    "type": "tournament",
    "id": "tournament_id"
  }
}
```

**Response**:
```json
{
  "success": true,
  "messageId": "fcm-message-id"
}
```

### File Uploads

#### Serve Uploaded Files
```http
GET /api/uploads/[category]/[filename]
```
**Purpose**: Serve uploaded files (images, documents) from the file system.

**Path Parameters**:
- `category`: Upload category (managers, players, teams, etc.)
- `filename`: Filename of the uploaded file

**Supported Categories**:
- `adverts`, `categories`, `clubs`, `fans`, `friendlys`
- `grounds`, `leagues`, `managers`, `players`, `referees`
- `stores`, `teams`, `tournaments`, `vendors`

### Payment Processing

#### Stripe Webhook
```http
POST /api/stripe/webhook
```
**Purpose**: Handle Stripe payment webhooks for tournament fees.

**Headers**:
```
Content-Type: application/json
Stripe-Signature: webhook-signature
```

**Supported Events**:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `payment_intent.processing`

## API Response Codes

### Success Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully

### Error Codes
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authenticated Requests**: 100 requests per 15 minutes
- **Authentication Endpoints**: 5 attempts per 15 minutes
- **File Uploads**: 10 uploads per hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Current page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination metadata is included in responses:
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Data Validation

All API endpoints use Zod schemas for comprehensive input validation:

### Common Validation Rules
- **Email**: Valid email format required
- **Passwords**: Minimum 7 characters, confirmation matching
- **Phone Numbers**: Valid format with country codes
- **Dates**: ISO 8601 format validation
- **Images**: Base64 encoding with format restrictions
- **IDs**: MongoDB ObjectId format validation

### Validation Error Response
```json
{
  "success": false,
  "message": {
    "email": "Invalid email format",
    "password": "Password must be at least 7 characters",
    "telephone": "Invalid phone number format"
  }
}
```

## File Upload Specifications

### Supported Formats
- **Images**: JPEG, PNG, WebP, GIF (max 10MB)
- **Documents**: PDF (max 5MB)

### Upload Process
1. Convert files to base64 encoding
2. Include in request body or form data
3. API validates format and size
4. Files stored in categorized directories
5. URLs returned for accessing uploaded files

### Base64 Image Format
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
```

## WebSocket Integration

Real-time features use WebSocket connections for:
- Live tournament updates
- Push notification delivery
- Real-time chat (future feature)
- Live score updates (future feature)

## API Versioning

The API uses URL-based versioning:
```
/api/v1/users/signup
/api/v1/teams/list
```

Current version: `v1`

## Testing the API

### Using cURL
```bash
# Login example
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Using Postman
1. Import the API collection from `/doc/postman_collection.json`
2. Set environment variables for base URL and authentication
3. Run requests with proper authentication headers

### Using JavaScript
```javascript
// Example API call with authentication
const response = await fetch('/api/teams/list', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

## Error Monitoring

API errors are logged and monitored:
- Request/response logging
- Error rate tracking
- Performance monitoring
- Security incident detection

## Support

For API support:
- Check endpoint documentation in `/doc/app/api/`
- Review error messages for validation issues
- Contact development team for technical issues
- Use the issue tracker for bug reports

---

**Note**: This is a high-level overview. Detailed endpoint documentation is available in the `/doc/app/api/` directory with complete request/response examples, parameter descriptions, and implementation notes for each endpoint.