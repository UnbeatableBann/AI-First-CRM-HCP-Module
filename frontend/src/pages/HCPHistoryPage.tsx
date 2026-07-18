import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChevronRight, CheckCircle2, MoreVertical } from 'lucide-react';
import api from '../services/api/axios';

interface Interaction {
  id: string;
  status: string;
  interaction_type: string;
  date: string;
  time: string;
  sentiment: string;
  outcomes: string;
}

interface HCP {
  id: string;
  name: string;
  specialty: string;
}

export default function HCPHistoryPage() {
  const { hcp_id } = useParams<{ hcp_id: string }>();
  const navigate = useNavigate();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [hcp, setHcp] = useState<HCP | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hcpRes, intRes] = await Promise.all([
        api.get(`/hcp/${hcp_id}`),
        api.get(`/hcp/${hcp_id}/interactions`)
      ]);
      setHcp(hcpRes.data.data);
      setInteractions(intRes.data.data);
    } catch (error) {
      console.error('Failed to fetch HCP history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hcp_id]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this interaction?")) return;
    try {
      await api.delete(`/interaction/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete interaction:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-2">
            {hcp?.name || 'HCP History'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{hcp?.specialty}</p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {interactions.length === 0 ? (
           <div className="text-slate-500 italic p-8 bg-white/50 rounded-xl border border-dashed border-slate-300 text-center">
             No interaction history available.
           </div>
        ) : (
          interactions.map((interaction) => (
            <div
              key={interaction.id}
              onClick={() => navigate(`/interactions/${interaction.id}`)}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200/60 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <span className="text-lg font-bold leading-tight">{new Date(interaction.date).getDate()}</span>
                    <span className="text-xs uppercase font-medium">{new Date(interaction.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {interaction.interaction_type || 'Unknown Interaction'}
                      </h3>
                      {interaction.sentiment && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          interaction.sentiment.toLowerCase() === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                          interaction.sentiment.toLowerCase() === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {interaction.sentiment}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {interaction.time || 'No time'}
                      </span>
                      {interaction.outcomes && (
                        <span className="flex items-center gap-1.5 max-w-[200px] truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="truncate">{interaction.outcomes}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   {/* Menu */}
                   <div className="relative group/menu">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/interactions/${interaction.id}`); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => handleDelete(interaction.id, e)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
