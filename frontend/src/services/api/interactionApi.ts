import api from './axios';
import { Interaction } from '../../types';

export const interactionApi = {
  createDraft: async (hcp_id?: string): Promise<Interaction> => {
    const response = await api.post('/interaction/draft', { hcp_id });
    return response.data.data;
  },
  getInteraction: async (id: string): Promise<Interaction> => {
    const response = await api.get(`/interaction/${id}`);
    return response.data.data;
  },
  updateInteraction: async (id: string, data: Partial<Interaction>): Promise<Interaction> => {
    const response = await api.patch(`/interaction/${id}`, data);
    return response.data.data;
  },
};
