# Architecture Overview

This document describes the system architecture and project organization of the FindIt application.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │ Components  │  │    Services (API)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Requests (Vite Proxy)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Express.js)                       │
│  ┌──────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │  Routes  │→ │ Middleware │→ │ Controllers│→ │   Models   │  │
│  └──────────┘  └────────────┘  └────────────┘  └────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB Database                         │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │  Users   │  │  Lost_data   │  │      Notifications        │  │
│  └──────────┘  └──────────────┘  └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Directory Structure

```
Sprint_fossTemp/
├── main.js                 # Application entry point
├── config/
│   ├── db.js              # Database connection
│   └── upload.js          # Multer file upload config
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── itemController.js   # Item CRUD operations
│   ├── adminController.js  # Admin operations
│   └── notificationController.js
├── middleware/
│   └── authMiddleware.js   # JWT verification & authorization
├── models/
│   ├── User.js            # User schema
│   ├── LostItem.js        # Item schema
│   └── Notification.js    # Notification schema
├── routes/
│   ├── authRoutes.js      # /signup, /login, /logout, etc.
│   ├── itemRoutes.js      # /items/*, /registration, etc.
│   ├── adminRoutes.js     # /admin/*
│   ├── notificationRoutes.js  # /api/notifications/*
│   └── viewRoutes.js      # View rendering routes
└── public/
    └── uploads/           # Uploaded images
```

### Request Flow

1. **Client** makes HTTP request
2. **Express Router** matches route
3. **Middleware** (authentication, rate limiting)
4. **Controller** processes business logic
5. **Model** interacts with database
6. **Response** sent back to client

### Key Components

#### Entry Point (`main.js`)

```javascript
// Key configurations
- Express server on port 3000
- CORS enabled (origin: "*")
- Cookie parser for JWT tokens
- Rate limiting (100 requests per 15 min)
- Static file serving for /uploads
```

#### Middleware Stack

| Middleware | Purpose |
|------------|---------|
| `cors` | Cross-origin resource sharing |
| `express.json()` | JSON body parsing |
| `express.urlencoded()` | Form data parsing |
| `cookieParser` | Cookie handling |
| `rateLimit` | Request rate limiting |
| `authMiddleware.protect` | JWT verification |
| `authMiddleware.adminOnly` | Admin role check |

---

## Frontend Architecture

### Directory Structure

```
client/src/
├── main.jsx               # React entry point
├── App.jsx                # Router configuration
├── App.css               # Global styles
├── index.css             # Base CSS & design system
├── components/
│   ├── Navbar.jsx        # Navigation bar
│   ├── Footer.jsx        # Page footer
│   ├── ItemCard.jsx      # Item display card
│   ├── Loader.jsx        # Loading spinner
│   └── Modal.jsx         # Modal dialog
├── pages/
│   ├── Welcome.jsx       # Landing page
│   ├── Login.jsx         # Login form
│   ├── Signup.jsx        # Registration form
│   ├── Dashboard.jsx     # Main items listing
│   ├── ItemDetails.jsx   # Single item view
│   ├── RegisterItem.jsx  # Report lost/found item
│   ├── Account.jsx       # User profile & items
│   ├── Notifications.jsx # User notifications
│   ├── Admin.jsx         # Admin dashboard
│   ├── ProfileView.jsx   # Public profile view
│   └── Archives.jsx      # Resolved items
├── hooks/
│   └── useAuth.jsx       # Authentication context
├── services/
│   └── api.js            # API service layer
└── assets/               # Static assets
```

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── BrowserRouter
│       ├── PublicRoute
│       │   ├── Welcome
│       │   ├── Login
│       │   └── Signup
│       └── ProtectedRoute
│           ├── Dashboard
│           ├── ItemDetails
│           ├── RegisterItem
│           ├── Account
│           ├── Notifications
│           ├── Admin
│           ├── ProfileView
│           └── Archives
```

### Route Protection

| Route Type | Description |
|------------|-------------|
| `PublicRoute` | Accessible to all users |
| `ProtectedRoute` | Requires authentication |
| `LogoutRoute` | Clears session and redirects |

---

## Data Flow

### Authentication Flow

```
1. User submits credentials
2. POST /login or /signup
3. Server validates & generates JWT
4. JWT stored in HTTP-only cookie
5. Subsequent requests include cookie
6. Middleware verifies JWT on protected routes
```

### Item Registration Flow

```
1. User fills RegisterItem form
2. Form data + image uploaded
3. POST /registration (multipart/form-data)
4. Multer processes image upload
5. Controller saves to MongoDB
6. Success response to client
```

### Claim Flow

```
1. User views item details
2. Optional security question answer
3. POST /claim with answer + message
4. Server verifies answer (bcrypt compare)
5. Claim added to item's claims array
6. Notification created for item owner
```

---

## Security Measures

| Feature | Implementation |
|---------|----------------|
| Password Hashing | bcrypt with salt rounds (10) |
| JWT Tokens | HTTP-only cookies, 1-day expiry |
| Rate Limiting | 100 requests per 15 minutes |
| Input Validation | Server-side validation in controllers |
| XSS Prevention | `escapeHtml` utility function |
| Security Questions | bcrypt-hashed answers |
| Admin Authorization | Role-based middleware check |

---

## File Upload Configuration

```javascript
// config/upload.js
- Storage: public/uploads/
- Filename: timestamp + original extension
- File filter: Images only (mimetype check)
- Size limit: 5MB maximum
```

---

## External Integrations

### Leaflet Maps

- Used in `RegisterItem.jsx` for location selection
- Used in `ItemDetails.jsx` for viewing item location
- Libraries: `leaflet`, `react-leaflet`

---

## Development Considerations

### API Proxy (Vite)

The frontend development server proxies API requests to the backend:

```javascript
// vite.config.js
server: {
  proxy: {
    // Configured to proxy /api to localhost:3000
  }
}
```

### Environment Variables

- Backend: Uses `dotenv` to load `.env`
- Frontend: Uses Vite's `import.meta.env`

---

## Next Steps

- Review [API Reference](./API_REFERENCE.md) for endpoints
- See [Database Schema](./DATABASE_SCHEMA.md) for data models
- Check [Authentication](./AUTHENTICATION.md) for auth details
