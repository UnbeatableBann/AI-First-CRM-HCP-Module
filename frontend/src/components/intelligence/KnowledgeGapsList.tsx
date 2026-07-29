import React from 'react';
import { SearchX, HelpCircle } from 'lucide-react';

const KnowledgeGapsList = ({ gaps }: { gaps: any[] }) => {
  if (!gaps || gaps.length === 0) return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <SearchX className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Knowledge Gaps</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500 italic">No significant knowledge gaps identified.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <SearchX className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Knowledge Gaps</h3>
      </div>
      
      <div className="space-y-4 overflow-y-auto pr-2">
        {gaps.map((gap, i) => (
          <div key={i} className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{gap.topic}</h4>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${gap.importance === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                {gap.importance} Priority
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{gap.reason}</p>
            
            <div className="bg-white p-3 rounded border border-orange-100 flex gap-3 items-start">
              <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Suggested Question</span>
                <p className="text-sm text-gray-800 italic">"{gap.suggested_question}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeGapsList;
