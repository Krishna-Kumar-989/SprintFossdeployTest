# Admin Guide

Documentation for administrators of the FindIt application.

---

## Overview

The admin panel provides platform oversight and management capabilities. Administrators can view platform statistics, manage users, and moderate items.

---

## Accessing the Admin Panel

### URL

```
/admin-dashboard
```

### Requirements

1. User must be logged in
2. User must have `role: "admin"`

---

## Creating an Admin User

### Method 1: Command Line Utility

Use the `make_admin.js` script:

```bash
node make_admin.js <username>
```

**Example:**
```bash
node make_admin.js johndoe
# Output: Success! User 'johndoe' is now an admin.
```

### Method 2: Direct Database Update

Using MongoDB shell or Compass:

```javascript
db.users.updateOne(
  { username: "johndoe" },
  { $set: { role: "admin" } }
)
```

---

## Admin Dashboard Features

### Platform Statistics

View at-a-glance metrics:

| Metric | Description |
|--------|-------------|
| Total Users | Number of registered users |
| Total Items | Total lost + found items |
| Lost Items | Items marked as "lost" |
| Found Items | Items marked as "found" |
| Resolved Items | Successfully reunited items |

**API Endpoint:** `GET /admin/stats`

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

### User Management

View and manage all registered users.

**Features:**
- List all users
- View user details (username, email, role, join date)
- Delete users

**API Endpoints:**

| Action | Method | Endpoint |
|--------|--------|----------|
| List Users | GET | `/admin/users` |
| Delete User | DELETE | `/admin/users/:id` |

**User List Response:**
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

> **Note:** Passwords are never included in responses.

---

### Item Management

View and moderate all lost/found items.

**Features:**
- List all items (including resolved)
- View item details with claims
- Delete inappropriate items

**API Endpoints:**

| Action | Method | Endpoint |
|--------|--------|----------|
| List Items | GET | `/admin/items` |
| Delete Item | DELETE | `/admin/items/:id` |

**Items List Response:**
```json
[
  {
    "_id": "item_id",
    "user_who_registered": "username",
    "name": "Blue Wallet",
    "is_resolved": false,
    "claims": [
      {
        "user_id": { "username": "claimer" },
        "message": "..."
      }
    ]
  }
]
```

---

## Security & Authorization

### Middleware Protection

All admin routes are protected by two middleware layers:

```javascript
// routes/adminRoutes.js
router.use(authMiddleware.protect, authMiddleware.adminOnly);
```

1. **protect** - Verifies JWT token
2. **adminOnly** - Checks for admin role

### adminOnly Middleware

```javascript
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.json({ error: 'Admin access required' });
  }
};
```

---

## Admin Panel UI (`Admin.jsx`)

### Component Structure

```
Admin Page
├── Statistics Cards
│   ├── Total Users
│   ├── Total Items
│   ├── Lost Items
│   ├── Found Items
│   └── Resolved Items
├── Users Section
│   └── User List with Delete buttons
└── Items Section
    └── Item List with Delete buttons
```

### Code Example

```jsx
// Fetching admin data
useEffect(() => {
  const fetchData = async () => {
    const [statsRes, usersRes, itemsRes] = await Promise.all([
      api.getStats(),
      api.getUsers(),
      api.getAdminItems()
    ]);
    // Process responses...
  };
  fetchData();
}, []);
```

---

## Administrative Actions

### Deleting a User

**Considerations:**
- User's items are NOT automatically deleted
- User's claims remain on items
- Action is irreversible

**API Call:**
```javascript
api.deleteUser(userId)
// DELETE /admin/users/:id
```

---

### Deleting an Item

**Considerations:**
- Removes item and all its claims
- Associated notifications are NOT automatically deleted
- Action is irreversible

**API Call:**
```javascript
api.deleteItem(itemId)
// DELETE /admin/items/:id
```

---

## Best Practices

### Moderation Guidelines

1. **Before deleting users:**
   - Confirm the user violated terms
   - Consider warnings first
   - Check their registered items

2. **Before deleting items:**
   - Verify content is inappropriate
   - Check if it's a duplicate
   - Consider if it's spam

### Security Practices

1. **Limit admin accounts:**
   - Only promote trusted users
   - Audit admin actions

2. **Protect admin credentials:**
   - Use strong passwords
   - Enable 2FA if implemented

3. **Monitor the platform:**
   - Check stats regularly
   - Watch for unusual activity

---

## Utility Scripts

### make_admin.js

Promotes a user to admin role.

**Location:** `/make_admin.js`

**Usage:**
```bash
node make_admin.js <username>
```

**Code Overview:**
```javascript
const promoteUser = async () => {
  await connectDB();
  
  const user = await User.findOne({ username });
  if (!user) {
    console.log(`User '${username}' not found.`);
    process.exit(1);
  }
  
  user.role = 'admin';
  await user.save();
  console.log(`Success! User '${username}' is now an admin.`);
};
```

---

## Extending Admin Features

### Adding New Admin Routes

1. Add route in `routes/adminRoutes.js`:
   ```javascript
   router.get("/new-feature", adminController.newFeature);
   ```

2. Add controller in `controllers/adminController.js`:
   ```javascript
   exports.newFeature = async (req, res) => {
     // Implementation
   };
   ```

3. Add API call in frontend:
   ```javascript
   // services/api.js
   getNewFeature: () => fetch('/admin/new-feature'),
   ```

4. Update Admin.jsx to use the new feature.

---

## Troubleshooting

### Cannot Access Admin Panel

**Problem:** User sees error or redirect.

**Solutions:**
1. Verify user is logged in
2. Check user role in database:
   ```javascript
   db.users.findOne({ username: "user" })
   // Look for role: "admin"
   ```
3. Run `make_admin.js` if needed

### Stats Not Loading

**Problem:** Statistics show zeros or errors.

**Solutions:**
1. Check browser console for errors
2. Verify backend is running
3. Check database connection
4. Verify cookies are being sent

### Delete Not Working

**Problem:** User/Item not deleted.

**Solutions:**
1. Check network tab for error response
2. Verify admin authorization
3. Check if ID format is correct
4. Review server logs for errors
