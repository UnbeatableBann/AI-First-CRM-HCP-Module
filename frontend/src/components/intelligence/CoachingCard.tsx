import { Target, CheckCircle2, AlertCircle } from 'lucide-react';

const CoachingSection = ({ title, items, isPositive }: { title: string, items: string[], isPositive: boolean }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-[11px] font-medium text-foreground-secondary uppercase tracking-wider mb-3 px-1">{title}</h4>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 bg-surface-secondary/50 p-4 rounded-[12px] border border-border">
            {isPositive ? (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-warning shrink-0" />
            )}
            <span className="text-[14px] text-foreground font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CoachingCard = ({ coaching }: { coaching: any }) => {
  if (!coaching) return null;

  return (
    <div className="bg-surface p-8 rounded-[24px] border border-border shadow-minimal flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-[18px] font-medium text-foreground">Representative Coaching</h3>
          <p className="text-[13px] text-foreground-secondary">Personalized guidance to improve HCP engagement</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <CoachingSection title="Suggestions for Next Meeting" items={coaching.next_meeting_suggestions} isPositive={true} />
          <CoachingSection title="Your Strengths" items={coaching.rep_strengths} isPositive={true} />
        </div>
        <div>
          <CoachingSection title="Conversation Improvements" items={coaching.conversation_improvements} isPositive={false} />
          <CoachingSection title="Unanswered Questions" items={coaching.unanswered_questions} isPositive={false} />
          <CoachingSection title="Missed Commitments" items={coaching.missed_commitments} isPositive={false} />
        </div>
      </div>
    </div>
  );
};

export default CoachingCard;
