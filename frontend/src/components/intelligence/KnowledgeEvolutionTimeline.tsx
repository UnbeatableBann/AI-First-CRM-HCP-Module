import React from 'react';
import { History, GitCommit } from 'lucide-react';

const KnowledgeEvolutionTimeline = ({ timeline }: { timeline: any[] }) => {
  if (!timeline || timeline.length === 0) return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center border border-border">
          <History className="w-5 h-5 text-muted" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Knowledge Evolution</h3>
          <p className="text-[13px] text-foreground-secondary">Historical changes to HCP intelligence</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center py-8 bg-surface-secondary/20 rounded-[18px] border border-dashed border-border">
        <p className="text-[14px] text-muted italic text-center">No significant knowledge evolution recorded yet.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <History className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Knowledge Evolution</h3>
          <p className="text-[13px] text-foreground-secondary">Historical changes to HCP intelligence</p>
        </div>
      </div>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent px-4 py-2">
        {timeline.map((event, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-[4px] border-surface bg-surface-secondary text-muted shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <GitCommit className="w-4 h-4" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-surface p-5 rounded-[16px] border border-border shadow-minimal group-hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider">{event.action}</span>
                <span className="text-[12px] font-medium text-muted">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <p className="text-[14px] text-foreground font-medium mb-3">{event.description}</p>
              
              {(event.previous_value || event.new_value) && (
                <div className="bg-surface-secondary/50 rounded-[12px] border border-border p-3 text-[13px] flex flex-col gap-1">
                  {event.previous_value && <div className="text-muted"><span className="line-through mr-2">Was: {event.previous_value}</span></div>}
                  {event.new_value && <div className="text-success font-medium">Now: {event.new_value}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeEvolutionTimeline;
