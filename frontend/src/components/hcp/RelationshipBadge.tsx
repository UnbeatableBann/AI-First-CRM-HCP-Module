import React from 'react';

interface RelationshipBadgeProps {
  status: string | null;
}

const getStatusColor = (status: string | null) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  const lower = status.toLowerCase();
  if (lower.includes('positive') || lower.includes('strong')) return 'bg-green-100 text-green-800';
  if (lower.includes('negative') || lower.includes('weak')) return 'bg-red-100 text-red-800';
  return 'bg-blue-100 text-blue-800';
};

const RelationshipBadge: React.FC<RelationshipBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
      {status || 'Neutral'}
    </span>
  );
};

export default RelationshipBadge;
