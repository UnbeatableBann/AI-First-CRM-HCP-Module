import React from 'react';
import { motion } from 'framer-motion';

type StatusType = 'overdue' | 'today' | 'upcoming';

export const FollowUpCard: React.FC<{ title: string; details: string; status: string; statusType?: StatusType }> = ({ title, details, status, statusType = 'upcoming' }) => {
  const colors = {
    overdue: 'text-[#EF4444] bg-[#EF4444]/10',
    today: 'text-[#F59E0B] bg-[#F59E0B]/10',
    upcoming: 'text-[#16A34A] bg-[#16A34A]/10',
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white border border-[#ECEEF2] rounded-[12px] p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[14px] font-medium text-[#111827] pr-2">{title}</h4>
        <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${colors[statusType]}`}>
          {status}
        </span>
      </div>
      <p className="text-[12px] text-[#6B7280]">{details}</p>
      <button className="mt-3 text-[12px] font-medium text-[#2563EB] hover:underline">Open</button>
    </motion.div>
  );
};
