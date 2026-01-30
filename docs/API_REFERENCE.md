# API Reference

Complete documentation of all API endpoints available in the FindIt application.

---

## Base URL

- **Development:** `http://localhost:3000`
- **API requests from frontend are proxied via Vite**

## Authentication

Most endpoints use JWT-based authentication via HTTP-only cookies. The token is automatically sent with requests.

**Authenticated Endpoints:** Marked with [AUTH]  
**Admin Only Endpoints:** Marked with [ADMIN]

---

## Authentication Endpoints

### POST /signup

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "/dashboard"
}
```

**Errors:**
- `400` - Missing required fields
- `409` - User or email already exists

---

### POST /login

Authenticate an existing user.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

> **Note:** `username` can be either username or email address.

**Response:**
```json
{
  "success": true,
  "redirectUrl": "/dashboard"
}
```

**Errors:**
- `401` - Invalid credentials

---

### GET /logout

Log out the current user.

**Response:** Redirects to `/`

---

### [AUTH] GET /check

Check current authentication status.

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "authenticated": false
}
```

---

### GET /users/:username

Get public profile of a user.

**Parameters:**
- `username` (path) - Username to look up

**Response:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "stats": {
    "lost": 2,
    "found": 5
  },
  "joined": "2024-01-15T10:30:00.000Z"
}
```

---

### [AUTH] PUT /profile

Update current user's profile.

**Request Body:**
```json
{
  "bio": "New bio text",
  "phone": "+1234567890",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* updated user object */ }
}
```

---

## Item Endpoints

### POST /items/all

Get all items with optional filters.

**Request Body:**
```json
{
  "type": "lost",      // "lost", "found", or "all"
  "sort": "newest",    // "newest" or "oldest"
  "search": "wallet"   // Optional search term
}
```

**Response:**
```json
[
  {
    "_id": "item_id",
    "lost_or_found": "lost",
    "name": "Blue Wallet",
    "timestamp": "2024-01-20T15:30:00.000Z",
    "description": "Lost near the park",
    "image_url": "/uploads/1234567890.jpg",
    "place": "Central Park"
  }
]
```

> **Note:** Only returns unresolved items (`is_resolved: false`).

---

### POST /details

Get detailed information about a single item.

**Request Body:**
```json
{
  "id": "item_id"
}
```

**Response:**
```json
{
  "_id": "item_id",
  "user_who_registered": "johndoe",
  "is_resolved": false,
  "lost_or_found": "lost",
  "name": "Blue Wallet",
  "place": "Central Park",
  "time": "3:00 PM",
  "contact": "john@example.com",
  "description": "Blue leather wallet with initials JD",
  "timestamp": "2024-01-20T15:30:00.000Z",
  "image_url": "/uploads/1234567890.jpg",
  "coordinates": {
    "lat": 40.785091,
    "lng": -73.968285
  },
  "reward": "50",
  "security_question": "What color is the inside?",
  "claims": []
}
```

---

### [AUTH] POST /registration

Register a new lost or found item.

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Item name |
| `lost_or_found` | string | Yes | "lost" or "found" |
| `place` | string | Yes | Location description |
| `time` | string | Yes | Time when lost/found |
| `contact` | string | Yes | Contact information |
| `description` | string | Yes | Detailed description |
| `timestamp` | string | Yes | Registration timestamp |
| `is_resolved` | boolean | Yes | Usually `false` |
| `image` | file | No | Item image (max 5MB) |
| `lat` | number | No | Latitude coordinate |
| `lng` | number | No | Longitude coordinate |
| `reward` | string | No | Reward amount |
| `security_question` | string | No | Verification question |
| `security_answer_hash` | string | No | Answer (will be hashed) |

**Response:**
```json
{
  "status": "received"
}
```

---

### POST /markasresolved

Mark an item as resolved.

**Request Body:**
```json
{
  "info_id": "item_id",
  "case_resol_status": true
}
```

**Response:**
```json
{
  "success": true
}
```

---

### POST /items/archived

Get user's archived (resolved) items.

**Request Body:**
```json
{
  "username": "johndoe"
}
```

**Response:**
```json
[
  { /* item objects */ }
]
```

---

### POST /account_item_list

Get all items registered by a user.

**Request Body:**
```json
{
  "user_who_registered": "johndoe"
}
```

**Response:**
```json
[
  { /* item objects */ }
]
```

---

## Claims Endpoints

### [AUTH] POST /claim

Submit a claim for an item.

**Request Body:**
```json
{
  "itemId": "item_id",
  "answer": "red",          // Answer to security question (if set)
  "message": "I believe this is my wallet because..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Claim submitted successfully"
}
```

**Errors:**
- `404` - Item not found
- `403` - Incorrect security answer

---

### [AUTH] GET /claims/:id

Get all claims for an item.

**Parameters:**
- `id` (path) - Item ID

**Response:**
```json
{
  "claims": [
    {
      "user_id": {
        "username": "janedoe",
        "email": "jane@example.com"
      },
      "message": "I lost this wallet last week...",
      "status": "pending",
      "timestamp": "2024-01-21T10:00:00.000Z"
    }
  ]
}
```

---

## Notification Endpoints

### [AUTH] GET /api/notifications

Get all notifications for the current user.

**Response:**
```json
[
  {
    "_id": "notification_id",
    "recipient": "johndoe",
    "message": "New claim on your item \"Blue Wallet\"",
    "type": "claim",
    "relatedItemId": "item_id",
    "isRead": false,
    "timestamp": "2024-01-21T10:00:00.000Z"
  }
]
```

---

### [AUTH] POST /api/notifications/:id/read

Mark a notification as read.

**Parameters:**
- `id` (path) - Notification ID

**Response:**
```json
{
  "success": true
}
```

---

## Admin Endpoints

> All admin endpoints require the user to have `role: "admin"`.

### [ADMIN] GET /admin/stats

Get platform statistics.

**Response:**
```json
{
  "users": 150,
  "items": 423,
  "lost": 245,
  "found": 178,
  "resolved": 89
}
```

---

### [ADMIN] GET /admin/users

Get all registered users.

**Response:**
```json
[
  {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "bio": "...",
    "phone": "...",
    "joined": "2024-01-15T10:30:00.000Z"
  }
]
```

> **Note:** Passwords are excluded from response.

---

### [ADMIN] GET /admin/items

Get all items (including resolved).

**Response:**
```json
[
  {
    /* Full item object with populated claims */
  }
]
```

---

### [ADMIN] DELETE /admin/items/:id

Delete an item.

**Parameters:**
- `id` (path) - Item ID

**Response:**
```json
{
  "success": true,
  "message": "Item deleted"
}
```

---

### [ADMIN] DELETE /admin/users/:id

Delete a user.

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

## Error Responses

Standard error format:

```json
{
  "error": "Error message description"
}
```

Common HTTP Status Codes:

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad Request (missing/invalid data) |
| `401` | Unauthorized (not logged in) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (duplicate entry) |
| `500` | Internal Server Error |
