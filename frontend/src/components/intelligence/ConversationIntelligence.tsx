import { MessageSquareText } from 'lucide-react';

const FlowItem = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-surface-secondary/50 p-4 rounded-[16px] border border-border flex-1">
    <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-2">{label}</h4>
    <p className="text-[14px] font-medium text-foreground">{value || 'Not established'}</p>
  </div>
);

const TagList = ({ title, items, colorClass }: { title: string, items: string[], colorClass: string }) => (
  <div className="mb-6 last:mb-0">
    <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-3">{title}</h4>
    {items?.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className={`text-[12px] px-3 py-1.5 rounded-full border ${colorClass}`}>
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-[13px] text-muted italic">No patterns detected.</p>
    )}
  </div>
);

const ConversationIntelligence = ({ conversation }: { conversation: any }) => {
  if (!conversation) return null;

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <MessageSquareText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Conversation Intelligence</h3>
          <p className="text-[13px] text-foreground-secondary">Extracted patterns from all past interactions</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        <div>
          <TagList 
            title="Productive Topics" 
            items={conversation.productive_topics} 
            colorClass="bg-success/10 text-success border-success/20 font-medium" 
          />
          <TagList 
            title="Typical Objections" 
            items={conversation.typical_objections} 
            colorClass="bg-danger/10 text-danger border-danger/20 font-medium" 
          />
        </div>
        <div>
          <TagList 
            title="Frequently Asked Questions" 
            items={conversation.frequent_questions} 
            colorClass="bg-info/10 text-info border-info/20 font-medium" 
          />
          <TagList 
            title="Topics to Avoid" 
            items={conversation.avoided_topics} 
            colorClass="bg-warning/10 text-warning border-warning/20 font-medium" 
          />
        </div>
      </div>
      
      <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-4 px-2">Flow Optimization</h4>
      <div className="flex flex-col sm:flex-row gap-4">
        <FlowItem label="Best Opener" value={conversation.best_opener} />
        <FlowItem label="Preferred Sequence" value={conversation.preferred_sequence} />
        <FlowItem label="Worst Opener" value={conversation.worst_opener} />
      </div>
    </div>
  );
};

export default ConversationIntelligence;
