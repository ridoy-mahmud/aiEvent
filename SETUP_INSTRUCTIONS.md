# MongoDB Setup Instructions

## Step 1: Create `.env.local` File

1. Create a new file named `.env.local` in the root directory of your project
2. Add the following content (replace `YOUR_USERNAME` with your MongoDB Atlas username):

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:ridoy007@cluster0.0b7ezwy.mongodb.net/aievent?retryWrites=true&w=majority&appName=Cluster0
```

**To find your MongoDB Atlas username:**
- Go to MongoDB Atlas dashboard
- Click on "Database Access" in the left sidebar
- Find your database user - that's your username

**Example:**
If your username is `admin`, your connection string should be:
```env
MONGODB_URI=mongodb+srv://admin:ridoy007@cluster0.0b7ezwy.mongodb.net/aievent?retryWrites=true&w=majority&appName=Cluster0
```

## Step 2: Test the Connection

Run this command to test your MongoDB connection:

```bash
npm run test-db
```

This will:
- ✅ Test connection to MongoDB
- ✅ Show database name (aievent)
- ✅ List existing collections
- ✅ Show count of users and events

## Step 3: Initialize the Database

1. Start your development server:
```bash
npm run dev
```

2. Open your browser and visit:
```
http://localhost:3000/api/init
```

Or use curl:
```bash
curl -X POST http://localhost:3000/api/init
```

This will:
- ✅ Create the admin user (`ridoy007@gmail.com` / `ridoy007`)
- ✅ Create sample events in the database

## Step 4: Verify Everything Works

After initialization, test these endpoints:

```bash
# Check if admin user exists
curl http://localhost:3000/api/users

# Check events
curl http://localhost:3000/api/events

# Test login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ridoy007@gmail.com","password":"ridoy007"}'
```

## Troubleshooting

### "Authentication failed" error
- Double-check your username in `.env.local`
- Verify password is correct: `ridoy007`
- Make sure you replaced `<db_username>` with actual username

### "Network/IP not whitelisted" error
- Go to MongoDB Atlas → Network Access
- Add IP address: `0.0.0.0/0` (allows all IPs - for development only)

### Connection timeout
- Check your internet connection
- Verify the connection string format
- Make sure MongoDB Atlas cluster is running

## Next Steps

Once the database is connected and initialized:
1. Your API endpoints are ready to use
2. You can start migrating components from localStorage to API calls
3. All CRUD operations will work with MongoDB

## Important Notes

- ✅ Database name: `aievent`
- ✅ Password: `ridoy007`
- ✅ Cluster: `cluster0.0b7ezwy.mongodb.net`
- ⚠️ Never commit `.env.local` to git (it's already in .gitignore)
- ⚠️ Replace `YOUR_USERNAME` with your actual MongoDB username

