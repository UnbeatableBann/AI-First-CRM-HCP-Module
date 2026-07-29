import React, { useState } from 'react';
import { Search, Shield, Clock, Link as LinkIcon, Network } from 'lucide-react';

interface HCPKnowledgeTabProps {
  hcpId: string;
}

// Temporary Mock Data for Knowledge
const KNOWLEDGE = {
  metadata: {
    version: "v14",
    lastUpdated: "2 hours ago",
    evidenceSources: 18,
    confirmedFacts: 42,
    needsConfirmation: 4,
    potentialConflicts: 1,
    confidence: "High",
    summary: "Dr. Rahul Sharma is a cardiologist with a growing interest in obesity and cardiovascular outcome studies. He consistently prefers concise scientific discussions, requests digital literature, and has responded positively to recent efficacy data. Two commitments remain open."
  },
  relationship: {
    trend: "Improving",
    interactionFrequency: 18,
    lastVisit: "Yesterday",
    averageMeeting: "18 min",
    positiveSignals: ["Requested follow-up", "Discussed new indication", "Asked technical questions"],
    negativeSignals: ["One overdue commitment"]
  },
  communication: [
    { key: "Preferred Time", value: "Morning", evidence: ["Interaction #18", "Interaction #24"], lastConfirmed: "July 2026" },
    { key: "Preferred Format", value: "Digital Literature", evidence: ["Interaction #22"], lastConfirmed: "June 2026" },
    { key: "Meeting Style", value: "Short", evidence: ["Interaction #14", "Interaction #18"], lastConfirmed: "May 2026" },
    { key: "Scientific Depth", value: "High", evidence: ["Interaction #24"], lastConfirmed: "July 2026" }
  ],
  clinicalInterests: [
    { topic: "Obesity", mentions: 7, trend: "up", evidence: ["#11", "#18", "#24", "#29"] },
    { topic: "Cardiovascular Outcomes", mentions: 5, trend: "flat", evidence: ["#14", "#22"] },
    { topic: "Heart Failure", mentions: 3, trend: "down", evidence: ["#8"] },
    { topic: "Renal Outcomes", mentions: 2, trend: "up", evidence: ["#29"] }
  ],
  commercial: {
    products: [{ name: "CurisMab", mentions: 8 }, { name: "CardioX", mentions: 4 }],
    competitors: [{ name: "Ozempic", mentions: 6 }, { name: "Mounjaro", mentions: 5 }],
    requested: ["Samples", "Digital Literature", "Clinical Studies"]
  },
  behavioral: [
    { key: "Decision Style", value: "Evidence-driven" },
    { key: "Questions", value: "Frequently asks about efficacy" },
    { key: "Typical Objection", value: "Long-term safety" },
    { key: "Follow-up Reliability", value: "High" },
    { key: "Response Time", value: "Fast" }
  ],
  commitments: {
    outstanding: [
      { text: "Share obesity publication", due: "Tomorrow" },
      { text: "Deliver brochure", due: "Pending" }
    ],
    completed: [
      { text: "Send renal paper", status: "Completed" }
    ]
  },
  timeline: [
    { date: "Today", action: "AI learned", text: "Doctor now prefers digital brochures.", evidence: "Interaction #29" },
    { date: "Yesterday", action: "Clinical Interest", text: "Obesity now trending.", evidence: "Interaction #28" },
    { date: "Monday", action: "Behavior", text: "Asked for efficacy evidence.", evidence: "Interaction #27" }
  ]
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; icon: React.ElementType }> = ({ title, subtitle, icon: Icon }) => (
  <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-2">
    <Icon className="w-5 h-5 text-blue-600" />
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

const HCPKnowledgeTab: React.FC<HCPKnowledgeTabProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Knowledge (e.g. 'obesity', 'preferences')"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <span className="flex items-center"><Shield className="w-4 h-4 mr-1 text-green-600" /> Version {KNOWLEDGE.metadata.version}</span>
          <span>Updated {KNOWLEDGE.metadata.lastUpdated}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Overview & Relationship) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overview Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <SectionHeader title="Knowledge Overview" icon={Shield} subtitle="AI Executive Summary" />
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-xs text-green-700 uppercase font-semibold">Confidence</p>
                <p className="text-xl font-bold text-green-800">{KNOWLEDGE.metadata.confidence}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 uppercase font-semibold">Evidence</p>
                <p className="text-xl font-bold text-blue-800">{KNOWLEDGE.metadata.evidenceSources} interactions</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-semibold">Confirmed Facts</p>
                <p className="text-xl font-bold text-gray-800">{KNOWLEDGE.metadata.confirmedFacts}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700 uppercase font-semibold">Needs Confirmation</p>
                <p className="text-xl font-bold text-amber-800">{KNOWLEDGE.metadata.needsConfirmation}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed italic border border-gray-100">
              "{KNOWLEDGE.metadata.summary}"
            </div>
          </div>

          {/* Relationship */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <SectionHeader title="Relationship" icon={Network} />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Trend</span>
                <span className="text-green-600 font-medium text-sm flex items-center">
                  ↑ {KNOWLEDGE.relationship.trend}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Interaction Frequency</span>
                <span className="text-gray-900 font-medium text-sm">{KNOWLEDGE.relationship.interactionFrequency}</span>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Positive Signals</p>
                <ul className="space-y-1">
                  {KNOWLEDGE.relationship.positiveSignals.map((sig, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> {sig}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Negative Signals</p>
                <ul className="space-y-1">
                  {KNOWLEDGE.relationship.negativeSignals.map((sig, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span> {sig}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Middle & Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Clinical & Commercial Intel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <SectionHeader title="Clinical Interests" icon={Shield} />
              <div className="space-y-3">
                {KNOWLEDGE.clinicalInterests.map((interest, i) => (
                  <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{interest.topic}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <LinkIcon className="w-3 h-3 mr-1" /> Mentioned {interest.mentions}×
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      interest.trend === 'up' ? 'bg-green-100 text-green-700' :
                      interest.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {interest.trend === 'up' ? '↑' : interest.trend === 'down' ? '↓' : '→'} Trend
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <SectionHeader title="Commercial Intelligence" icon={Shield} />
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Products</p>
                  <div className="flex flex-wrap gap-2">
                    {KNOWLEDGE.commercial.products.map((p, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                        {p.name} ({p.mentions})
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Competitors</p>
                  <div className="flex flex-wrap gap-2">
                    {KNOWLEDGE.commercial.competitors.map((c, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                        {c.name} ({c.mentions})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Communication & Behavior */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <SectionHeader title="Communication & Behavior" icon={Shield} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Insight</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Evidence</th>
                    <th className="px-4 py-3 rounded-tr-lg">Last Confirmed</th>
                  </tr>
                </thead>
                <tbody>
                  {KNOWLEDGE.communication.map((comm, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{comm.key}</td>
                      <td className="px-4 py-3 text-gray-700">{comm.value}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {comm.evidence.map((e, j) => (
                            <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 cursor-pointer hover:bg-blue-100">
                              {e}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{comm.lastConfirmed}</td>
                    </tr>
                  ))}
                  {KNOWLEDGE.behavioral.map((beh, i) => (
                    <tr key={i+100} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{beh.key}</td>
                      <td className="px-4 py-3 text-gray-700">{beh.value}</td>
                      <td className="px-4 py-3 text-gray-400 italic text-xs">AI Inference</td>
                      <td className="px-4 py-3 text-xs text-gray-500">Continuous</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline of Learnings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <SectionHeader title="Timeline of Learnings" subtitle="Knowledge evolution" icon={Clock} />
            <div className="space-y-4">
              {KNOWLEDGE.timeline.map((item, i) => (
                <div key={i} className="flex space-x-4 border-l-2 border-blue-100 pl-4 relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-500">{item.date}</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{item.action}</span>
                    </div>
                    <p className="text-sm text-gray-900 mt-1">{item.text}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <LinkIcon className="w-3 h-3 mr-1" /> Evidence: <span className="ml-1 text-blue-600 hover:underline cursor-pointer">{item.evidence}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HCPKnowledgeTab;
