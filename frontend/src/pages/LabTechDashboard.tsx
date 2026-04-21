import React, { useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { VISITS, PATIENTS, Visit, VISIT_STATUS_LABELS, VISIT_STATUS_COLORS } from '@/data/mockData';
import { MOCK_USERS } from '@/contexts/AuthContext';
import { FlaskConical, Search, CheckCircle, Clock, FileText, Upload } from 'lucide-react';
import UserAnalytics from '@/components/UserAnalytics';

const LabTechDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('pending');
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [resultOpen, setResultOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [resultForm, setResultForm] = useState({
    testType: '', result: '', notes: '', fileName: '', markPending24: false,
  });

  const sidebarLinks = [
    { label: 'Pending Tests', icon: <Clock className="h-4 w-4" />, active: activeView === 'pending', onClick: () => setActiveView('pending') },
    { label: 'Completed Tests', icon: <CheckCircle className="h-4 w-4" />, active: activeView === 'completed', onClick: () => setActiveView('completed') },
    { label: 'Search Patients', icon: <Search className="h-4 w-4" />, active: activeView === 'search', onClick: () => setActiveView('search') },
  ];

  const getPatient = (id: string) => PATIENTS.find(p => p.id === id);
  const getDoctor = (id?: string) => id ? MOCK_USERS.find(u => u.id === id) : null;

  // Visits that need lab work
  const pendingLabVisits = visits.filter(v => v.status === 'in_lab' || (v.labRequests && v.labRequests.some(lr => lr.status !== 'complete')));
  const completedLabVisits = visits.filter(v => v.labResults && v.labResults.some(lr => lr.status === 'complete'));

  const filteredVisits = searchQuery.trim()
    ? visits.filter(v => {
        const p = getPatient(v.patientId);
        return p?.name.toLowerCase().includes(searchQuery.toLowerCase()) || p?.id.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : [];

  const openResult = (visitId: string) => {
    setSelectedVisitId(visitId);
    setResultForm({ testType: '', result: '', notes: '', fileName: '', markPending24: false });
    setResultOpen(true);
  };

  const saveResult = (complete: boolean) => {
    if (!selectedVisitId || !resultForm.testType) return;
    const status = complete ? 'complete' as const : 'pending' as const;
    setVisits(prev => prev.map(v => v.id === selectedVisitId ? {
      ...v,
      status: complete ? 'at_pharmacy' as const : v.status,
      labResults: [...(v.labResults || []), {
        id: `LR${Date.now()}`, testName: resultForm.testType, fileName: resultForm.fileName || 'N/A',
        uploadedBy: 'James Wilson', uploadedAt: new Date().toISOString(),
        result: resultForm.result, notes: resultForm.notes, status,
      }],
    } : v));
    setResultOpen(false);
    toast.success(complete ? 'Result saved & sent to doctor' : 'Result saved as pending');
  };

  const renderLabTable = (labVisits: Visit[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Hospital ID</TableHead>
          <TableHead>Requested By</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labVisits.map(v => {
          const p = getPatient(v.patientId);
          const doc = getDoctor(v.doctorId);
          return (
            <TableRow key={v.id}>
              <TableCell className="font-medium">{p?.name}</TableCell>
              <TableCell className="font-mono text-xs">{p?.id}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{doc?.name ?? '—'}</TableCell>
              <TableCell className="text-muted-foreground">{v.time}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${VISIT_STATUS_COLORS[v.status]}`}>
                  {VISIT_STATUS_LABELS[v.status]}
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => openResult(v.id)} className="text-xs gap-1">
                  <FileText className="h-3 w-3" /> {v.labResults?.length ? 'Add Result' : 'Enter Result'}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} searchPlaceholder="Search by Hospital ID or name...">
      <div className="space-y-6">
        <div>
          <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Laboratory</h1>
          <p className="text-sm text-muted-foreground">Manage test requests and upload results</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-warning/10 p-2.5"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-2xl font-bold">{pendingLabVisits.length}</p><p className="text-xs text-muted-foreground">Pending</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-primary/10 p-2.5"><FlaskConical className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">{visits.filter(v => v.status === 'in_lab').length}</p><p className="text-xs text-muted-foreground">In Progress</p></div></CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-5"><div className="rounded-lg bg-success/10 p-2.5"><CheckCircle className="h-5 w-5 text-success" /></div><div><p className="text-2xl font-bold">{completedLabVisits.length}</p><p className="text-xs text-muted-foreground">Completed</p></div></CardContent></Card>
        </div>

        {activeView === 'pending' && (
          <Card>
            <CardHeader><CardTitle>Pending Tests</CardTitle></CardHeader>
            <CardContent>
              {pendingLabVisits.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No pending lab tests.</p>
              ) : renderLabTable(pendingLabVisits)}
            </CardContent>
          </Card>
        )}

        {activeView === 'completed' && (
          <Card>
            <CardHeader><CardTitle>Completed Tests</CardTitle></CardHeader>
            <CardContent>
              {completedLabVisits.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No completed tests yet.</p>
              ) : renderLabTable(completedLabVisits)}
            </CardContent>
          </Card>
        )}

        {activeView === 'search' && (
          <Card>
            <CardHeader><CardTitle>Search Patients</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search by name or Hospital ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              {filteredVisits.length > 0 && renderLabTable(filteredVisits)}
            </CardContent>
          </Card>
        )}

        {/* Result Entry Modal */}
        <Dialog open={resultOpen} onOpenChange={setResultOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Lab Result Entry</DialogTitle></DialogHeader>
            {(() => {
              const visit = visits.find(v => v.id === selectedVisitId);
              const patient = visit ? getPatient(visit.patientId) : null;
              return (
                <div className="space-y-4 pt-2">
                  {patient && (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {patient.id}</p>
                    </div>
                  )}

                  {visit?.labRequests && visit.labRequests.length > 0 && (
                    <div className="rounded-xl border border-[hsla(202,100%,67%,0.25)] bg-[hsla(202,100%,67%,0.12)] p-3 shadow-ray-ring">
                      <p className="text-xs font-semibold text-info mb-1">Requested Tests</p>
                      {visit.labRequests.map(lr => (
                        <p key={lr.id} className="text-sm text-muted-foreground">{lr.testName} — {lr.status}</p>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1"><Label className="text-xs">Test Type</Label><Input placeholder="e.g. CBC, Urinalysis, Lipid Panel" value={resultForm.testType} onChange={e => setResultForm(p => ({ ...p, testType: e.target.value }))} /></div>
                  <div className="space-y-1"><Label className="text-xs">Result</Label><Textarea rows={3} placeholder="Enter test results..." value={resultForm.result} onChange={e => setResultForm(p => ({ ...p, result: e.target.value }))} /></div>
                  <div className="space-y-1"><Label className="text-xs">File Name (optional)</Label><Input placeholder="e.g. cbc_report.pdf" value={resultForm.fileName} onChange={e => setResultForm(p => ({ ...p, fileName: e.target.value }))} /></div>
                  <div className="space-y-1"><Label className="text-xs">Notes</Label><Input placeholder="Optional notes" value={resultForm.notes} onChange={e => setResultForm(p => ({ ...p, notes: e.target.value }))} /></div>

                  <div className="flex items-center gap-3">
                    <Checkbox checked={resultForm.markPending24} onCheckedChange={(v) => setResultForm(p => ({ ...p, markPending24: !!v }))} id="pending24" />
                    <Label htmlFor="pending24" className="text-sm">Mark as Pending (24+ hours)</Label>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => saveResult(true)} className="flex-1 gap-2" variant="cta">
                      <CheckCircle className="h-4 w-4" /> Save & Complete
                    </Button>
                    <Button onClick={() => saveResult(false)} variant="outline" className="flex-1 gap-2"><Clock className="h-4 w-4" /> Save as Pending</Button>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

        <UserAnalytics roleField="all" title="Lab Activity Overview" />
      </div>
    </DashboardLayout>
  );
};

export default LabTechDashboard;
