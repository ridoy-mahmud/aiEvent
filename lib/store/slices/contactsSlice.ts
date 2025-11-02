import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

interface ContactsState {
  contacts: Contact[];
  contact: Contact | null;
  loading: boolean;
  error: string | null;
  unreadCount: number;
  total: number;
}

const initialState: ContactsState = {
  contacts: [],
  contact: null,
  loading: false,
  error: null,
  unreadCount: 0,
  total: 0,
};

// Get auth token helper
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Async thunks
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: { name: string; email: string; subject: string; message: string }, { rejectWithValue }) => {
    try {
      // Contact form is public, no auth token required
      const response = await axios.post(
        `${API_URL}/contacts`,
        contactData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.error || 'Failed to send message');
      }
    } catch (error: any) {
      // Better error handling
      const errorMessage = error.response?.data?.error 
        || error.message 
        || 'Failed to send message. Please check your connection and try again.';
      
      console.error('Contact form error:', errorMessage, error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (filters?: { read?: boolean; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const params = new URLSearchParams();
      if (filters?.read !== undefined) params.append('read', String(filters.read));
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await axios.get(
        `${API_URL}/contacts${params.toString() ? `?${params.toString()}` : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch contacts');
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch contact');
    }
  }
);

export const markContactAsRead = createAsyncThunk(
  'contacts/markAsRead',
  async ({ id, read }: { id: string; read: boolean }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_URL}/contacts/${id}/read`,
        { read },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete contact');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.contact = action.payload;
        // Update contact in list if it exists
        const index = state.contacts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(markContactAsRead.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        if (action.payload.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else {
          state.unreadCount += 1;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearError } = contactsSlice.actions;
export default contactsSlice.reducer;

