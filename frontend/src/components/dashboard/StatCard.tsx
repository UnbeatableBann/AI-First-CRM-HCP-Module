import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-[#ECEEF2] rounded-[18px] p-6 flex flex-col justify-center"
    >
      <span className="text-[14px] text-[#6B7280] font-medium mb-2">{title}</span>
      <span className="text-[32px] font-bold text-[#111827] leading-none">{value}</span>
    </motion.div>
  );
};
