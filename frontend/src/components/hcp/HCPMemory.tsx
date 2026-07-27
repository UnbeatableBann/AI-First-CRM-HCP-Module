import React from 'react';
import { HCPMemory as HCPMemoryType } from '../../features/hcpWorkspace/hcpWorkspaceSlice';

interface HCPMemoryProps {
  memory: HCPMemoryType;
}

const HCPMemory: React.FC<HCPMemoryProps> = ({ memory }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">AI Extracted Memory</h3>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">Auto-updated</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-gray-700 border-b pb-2 mb-3">Communication & Preferences</h4>
          <div className="space-y-4">
            <div>
              <span className="block text-sm text-gray-500 font-medium mb-1">Communication Style</span>
              <p className="text-gray-900">{memory.communication_style || 'Not established'}</p>
            </div>
            <div>
              <span className="block text-sm text-gray-500 font-medium mb-1">Preferred Meeting Time</span>
              <p className="text-gray-900">{memory.preferred_meeting_time || 'Not established'}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 border-b pb-2 mb-3">Clinical Profile</h4>
          <div className="space-y-4">
            <div>
              <span className="block text-sm text-gray-500 font-medium mb-1">Clinical Interests</span>
              <ul className="list-disc pl-5 text-gray-900">
                {memory.clinical_interests.length > 0 ? memory.clinical_interests.map((item, idx) => <li key={idx}>{item}</li>) : <li className="text-gray-500 italic">None</li>}
              </ul>
            </div>
            <div>
              <span className="block text-sm text-gray-500 font-medium mb-1">Preferred Products</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {memory.preferred_products.length > 0 ? memory.preferred_products.map((item, idx) => (
                  <span key={idx} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">{item}</span>
                )) : <span className="text-gray-500 italic">None</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-semibold text-gray-700 border-b pb-2 mb-3">Engagement Strategy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="block text-sm text-gray-500 font-medium mb-1">Common Objections</span>
              <ul className="list-disc pl-5 text-gray-900">
                {memory.common_objections.length > 0 ? memory.common_objections.map((item, idx) => <li key={idx}>{item}</li>) : <li className="text-gray-500 italic">None recorded</li>}
              </ul>
            </div>
            <div>
              <span className="block text-sm text-gray-500 font-medium mb-1">Favorite Materials</span>
              <ul className="list-disc pl-5 text-gray-900">
                {memory.favorite_materials.length > 0 ? memory.favorite_materials.map((item, idx) => <li key={idx}>{item}</li>) : <li className="text-gray-500 italic">None recorded</li>}
              </ul>
            </div>
          </div>
          <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-100">
            <span className="block text-sm text-gray-500 font-medium mb-1">General Notes</span>
            <p className="text-gray-800 text-sm whitespace-pre-wrap">{memory.notes || 'No general notes.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HCPMemory;
