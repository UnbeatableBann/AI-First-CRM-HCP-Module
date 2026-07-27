import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/axios';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { HeroSection } from '../components/dashboard/HeroSection';
import { QuickActions } from '../components/dashboard/QuickActions';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { DraftSection } from '../components/dashboard/DraftSection';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { HCPGrid } from '../components/dashboard/HCPGrid';
import { AIPanel } from '../components/dashboard/AIPanel';

interface Draft {
  id: string;
  hcp_name: string | null;
  updated_at: string;
  status: string;
}

interface SavedHCP {
  hcp_id: string;
  hcp_name: string;
  interaction_count: number;
  latest_interaction: string | null;
}

export default function InteractionHomePage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [savedHcps, setSavedHcps] = useState<SavedHCP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/interaction/home');
      setDrafts(res.data.data.drafts);
      setSavedHcps(res.data.data.saved_hcps);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleNewInteraction = async () => {
    try {
      const res = await api.post('/interaction/draft');
      const draftId = res.data.data.id;
      navigate(`/interactions/${draftId}`);
    } catch (error) {
      console.error('Failed to create draft:', error);
    }
  };

  const handleResumeDraft = (id: string) => {
    navigate(`/interactions/${id}`);
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await api.delete(`/interaction/${id}`);
      fetchHomeData();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const handleOpenWorkspace = (hcpId: string) => {
    navigate(`/hcp/${hcpId}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-[#6B7280]">Loading workspace...</div>;
  }

  return (
    <div className="bg-[#FAFBFC] min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
        <DashboardHeader />
        
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Main Dashboard (70%) */}
          <div className="flex-1 lg:w-[70%] min-w-0 flex flex-col gap-8">
            <HeroSection onResume={() => {}} />
            <QuickActions onNewInteraction={handleNewInteraction} />
            <StatsGrid totalHcps={savedHcps.length} draftsCount={drafts.length} />
            
            <div className="flex flex-col xl:flex-row gap-8 mt-4">
              <div className="flex-1 min-w-0">
                <DraftSection drafts={drafts} onResume={handleResumeDraft} onDelete={handleDeleteDraft} />
              </div>
              <div className="xl:w-80 shrink-0">
                <ActivityTimeline />
              </div>
            </div>
            
            <HCPGrid hcps={savedHcps} onOpenWorkspace={handleOpenWorkspace} />
          </div>

          {/* AI Panel (30%) */}
          <aside className="w-full lg:w-[30%] shrink-0">
            <AIPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
