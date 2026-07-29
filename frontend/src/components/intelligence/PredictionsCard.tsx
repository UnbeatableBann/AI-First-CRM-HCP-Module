import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

const PredictionList = ({ title, items }: { title: string, items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-3 px-1">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 bg-surface-secondary/50 p-3 rounded-[12px] border border-border">
            <ChevronRight className="w-4 h-4 text-ai shrink-0 mt-0.5" />
            <span className="text-[14px] text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PredictionsCard = ({ predictions }: { predictions: any }) => {
  if (!predictions) return null;

  const hasData = predictions.likely_topics?.length > 0 || predictions.likely_products?.length > 0;

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-ai/5 rounded-bl-full -z-0 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-full bg-ai/10 flex items-center justify-center border border-ai/20">
          <Sparkles className="w-5 h-5 text-ai" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Future Expectations</h3>
          <p className="text-[13px] text-foreground-secondary">Generated predictions for your next encounter</p>
        </div>
      </div>
      
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div>
            <PredictionList title="Likely Discussion Topics" items={predictions.likely_topics} />
            <PredictionList title="Likely Questions" items={predictions.likely_questions} />
          </div>
          <div>
            <PredictionList title="Likely Products" items={predictions.likely_products} />
            <PredictionList title="Potential Objections" items={predictions.potential_objections} />
            <PredictionList title="Recommended Literature" items={predictions.recommended_literature} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center py-12 relative z-10 bg-surface-secondary/20 rounded-[18px] border border-dashed border-border">
          <p className="text-[14px] text-muted italic">Curis Planning Engine needs more data to generate predictions.</p>
        </div>
      )}
    </div>
  );
};

export default PredictionsCard;
