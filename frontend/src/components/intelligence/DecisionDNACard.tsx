import React from 'react';
import { Dna } from 'lucide-react';

const DNAItem = ({ label, item }: { label: string, item: any }) => {
  if (!item) return null;
  
  const getWeightColor = (weight: string) => {
    switch (weight.toLowerCase()) {
      case 'high': return 'bg-blue-600';
      case 'medium': return 'bg-blue-400';
      case 'low': return 'bg-blue-200';
      default: return 'bg-gray-300';
    }
  };

  const getWeightLabel = (weight: string) => {
    if (weight.toLowerCase() === 'unknown') return 'Unknown';
    return weight;
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500 w-16 text-right">{getWeightLabel(item.value)}</span>
        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden flex">
          {item.value.toLowerCase() !== 'unknown' && (
            <div className={`h-full rounded-full ${getWeightColor(item.value)}`} style={{ 
              width: item.value.toLowerCase() === 'high' ? '100%' : item.value.toLowerCase() === 'medium' ? '60%' : '30%' 
            }}></div>
          )}
        </div>
      </div>
    </div>
  );
};

const DecisionDNACard = ({ dna }: { dna: any }) => {
  if (!dna) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Dna className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Decision DNA</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-1">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Key Influencers</h4>
          <DNAItem label="Clinical Evidence" item={dna.clinical_evidence_weight} />
          <DNAItem label="Peer Recommendations" item={dna.peer_recommendations_weight} />
          <DNAItem label="Treatment Guidelines" item={dna.guidelines_weight} />
          <DNAItem label="Pricing Sensitivity" item={dna.pricing_sensitivity} />
          <DNAItem label="Innovation Interest" item={dna.innovation_interest} />
          <DNAItem label="Adoption Speed" item={dna.adoption_speed} />
          <DNAItem label="Risk Tolerance" item={dna.risk_tolerance} />
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Observable Strengths</h4>
            {dna.strengths?.length > 0 ? (
              <ul className="space-y-2">
                {dna.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No strong decision patterns established yet.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Uncertainties</h4>
            {dna.uncertainties?.length > 0 ? (
              <ul className="space-y-2">
                {dna.uncertainties.map((u: string, i: number) => (
                  <li key={i} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {u}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No major uncertainties identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionDNACard;
