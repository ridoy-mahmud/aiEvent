# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. GitHub/GitLab/Bitbucket account with your code repository
3. MongoDB Atlas account (or your MongoDB connection string)
4. Firebase project (if using Firebase features)
5. OpenAI API key (for chatbot features)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (or leave as is)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

### 3. Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

#### Required Environment Variables:

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
# OR if using Next.js API routes only:
NEXT_PUBLIC_API_URL=/api

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI (for chatbot)
OPENAI_API_KEY=sk-proj-...

# Firebase (optional - if using Firebase auth)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

### 4. Important Notes

#### Express Server Deployment

⚠️ **Your Express server (`server/index.js`) runs separately on port 5000.**

**Option 1: Use Next.js API Routes (Recommended)**

- Convert Express routes to Next.js API routes in `app/api/`
- Your existing API routes are already in `app/api/`

**Option 2: Deploy Express Separately**

- Deploy Express server to a separate service (Railway, Render, Heroku)
- Update `NEXT_PUBLIC_API_URL` to point to the Express server URL

**Option 3: Use Vercel Serverless Functions**

- The Next.js API routes already handle most endpoints
- The Express server might only be needed for development

### 5. Build Settings

Vercel will auto-detect Next.js, but you can verify:

- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### 6. Domain Configuration

After deployment, Vercel provides:

- A production URL: `your-project.vercel.app`
- You can add a custom domain in **Settings** → **Domains**

### 7. Post-Deployment Checklist

- [ ] Test authentication (login/register)
- [ ] Test event creation and fetching
- [ ] Test chatbot functionality
- [ ] Test API endpoints
- [ ] Verify MongoDB connection
- [ ] Check Firebase authentication (if used)
- [ ] Test image loading
- [ ] Verify environment variables are set correctly

## Troubleshooting

### Build Failures

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (should be 18.x or higher)

### Runtime Errors

1. Check environment variables are set correctly
2. Verify MongoDB connection string
3. Check API routes are accessible
4. Review function logs in Vercel dashboard

### Database Connection Issues

1. Whitelist Vercel IPs in MongoDB Atlas
2. Or set IP whitelist to `0.0.0.0/0` (allow all - less secure)
3. Verify MongoDB connection string format

### API Route Issues

If you have Express server routes, ensure they're either:

- Converted to Next.js API routes, OR
- Deployed to a separate service

## Next Steps After Deployment

1. Set up monitoring (Vercel Analytics)
2. Configure custom domain
3. Set up environment-specific variables (Production, Preview, Development)
4. Enable automatic deployments from Git

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
