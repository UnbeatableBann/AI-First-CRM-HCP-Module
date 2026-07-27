import React from 'react';
import { motion } from 'framer-motion';

export const AISuggestionCard: React.FC<{ title: string; desc: string; isAlert?: boolean }> = ({ title, desc, isAlert }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="flex gap-3 items-start bg-white border border-[#ECEEF2] rounded-[12px] p-4">
    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${isAlert ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'}`}></div>
    <div>
      <h4 className="text-[14px] font-medium text-[#111827]">{title}</h4>
      <p className="text-[12px] text-[#6B7280] mt-1">{desc}</p>
    </div>
  </motion.div>
);
