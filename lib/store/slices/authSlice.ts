import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/api/axios';

// Use Next.js API routes in production (Vercel), Express server in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api');

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }

  try {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    // Validate that both token and user exist
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Only set as authenticated if both token and user are valid
        return {
          user: parsedUser,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      } catch (parseError) {
        console.error('Error parsing stored user:', parseError);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
    // Clear invalid data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      // Validate response structure
      if (!response.data || !response.data.success || !response.data.data) {
        console.error('Invalid register response structure:', response.data);
        return rejectWithValue('Invalid response from server');
      }
      
      const { token, user } = response.data.data;
      
      if (!token || !user) {
        console.error('Missing token or user in response:', response.data);
        return rejectWithValue('Invalid response data');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Validate response structure
      if (!response.data || !response.data.success || !response.data.data) {
        console.error('Invalid login response structure:', response.data);
        return rejectWithValue('Invalid response from server');
      }
      
      const { token, user } = response.data.data;
      
      if (!token || !user) {
        console.error('Missing token or user in response:', response.data);
        return rejectWithValue('Invalid response data');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      let token = state.auth.token;
      
      // If token is not in state, try to get it from localStorage
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const response = await api.get(`/auth/me`);
      return response.data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get user');
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      // Import Firebase dynamically on client side only
      if (typeof window === 'undefined') {
        return rejectWithValue('Google Sign-In is only available on the client side');
      }

      // Dynamic import for Firebase to ensure it's only loaded on client
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('@/lib/firebase/config');

      // Check if Firebase is configured
      if (!auth || !googleProvider) {
        console.error('❌ Firebase auth or googleProvider is not initialized');
        return rejectWithValue('Firebase is not configured. Please add Firebase credentials to .env.local');
      }

      // Log current domain for debugging
      if (typeof window !== 'undefined') {
        console.log('🔐 Attempting Google Sign-In from domain:', window.location.hostname);
      }

      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log('✅ Google Sign-In successful, sending token to backend');

      // Send the token to your backend
      const response = await axios.post(`${API_URL}/auth/google`, {
        idToken,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL,
      });

      // Validate response structure
      if (!response.data || !response.data.success || !response.data.data) {
        console.error('❌ Invalid Google auth response structure:', response.data);
        return rejectWithValue('Invalid response from server');
      }
      
      const { token, user: userData } = response.data.data;
      
      if (!token || !userData) {
        console.error('❌ Missing token or user in response:', response.data);
        return rejectWithValue('Invalid response data');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      console.log('✅ Google Sign-In completed successfully');
      return response.data.data;
    } catch (error: any) {
      console.error('❌ Google Sign-In Error:', error);
      
      // Handle Firebase errors with helpful messages
      if (error.code === 'auth/popup-closed-by-user') {
        return rejectWithValue('Sign-in popup was closed');
      } else if (error.code === 'auth/cancelled-popup-request') {
        return rejectWithValue('Sign-in was cancelled');
      } else if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        console.error(`\n🚨 UNAUTHORIZED DOMAIN: ${currentDomain}`);
        console.error(`\nTo fix this:`);
        console.error(`1. Go to: https://console.firebase.google.com/project/aievent-ebc5f/authentication/settings`);
        console.error(`2. Scroll to "Authorized domains"`);
        console.error(`3. Click "Add domain"`);
        console.error(`4. Add: ${currentDomain}`);
        console.error(`   OR add wildcard: *.vercel.app (recommended for all Vercel deployments)`);
        console.error(`\nSee FIREBASE_DOMAIN_FIX.md for detailed instructions.\n`);
        return rejectWithValue(`This domain (${currentDomain}) is not authorized in Firebase. Please add it to Firebase Console authorized domains. See browser console for instructions.`);
      } else if (error.code === 'auth/network-request-failed') {
        return rejectWithValue('Network error. Please check your internet connection.');
      }
      
      return rejectWithValue(error.response?.data?.error || error.message || 'Google Sign-In failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (updates: { name?: string; email?: string; password?: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const userId = state.auth.user?.id;
      
      const response = await axios.put(
        `${API_URL}/users/${userId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = response.data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

