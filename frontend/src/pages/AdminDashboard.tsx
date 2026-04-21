import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_USERS, UserRole } from '@/contexts/AuthContext';
import { PATIENTS, VISITS, VISIT_STATUS_LABELS, VISIT_STATUS_COLORS } from '@/data/mockData';
import {
  Users, UserPlus, Trash2, FileText, Pencil, LayoutDashboard, Settings,
  BedDouble, Download, Clock, AlertTriangle, CheckCircle2, TrendingUp,
  TrendingDown, Stethoscope, FlaskConical, Pill, Activity, ArrowUpRight,
  ArrowDownRight, Shield, CalendarDays, HeartPulse, Zap, Server, Database,
  Wifi, HardDrive
} from 'lucide-react';
import UserAnalytics from '@/components/UserAnalytics';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'lab_tech', label: 'Lab Technician' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'cashier', label: 'Cashier' },
];

const ROLE_ICONS: Record<string, React.ReactNode> = {
  admin: <Shield className="h-3.5 w-3.5" />,
  doctor: <Stethoscope className="h-3.5 w-3.5" />,
  nurse: <HeartPulse className="h-3.5 w-3.5" />,
  lab_tech: <FlaskConical className="h-3.5 w-3.5" />,
  pharmacist: <Pill className="h-3.5 w-3.5" />,
  receptionist: <CalendarDays className="h-3.5 w-3.5" />,
  cashier: <Activity className="h-3.5 w-3.5" />,
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  admin: 'bg-destructive/50 text-destructive border-destructive/20',
  doctor: 'bg-blue-500/50 text-blue-600 border-blue-500/20',
  nurse: 'bg-emerald-500/50 text-emerald-600 border-emerald-500/20',
  lab_tech: 'bg-amber-500/50 text-amber-600 border-amber-500/20',
  pharmacist: 'bg-violet-500/50 text-violet-600 border-violet-500/20',
  receptionist: 'bg-slate-500/50 text-slate-600 border-slate-500/20',
  cashier: 'bg-zinc-500/50 text-zinc-600 border-zinc-500/20',
};

// Stable mock data (seeded, no random on each render)
const STAFF_ON_DUTY_DATA = [
  { day: 'Mon', Doctors: 4, Nurses: 6, 'Lab Techs': 2, Pharmacists: 2, Receptionists: 2, Cashiers: 1 },
  { day: 'Tue', Doctors: 3, Nurses: 5, 'Lab Techs': 2, Pharmacists: 2, Receptionists: 2, Cashiers: 2 },
  { day: 'Wed', Doctors: 4, Nurses: 7, 'Lab Techs': 3, Pharmacists: 2, Receptionists: 2, Cashiers: 1 },
  { day: 'Thu', Doctors: 3, Nurses: 5, 'Lab Techs': 2, Pharmacists: 1, Receptionists: 2, Cashiers: 2 },
  { day: 'Fri', Doctors: 4, Nurses: 6, 'Lab Techs': 2, Pharmacists: 2, Receptionists: 3, Cashiers: 2 },
  { day: 'Sat', Doctors: 2, Nurses: 4, 'Lab Techs': 1, Pharmacists: 1, Receptionists: 1, Cashiers: 1 },
  { day: 'Sun', Doctors: 2, Nurses: 3, 'Lab Techs': 1, Pharmacists: 1, Receptionists: 1, Cashiers: 1 },
];

const HOURLY_VISITS = [
  { hour: '8AM', visits: 3 }, { hour: '9AM', visits: 8 }, { hour: '10AM', visits: 12 },
  { hour: '11AM', visits: 10 }, { hour: '12PM', visits: 6 }, { hour: '1PM', visits: 4 },
  { hour: '2PM', visits: 9 }, { hour: '3PM', visits: 11 }, { hour: '4PM', visits: 7 },
  { hour: '5PM', visits: 3 },
];

