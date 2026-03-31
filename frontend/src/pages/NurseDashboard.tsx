import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISITS, PATIENTS, Visit } from '@/data/mockData';
import { Plus, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

const NurseDashboard: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    patientId: '', bloodPressure: '', temperature: '', pulse: '', weight: '', height: '',
    complaint: '', allergies: '', currentMedications: '', nurseNotes: '',
  });

  const handleNewVisit = () => {
    const patient = PATIENTS.find(p => p.id === form.patientId || p.name.toLowerCase() === form.patientId.toLowerCase());
    if (!patient) return;

    const visit: Visit = {
      id: `V${Date.now()}`, patientId: patient.id, date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5), status: 'waiting', nurseId: '3',
      vitals: { bloodPressure: form.bloodPressure, temperature: form.temperature, pulse: form.pulse, weight: form.weight, height: form.height },
      complaint: form.complaint, allergies: form.allergies, currentMedications: form.currentMedications, nurseNotes: form.nurseNotes,
    };
    setVisits(prev => [visit, ...prev]);
    setForm({ patientId: '', bloodPressure: '', temperature: '', pulse: '', weight: '', height: '', complaint: '', allergies: '', currentMedications: '', nurseNotes: '' });
    setDialogOpen(false);
  };

  const markReady = (visitId: string) => {
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'ready_for_doctor' as const } : v));
  };

  const getPatient = (id: string) => PATIENTS.find(p => p.id === id);

  const statusBadge = (status: Visit['status']) => {
    const map: Record<string, { label: string; cls: string }> = {
      waiting: { label: 'Waiting', cls: 'bg-warning/10 text-warning' },
      ready_for_doctor: { label: 'Ready for Doctor', cls: 'bg-info/10 text-info' },
      in_progress: { label: 'In Progress', cls: 'bg-primary/10 text-primary' },
      completed: { label: 'Completed', cls: 'bg-success/10 text-success' },
    };
    const s = map[status];
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>;
  };

  const todayVisits = visits.filter(v => v.date === '2026-03-27');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nurse Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage patient visits and record vitals</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> New Visit</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader><DialogTitle>New Patient Visit</DialogTitle></DialogHeader>
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <Label>Patient Name or ID</Label>
                  <Input value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))} placeholder="e.g. P001 or John Smith" />
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2">
                    <AlertCircle className="h-4 w-4 text-primary" /> Vitals
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Blood Pressure</Label><Input placeholder="120/80" value={form.bloodPressure} onChange={e => setForm(p => ({ ...p, bloodPressure: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Temperature (°F)</Label><Input placeholder="98.6" value={form.temperature} onChange={e => setForm(p => ({ ...p, temperature: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Pulse (bpm)</Label><Input placeholder="72" value={form.pulse} onChange={e => setForm(p => ({ ...p, pulse: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Weight (lbs)</Label><Input placeholder="150" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} /></div>
                    <div className="col-span-2 space-y-1"><Label className="text-xs">Height</Label><Input placeholder={'5\'10"'} value={form.height} onChange={e => setForm(p => ({ ...p, height: e.target.value }))} /></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Chief Complaint</h3>
                  <Textarea placeholder="Reason for visit..." value={form.complaint} onChange={e => setForm(p => ({ ...p, complaint: e.target.value }))} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Allergies & Medications</h3>
                  <div className="space-y-2">
                    <div className="space-y-1"><Label className="text-xs">Known Allergies</Label><Input placeholder="e.g. Penicillin, Latex" value={form.allergies} onChange={e => setForm(p => ({ ...p, allergies: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Current Medications</Label><Input placeholder="e.g. Lisinopril 10mg" value={form.currentMedications} onChange={e => setForm(p => ({ ...p, currentMedications: e.target.value }))} /></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Extra Notes</h3>
                  <Textarea placeholder="Preliminary notes..." value={form.nurseNotes} onChange={e => setForm(p => ({ ...p, nurseNotes: e.target.value }))} />
                </div>

                <Button onClick={handleNewVisit} className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <CheckCircle className="h-4 w-4" /> Ready for Doctor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-warning/10 p-2.5"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-2xl font-bold">{todayVisits.filter(v => v.status === 'waiting').length}</p><p className="text-xs text-muted-foreground">Waiting</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-info/10 p-2.5"><Users className="h-5 w-5 text-info" /></div><div><p className="text-2xl font-bold">{todayVisits.filter(v => v.status === 'ready_for_doctor').length}</p><p className="text-xs text-muted-foreground">Ready for Doctor</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-success/10 p-2.5"><CheckCircle className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold">{todayVisits.filter(v => v.status === 'completed').length}</p><p className="text-xs text-muted-foreground">Completed</p></div></CardContent></Card>
        </div>

        {/* Visit List */}
        <Card>
          <CardHeader><CardTitle>Today's Visits</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayVisits.map(v => {
                  const patient = getPatient(v.patientId);
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{patient?.name ?? v.patientId}</TableCell>
                      <TableCell className="text-muted-foreground">{v.time}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">{v.complaint ?? '—'}</TableCell>
                      <TableCell>{statusBadge(v.status)}</TableCell>
                      <TableCell>
                        {v.status === 'waiting' && (
                          <Button size="sm" variant="outline" onClick={() => markReady(v.id)}>Mark Ready</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;
