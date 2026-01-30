# Authentication Guide

Comprehensive documentation of the authentication system in the FindIt application.

---

## Overview

FindIt uses a **JWT (JSON Web Token)** based authentication system with HTTP-only cookies. Passwords are securely hashed using **bcrypt**.

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                        │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────┐         ┌─────────┐         ┌─────────┐
  │  User   │         │ Server  │         │   DB    │
  └────┬────┘         └────┬────┘         └────┬────┘
       │                   │                   │
       │  1. POST /signup  │                   │
       │  (credentials)    │                   │
       │──────────────────►│                   │
       │                   │  2. Check if      │
       │                   │  user exists      │
       │                   │──────────────────►│
       │                   │◄──────────────────│
       │                   │                   │
       │                   │  3. Hash password │
       │                   │  with bcrypt      │
       │                   │                   │
       │                   │  4. Create user   │
       │                   │──────────────────►│
       │                   │◄──────────────────│
       │                   │                   │
       │                   │  5. Generate JWT  │
       │                   │                   │
       │  6. Set-Cookie    │                   │
       │  (httpOnly JWT)   │                   │
       │◄──────────────────│                   │
       │                   │                   │
```

---

## JWT Token Structure

### Token Generation

```javascript
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
};
```

### Token Payload

```json
{
  "id": "user_mongodb_id",
  "role": "user",
  "iat": 1705764600,
  "exp": 1705851000
}
```

| Field | Description |
|-------|-------------|
| `id` | User's MongoDB ObjectId |
| `role` | User role (`"user"` or `"admin"`) |
| `iat` | Issued at timestamp |
| `exp` | Expiration timestamp (24 hours) |

---

## Cookie Configuration

```javascript
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000  // 24 hours
});
```

| Setting | Value | Purpose |
|---------|-------|---------|
| `httpOnly` | `true` | Prevents JavaScript access (XSS protection) |
| `secure` | Conditional | HTTPS only in production |
| `maxAge` | 24 hours | Cookie expiration |

---

## Password Security

### Hashing

Passwords are hashed using bcrypt with salt rounds of 10:

```javascript
const hashed = await bcrypt.hash(password, 10);
```

### Verification

```javascript
const match = await bcrypt.compare(password, user.password);
```

---

## Authentication Middleware

**File:** `middleware/authMiddleware.js`

### protect Middleware

Verifies JWT token on protected routes:

```javascript
exports.protect = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    // Handle no token case
    // - API routes return error
    // - Other routes set req.user = null
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Token verification failed
    res.clearCookie("token");
    // Handle error
  }
};
```

### requireAuth Middleware

Strictly requires authentication:

```javascript
exports.requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.json({ error: "You must be logged in" });
  }
  next();
};
```

### adminOnly Middleware

Restricts access to admin users:

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

## Frontend Authentication

### AuthContext (`hooks/useAuth.jsx`)

Provides authentication state throughout the React app:

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const res = await fetch('/check');
    const data = await res.json();
    if (data.authenticated) {
      setUser(data.user);
      localStorage.setItem('current_session', data.user.username);
    }
  };

  const logout = async () => {
    await fetch('/logout');
    setUser(null);
    localStorage.removeItem('current_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Using Authentication in Components

```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) return <Loader />;
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      Welcome, {user.username}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Login Flow

### Client Side

```jsx
// Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await api.login({ username, password });
  const data = await response.json();
  
  if (data.success) {
    await checkAuth();
    navigate('/dashboard');
  } else {
    setError(data.error);
  }
};
```

### Server Side

```javascript
// authController.js - login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  // Support login with email or username
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const query = isEmail ? { email: username } : { username };
  
  const user = await User.findOne(query);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  
  const token = generateToken(user._id, user.role);
  res.cookie("token", token, { /* cookie options */ });
  res.json({ success: true, redirectUrl: "/dashboard" });
};
```

---

## Signup Flow

### Validation

Server validates:
- All required fields present (username, email, password)
- Username not taken
- Email not taken

### User Creation

```javascript
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing fields" });
  
  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });
  if (existingUser) 
    return res.status(409).json({ error: "User or Email already exists" });
  
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ 
    username, email, password: hashed, role: 'user' 
  });
  
  const token = generateToken(user._id, user.role);
  res.cookie("token", token, { /* cookie options */ });
  res.json({ success: true, redirectUrl: "/dashboard" });
};
```

---

## Logout Flow

### Server Side

```javascript
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
```

### Client Side

```jsx
const logout = async () => {
  await fetch('/logout');
  setUser(null);
  localStorage.removeItem('current_session');
  localStorage.removeItem('user_details');
};
```

---

## Security Best Practices

### Current Implementation

| Practice | Status | Description |
|----------|--------|-------------|
| Password Hashing | Yes | bcrypt with salt rounds |
| HTTP-only Cookies | Yes | Prevents XSS token theft |
| Secure Cookies (Prod) | Yes | HTTPS only in production |
| Token Expiration | Yes | 24-hour expiry |
| Rate Limiting | Partial | Configured but commented out |

### Recommendations

1. **Enable Rate Limiting:**
   ```javascript
   // Uncomment in main.js
   app.use(limiter);
   ```

2. **Strong JWT Secret:**
   ```env
   JWT_SECRET="use-a-long-random-string-at-least-32-chars"
   ```

3. **HTTPS in Production:**
   - Ensures secure cookie transmission
   - Required for `secure: true` flag

4. **Input Validation:**
   - Consider adding express-validator
   - Sanitize user inputs

---

## User Roles

### Available Roles

| Role | Description | Access |
|------|-------------|--------|
| `user` | Default role | Normal user features |
| `admin` | Administrator | All features + admin panel |

### Promoting to Admin

Use the utility script:

```bash
node make_admin.js <username>
```

This updates the user's role to `"admin"` in the database.

---

## Session Management

### Local Storage

The frontend stores session info in localStorage:

```javascript
// On successful auth
localStorage.setItem('current_session', data.user.username);
localStorage.setItem('user_details', JSON.stringify(data.user));

// On logout
localStorage.removeItem('current_session');
localStorage.removeItem('user_details');
```

### Check Authentication

Called on app load to restore session:

```javascript
useEffect(() => {
  checkAuth();
}, []);
```

This calls `GET /check` to verify if the JWT cookie is still valid.
