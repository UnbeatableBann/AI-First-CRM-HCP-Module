import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Clock, ChevronRight, Activity, BookOpen, ShieldAlert, Brain } from 'lucide-react';
import api from '../services/api/axios';

export default function InteractionHomePage() {
  const navigate = useNavigate();
  const [missionData, setMissionData] = useState<any>(null);
  const [interactionData, setInteractionData] = useState<any>(null);
  const [allHcps, setAllHcps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissionControl = async () => {
      try {
        setLoading(true);
        setError(null);
        const [missionRes, interactionRes, hcpRes] = await Promise.all([
          api.get(`/mission-control`),
          api.get('/interaction/home'),
          api.get('/hcp')
        ]);
        setMissionData(missionRes.data.data);
        setInteractionData(interactionRes.data.data);
        setAllHcps(hcpRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load Mission Control feed.');
      } finally {
        setLoading(false);
      }
    };
    fetchMissionControl();
  }, []);

  const deleteDraft = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await api.delete(`/interaction/${id}`);
      setInteractionData((prev: any) => ({
        ...prev,
        drafts: prev.drafts.filter((d: any) => d.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-16 flex justify-center">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-danger mx-auto mb-4 opacity-80" />
          <h2 className="text-[18px] font-medium text-foreground mb-2">Connection Issue</h2>
          <p className="text-[14px] text-foreground-secondary mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-surface border border-border text-foreground px-4 py-2 rounded-[18px] text-[14px] font-medium hover:bg-surface-secondary transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!missionData || !interactionData) return null;

  return (
    <div className="px-16 py-12 pb-24 max-w-[1280px] mx-auto space-y-12 animate-fade-in-up">
      
      {/* Mission Banner */}
      <section className="flex justify-between items-end">
        <div>
          <h1 className="text-[32px] font-semibold text-foreground tracking-tight leading-tight">
            {missionData.summary?.greeting || 'Good Morning'}
          </h1>
          <p className="text-[16px] text-foreground-secondary mt-2">
            {missionData.summary?.daily_mission || 'Your clinical priorities and relationship intelligence are ready.'}
          </p>
        </div>
      </section>

      {/* Intelligence Panel (Three Column Workspace) */}
      <section className="bg-surface rounded-[24px] border border-border shadow-minimal overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          
          {/* Column 1: Priorities */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-[16px] font-medium text-foreground">Priority Patients</h3>
            </div>
            {missionData.priority_queue?.length > 0 ? (
              <div className="space-y-6">
                {missionData.priority_queue.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="group cursor-pointer" onClick={() => navigate(`/hcp/${item.hcp_id}`)}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">{item.hcp_name}</span>
                      {item.priority === 'Critical' && <span className="w-2 h-2 rounded-full bg-danger mt-1.5"></span>}
                      {item.priority === 'High' && <span className="w-2 h-2 rounded-full bg-warning mt-1.5"></span>}
                      {item.priority === 'Medium' && <span className="w-2 h-2 rounded-full bg-primary mt-1.5"></span>}
                    </div>
                    <p className="text-[14px] text-foreground-secondary line-clamp-2 leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-muted">No priorities currently queued.</p>
            )}
          </div>

          {/* Column 2: Relationship Trends */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-accent" />
              <h3 className="text-[16px] font-medium text-foreground">Relationship Trends</h3>
            </div>
            {missionData.learnings?.length > 0 ? (
              <div className="space-y-6">
                {missionData.learnings.slice(0, 3).map((learning: any, idx: number) => (
                  <div key={idx} className="group cursor-pointer">
                    <span className="text-[14px] font-medium text-foreground mb-1 block">{learning.hcp_name}</span>
                    <p className="text-[14px] text-foreground-secondary line-clamp-2 leading-relaxed">{learning.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-muted">No recent relationship insights.</p>
            )}
          </div>

          {/* Column 3: Knowledge Updates */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-ai" />
              <h3 className="text-[16px] font-medium text-foreground">Knowledge Updates</h3>
            </div>
            {missionData.wins?.length > 0 ? (
              <div className="space-y-6">
                {missionData.wins.slice(0, 3).map((win: any, idx: number) => (
                  <div key={idx}>
                    <span className="text-[14px] font-medium text-foreground mb-1 block">{win.hcp_name}</span>
                    <p className="text-[14px] text-foreground-secondary line-clamp-2 leading-relaxed">{win.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-muted">No clinical updates available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Drafts Layout */}
      {interactionData?.drafts?.length > 0 && (
        <section>
          <h2 className="text-[20px] font-medium text-foreground mb-6">Draft Interactions</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {interactionData.drafts.map((draft: any) => (
              <div 
                key={draft.id}
                className="shrink-0 w-[320px] bg-surface rounded-[18px] border border-border p-5 hover:border-primary/50 transition-all cursor-pointer shadow-sm group flex flex-col justify-between h-[140px]"
                onClick={() => navigate(`/interactions/${draft.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">{draft.hcp_name || 'Unnamed HCP'}</h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-muted mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      Started {new Date(draft.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteDraft(e, draft.id)}
                    className="text-muted hover:text-danger p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <span className="text-[12px] text-foreground-secondary">In Progress</span>
                  <div className="flex items-center text-[12px] font-medium text-primary">
                    Continue <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Healthcare Professionals Directory & Mission Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* HCP Directory */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-medium text-foreground">Healthcare Professionals</h2>
          </div>
          <div className="bg-surface rounded-[24px] border border-border overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="px-6 py-4 text-[12px] font-medium text-foreground-secondary uppercase tracking-wider">Professional</th>
                  <th className="px-6 py-4 text-[12px] font-medium text-foreground-secondary uppercase tracking-wider">Interactions</th>
                  <th className="px-6 py-4 text-[12px] font-medium text-foreground-secondary uppercase tracking-wider">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(() => {
                  const allHcpsToDisplay = allHcps.map((hcp: any) => {
                    const savedHcp = interactionData.saved_hcps?.find((s: any) => s.hcp_id === hcp.id);
                    const hasCompleted = !!savedHcp;
                    
                    return {
                      hcp_id: hcp.id,
                      hcp_name: hcp.name,
                      specialization: hcp.specialization || hcp.specialty,
                      interaction_count: savedHcp ? savedHcp.interaction_count : 0,
                      latest_interaction: savedHcp ? savedHcp.latest_interaction : null,
                      isDraftOnly: !hasCompleted
                    };
                  }).sort((a, b) => {
                    const aDate = a.latest_interaction ? new Date(a.latest_interaction).getTime() : 0;
                    const bDate = b.latest_interaction ? new Date(b.latest_interaction).getTime() : 0;
                    return bDate - aDate;
                  });

                  return allHcpsToDisplay.map((hcp: any) => (
                    <tr 
                      key={hcp.hcp_id} 
                      className="hover:bg-surface-secondary/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/hcp/${hcp.hcp_id}`)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-[14px] font-medium text-foreground">
                            {hcp.hcp_name.startsWith('Dr') ? 'Dr.' : hcp.hcp_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[14px] font-medium flex items-center gap-2 text-foreground group-hover:text-primary transition-colors">
                              {hcp.hcp_name}
                              {hcp.isDraftOnly && (
                                <span className="px-1.5 py-0.5 bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider rounded border border-warning/20">
                                  Draft
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-foreground-secondary mt-0.5">{hcp.specialization || hcp.specialty || 'Specialist'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[14px] text-foreground-secondary">{hcp.interaction_count} documented</td>
                      <td className="px-6 py-5 text-[14px] text-foreground-secondary">
                        {hcp.latest_interaction ? new Date(hcp.latest_interaction).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mission Feed / Recent Activity Timeline */}
        <section className="lg:col-span-1">
          <h2 className="text-[20px] font-medium text-foreground mb-6">Mission Feed</h2>
          <div className="bg-surface rounded-[24px] border border-border p-6 shadow-minimal relative">
            <div className="absolute top-0 bottom-0 left-[35px] w-px bg-border"></div>
            <div className="space-y-8 relative z-10">
              {interactionData.saved_hcps
                ?.filter((h: any) => h.latest_interaction)
                .sort((a: any, b: any) => new Date(b.latest_interaction).getTime() - new Date(a.latest_interaction).getTime())
                .slice(0, 5)
                .map((hcp: any, idx: number) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className={`shrink-0 w-5 h-5 rounded-full bg-surface border-2 border-primary mt-1 z-10 transition-all ${
                    idx === 0 ? 'shadow-[0_0_12px_rgba(30,58,138,0.5)] scale-110 ring-2 ring-primary/20' : ''
                  }`}>
                    {idx === 0 && <div className="w-full h-full rounded-full animate-pulse bg-primary/20"></div>}
                  </div>
                  <div className={`flex-1 transition-all ${idx === 0 ? 'bg-primary/5 p-3 -mt-2 -mr-2 rounded-[16px] border border-primary/20 shadow-minimal' : ''}`}>
                    <div className="text-[14px] font-medium text-foreground flex items-center gap-2">
                      Interaction Completed
                      {idx === 0 && (
                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider px-1.5 py-0.5 bg-primary/10 rounded border border-primary/20">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] text-foreground-secondary mt-1">
                      You met with <span className="font-medium text-foreground">{hcp.hcp_name}</span> and documented a new interaction.
                    </div>
                    <div className="text-[12px] text-muted mt-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(hcp.latest_interaction).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
