import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardHeader: React.FC = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-between h-[80px] w-full"
    >
      <div className="flex flex-col">
        <h1 className="text-[32px] font-bold text-[#111827] leading-tight">Today's Workspace</h1>
        <p className="text-[14px] text-[#6B7280]">AI has prepared today's priorities based on your HCP interactions.</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input 
            type="text" 
            placeholder="Search doctors, interactions, products..." 
            className="w-[400px] h-10 pl-10 pr-16 bg-white border border-[#ECEEF2] rounded-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-60">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280] bg-[#FAFBFC] border border-[#ECEEF2] rounded">⌘</kbd>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#6B7280] bg-[#FAFBFC] border border-[#ECEEF2] rounded">K</kbd>
          </div>
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
