import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, Activity, Brain, Clock, Plus, ShieldAlert } from 'lucide-react';
import api from '../services/api/axios';

export default function HCPDirectoryPage() {
  const navigate = useNavigate();
  const [hcps, setHcps] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected HCP State for Master-Detail
  const [selectedHcp, setSelectedHcp] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        setLoading(true);
        const [hcpRes, intRes] = await Promise.all([
          api.get('/hcp/'),
          api.get('/interaction/home')
        ]);
        const hcpsData = hcpRes.data.data || [];
        const intsData = intRes.data.data?.saved_hcps || [];
        
        setHcps(hcpsData);
        setInteractions(intsData);
        
        // Select latest by default if available
        if (hcpsData.length > 0) {
          const sortedHcps = [...hcpsData].sort((a, b) => {
            const aInt = intsData.find((i: any) => i.hcp_id === a.id);
            const bInt = intsData.find((i: any) => i.hcp_id === b.id);
            const aDate = aInt?.latest_interaction ? new Date(aInt.latest_interaction).getTime() : 0;
            const bDate = bInt?.latest_interaction ? new Date(bInt.latest_interaction).getTime() : 0;
            return bDate - aDate;
          });
          handleSelectHcp(sortedHcps[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectory();
  }, []);

  const handleSelectHcp = async (hcp: any) => {
    setSelectedHcp(hcp);
    setWorkspaceLoading(true);
    try {
      const res = await api.get(`/hcp/${hcp.id}/workspace`);
      setWorkspace(res.data.data);
    } catch (err) {
      console.error('Failed to load workspace', err);
      setWorkspace(null);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const filteredHcps = hcps
    .filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aInt = interactions.find(i => i.hcp_id === a.id);
      const bInt = interactions.find(i => i.hcp_id === b.id);
      const aDate = aInt?.latest_interaction ? new Date(aInt.latest_interaction).getTime() : 0;
      const bDate = bInt?.latest_interaction ? new Date(bInt.latest_interaction).getTime() : 0;
      return bDate - aDate;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-72px)] overflow-hidden animate-fade-in-up">
      {/* Master Column: HCP List */}
      <div className="w-[360px] shrink-0 border-r border-border bg-surface-secondary flex flex-col h-full">
        <div className="p-6 border-b border-border bg-surface">
          <h1 className="text-[20px] font-semibold text-foreground mb-4">Directory</h1>
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-[12px] text-[13px] text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredHcps.map(hcp => {
            const isSelected = selectedHcp?.id === hcp.id;
            const hcpInteractionInfo = interactions.find(i => i.hcp_id === hcp.id);
            const hasCompleted = !!hcpInteractionInfo;
            const isDraftOnly = !hasCompleted;
            
            return (
              <div 
                key={hcp.id}
                onClick={() => handleSelectHcp(hcp)}
                className={`p-4 rounded-[16px] cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-surface border-primary shadow-minimal' 
                    : 'bg-transparent border-transparent hover:bg-surface/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-[14px] font-medium flex items-center gap-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {hcp.name}
                    {isDraftOnly && (
                      <span className="px-1.5 py-0.5 bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider rounded border border-warning/20">
                        Draft
                      </span>
                    )}
                  </h3>
                  {hcpInteractionInfo?.latest_interaction && (
                    <span className="text-[11px] text-muted whitespace-nowrap ml-2 mt-0.5">
                      {new Date(hcpInteractionInfo.latest_interaction).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-foreground-secondary mb-1">{hcp.specialization || hcp.specialty || 'Specialist'}</div>
                <div className="text-[12px] text-muted flex items-center gap-1.5 line-clamp-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {hcp.hospital_name || hcp.hospital || 'Unknown Facility'}{hcp.city ? `, ${hcp.city}` : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Column: HCP Workspace / Profile */}
      <div className="flex-1 overflow-y-auto bg-background p-8 lg:p-12">
        {!selectedHcp ? (
          <div className="h-full flex items-center justify-center text-muted">
            Select a professional from the directory to view details
          </div>
        ) : workspaceLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !workspace ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-12 h-12 text-danger mb-4 opacity-80" />
            <h2 className="text-[18px] font-medium text-foreground">Data Unavailable</h2>
            <p className="text-[14px] text-muted mt-2">Could not load the workspace for this professional.</p>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto space-y-8 pb-24">
            
            {/* Header Profile */}
            <div className="bg-surface rounded-[24px] border border-border p-8 shadow-minimal">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-[28px] font-medium shrink-0">
                    {selectedHcp.name.startsWith('Dr') ? 'Dr.' : selectedHcp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-[28px] font-semibold text-foreground tracking-tight">{selectedHcp.name}</h1>
                    <div className="text-[16px] text-foreground-secondary mt-1 flex items-center gap-2">
                      <span>{selectedHcp.specialization || selectedHcp.specialty || workspace.profile?.specialty || workspace.profile?.specialization}</span>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4 text-muted" /> 
                        {selectedHcp.hospital_name || workspace.profile?.hospital || 'Unknown Facility'}
                      </span>
                      {selectedHcp.city && (
                        <>
                          <span className="text-border">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted" /> 
                            {selectedHcp.city}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-4 mt-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-secondary text-foreground-secondary text-[12px] font-medium rounded-full border border-border">
                        <Activity className="w-3.5 h-3.5 text-primary" /> {workspace.overview?.relationship_stage || 'Unknown Stage'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-secondary text-foreground-secondary text-[12px] font-medium rounded-full border border-border">
                        <Building className="w-3.5 h-3.5 text-muted" /> {workspace.overview?.digital_engagement_level || 'Standard'} Engagement
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/interactions/new?hcp_id=${selectedHcp.id}`)}
                  className="bg-primary hover:bg-primary-hover text-surface px-5 py-2.5 rounded-[18px] text-[14px] font-medium flex items-center gap-2 transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> Log Interaction
                </button>
              </div>

              {selectedHcp.notes && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-[13px] font-medium text-foreground uppercase tracking-wider mb-2">Profile Notes</h3>
                  <p className="text-[14px] text-foreground-secondary leading-relaxed bg-surface-secondary/50 p-4 rounded-[12px] border border-border/50">
                    {selectedHcp.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Two Column Grid for Insights and Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Col: AI Learnings & Insights */}
              <div className="space-y-8">
                <section className="bg-surface rounded-[24px] border border-border p-8 shadow-minimal">
                  <div className="flex items-center gap-2 mb-6">
                    <Brain className="w-5 h-5 text-ai" />
                    <h2 className="text-[18px] font-medium text-foreground">AI Relationship Learnings</h2>
                  </div>
                  {workspace.insights?.key_learnings?.length > 0 ? (
                    <ul className="space-y-4">
                      {workspace.insights.key_learnings.map((learning: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-[14px] text-foreground-secondary leading-relaxed">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-ai mt-2"></span>
                          {learning}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[14px] text-muted">No behavioral learnings extracted yet. Complete an interaction to generate insights.</p>
                  )}
                  
                  {workspace.insights?.behavioral_profile && (
                    <div className="mt-8 pt-6 border-t border-border">
                      <h3 className="text-[13px] font-medium text-foreground uppercase tracking-wider mb-3">Behavioral Profile</h3>
                      <p className="text-[14px] text-foreground-secondary leading-relaxed">
                        {workspace.insights.behavioral_profile}
                      </p>
                    </div>
                  )}
                </section>

                {/* Topics of Interest */}
                <section className="bg-surface rounded-[24px] border border-border p-8 shadow-minimal">
                  <h2 className="text-[18px] font-medium text-foreground mb-6">Clinical Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {workspace.profile?.clinical_interests?.map((interest: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-surface-secondary text-foreground text-[13px] rounded-[12px] border border-border">
                        {interest}
                      </span>
                    ))}
                    {!workspace.profile?.clinical_interests?.length && (
                      <p className="text-[14px] text-muted">No clinical interests documented.</p>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Col: Interaction Timeline */}
              <div className="space-y-8">
                <section className="bg-surface rounded-[24px] border border-border p-8 shadow-minimal relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <h2 className="text-[18px] font-medium text-foreground">Interaction Timeline</h2>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute top-0 bottom-0 left-[11px] w-px bg-border"></div>
                    <div className="space-y-8 relative z-10">
                      {workspace.timeline?.length > 0 ? workspace.timeline.map((interaction: any, idx: number) => (
                        <div key={idx} className="flex gap-5 group cursor-pointer relative" onClick={() => navigate(`/interactions/${interaction.id}`)}>
                          <div className={`shrink-0 w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center bg-surface transition-all ${
                            interaction.status === 'DRAFT' ? 'border-warning text-warning' : 'border-success text-success'
                          } ${idx === 0 ? 'shadow-[0_0_12px_currentColor] scale-110 z-10' : 'z-10'}`}>
                            <div className={`w-2 h-2 rounded-full ${interaction.status === 'DRAFT' ? 'bg-warning' : 'bg-success'} ${idx === 0 ? 'animate-pulse' : ''}`}></div>
                          </div>
                          <div className={`flex-1 transition-all ${idx === 0 ? 'bg-primary/5 p-4 -mt-3 -mr-3 rounded-[16px] border border-primary/20 shadow-minimal' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[14px] font-medium transition-colors ${idx === 0 ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                {interaction.interaction_type || 'General Discussion'}
                              </span>
                              {idx === 0 && (
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
                                  Latest
                                </span>
                              )}
                              <span className="text-[12px] text-muted px-2 py-0.5 bg-surface-secondary rounded-full border border-border">
                                {interaction.status}
                              </span>
                            </div>
                            <div className="text-[12px] text-muted mb-3 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(interaction.date).toLocaleDateString()}
                            </div>
                            {interaction.topics_discussed && (
                              <p className="text-[14px] text-foreground-secondary line-clamp-2 leading-relaxed">
                                {interaction.topics_discussed}
                              </p>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="text-[14px] text-muted pl-10">No interactions recorded yet.</div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
