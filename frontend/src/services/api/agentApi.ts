import api from './axios';
import { Interaction } from '../../types';

export const agentApi = {
  sendMessage: async (interaction_id: string, message: string, interaction_state: Interaction | null): Promise<{ assistant_response: string; interaction: Interaction, current_hcp_name: string | null }> => {
    const response = await api.post('/agent/', { interaction_id, message, interaction: interaction_state });
    return {
      assistant_response: response.data.assistant_response,
      interaction: response.data.interaction,
      current_hcp_name: response.data.current_hcp_name
    };
  }
};
