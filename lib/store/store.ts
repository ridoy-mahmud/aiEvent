import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice';
import usersReducer from './slices/usersSlice';
import contactsReducer from './slices/contactsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    users: usersReducer,
    contacts: contactsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

