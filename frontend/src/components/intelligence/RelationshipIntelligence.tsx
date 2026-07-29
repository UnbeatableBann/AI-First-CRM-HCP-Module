import React from 'react';
import { HeartHandshake } from 'lucide-react';

const Metric = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || 'Unknown'}</span>
  </div>
);

const RelationshipIntelligence = ({ relationship }: { relationship: any }) => {
  if (!relationship) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <HeartHandshake className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-semibold text-gray-900">Relationship Intelligence</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <Metric label="Relationship Evolution" value={relationship.relationship_evolution} />
          <Metric label="Engagement Trend" value={relationship.engagement_trend} />
          <Metric label="Meeting Consistency" value={relationship.meeting_consistency} />
          <Metric label="Follow-up Completion" value={relationship.followup_completion} />
          <Metric label="Commitment Reliability" value={relationship.commitment_reliability} />
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Trust Signals</h4>
            {relationship.trust_signals?.length > 0 ? (
              <ul className="space-y-1">
                {relationship.trust_signals.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="text-rose-500 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No clear trust signals observed yet.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Milestones</h4>
            {relationship.recent_milestones?.length > 0 ? (
              <ul className="space-y-1">
                {relationship.recent_milestones.map((m: string, i: number) => (
                  <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No recent relationship milestones.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipIntelligence;
