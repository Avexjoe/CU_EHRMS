import React, { useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PATIENTS, VISITS, Patient, Visit, VISIT_STATUS_LABELS, VISIT_STATUS_COLORS, VisitStatus } from '@/data/mockData';
import { UserPlus, Play, LogOut, LayoutDashboard, CalendarDays, ClipboardCheck, Users } from 'lucide-react';

const ReceptionistDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [patients, setPatients] = useState<Patient[]>([...PATIENTS]);
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [newPatientOpen, setNewPatientOpen] = useState(false);
  const [patientCount, setPatientCount] = useState(PATIENTS.length);

  const [form, setForm] = useState({
    firstName: '', lastName: '', studentId: '', nationalId: '', nhisCard: '',
    dob: '', country: 'Ghana', city: '', street: '', digitalAddress: '',
    ec1Name: '', ec1Phone: '', ec2Name: '', ec2Phone: '', multipleBirth: false,
  });

  const sidebarLinks = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, active: activeView === 'dashboard', onClick: () => setActiveView('dashboard') },
    { label: 'New Patient', icon: <UserPlus className="h-4 w-4" />, active: false, onClick: () => setNewPatientOpen(true) },
    { label: "Today's Visits", icon: <CalendarDays className="h-4 w-4" />, active: activeView === 'visits', onClick: () => setActiveView('visits') },
    { label: 'Check-Out Queue', icon: <ClipboardCheck className="h-4 w-4" />, active: activeView === 'checkout', onClick: () => setActiveView('checkout') },
  ];

  const registerPatient = () => {
    if (!form.firstName || !form.lastName || !form.dob) {
      toast.error('Please fill required fields (First Name, Last Name, DOB)');
      return;
    }
    const newCount = patientCount + 1;
    const hospitalId = `CUP${String(newCount).padStart(5, '0')}`;
    const age = new Date().getFullYear() - new Date(form.dob).getFullYear();
    const newP: Patient = {
      id: hospitalId, firstName: form.firstName, lastName: form.lastName,
      name: `${form.firstName} ${form.lastName}`, age, gender: 'Other', dob: form.dob,
      phone: '', address: `${form.street}, ${form.city}, ${form.country}`, bloodType: '',
      allergies: [], chronicConditions: [],
      studentId: form.studentId, nationalId: form.nationalId, nhisCard: form.nhisCard,
      country: form.country, city: form.city, street: form.street, digitalAddress: form.digitalAddress,
      emergencyContact1Name: form.ec1Name, emergencyContact1Phone: form.ec1Phone,
      emergencyContact2Name: form.ec2Name, emergencyContact2Phone: form.ec2Phone,
      multipleBirth: form.multipleBirth, checkedIn: false,
    };
    setPatients(prev => [...prev, newP]);
    setPatientCount(newCount);
    setForm({ firstName: '', lastName: '', studentId: '', nationalId: '', nhisCard: '', dob: '', country: 'Ghana', city: '', street: '', digitalAddress: '', ec1Name: '', ec1Phone: '', ec2Name: '', ec2Phone: '', multipleBirth: false });
    setNewPatientOpen(false);
    toast.success(`Patient registered successfully!`, { description: `Hospital ID: ${hospitalId}` });
  };

  const startEncounter = (patientId: string) => {
    const newVisit: Visit = {
      id: `V${Date.now()}`, patientId, date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5), status: 'waiting', priority: 'normal',
    };
    setVisits(prev => [newVisit, ...prev]);
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, checkedIn: true, arrivalTime: newVisit.time } : p));
    const patient = patients.find(p => p.id === patientId);
    toast.success(`Encounter started for ${patient?.name ?? patientId}`);
  };

  const checkOut = (visitId: string) => {
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'completed' as VisitStatus } : v));
    const visit = visits.find(v => v.id === visitId);
    const patient = patients.find(p => p.id === visit?.patientId);
    if (patient) setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, checkedIn: false } : p));
    toast.info(`${patient?.name ?? 'Patient'} checked out`);
  };

  const todayVisits = visits.filter(v => v.date === '2026-03-27' || v.date === new Date().toISOString().split('T')[0]);
  const activeVisits = todayVisits.filter(v => v.status !== 'completed');
  const checkoutQueue = todayVisits.filter(v => v.status === 'completed' || v.status === 'at_pharmacy');

  const getPatient = (id: string) => patients.find(p => p.id === id);

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} searchPlaceholder="Search by patient name or Hospital ID...">
      <div className="space-y-6">
        <div>
          <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Welcome to Reception</h1>
          <p className="text-sm text-muted-foreground">Central University Hospital — Patient Registration & Queue</p>
        </div>

        {activeView === 'dashboard' && (
          <>
            {/* Action cards + Live Queue */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left: Action Cards */}
              <div className="space-y-4">
                <Card className="cursor-pointer transition-opacity hover:opacity-60" onClick={() => setNewPatientOpen(true)}>
                  <CardContent className="flex flex-col items-center gap-3 p-8">
                    <div className="rounded-full bg-primary/10 p-4">
                      <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Register New Patient</h3>
                    <p className="text-sm text-muted-foreground text-center">Add a new patient to the system</p>
                    <Button className="w-full gap-2 mt-2"><UserPlus className="h-4 w-4" /> New Registration</Button>
                  </CardContent>
                </Card>

                <Card className="transition-opacity hover:opacity-60">
                  <CardContent className="flex flex-col items-center gap-3 p-8">
                    <div className="rounded-full bg-success/10 p-4">
                      <Play className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Start New Encounter</h3>
                    <p className="text-sm text-muted-foreground text-center">Search a patient and begin a visit</p>
                  </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{patients.length}</p><p className="text-xs text-muted-foreground">Total Patients</p></CardContent></Card>
                  <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-success">{activeVisits.length}</p><p className="text-xs text-muted-foreground">Active Today</p></CardContent></Card>
                </div>
              </div>

              {/* Right: Live Queue */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" /> Live Queue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todayVisits.length === 0 ? (
                      <p className="py-12 text-center text-muted-foreground">No visits today yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Hospital ID</TableHead>
                              <TableHead>Student/Staff ID</TableHead>
                              <TableHead>Arrival</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {todayVisits.map(v => {
                              const p = getPatient(v.patientId);
                              return (
                                <TableRow key={v.id}>
                                  <TableCell className="font-medium">{p?.name ?? '—'}</TableCell>
                                  <TableCell className="font-mono text-xs">{p?.id}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">{p?.studentId || p?.staffId || '—'}</TableCell>
                                  <TableCell className="text-muted-foreground">{p?.arrivalTime || v.time}</TableCell>
                                  <TableCell>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${VISIT_STATUS_COLORS[v.status]}`}>
                                      {VISIT_STATUS_LABELS[v.status]}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {v.status !== 'completed' ? (
                                      <Button size="sm" variant="outline" onClick={() => checkOut(v.id)} className="gap-1 text-xs">
                                        <LogOut className="h-3 w-3" /> Check Out
                                      </Button>
                                    ) : (
                                      <span className="text-xs text-success font-medium">Done</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeView === 'visits' && (
          <Card>
            <CardHeader><CardTitle>Today's Visits</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Hospital ID</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {todayVisits.map(v => {
                    const p = getPatient(v.patientId);
                    return (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{p?.name}</TableCell>
                        <TableCell className="font-mono text-xs">{p?.id}</TableCell>
                        <TableCell>{v.time}</TableCell>
                        <TableCell><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${VISIT_STATUS_COLORS[v.status]}`}>{VISIT_STATUS_LABELS[v.status]}</span></TableCell>
                        <TableCell>
                          {v.status !== 'completed' && <Button size="sm" variant="outline" onClick={() => checkOut(v.id)} className="text-xs gap-1"><LogOut className="h-3 w-3" /> Check Out</Button>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeView === 'checkout' && (
          <Card>
            <CardHeader><CardTitle>Check-Out Queue</CardTitle></CardHeader>
            <CardContent>
              {checkoutQueue.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No patients in checkout queue.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Hospital ID</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {checkoutQueue.map(v => {
                      const p = getPatient(v.patientId);
                      return (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{p?.name}</TableCell>
                          <TableCell className="font-mono text-xs">{p?.id}</TableCell>
                          <TableCell><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${VISIT_STATUS_COLORS[v.status]}`}>{VISIT_STATUS_LABELS[v.status]}</span></TableCell>
                          <TableCell>
                            {v.status !== 'completed' && <Button size="sm" variant="destructive" onClick={() => checkOut(v.id)} className="text-xs gap-1"><LogOut className="h-3 w-3" /> Close Encounter</Button>}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* New Patient Registration Modal */}
        <Dialog open={newPatientOpen} onOpenChange={setNewPatientOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader><DialogTitle>Register New Patient</DialogTitle></DialogHeader>
            <div className="space-y-5 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>First Name *</Label><Input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" /></div>
                <div className="space-y-1"><Label>Last Name *</Label><Input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} placeholder="Last name" /></div>
                <div className="space-y-1"><Label>Student ID</Label><Input value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} placeholder="e.g. CSC/22/01/0576" /></div>
                <div className="space-y-1"><Label>National ID (Ghana Card)</Label><Input value={form.nationalId} onChange={e => setForm(p => ({ ...p, nationalId: e.target.value }))} placeholder="GHA-XXXXXXXXX-X" /></div>
                <div className="space-y-1"><Label>NHIS Card</Label><Input value={form.nhisCard} onChange={e => setForm(p => ({ ...p, nhisCard: e.target.value }))} placeholder="NHIS number" /></div>
                <div className="space-y-1"><Label>Date of Birth *</Label><Input type="date" value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))} /></div>
              </div>

              <div className="border-t border-border/60 pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Address</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Country</Label><Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>City</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="e.g. Cape Coast" /></div>
                  <div className="space-y-1"><Label>Street</Label><Input value={form.street} onChange={e => setForm(p => ({ ...p, street: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Digital Address</Label><Input value={form.digitalAddress} onChange={e => setForm(p => ({ ...p, digitalAddress: e.target.value }))} placeholder="e.g. CC-001-2345" /></div>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Emergency Contacts</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Contact 1 Name</Label><Input value={form.ec1Name} onChange={e => setForm(p => ({ ...p, ec1Name: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Contact 1 Phone</Label><Input value={form.ec1Phone} onChange={e => setForm(p => ({ ...p, ec1Phone: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Contact 2 Name</Label><Input value={form.ec2Name} onChange={e => setForm(p => ({ ...p, ec2Name: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Contact 2 Phone</Label><Input value={form.ec2Phone} onChange={e => setForm(p => ({ ...p, ec2Phone: e.target.value }))} /></div>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 flex items-center gap-3">
                <Checkbox checked={form.multipleBirth} onCheckedChange={(v) => setForm(p => ({ ...p, multipleBirth: !!v }))} id="multipleBirth" />
                <Label htmlFor="multipleBirth">Multiple Birth</Label>
              </div>

              <Button onClick={registerPatient} variant="cta" className="w-full gap-2">
                <UserPlus className="h-4 w-4" /> Register Patient
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
