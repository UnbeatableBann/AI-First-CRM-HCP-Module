import React from 'react';
import { RefreshCw, FileText, ExternalLink, CalendarDays } from 'lucide-react';

interface IntelligenceHeaderProps {
  header: {
    hcp_name: string;
    specialization: string;
    hospital: string;
    last_updated: string;
    digital_twin_version: string;
    knowledge_confidence: number;
    interaction_count: number;
  }
}

const IntelligenceHeader: React.FC<IntelligenceHeaderProps> = ({ header }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{header.hcp_name}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1 gap-3">
          <span>{header.specialization}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{header.hospital}</span>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
          <RefreshCw className="w-4 h-4" />
          Refresh Intelligence
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
          <FileText className="w-4 h-4" />
          Meeting Brief
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-200">
          <CalendarDays className="w-4 h-4" />
          Timeline
        </button>
      </div>
    </div>
  );
};

export default IntelligenceHeader;
