import React from 'react';
import { motion } from 'framer-motion';

export const ActivityTimeline: React.FC = () => {
  const activities = [
    { day: "Today", title: "Met Dr. Sharma", desc: "Positive outcome, waiting for literature", time: "10:30 AM" },
    { day: "Yesterday", title: "Meeting completed", desc: "Dr. Amit Patel", time: "02:15 PM" },
    { day: "Monday", title: "Created Draft", desc: "Dr. Sneha Rao", time: "09:00 AM" },
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: 0.4 }}>
      <h2 className="text-[20px] font-medium text-[#111827] mb-5">Recent Activity</h2>
      <div className="bg-white border border-[#ECEEF2] rounded-[18px] p-6">
        <div className="space-y-6">
          {activities.map((act, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[#2563EB]"></div>
              {i !== activities.length - 1 && <div className="absolute left-[3px] top-4 w-px h-full bg-[#ECEEF2]"></div>}
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[14px] font-medium text-[#111827]">{act.title}</h4>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">{act.desc}</p>
                </div>
                <div className="text-right">
                  <span className="block text-[12px] font-medium text-[#111827]">{act.day}</span>
                  <span className="block text-[12px] text-[#6B7280]">{act.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
