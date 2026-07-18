import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { addMessage, setStreaming } from '../../features/ai/chatSlice';
import { setDraft, setCurrentHcpName } from '../../features/interaction/interactionSlice';
import { agentApi } from '../../services/api/agentApi';
import toast from 'react-hot-toast';

interface ChatPanelProps {
  interactionId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ interactionId }) => {
  const dispatch = useAppDispatch();
  const { messages, streaming } = useAppSelector(state => state.chat);
  const currentDraft = useAppSelector(state => state.interaction.currentDraft);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;

    const userMessage = input.trim();
    setInput('');
    dispatch(addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }));
    
    dispatch(setStreaming(true));

    try {
      const { assistant_response, interaction: updatedDraft, current_hcp_name } = await agentApi.sendMessage(interactionId, userMessage, currentDraft);
      
      // Auto-update form side
      dispatch(setDraft(updatedDraft));
      if (current_hcp_name) {
        dispatch(setCurrentHcpName(current_hcp_name));
      }

      dispatch(addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistant_response,
        timestamp: new Date().toISOString()
      }));
    } catch {
      toast.error("Failed to process message.");
      dispatch(addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString()
      }));
    } finally {
      dispatch(setStreaming(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl">
      <div className="p-4 border-b flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Log interaction via chat</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-muted p-3 rounded-lg text-sm rounded-tl-none inline-block max-w-[85%] border shadow-sm">
          Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.
        </div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg text-sm max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted border rounded-tl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex justify-start">
            <div className="bg-muted border p-3 rounded-lg text-sm rounded-tl-none inline-flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t bg-card rounded-b-xl flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe interaction..."
          className="flex-1 min-h-[40px] max-h-32 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || streaming}
          className="bg-primary/80 hover:bg-primary text-primary-foreground h-10 px-4 rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 shadow-sm"
        >
          <span className="mr-2">Log</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
