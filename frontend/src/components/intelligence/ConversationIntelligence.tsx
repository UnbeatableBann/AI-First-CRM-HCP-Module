import React from 'react';
import { MessageSquareText } from 'lucide-react';

const FlowItem = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</h4>
    <p className="text-sm font-medium text-gray-900">{value || 'Not established'}</p>
  </div>
);

const TagList = ({ title, items, colorClass }: { title: string, items: string[], colorClass: string }) => (
  <div className="mb-4 last:mb-0">
    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
    {items?.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className={`text-xs px-2 py-1 rounded border ${colorClass}`}>
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">No patterns detected.</p>
    )}
  </div>
);

const ConversationIntelligence = ({ conversation }: { conversation: any }) => {
  if (!conversation) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquareText className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Conversation Intelligence</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <TagList 
            title="Productive Topics" 
            items={conversation.productive_topics} 
            colorClass="bg-green-50 text-green-700 border-green-100" 
          />
          <TagList 
            title="Typical Objections" 
            items={conversation.typical_objections} 
            colorClass="bg-red-50 text-red-700 border-red-100" 
          />
        </div>
        <div className="space-y-4">
          <TagList 
            title="Frequently Asked Questions" 
            items={conversation.frequent_questions} 
            colorClass="bg-blue-50 text-blue-700 border-blue-100" 
          />
          <TagList 
            title="Topics to Avoid" 
            items={conversation.avoided_topics} 
            colorClass="bg-gray-100 text-gray-700 border-gray-200" 
          />
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FlowItem label="Best Opener" value={conversation.best_opener} />
        <FlowItem label="Preferred Sequence" value={conversation.preferred_sequence} />
        <FlowItem label="Worst Opener" value={conversation.worst_opener} />
      </div>
    </div>
  );
};

export default ConversationIntelligence;
