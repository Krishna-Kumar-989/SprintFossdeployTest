# FindIt - Lost & Found Application

## Documentation Index

Welcome to the FindIt developer documentation! This guide provides comprehensive information for developers working on this project.

---

## Table of Contents

| Document | Description |
|----------|-------------|
| [Getting Started](./GETTING_STARTED.md) | Setup instructions and environment configuration |
| [Architecture](./ARCHITECTURE.md) | System architecture and project structure |
| [API Reference](./API_REFERENCE.md) | Complete API endpoints documentation |
| [Database Schema](./DATABASE_SCHEMA.md) | MongoDB models and data structures |
| [Frontend Guide](./FRONTEND_GUIDE.md) | React components and pages documentation |
| [Authentication](./AUTHENTICATION.md) | Auth flow and security implementation |
| [Admin Guide](./ADMIN_GUIDE.md) | Admin panel features and utilities |

---

## Quick Overview

**FindIt** is a full-stack Lost & Found application that allows users to:

- Register lost or found items with location data
- Browse and search for items
- Claim items with a secure verification system
- Receive notifications about claims
- Manage their registered items

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router v7, Leaflet Maps |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **File Upload** | Multer |
| **Build Tools** | Vite, ESLint |

## Project Structure

```
Sprint_fossTemp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API service layer
│   └── package.json
├── config/                 # Server configuration
├── controllers/            # Route handlers
├── middleware/             # Express middleware
├── models/                 # Mongoose schemas
├── routes/                 # API route definitions
├── public/                 # Static files & uploads
├── docs/                   # Documentation (you are here)
├── main.js                 # Server entry point
└── package.json
```

## Getting Started

1. Clone the repository
2. Set up environment variables (see [Getting Started](./GETTING_STARTED.md))
3. Install dependencies: `npm install` (backend) and `cd client && npm install` (frontend)
4. Start development servers

For detailed setup instructions, see [Getting Started](./GETTING_STARTED.md).
