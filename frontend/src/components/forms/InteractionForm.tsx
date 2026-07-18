import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mic, Search, Plus, Sparkles } from 'lucide-react';
import { useAppSelector } from '../../hooks/hooks';
import { useDraftAutosave } from '../../hooks/useDraftAutosave';

const formSchema = z.object({
  hcp_id: z.string().nullable(),
  interaction_type: z.string(),
  date: z.string(),
  time: z.string(),
  attendees: z.string().nullable().optional(),
  topics_discussed: z.string().nullable().optional(),
  materials_shared: z.string().nullable().optional(),
  samples_distributed: z.string().nullable().optional(),
  sentiment: z.enum(['Positive', 'Neutral', 'Negative']).nullable(),
  outcomes: z.string(),
  follow_up_actions: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const InteractionForm: React.FC = () => {
  const { currentDraft, currentHcpName } = useAppSelector(state => state.interaction);
  const { handleFieldChange, saveStatus } = useDraftAutosave();

  const { control, reset, getValues, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hcp_id: currentDraft?.hcp_id || '',
      interaction_type: currentDraft?.interaction_type || 'Meeting',
      date: currentDraft?.date || '',
      time: currentDraft?.time || '',
      attendees: (currentDraft?.attendees as any) || '',
      topics_discussed: currentDraft?.topics_discussed || '',
      materials_shared: (currentDraft?.materials_shared as any) || '',
      samples_distributed: (currentDraft?.samples_distributed as any) || '',
      sentiment: currentDraft?.sentiment || null,
      outcomes: currentDraft?.outcomes || '',
      follow_up_actions: currentDraft?.follow_up_actions || '',
    }
  });

  const [hcps, setHcps] = React.useState<{id: string, name: string}[]>([]);
  const [hcpSearch, setHcpSearch] = React.useState('');
  const [showHcpDropdown, setShowHcpDropdown] = React.useState(false);

  useEffect(() => {
    // Fetch HCPs for the dropdown
    import('../../services/api/hcpApi').then(({ hcpApi }) => {
      hcpApi.searchHCPs('').then(data => setHcps(data)).catch(() => {});
    });
  }, []);

  // Sync external Redux changes (e.g. from AI) back into the form
  useEffect(() => {
    if (currentDraft) {
      reset({
        hcp_id: currentDraft.hcp_id || '',
        interaction_type: currentDraft.interaction_type || 'Meeting',
        date: currentDraft.date || '',
        time: currentDraft.time || '',
        attendees: currentDraft.attendees || '',
        topics_discussed: currentDraft.topics_discussed || '',
        materials_shared: currentDraft.materials_shared || '',
        samples_distributed: currentDraft.samples_distributed || '',
        sentiment: currentDraft.sentiment || null,
        outcomes: currentDraft.outcomes || '',
        follow_up_actions: currentDraft.follow_up_actions || '',
      });
      
      // Update search box if HCP is set or unverified name is present
      if (currentDraft.hcp_id && hcps.length > 0) {
        const found = hcps.find(h => h.id === currentDraft.hcp_id);
        if (found) {
          setHcpSearch(found.name);
        }
      } else if (!currentDraft.hcp_id && currentHcpName) {
        setHcpSearch(currentHcpName);
      }
    }
  }, [currentDraft, currentHcpName, reset, hcps]);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 md:p-6 border-b flex justify-between items-center bg-card sticky top-0 z-10 rounded-t-xl">
        <h2 className="text-lg font-semibold tracking-tight">Interaction Details</h2>
        <div className="text-sm font-medium text-muted-foreground">
          {saveStatus === 'saving' && <span className="animate-pulse">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-emerald-500">Saved</span>}
        </div>
      </div>
      
      <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">HCP Name</label>
            <Controller
              name="hcp_id"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input 
                    value={hcpSearch}
                    onChange={(e) => {
                      setHcpSearch(e.target.value);
                      setShowHcpDropdown(true);
                    }}
                    onFocus={() => setShowHcpDropdown(true)}
                    onBlur={() => setTimeout(() => setShowHcpDropdown(false), 200)}
                    placeholder="Search or type HCP name..."
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {showHcpDropdown && hcps.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-card border border-input rounded-md shadow-md max-h-40 overflow-y-auto z-50">
                      {hcps.filter(h => h.name.toLowerCase().includes(hcpSearch.toLowerCase())).map(hcp => (
                        <div 
                          key={hcp.id} 
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setHcpSearch(hcp.name);
                            field.onChange(hcp.id);
                            handleFieldChange('hcp_id', hcp.id);
                            setShowHcpDropdown(false);
                          }}
                        >
                          {hcp.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Interaction Type</label>
            <Controller
              name="interaction_type"
              control={control}
              render={({ field }) => (
                <select 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('interaction_type', e.target.value);
                  }}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                </select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input 
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('date', e.target.value);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              )}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <input 
                    type="time"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('time', e.target.value);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Attendees</label>
          <Controller
            name="attendees"
            control={control}
            render={({ field }) => (
              <input 
                placeholder="Enter names or search..."
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handleFieldChange('attendees', e.target.value);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Topics Discussed</label>
          <Controller
            name="topics_discussed"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <textarea 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('topics_discussed', e.target.value);
                  }}
                  placeholder="Enter key discussion points..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y pb-8"
                />
                <button type="button" className="absolute bottom-2 right-2 p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            )}
          />
          <button type="button" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 mt-2">
            <Sparkles className="w-4 h-4 mr-2" /> Summarize from Voice Note (Requires Consent)
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium border-b pb-2">Materials Shared / Samples Distributed</h3>
          
          <div className="space-y-2 border rounded-md p-4 bg-card shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Materials Shared</label>
              <button 
                type="button"
                onClick={() => {
                  const newItem = window.prompt('Enter material to add:');
                  if (newItem && newItem.trim()) {
                    const currentVal = getValues('materials_shared') || '';
                    const newVal = currentVal ? `${currentVal}, ${newItem.trim()}` : newItem.trim();
                    setValue('materials_shared', newVal, { shouldDirty: true });
                    handleFieldChange('materials_shared', newVal);
                  }
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
                <Search className="w-3 h-3 mr-2" /> Search/Add
              </button>
            </div>
            <Controller
              name="materials_shared"
              control={control}
              render={({ field }) => (
                field.value ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.split(',').map((item, idx) => {
                      if (!item.trim()) return null;
                      return (
                        <div key={idx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                          {item.trim()}
                          <button 
                            type="button" 
                            onClick={() => {
                              const newArr = field.value!.split(',').map(v => v.trim()).filter((val, i) => i !== idx && val.length > 0);
                              const newVal = newArr.join(', ');
                              field.onChange(newVal);
                              handleFieldChange('materials_shared', newVal);
                            }}
                            className="hover:text-destructive ml-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">No materials added.</div>
                )
              )}
            />
          </div>

          <div className="space-y-2 border rounded-md p-4 bg-card shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Samples Distributed</label>
              <button 
                type="button"
                onClick={() => {
                  const newItem = window.prompt('Enter sample to add:');
                  if (newItem && newItem.trim()) {
                    const currentVal = getValues('samples_distributed') || '';
                    const newVal = currentVal ? `${currentVal}, ${newItem.trim()}` : newItem.trim();
                    setValue('samples_distributed', newVal, { shouldDirty: true });
                    handleFieldChange('samples_distributed', newVal);
                  }
                }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
                <Plus className="w-3 h-3 mr-2" /> Add Sample
              </button>
            </div>
            <Controller
              name="samples_distributed"
              control={control}
              render={({ field }) => (
                field.value ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.split(',').map((item, idx) => {
                      if (!item.trim()) return null;
                      return (
                        <div key={idx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                          {item.trim()}
                          <button 
                            type="button" 
                            onClick={() => {
                              const newArr = field.value!.split(',').map(v => v.trim()).filter((val, i) => i !== idx && val.length > 0);
                              const newVal = newArr.join(', ');
                              field.onChange(newVal);
                              handleFieldChange('samples_distributed', newVal);
                            }}
                            className="hover:text-destructive ml-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic">No samples added.</div>
                )
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Observed/Inferred HCP Sentiment</label>
          <Controller
            name="sentiment"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-6">
                <label className="flex flex-col items-center gap-1 cursor-pointer group">
                  <span className="text-xl group-hover:scale-110 transition-transform">😀</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      value="Positive"
                      checked={field.value === 'Positive'}
                      onChange={() => {
                        field.onChange('Positive');
                        handleFieldChange('sentiment', 'Positive');
                      }}
                      className="h-4 w-4 text-primary" 
                    />
                    <span className="text-sm">Positive</span>
                  </div>
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer group">
                  <span className="text-xl group-hover:scale-110 transition-transform">😐</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      value="Neutral"
                      checked={field.value === 'Neutral'}
                      onChange={() => {
                        field.onChange('Neutral');
                        handleFieldChange('sentiment', 'Neutral');
                      }}
                      className="h-4 w-4 text-primary" 
                    />
                    <span className="text-sm">Neutral</span>
                  </div>
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer group">
                  <span className="text-xl group-hover:scale-110 transition-transform">😞</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      value="Negative"
                      checked={field.value === 'Negative'}
                      onChange={() => {
                        field.onChange('Negative');
                        handleFieldChange('sentiment', 'Negative');
                      }}
                      className="h-4 w-4 text-primary" 
                    />
                    <span className="text-sm">Negative</span>
                  </div>
                </label>
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Outcomes</label>
          <Controller
            name="outcomes"
            control={control}
            render={({ field }) => (
              <textarea 
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e);
                  handleFieldChange('outcomes', e.target.value);
                }}
                placeholder="Key outcomes or agreements..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
              />
            )}
          />
        </div>

        <div className="space-y-2 pb-6">
          <label className="text-sm font-medium">Follow-up Actions</label>
          <Controller
            name="follow_up_actions"
            control={control}
            render={({ field }) => (
              <textarea 
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e);
                  handleFieldChange('follow_up_actions', e.target.value);
                }}
                placeholder="Enter next steps or tasks..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
              />
            )}
          />
          <div className="mt-4 pt-2">
            <span className="text-sm font-medium text-muted-foreground">AI Suggested Follow-ups:</span>
            <ul className="mt-2 space-y-1">
              <li><button type="button" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Schedule follow-up meeting in 2 weeks</button></li>
              <li><button type="button" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Send OncoBoost Phase III PDF</button></li>
              <li><button type="button" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Dr. Sharma to advisory board invite list</button></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InteractionForm;
