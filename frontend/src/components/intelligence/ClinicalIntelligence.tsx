import { useContext } from 'react';
import { Stethoscope, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import { EvidenceContext } from './CurisIntelligenceTab';

const TrendIcon = ({ trend }: { trend: string }) => {
  switch (trend?.toLowerCase()) {
    case 'increasing': return <TrendingUp className="w-4 h-4 text-success" />;
    case 'decreasing': return <TrendingDown className="w-4 h-4 text-warning" />;
    default: return <Minus className="w-4 h-4 text-muted" />;
  }
};

const IntelligenceList = ({ title, items }: { title: string, items: any[] }) => {
  const { openEvidence } = useContext(EvidenceContext);
  
  if (!items || items.length === 0) return null;
  
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-3 px-1">{title}</h4>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-surface-secondary/50 hover:bg-surface-secondary transition-colors px-4 py-3 rounded-[12px] border border-border group">
            <div className="flex items-center gap-3">
              <TrendIcon trend={item.trend} />
              <span className="text-[14px] font-medium text-foreground">{item.value}</span>
            </div>
            <div className="flex items-center gap-4">
              {item.confidence > 0 && (
                <span className="text-[11px] font-medium text-muted uppercase tracking-wider">{Math.round(item.confidence * 100)}% Conf</span>
              )}
              <button 
                onClick={() => openEvidence(item, title)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] flex items-center gap-1.5 text-muted hover:text-primary bg-surface px-2.5 py-1 rounded-full border border-border"
              >
                <Search className="w-3 h-3" />
                Evid
              </button>
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
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Stethoscope className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Clinical Intelligence</h3>
          <p className="text-[13px] text-foreground-secondary">Derived clinical focus areas and trending interests</p>
        </div>
      </div>
      
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <IntelligenceList title="Primary Interests" items={clinical.clinical_interests} />
            <IntelligenceList title="Emerging Interests" items={clinical.emerging_interests} />
            <IntelligenceList title="Declining Interests" items={clinical.declining_interests} />
          </div>
          <div>
            <IntelligenceList title="Frequently Discussed Diseases" items={clinical.frequent_diseases} />
            <IntelligenceList title="Products Discussed" items={clinical.products_discussed} />
            <IntelligenceList title="Competitors Mentioned" items={clinical.competitors_discussed} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center p-12 border border-dashed border-border rounded-[18px] bg-surface-secondary/20">
          <p className="text-[14px] text-muted max-w-md">Insufficient clinical data gathered. Continue logging detailed interactions to generate clinical intelligence.</p>
        </div>
      )}
    </div>
  );
};

export default ClinicalIntelligence;
