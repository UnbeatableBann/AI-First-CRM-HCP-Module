import api from './axios';
import { HCP, Interaction } from '../../types';

export const hcpApi = {
  searchHCPs: async (query: string): Promise<HCP[]> => {
    const response = await api.get(`/hcp`);
    const hcps = response.data.data;
    if (query) {
      return hcps.filter((h: HCP) => h.name.toLowerCase().includes(query.toLowerCase()));
    }
    return hcps;
  },
  getHCPHistory: async (id: string): Promise<Interaction[]> => {
    const response = await api.get(`/hcp/${id}/interactions`);
    return response.data.data;
  }
};
