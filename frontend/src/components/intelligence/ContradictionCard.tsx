import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const ContradictionCard = ({ contradictions }: { contradictions: any[] }) => {
  if (!contradictions || contradictions.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-red-700">Identified Contradictions</h3>
      </div>
      
      <div className="space-y-4">
        {contradictions.map((c, i) => (
          <div key={i} className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="font-medium text-red-900 mb-2">{c.conflict}</h4>
            
            <div className="flex items-start gap-4 mb-3 text-sm">
              <div className="flex-1 bg-white p-2 rounded border border-red-100 shadow-sm text-gray-700">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Previous Evidence</span>
                {c.evidence.split(' vs ')[0] || 'Unknown'}
              </div>
              <div className="pt-3">
                <ArrowRight className="w-4 h-4 text-red-300" />
              </div>
              <div className="flex-1 bg-white p-2 rounded border border-red-100 shadow-sm text-gray-700">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Recent Evidence</span>
                {c.evidence.split(' vs ')[1] || 'Unknown'}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border border-red-200">
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block mb-1">Action Required</span>
              <p className="text-sm text-red-800">{c.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContradictionCard;
