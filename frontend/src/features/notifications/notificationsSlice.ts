import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [
    {
      id: '1',
      title: 'Welcome to Curis',
      message: 'Your intelligent enterprise workspace is ready.',
      read: false,
      timestamp: new Date().toISOString(),
      type: 'info',
    },
    {
      id: '2',
      title: 'System Update',
      message: 'The AI model has been successfully updated with the latest clinical guidelines.',
      read: true,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'success',
    }
  ],
  unreadCount: 1,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'timestamp'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        read: false,
        timestamp: new Date().toISOString(),
      };
      state.items.unshift(newNotification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(n => { n.read = true; });
      state.unreadCount = 0;
    },
    clearAll: (state) => {
      state.items = [];
      state.unreadCount = 0;
    }
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;
