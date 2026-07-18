import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, FileEdit, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import api from '../services/api/axios';

interface Draft {
  id: string;
  hcp_name: string | null;
  updated_at: string;
  status: string;
}

interface SavedHCP {
  hcp_id: string;
  hcp_name: string;
  interaction_count: number;
  latest_interaction: string | null;
}

export default function InteractionHomePage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [savedHcps, setSavedHcps] = useState<SavedHCP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/interaction/home');
      setDrafts(res.data.data.drafts);
      setSavedHcps(res.data.data.saved_hcps);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleNewInteraction = async () => {
    try {
      const res = await api.post('/interaction/draft');
      const draftId = res.data.data.id;
      navigate(`/interactions/${draftId}`);
    } catch (error) {
      console.error('Failed to create draft:', error);
    }
  };

  const handleDeleteDraft = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/interaction/${id}`);
      fetchHomeData();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading interactions...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header & New Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 p-6 rounded-2xl border border-white/60 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Interactions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your drafts and past interactions.</p>
        </div>
        <button
          onClick={handleNewInteraction}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Interaction</span>
        </button>
      </div>

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Draft Interactions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => navigate(`/interactions/${draft.id}`)}
                className="group relative bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <FileEdit className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Draft</span>
                  </div>
                  
                  {/* Menu */}
                  <div className="relative group/menu">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/interactions/${draft.id}`); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Continue
                      </button>
                      <button 
                        onClick={(e) => handleDeleteDraft(draft.id, e)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-medium text-slate-800 line-clamp-1">
                    {draft.hcp_name || 'Unknown HCP'}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Updated {new Date(draft.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Saved Interactions Grouped by HCP */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Saved Interactions
        </h2>
        {savedHcps.length === 0 ? (
          <div className="text-slate-500 italic p-8 bg-white/50 rounded-xl border border-dashed border-slate-300 text-center">
            No saved interactions yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedHcps.map((hcp) => (
              <div
                key={hcp.hcp_id}
                onClick={() => navigate(`/hcps/${hcp.hcp_id}/interactions`)}
                className="group relative bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-800 truncate">{hcp.hcp_name}</h3>
                    <p className="text-sm text-emerald-600 font-medium">
                      {hcp.interaction_count} Interaction{hcp.interaction_count !== 1 && 's'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Latest: {hcp.latest_interaction ? new Date(hcp.latest_interaction).toLocaleDateString() : 'N/A'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
