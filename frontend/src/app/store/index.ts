import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from '../../features/interaction/interactionSlice';
import hcpReducer from '../../features/hcp/hcpSlice';
import chatReducer from '../../features/ai/chatSlice';
import hcpWorkspaceReducer from '../../features/hcpWorkspace/hcpWorkspaceSlice';

export const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    hcp: hcpReducer,
    chat: chatReducer,
    hcpWorkspace: hcpWorkspaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
