# Backend & Redux Integration Setup

## ✅ What's Been Set Up

### Backend (Express.js)
- ✅ Express server with MongoDB connection
- ✅ JWT authentication middleware
- ✅ User model with password hashing (bcrypt)
- ✅ Event model with relationships
- ✅ Complete REST API routes:
  - `/api/auth` - Register, Login, Get Current User
  - `/api/users` - CRUD operations (Admin only)
  - `/api/events` - CRUD operations + Registration
  - `/api/init` - Initialize database

### Frontend (Redux)
- ✅ Redux Toolkit store configured
- ✅ Auth slice (login, register, update user)
- ✅ Events slice (fetch, create, update, delete, register)
- ✅ Users slice (fetch, delete)
- ✅ Redux Provider added to app

## 🚀 Setup Instructions

### Step 1: Environment Variables

Create/update `.env.local` with:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:ridoy007@cluster0.0b7ezwy.mongodb.net/aievent?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Server Port
PORT=5000
```

### Step 2: Install Additional Dependencies (if needed)

```bash
npm install nodemon concurrently --save-dev
```

This allows running both Next.js and Express server simultaneously.

### Step 3: Start the Backend Server

**Option A: Run backend separately**
```bash
npm run server
```

**Option B: Run both frontend and backend**
```bash
npm run dev:all
```

Or manually:
- Terminal 1: `npm run server` (Express on port 5000)
- Terminal 2: `npm run dev` (Next.js on port 3000)

### Step 4: Initialize Database

Once the server is running, initialize the database:

```bash
curl -X POST http://localhost:5000/api/init
```

Or visit in browser: `http://localhost:5000/api/init`

This creates:
- Admin user: `ridoy007@gmail.com` / `ridoy007`
- Sample events

## 📡 API Endpoints

All endpoints are at: `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Events
- `GET /api/events` - Get all events (supports ?category= and ?search=)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)
- `POST /api/events/:id/register` - Register for event (Auth required)
- `DELETE /api/events/:id/register` - Unregister from event (Auth required)

### Initialization
- `POST /api/init` - Initialize database

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

Token is stored in localStorage after login/register.

## 🔄 Redux Usage in Components

### Example: Using Redux in a component

```typescript
"use client";

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchEvents, registerForEvent } from '@/lib/store/slices/eventsSlice';
import { loginUser } from '@/lib/store/slices/authSlice';

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleRegister = (eventId: string) => {
    dispatch(registerForEvent(eventId));
  };

  // ...
}
```

## 📝 Next Steps

1. ✅ Backend is ready - Update components to use Redux instead of localStorage
2. ✅ Replace `lib/storage.ts` imports with Redux actions
3. ✅ Update login/register pages to use Redux
4. ✅ Update event pages to use Redux
5. ✅ Update admin dashboard to use Redux

## 🗄️ Database Collections

- **users** - User accounts (passwords are hashed)
- **events** - Event information
- **registrations** - Stored in events.registeredUsers array

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt
- ✅ JWT token authentication
- ✅ Admin-only routes protected
- ✅ User can only update their own profile
- ✅ CORS enabled for frontend

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure Express server is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### "401 Unauthorized"
- Token might be expired - try logging in again
- Check if token is being sent in requests

### "Database connection failed"
- Verify MongoDB connection string in `.env.local`
- Check MongoDB Atlas network access settings

## 📦 Production Notes

1. Change `JWT_SECRET` to a strong random string
2. Use environment variables for all secrets
3. Enable CORS only for your domain
4. Add rate limiting
5. Use HTTPS in production

