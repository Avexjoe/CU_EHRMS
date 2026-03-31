import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PatientSearch from '@/components/PatientSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISITS, Patient } from '@/data/mockData';
import { Pill, FileText } from 'lucide-react';

const PharmacistDashboard: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const patientVisits = selectedPatient
    ? VISITS.filter(v => v.patientId === selectedPatient.id && v.prescriptions && v.prescriptions.length > 0)
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacist Dashboard</h1>
          <p className="text-sm text-muted-foreground">Search patients and view prescriptions</p>
        </div>

        <PatientSearch onSelect={setSelectedPatient} />

        {selectedPatient ? (
          <div className="space-y-4">
            {patientVisits.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No prescriptions found for {selectedPatient.name}.</CardContent></Card>
            ) : (
              patientVisits.map(v => (
                <Card key={v.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><FileText className="h-5 w-5" /> Visit: {v.date} at {v.time}</span>
                      <span className="text-xs font-normal text-muted-foreground">Diagnosis: {v.doctorNotes?.diagnosis ?? '—'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Drug</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {v.prescriptions!.map(rx => (
                          <TableRow key={rx.id}>
                            <TableCell className="font-medium">{rx.drug}</TableCell>
                            <TableCell>{rx.dosage}</TableCell>
                            <TableCell>{rx.frequency}</TableCell>
                            <TableCell>{rx.duration}</TableCell>
                            <TableCell className="text-muted-foreground">{rx.notes || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <Card><CardContent className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Pill className="h-12 w-12 opacity-30" />
            <p>Search for a patient to view prescriptions</p>
          </CardContent></Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PharmacistDashboard;
