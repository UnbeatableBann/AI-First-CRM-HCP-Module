import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HCP } from '../../types';

interface HCPState {
  hcpList: HCP[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: HCPState = {
  hcpList: [],
  searchQuery: '',
  loading: false,
  error: null,
};

const hcpSlice = createSlice({
  name: 'hcp',
  initialState,
  reducers: {
    setHCPList(state, action: PayloadAction<HCP[]>) {
      state.hcpList = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  },
});

export const { setHCPList, setSearchQuery, setLoading, setError } = hcpSlice.actions;
export default hcpSlice.reducer;
