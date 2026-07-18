import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Interaction } from '../../types';

interface InteractionState {
  currentDraft: Interaction | null;
  currentHcpName: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: InteractionState = {
  currentDraft: null,
  currentHcpName: null,
  loading: false,
  saving: false,
  error: null,
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    setDraft(state, action: PayloadAction<Interaction>) {
      state.currentDraft = action.payload;
    },
    setCurrentHcpName(state, action: PayloadAction<string | null>) {
      state.currentHcpName = action.payload;
    },
    updateDraftField(state, action: PayloadAction<Partial<Interaction>>) {
      if (state.currentDraft) {
        state.currentDraft = { ...state.currentDraft, ...action.payload };
      }
    },
    setSaving(state, action: PayloadAction<boolean>) {
      state.saving = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearDraft(state) {
      state.currentDraft = null;
      state.currentHcpName = null;
    }
  },
});

export const { setDraft, setCurrentHcpName, updateDraftField, setSaving, setLoading, setError, clearDraft } = interactionSlice.actions;
export default interactionSlice.reducer;
