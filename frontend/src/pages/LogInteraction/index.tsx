import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setDraft } from '../../features/interaction/interactionSlice';
import InteractionForm from '../../components/forms/InteractionForm';
import ChatPanel from '../../components/chat/ChatPanel';

const LogInteraction: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentDraft } = useAppSelector(state => state.interaction);

  useEffect(() => {
    if (!currentDraft) {
      const newId = crypto.randomUUID();
      const newDraft = {
          id: newId,
          hcp_id: null,
          status: 'DRAFT',
          interaction_type: null,
          date: null,
          time: null,
          attendees: "",
          topics_discussed: "",
          materials_shared: "",
          samples_distributed: "",
          sentiment: null,
          outcomes: "",
          follow_up_actions: ""
      };
      dispatch(setDraft(newDraft as any));
    }
  }, [currentDraft, dispatch]);

  if (!currentDraft) {
    return <div className="p-8 text-center text-muted-foreground">Initializing form...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Log HCP Interaction</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 w-full">
        {/* Left Panel: Form */}
        <div className="flex-1 min-w-0 bg-card text-card-foreground shadow-sm rounded-xl border">
          <InteractionForm />
        </div>

        {/* Right Panel: Chat */}
        <div className="w-full lg:w-[400px] shrink-0 bg-card text-card-foreground shadow-sm rounded-xl border flex flex-col h-[600px] lg:h-auto">
          <ChatPanel interactionId={currentDraft.id} />
        </div>
      </div>
    </div>
  );
};

export default LogInteraction;
