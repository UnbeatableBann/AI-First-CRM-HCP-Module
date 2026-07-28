import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setDraft } from '../../features/interaction/interactionSlice';
import InteractionForm from '../../components/forms/InteractionForm';
import ChatPanel from '../../components/chat/ChatPanel';
import api from '../../services/api/axios';
import { ArrowLeft, Trash2 } from 'lucide-react';

const LogInteraction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentDraft } = useAppSelector(state => state.interaction);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteraction = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/interaction/${id}`);
        dispatch(setDraft(res.data.data));
        // If there's an HCP associated, we might not get the name directly from this endpoint
        // unless it's eager loaded, but for now just clear the currentHcpName if we don't have it.
        // If the backend doesn't return hcp_name here, the AI will still work correctly.
      } catch (error) {
        console.error('Failed to load interaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteraction();
  }, [id, dispatch]);

  if (loading || !currentDraft) {
    return <div className="p-8 text-center text-muted-foreground">Loading interaction...</div>;
  }

  const isCompleted = currentDraft.status === 'COMPLETED';

  const handleDeleteDraft = async () => {
    if (!window.confirm("Are you sure you want to delete this draft interaction?")) return;
    try {
      setLoading(true);
      await api.delete(`/interaction/${id}`);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete draft:', error);
      alert('Failed to delete draft.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            {isCompleted ? 'View Interaction' : 'Log HCP Interaction'}
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            {isCompleted && <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Completed</span>}
            {currentDraft.hcp_id && (
              <button 
                onClick={() => navigate(`/hcp/${currentDraft.hcp_id}`)}
                className="text-sm text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
              >
                Open HCP Workspace &rarr;
              </button>
            )}
            {!isCompleted && (
              <button 
                onClick={handleDeleteDraft}
                className="text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Draft
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 w-full">
        {/* Left Panel: Form */}
        <div className={`flex-1 min-w-0 bg-card text-card-foreground shadow-sm rounded-xl border ${isCompleted ? 'opacity-80 pointer-events-none' : ''}`}>
          <InteractionForm />
        </div>

        {/* Right Panel: Chat */}
        {!isCompleted && (
          <div className="w-full lg:w-[400px] shrink-0 bg-card text-card-foreground shadow-sm rounded-xl border flex flex-col h-[600px] lg:h-auto">
            <ChatPanel interactionId={currentDraft.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LogInteraction;
