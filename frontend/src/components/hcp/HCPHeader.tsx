import React from 'react';
import { HCPProfile, HCPOverview } from '../../features/hcpWorkspace/hcpWorkspaceSlice';
import RelationshipBadge from './RelationshipBadge';

interface HCPHeaderProps {
  profile: HCPProfile;
  overview: HCPOverview;
}

const HCPHeader: React.FC<HCPHeaderProps> = ({ profile, overview }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
        <p className="text-gray-600 text-lg mt-1">{profile.specialization} • {profile.hospital}</p>
        <p className="text-gray-500 text-sm">{profile.city}</p>
      </div>
      <div className="mt-4 md:mt-0 flex flex-col items-end">
        <RelationshipBadge status="Positive" />
        <p className="text-sm text-gray-500 mt-2">Last Visit: <span className="font-semibold text-gray-800">{overview.last_visit || 'Never'}</span></p>
        <p className="text-sm text-gray-500 mt-1">Next Follow-up: <span className="font-semibold text-blue-600">{overview.next_follow_up || 'None Scheduled'}</span></p>
      </div>
    </div>
  );
};

export default HCPHeader;
