import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';

const PlaybookItem = ({ label, item }: { label: string, item: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!item) return null;

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</h4>
          <p className="text-sm font-medium text-gray-900">{item.value}</p>
        </div>
        <div className="flex items-center gap-2">
          {item.confidence > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${item.confidence > 0.7 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
              {Math.round(item.confidence * 100)}% Conf
            </span>
          )}
          {item.evidence_count !== undefined && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 px-2 py-0.5 rounded"
            >
              <LinkIcon className="w-3 h-3" />
              {item.evidence_count} Evid
              {expanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </button>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 border border-gray-100">
          <p className="font-medium text-gray-800 mb-1">Supporting Evidence:</p>
          <ul className="list-disc pl-4 space-y-1">
            {item.evidence?.excerpts?.map((exc: string, idx: number) => (
              <li key={idx} className="italic">"{exc}"</li>
            )) || <li>Interaction transcript derived observation</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

const PlaybookCard = ({ playbook }: { playbook: any }) => {
  if (!playbook) return null;
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">HCP Playbook</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
        <div>
          <PlaybookItem label="Best Approach" item={playbook.best_approach} />
          <PlaybookItem label="Ideal Style" item={playbook.ideal_conversation_style} />
          <PlaybookItem label="Best Opening" item={playbook.best_opening} />
          <PlaybookItem label="Scientific Depth" item={playbook.recommended_scientific_depth} />
        </div>
        <div>
          <PlaybookItem label="Meeting Duration" item={playbook.typical_meeting_duration} />
          <PlaybookItem label="Communication Preference" item={playbook.communication_preference} />
          
          {playbook.topics_to_avoid?.length > 0 && (
            <div className="py-3 border-b border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Topics to Avoid</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {playbook.topics_to_avoid.map((t: any, i: number) => (
                  <span key={i} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded border border-red-100">{t.value}</span>
                ))}
              </div>
            </div>
          )}
          
          {playbook.reminders?.length > 0 && (
            <div className="py-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Rep Reminders</h4>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                {playbook.reminders.map((r: any, i: number) => (
                  <li key={i} className="text-sm text-gray-800">{r.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaybookCard;
