import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

const PredictionList = ({ title, items }: { title: string, items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-800">
            <ChevronRight className="w-3 h-3 text-purple-400 shrink-0" />
            <span>{item}</span>
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
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col relative overflow-hidden">
      {/* Decorative gradient background hint */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0 opacity-50"></div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Future Expectations</h3>
      </div>
      
      {hasData ? (
        <div className="flex-1 overflow-y-auto pr-2 relative z-10">
          <PredictionList title="Likely Discussion Topics" items={predictions.likely_topics} />
          <PredictionList title="Likely Questions" items={predictions.likely_questions} />
          <PredictionList title="Likely Products" items={predictions.likely_products} />
          <PredictionList title="Potential Objections" items={predictions.potential_objections} />
          <PredictionList title="Recommended Literature" items={predictions.recommended_literature} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <p className="text-sm text-gray-500 italic">Curis Planning Engine needs more data to generate predictions.</p>
        </div>
      )}
    </div>
  );
};

export default PredictionsCard;
