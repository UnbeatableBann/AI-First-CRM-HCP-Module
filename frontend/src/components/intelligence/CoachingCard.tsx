import React from 'react';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';

const CoachingSection = ({ title, items, isPositive }: { title: string, items: string[], isPositive: boolean }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
            {isPositive ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CoachingCard = ({ coaching }: { coaching: any }) => {
  if (!coaching) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Representative Coaching</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        <CoachingSection title="Suggestions for Next Meeting" items={coaching.next_meeting_suggestions} isPositive={true} />
        <CoachingSection title="Conversation Improvements" items={coaching.conversation_improvements} isPositive={false} />
        <CoachingSection title="Unanswered Questions" items={coaching.unanswered_questions} isPositive={false} />
        <CoachingSection title="Missed Commitments" items={coaching.missed_commitments} isPositive={false} />
        <CoachingSection title="Your Strengths" items={coaching.rep_strengths} isPositive={true} />
      </div>
    </div>
  );
};

export default CoachingCard;
