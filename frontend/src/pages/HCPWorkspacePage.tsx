import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchWorkspace, setSelectedTab } from '../features/hcpWorkspace/hcpWorkspaceSlice';
import HCPHeader from '../components/hcp/HCPHeader';
import HCPOverview from '../components/hcp/HCPOverview';
import HCPTimeline from '../components/hcp/HCPTimeline';
import HCPMemory from '../components/hcp/HCPMemory';
import HCPInsights from '../components/hcp/HCPInsights';
import MeetingBriefTab from '../components/hcp/MeetingBriefTab';

const TABS = ['Meeting Brief', 'Overview', 'Timeline', 'AI Memory', 'Insights'];

const HCPWorkspacePage: React.FC = () => {
  const { hcpId } = useParams<{ hcpId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { workspace, loading, error, selectedTab } = useSelector((state: RootState) => state.hcpWorkspace);

  useEffect(() => {
    if (hcpId) {
      dispatch(fetchWorkspace(hcpId));
    }
  }, [dispatch, hcpId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          <h2 className="text-lg font-semibold mb-2">Error Loading Workspace</h2>
          <p>{error}</p>
          <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!workspace) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Link to="/" className="text-blue-600 hover:underline text-sm flex items-center">
            ← Back to CRM Home
          </Link>
        </div>

        <HCPHeader profile={workspace.profile} overview={workspace.overview} />

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 mb-6 rounded-t-lg shadow-sm">
          <nav className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => dispatch(setSelectedTab(tab))}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  selectedTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {selectedTab === 'Meeting Brief' && (
            <MeetingBriefTab hcpId={hcpId!} />
          )}
          {selectedTab === 'Overview' && (
            <HCPOverview 
              overview={workspace.overview} 
              profile={workspace.profile} 
              setTab={(tab) => dispatch(setSelectedTab(tab))} 
            />
          )}
          {selectedTab === 'Timeline' && (
            <HCPTimeline timeline={workspace.timeline} />
          )}
          {selectedTab === 'AI Memory' && (
            <HCPMemory memory={workspace.memory} />
          )}
          {selectedTab === 'Insights' && (
            <HCPInsights insights={workspace.insights} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HCPWorkspacePage;
