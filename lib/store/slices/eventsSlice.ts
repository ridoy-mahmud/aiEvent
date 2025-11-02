import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Use Next.js API routes in production (Vercel), Express server in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api');

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  organizer: string;
  capacity: number;
  registeredUsers: any[];
  createdBy: any;
  createdAt: string;
}

interface EventsState {
  events: Event[];
  event: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  event: null,
  loading: false,
  error: null,
};

// Get auth token helper
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters: { category?: string; search?: string } | undefined, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API_URL}/events?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch event');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Omit<Event, '_id' | 'createdAt' | 'createdBy' | 'registeredUsers'>, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/events`,
        eventData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, updates }: { id: string; updates: Partial<Event> }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_URL}/events/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete event');
    }
  }
);

export const registerForEvent = createAsyncThunk(
  'events/registerForEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/events/${eventId}/register`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to register for event');
    }
  }
);

export const unregisterFromEvent = createAsyncThunk(
  'events/unregisterFromEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `${API_URL}/events/${eventId}/register`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to unregister from event');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEvent: (state) => {
      state.event = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch event by ID
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.event = action.payload;
      })
      // Create event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })
      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.event?._id === action.payload._id) {
          state.event = action.payload;
        }
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e._id !== action.payload);
      })
      // Register for event
      .addCase(registerForEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.event?._id === action.payload._id) {
          state.event = action.payload;
        }
      })
      // Unregister from event
      .addCase(unregisterFromEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.event?._id === action.payload._id) {
          state.event = action.payload;
        }
      });
  },
});

export const { clearError, clearEvent } = eventsSlice.actions;
export default eventsSlice.reducer;

