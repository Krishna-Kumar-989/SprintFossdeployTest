# Frontend Guide

Documentation for the React frontend application, including components, pages, and state management.

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI library |
| Vite | 5.4 | Build tool & dev server |
| React Router | 7.13 | Client-side routing |
| Leaflet | 1.9 | Interactive maps |
| React Leaflet | 4.2 | React bindings for Leaflet |

---

## Project Structure

```
client/src/
├── main.jsx              # Application entry point
├── App.jsx               # Router configuration
├── App.css               # App-level styles
├── index.css             # Global styles & design system
├── components/           # Reusable components
├── pages/                # Page components
├── hooks/                # Custom React hooks
├── services/             # API service layer
└── assets/               # Static assets
```

---

## Application Flow

### Entry Point (`main.jsx`)

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Router Configuration (`App.jsx`)

The app uses React Router v7 with route protection:

```jsx
<AuthProvider>
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      {/* ... more routes */}
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

---

## Route Protection

### PublicRoute

Accessible to all users. Can optionally redirect authenticated users.

```jsx
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return children;
}
```

### ProtectedRoute

Requires authentication. Redirects to `/login` if not authenticated.

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

---

## Pages

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Welcome | `/`, `/welcome` | Landing page with app introduction |
| Login | `/login` | User login form |
| Signup | `/signup` | User registration form |

### Protected Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Main items listing with search/filters |
| ItemDetails | `/item-details` | Single item view with claim functionality |
| RegisterItem | `/register-item` | Form to report lost/found items |
| Account | `/account` | User profile and their items |
| Notifications | `/notifications` | User notifications list |
| Admin | `/admin-dashboard` | Admin panel (admin role only) |
| ProfileView | `/profile-view` | View another user's public profile |
| Archives | `/archives` | User's resolved items |

---

## Page Details

### Dashboard (`Dashboard.jsx`)

**Purpose:** Main page showing all lost/found items.

**Features:**
- Item listing with cards
- Filter by type (lost/found/all)
- Sort by date (newest/oldest)
- Search functionality
- Click to view item details

**State:**
```jsx
const [items, setItems] = useState([]);
const [filter, setFilter] = useState('all');
const [sort, setSort] = useState('newest');
const [search, setSearch] = useState('');
```

---

### ItemDetails (`ItemDetails.jsx`)

**Purpose:** Detailed view of a single item.

**Features:**
- Full item information display
- Image viewer
- Map location (Leaflet)
- Claim submission form
- Security question verification
- View claims (for item owner)

---

### RegisterItem (`RegisterItem.jsx`)

**Purpose:** Form to register a lost or found item.

**Features:**
- Item type selection (lost/found)
- Image upload
- Location picker (Leaflet map)
- Optional security question
- Optional reward

**Form Fields:**
- Name, Description, Place, Time
- Contact information
- Image (optional)
- Location coordinates (optional)
- Security question/answer (optional)
- Reward amount (optional)

---

### Account (`Account.jsx`)

**Purpose:** User's profile and item management.

**Features:**
- Profile information display/edit
- Bio and phone number editing
- List of user's registered items
- Mark items as resolved
- Navigation to archives

---

### Admin (`Admin.jsx`)

**Purpose:** Administrative dashboard.

**Requirements:** User must have `role: "admin"`

**Features:**
- Platform statistics (users, items, resolved)
- User management (list, delete)
- Item management (list, delete)
- Data overview

---

## Components

### Navbar (`Navbar.jsx`)

**Purpose:** Navigation header.

**Features:**
- Brand/logo
- Navigation links
- User menu
- Notification indicator
- Logout button

---

### Footer (`Footer.jsx`)

**Purpose:** Page footer.

**Content:**
- Copyright information
- Links

---

### ItemCard (`ItemCard.jsx`)

**Purpose:** Display item in list view.

**Props:**
```jsx
{
  item: {
    _id, name, description, image_url,
    lost_or_found, place, timestamp
  },
  onClick: Function
}
```

**Display:**
- Item image (or placeholder)
- Name and description (truncated)
- Lost/Found badge
- Location
- Timestamp

---

### Loader (`Loader.jsx`)

**Purpose:** Loading spinner.

**Usage:**
```jsx
<Loader />
```

---

### Modal (`Modal.jsx`)

**Purpose:** Modal dialog wrapper.

**Props:**
```jsx
{
  isOpen: Boolean,
  onClose: Function,
  children: ReactNode
}
```

---

## Hooks

### useAuth (`hooks/useAuth.jsx`)

**Purpose:** Authentication state management.

**Context Provider:**
```jsx
<AuthContext.Provider value={{ user, loading, checkAuth, logout, setUser }}>
```

**Hook Usage:**
```jsx
const { user, loading, checkAuth, logout } = useAuth();
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `user` | Object/null | Current user data |
| `loading` | Boolean | Auth check in progress |
| `checkAuth` | Function | Refresh auth state |
| `logout` | Function | Log out user |
| `setUser` | Function | Update user state |

