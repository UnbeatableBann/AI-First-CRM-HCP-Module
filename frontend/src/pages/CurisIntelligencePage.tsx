import React, { useEffect, useState } from 'react';
import api from '../services/api/axios';
import CurisIntelligenceTab from '../components/intelligence/CurisIntelligenceTab';
import { ChevronDown, User } from 'lucide-react';

const CurisIntelligencePage: React.FC = () => {
  const [hcps, setHcps] = useState<any[]>([]);
  const [selectedHcpId, setSelectedHcpId] = useState<string | null>(null);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchHcps = async () => {
      try {
        const [hcpRes, intRes] = await Promise.all([
          api.get('/hcp/'),
          api.get('/interaction/home')
        ]);
        const hcpsData = hcpRes.data.data || [];
        const intsData = intRes.data.data?.saved_hcps || [];
        
        // Sort by latest interaction
        const sortedHcps = [...hcpsData].sort((a: any, b: any) => {
          const aInt = intsData.find((i: any) => i.hcp_id === a.id);
          const bInt = intsData.find((i: any) => i.hcp_id === b.id);
          const aDate = aInt?.latest_interaction ? new Date(aInt.latest_interaction).getTime() : 0;
          const bDate = bInt?.latest_interaction ? new Date(bInt.latest_interaction).getTime() : 0;
          return bDate - aDate;
        });

        setHcps(sortedHcps);
        if (sortedHcps.length > 0) {
          setSelectedHcpId(sortedHcps[0].id);
        }
      } catch (err) {
        console.error('Error fetching HCPs:', err);
      } finally {
        
      }
    };
    fetchHcps();
  }, []);

  const selectedHcp = hcps.find(h => h.id === selectedHcpId);

  return (
    <div className="flex-1 bg-background p-4 md:p-8 animate-fade-in">
      <div className="max-w-[1440px] mx-auto space-y-6">
        
        {/* HCP Selector Header */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-surface hover:bg-surface-secondary px-5 py-3 rounded-[16px] border border-border shadow-minimal transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-surface-secondary border-2 border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
                {selectedHcp ? (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedHcp.name)}&background=random&color=fff&size=128`} alt={selectedHcp.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-muted" />
                )}
              </div>
              <div className="text-left">
                <div className="text-[12px] font-medium text-muted uppercase tracking-wider mb-0.5">Selected HCP Profile</div>
                <div className="text-[15px] font-medium text-foreground flex items-center gap-2">
                  {selectedHcp ? selectedHcp.name : 'Select an HCP'}
                  <ChevronDown className="w-4 h-4 text-muted" />
                </div>
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-surface border border-border shadow-minimal rounded-[16px] z-50 p-2">
                {hcps.map((hcp) => (
                  <button
                    key={hcp.id}
                    onClick={() => {
                      setSelectedHcpId(hcp.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-[12px] flex items-center gap-3 transition-colors ${
                      selectedHcpId === hcp.id ? 'bg-primary/5 text-primary' : 'hover:bg-surface-secondary text-foreground'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-surface-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(hcp.name)}&background=random&color=fff&size=128`} alt={hcp.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[14px] font-medium">{hcp.name}</div>
                      <div className="text-[12px] text-muted">{hcp.specialization || 'Specialist'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Content */}
        {selectedHcpId ? (
          <CurisIntelligenceTab hcpId={selectedHcpId} />
        ) : (
          <div className="flex items-center justify-center h-64 bg-surface rounded-[24px] border border-border">
            <div className="text-center">
              <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border overflow-hidden">
                <User className="w-8 h-8 text-muted" />
              </div>
              <p className="text-[15px] font-medium text-foreground">Select an HCP to view Intelligence</p>
              <p className="text-[13px] text-muted mt-1">Choose a profile from the dropdown above</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CurisIntelligencePage;
