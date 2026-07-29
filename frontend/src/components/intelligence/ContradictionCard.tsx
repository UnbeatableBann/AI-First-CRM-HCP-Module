import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const ContradictionCard = ({ contradictions }: { contradictions: any[] }) => {
  if (!contradictions || contradictions.length === 0) return null;

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-danger/30 shadow-minimal mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center border border-danger/20">
          <AlertTriangle className="w-5 h-5 text-danger" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-danger">Identified Contradictions</h3>
          <p className="text-[13px] text-danger/70">Conflicting signals in recent interactions</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contradictions.map((c, i) => (
          <div key={i} className="bg-danger/5 p-6 rounded-[18px] border border-danger/20 flex flex-col">
            <h4 className="font-medium text-danger mb-4 text-[15px]">{c.conflict}</h4>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 flex-1">
              <div className="flex-1 bg-surface p-4 rounded-[12px] border border-danger/20 shadow-sm text-foreground">
                <span className="text-[11px] uppercase font-medium tracking-wider text-muted block mb-2">Previous Evidence</span>
                <span className="text-[13px]">{c.evidence.split(' vs ')[0] || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-center py-2 sm:py-0">
                <ArrowRight className="w-4 h-4 text-danger/40 rotate-90 sm:rotate-0" />
              </div>
              <div className="flex-1 bg-surface p-4 rounded-[12px] border border-danger/20 shadow-sm text-foreground">
                <span className="text-[11px] uppercase font-medium tracking-wider text-muted block mb-2">Recent Evidence</span>
                <span className="text-[13px]">{c.evidence.split(' vs ')[1] || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="bg-surface p-4 rounded-[12px] border border-danger/20">
              <span className="text-[11px] font-medium text-danger uppercase tracking-wider block mb-1">Action Required</span>
              <p className="text-[14px] text-danger font-medium">{c.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContradictionCard;
