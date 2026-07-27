import React from 'react';
import { HCPOverview as HCPOverviewType, HCPProfile } from '../../features/hcpWorkspace/hcpWorkspaceSlice';
import { useNavigate } from 'react-router-dom';

interface HCPOverviewProps {
  overview: HCPOverviewType;
  profile: HCPProfile;
  setTab: (tab: string) => void;
}

const HCPOverview: React.FC<HCPOverviewProps> = ({ overview, profile, setTab }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Overview</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex justify-between">
            <span className="font-medium">Total Interactions:</span>
            <span className="text-gray-900">{overview.interaction_count}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Last Visit:</span>
            <span className="text-gray-900">{overview.last_visit || 'N/A'}</span>
          </li>
          <li className="flex flex-col mt-2">
            <span className="font-medium mb-1">Products Discussed:</span>
            <div className="flex flex-wrap gap-2">
              {overview.products_discussed.length > 0 ? (
                overview.products_discussed.map((p, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{p}</span>
                ))
              ) : (
                <span className="text-gray-500 italic">None</span>
              )}
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Quick Actions</h3>
          <p className="text-gray-500 text-sm mb-6">Manage your interactions and view details for {profile.name}.</p>
        </div>
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Create New Interaction
          </button>
          <button 
            onClick={() => setTab('Timeline')} 
            className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-medium py-2 px-4 rounded transition-colors"
          >
            View Timeline
          </button>
        </div>
      </div>
    </div>
  );
};

export default HCPOverview;
