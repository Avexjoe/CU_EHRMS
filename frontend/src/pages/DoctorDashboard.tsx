import React, { useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import PatientSearch from '@/components/PatientSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { VISITS, PATIENTS, Patient, Visit, Prescription, COMMON_DRUGS, VISIT_STATUS_LABELS, VISIT_STATUS_COLORS } from '@/data/mockData';
import UserAnalytics from '@/components/UserAnalytics';
import { Stethoscope, User, Thermometer, AlertTriangle, History, Plus, Trash2, Save, FlaskConical, Send, Users, FileText, ClipboardList } from 'lucide-react';

type ReferralItem = {
  id: string;
  patientId: string;
  createdAt: string;
  note?: string;
};

const DoctorDashboard: React.FC = () => {
  const TODAY = '2026-03-27';
  const [activeView, setActiveView] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [consultation, setConsultation] = useState({ history: '', examination: '', diagnosis: '' });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newRx, setNewRx] = useState({ drug: '', dosage: '', frequency: '', duration: '', quantity: '', notes: '' });
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);

  const sidebarLinks = [
    { label: 'My Patients', icon: <Users className="h-4 w-4" />, active: activeView === 'patients', onClick: () => setActiveView('patients') },
    { label: 'Pending Referrals', icon: <Send className="h-4 w-4" />, active: activeView === 'referrals', onClick: () => setActiveView('referrals') },
    { label: 'Lab Results Review', icon: <FlaskConical className="h-4 w-4" />, active: activeView === 'lab', onClick: () => setActiveView('lab') },
  ];

  const myVisits = visits.filter(v => (v.doctorId === '2' || v.status === 'ready_for_doctor') && v.date === TODAY);
  const patientVisits = selectedPatient ? visits.filter(v => v.patientId === selectedPatient.id) : [];
  const sortedPatientVisits = patientVisits.slice().sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const activeVisit = sortedPatientVisits.filter(v => v.date === TODAY).slice(-1)[0] ?? sortedPatientVisits.slice(-1)[0];
  const pastVisits = patientVisits.filter(v => v.status === 'completed');

  const getPatient = (id: string) => PATIENTS.find(p => p.id === id);

  const onSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setConsultation({ history: '', examination: '', diagnosis: '' });
    setPrescriptions([]);
  };

  const canAddPrescription = Boolean(newRx.drug && newRx.dosage);

  const addPrescription = () => {
    if (!canAddPrescription) {
      toast.error('Select a drug and enter a dosage first');
      return;
    }
    setPrescriptions(prev => [...prev, { ...newRx, id: `RX${Date.now()}`, quantity: Number(newRx.quantity) || 1 }]);
    setNewRx({ drug: '', dosage: '', frequency: '', duration: '', quantity: '', notes: '' });
    toast.success('Prescription added');
  };

  const saveConsultation = () => {
    if (!activeVisit) {
      toast.error('Select a patient with a visit first');
      return;
    }
    setVisits(prev => prev.map(v => v.id === activeVisit.id ? {
      ...v, status: 'completed' as const, doctorId: '2',
      doctorNotes: consultation, prescriptions,
    } : v));
    toast.success('Consultation saved & visit completed');
  };

  const requestLabTest = () => {
    if (!activeVisit) {
      toast.error('Select a patient with a visit first');
      return;
    }
    setVisits(prev => prev.map(v => v.id === activeVisit.id ? {
      ...v, status: 'in_lab' as const,
      labRequests: [...(v.labRequests || []), { id: `LR${Date.now()}`, testName: 'Pending', requestedBy: '2', requestedAt: new Date().toISOString(), status: 'pending' as const }],
    } : v));
    toast.info('Lab test requested');
  };

  const referToDoctor = () => {
    if (!activeVisit || !selectedPatient) {
      toast.error('Select a patient with a visit first');
      return;
    }
    const note = consultation.diagnosis?.trim() ? `Dx: ${consultation.diagnosis.trim()}` : undefined;
    setReferrals(prev => [
      {
        id: `REF${Date.now()}`,
        patientId: selectedPatient.id,
        createdAt: new Date().toISOString(),
        note,
      },
      ...prev,
    ]);
    setActiveView('referrals');
    toast.success(`Referral created for ${selectedPatient.name}`);
  };

  // Check for completed lab results
  const pendingLabReview = visits.filter(v => v.labResults && v.labResults.some(lr => lr.status === 'complete') && v.doctorId === '2' && v.status !== 'completed');

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} searchPlaceholder="Search patients...">
      <div className="space-y-6">
        <div>
          <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Doctor's Console</h1>
          <p className="text-sm text-muted-foreground">Central University Hospital — Clinical Dashboard</p>
        </div>

        {/* Lab results notification */}
        {pendingLabReview.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-ray-ring flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">{pendingLabReview.length} Lab Result(s) Ready for Review</p>
                <p className="text-xs text-muted-foreground">Click to review completed lab results</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setActiveView('lab')} className="gap-1">
              Review Results
            </Button>
          </div>
        )}

        {activeView === 'patients' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Patient List */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Today's Patients</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {myVisits.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No patients assigned yet.</p>
                ) : (
                  myVisits.map(v => {
                    const p = getPatient(v.patientId);
                    const isSelected = selectedPatient?.id === v.patientId;
                    return (
                      <button key={v.id} onClick={() => p && onSelectPatient(p)}
                        className={`w-full text-left rounded-xl border p-3 shadow-ray-ring transition-opacity ${
                          isSelected
                            ? 'border-border/80 bg-muted/30 opacity-100'
                            : 'border-border/60 bg-card hover:opacity-60'
                        }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{p?.name}</p>
                            <p className="text-xs text-muted-foreground">{p?.id} · {v.time}</p>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${VISIT_STATUS_COLORS[v.status]}`}>
                            {VISIT_STATUS_LABELS[v.status]}
                          </span>
                        </div>
                        {v.complaint && <p className="text-xs text-muted-foreground mt-1 truncate">{v.complaint}</p>}
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPatient ? (
              <>
                {/* Patient Header */}
                <Card>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {selectedPatient.firstName?.charAt(0)}{selectedPatient.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{selectedPatient.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedPatient.id} · {selectedPatient.age}y · {selectedPatient.gender} · {selectedPatient.bloodType}</p>
                    </div>
                    {(selectedPatient.allergies.length > 0) && (
                      <div className="rounded-lg bg-destructive/10 px-3 py-1.5 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-xs font-medium text-destructive">{selectedPatient.allergies.join(', ')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Nurse Vitals */}
                {activeVisit?.vitals && (
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Thermometer className="h-4 w-4" /> Vitals Summary</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-5">
                        {[
                          { label: 'BP', value: activeVisit.vitals.bloodPressure },
                          { label: 'Temp', value: `${activeVisit.vitals.temperature}°C` },
                          { label: 'HR', value: `${activeVisit.vitals.pulse} bpm` },
                          { label: 'Weight', value: `${activeVisit.vitals.weight} kg` },
                          { label: 'Height', value: `${activeVisit.vitals.height} cm` },
                        ].map(item => (
                          <div key={item.label} className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center shadow-ray-ring">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                            <p className="text-lg font-bold text-foreground">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      {activeVisit.complaint && (
                        <div className="mt-3 rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                          <p className="text-xs text-muted-foreground mb-1">Chief Complaint</p>
                          <p className="text-sm">{activeVisit.complaint}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* History Accordion */}
                {pastVisits.length > 0 && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="history">
                      <AccordionTrigger className="px-4"><span className="flex items-center gap-2"><History className="h-4 w-4" /> Patient History ({pastVisits.length} past visits)</span></AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-3">
                          {pastVisits.map(v => (
                            <div key={v.id} className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{v.date}</span>
                                <span className="text-muted-foreground">{v.doctorNotes?.diagnosis ?? '—'}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{v.complaint}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {/* Observations */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Clinical Notes</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1"><Label className="text-xs">History</Label><Textarea rows={2} placeholder="Patient history..." value={consultation.history} onChange={e => setConsultation(p => ({ ...p, history: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Examination</Label><Textarea rows={2} placeholder="Exam findings..." value={consultation.examination} onChange={e => setConsultation(p => ({ ...p, examination: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Diagnosis</Label><Textarea rows={2} placeholder="Diagnosis..." value={consultation.diagnosis} onChange={e => setConsultation(p => ({ ...p, diagnosis: e.target.value }))} /></div>
                  </CardContent>
                </Card>

                {/* Prescription Builder */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Prescriptions</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 sm:grid-cols-6">
                      <div className="sm:col-span-2 space-y-1">
                        <Label className="text-xs">Drug</Label>
                        <Select value={newRx.drug} onValueChange={v => setNewRx(p => ({ ...p, drug: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>{COMMON_DRUGS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1"><Label className="text-xs">Qty</Label><Input placeholder="30" value={newRx.quantity} onChange={e => setNewRx(p => ({ ...p, quantity: e.target.value }))} /></div>
                      <div className="space-y-1"><Label className="text-xs">Dosage</Label><Input placeholder="500mg" value={newRx.dosage} onChange={e => setNewRx(p => ({ ...p, dosage: e.target.value }))} /></div>
                      <div className="space-y-1"><Label className="text-xs">Instructions</Label><Input placeholder="Twice daily" value={newRx.frequency} onChange={e => setNewRx(p => ({ ...p, frequency: e.target.value }))} /></div>
                      <div className="flex items-end">
                        <Button size="sm" onClick={addPrescription} className="gap-1 w-full">
                          <Plus className="h-4 w-4" /> Add
                        </Button>
                      </div>
                    </div>
                    {prescriptions.length > 0 && (
                      <Table>
                        <TableHeader><TableRow><TableHead>Drug</TableHead><TableHead>Dosage</TableHead><TableHead>Qty</TableHead><TableHead>Instructions</TableHead><TableHead className="w-12" /></TableRow></TableHeader>
                        <TableBody>
                          {prescriptions.map(rx => (
                            <TableRow key={rx.id}>
                              <TableCell className="font-medium">{rx.drug}</TableCell>
                              <TableCell>{rx.dosage}</TableCell>
                              <TableCell>{rx.quantity}</TableCell>
                              <TableCell>{rx.frequency}</TableCell>
                              <TableCell><Button variant="ghost" size="icon" onClick={() => setPrescriptions(prev => prev.filter(r => r.id !== rx.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={saveConsultation} className="gap-2" variant="cta">
                    <Save className="h-4 w-4" /> Save & Complete
                  </Button>
                  <Button variant="outline" onClick={requestLabTest} className="gap-2"><FlaskConical className="h-4 w-4" /> Request Lab Test</Button>
                  <Button variant="outline" onClick={referToDoctor} className="gap-2"><Send className="h-4 w-4" /> Refer to Doctor</Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
                  <Stethoscope className="h-12 w-12 opacity-20" />
                  <p className="text-lg font-medium">Select a patient to begin</p>
                  <p className="text-sm">Choose from today's list or search above</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        )}

        {activeView === 'lab' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FlaskConical className="h-4 w-4" /> Lab Results Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLabReview.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No completed lab results to review.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-28">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingLabReview.flatMap(v => (v.labResults || []).filter(lr => lr.status === 'complete').map(lr => ({ v, lr }))).map(({ v, lr }) => {
                      const p = getPatient(v.patientId);
                      return (
                        <TableRow key={lr.id}>
                          <TableCell className="font-medium">{p?.name ?? v.patientId}</TableCell>
                          <TableCell className="text-muted-foreground">{lr.testName}</TableCell>
                          <TableCell>
                            <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">Complete</span>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.info(`Opened ${lr.testName} for ${p?.name ?? v.patientId}`)}
                              className="gap-1"
                            >
                              <FileText className="h-4 w-4" /> Open
                            </Button>
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

        {activeView === 'referrals' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="h-4 w-4" /> Pending Referrals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {referrals.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No referrals created yet.</p>
              ) : (
                referrals.map(r => {
                  const p = getPatient(r.patientId);
                  return (
                    <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-ray-ring">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p?.name ?? r.patientId}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.note ?? 'No note'}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => toast.success('Referral sent')} className="gap-1">
                        <Send className="h-4 w-4" /> Send
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        )}

        <UserAnalytics roleField="doctorId" userId="2" title="My Patient Activity" />
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
