import React, { useEffect, useState } from 'react';
import api from '../../services/api/axios';
import IntelligenceHeader from './IntelligenceHeader';
import PlaybookCard from './PlaybookCard';
import DecisionDNACard from './DecisionDNACard';
import ClinicalIntelligence from './ClinicalIntelligence';
import RelationshipIntelligence from './RelationshipIntelligence';
import ConversationIntelligence from './ConversationIntelligence';
import KnowledgeGapsList from './KnowledgeGapsList';
import OpportunitiesList from './OpportunitiesList';
import CoachingCard from './CoachingCard';
import PredictionsCard from './PredictionsCard';
import KnowledgeEvolutionTimeline from './KnowledgeEvolutionTimeline';
import ContradictionCard from './ContradictionCard';
import StatusPanel from './StatusPanel';
import EvidenceDrawer from './EvidenceDrawer';
import { Search } from 'lucide-react';

interface CurisIntelligenceTabProps {
  hcpId: string;
}

const SECTIONS = [
  { id: 'playbook', label: 'HCP Playbook' },
  { id: 'decision_dna', label: 'Decision DNA' },
  { id: 'clinical', label: 'Clinical Intelligence' },
  { id: 'relationship', label: 'Relationship' },
  { id: 'conversation', label: 'Conversation' },
  { id: 'gaps', label: 'Knowledge Gaps' },
  { id: 'contradictions', label: 'Contradictions' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'future', label: 'Future Expectations' },
  { id: 'evolution', label: 'Knowledge Evolution' }
];

export const EvidenceContext = React.createContext<{
  openEvidence: (item: any, title: string) => void;
}>({ openEvidence: () => {} });

const CurisIntelligenceTab: React.FC<CurisIntelligenceTabProps> = ({ hcpId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeSection, setActiveSection] = useState('playbook');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Evidence Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);
  const [drawerTitle, setDrawerTitle] = useState('');

  useEffect(() => {
    const fetchIntelligence = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/hcp/${hcpId}/intelligence`);
        if (response.data.status === 'success' && response.data.data) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load intelligence');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching intelligence');
      } finally {
        setLoading(false);
      }
    };
    fetchIntelligence();
  }, [hcpId]);

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(`section-${s.id}`));
      
      let currentActive = SECTIONS[0].id;
      let minDistance = Infinity;

      sectionElements.forEach((el, index) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          // We look at distance from top of viewport to the element
          if (rect.top >= 0 && rect.top < minDistance) {
            minDistance = rect.top;
            currentActive = SECTIONS[index].id;
          }
        }
      });
      
      // If we're at the very bottom, highlight the last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        currentActive = SECTIONS[SECTIONS.length - 1].id;
      }
      
      if (minDistance < 300) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openEvidence = (item: any, title: string) => {
    setDrawerData(item);
    setDrawerTitle(title);
    setDrawerOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 animate-pulse">
        <div className="h-32 bg-surface-secondary rounded-[18px] border border-border"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1 hidden lg:block h-96 bg-surface-secondary rounded-[18px] border border-border"></div>
          <div className="col-span-2 space-y-6">
            <div className="h-64 bg-surface-secondary rounded-[18px] border border-border"></div>
            <div className="h-64 bg-surface-secondary rounded-[18px] border border-border"></div>
            <div className="h-64 bg-surface-secondary rounded-[18px] border border-border"></div>
          </div>
          <div className="col-span-1 h-full bg-surface-secondary rounded-[18px] border border-border"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-surface p-12 rounded-[24px] border border-border flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mb-4 border border-border">
          <Search className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-[18px] font-medium text-foreground mb-2">Insufficient Intelligence Data</h3>
        <p className="text-[14px] text-foreground-secondary max-w-md leading-relaxed">
          Curis has not yet learned enough about this HCP. Complete additional interactions to automatically build intelligence.
        </p>
      </div>
    );
  }

  return (
    <EvidenceContext.Provider value={{ openEvidence }}>
      <div className="flex flex-col animate-fade-in-up">
        {/* Top Header */}
        <div className="mb-8">
          <IntelligenceHeader header={data.header} />
        </div>
        
        {/* Main 3-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* LEFT: Section Navigation */}
          <div className="w-full lg:w-56 shrink-0 lg:sticky lg:top-8 hidden lg:block">
            <div className="bg-surface rounded-[24px] border border-border p-4 shadow-minimal">
              <div className="mb-4 relative">
                <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search intelligence..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-[12px] pl-9 pr-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <nav className="space-y-1">
                {SECTIONS.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-[12px] text-[13px] font-medium transition-colors ${
                      activeSection === section.id 
                        ? 'bg-primary/5 text-primary' 
                        : 'text-foreground-secondary hover:text-foreground hover:bg-surface-secondary'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* CENTER: Intelligence Sections */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <div id="section-playbook">
                  <PlaybookCard playbook={data.playbook} />
                </div>
                
                <div id="section-clinical">
                  <ClinicalIntelligence clinical={data.clinical_intelligence} />
                </div>

                <div id="section-conversation">
                  <ConversationIntelligence conversation={data.conversation_intelligence} />
                </div>

                <div id="section-coaching">
                  <CoachingCard coaching={data.coaching} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div id="section-decision_dna">
                  <DecisionDNACard dna={data.decision_dna} />
                </div>
                
                <div id="section-relationship">
                  <RelationshipIntelligence relationship={data.relationship_intelligence} />
                </div>
                
                <div id="section-gaps">
                  <KnowledgeGapsList gaps={data.knowledge_gaps} />
                </div>

                <div id="section-future">
                  <PredictionsCard predictions={data.predictions} />
                </div>
              </div>
            </div>

            {/* Full-width Sections Below */}
            <div className="mt-8 space-y-8">
              {data.contradictions?.length > 0 && (
                <div id="section-contradictions">
                  <ContradictionCard contradictions={data.contradictions} />
                </div>
              )}
              
              {data.opportunities?.length > 0 && (
                <div id="section-opportunities">
                  <OpportunitiesList opportunities={data.opportunities} />
                </div>
              )}
              
              <div id="section-evolution">
                <KnowledgeEvolutionTimeline timeline={data.timeline} />
              </div>
            </div>
          </div>

          {/* RIGHT: Status & Evidence Panel */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-8 space-y-6">
            <StatusPanel header={data.header} />
            
            <div className="bg-surface rounded-[24px] border border-border p-6 shadow-minimal">
              <h4 className="text-[16px] font-medium text-foreground mb-2">Teach Me This HCP</h4>
              <p className="text-[13px] text-foreground-secondary mb-5 leading-relaxed">
                Generate an interactive 5-minute learning session to prepare for your next meeting based on accumulated intelligence.
              </p>
              <button className="w-full bg-surface-secondary hover:bg-border text-foreground py-2.5 rounded-[12px] text-[13px] font-medium transition-colors border border-border flex items-center justify-center gap-2">
                Start Learning Session
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Evidence Drawer */}
      <EvidenceDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title={drawerTitle} 
        data={drawerData} 
      />
    </EvidenceContext.Provider>
  );
};

export default CurisIntelligenceTab;
