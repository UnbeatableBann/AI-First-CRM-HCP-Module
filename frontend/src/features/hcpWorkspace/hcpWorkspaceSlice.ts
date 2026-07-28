import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api/axios';

export interface HCPProfile {
  id: string;
  name: string;
  specialization: string | null;
  hospital: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface HCPOverview {
  interaction_count: number;
  last_visit: string | null;
  next_follow_up: string | null;
  products_discussed: string[];
  latest_summary: string | null;
}

export interface HCPMemory {
  communication_style: string | null;
  clinical_interests: string[];
  preferred_products: string[];
  common_objections: string[];
  preferred_meeting_time: string | null;
  favorite_materials: string[];
  notes: string | null;
}

export interface HCPTimelineInteraction {
  id: string;
  date: string | null;
  type: string | null;
  summary: string | null;
  products: string | null;
  sentiment: string | null;
  outcome: string | null;
}

export interface HCPInsights {
  relationship_summary: string | null;
  meeting_frequency: string | null;
  most_discussed_product: string | null;
  overall_sentiment: string | null;
  follow_up_pending: string | null;
  latest_ai_summary: string | null;
}

export interface HCPWorkspaceData {
  profile: HCPProfile;
  overview: HCPOverview;
  memory: HCPMemory;
  timeline: HCPTimelineInteraction[];
  insights: HCPInsights;
}

interface HCPWorkspaceState {
  workspace: HCPWorkspaceData | null;
  loading: boolean;
  error: string | null;
  selectedTab: string;
}

const initialState: HCPWorkspaceState = {
  workspace: null,
  loading: false,
  error: null,
  selectedTab: 'Meeting Brief'
};

export const fetchWorkspace = createAsyncThunk(
  'hcpWorkspace/fetchWorkspace',
  async (hcpId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hcp/${hcpId}/workspace`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch HCP workspace');
    }
  }
);

const hcpWorkspaceSlice = createSlice({
  name: 'hcpWorkspace',
  initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspace = action.payload;
      })
      .addCase(fetchWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSelectedTab } = hcpWorkspaceSlice.actions;
export default hcpWorkspaceSlice.reducer;
