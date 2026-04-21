import React, { useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VISITS, PATIENTS, Visit, VisitStatus } from '@/data/mockData';
import { MOCK_USERS } from '@/contexts/AuthContext';
import { Pill, FileText, AlertTriangle, CheckCircle, ShoppingCart, LogOut, ClipboardList, Package } from 'lucide-react';
import UserAnalytics from '@/components/UserAnalytics';

const PharmacistDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('pending');
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [dispenseOpen, setDispenseOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const sidebarLinks = [
    { label: 'Prescriptions to Dispense', icon: <ClipboardList className="h-4 w-4" />, active: activeView === 'pending', onClick: () => setActiveView('pending') },
    { label: 'Dispensed Today', icon: <Package className="h-4 w-4" />, active: activeView === 'dispensed', onClick: () => setActiveView('dispensed') },
    { label: 'External Prescriptions', icon: <FileText className="h-4 w-4" />, active: activeView === 'external', onClick: () => setActiveView('external') },
  ];

  const getPatient = (id: string) => PATIENTS.find(p => p.id === id);
  const getDoctor = (id?: string) => id ? MOCK_USERS.find(u => u.id === id) : null;

  const pendingVisits = visits.filter(v => v.status === 'at_pharmacy' && v.prescriptions && v.prescriptions.length > 0);
  const dispensedVisits = visits.filter(v => v.prescriptions?.some(rx => rx.dispensed) && v.date === '2026-03-27');

  const openDispense = (visitId: string) => {
    const visit = visits.find(v => v.id === visitId);
    if (visit?.prescriptions) {
      const qtys: Record<string, number> = {};
      visit.prescriptions.forEach(rx => { qtys[rx.id] = rx.quantity || 1; });
      setQuantities(qtys);
    }
    setSelectedVisitId(visitId);
    setDispenseOpen(true);
  };

  const checkInteractions = () => {
    toast.warning('Drug Interaction Alert', {
      description: 'Potential interaction found between Metformin and contrast agents. Please verify with prescribing doctor.',
    });
  };

  const dispenseAndPrice = () => {
    if (!selectedVisitId) return;
    setVisits(prev => prev.map(v => v.id === selectedVisitId ? {
      ...v,
      status: 'pending_payment' as VisitStatus,
      prescriptions: v.prescriptions?.map(rx => ({
        ...rx, dispensed: true, quantity: quantities[rx.id] || rx.quantity,
      })),
      payment: {
        id: `PAY${Date.now()}`,
        totalAmount: v.prescriptions?.reduce((sum, rx) => sum + (rx.price || 0) * (quantities[rx.id] || rx.quantity || 1), 0) || 0,
        amountPaid: 0,
        status: 'pending' as const,
        items: v.prescriptions?.map(rx => ({
          description: `${rx.drug} ${rx.dosage} x${quantities[rx.id] || rx.quantity || 1}`,
          amount: (rx.price || 0) * (quantities[rx.id] || rx.quantity || 1),
        })) || [],
      },
    } : v));
    setDispenseOpen(false);
    toast.success('Prescriptions dispensed. Price sent to cashier.');
  };

  const checkOutPatient = (visitId: string) => {
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'completed' as VisitStatus } : v));
    const visit = visits.find(v => v.id === visitId);
    const patient = visit ? getPatient(visit.patientId) : null;
    toast.info(`${patient?.name ?? 'Patient'} encounter closed at pharmacy.`);
  };

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} searchPlaceholder="Search prescriptions...">
      <div className="space-y-6">
        <div>
          <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Pharmacy</h1>
          <p className="text-sm text-muted-foreground">Dispense medications and manage prescriptions</p>
        </div>

        <Tabs value={activeView === 'dispensed' ? 'dispensed' : 'pending'} onValueChange={v => setActiveView(v)}>
          <TabsList>
            <TabsTrigger value="pending">Pending Dispense</TabsTrigger>
            <TabsTrigger value="dispensed">Dispensed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingVisits.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No pending prescriptions.</CardContent></Card>
            ) : (
              <div className="space-y-4">
                {pendingVisits.map(v => {
                  const p = getPatient(v.patientId);
                  const doc = getDoctor(v.doctorId);
                  return (
                    <Card key={v.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                          <span className="flex items-center gap-2"><Pill className="h-4 w-4" /> {p?.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{p?.id}</span>
                        </CardTitle>
                        {doc && (
                          <p className="text-sm text-muted-foreground">
                            Prescribed by: <span className="font-medium text-foreground">{doc.name}</span>
                            <span className="ml-2 rounded-md border border-border/60 bg-muted/20 px-1.5 py-0.5 text-xs font-mono shadow-ray-ring">
                              ID: {doc.id}
                            </span>
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Table>
                          <TableHeader><TableRow><TableHead>Drug</TableHead><TableHead>Dosage</TableHead><TableHead>Qty</TableHead><TableHead>Instructions</TableHead><TableHead>Price (GHS)</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {v.prescriptions!.map(rx => (
                              <TableRow key={rx.id}>
                                <TableCell className="font-medium">{rx.drug}</TableCell>
                                <TableCell>{rx.dosage}</TableCell>
                                <TableCell>{rx.quantity || 1}</TableCell>
                                <TableCell className="text-muted-foreground">{rx.frequency}, {rx.duration}</TableCell>
                                <TableCell className="font-medium">₵{((rx.price || 0) * (rx.quantity || 1)).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* Current drugs for interaction check */}
                        {v.currentMedications && (
                          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Patient's Current Drugs</p>
                            <p className="text-sm">{v.currentMedications}</p>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          <Button variant="outline" onClick={checkInteractions} className="gap-2 text-warning border-warning/30 hover:bg-warning/10">
                            <AlertTriangle className="h-4 w-4" /> Check Interactions
                          </Button>
                          <Button onClick={() => openDispense(v.id)} className="gap-2">
                            <ShoppingCart className="h-4 w-4" /> Dispense & Add Price
                          </Button>
                          <Button variant="outline" onClick={() => checkOutPatient(v.id)} className="gap-2 text-muted-foreground">
                            <LogOut className="h-4 w-4" /> Check Out
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dispensed">
            {dispensedVisits.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No dispensed prescriptions today.</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {dispensedVisits.map(v => {
                  const p = getPatient(v.patientId);
                  return (
                    <Card key={v.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{p?.name}</p>
                          <p className="text-xs text-muted-foreground">{v.prescriptions?.map(rx => rx.drug).join(', ')}</p>
                        </div>
                        <span className="rounded-full bg-success/10 text-success px-2.5 py-0.5 text-xs font-medium">Dispensed</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dispense Modal */}
        <Dialog open={dispenseOpen} onOpenChange={setDispenseOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Dispense Prescriptions</DialogTitle></DialogHeader>
            {(() => {
              const visit = visits.find(v => v.id === selectedVisitId);
              const patient = visit ? getPatient(visit.patientId) : null;
              const isPaid = visit?.payment?.status === 'paid';
              return (
                <div className="space-y-4 pt-2">
                  {patient && (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.id}</p>
                    </div>
                  )}

                  {isPaid && (
                    <div className="rounded-xl border border-[hsla(151,59%,59%,0.25)] bg-[hsla(151,59%,59%,0.12)] p-3 shadow-ray-ring flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <p className="text-sm text-success font-medium">Payment confirmed</p>
                    </div>
                  )}

                  {visit?.prescriptions?.map(rx => (
                    <div key={rx.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <div>
                        <p className="text-sm font-medium">{rx.drug} {rx.dosage}</p>
                        <p className="text-xs text-muted-foreground">{rx.frequency}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Qty:</Label>
                        <Input className="w-16 h-8 text-center" type="number" value={quantities[rx.id] || rx.quantity || 1}
                          onChange={e => setQuantities(prev => ({ ...prev, [rx.id]: Number(e.target.value) }))} />
                      </div>
                    </div>
                  ))}

                  <Button onClick={dispenseAndPrice} variant="cta" className="w-full gap-2">
                    <ShoppingCart className="h-4 w-4" /> Dispense & Send to Cashier
                  </Button>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

        <UserAnalytics roleField="all" title="Pharmacy Activity Overview" />
      </div>
    </DashboardLayout>
  );
};

export default PharmacistDashboard;
