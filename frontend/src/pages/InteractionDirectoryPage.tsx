import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Clock, Calendar, Stethoscope, ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api/axios';
import { format } from 'date-fns';

interface Interaction {
  id: string;
  hcp_id: string | null;
  hcp_name: string | null;
  specialization: string | null;
  status: 'DRAFT' | 'COMPLETED';
  interaction_type: string | null;
  date: string | null;
  updated_at: string | null;
  topics_discussed: string | null;
}

const InteractionDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'COMPLETED' | 'DRAFT'>('ALL');

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await api.get('/interaction/');
        console.log('Interactions API response:', response.data);
        if (response.data && response.data.data) {
          setInteractions(response.data.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch interactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, []);

  const filteredInteractions = interactions.filter((int) => {
    if (activeTab !== 'ALL' && int.status !== activeTab) return false;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const hcpNameMatch = int.hcp_name?.toLowerCase().includes(query) || false;
      const typeMatch = int.interaction_type?.toLowerCase().includes(query) || false;
      const topicsMatch = int.topics_discussed?.toLowerCase().includes(query) || false;
      const dateMatch = int.date?.includes(query) || int.updated_at?.includes(query) || false;
      const specMatch = int.specialization?.toLowerCase().includes(query) || false;
      
      return hcpNameMatch || typeMatch || topicsMatch || dateMatch || specMatch;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen p-8 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-2">Interactions</h1>
          <p className="text-foreground-secondary">Manage and review all your HCP interactions</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[24px] shadow-sm overflow-hidden mb-8">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-surface-secondary rounded-[14px]">
            {(['ALL', 'COMPLETED', 'DRAFT'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-surface text-foreground shadow-sm' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by HCP, topic, profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-[14px] text-[14px] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-12 text-center text-muted">Loading interactions...</div>
          ) : filteredInteractions.length === 0 ? (
            <div className="p-12 text-center text-muted">No interactions found matching your criteria.</div>
          ) : (
            filteredInteractions.map((int) => (
              <div 
                key={int.id}
                onClick={() => navigate(`/interactions/${int.id}`)}
                className="p-6 hover:bg-surface-secondary/50 transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    int.status === 'COMPLETED' ? 'bg-primary/10 text-primary' : 'bg-surface-secondary text-muted border border-border'
                  }`}>
                    {int.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[16px] font-medium text-foreground">
                        {int.interaction_type || 'Untitled Interaction'}
                      </h3>
                      {int.status === 'DRAFT' && (
                        <span className="px-2 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded-md text-[10px] font-bold tracking-wider uppercase">
                          Draft
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-[13px] text-muted">
                      {int.hcp_name ? (
                        <div className="flex items-center gap-1.5 text-foreground-secondary">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>{int.hcp_name} • {int.specialization || 'Specialist'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>No HCP selected</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {int.date 
                            ? format(new Date(int.date), 'MMM d, yyyy') 
                            : int.updated_at 
                              ? `Updated ${format(new Date(int.updated_at), 'MMM d')}` 
                              : 'No date'}
                        </span>
                      </div>
                      
                      {int.topics_discussed && (
                        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="truncate">{int.topics_discussed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all transform group-hover:translate-x-1" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractionDirectoryPage;
