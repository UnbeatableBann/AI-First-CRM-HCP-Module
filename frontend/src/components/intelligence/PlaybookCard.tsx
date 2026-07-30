import { useContext } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { EvidenceContext } from './CurisIntelligenceTab';

const PlaybookItem = ({ label, item }: { label: string, item: any }) => {
  const { openEvidence } = useContext(EvidenceContext);
  
  if (!item) return null;

  return (
    <div className="py-4 border-b border-border last:border-0 group">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-1.5">{label}</h4>
          <p className="text-[14px] font-medium text-foreground">{item.value}</p>
        </div>
        <div className="flex items-center gap-3">
          {item.confidence > 0 && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${item.confidence > 0.7 ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
              {Math.round(item.confidence * 100)}% Conf
            </span>
          )}
          <button 
            onClick={() => openEvidence(item, label)}
            className="text-[11px] flex items-center gap-1.5 text-muted hover:text-primary transition-colors bg-surface-secondary hover:bg-primary/5 px-2.5 py-1 rounded-full border border-border group-hover:border-primary/20"
          >
            <Search className="w-3 h-3" />
            Evidence
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaybookCard = ({ playbook }: { playbook: any }) => {
  if (!playbook) return null;
  
  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">HCP Playbook</h3>
          <p className="text-[13px] text-foreground-secondary">Recommended approach based on derived intelligence</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
        <div>
          <PlaybookItem label="Best Approach" item={playbook.best_approach} />
          <PlaybookItem label="Ideal Style" item={playbook.ideal_conversation_style} />
          <PlaybookItem label="Best Opening" item={playbook.best_opening} />
          <PlaybookItem label="Scientific Depth" item={playbook.recommended_scientific_depth} />
        </div>
        <div>
          <PlaybookItem label="Meeting Duration" item={playbook.typical_meeting_duration} />
          <PlaybookItem label="Communication Preference" item={playbook.communication_preference} />
          
          {playbook.topics_to_avoid?.length > 0 && (
            <div className="py-4 border-b border-border">
              <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-2">Topics to Avoid</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {playbook.topics_to_avoid.map((t: any, i: number) => (
                  <span key={i} className="bg-danger/10 text-danger text-[12px] px-2.5 py-1 rounded-full border border-danger/20">{t.value}</span>
                ))}
              </div>
            </div>
          )}
          
          {playbook.reminders?.length > 0 && (
            <div className="py-4">
              <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-3">Rep Reminders</h4>
              <ul className="space-y-2">
                {playbook.reminders.map((r: any, i: number) => (
                  <li key={i} className="text-[13px] text-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></span>
                    {r.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaybookCard;
