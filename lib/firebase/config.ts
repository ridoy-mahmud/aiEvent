import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

// Helper function to trim environment variables and remove newlines
const trimEnv = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback;
  // Remove all whitespace, newlines, and carriage returns
  return value.trim().replace(/\s+/g, '').replace(/\n/g, '').replace(/\r/g, '');
};

const firebaseConfig = {
  apiKey: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyDypMoRdgcCzqzYlh5ybMNrlMF6hW1-DDE"),
  authDomain: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "aievent-ebc5f.firebaseapp.com"),
  projectId: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "aievent-ebc5f"),
  storageBucket: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "aievent-ebc5f.firebasestorage.app"),
  messagingSenderId: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "563709279279"),
  appId: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "1:563709279279:web:49d135923a25a3b6349ada"),
  measurementId: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, "G-RGFZNB4CPD"),
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  // Always return true since we have fallback values
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Only initialize on client side
if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  try {
    // Log current domain for debugging unauthorized-domain errors
    const currentDomain = window.location.hostname;
    console.log('🔐 Firebase Auth - Current domain:', currentDomain);
    console.log('🔐 Firebase Auth - Auth Domain:', firebaseConfig.authDomain);
    
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize Firebase Auth
    auth = getAuth(app);
    
    // Google Auth Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
    
    // Log successful initialization
    console.log('✅ Firebase initialized successfully');
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error);
    
    // Provide helpful error message for unauthorized-domain
    if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('unauthorized-domain')) {
      const currentDomain = window.location.hostname;
      console.error(`\n🚨 FIREBASE UNAUTHORIZED DOMAIN ERROR`);
      console.error(`Current domain: ${currentDomain}`);
      console.error(`\nTo fix this:`);
      console.error(`1. Go to: https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`);
      console.error(`2. Scroll to "Authorized domains"`);
      console.error(`3. Click "Add domain"`);
      console.error(`4. Add: ${currentDomain}`);
      console.error(`   OR add wildcard: *.vercel.app (recommended for all Vercel deployments)`);
      console.error(`\nSee FIREBASE_DOMAIN_FIX.md for detailed instructions.\n`);
    }
  }
} else if (typeof window !== 'undefined') {
  console.warn('⚠️ Firebase is not configured. Please add Firebase credentials to .env.local');
}

export { auth, googleProvider };
export default app;

