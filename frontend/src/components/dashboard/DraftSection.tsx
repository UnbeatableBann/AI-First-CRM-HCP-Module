import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2 } from 'lucide-react';

interface Draft {
  id: string;
  hcp_name: string | null;
  updated_at: string;
}

interface DraftSectionProps {
  drafts: Draft[];
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DraftSection: React.FC<DraftSectionProps> = ({ drafts, onResume, onDelete }) => {
  const displayDrafts = drafts.slice(0, 4);

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: 0.35 }}>
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-[20px] font-medium text-[#111827]">Draft Interactions</h2>
        <button className="text-[14px] text-[#2563EB] hover:underline font-medium">View All</button>
      </div>
      
      {drafts.length === 0 ? (
        <div className="text-[14px] text-[#6B7280] bg-white border border-[#ECEEF2] p-6 rounded-[18px] text-center">
          No drafts pending. You're all caught up!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayDrafts.map((draft, i) => (
            <motion.div 
              key={draft.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-[#ECEEF2] rounded-[18px] p-6 relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[16px] font-medium text-[#111827] truncate pr-4">{draft.hcp_name || 'Meeting with Unknown'}</h3>
                  <p className="text-[12px] text-[#6B7280] mt-1">{new Date(draft.updated_at).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(draft.id); }}
                  className="text-[#6B7280] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[12px] font-medium text-[#6B7280]">
                  <span>Progress</span>
                  <span>35% Complete</span>
                </div>
                <div className="w-full bg-[#ECEEF2] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2563EB] h-full w-[35%] rounded-full"></div>
                </div>
              </div>
              
              <button 
                onClick={() => onResume(draft.id)}
                className="mt-5 w-full flex items-center justify-center gap-2 h-9 border border-[#ECEEF2] text-[#111827] hover:bg-[#FAFBFC] rounded-[12px] text-[14px] font-medium transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};
