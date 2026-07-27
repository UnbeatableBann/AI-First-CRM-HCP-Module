import React from 'react';
import { motion } from 'framer-motion';

export const MemoryCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="bg-[#FAFBFC] border border-[#ECEEF2] rounded-[12px] p-4">
    <h4 className="text-[14px] font-medium text-[#111827] mb-1">{title}</h4>
    <p className="text-[12px] text-[#6B7280] line-clamp-2">{content}</p>
  </motion.div>
);
