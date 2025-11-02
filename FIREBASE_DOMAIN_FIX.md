# Firebase Unauthorized Domain Fix

## Problem
You're seeing the error: `Firebase: Error (auth/unauthorized-domain)`

This happens because Firebase Authentication only allows requests from domains that are explicitly authorized in your Firebase Console.

## Solution

### Step 1: Get Your Vercel Domain(s)

Your Vercel deployment URLs are in the format:
- Production: `https://diveintonext-*.vercel.app`
- Preview: `https://diveintonext-*-mahamulhasan38-1402s-projects.vercel.app`

To get your exact domains, run:
```bash
vercel ls
```

Or check your Vercel dashboard: https://vercel.com/mahamulhasan38-1402s-projects/diveintonext

### Step 2: Add Domains to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **aievent-ebc5f**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add these domains:

#### Required Domains:
- `localhost` (for local development - if not already there)
- `*.vercel.app` (wildcard for all Vercel deployments - **RECOMMENDED**)
- OR your specific production domain: `diveintonext-*.vercel.app`
- Your custom domain (if you have one)

#### Option 1: Add Wildcard (Easiest)
Add: `*.vercel.app`

This will authorize all Vercel deployments automatically.

#### Option 2: Add Specific Domains
If wildcard doesn't work, add:
- Your production domain (check with `vercel ls`)
- Each preview domain as needed

### Step 3: Verify Firebase Config

Ensure your Firebase environment variables in Vercel are correct:

```bash
vercel env ls
```

Check that these are set (without trailing spaces/newlines):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` (should be: `aievent-ebc5f.firebaseapp.com`)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### Step 4: Update Environment Variables if Needed

If you need to update/verify environment variables:

```bash
# View current values
vercel env ls

# Set environment variable (Production)
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
# Enter: aievent-ebc5f.firebaseapp.com (no quotes, no spaces)

# Set environment variable (Preview)
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN preview
# Enter: aievent-ebc5f.firebaseapp.com (no quotes, no spaces)

# Set environment variable (Development)
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN development
# Enter: aievent-ebc5f.firebaseapp.com (no quotes, no spaces)
```

### Step 5: Redeploy

After adding the domain to Firebase:

```bash
vercel --prod --yes
```

Or trigger a redeploy from the Vercel dashboard.

## Troubleshooting

### Still seeing the error?

1. **Clear browser cache** - Firebase caches authorization settings
2. **Wait a few minutes** - Firebase domain changes can take 1-2 minutes to propagate
3. **Check the exact domain** - Look at the browser console error to see what domain Firebase is trying to use
4. **Verify in Firebase Console** - Double-check that the domain appears in the authorized list

### How to Find Your Exact Domain

Open browser DevTools (F12) → Console, look for the error. It will show the exact domain Firebase is rejecting.

### Alternative: Use Firebase Hosting Domain

If you're using Firebase Hosting, you can also authorize:
- `*.firebaseapp.com`
- Your Firebase Hosting domain

## Quick Checklist

- [ ] Added `*.vercel.app` or specific domain to Firebase authorized domains
- [ ] Verified Firebase environment variables are correct (no trailing spaces)
- [ ] Cleared browser cache
- [ ] Waited 1-2 minutes for changes to propagate
- [ ] Redeployed to Vercel
- [ ] Tested Google Sign-In again

## Firebase Console Direct Link

If your project ID is `aievent-ebc5f`, go directly to:
https://console.firebase.google.com/project/aievent-ebc5f/authentication/settings
