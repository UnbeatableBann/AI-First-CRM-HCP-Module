import React from 'react';
import { X, Calendar, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
}

const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-secondary/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-surface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-border flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-surface-secondary/50">
          <div>
            <h3 className="text-[18px] font-medium text-foreground">Evidence Explorer</h3>
            <p className="text-[13px] text-foreground-secondary mt-1">{title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted hover:text-foreground transition-colors rounded-full hover:bg-surface border border-transparent hover:border-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-secondary rounded-[16px] p-4 border border-border">
              <div className="flex items-center gap-2 text-muted mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[12px] font-medium uppercase tracking-wider">Confidence</span>
              </div>
              <div className="text-[24px] font-medium text-foreground">
                {data?.confidence ? Math.round(data.confidence * 100) : 0}%
              </div>
            </div>
            
            <div className="bg-surface-secondary rounded-[16px] p-4 border border-border">
              <div className="flex items-center gap-2 text-muted mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-[12px] font-medium uppercase tracking-wider">Last Confirmed</span>
              </div>
              <div className="text-[14px] font-medium text-foreground mt-2">
                {data?.evidence?.last_confirmed ? new Date(data.evidence.last_confirmed).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>

          {/* Excerpts / Transcripts */}
          <div>
            <h4 className="text-[14px] font-medium text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted" />
              Supporting Transcripts
            </h4>
            
            {data?.evidence?.excerpts && data.evidence.excerpts.length > 0 ? (
              <div className="space-y-4">
                {data.evidence.excerpts.map((excerpt: string, idx: number) => (
                  <div key={idx} className="bg-primary/5 rounded-[16px] p-4 border border-primary/10 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-[16px]"></div>
                    <p className="text-[13px] text-foreground-secondary italic leading-relaxed">"{excerpt}"</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
                      <span>Derived from Interaction</span>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        View Full <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-secondary border border-border rounded-[16px] p-6 text-center">
                <p className="text-[13px] text-foreground-secondary">
                  No direct transcript excerpts available. This insight was derived from structured interaction data and historical patterns.
                </p>
              </div>
            )}
          </div>

          {/* Linked Interactions */}
          {data?.evidence?.interaction_ids && data.evidence.interaction_ids.length > 0 && (
            <div>
              <h4 className="text-[14px] font-medium text-foreground mb-4">Sourced Interactions</h4>
              <div className="space-y-2">
                {data.evidence.interaction_ids.map((id: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-[12px] hover:bg-surface-secondary cursor-pointer transition-colors group">
                    <div className="text-[13px] text-foreground font-medium group-hover:text-primary transition-colors">Interaction #{id.substring(0, 8)}</div>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default EvidenceDrawer;