**User Object:**
```javascript
{
  id: "user_id",
  username: "johndoe",
  email: "john@example.com",
  role: "user" | "admin"
}
```

---

## API Service (`services/api.js`)

Centralized API calls for the application.

### Auth Methods

```javascript
api.login(data)          // POST /login
api.signup(data)         // POST /signup
api.checkAuth()          // GET /check
api.logout()             // GET /logout
```

### Item Methods

```javascript
api.getItems(filters)    // POST /items/all
api.getItemDetails(id)   // POST /details
api.registerItem(data)   // POST /registration (FormData)
api.markResolved(id)     // POST /markasresolved
```

### Claim Methods

```javascript
api.submitClaim(data)    // POST /claim
api.getClaims(itemId)    // GET /claims/:id
```

### User Methods

```javascript
api.getUserItems(username)     // POST /account_item_list
api.updateProfile(data)        // PUT /profile
api.getPublicProfile(username) // GET /users/:username
api.getArchivedItems(username) // POST /items/archived
```

### Notification Methods

```javascript
api.getNotifications()         // GET /api/notifications
api.markNotificationRead(id)   // POST /api/notifications/:id/read
```

### Admin Methods

```javascript
api.getStats()           // GET /admin/stats
api.getUsers()           // GET /admin/users
api.getAdminItems()      // GET /admin/items
api.deleteUser(id)       // DELETE /admin/users/:id
api.deleteItem(id)       // DELETE /admin/items/:id
```

### Utility Functions

```javascript
escapeHtml(text)  // Escape HTML special characters for XSS prevention
```

---

## Styling

### Global Styles (`index.css`)

- CSS reset/normalize
- Design tokens (colors, spacing, typography)
- Utility classes
- Component base styles

### App Styles (`App.css`)

- Layout styles
- Route transition animations

### Component-Specific Styles

Styles are typically co-located or use CSS classes defined in global stylesheets.

---

## Leaflet Maps Integration

### Required CSS Import

```jsx
import 'leaflet/dist/leaflet.css';
```

### Map Components Used

```jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
```

### Common Use Cases

1. **RegisterItem:** Click-to-select location
2. **ItemDetails:** Display item location marker

---

## Development Tips

### API Proxy Configuration

Vite proxies API requests to avoid CORS issues:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      // Additional proxied routes...
    }
  }
})
```

### Local Storage

The app stores authentication data in localStorage:

- `current_session` - Current username
- `user_details` - Stringified user object

### State Management

The app uses React's built-in state management:
- `useState` for local component state
- `useContext` via `useAuth` for global auth state
- No external state management library (Redux, etc.)

---

## Adding New Pages

1. Create component in `pages/`:
   ```jsx
   // pages/NewPage.jsx
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. Add route in `App.jsx`:
   ```jsx
   <Route 
     path="/new-page" 
     element={<ProtectedRoute><NewPage /></ProtectedRoute>} 
   />
   ```

3. Add navigation link in `Navbar.jsx` if needed.

---

## Adding New Components

1. Create component in `components/`:
   ```jsx
   // components/NewComponent.jsx
   export default function NewComponent({ prop1, prop2 }) {
     return <div>{/* content */}</div>;
   }
   ```

2. Import and use in pages:
   ```jsx
   import NewComponent from '../components/NewComponent';
   ```
