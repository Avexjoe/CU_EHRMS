import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LogOut, Shield, Stethoscope, Heart, FlaskConical, Pill, Activity,
  ClipboardList, Search, Banknote, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import ProfileSettings from '@/components/ProfileSettings';
import { useState } from 'react';

interface SidebarLink {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const roleConfig: Record<UserRole, { label: string; icon: React.ReactNode; sidebarTitle: string }> = {
  admin: { label: 'Administrator', icon: <Shield className="h-5 w-5" />, sidebarTitle: 'Admin' },
  doctor: { label: 'Doctor', icon: <Stethoscope className="h-5 w-5" />, sidebarTitle: 'Doctor' },
  nurse: { label: 'Nurse', icon: <Heart className="h-5 w-5" />, sidebarTitle: 'Nursing' },
  lab_tech: { label: 'Lab Technician', icon: <FlaskConical className="h-5 w-5" />, sidebarTitle: 'Laboratory' },
  pharmacist: { label: 'Pharmacist', icon: <Pill className="h-5 w-5" />, sidebarTitle: 'Pharmacy' },
  receptionist: { label: 'Receptionist', icon: <ClipboardList className="h-5 w-5" />, sidebarTitle: 'Reception' },
  cashier: { label: 'Cashier', icon: <Banknote className="h-5 w-5" />, sidebarTitle: 'Cashier' },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarLinks?: SidebarLink[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebarLinks, onSearch, searchPlaceholder }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const config = roleConfig[user.role];

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    onSearch?.(val);
  };

  return (
    <div className="min-h-dvh bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      {sidebarLinks && sidebarLinks.length > 0 && (
        <aside className={`
          fixed top-0 left-0 z-50 h-dvh w-72 ${user.role === 'admin' ? 'bg-[#dc143c] text-white border-white/15' : 'bg-sidebar text-sidebar-foreground border-sidebar-border/60'} flex flex-col transition-transform duration-200
          lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto
          lg:transition-[width] lg:duration-200 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className={`flex h-16 items-center gap-3 border-b border-sidebar-border/60 ${sidebarCollapsed ? 'px-3' : 'px-5'}`}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-xl bg-white shadow-ray-button">
                <img
                  src="https://central.edu.gh/static/img/fav.png"
                  alt="MedVault logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className={`leading-tight ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                <p className="text-sm font-semibold text-white">MedVault-Central</p>
                <p className="text-xs text-white/70">University Hospital EHR</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                onClick={() => setSidebarCollapsed(v => !v)}
                className="hidden lg:inline-flex h-10 w-10 -ml-2.5 items-center justify-center rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground hover:opacity-60"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                type="button"
              >
                {sidebarCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
              </button>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`${sidebarCollapsed ? 'hidden' : 'block'} px-5 pt-4 pb-2`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{config.sidebarTitle}</p>
          </div>

          <nav className={`flex-1 space-y-1 ${sidebarCollapsed ? 'px-2 pt-3' : 'px-3'}`}>
            {sidebarLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => { link.onClick?.(); setSidebarOpen(false); }}
                title={sidebarCollapsed ? link.label : undefined}
                className={`flex w-full items-center rounded-xl py-2.5 text-sm font-semibold transition-opacity ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${
                  link.active
                  ? 'border border-sidebar-border/60 bg-sidebar-accent/60 text-white shadow-ray-button opacity-100'
                    : 'text-white/80 hover:opacity-80'
                }`}
              >
                {link.icon}
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>{link.label}</span>
              </button>
            ))}
          </nav>

          <div className={`border-t border-white/20 ${sidebarCollapsed ? 'p-3' : 'p-4'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#dc143c] shadow-ray-button overflow-hidden">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user.name.charAt(0)}
              </div>
              <div className={`flex-1 min-w-0 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs font-semibold text-white/80 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background">
          <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-4">
            {sidebarLinks && sidebarLinks.length > 0 && (
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
                <Menu className="h-5 w-5" />
              </button>
            )}

            {(!sidebarLinks || sidebarLinks.length === 0) && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[linear-gradient(135deg,rgba(255,99,99,0.0)_0%,rgba(255,99,99,0.0)_42%,rgba(255,99,99,0.95)_42%,rgba(255,99,99,0.95)_58%,rgba(255,99,99,0.0)_58%,rgba(255,99,99,0.0)_100%)] shadow-ray-button" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">MedVault-Central</p>
                  <p className="text-xs text-muted-foreground">University Hospital EHR</p>
                </div>
              </div>
            )}

            {/* Global search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-10 pl-9"
                  placeholder={searchPlaceholder || 'Search patients...'}
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground md:block">
                <span className="font-medium text-foreground">{user.name}</span>
              </span>
              <ProfileSettings />
              <Button size="sm" variant="destructive" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1200px] p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
