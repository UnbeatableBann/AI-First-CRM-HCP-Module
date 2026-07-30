import React from 'react';
import { RefreshCw, FileText, CalendarDays, BrainCircuit, Activity } from 'lucide-react';

interface IntelligenceHeaderProps {
  header: {
    hcp_name: string;
    specialization: string;
    hospital: string;
    last_updated: string;
    digital_twin_version: string;
    knowledge_confidence: number;
    interaction_count: number;
  }
}

const IntelligenceHeader: React.FC<IntelligenceHeaderProps> = ({ header }) => {
  return (
    <div className="bg-surface p-6 md:p-8 rounded-[24px] border border-border shadow-minimal flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-4 border-surface-secondary shadow-sm overflow-hidden shrink-0">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(header.hcp_name)}&background=random&color=fff&size=256`} alt={header.hcp_name} className="w-full h-full object-cover" />
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-[22px] font-semibold text-foreground tracking-tight">{header.hcp_name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-ai/10 text-ai border border-ai/20 text-[12px] font-medium flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" /> Curis Sync
            </span>
          </div>
          
          <div className="flex flex-wrap items-center text-[14px] text-foreground-secondary gap-3">
            <span className="font-medium text-foreground">{header.specialization}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-muted" /> {header.hospital}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto border-t border-border md:border-t-0 pt-4 md:pt-0">
        <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-foreground-secondary bg-surface hover:bg-surface-secondary rounded-[14px] transition-colors border border-border">
          <RefreshCw className="w-4 h-4 text-muted" />
          Re-Analyze
        </button>
        <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-foreground bg-primary/5 hover:bg-primary/10 rounded-[14px] transition-colors border border-primary/20">
          <FileText className="w-4 h-4 text-primary" />
          Brief
        </button>
        <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-surface bg-primary hover:bg-primary-hover rounded-[14px] transition-colors shadow-sm">
          <CalendarDays className="w-4 h-4 text-primary-foreground" />
          Plan Call
        </button>
      </div>
      
    </div>
  );
};

export default IntelligenceHeader;
