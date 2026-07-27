import React, { useState } from 'react';
import { HCPTimelineInteraction } from '../../features/hcpWorkspace/hcpWorkspaceSlice';

interface InteractionCardProps {
  interaction: HCPTimelineInteraction;
  onClick: () => void;
}

const InteractionCard: React.FC<InteractionCardProps> = ({ interaction, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <h4 className="font-semibold text-lg">{interaction.type || 'Interaction'}</h4>
          <p className="text-gray-500 text-sm">{interaction.date || 'Unknown Date'}</p>
        </div>
        <div>
          <span className={`px-2 py-1 rounded text-xs ${interaction.sentiment === 'Positive' ? 'bg-green-100 text-green-800' : interaction.sentiment === 'Negative' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
            {interaction.sentiment || 'Neutral'}
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 text-sm text-gray-700 border-t pt-4">
          <p><strong>Summary:</strong> {interaction.summary || 'No summary available.'}</p>
          {interaction.products && <p className="mt-2"><strong>Products:</strong> {interaction.products}</p>}
          {interaction.outcome && <p className="mt-2"><strong>Outcome:</strong> {interaction.outcome}</p>}
          <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="mt-4 text-blue-600 hover:underline font-medium"
          >
            Open Full Interaction
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractionCard;
