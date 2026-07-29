import React, { useContext } from 'react';
import { Lightbulb, Search } from 'lucide-react';
import { EvidenceContext } from './CurisIntelligenceTab';

const OpportunitiesList = ({ opportunities }: { opportunities: any[] }) => {
  const { openEvidence } = useContext(EvidenceContext);

  if (!opportunities || opportunities.length === 0) return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center border border-border">
          <Lightbulb className="w-5 h-5 text-muted" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Opportunity Signals</h3>
          <p className="text-[13px] text-foreground-secondary">Derived opportunities based on recent interactions</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center py-8 bg-surface-secondary/20 rounded-[18px] border border-dashed border-border">
        <p className="text-[14px] text-muted italic">No clear opportunities detected at this time.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center border border-warning/20">
          <Lightbulb className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Opportunity Signals</h3>
          <p className="text-[13px] text-foreground-secondary">Derived opportunities based on recent interactions</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp, i) => (
          <div key={i} className="bg-surface-secondary/50 p-6 rounded-[18px] border border-border group hover:border-warning/30 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-[15px] font-medium text-foreground">{opp.signal_type}</h4>
              <button 
                onClick={() => openEvidence(opp, opp.signal_type)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] flex items-center gap-1.5 text-muted hover:text-warning bg-surface px-2.5 py-1 rounded-full border border-border"
              >
                <Search className="w-3 h-3" />
                Evid
              </button>
            </div>
            <p className="text-[14px] font-medium text-foreground mb-3">{opp.description}</p>
            <div className="bg-surface p-4 rounded-[12px] border border-border">
              <span className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider block mb-1">Reasoning</span> 
              <p className="text-[13px] text-foreground-secondary leading-relaxed">{opp.reasoning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesList;
