import React from 'react';
import { HCPInsights as HCPInsightsType } from '../../features/hcpWorkspace/hcpWorkspaceSlice';

interface HCPInsightsProps {
  insights: HCPInsightsType;
}

const HCPInsights: React.FC<HCPInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Relationship Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <span className="block text-sm text-blue-600 font-medium mb-1">Meeting Frequency</span>
          <p className="text-xl font-bold text-blue-900">{insights.meeting_frequency}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <span className="block text-sm text-green-600 font-medium mb-1">Overall Sentiment</span>
          <p className="text-xl font-bold text-green-900">{insights.overall_sentiment}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <span className="block text-sm text-purple-600 font-medium mb-1">Most Discussed Product</span>
          <p className="text-xl font-bold text-purple-900">{insights.most_discussed_product}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Relationship Summary</h4>
          <p className="text-gray-600 text-sm">{insights.relationship_summary}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Pending Follow-up</h4>
          <p className="text-gray-600 text-sm bg-orange-50 text-orange-800 p-3 rounded">{insights.follow_up_pending || 'None'}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">AI Generated Summary</h4>
          <p className="text-gray-600 text-sm">{insights.latest_ai_summary}</p>
        </div>
      </div>
    </div>
  );
};

export default HCPInsights;
