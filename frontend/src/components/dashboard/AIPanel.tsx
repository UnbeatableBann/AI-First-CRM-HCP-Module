import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AISuggestionCard } from './AISuggestionCard';
import { FollowUpCard } from './FollowUpCard';
import { MemoryCard } from './MemoryCard';

export const AIPanel: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15, delay: 0.5 }}
      className="sticky top-[32px] w-full flex flex-col gap-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-[16px] font-medium text-[#111827]">AI Suggestions</h3>
        </div>
        <div className="space-y-3">
          <AISuggestionCard title="Follow up with Dr. Amit Patel" desc="Requested latest clinical trial data for new diabetes drug." isAlert={true} />
          <AISuggestionCard title="Dr. Sneha requested brochure" desc="Needs physical copies delivered to her clinic." />
          <AISuggestionCard title="Pending completion" desc="Three interactions from last week are pending completion." />
        </div>
      </div>

      <div>
        <h3 className="text-[16px] font-medium text-[#111827] mb-4">Follow-ups Due</h3>
        <div className="space-y-3">
          <FollowUpCard title="Send Literature" details="Dr. Smith • Discussed yesterday" status="3 days overdue" />
          <FollowUpCard title="Sample Request" details="Dr. Sharma • Requested 2 weeks ago" status="Due Today" />
        </div>
      </div>

      <div>
        <h3 className="text-[16px] font-medium text-[#111827] mb-4">Recent Memory Updates</h3>
        <div className="space-y-3">
          <MemoryCard title="Dr. Rahul Sharma" content="Prefers digital literature over physical copies. Expressed interest in pediatric indications." />
          <MemoryCard title="Products Discussed" content="CurisMab was mentioned frequently in the last 5 interactions as a positive alternative." />
        </div>
      </div>
    </motion.div>
  );
};
