import React, { useState } from 'react';
import { Search, Bell, User, User as UserIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface DashboardHeaderProps {
  drafts?: Draft[];
  savedHcps?: SavedHCP[];
  onOpenWorkspace?: (id: string) => void;
  onResumeDraft?: (id: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ drafts = [], savedHcps = [], onOpenWorkspace, onResumeDraft }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter actual data based on search query
  const matchingHcps = savedHcps.filter(hcp => 
    hcp.hcp_name && hcp.hcp_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingDrafts = drafts.filter(draft => 
    draft.hcp_name && draft.hcp_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-between h-[80px] w-full relative z-50"
    >
      <div className="flex flex-col">
        <h1 className="text-[32px] font-bold text-[#111827] leading-tight">Today's Workspace</h1>
        <p className="text-[14px] text-[#6B7280]">AI has prepared today's priorities based on your HCP interactions.</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] z-10" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search dashboard..." 
            className="w-[400px] h-10 pl-10 pr-16 bg-white border border-[#ECEEF2] rounded-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
          />
          {!searchQuery && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-60 pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280] bg-[#FAFBFC] border border-[#ECEEF2] rounded">⌘</kbd>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280] bg-[#FAFBFC] border border-[#ECEEF2] rounded">K</kbd>
            </div>
          )}

          {/* Global Search Dropdown */}
          <AnimatePresence>
            {isFocused && searchQuery.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-[calc(100%+8px)] left-0 w-[500px] right-0 bg-white border border-[#ECEEF2] rounded-[16px] shadow-xl overflow-hidden flex flex-col max-h-[400px] overflow-y-auto"
              >
                {matchingHcps.length === 0 && matchingDrafts.length === 0 && (
                  <div className="p-4 text-center text-[#6B7280] text-[14px]">
                    No results found for "{searchQuery}"
                  </div>
                )}

                {matchingHcps.length > 0 && (
                  <>
                    <div className="p-2 border-b border-[#ECEEF2] bg-[#FAFBFC]">
                      <span className="text-[12px] font-medium text-[#6B7280] px-2 uppercase tracking-wider">Doctors</span>
                    </div>
                    {matchingHcps.map(hcp => (
                      <div 
                        key={hcp.hcp_id} 
                        className="p-2 hover:bg-[#FAFBFC] cursor-pointer flex items-center gap-3 transition-colors"
                        onClick={() => {
                          if (onOpenWorkspace) onOpenWorkspace(hcp.hcp_id);
                          setSearchQuery('');
                        }}
                      >
                        <div className="p-2 bg-[#2563EB]/10 rounded-lg text-[#2563EB]"><UserIcon className="w-4 h-4" /></div>
                        <div>
                          <p className="text-[14px] font-medium text-[#111827]">{hcp.hcp_name}</p>
                          <p className="text-[12px] text-[#6B7280]">{hcp.interaction_count} interactions • Last Visit: {hcp.latest_interaction ? new Date(hcp.latest_interaction).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {matchingDrafts.length > 0 && (
                  <>
                    <div className={`p-2 border-b border-[#ECEEF2] bg-[#FAFBFC] ${matchingHcps.length > 0 ? 'border-t' : ''}`}>
                      <span className="text-[12px] font-medium text-[#6B7280] px-2 uppercase tracking-wider">Interactions</span>
                    </div>
                    {matchingDrafts.map(draft => (
                      <div 
                        key={draft.id} 
                        className="p-2 hover:bg-[#FAFBFC] cursor-pointer flex items-center gap-3 transition-colors mb-1"
                        onClick={() => {
                          if (onResumeDraft) onResumeDraft(draft.id);
                          setSearchQuery('');
                        }}
                      >
                        <div className="p-2 bg-[#16A34A]/10 rounded-lg text-[#16A34A]"><FileText className="w-4 h-4" /></div>
                        <div>
                          <p className="text-[14px] font-medium text-[#111827]">Draft: {draft.hcp_name}</p>
                          <p className="text-[12px] text-[#6B7280]">Started {new Date(draft.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button className="relative p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFBFC] rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] overflow-hidden">
          <User className="w-5 h-5" />
        </div>
      </div>
    </motion.header>
  );
};
