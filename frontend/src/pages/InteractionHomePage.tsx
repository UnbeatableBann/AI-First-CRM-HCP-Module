import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import api from '../services/api/axios';

export default function InteractionHomePage() {
  const navigate = useNavigate();
  const [missionData, setMissionData] = useState<any>(null);
  const [interactionData, setInteractionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [hcpSearch, setHcpSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!globalSearch.trim() || !missionData || !interactionData) return null;
    const q = globalSearch.toLowerCase();
    return {
      hcps: (interactionData.saved_hcps || []).filter((h: any) => h.hcp_name?.toLowerCase().includes(q)),
      priorities: (missionData.priority_queue || []).filter((p: any) => p.hcp_name?.toLowerCase().includes(q) || p.action?.toLowerCase().includes(q) || p.reason?.toLowerCase().includes(q)),
      learnings: (missionData.learnings || []).filter((l: any) => l.hcp_name?.toLowerCase().includes(q) || l.reason?.toLowerCase().includes(q))
    };
  }, [globalSearch, missionData, interactionData]);
  const fetchMissionControl = async (refresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const [missionRes, interactionRes] = await Promise.all([
        api.get(`/mission-control${refresh ? '?refresh=true' : ''}`),
        api.get('/interaction/home')
      ]);
      setMissionData(missionRes.data.data);
      setInteractionData(interactionRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load Mission Control feed.');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (item: any) => {
    try {
      setExecutingId(item.title);
      setExecutionResult(null);
      const res = await api.post('/autonomous-agent/execute', {
        hcp_id: item.hcp_id,
        action_title: item.action,
        action_reason: item.reason,
        additional_context: `Executing on behalf of representative for ${item.hcp_name}`
      });
      setExecutionResult(res.data.data.summary);
      setTimeout(() => setExecutionResult(null), 5000);
      fetchMissionControl(true);
    } catch (error) {
      console.error('Execution failed:', error);
      alert('Failed to execute action autonomously.');
    } finally {
      setExecutingId(null);
    }
  };

  useEffect(() => {
    fetchMissionControl();
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

  const deleteDraft = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await api.delete(`/interaction/${id}`);
      fetchMissionControl(true);
    } catch (error) {
      console.error('Failed to delete draft:', error);
      alert('Failed to delete draft.');
    }
  };

  if (loading && (!missionData || !interactionData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <div className="text-gray-500 font-medium">Mission Intelligence Engine Initializing...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100 max-w-md">
          <h2 className="text-red-600 font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => fetchMissionControl(true)} className="px-4 py-2 bg-black text-white rounded-lg text-sm">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!missionData || !interactionData) return null;

  const totalHcps = interactionData?.saved_hcps?.length || 0;
  const totalDrafts = interactionData?.drafts?.length || 0;
  const totalInteractions = interactionData?.saved_hcps?.reduce((acc: number, hcp: any) => acc + hcp.interaction_count, 0) || 0;


  return (
    <div className="bg-[#FAFBFC] min-h-screen font-sans selection:bg-gray-200 relative">
      
      {executionResult && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-gray-900 text-white p-4 rounded-xl shadow-2xl z-50 animate-fade-in-up border border-gray-700">
          <div className="flex items-start gap-3">
            <div className="text-emerald-400 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Autonomous Action Completed</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{executionResult}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">{missionData.summary?.greeting || 'Good Morning'}</h1>
            <p className="text-gray-500 mt-3 text-lg leading-relaxed">{missionData.summary?.daily_mission || 'Your AI operations center is ready.'}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <input 
                type="text" 
                placeholder="Global Search..." 
                value={globalSearch}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 shadow-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              
              {isDropdownOpen && searchResults && globalSearch.trim() !== '' && (
                <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.hcps.length > 0 && (
                    <div className="p-2 border-b border-gray-50">
                      <div className="text-xs font-bold text-gray-400 uppercase px-2 mb-1">HCPs</div>
                      {searchResults.hcps.map((h: any, i: number) => (
                        <div key={`hcp-${i}`} onClick={() => navigate(`/hcp/${h.hcp_id}`)} className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <div className="text-sm font-medium text-gray-900">{h.hcp_name}</div>
                          <div className="text-xs text-gray-500">{h.interaction_count} Interactions</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.priorities.length > 0 && (
                    <div className="p-2 border-b border-gray-50">
                      <div className="text-xs font-bold text-gray-400 uppercase px-2 mb-1">Priorities</div>
                      {searchResults.priorities.map((p: any, i: number) => (
                        <div key={`pri-${i}`} onClick={() => navigate(`/hcp/${p.hcp_id}`)} className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <div className="text-sm font-medium text-gray-900">{p.hcp_name} - {p.action}</div>
                          <div className="text-xs text-gray-500 truncate">{p.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.learnings.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-bold text-gray-400 uppercase px-2 mb-1">Learnings</div>
                      {searchResults.learnings.map((l: any, i: number) => (
                        <div key={`lrn-${i}`} onClick={() => navigate(`/hcp/${l.hcp_id}`)} className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <div className="text-sm font-medium text-gray-900">{l.hcp_name}</div>
                          <div className="text-xs text-gray-500 truncate">{l.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.hcps.length === 0 && searchResults.priorities.length === 0 && searchResults.learnings.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">No results found.</div>
                  )}
                </div>
              )}
            </div>
            <button 
              onClick={() => fetchMissionControl(true)} 
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white rounded-lg border border-gray-200 shadow-sm hover:border-gray-300"
            >
              ↻ Sync
            </button>
            <button 
              onClick={handleNewInteraction} 
              className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              + Quick Interaction
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* Priority Queue */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Priority Intelligence Queue</h2>
              </div>
              
              {missionData.priority_queue?.length > 0 ? (
                <div className="space-y-4">
                  {missionData.priority_queue.map((item: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-all cursor-pointer"
                      onClick={() => navigate(`/hcp/${item.hcp_id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                            item.priority === 'Critical' ? 'bg-rose-50 text-rose-700' :
                            item.priority === 'High' ? 'bg-amber-50 text-amber-700' :
                            item.priority === 'Medium' ? 'bg-sky-50 text-sky-700' :
                            'bg-gray-50 text-gray-700'
                          }`}>
                            {item.priority}
                          </span>
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.type}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                          View Workspace →
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-medium text-gray-900 mt-4 leading-tight">
                        {item.action} <span className="text-gray-400 font-normal">for</span> {item.hcp_name}
                      </h3>
                      
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{item.reason}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); executeAction(item); }}
                          disabled={executingId === item.title}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                          {executingId === item.title ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Executing...
                            </>
                          ) : (
                            <>
                              Approve & Execute
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 border-dashed text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-gray-900 font-medium mb-1">Inbox Zero</h3>
                  <p className="text-gray-500 text-sm">No critical priorities currently detected by the intelligence engine.</p>
                </div>
              )}
            </section>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="text-gray-500 text-sm font-medium mb-1">Total HCPs</div>
                <div className="text-3xl font-light text-gray-900">{totalHcps}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="text-gray-500 text-sm font-medium mb-1">Drafts Pending</div>
                <div className="text-3xl font-light text-gray-900">{totalDrafts}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="text-gray-500 text-sm font-medium mb-1">Total Interactions</div>
                <div className="text-3xl font-light text-gray-900">{totalInteractions}</div>
              </div>
            </div>

            {/* Drafts Section */}
            {interactionData?.drafts?.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Active Drafts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interactionData.drafts.map((draft: any) => (
                    <div 
                      key={draft.id}
                      onClick={() => navigate(`/interactions/${draft.id}`)}
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-amber-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-full">Draft</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{new Date(draft.updated_at).toLocaleDateString()}</span>
                          <button 
                            onClick={(e) => deleteDraft(e, draft.id)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 mt-2 group-hover:text-amber-700 transition-colors">
                        {draft.hcp_name || 'Unnamed HCP'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Click to resume interaction</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Completed Interactions Grouped by HCP */}
            {interactionData?.saved_hcps?.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Completed Interactions</h2>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search HCP Name..." 
                      value={hcpSearch}
                      onChange={(e) => setHcpSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 shadow-sm"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="p-4 font-semibold">HCP Name</th>
                        <th className="p-4 font-semibold text-center">Interactions</th>
                        <th className="p-4 font-semibold">Latest</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {interactionData.saved_hcps
                        .filter((hcp: any) => hcpSearch ? hcp.hcp_name.toLowerCase().includes(hcpSearch.toLowerCase()) : true)
                        .map((hcp: any) => (
                        <tr key={hcp.hcp_id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => navigate(`/hcp/${hcp.hcp_id}`)}>
                          <td className="p-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{hcp.hcp_name}</td>
                          <td className="p-4 text-gray-600 text-center">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm font-medium">{hcp.interaction_count}</span>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">{hcp.latest_interaction ? new Date(hcp.latest_interaction).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-4 text-right">
                            <span className="text-sm text-blue-600 font-medium group-hover:text-blue-800">
                              Workspace →
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}



          </div>

          <div className="lg:col-span-4 space-y-10">
            
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-4">
                <button onClick={handleNewInteraction} className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors group flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Log Interaction</div>
                    <div className="text-xs text-gray-500 mt-0.5">Record a new meeting</div>
                  </div>
                  <span className="text-gray-300 group-hover:text-black transition-colors">→</span>
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">AI Learnings</h2>
              {missionData.learnings?.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="divide-y divide-gray-50">
                    {missionData.learnings.map((learning: any, idx: number) => (
                      <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                          <span className="text-sm font-semibold text-gray-900">{learning.hcp_name}</span>
                        </div>
                        <p className="text-sm text-gray-600 pl-3.5 leading-relaxed">{learning.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic px-2">No recent insights extracted from interactions.</p>
              )}
            </section>

            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Wins</h2>
              {missionData.wins?.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="divide-y divide-gray-50">
                    {missionData.wins.map((win: any, idx: number) => (
                      <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-semibold text-gray-900">{win.hcp_name}</span>
                        </div>
                        <p className="text-sm text-gray-600 pl-3.5 leading-relaxed">{win.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <span className="text-2xl mb-2 block">🎯</span>
                  <p className="text-sm text-gray-500 leading-relaxed">Completing commitments will generate wins here.</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
