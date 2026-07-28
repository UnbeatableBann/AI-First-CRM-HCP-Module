import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Brain, 
  Calendar, 
  BookOpen, 
  BarChart, 
  Settings,
  Bell,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import brandLogo from '../../assets/brand-logo.svg';
import api from '../../services/api/axios';
import { RootState } from '../../app/store';
import { addNotification, markAsRead, markAllAsRead } from '../../features/notifications/notificationsSlice';

const navItems = [
  { name: 'Mission Control', path: '/', icon: LayoutDashboard },
  { name: 'Healthcare Professionals', path: '/hcps', icon: Users },
  { name: 'Interactions', path: '/interactions', icon: MessageSquare },
  { name: 'Knowledge', path: '/knowledge', icon: Brain },
  { name: 'Planning', path: '/planning', icon: Calendar },
  { name: 'Literature', path: '/literature', icon: BookOpen },
  { name: 'Analytics', path: '/analytics', icon: BarChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{hcps: any[], interactions: any[]}>({ hcps: [], interactions: [] });
  const searchRef = useRef<HTMLDivElement>(null);

  const notifications = useSelector((state: RootState) => state.notifications.items);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform debounced search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ hcps: [], interactions: [] });
        return;
      }
      try {
        const [hcpRes, intRes] = await Promise.all([
          api.get('/hcp/'),
          api.get('/interaction/home')
        ]);
        
        const allHcps = hcpRes.data?.data || [];
        const savedHcps = intRes.data?.data?.saved_hcps || [];
        
        const filteredHcps = allHcps.filter((h: any) => h.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3);
        const filteredInts = savedHcps.filter((h: any) => h.hcp_name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3);
        
        setSearchResults({ hcps: filteredHcps, interactions: filteredInts });
      } catch (err) {
        console.error('Search failed:', err);
      }
    };
    
    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      // Trigger a sync of AI learnings. For now we simulate the delay.
      await new Promise(resolve => setTimeout(resolve, 1500));
      dispatch(addNotification({
        title: 'Sync Complete',
        message: 'AI Learnings have been successfully updated.',
        type: 'success'
      }));
    } catch (error) {
      dispatch(addNotification({
        title: 'Sync Failed',
        message: 'Could not connect to AI engine.',
        type: 'error'
      }));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleNewInteraction = async () => {
    if (isCreatingDraft) return;
    setIsCreatingDraft(true);
    try {
      const res = await api.post('/interaction/draft');
      const draftId = res.data.data.id;
      navigate(`/interactions/${draftId}`);
    } catch (error) {
      console.error('Failed to create draft:', error);
      dispatch(addNotification({
        title: 'Draft Creation Failed',
        message: 'Could not create a new interaction draft.',
        type: 'error'
      }));
    } finally {
      setIsCreatingDraft(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-danger" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-warning" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) return `${diffMins || 1}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.round(diffHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
      {/* Top Navigation */}
      <header className="h-[72px] shrink-0 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={brandLogo} alt="Curis Logo" className="h-7 w-auto object-contain" />
            <span className="font-semibold text-lg tracking-tight text-foreground">Curis</span>
          </div>
          
          <div className="hidden md:flex items-center relative" ref={searchRef}>
            <Search className="w-5 h-5 text-muted absolute left-4" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search HCPs, interactions, products, literature..."
              className="pl-12 pr-4 py-2.5 w-[480px] bg-surface-secondary border border-transparent rounded-[24px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-muted"
            />
            {/* Search Dropdown */}
            {isSearchFocused && searchQuery.length >= 2 && (
              <div className="absolute top-[110%] left-0 w-full bg-surface border border-border shadow-minimal rounded-[18px] overflow-hidden z-50">
                {searchResults.hcps.length === 0 && searchResults.interactions.length === 0 ? (
                  <div className="p-4 text-[14px] text-muted text-center">No results found</div>
                ) : (
                  <div className="py-2">
                    {/* HCP Category */}
                    {searchResults.hcps.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-1 text-[12px] font-medium text-foreground-secondary uppercase tracking-wider">Healthcare Professionals</div>
                        {searchResults.hcps.map((hcp: any) => (
                          <div 
                            key={hcp.id} 
                            onClick={() => {
                              navigate(`/hcp/${hcp.id}`);
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="px-4 py-2 flex items-center gap-3 hover:bg-surface-secondary cursor-pointer transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[12px] font-medium">
                              {hcp.name.startsWith('Dr') ? 'Dr.' : hcp.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-[14px] font-medium text-foreground">{hcp.name}</div>
                              <div className="text-[12px] text-muted">{hcp.specialization || hcp.specialty || 'Specialist'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Interactions Category */}
                    {searchResults.interactions.length > 0 && (
                      <div>
                        <div className="px-4 py-1 text-[12px] font-medium text-foreground-secondary uppercase tracking-wider">Recent Interactions</div>
                        {searchResults.interactions.map((interaction: any) => (
                          <div 
                            key={interaction.hcp_id} 
                            onClick={() => {
                              navigate(`/hcp/${interaction.hcp_id}`);
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="px-4 py-2 flex items-center gap-3 hover:bg-surface-secondary cursor-pointer transition-colors"
                          >
                            <MessageSquare className="w-5 h-5 text-muted shrink-0" />
                            <div>
                              <div className="text-[14px] font-medium text-foreground">Discussion with {interaction.hcp_name}</div>
                              <div className="text-[12px] text-muted">
                                {interaction.latest_interaction ? new Date(interaction.latest_interaction).toLocaleDateString() : 'Draft'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={handleSync}
            className={`text-muted hover:text-foreground transition-colors ${isSyncing ? 'animate-spin' : ''}`}
            title="Refresh AI Learnings"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          {/* Notifications Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-muted hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-surface text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Dropdown Panel */}
            {showNotifications && (
              <div className="absolute top-12 right-0 w-[380px] bg-surface border border-border shadow-minimal rounded-[18px] overflow-hidden flex flex-col z-50">
                <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-surface-secondary">
                  <h3 className="text-[14px] font-medium text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => dispatch(markAllAsRead())}
                      className="text-[12px] text-primary hover:text-primary-hover font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="overflow-y-auto max-h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted text-[14px]">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 flex gap-4 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface-secondary'}`}
                          onClick={() => {
                            if (!notification.read) dispatch(markAsRead(notification.id));
                          }}
                        >
                          <div className="shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-[14px] truncate pr-4 ${!notification.read ? 'font-medium text-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-[12px] text-muted shrink-0 whitespace-nowrap">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-[13px] text-foreground-secondary line-clamp-2 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleNewInteraction}
            disabled={isCreatingDraft}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-surface px-4 py-2 rounded-[18px] text-[14px] font-medium transition-colors disabled:opacity-50"
          >
            {isCreatingDraft ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Interaction</span>
          </button>
          
          <div className="w-9 h-9 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-primary font-semibold text-sm cursor-pointer hover:border-primary transition-colors">
            DR
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-[280px] border-r border-sidebar-border bg-sidebar-bg hidden md:flex flex-col shrink-0 overflow-y-auto">
          <nav className="flex-1 py-8 px-4 space-y-2">
            <div className="text-[12px] font-medium text-sidebar-text/60 uppercase tracking-widest px-4 mb-4">Workspace</div>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-medium transition-colors border-l-[3px] ${
                    isActive
                      ? 'bg-sidebar-active text-sidebar-active-text border-accent'
                      : 'border-transparent text-sidebar-text hover:bg-sidebar-active hover:text-sidebar-active-text'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background overflow-y-auto">
          <div className="max-w-[1440px] mx-auto w-full relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
