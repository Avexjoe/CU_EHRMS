import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Stethoscope, Heart, FlaskConical, Pill, Activity } from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
  admin: { label: 'Administrator', icon: <Shield className="h-5 w-5" />, color: 'bg-primary' },
  doctor: { label: 'Doctor', icon: <Stethoscope className="h-5 w-5" />, color: 'bg-primary' },
  nurse: { label: 'Nurse', icon: <Heart className="h-5 w-5" />, color: 'bg-accent' },
  lab_tech: { label: 'Lab Technician', icon: <FlaskConical className="h-5 w-5" />, color: 'bg-info' },
  pharmacist: { label: 'Pharmacist', icon: <Pill className="h-5 w-5" />, color: 'bg-success' },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const config = roleConfig[user.role];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5">
              <Activity className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm font-bold tracking-tight text-primary-foreground">MedVault.cu</span>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <span className={`inline-flex items-center gap-1.5 rounded-full ${config.color} px-2.5 py-0.5 text-xs font-medium text-primary-foreground`}>
                {config.icon}
                {config.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground md:block">
              Welcome, <span className="font-medium text-foreground">{user.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
