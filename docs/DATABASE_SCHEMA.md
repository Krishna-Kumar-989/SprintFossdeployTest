# Database Schema

MongoDB database schema documentation for the FindIt application.

---

## Overview

The application uses **MongoDB** with **Mongoose ODM**. The database contains three main collections:

| Collection | Model | Purpose |
|------------|-------|---------|
| `users` | User | User accounts and profiles |
| `lost_datas` | Lost_data | Lost and found items |
| `notifications` | Notification | User notifications |

---

## User Schema

**Collection:** `users`  
**Model:** `User`  
**File:** `models/User.js`

### Schema Definition

```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  joined: { type: Date, default: Date.now }
}
```

### Field Details

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `username` | String | Yes | Yes | - | User's display name |
| `email` | String | Yes | Yes | - | User's email address |
| `password` | String | Yes | No | - | bcrypt hashed password |
| `role` | String | No | No | `"user"` | User role (`"user"` or `"admin"`) |
| `bio` | String | No | No | `""` | User biography |
| `phone` | String | No | No | `""` | Contact phone number |
| `joined` | Date | No | No | `Date.now` | Account creation date |

### Indexes

- `username` - Unique index
- `email` - Unique index

### Example Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "$2b$10$N9qo8uL...",
  "role": "user",
  "bio": "Lost and found enthusiast",
  "phone": "+1234567890",
  "joined": "2024-01-15T10:30:00.000Z"
}
```

---

## LostItem Schema

**Collection:** `lost_datas`  
**Model:** `Lost_data`  
**File:** `models/LostItem.js`

### Schema Definition

```javascript
{
  user_who_registered: { type: String, required: true },
  is_resolved: { type: Boolean, required: true },
  lost_or_found: { type: String, required: true },
  name: { type: String, required: true },
  place: { type: String, required: true },
  time: { type: String, required: true },
  contact: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: String, required: true },
  image_url: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  reward: { type: String },
  security_question: { type: String },
  security_answer_hash: { type: String },
  claims: [{
    user_id: { type: ObjectId, ref: 'User' },
    message: String,
    status: { type: String, default: 'pending' },
    timestamp: { type: Date, default: Date.now }
  }]
}
```

### Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_who_registered` | String | Yes | Username of item registrant |
| `is_resolved` | Boolean | Yes | Whether item case is resolved |
| `lost_or_found` | String | Yes | `"lost"` or `"found"` |
| `name` | String | Yes | Item name/title |
| `place` | String | Yes | Location description |
| `time` | String | Yes | Time of incident |
| `contact` | String | Yes | Contact information |
| `description` | String | Yes | Detailed item description |
| `timestamp` | String | Yes | Registration timestamp |
| `image_url` | String | No | Path to uploaded image |
| `coordinates.lat` | Number | No | Latitude |
| `coordinates.lng` | Number | No | Longitude |
| `reward` | String | No | Reward amount |
| `security_question` | String | No | Verification question |
| `security_answer_hash` | String | No | bcrypt hashed answer |
| `claims` | Array | No | Array of claim subdocuments |

### Claims Subdocument

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `user_id` | ObjectId | - | Reference to User who claimed |
| `message` | String | - | Claim message/justification |
| `status` | String | `"pending"` | Claim status |
| `timestamp` | Date | `Date.now` | When claim was made |

### Example Document

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user_who_registered": "johndoe",
  "is_resolved": false,
  "lost_or_found": "lost",
  "name": "Blue Leather Wallet",
  "place": "Central Park, near the fountain",
  "time": "3:00 PM",
  "contact": "john@example.com",
  "description": "Blue leather wallet with initials JD embossed",
  "timestamp": "2024-01-20T15:30:00.000Z",
  "image_url": "/uploads/1705764600000.jpg",
  "coordinates": {
    "lat": 40.785091,
    "lng": -73.968285
  },
  "reward": "50",
  "security_question": "What color is the inside lining?",
  "security_answer_hash": "$2b$10$K8rF3u...",
  "claims": [
    {
      "user_id": "507f1f77bcf86cd799439013",
      "message": "I believe this is my wallet, I can describe more details",
      "status": "pending",
      "timestamp": "2024-01-21T10:00:00.000Z"
    }
  ]
}
```

---

## Notification Schema

**Collection:** `notifications`  
**Model:** `Notification`  
**File:** `models/Notification.js`

### Schema Definition

```javascript
{
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'system' },
  relatedItemId: { 
    type: ObjectId, 
    ref: 'ItemDetails',
    required: false 
  },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}
```

### Field Details

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `recipient` | String | Yes | - | Username to receive notification |
| `message` | String | Yes | - | Notification message |
| `type` | String | No | `"system"` | Notification type (`"system"`, `"claim"`) |
| `relatedItemId` | ObjectId | No | - | Reference to related item |
| `isRead` | Boolean | No | `false` | Read status |
| `timestamp` | Date | No | `Date.now` | When notification was created |

### Example Document

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "recipient": "johndoe",
  "message": "New claim on your item \"Blue Leather Wallet\" by janedoe.",
  "type": "claim",
  "relatedItemId": "507f1f77bcf86cd799439012",
  "isRead": false,
  "timestamp": "2024-01-21T10:00:00.000Z"
}
```

---

## Database Relationships

```
┌─────────────┐         ┌─────────────────┐         ┌──────────────────┐
│    User     │         │   Lost_data     │         │   Notification   │
├─────────────┤         ├─────────────────┤         ├──────────────────┤
│ _id         │◄────┐   │ _id             │◄───────►│ relatedItemId    │
│ username    │     │   │ user_who_reg... │         │ recipient        │
│ email       │     │   │ claims[].user_id│────┐    │ (username)       │
│ password    │     │   └─────────────────┘    │    └──────────────────┘
│ role        │     │                          │
│ ...         │     └──────────────────────────┘
└─────────────┘
```

### Relationship Types

| From | To | Type | Field |
|------|----|------|-------|
| Lost_data.claims | User | Many-to-One | `claims[].user_id` → `User._id` |
| Notification | Lost_data | Many-to-One | `relatedItemId` → `Lost_data._id` |
| Notification | User | Many-to-One (implicit) | `recipient` → `User.username` |

---

## Indexes Recommendations

For optimal query performance, consider adding these indexes:

```javascript
// User
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Lost_data
db.lost_datas.createIndex({ "user_who_registered": 1 })
db.lost_datas.createIndex({ "is_resolved": 1 })
db.lost_datas.createIndex({ "lost_or_found": 1 })
db.lost_datas.createIndex({ "name": "text", "description": "text" })

// Notifications
db.notifications.createIndex({ "recipient": 1 })
db.notifications.createIndex({ "isRead": 1 })
```

---

## Database Connection

**File:** `config/db.js`

```javascript
mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
```

The connection string should be configured in `.env`:

```env
DATABASE_CONNECTION_STRING="mongodb://localhost:27017/findit"
```

Or for MongoDB Atlas:

```env
DATABASE_CONNECTION_STRING="mongodb+srv://user:pass@cluster.mongodb.net/findit"
```
