# Getting Started

This guide will help you set up the FindIt application for local development.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | v18+ | JavaScript runtime |
| npm | v9+ | Package manager |
| MongoDB | v6+ | Database (local or Atlas) |
| Git | Latest | Version control |

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Sprint_fossTemp
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install
```

### 3. Frontend Setup

```bash
# Navigate to client folder
cd client

# Install frontend dependencies
npm install

# Return to root
cd ..
```

---

## Environment Configuration

### Create Environment File

Create a `.env` file in the root directory:

```env
DATABASE_CONNECTION_STRING="mongodb://localhost:27017/findit"
JWT_SECRET="your-secure-secret-key-here"
```

> **Important:** Replace `your-secure-secret-key-here` with a strong, unique secret for production.

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_CONNECTION_STRING` | MongoDB connection URI | `mongodb://localhost:27017/findit` or MongoDB Atlas URI |
| `JWT_SECRET` | Secret key for JWT signing | A strong random string (min 32 characters recommended) |

---

## Running the Application

### Development Mode

**Start the Backend Server:**

```bash
# From the root directory
npm run dev
```

The server will start at `http://localhost:3000`

**Start the Frontend Development Server:**

```bash
# In a separate terminal, navigate to client
cd client
npm run dev
```

The frontend will start at `http://localhost:5173` (Vite default)

### Production Mode

**Backend:**

```bash
npm start
```

**Frontend Build:**

```bash
cd client
npm run build
npm run preview  # To preview the build
```

---

## Available Scripts

### Backend Scripts (`/package.json`)

| Command | Description |
|---------|-------------|
| `npm start` | Start the server in production mode |
| `npm run dev` | Start the server with nodemon (auto-reload) |

### Frontend Scripts (`/client/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Database Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. The application will create the database automatically on first run

### MongoDB Atlas (Cloud)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address
4. Copy the connection string to your `.env` file

---

## Creating an Admin User

To promote a regular user to admin:

```bash
node make_admin.js <username>
```

Example:
```bash
node make_admin.js johndoe
```

This will grant administrator privileges to the specified user.

---

## Project Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (not committed) |
| `.env_example.txt` | Example environment configuration |
| `.gitignore` | Git ignore rules |
| `package.json` | Backend dependencies and scripts |
| `client/package.json` | Frontend dependencies and scripts |
| `client/vite.config.js` | Vite build configuration |
| `client/eslint.config.js` | ESLint configuration |

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

**JWT Token Errors:**
- Ensure `JWT_SECRET` is set in `.env`
- Clear browser cookies and re-login

**Frontend Proxy Issues:**
- Check `client/vite.config.js` proxy settings
- Ensure backend is running on port 3000

**Port Already in Use:**
- Backend (3000): `lsof -i :3000` / `netstat -ano | findstr :3000`
- Frontend (5173): Change in `vite.config.js`

---

## Next Steps

- Read the [Architecture](./ARCHITECTURE.md) documentation
- Explore the [API Reference](./API_REFERENCE.md)
- Review [Database Schema](./DATABASE_SCHEMA.md)
