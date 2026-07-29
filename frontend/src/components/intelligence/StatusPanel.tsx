import React from 'react';
import { ShieldCheck, Clock, CheckCircle2, Activity } from 'lucide-react';

const StatusPanel = ({ header }: { header: any }) => {
  if (!header) return null;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Intelligence Status</h4>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase">AI Confidence</span>
            <span className="block text-sm font-medium text-gray-900">{Math.round(header.knowledge_confidence * 100)}% Evidence Backed</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase">Evidence Health</span>
            <span className="block text-sm font-medium text-gray-900">{header.interaction_count} Interactions analyzed</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-orange-500 shrink-0" />
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase">Knowledge Freshness</span>
            <span className="block text-sm font-medium text-gray-900">
              {new Date(header.last_updated).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" />
          <div>
            <span className="block text-xs font-medium text-gray-500 uppercase">Twin Version</span>
            <span className="block text-xs font-mono text-gray-600 bg-gray-50 px-1 py-0.5 rounded mt-0.5">
              v{header.digital_twin_version.substring(0,8)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <span className="block text-xs text-gray-400 text-center">Curis Intelligence Engine Active</span>
      </div>
    </div>
  );
};

export default StatusPanel;
