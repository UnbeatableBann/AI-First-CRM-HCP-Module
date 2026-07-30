import { ShieldCheck, Clock, CheckCircle2, Activity, Zap } from 'lucide-react';

const StatusPanel = ({ header }: { header: any }) => {
  if (!header) return null;

  return (
    <div className="bg-surface p-6 rounded-[24px] border border-border shadow-minimal sticky top-6">
      <div className="flex items-center gap-2 mb-8">
        <Zap className="w-4 h-4 text-ai" />
        <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider">Intelligence Status</h4>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center border border-success/20 shrink-0 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4 text-success" />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-1">AI Confidence</span>
            <span className="block text-[14px] font-medium text-foreground">{Math.round(header.knowledge_confidence * 100)}% Evidence Backed</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center border border-info/20 shrink-0 group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4 text-info" />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-1">Evidence Health</span>
            <span className="block text-[14px] font-medium text-foreground">{header.interaction_count} Interactions analyzed</span>
          </div>
        </div>

        <div className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center border border-warning/20 shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-1">Knowledge Freshness</span>
            <span className="block text-[14px] font-medium text-foreground">
              {new Date(header.last_updated).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center border border-border shrink-0 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4 text-muted" />
          </div>
          <div>
            <span className="block text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-1">Twin Version</span>
            <span className="block text-[12px] font-mono text-muted bg-surface-secondary px-2 py-1 rounded-[6px] border border-border mt-1">
              v{header.digital_twin_version.substring(0,8)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
        <span className="block text-[11px] font-medium text-foreground-secondary tracking-wider">Curis Intelligence Active</span>
      </div>
    </div>
  );
};

export default StatusPanel;