const WEEKLY_REVENUE = [
  { day: 'Mon', revenue: 2450 }, { day: 'Tue', revenue: 1800 },
  { day: 'Wed', revenue: 3200 }, { day: 'Thu', revenue: 2900 },
  { day: 'Fri', revenue: 3800 }, { day: 'Sat', revenue: 1200 },
  { day: 'Sun', revenue: 800 },
];

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [users, setUsers] = useState([...MOCK_USERS]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    residentialAddress: '',
    mailingAddress: '',
    phoneCell: '',
    phoneLandline: '',
    dateOfBirth: '',
    nationalId: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    jobType: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: string; role: string; name: string } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [userFilterRole, setUserFilterRole] = useState<string>('all');

  const sidebarLinks = [
    { label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" />, active: activeView === 'overview', onClick: () => setActiveView('overview') },
    { label: 'User Management', icon: <Users className="h-4 w-4" />, active: activeView === 'users', onClick: () => setActiveView('users') },
    { label: 'Reports & Analytics', icon: <FileText className="h-4 w-4" />, active: activeView === 'reports', onClick: () => setActiveView('reports') },
    { label: 'Hospital Resources', icon: <BedDouble className="h-4 w-4" />, active: activeView === 'beds', onClick: () => setActiveView('beds') },
    { label: 'System Health & Security', icon: <Server className="h-4 w-4" />, active: activeView === 'system', onClick: () => setActiveView('system') },
  ];

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return;
    setUsers(prev => [...prev, { id: String(Date.now()), name: newUser.name, email: newUser.email, role: newUser.role as UserRole }]);
    setNewUser({
      name: '',
      email: '',
      role: '',
      residentialAddress: '',
      mailingAddress: '',
      phoneCell: '',
      phoneLandline: '',
      dateOfBirth: '',
      nationalId: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      jobType: '',
    });
    setDialogOpen(false);
  };

  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setUserToDelete({ id, name: user.name });
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const saveEditRole = () => {
    if (!editingUser) return;
    setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, role: editingUser.role as UserRole, name: editingUser.name } : u));
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  const todayVisits = VISITS.filter(v => v.date === '2026-03-27');
  const activeEncounters = todayVisits.filter(v => v.status !== 'completed').length;
  const completedToday = todayVisits.filter(v => v.status === 'completed').length;
  const bedOccupancy = 10;
  const totalBeds = 21;
  const pendingLabs = VISITS.filter(v => v.status === 'in_lab').length;
  const atPharmacy = VISITS.filter(v => v.status === 'at_pharmacy').length;
  const pendingPayments = VISITS.filter(v => v.payment?.status === 'pending').length;
  const totalRevenue = VISITS.reduce((sum, v) => sum + (v.payment?.amountPaid ?? 0), 0);

  const visitStatusData = useMemo(() =>
    Object.entries(VISIT_STATUS_LABELS).map(([status, label]) => ({
      name: label,
      count: VISITS.filter(v => v.status === status).length,
    })).filter(d => d.count > 0), []
  );

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

  const roleDistribution = useMemo(() =>
    ROLES.map(r => ({
      name: r.label,
      count: users.filter(u => u.role === r.value).length,
    })).filter(d => d.count > 0), [users]
  );

  const filteredUsers = userFilterRole === 'all' ? users : users.filter(u => u.role === userFilterRole);

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'hsl(var(--foreground))',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17) {
    greeting = 'Good evening';
  }

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} searchPlaceholder="Search system...">
      <div className="space-y-6">
        {/* Greeting Section */}
        <div className="mb-6 pb-6 border-b border-border/60">
          <h1 className="text-3xl font-bold text-foreground">{greeting}, Dr. Admin! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back to MedVault-Central</p>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Central University Hospital — System Overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-success border-[hsla(151,59%,59%,0.25)] bg-[hsla(151,59%,59%,0.12)]">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              System Online
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              <CalendarDays className="h-3 w-3 mr-1" />
              March 27, 2026
            </Badge>
          </div>
        </div>

        {/* ===================== OVERVIEW ===================== */}
        {activeView === 'overview' && (
          <>
            {/* KPI Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                label="Today's Visits"
                value={todayVisits.length}
                icon={<Activity className="h-5 w-5 text-primary" />}
                trend={+12}
                accent="primary"
              />
              <KPICard
                label="Active Encounters"
                value={activeEncounters}
                icon={<Stethoscope className="h-5 w-5 text-info" />}
                subtitle={`${completedToday} completed`}
                accent="info"
              />
              <KPICard
                label="Pending Labs"
                value={pendingLabs}
                icon={<FlaskConical className="h-5 w-5 text-warning" />}
                subtitle={atPharmacy > 0 ? `${atPharmacy} at pharmacy` : undefined}
                accent="warning"
              />
              <KPICard
                label="Revenue Today"
                value={`GHS ${totalRevenue.toFixed(2)}`}
                icon={<TrendingUp className="h-5 w-5 text-success" />}
                trend={+8}
                accent="success"
              />
            </div>

            {/* Bed Occupancy Banner */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BedDouble className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Bed Occupancy</p>
                      <p className="text-xs text-muted-foreground">{bedOccupancy} of {totalBeds} beds occupied</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{Math.round((bedOccupancy / totalBeds) * 100)}%</span>
                </div>
                <Progress value={(bedOccupancy / totalBeds) * 100} className="h-2.5" />
                <div className="flex gap-6 mt-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    <span className="text-muted-foreground">{totalBeds - bedOccupancy} Available</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{bedOccupancy} Occupied</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                    <span className="text-muted-foreground">2 Maintenance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Hourly Patient Flow */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Patient Flow — Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={HOURLY_VISITS}>
                      <defs>
                        <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" fill="url(#flowGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Visit Status Distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    Visits by Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={visitStatusData} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Feed */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Live Activity Feed</CardTitle>
                  <Badge variant="outline" className="text-xs text-muted-foreground">{todayVisits.length} today</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {todayVisits.slice(0, 6).map(v => {
                    const p = PATIENTS.find(pt => pt.id === v.patientId);
                    return (
                      <div key={v.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-ray-ring transition-opacity hover:opacity-60">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {p?.firstName?.charAt(0)}{p?.lastName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p?.name} <span className="text-muted-foreground font-normal">({p?.id})</span></p>
                          <p className="text-xs text-muted-foreground truncate">{v.time} — {v.complaint || 'No complaint recorded'}</p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 text-[10px] ${VISIT_STATUS_COLORS[v.status]}`}>
                          {VISIT_STATUS_LABELS[v.status]}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <UserAnalytics roleField="all" title="Hospital-Wide Patient Activity" />
          </>
        )}

        {/* ===================== USER MANAGEMENT ===================== */}
        {activeView === 'users' && (
          <>
            {/* User stats summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5"><Users className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-2xl font-bold">{users.length}</p>
                    <p className="text-xs text-muted-foreground">Total Staff</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2.5"><Stethoscope className="h-5 w-5 text-success" /></div>
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.role === 'doctor').length}</p>
                    <p className="text-xs text-muted-foreground">Doctors</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-info/10 p-2.5"><HeartPulse className="h-5 w-5 text-info" /></div>
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => u.role === 'nurse').length}</p>
                    <p className="text-xs text-muted-foreground">Nurses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-warning/10 p-2.5"><FlaskConical className="h-5 w-5 text-warning" /></div>
                  <div>
                    <p className="text-2xl font-bold">{users.filter(u => ['lab_tech', 'pharmacist', 'cashier', 'receptionist'].includes(u.role)).length}</p>
                    <p className="text-xs text-muted-foreground">Support Staff</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="table">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="table">Staff Directory</TabsTrigger>
                  <TabsTrigger value="analytics">Staffing Analytics</TabsTrigger>
                </TabsList>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2"><UserPlus className="h-4 w-4" /> Add Staff</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add New Staff Member</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2 max-h-[600px] overflow-y-auto">
                      <div className="space-y-2"><Label>Full Name</Label><Input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="Enter full name" /></div>
                      <div className="space-y-2"><Label>Official Email</Label><Input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="staff@hospital.edu" /></div>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="space-y-2"><Label>Role</Label><Select value={newUser.role} onValueChange={v => setNewUser(p => ({ ...p, role: v }))}><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent>{ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Specific Job Type</Label><Input value={newUser.jobType} onChange={e => setNewUser(p => ({ ...p, jobType: e.target.value }))} placeholder="e.g. Pediatrician, Surgeon" /></div>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/10 p-4">
                        <p className="text-sm font-semibold">Contact Information</p>
                        <div className="space-y-2"><Label>Residential Address</Label><Input value={newUser.residentialAddress} onChange={e => setNewUser(p => ({ ...p, residentialAddress: e.target.value }))} placeholder="Current residential address" /></div>
                        <div className="space-y-2"><Label>Mailing Address</Label><Input value={newUser.mailingAddress} onChange={e => setNewUser(p => ({ ...p, mailingAddress: e.target.value }))} placeholder="Mailing address" /></div>
                        <div className="grid gap-4 lg:grid-cols-2"><div className="space-y-2"><Label>Mobile Phone</Label><Input value={newUser.phoneCell} onChange={e => setNewUser(p => ({ ...p, phoneCell: e.target.value }))} placeholder="Cell number" /></div><div className="space-y-2"><Label>Landline Phone</Label><Input value={newUser.phoneLandline} onChange={e => setNewUser(p => ({ ...p, phoneLandline: e.target.value }))} placeholder="Landline number" /></div></div>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/10 p-4">
                        <p className="text-sm font-semibold">Identification Details</p>
                        <div className="grid gap-4 lg:grid-cols-2"><div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={newUser.dateOfBirth} onChange={e => setNewUser(p => ({ ...p, dateOfBirth: e.target.value }))} /></div><div className="space-y-2"><Label>National ID Number</Label><Input value={newUser.nationalId} onChange={e => setNewUser(p => ({ ...p, nationalId: e.target.value }))} placeholder="National identity number" /></div></div>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/10 p-4">
                        <p className="text-sm font-semibold">Emergency Contact</p>
                        <div className="space-y-2"><Label>Contact Name</Label><Input value={newUser.emergencyContactName} onChange={e => setNewUser(p => ({ ...p, emergencyContactName: e.target.value }))} placeholder="Emergency contact full name" /></div>
                        <div className="space-y-2"><Label>Relationship</Label><Input value={newUser.emergencyContactRelationship} onChange={e => setNewUser(p => ({ ...p, emergencyContactRelationship: e.target.value }))} placeholder="Relationship to staff member" /></div>
                        <div className="space-y-2"><Label>Contact Phone</Label><Input value={newUser.emergencyContactPhone} onChange={e => setNewUser(p => ({ ...p, emergencyContactPhone: e.target.value }))} placeholder="Emergency contact phone" /></div>
                      </div>

                      <Button onClick={addUser} className="w-full rounded-2xl bg-[#dc143c] text-white shadow-xl shadow-[#dc143c]/25 ring-1 ring-white/15 py-2 text-sm font-semibold uppercase tracking-[0.06em] transition duration-200 ease-out hover:bg-[#b01030] hover:-translate-y-0.5">Add Staff Member</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <TabsContent value="table">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Staff Directory</CardTitle>
                      <Select value={userFilterRole} onValueChange={setUserFilterRole}>
                        <SelectTrigger className="w-[160px] h-8 text-xs">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff Member</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-24 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map(u => (
                          <TableRow key={u.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                  {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <span className="font-medium text-sm">{u.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`gap-1 text-[10px] font-medium capitalize ${ROLE_BADGE_COLORS[u.role] || ''}`}>
                                {ROLE_ICONS[u.role]}
                                {u.role.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-success" />
                                <span className="text-xs text-muted-foreground">Active</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/85 hover:text-foreground opacity-100" onClick={() => { setEditingUser({ id: u.id, role: u.role, name: u.name }); setEditDialogOpen(true); }}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/85 hover:text-destructive opacity-100" onClick={() => deleteUser(u.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Role Distribution Pie */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold">Staff by Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={roleDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} label={({ name, count }) => `${name}: ${count}`}>
                            {roleDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Staff On Duty — Weekly
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={STAFF_ON_DUTY_DATA} barCategoryGap="15%">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="Doctors" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="Nurses" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="Lab Techs" fill="hsl(var(--warning))" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="Pharmacists" fill="hsl(var(--info))" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Edit Role Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent>
                <DialogHeader><DialogTitle>Edit Staff Member</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={editingUser?.name ?? ''} onChange={e => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)} placeholder="Enter staff name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={editingUser?.role ?? ''} onValueChange={v => setEditingUser(prev => prev ? { ...prev, role: v } : null)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Button onClick={saveEditRole} className="w-full rounded-2xl bg-[#dc143c] text-white shadow-xl shadow-[#dc143c]/25 ring-1 ring-white/15 py-2 text-sm font-semibold uppercase tracking-[0.06em] transition duration-200 ease-out hover:bg-[#b01030] hover:-translate-y-0.5">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle className="text-destructive">Delete Staff Member</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-foreground">Are you sure you want to delete <span className="font-semibold">{userToDelete?.name}</span>? This action cannot be undone.</p>
                  <div className="flex gap-3">
                    <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" className="flex-1">Cancel</Button>
                    <Button onClick={confirmDelete} className="flex-1 rounded-2xl bg-[#dc143c] text-white shadow-xl shadow-[#dc143c]/25 hover:bg-[#b01030]">Delete</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* ===================== REPORTS ===================== */}
        {activeView === 'reports' && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Revenue Trend */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Weekly Revenue (GHS)</CardTitle>
                  <CardDescription className="text-xs">Total collections this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={WEEKLY_REVENUE}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => [`GHS ${val.toFixed(2)}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--success))" fill="url(#revenueGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Visit Status Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Visit Outcomes</CardTitle>
                  <CardDescription className="text-xs">Completion rate and status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={visitStatusData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                        {visitStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Export Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Export Reports</CardTitle>
                <CardDescription className="text-xs">Download hospital data for offline analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Daily Visits */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Daily Visits</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="csv">
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" className="h-8 px-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Revenue Report */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Revenue Report</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="pdf">
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" className="h-8 px-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Drug Dispensing */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Drug Dispensing</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="csv">
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" className="h-8 px-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Lab Turnaround */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Lab Turnaround</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="csv">
                        <SelectTrigger className="flex-1 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" className="h-8 px-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <UserAnalytics roleField="all" title="Hospital-Wide Patient Activity" />
          </div>
        )}

        {/* ===================== HOSPITAL RESOURCES ===================== */}
        {activeView === 'beds' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Hospital Resources</h2>

            {/* Bed Occupancy */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <BedDouble className="h-5 w-5 text-primary" /> Bed Occupancy Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Current Occupancy</span>
                      <span className="font-bold text-foreground">{bedOccupancy} / {totalBeds} ({Math.round((bedOccupancy / totalBeds) * 100)}%)</span>
                    </div>
                    <Progress value={(bedOccupancy / totalBeds) * 100} className="h-3" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-center">
                      <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
                      <p className="text-2xl font-bold text-success">{totalBeds - bedOccupancy}</p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
                      <BedDouble className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-primary">{bedOccupancy}</p>
                      <p className="text-xs text-muted-foreground">Occupied</p>
                    </div>
                    <div className="rounded-xl bg-warning/10 border border-warning/20 p-4 text-center">
                      <AlertTriangle className="h-5 w-5 text-warning mx-auto mb-1" />
                      <p className="text-2xl font-bold text-warning">2</p>
                      <p className="text-xs text-muted-foreground">Maintenance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ward Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Ward-Level Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'General Ward', total: 8, occupied: 6 },
                    { name: 'Maternity Ward', total: 4, occupied: 3 },
                    { name: 'Pediatric Ward', total: 3, occupied: 2 },
                    { name: 'ICU', total: 4, occupied: 2 },
                    { name: 'Emergency Bay', total: 2, occupied: 1 },
                    { name: 'Surgical Ward', total: 6, occupied: 4 },
                    { name: 'Isolation Ward', total: 3, occupied: 1 },
                  ].map(ward => (
                    <div key={ward.name} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-36">{ward.name}</span>
                      <div className="flex-1">
                        <Progress value={(ward.occupied / ward.total) * 100} className="h-2" />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">{ward.occupied}/{ward.total}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical Equipment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Medical Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Wheelchairs', available: 8, total: 12 },
                    { name: 'Stretchers', available: 5, total: 8 },
                    { name: 'Oxygen Concentrators', available: 6, total: 8 },
                  ].map(eq => (
                    <div key={eq.name} className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{eq.name}</span>
                        <span className="text-xs text-muted-foreground">{eq.available}/{eq.total}</span>
                      </div>
                      <Progress value={(eq.available / eq.total) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Critical Supplies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Critical Supplies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { name: 'Oxygen Cylinders', level: 72, unit: '36/50 full' },
                    { name: 'Blood Bank (O-)', level: 45, unit: '9 units' },
                    { name: 'Blood Bank (A+)', level: 80, unit: '16 units' },
                    { name: 'Blood Bank (B+)', level: 60, unit: '12 units' },
                    { name: 'Blood Bank (AB+)', level: 30, unit: '6 units' },
                    { name: 'PPE Kits', level: 85, unit: '425 kits' },
                    { name: 'Surgical Gloves', level: 90, unit: '1,800 pairs' },
                    { name: 'Face Masks (N95)', level: 65, unit: '650 units' },
                    { name: 'IV Fluids (Normal Saline)', level: 78, unit: '390 bags' },
                    { name: 'Syringes & Needles', level: 92, unit: '4,600 units' },
                    { name: 'Bandages & Dressings', level: 70, unit: '350 packs' },
                    { name: 'Suture Kits', level: 55, unit: '110 kits' },
                  ].map(s => (
                    <div key={s.name} className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <p className="text-sm font-medium mb-1">{s.name}</p>
                      <Progress value={s.level} className={`h-2 mb-1 ${s.level < 40 ? '[&>div]:bg-destructive' : s.level < 60 ? '[&>div]:bg-warning' : ''}`} />
                      <p className="text-[10px] text-muted-foreground">{s.unit} — {s.level}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Facilities & Logistics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Facilities & Logistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Operating Theaters', available: 2, total: 4 },
                    { name: 'Ambulances', available: 3, total: 5 },
                    { name: 'Consultation Rooms', available: 6, total: 10 },
                    { name: 'Pharmacy Stock Items', available: 842, total: 1000 },
                    { name: 'Laboratory Stations', available: 4, total: 6 },
                    { name: 'Radiology Suites', available: 2, total: 3 },
                    { name: 'Sterilization Units', available: 3, total: 3 },
                    { name: 'Morgue Capacity', available: 8, total: 12 },
                    { name: 'Laundry Capacity (daily)', available: 150, total: 200 },
                  ].map(f => (
                    <div key={f.name} className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{f.name}</span>
                        <span className="text-xs text-muted-foreground">{f.available}/{f.total}</span>
                      </div>
                      <Progress value={(f.available / f.total) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kitchen & Nutrition */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Kitchen & Nutrition Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-success/10 border border-success/20 p-4 text-center">
                    <p className="text-2xl font-bold text-success">42</p>
                    <p className="text-xs text-muted-foreground">Meals Served Today</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">8</p>
                    <p className="text-xs text-muted-foreground">Special Diets Active</p>
                  </div>
                  <div className="rounded-xl bg-warning/10 border border-warning/20 p-4 text-center">
                    <p className="text-2xl font-bold text-warning">3</p>
                    <p className="text-xs text-muted-foreground">Pending Meal Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===================== SYSTEM HEALTH ===================== */}
        {activeView === 'system' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SystemMetricCard icon={<Server className="h-5 w-5" />} label="Server Status" value="Online" color="success" />
              <SystemMetricCard icon={<Database className="h-5 w-5" />} label="Database" value="Healthy" color="success" />
              <SystemMetricCard icon={<HardDrive className="h-5 w-5" />} label="Storage" value="42% Used" color="warning" />
              <SystemMetricCard icon={<Wifi className="h-5 w-5" />} label="Uptime" value="99.9%" color="success" />
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">System Configuration</CardTitle>
                <CardDescription className="text-xs">Hospital EHR system settings and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 shadow-ray-ring">
                    <p className="text-sm font-medium">EHR Version</p>
                    <p className="text-xs text-muted-foreground">MedVault-Central v2.4.1</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 shadow-ray-ring">
                    <p className="text-sm font-medium">Last Backup</p>
                    <p className="text-xs text-muted-foreground">March 27, 2026 — 02:00 AM</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 shadow-ray-ring">
                    <p className="text-sm font-medium">Total Patients</p>
                    <p className="text-xs text-muted-foreground">{PATIENTS.length} registered</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 shadow-ray-ring">
                    <p className="text-sm font-medium">Total Encounters</p>
                    <p className="text-xs text-muted-foreground">{VISITS.length} on record</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* ======================== Sub-components ======================== */

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: string;
  accent: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, icon, trend, subtitle }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
              {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}% from yesterday
            </div>
          )}
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 shadow-ray-ring">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

interface SystemMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'success' | 'warning' | 'destructive';
}

const SYSTEM_METRIC_COLORS: Record<SystemMetricCardProps['color'], { wrap: string; value: string }> = {
  success: { wrap: 'bg-success/10 text-success border-success/20', value: 'text-success' },
  warning: { wrap: 'bg-warning/10 text-warning border-warning/20', value: 'text-warning' },
  destructive: { wrap: 'bg-destructive/10 text-destructive border-destructive/20', value: 'text-destructive' },
};

const SystemMetricCard: React.FC<SystemMetricCardProps> = ({ icon, label, value, color }) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`rounded-xl border p-2.5 shadow-ray-ring ${SYSTEM_METRIC_COLORS[color].wrap}`}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-bold ${SYSTEM_METRIC_COLORS[color].value}`}>{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
