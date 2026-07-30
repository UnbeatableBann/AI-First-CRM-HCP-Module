import { useContext } from 'react';
import { Dna, Search } from 'lucide-react';
import { EvidenceContext } from './CurisIntelligenceTab';

const DNAItem = ({ label, item }: { label: string, item: any }) => {
  const { openEvidence } = useContext(EvidenceContext);
  
  if (!item) return null;
  
  const getWeightColor = (weight: string) => {
    switch (weight.toLowerCase()) {
      case 'high': return 'bg-primary';
      case 'medium': return 'bg-primary/60';
      case 'low': return 'bg-primary/30';
      default: return 'bg-border';
    }
  };

  const getWeightLabel = (weight: string) => {
    if (weight.toLowerCase() === 'unknown') return 'Unknown';
    return weight;
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0 group hover:bg-surface-secondary/30 px-2 -mx-2 rounded-[12px] transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[14px] text-foreground font-medium">{label}</span>
        {item.confidence > 0 && (
          <button 
            onClick={() => openEvidence(item, label)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] flex items-center gap-1 text-muted hover:text-primary bg-surface-secondary px-2 py-0.5 rounded-full border border-border"
          >
            <Search className="w-3 h-3" />
            Evid
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium text-foreground-secondary w-16 text-right">{getWeightLabel(item.value)}</span>
        <div className="w-24 h-2 bg-surface-secondary border border-border rounded-full overflow-hidden flex">
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
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Dna className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Decision DNA</h3>
          <p className="text-[13px] text-foreground-secondary">Derived psychological factors influencing adoption</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-4 px-2">Key Influencers</h4>
          <div>
            <DNAItem label="Clinical Evidence" item={dna.clinical_evidence_weight} />
            <DNAItem label="Peer Recommendations" item={dna.peer_recommendations_weight} />
            <DNAItem label="Treatment Guidelines" item={dna.guidelines_weight} />
            <DNAItem label="Pricing Sensitivity" item={dna.pricing_sensitivity} />
            <DNAItem label="Innovation Interest" item={dna.innovation_interest} />
            <DNAItem label="Adoption Speed" item={dna.adoption_speed} />
            <DNAItem label="Risk Tolerance" item={dna.risk_tolerance} />
          </div>
        </div>
        
        <div className="space-y-8 bg-surface-secondary/50 p-6 rounded-[18px] border border-border">
          <div>
            <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-4">Observable Strengths</h4>
            {dna.strengths?.length > 0 ? (
              <ul className="space-y-3">
                {dna.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-[13px] text-foreground flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0"></span>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-muted italic">No strong decision patterns established yet.</p>
            )}
          </div>
          
          <div>
            <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-4">Uncertainties</h4>
            {dna.uncertainties?.length > 0 ? (
              <ul className="space-y-3">
                {dna.uncertainties.map((u: string, i: number) => (
                  <li key={i} className="text-[13px] text-foreground flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0"></span>
                    {u}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-muted italic">No major uncertainties identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionDNACard;
