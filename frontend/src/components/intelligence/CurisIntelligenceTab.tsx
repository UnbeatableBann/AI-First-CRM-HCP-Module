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

interface CurisIntelligenceTabProps {
  hcpId: string;
}

const CurisIntelligenceTab: React.FC<CurisIntelligenceTabProps> = ({ hcpId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white p-12 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Insufficient Intelligence Data</h3>
        <p className="text-gray-500 max-w-md">
          Curis has not yet observed enough evidence to identify conversation patterns and build a robust intelligence profile. 
          Complete additional interactions to improve intelligence.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up">
      {/* LEFT Navigation / Context (Optional based on layout, omitting if main is split) */}
      
      {/* CENTER: Intelligence Workspace (75% or flex-1) */}
      <div className="flex-1 space-y-6">
        <IntelligenceHeader header={data.header} />
        
        <ContradictionCard contradictions={data.contradictions} />
        
        <PlaybookCard playbook={data.playbook} />
        
        <DecisionDNACard dna={data.decision_dna} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ClinicalIntelligence clinical={data.clinical_intelligence} />
          <RelationshipIntelligence relationship={data.relationship_intelligence} />
        </div>
        
        <ConversationIntelligence conversation={data.conversation_intelligence} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <KnowledgeGapsList gaps={data.knowledge_gaps} />
          <OpportunitiesList opportunities={data.opportunities} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CoachingCard coaching={data.coaching} />
          <PredictionsCard predictions={data.predictions} />
        </div>
        
        <KnowledgeEvolutionTimeline timeline={data.timeline} />
      </div>

      {/* RIGHT: Status & AI Panel (25% or w-80) */}
      <div className="w-full md:w-80 shrink-0 space-y-6">
        <StatusPanel header={data.header} />
        {/* TeachMePanel and EvidenceDrawer trigger can go here or within components */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Teach Me This HCP</h4>
          <p className="text-xs text-gray-500 mb-4">Generate an interactive 5-minute learning session to prepare for your next meeting.</p>
          <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium transition-colors">
            Start Learning Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurisIntelligenceTab;
