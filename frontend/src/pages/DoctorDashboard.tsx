import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PatientSearch from '@/components/PatientSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISITS, PATIENTS, Patient, Visit, Prescription, COMMON_DRUGS } from '@/data/mockData';
import { Eye, History, Stethoscope, Pill, Plus, Trash2, Save, User, Thermometer, AlertTriangle } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [activeTab, setActiveTab] = useState('visit');
  const [consultation, setConsultation] = useState({ history: '', examination: '', diagnosis: '' });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newRx, setNewRx] = useState({ drug: '', dosage: '', frequency: '', duration: '', notes: '' });

  const patientVisits = selectedPatient ? visits.filter(v => v.patientId === selectedPatient.id) : [];
  const activeVisit = patientVisits.find(v => v.status === 'ready_for_doctor' || v.status === 'in_progress');
  const pastVisits = patientVisits.filter(v => v.status === 'completed');

  const onSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setActiveTab('visit');
    setConsultation({ history: '', examination: '', diagnosis: '' });
    setPrescriptions([]);
  };

  const addPrescription = () => {
    if (!newRx.drug || !newRx.dosage) return;
    setPrescriptions(prev => [...prev, { ...newRx, id: `RX${Date.now()}` }]);
    setNewRx({ drug: '', dosage: '', frequency: '', duration: '', notes: '' });
  };

  const removePrescription = (id: string) => setPrescriptions(prev => prev.filter(r => r.id !== id));

  const saveConsultation = () => {
    if (!activeVisit) return;
    setVisits(prev => prev.map(v => v.id === activeVisit.id ? {
      ...v, status: 'completed' as const, doctorId: '2',
      doctorNotes: consultation, prescriptions,
    } : v));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Search patients, consult, and prescribe</p>
        </div>

        <PatientSearch onSelect={onSelectPatient} />

        {selectedPatient && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="visit" className="gap-2"><Eye className="h-4 w-4" /> View Visit</TabsTrigger>
              <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4" /> Patient History</TabsTrigger>
              <TabsTrigger value="consultation" className="gap-2"><Stethoscope className="h-4 w-4" /> Consultation</TabsTrigger>
              <TabsTrigger value="prescription" className="gap-2"><Pill className="h-4 w-4" /> Prescription</TabsTrigger>
            </TabsList>

            {/* VIEW VISIT */}
            <TabsContent value="visit" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Demographics</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selectedPatient.name}</span></div>
                    <div><span className="text-muted-foreground">Age:</span> <span className="font-medium">{selectedPatient.age}</span></div>
                    <div><span className="text-muted-foreground">Gender:</span> <span className="font-medium">{selectedPatient.gender}</span></div>
                    <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{selectedPatient.dob}</span></div>
                    <div><span className="text-muted-foreground">Blood Type:</span> <span className="font-medium">{selectedPatient.bloodType}</span></div>
                    <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selectedPatient.phone}</span></div>
                  </div>
                </CardContent>
              </Card>

              {activeVisit?.vitals && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Thermometer className="h-5 w-5" /> Vitals (from Nurse)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 text-sm">
                      <div className="rounded-lg bg-muted p-3 text-center"><p className="text-xs text-muted-foreground">Blood Pressure</p><p className="text-lg font-bold text-foreground">{activeVisit.vitals.bloodPressure}</p></div>
                      <div className="rounded-lg bg-muted p-3 text-center"><p className="text-xs text-muted-foreground">Temperature</p><p className="text-lg font-bold text-foreground">{activeVisit.vitals.temperature}°F</p></div>
                      <div className="rounded-lg bg-muted p-3 text-center"><p className="text-xs text-muted-foreground">Pulse</p><p className="text-lg font-bold text-foreground">{activeVisit.vitals.pulse} bpm</p></div>
                      <div className="rounded-lg bg-muted p-3 text-center"><p className="text-xs text-muted-foreground">Weight</p><p className="text-lg font-bold text-foreground">{activeVisit.vitals.weight} lbs</p></div>
                      <div className="rounded-lg bg-muted p-3 text-center"><p className="text-xs text-muted-foreground">Height</p><p className="text-lg font-bold text-foreground">{activeVisit.vitals.height}</p></div>
                    </div>
                    {activeVisit.complaint && <div className="mt-4 rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground mb-1">Chief Complaint</p><p className="text-sm">{activeVisit.complaint}</p></div>}
                    {activeVisit.nurseNotes && <div className="mt-2 rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground mb-1">Nurse Notes</p><p className="text-sm">{activeVisit.nurseNotes}</p></div>}
                  </CardContent>
                </Card>
              )}

              {(selectedPatient.allergies.length > 0 || selectedPatient.chronicConditions.length > 0) && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /> Allergies & Chronic Conditions</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {selectedPatient.allergies.length > 0 && <div><span className="text-muted-foreground">Allergies:</span> <span className="font-medium text-destructive">{selectedPatient.allergies.join(', ')}</span></div>}
                    {selectedPatient.chronicConditions.length > 0 && <div><span className="text-muted-foreground">Chronic Conditions:</span> <span className="font-medium">{selectedPatient.chronicConditions.join(', ')}</span></div>}
                  </CardContent>
                </Card>
              )}

              {!activeVisit && <Card><CardContent className="p-8 text-center text-muted-foreground">No active visit for this patient.</CardContent></Card>}
            </TabsContent>

            {/* PATIENT HISTORY */}
            <TabsContent value="history">
              <Card>
                <CardHeader><CardTitle>Visit History</CardTitle></CardHeader>
                <CardContent>
                  {pastVisits.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">No past visits for this patient.</p>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Complaint</TableHead><TableHead>Diagnosis</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {pastVisits.map(v => (
                          <TableRow key={v.id}>
                            <TableCell className="font-medium">{v.date}</TableCell>
                            <TableCell className="text-muted-foreground">{v.time}</TableCell>
                            <TableCell className="text-muted-foreground">{v.complaint ?? '—'}</TableCell>
                            <TableCell className="text-muted-foreground">{v.doctorNotes?.diagnosis ?? '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* CONSULTATION */}
            <TabsContent value="consultation">
              <Card>
                <CardHeader><CardTitle>Consultation Notes</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>History Taking</Label><Textarea rows={3} placeholder="Document patient history..." value={consultation.history} onChange={e => setConsultation(p => ({ ...p, history: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Physical Examination</Label><Textarea rows={3} placeholder="Physical exam findings..." value={consultation.examination} onChange={e => setConsultation(p => ({ ...p, examination: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Diagnosis</Label><Textarea rows={2} placeholder="Diagnosis..." value={consultation.diagnosis} onChange={e => setConsultation(p => ({ ...p, diagnosis: e.target.value }))} /></div>
                  <Button onClick={saveConsultation} className="gap-2" disabled={!activeVisit}><Save className="h-4 w-4" /> Save & Complete Visit</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PRESCRIPTION */}
            <TabsContent value="prescription">
              <Card>
                <CardHeader><CardTitle>Prescriptions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="space-y-1">
                      <Label className="text-xs">Drug</Label>
                      <Select value={newRx.drug} onValueChange={v => setNewRx(p => ({ ...p, drug: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select drug" /></SelectTrigger>
                        <SelectContent>{COMMON_DRUGS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Dosage</Label><Input placeholder="e.g. 500mg" value={newRx.dosage} onChange={e => setNewRx(p => ({ ...p, dosage: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Frequency</Label><Input placeholder="e.g. Twice daily" value={newRx.frequency} onChange={e => setNewRx(p => ({ ...p, frequency: e.target.value }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Duration</Label><Input placeholder="e.g. 7 days" value={newRx.duration} onChange={e => setNewRx(p => ({ ...p, duration: e.target.value }))} /></div>
                    <div className="flex items-end"><Button onClick={addPrescription} size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add</Button></div>
                  </div>
                  {prescriptions.length > 0 && (
                    <Table>
                      <TableHeader><TableRow><TableHead>Drug</TableHead><TableHead>Dosage</TableHead><TableHead>Frequency</TableHead><TableHead>Duration</TableHead><TableHead className="w-16" /></TableRow></TableHeader>
                      <TableBody>
                        {prescriptions.map(rx => (
                          <TableRow key={rx.id}>
                            <TableCell className="font-medium">{rx.drug}</TableCell>
                            <TableCell>{rx.dosage}</TableCell>
                            <TableCell>{rx.frequency}</TableCell>
                            <TableCell>{rx.duration}</TableCell>
                            <TableCell><Button variant="ghost" size="icon" onClick={() => removePrescription(rx.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!selectedPatient && (
          <Card><CardContent className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Stethoscope className="h-12 w-12 opacity-30" />
            <p>Search for a patient to begin</p>
          </CardContent></Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
