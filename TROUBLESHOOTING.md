# Troubleshooting Guide

## Issue: "Unable to acquire lock" - Next.js already running

**Problem:** Another instance of Next.js is already running on port 3000.

**Solutions:**

### Option 1: Kill existing processes (Windows)
```bash
taskkill /F /IM node.exe
```

### Option 2: Kill existing processes (Linux/Mac)
```bash
pkill -f "next dev"
```

### Option 3: Use the clean script
```bash
npm run clean
```

### Option 4: Find and kill specific process (Windows)
1. Find the process ID:
```bash
netstat -ano | findstr :3000
```
2. Kill it:
```bash
taskkill /PID <process_id> /F
```

### Option 5: Use a different port
Edit `package.json`:
```json
"dev": "next dev -p 3001"
```

## Issue: MongoDB deprecation warnings

**Fixed!** The warnings about `useNewUrlParser` and `useUnifiedTopology` have been removed. These options are no longer needed in newer MongoDB drivers.

## Issue: Port 3000 already in use

The server will automatically use port 3001 if 3000 is busy. This is fine for development.

**To force port 3000:**
1. Kill the process using port 3000 (see above)
2. Or change Next.js port in package.json

## Issue: Server not connecting to MongoDB

1. **Check .env.local file exists** with correct MONGODB_URI
2. **Verify MongoDB Atlas:**
   - Database user exists
   - Network access allows your IP (or 0.0.0.0/0 for development)
   - Connection string is correct
3. **Test connection:**
```bash
npm run test-db
```

## Issue: "Cannot find module" errors

Run:
```bash
npm install
```

This installs all dependencies.

## Quick Start After Issues

1. Kill existing processes:
```bash
npm run clean
```

2. Start fresh:
```bash
npm run dev:all
```

Or separately:
```bash
# Terminal 1
npm run server

# Terminal 2  
npm run dev
```

3. Initialize database:
Visit: `http://localhost:5000/api/init`

## Common Commands

- `npm run server` - Start Express backend only
- `npm run dev` - Start Next.js frontend only
- `npm run dev:all` - Start both servers
- `npm run test-db` - Test MongoDB connection
- `npm run clean` - Kill Next.js processes

