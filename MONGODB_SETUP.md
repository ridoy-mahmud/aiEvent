# MongoDB Integration Setup Guide

## Step 1: Set Up MongoDB Database

You have two options:

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier M0 is fine)
4. Create a database user (Database Access > Add New User)
5. Add your IP address to Network Access (0.0.0.0/0 for development)
6. Click "Connect" on your cluster
7. Choose "Connect your application"
8. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Option B: Local MongoDB
1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ai-events`

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root directory (if it doesn't exist)
2. Add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-events
```

**Important**: Replace `username`, `password`, and `cluster` with your actual MongoDB credentials.

## Step 3: Initialize the Database

Once your MongoDB connection is set up, initialize the database by calling the init endpoint:

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/init` (or make a POST request to this endpoint)
3. This will create the default admin user and sample events

## Step 4: Update Storage Functions

The existing `lib/storage.ts` uses localStorage. You need to update it to use API calls instead. A new version will be created that uses the MongoDB API endpoints.

## API Endpoints Created

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user
- `POST /api/users/login` - User login

### Events
- `GET /api/events` - Get all events (supports ?category= and ?search= query params)
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get event by ID
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `POST /api/events/[id]/register` - Register user for event
- `DELETE /api/events/[id]/register?userId=...` - Unregister user from event

### Initialization
- `POST /api/init` - Initialize default admin and events

## Migration from localStorage

Your app currently uses localStorage. To migrate:

1. Set up MongoDB (Steps 1-2 above)
2. Run the init endpoint to create admin and events
3. Update `lib/storage.ts` to use API calls (will be updated next)
4. Test all functionality

## Notes

- The admin user email is: `ridoy007@gmail.com`
- The admin user password is: `ridoy007`
- Object IDs are used instead of string IDs
- All timestamps are stored as Date objects in MongoDB

