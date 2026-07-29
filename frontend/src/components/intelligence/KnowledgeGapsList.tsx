import React from 'react';
import { SearchX, HelpCircle } from 'lucide-react';

const KnowledgeGapsList = ({ gaps }: { gaps: any[] }) => {
  if (!gaps || gaps.length === 0) return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center border border-border">
          <SearchX className="w-5 h-5 text-muted" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Knowledge Gaps</h3>
          <p className="text-[13px] text-foreground-secondary">Areas where intelligence is missing or outdated</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center py-8 bg-surface-secondary/20 rounded-[18px] border border-dashed border-border">
        <p className="text-[14px] text-muted italic">No significant knowledge gaps identified.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center border border-warning/20">
          <SearchX className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Knowledge Gaps</h3>
          <p className="text-[13px] text-foreground-secondary">Areas where intelligence is missing or outdated</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gaps.map((gap, i) => (
          <div key={i} className="bg-surface-secondary/50 p-6 rounded-[18px] border border-border flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-[15px] font-medium text-foreground">{gap.topic}</h4>
              <span className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full border ${gap.importance.toLowerCase() === 'high' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-surface border-border text-muted'}`}>
                {gap.importance}
              </span>
            </div>
            <p className="text-[14px] text-foreground-secondary mb-6 leading-relaxed flex-1">{gap.reason}</p>
            
            <div className="bg-surface p-4 rounded-[12px] border border-border flex gap-3 items-start">
              <HelpCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider block mb-1">Suggested Question</span>
                <p className="text-[13px] text-foreground font-medium italic">"{gap.suggested_question}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeGapsList;
