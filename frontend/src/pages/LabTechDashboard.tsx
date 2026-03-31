import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PatientSearch from '@/components/PatientSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISITS, Patient, LabResult } from '@/data/mockData';
import { FlaskConical, Upload, FileText, Paperclip } from 'lucide-react';

const LabTechDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [labResults, setLabResults] = useState<Record<string, LabResult[]>>({});
  const [newResult, setNewResult] = useState({ testName: '', fileName: '', notes: '' });

  const patientVisits = selectedPatient ? VISITS.filter(v => v.patientId === selectedPatient.id) : [];

  const addResult = (visitId: string) => {
    if (!newResult.testName || !newResult.fileName) return;
    const result: LabResult = {
      id: `LR${Date.now()}`, testName: newResult.testName, fileName: newResult.fileName,
      uploadedBy: 'James Wilson', uploadedAt: new Date().toISOString(), notes: newResult.notes,
    };
    setLabResults(prev => ({ ...prev, [visitId]: [...(prev[visitId] || []), result] }));
    setNewResult({ testName: '', fileName: '', notes: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Technician Dashboard</h1>
          <p className="text-sm text-muted-foreground">Search patients and attach lab results</p>
        </div>

        <PatientSearch onSelect={setSelectedPatient} />

        {selectedPatient ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Visits for {selectedPatient.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patientVisits.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">No visits found.</p>
                ) : (
                  <div className="space-y-6">
                    {patientVisits.map(v => (
                      <div key={v.id} className="rounded-lg border border-border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">Visit: {v.date} at {v.time}</p>
                            <p className="text-xs text-muted-foreground">{v.complaint ?? 'No complaint recorded'}</p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">{v.status.replace(/_/g, ' ')}</span>
                        </div>

                        {(labResults[v.id] || []).length > 0 && (
                          <Table>
                            <TableHeader><TableRow><TableHead>Test</TableHead><TableHead>File</TableHead><TableHead>Notes</TableHead><TableHead>Uploaded</TableHead></TableRow></TableHeader>
                            <TableBody>
                              {(labResults[v.id] || []).map(r => (
                                <TableRow key={r.id}>
                                  <TableCell className="font-medium">{r.testName}</TableCell>
                                  <TableCell className="flex items-center gap-1 text-primary"><Paperclip className="h-3 w-3" />{r.fileName}</TableCell>
                                  <TableCell className="text-muted-foreground">{r.notes || '—'}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">{new Date(r.uploadedAt).toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}

                        <div className="rounded-lg bg-muted/50 p-3 space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attach New Result</p>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="space-y-1"><Label className="text-xs">Test Name</Label><Input placeholder="e.g. CBC, Urinalysis" value={newResult.testName} onChange={e => setNewResult(p => ({ ...p, testName: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">File Name</Label><Input placeholder="e.g. cbc_results.pdf" value={newResult.fileName} onChange={e => setNewResult(p => ({ ...p, fileName: e.target.value }))} /></div>
                            <div className="space-y-1"><Label className="text-xs">Notes</Label><Input placeholder="Optional notes" value={newResult.notes} onChange={e => setNewResult(p => ({ ...p, notes: e.target.value }))} /></div>
                          </div>
                          <Button size="sm" onClick={() => addResult(v.id)} className="gap-2"><Upload className="h-4 w-4" /> Attach File</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card><CardContent className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <FlaskConical className="h-12 w-12 opacity-30" />
            <p>Search for a patient to attach lab results</p>
          </CardContent></Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LabTechDashboard;
