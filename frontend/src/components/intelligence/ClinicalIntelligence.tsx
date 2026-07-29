import React from 'react';
import { Stethoscope, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendIcon = ({ trend }: { trend: string }) => {
  switch (trend?.toLowerCase()) {
    case 'increasing': return <TrendingUp className="w-3 h-3 text-green-500" />;
    case 'decreasing': return <TrendingDown className="w-3 h-3 text-red-500" />;
    default: return <Minus className="w-3 h-3 text-gray-400" />;
  }
};

const IntelligenceList = ({ title, items }: { title: string, items: any[] }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
            <div className="flex items-center gap-2">
              <TrendIcon trend={item.trend} />
              <span className="text-sm font-medium text-gray-800">{item.value}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.confidence > 0 && (
                <span className="text-[10px] uppercase font-bold text-gray-400">{Math.round(item.confidence * 100)}% Conf</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClinicalIntelligence = ({ clinical }: { clinical: any }) => {
  if (!clinical) return null;

  const hasData = clinical.clinical_interests?.length > 0 || 
                  clinical.frequent_diseases?.length > 0 || 
                  clinical.products_discussed?.length > 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Stethoscope className="w-5 h-5 text-teal-600" />
        <h3 className="text-lg font-semibold text-gray-900">Clinical Intelligence</h3>
      </div>
      
      {hasData ? (
        <div className="flex-1 overflow-y-auto pr-2">
          <IntelligenceList title="Primary Interests" items={clinical.clinical_interests} />
          <IntelligenceList title="Emerging Interests" items={clinical.emerging_interests} />
          <IntelligenceList title="Frequently Discussed Diseases" items={clinical.frequent_diseases} />
          <IntelligenceList title="Products Discussed" items={clinical.products_discussed} />
          <IntelligenceList title="Competitors Mentioned" items={clinical.competitors_discussed} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <p className="text-sm text-gray-500 italic">Insufficient clinical data gathered from interactions.</p>
        </div>
      )}
    </div>
  );
};

export default ClinicalIntelligence;
