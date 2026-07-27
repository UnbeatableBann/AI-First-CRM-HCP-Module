import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Sparkles, Download } from 'lucide-react';

export const QuickActions: React.FC<{ onNewInteraction: () => void }> = ({ onNewInteraction }) => {
  const actions = [
    { icon: <Plus className="w-6 h-6" />, title: "New Interaction", desc: "Start drafting", onClick: onNewInteraction, color: "text-[#2563EB]", bg: "bg-[#2563EB]/10" },
    { icon: <Search className="w-6 h-6" />, title: "Search HCP", desc: "View directories", onClick: () => {}, color: "text-[#16A34A]", bg: "bg-[#16A34A]/10" },
    { icon: <Sparkles className="w-6 h-6" />, title: "AI Assistant", desc: "Get insights", onClick: () => {}, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    { icon: <Download className="w-6 h-6" />, title: "Import HCP", desc: "Upload CSV", onClick: () => {}, color: "text-[#6B7280]", bg: "bg-[#F3F4F6]" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-5"
    >
      {actions.map((act, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={act.onClick}
          className="flex flex-col items-start justify-center h-[120px] bg-white border border-[#ECEEF2] rounded-[18px] p-5 hover:border-[#2563EB]/30 hover:shadow-sm transition-all text-left"
        >
          <div className={`p-2 rounded-[10px] ${act.bg} ${act.color} mb-3`}>
            {act.icon}
          </div>
          <span className="text-[14px] font-medium text-[#111827]">{act.title}</span>
          <span className="text-[12px] text-[#6B7280]">{act.desc}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};
