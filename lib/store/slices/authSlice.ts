import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/config';

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

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token,
    isAuthenticated: !!token && !!storedUser,
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      // Check if Firebase is configured
      if (!auth || !googleProvider) {
        return rejectWithValue('Firebase is not configured. Please add Firebase credentials to .env.local');
      }

      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send the token to your backend
      const response = await axios.post(`${API_URL}/auth/google`, {
        idToken,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // Handle Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        return rejectWithValue('Sign-in popup was closed');
      } else if (error.code === 'auth/cancelled-popup-request') {
        return rejectWithValue('Sign-in was cancelled');
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

