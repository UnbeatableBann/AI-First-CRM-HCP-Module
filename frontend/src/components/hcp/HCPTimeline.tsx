import React from 'react';
import { HCPTimelineInteraction } from '../../features/hcpWorkspace/hcpWorkspaceSlice';
import InteractionCard from './InteractionCard';
import { useNavigate } from 'react-router-dom';

interface HCPTimelineProps {
  timeline: HCPTimelineInteraction[];
}

const HCPTimeline: React.FC<HCPTimelineProps> = ({ timeline }) => {
  const navigate = useNavigate();

  if (timeline.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-500 mb-4">No interactions recorded yet.</h3>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Create Interaction
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Interaction Timeline</h3>
      <div className="relative border-l-2 border-blue-200 ml-4 pl-6 space-y-6">
        {timeline.map((interaction) => (
          <div key={interaction.id} className="relative">
            <div className="absolute -left-9 top-1.5 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
            <InteractionCard 
              interaction={interaction} 
              onClick={() => {
                // Future expansion: Open full interaction modal or navigate
                alert('Interaction view coming soon.');
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HCPTimeline;
