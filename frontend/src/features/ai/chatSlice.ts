import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../../types';

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  streaming: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  streaming: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setStreaming(state, action: PayloadAction<boolean>) {
      state.streaming = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  },
});

export const { addMessage, setMessages, setLoading, setStreaming, setError } = chatSlice.actions;
export default chatSlice.reducer;
