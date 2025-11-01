# MongoDB Migration Guide

## ✅ What's Been Set Up

1. ✅ **Mongoose installed** - MongoDB driver for Node.js
2. ✅ **Database connection** - `lib/mongodb.ts` handles connection pooling
3. ✅ **Data models** - User and Event models in `lib/models/`
4. ✅ **API routes** - Complete REST API in `app/api/`
5. ✅ **Initialization endpoint** - `/api/init` to set up admin and events

## 📋 Next Steps (What You Need to Do)

### Step 1: Get MongoDB Connection String

**Option A: MongoDB Atlas (Recommended - Free)**

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0)
3. Create database user (username/password)
4. Add IP address `0.0.0.0/0` to Network Access (allow all IPs for development)
5. Click "Connect" → "Connect your application"
6. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/`

**Option B: Local MongoDB**

- Install MongoDB locally
- Use: `mongodb://localhost:27017/ai-events`

### Step 2: Create `.env.local` File

Create a file named `.env.local` in the root directory:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/ai-events
```

Replace `yourusername`, `yourpassword`, and `cluster` with your actual MongoDB credentials.

### Step 3: Initialize Database

1. Start your dev server: `npm run dev`
2. Open browser: `http://localhost:3000/api/init`
   - Or use Postman/curl: `POST http://localhost:3000/api/init`
3. This creates the admin user (`ridoy007@gmail.com` / `ridoy007`) and sample events

### Step 4: Update Code to Use MongoDB API

Currently, your app uses `lib/storage.ts` which uses localStorage. You have two options:

#### Option A: Keep localStorage for Now (Recommended initially)

- Test MongoDB API endpoints work correctly
- Gradually migrate components

#### Option B: Create New Storage File (Full Migration)

- Create `lib/storage-api.ts` that uses fetch() to call API endpoints
- Replace imports from `@/lib/storage` to `@/lib/storage-api`
- This maintains the same function signatures but uses MongoDB

## 🔌 API Endpoints Available

All endpoints return: `{ success: boolean, data?: any, error?: string }`

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create user `{ email, password, name, role? }`
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user `{ name?, email?, password? }`
- `DELETE /api/users/[id]` - Delete user
- `POST /api/users/login` - Login `{ email, password }`

### Events

- `GET /api/events?category=Technology&search=AI` - Get events (filters optional)
- `POST /api/events` - Create event (see Event interface)
- `GET /api/events/[id]` - Get event by ID
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `POST /api/events/[id]/register` - Register `{ userId }`
- `DELETE /api/events/[id]/register?userId=...` - Unregister

### Initialization

- `POST /api/init` - Initialize admin and default events

## 📝 Important Notes

1. **IDs**: MongoDB uses ObjectIds (e.g., `"507f1f77bcf86cd799439011"`) instead of custom strings
2. **Timestamps**: Stored as Date objects, but API returns ISO strings
3. **Relationships**: `registeredUsers` and `createdBy` are populated with user objects
4. **Current User**: Still stored in localStorage for session (frontend only)

## 🧪 Testing

1. Test API endpoints using:

   - Browser (for GET requests)
   - Postman/Insomnia
   - `curl` commands
   - Or update components to use fetch()

2. Example curl commands:

```bash
# Initialize
curl -X POST http://localhost:3000/api/init

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ridoy007@gmail.com","password":"ridoy007"}'

# Get events
curl http://localhost:3000/api/events
```

## 🚀 Production Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **Connection Pooling**: Already handled in `lib/mongodb.ts`
3. **Error Handling**: API routes include error handling
4. **Validation**: Add more validation in API routes if needed
5. **Password Hashing**: Currently passwords are plain text - consider bcrypt for production
6. **Authentication**: Add JWT tokens for API authentication

## ❓ Need Help?

- Check MongoDB Atlas dashboard for connection issues
- Verify `.env.local` file exists and has correct MONGODB_URI
- Check browser console for API errors
- Verify database was initialized by checking MongoDB Atlas collections
