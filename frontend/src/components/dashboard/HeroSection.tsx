import React from 'react';
import { motion } from 'framer-motion';
import { Play, FolderOpen, Star } from 'lucide-react';

export const HeroSection: React.FC<{ onResume?: () => void }> = ({ onResume }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: 0.05 }}
      className="w-full min-h-[180px] bg-white border border-[#ECEEF2] rounded-[18px] p-6 flex flex-col md:flex-row justify-between gap-6 overflow-hidden relative"
    >
      <div className="flex-1 z-10 flex flex-col justify-center">
        <h2 className="text-[14px] text-[#6B7280] font-medium tracking-wide uppercase mb-1">Today's Priority</h2>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-[32px] font-bold text-[#111827] leading-none">Dr. Rahul Sharma</h3>
          <div className="flex text-[#F59E0B]">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <span className="text-[12px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full ml-2">High Opportunity</span>
        </div>
        
        <ul className="text-[14px] text-[#6B7280] space-y-1.5 mt-4">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"></div>Last Visit : 15 days ago</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"></div>Waiting for Clinical Literature</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>Positive Sentiment</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 justify-center z-10 min-w-[200px]">
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onResume}
          className="flex items-center justify-center gap-2 w-full h-10 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-[14px] font-medium rounded-[12px] transition-colors"
        >
          <Play className="w-4 h-4" />
          Resume Interaction
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full h-10 bg-transparent border border-[#ECEEF2] text-[#111827] hover:bg-[#FAFBFC] text-[14px] font-medium rounded-[12px] transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
          Open Workspace
        </motion.button>
      </div>
      
      {/* Subtle decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2563EB]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
    </motion.div>
  );
};
