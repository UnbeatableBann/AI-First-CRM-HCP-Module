export interface HCP {
  id: string;
  name: string;
  specialty: string;
  hospital?: string;
}

export type Sentiment = 'Positive' | 'Neutral' | 'Negative' | null;

export interface Interaction {
  id: string;
  hcp_id: string | null;
  interaction_type: string;
  date: string;
  time: string;
  attendees: string;
  topics_discussed: string;
  materials_shared: string;
  samples_distributed: string;
  sentiment: Sentiment;
  outcomes: string;
  follow_up_actions: string;
  status: 'DRAFT' | 'COMPLETED';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
