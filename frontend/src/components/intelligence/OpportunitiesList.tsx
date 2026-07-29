import React from 'react';
import { Lightbulb } from 'lucide-react';

const OpportunitiesList = ({ opportunities }: { opportunities: any[] }) => {
  if (!opportunities || opportunities.length === 0) return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-900">Opportunity Signals</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500 italic">No clear opportunities detected at this time.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-900">Opportunity Signals</h3>
      </div>
      
      <div className="space-y-4 overflow-y-auto pr-2">
        {opportunities.map((opp, i) => (
          <div key={i} className="bg-amber-50/30 p-4 rounded-lg border border-amber-100">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{opp.signal_type}</h4>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">{opp.description}</p>
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-gray-500 uppercase">Reasoning: </span> 
              {opp.reasoning}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesList;
