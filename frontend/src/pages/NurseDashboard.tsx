import React, { useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISITS, PATIENTS, Visit, Patient, VisitPriority, VISIT_STATUS_LABELS, VISIT_STATUS_COLORS } from '@/data/mockData';
import { MOCK_USERS } from '@/contexts/AuthContext';
import { Users, Clock, CheckCircle, Heart, ListChecks, Activity, Search, UserPlus } from 'lucide-react';
import UserAnalytics from '@/components/UserAnalytics';

const NurseDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('patients');
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [vitalsOpen, setVitalsOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);

  const [vitalsForm, setVitalsForm] = useState({
    height: '', weight: '', bloodPressure: '', temperature: '', heartRate: '',
    allergies: '', currentDrugs: '', assignDoctor: '',
  });

  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const sidebarLinks = [
    { label: 'My Patients', icon: <Users className="h-4 w-4" />, active: activeView === 'patients', onClick: () => setActiveView('patients') },
    { label: 'Vitals Queue', icon: <Heart className="h-4 w-4" />, active: activeView === 'vitals', onClick: () => setActiveView('vitals') },
    { label: 'Add Patient', icon: <UserPlus className="h-4 w-4" />, active: activeView === 'add_patient', onClick: () => setActiveView('add_patient') },
    { label: 'All Open Encounters', icon: <ListChecks className="h-4 w-4" />, active: activeView === 'open', onClick: () => setActiveView('open') },
  ];

  const todayVisits = visits.filter(v => v.date === '2026-03-27');
  const waitingVisits = todayVisits.filter(v => v.status === 'waiting');
  const readyVisits = todayVisits.filter(v => v.status === 'ready_for_doctor');
  const openVisits = todayVisits.filter(v => v.status !== 'completed');

  const getPatient = (id: string) => PATIENTS.find(p => p.id === id);
  const doctors = MOCK_USERS.filter(u => u.role === 'doctor');

  // Search registered patients for adding to today's queue
  const normalizedSearch = patientSearchQuery.toLowerCase().trim();
  const searchedPatients = normalizedSearch.length > 0
    ? PATIENTS.filter(p =>
        p.name.toLowerCase().includes(normalizedSearch) ||
        p.id.toLowerCase().includes(normalizedSearch) ||
        p.phone?.toLowerCase().includes(normalizedSearch) ||
        p.nationalId?.toLowerCase().includes(normalizedSearch) ||
        p.nhisCard?.toLowerCase().includes(normalizedSearch) ||
        p.studentId?.toLowerCase().includes(normalizedSearch)
      )
    : [];

  const addPatientToQueue = (patient: Patient) => {
    // Check if patient already has a visit today
    const existingVisit = visits.find(v => v.patientId === patient.id && v.date === '2026-03-27');
    if (existingVisit) {
      toast.error(`${patient.name} already has an encounter today`);
      return;
    }
    const newVisit: Visit = {
      id: `V${Date.now()}`,
      patientId: patient.id,
      date: '2026-03-27',
      time: new Date().toTimeString().slice(0, 5),
      status: 'waiting',
      priority: 'normal',
    };
    setVisits(prev => [...prev, newVisit]);
    setPatientSearchQuery('');
    setPatientSearchOpen(false);
    toast.success(`${patient.name} added to today's queue`, {
      description: 'Patient is now waiting for vitals',
    });
  };

  const openVitals = (visitId: string) => {
    const visit = visits.find(v => v.id === visitId);
    setSelectedVisitId(visitId);
    if (visit?.vitals) {
      setVitalsForm({
        height: visit.vitals.height || '', weight: visit.vitals.weight || '',
        bloodPressure: visit.vitals.bloodPressure || '', temperature: visit.vitals.temperature || '',
        heartRate: visit.vitals.pulse || '', allergies: visit.allergies || '',
        currentDrugs: visit.currentMedications || '', assignDoctor: visit.doctorId || '',
      });
    } else {
      setVitalsForm({ height: '', weight: '', bloodPressure: '', temperature: '', heartRate: '', allergies: '', currentDrugs: '', assignDoctor: '' });
    }
    setVitalsOpen(true);
  };

  const saveVitals = () => {
    if (!selectedVisitId) return;
    const currentVisit = visits.find(v => v.id === selectedVisitId);
    const willMarkReady = currentVisit ? (currentVisit.status === 'waiting' || currentVisit.status === 'with_nurse') : true;
    setVisits(prev => prev.map(v => v.id === selectedVisitId ? {
      ...v,
      status: (v.status === 'waiting' || v.status === 'with_nurse') ? 'ready_for_doctor' as const : v.status,
      nurseId: '3',
      doctorId: vitalsForm.assignDoctor ? vitalsForm.assignDoctor : v.doctorId,
      vitals: {
        height: vitalsForm.height, weight: vitalsForm.weight,
        bloodPressure: vitalsForm.bloodPressure, temperature: vitalsForm.temperature,
        pulse: vitalsForm.heartRate,
      },
      allergies: vitalsForm.allergies,
      currentMedications: vitalsForm.currentDrugs,
    } : v));
    setVitalsOpen(false);
    const patient = currentVisit ? getPatient(currentVisit.patientId) : null;
    toast.success(
      willMarkReady ? `${patient?.name ?? 'Patient'} is now Ready for Doctor` : 'Vitals updated',
      { description: 'Vitals saved successfully' },
    );
  };

  const getTimeSince = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const diff = (now.getHours() * 60 + now.getMinutes()) - (h * 60 + m);
    if (diff < 0) return '—';
    if (diff < 60) return `${diff}m`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const renderVisitRow = (v: Visit, showVitalsAction = true) => {
    const p = getPatient(v.patientId);
    const hasVitals = !!v.vitals;
    const actionLabel = hasVitals ? 'Open' : 'Record Vitals';
    return (
      <TableRow key={v.id}>
        <TableCell className="font-medium">{p?.name ?? '—'}</TableCell>
        <TableCell className="font-mono text-xs">{p?.id}</TableCell>
        <TableCell className="text-muted-foreground">{getTimeSince(v.time)}</TableCell>
        <TableCell>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${hasVitals ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
            {hasVitals ? '✓ Recorded' : '⏳ Pending'}
          </span>
        </TableCell>
        <TableCell>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${VISIT_STATUS_COLORS[v.status]}`}>
            {VISIT_STATUS_LABELS[v.status]}
          </span>
        </TableCell>
        <TableCell>
          {showVitalsAction && (
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => openVitals(v.id)} className="text-xs">
                {actionLabel}
              </Button>
              {v.status === 'waiting' && hasVitals && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1 border-[hsla(151,59%,59%,0.25)] bg-[hsla(151,59%,59%,0.12)] text-success"
                  onClick={() => {
                    setVisits(prev => prev.map(vi => vi.id === v.id ? { ...vi, status: 'ready_for_doctor' as const } : vi));
                    toast.success(`${p?.name} marked ready for doctor`);
                  }}
                >
                  <CheckCircle className="h-3 w-3" /> Assign
                </Button>
              )}
            </div>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} searchPlaceholder="Search patients...">
      <div className="space-y-6">
        {/* Greeting Section */}
        <div className="mb-6 pb-6 border-b border-border/60">
          <h1 className="text-3xl font-bold text-foreground">{greeting}, Emily! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back to MedVault-Central</p>
        </div>
        <div>
          <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Nursing Station</h1>
          <p className="text-sm text-muted-foreground">Record vitals and prepare patients for the doctor</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-warning/10 p-2.5"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-2xl font-bold">{waitingVisits.length}</p><p className="text-xs text-muted-foreground">Waiting</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-info/10 p-2.5"><Activity className="h-5 w-5 text-info" /></div><div><p className="text-2xl font-bold">{readyVisits.length}</p><p className="text-xs text-muted-foreground">Ready for Doctor</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-success/10 p-2.5"><CheckCircle className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold">{todayVisits.filter(v => v.status === 'completed').length}</p><p className="text-xs text-muted-foreground">Completed</p></div></CardContent></Card>
        </div>

        {/* Add Patient to Queue - search registered patients only */}
        {activeView === 'add_patient' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" />
                Add Registered Patient to Today's Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">Search for patients already registered in the system. Only registered patients can be added to the queue.</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, phone, NHIS card..."
                  className="pl-10"
                  value={patientSearchQuery}
                  onChange={e => { setPatientSearchQuery(e.target.value); setPatientSearchOpen(true); }}
                  onFocus={() => setPatientSearchOpen(true)}
                />
              </div>
              {patientSearchOpen && normalizedSearch.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card shadow-ray-float max-h-72 overflow-y-auto">
                  {searchedPatients.length > 0 ? (
                    searchedPatients.map(p => {
                      const alreadyQueued = visits.some(v => v.patientId === p.id && v.date === '2026-03-27');
                      return (
                        <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border/60 last:border-0 transition-opacity hover:opacity-60">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {p.firstName[0]}{p.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{p.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {p.id} · {p.age}y · {p.gender}
                                {p.nhisCard ? ` · NHIS: ${p.nhisCard}` : ''}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={alreadyQueued ? 'outline' : 'default'}
                            disabled={alreadyQueued}
                            onClick={() => addPatientToQueue(p)}
                            className="text-xs shrink-0"
                          >
                            {alreadyQueued ? 'Already Queued' : 'Add to Queue'}
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No registered patients found for "{patientSearchQuery}".
                      <br />
                      <span className="text-xs">Patients must be registered at Reception first.</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeView !== 'add_patient' && (
          <Tabs value={activeView === 'vitals' ? 'pending' : 'today'} onValueChange={v => setActiveView(v === 'pending' ? 'vitals' : 'patients')}>
            <TabsList>
              <TabsTrigger value="today">Today's Patients</TabsTrigger>
              <TabsTrigger value="pending">Pending Vitals</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Hospital ID</TableHead><TableHead>Waiting</TableHead><TableHead>Vitals</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                    <TableBody>{todayVisits.map(v => renderVisitRow(v))}</TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardContent className="pt-6">
                  {waitingVisits.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">No patients pending vitals.</p>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Hospital ID</TableHead><TableHead>Waiting</TableHead><TableHead>Vitals</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                      <TableBody>{waitingVisits.map(v => renderVisitRow(v))}</TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Vitals Modal */}
        <Dialog open={vitalsOpen} onOpenChange={setVitalsOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Record Patient Vitals</DialogTitle></DialogHeader>
            {(() => {
              const visit = visits.find(v => v.id === selectedVisitId);
              const patient = visit ? getPatient(visit.patientId) : null;
              return (
                <div className="space-y-5 pt-2">
                  {patient && (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {patient.id} · Age: {patient.age} · {patient.gender}</p>
                    </div>
                  )}

                  {visit?.vitals && (
                    <div className="rounded-xl border border-[hsla(202,100%,67%,0.25)] bg-[hsla(202,100%,67%,0.12)] p-3 shadow-ray-ring">
                      <p className="text-xs font-semibold text-info mb-2">Previous Vitals</p>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>BP: {visit.vitals.bloodPressure}</div>
                        <div>Temp: {visit.vitals.temperature}°C</div>
                        <div>HR: {visit.vitals.pulse} bpm</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Height (cm)</Label><Input placeholder="e.g. 175" value={vitalsForm.height} onChange={e => setVitalsForm(p => ({ ...p, height: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Weight (kg)</Label><Input placeholder="e.g. 70" value={vitalsForm.weight} onChange={e => setVitalsForm(p => ({ ...p, weight: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Blood Pressure</Label><Input placeholder="e.g. 120/80" value={vitalsForm.bloodPressure} onChange={e => setVitalsForm(p => ({ ...p, bloodPressure: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Temperature (°C)</Label><Input placeholder="e.g. 37.0" value={vitalsForm.temperature} onChange={e => setVitalsForm(p => ({ ...p, temperature: e.target.value }))} /></div>
                    <div className="col-span-2 space-y-1"><Label className="text-xs">Heart Rate (bpm)</Label><Input placeholder="e.g. 72" value={vitalsForm.heartRate} onChange={e => setVitalsForm(p => ({ ...p, heartRate: e.target.value }))} /></div>
                  </div>

                  <div className="space-y-1"><Label className="text-xs">Allergies</Label><Textarea placeholder="Known allergies..." value={vitalsForm.allergies} onChange={e => setVitalsForm(p => ({ ...p, allergies: e.target.value }))} rows={2} /></div>
                  <div className="space-y-1"><Label className="text-xs">Current Drugs</Label><Textarea placeholder="Current medications..." value={vitalsForm.currentDrugs} onChange={e => setVitalsForm(p => ({ ...p, currentDrugs: e.target.value }))} rows={2} /></div>

                  <div className="space-y-1">
                    <Label className="text-xs">Assign to Doctor</Label>
                    <Select value={vitalsForm.assignDoctor} onValueChange={v => setVitalsForm(p => ({ ...p, assignDoctor: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                      <SelectContent>{doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={saveVitals}
                    variant="outline"
                    className="w-full gap-2 border-[hsla(151,59%,59%,0.25)] bg-[hsla(151,59%,59%,0.12)] text-success"
                  >
                    <CheckCircle className="h-4 w-4" /> Save Vitals & Assign
                  </Button>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

        <UserAnalytics roleField="nurseId" userId="3" title="My Patient Activity" />
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;
