import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SavedHCP {
  hcp_id: string;
  hcp_name: string;
  interaction_count: number;
  latest_interaction: string | null;
}

export const HCPGrid: React.FC<{ hcps: SavedHCP[], onOpenWorkspace: (id: string) => void }> = ({ hcps, onOpenWorkspace }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredHcps = hcps.filter(hcp => {
    if (!hcp.hcp_name) return false;
    return hcp.hcp_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: 0.45 }}>
      <h2 className="text-[20px] font-medium text-[#111827] mb-5">HCP Directory</h2>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex gap-2 bg-[#ECEEF2]/50 p-1 rounded-[12px]">
          {['All', 'Recent', 'Favorites'].map(f => (
            <button 
              key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[12px] font-medium rounded-[8px] transition-colors ${filter === f ? 'bg-white shadow-sm text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directory..." 
            className="w-full sm:w-[240px] h-9 pl-9 pr-4 bg-white border border-[#ECEEF2] rounded-[12px] text-[14px] focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredHcps.slice(0, 4).map((hcp) => (
          <motion.div 
            key={hcp.hcp_id}
            whileHover={{ scale: 1.02 }}
            className="bg-white border border-[#ECEEF2] rounded-[18px] p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-[16px] font-medium text-[#111827] truncate">{hcp.hcp_name}</h3>
              <p className="text-[14px] text-[#6B7280] mt-1">Healthcare Professional</p>
            </div>
            
            <div className="flex justify-between items-end mt-6 pt-4 border-t border-[#ECEEF2]">
              <div>
                <span className="block text-[12px] text-[#6B7280]">{hcp.interaction_count} interactions</span>
                <span className="block text-[12px] text-[#6B7280]">Last Visit: {hcp.latest_interaction ? new Date(hcp.latest_interaction).toLocaleDateString() : 'N/A'}</span>
              </div>
              <button 
                onClick={() => onOpenWorkspace(hcp.hcp_id)}
                className="text-[14px] font-medium text-[#2563EB] hover:underline"
              >
                Open Workspace
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
