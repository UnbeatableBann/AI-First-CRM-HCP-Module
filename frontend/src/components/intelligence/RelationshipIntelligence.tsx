import React from 'react';
import { HeartHandshake } from 'lucide-react';

const Metric = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-border last:border-0 hover:bg-surface-secondary/30 px-2 -mx-2 rounded-[12px] transition-colors">
    <span className="text-[14px] text-foreground font-medium">{label}</span>
    <span className="text-[14px] font-medium text-foreground-secondary">{value || 'Unknown'}</span>
  </div>
);

const RelationshipIntelligence = ({ relationship }: { relationship: any }) => {
  if (!relationship) return null;

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <HeartHandshake className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Relationship Intelligence</h3>
          <p className="text-[13px] text-foreground-secondary">Derived analysis of trust and engagement patterns</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-4 px-2">Engagement Metrics</h4>
          <div className="space-y-1">
            <Metric label="Relationship Evolution" value={relationship.relationship_evolution} />
            <Metric label="Engagement Trend" value={relationship.engagement_trend} />
            <Metric label="Meeting Consistency" value={relationship.meeting_consistency} />
            <Metric label="Follow-up Completion" value={relationship.followup_completion} />
            <Metric label="Commitment Reliability" value={relationship.commitment_reliability} />
          </div>
        </div>
        
        <div className="space-y-8 bg-surface-secondary/50 p-6 rounded-[18px] border border-border">
          <div>
            <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-4">Trust Signals</h4>
            {relationship.trust_signals?.length > 0 ? (
              <ul className="space-y-3">
                {relationship.trust_signals.map((s: string, i: number) => (
                  <li key={i} className="text-[13px] text-foreground flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0"></span>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-muted italic">No clear trust signals observed yet.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-4">Recent Milestones</h4>
            {relationship.recent_milestones?.length > 0 ? (
              <ul className="space-y-3">
                {relationship.recent_milestones.map((m: string, i: number) => (
                  <li key={i} className="text-[13px] text-foreground flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-muted italic">No recent relationship milestones.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipIntelligence;
