import React from 'react';
import { StatCard } from './StatCard';

interface StatsGridProps {
  totalHcps: number;
  draftsCount: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ totalHcps, draftsCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <StatCard title="Total HCPs" value={totalHcps} delay={0.15} />
      <StatCard title="Visits Due" value="14" delay={0.2} />
      <StatCard title="Drafts" value={draftsCount} delay={0.25} />
      <StatCard title="Follow-ups" value="18" delay={0.3} />
    </div>
  );
};
