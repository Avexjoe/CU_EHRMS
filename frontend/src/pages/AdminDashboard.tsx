import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_USERS } from '@/contexts/AuthContext';
import { PATIENTS, VISITS } from '@/data/mockData';
import { Users, UserPlus, Trash2, BarChart3, Activity, Calendar, FileText, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState([...MOCK_USERS]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) return;
    setUsers(prev => [...prev, { id: String(Date.now()), name: newUser.name, email: newUser.email, role: newUser.role as any }]);
    setNewUser({ name: '', email: '', role: '' });
    setDialogOpen(false);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const stats = [
    { label: 'Total Patients', value: PATIENTS.length, icon: <Users className="h-5 w-5" />, color: 'text-primary' },
    { label: 'Active Visits', value: VISITS.filter(v => v.status !== 'completed').length, icon: <Activity className="h-5 w-5" />, color: 'text-accent' },
    { label: 'Completed Today', value: VISITS.filter(v => v.status === 'completed' && v.date === '2026-03-27').length, icon: <FileText className="h-5 w-5" />, color: 'text-success' },
    { label: 'Staff Members', value: users.length, icon: <TrendingUp className="h-5 w-5" />, color: 'text-warning' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage users, roles, and view hospital analytics</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(s => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-lg bg-muted p-2.5 ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> User Management</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><UserPlus className="h-4 w-4" /> Add User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} /></div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={newUser.role} onValueChange={v => setNewUser(p => ({ ...p, role: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="lab_tech">Lab Technician</SelectItem>
                        <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addUser} className="w-full">Add User</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                        {u.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => deleteUser(u.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Hospital Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Visits by Status</h3>
                <div className="space-y-3">
                  {['waiting', 'ready_for_doctor', 'in_progress', 'completed'].map(status => {
                    const count = VISITS.filter(v => v.status === status).length;
                    const pct = (count / VISITS.length) * 100;
                    const colors: Record<string, string> = { waiting: 'bg-warning', ready_for_doctor: 'bg-info', in_progress: 'bg-primary', completed: 'bg-success' };
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground capitalize">{status.replace(/_/g, ' ')}</span>
                          <span className="font-medium text-foreground">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className={`h-full rounded-full ${colors[status]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Patient Demographics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Patients</span><span className="font-medium text-foreground">{PATIENTS.length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Male</span><span className="font-medium text-foreground">{PATIENTS.filter(p => p.gender === 'Male').length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Female</span><span className="font-medium text-foreground">{PATIENTS.filter(p => p.gender === 'Female').length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Average Age</span><span className="font-medium text-foreground">{Math.round(PATIENTS.reduce((a, p) => a + p.age, 0) / PATIENTS.length)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">With Allergies</span><span className="font-medium text-foreground">{PATIENTS.filter(p => p.allergies.length > 0).length}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">With Chronic Conditions</span><span className="font-medium text-foreground">{PATIENTS.filter(p => p.chronicConditions.length > 0).length}</span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
