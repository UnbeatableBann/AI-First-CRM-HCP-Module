import React from 'react';
import { History, GitCommit } from 'lucide-react';

const KnowledgeEvolutionTimeline = ({ timeline }: { timeline: any[] }) => {
  if (!timeline || timeline.length === 0) return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Knowledge Evolution</h3>
      </div>
      <p className="text-sm text-gray-500 italic text-center py-4">No significant knowledge evolution recorded yet.</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Knowledge Evolution</h3>
      </div>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {timeline.map((event, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <GitCommit className="w-4 h-4" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{event.action}</span>
                <span className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-800 font-medium mb-2">{event.description}</p>
              
              {(event.previous_value || event.new_value) && (
                <div className="bg-gray-50 rounded p-2 text-xs text-gray-600 mt-2 flex flex-col gap-1">
                  {event.previous_value && <div><span className="line-through text-gray-400 mr-2">{event.previous_value}</span></div>}
                  {event.new_value && <div className="text-green-600 font-medium">+ {event.new_value}</div>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeEvolutionTimeline;
