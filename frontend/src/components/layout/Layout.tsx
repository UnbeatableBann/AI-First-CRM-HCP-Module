import React from 'react';
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
  Search
} from 'lucide-react';
import brandLogo from '../../assets/brand-logo.svg';

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

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
      {/* Top Navigation */}
      <header className="h-[72px] shrink-0 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={brandLogo} alt="Curis Logo" className="h-7 w-auto object-contain" />
            <span className="font-semibold text-lg tracking-tight text-foreground">Curis</span>
          </div>
          
          <div className="hidden md:flex items-center relative">
            <Search className="w-5 h-5 text-muted absolute left-4" />
            <input 
              type="text"
              placeholder="Search HCPs, interactions, products, literature..."
              className="pl-12 pr-4 py-2.5 w-[480px] bg-surface-secondary border border-transparent rounded-[24px] text-[14px] text-foreground focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-muted hover:text-foreground transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="text-muted hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-surface px-4 py-2 rounded-[18px] text-[14px] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Interaction</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-primary font-semibold text-sm cursor-pointer">
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
