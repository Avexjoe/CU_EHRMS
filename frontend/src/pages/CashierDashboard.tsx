import React, { useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VISITS, PATIENTS, Visit, VisitStatus } from '@/data/mockData';
import { Banknote, Clock, CheckCircle, Printer, CreditCard, Smartphone, Wallet } from 'lucide-react';
import UserAnalytics from '@/components/UserAnalytics';

const CashierDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('pending');
  const [visits, setVisits] = useState<Visit[]>([...VISITS]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [amountReceived, setAmountReceived] = useState('');

  const sidebarLinks = [
    { label: 'Pending Payments', icon: <Clock className="h-4 w-4" />, active: activeView === 'pending', onClick: () => setActiveView('pending') },
    { label: "Today's Transactions", icon: <Banknote className="h-4 w-4" />, active: activeView === 'transactions', onClick: () => setActiveView('transactions') },
    { label: 'Print Receipts', icon: <Printer className="h-4 w-4" />, active: activeView === 'receipts', onClick: () => setActiveView('receipts') },
  ];

  const getPatient = (id: string) => PATIENTS.find(p => p.id === id);

  const pendingPayments = visits.filter(v => v.payment?.status === 'pending');
  const paidToday = visits.filter(v => v.payment?.status === 'paid' && v.date === '2026-03-27');
  const totalPending = pendingPayments.reduce((sum, v) => sum + (v.payment?.totalAmount || 0), 0);
  const totalCollected = paidToday.reduce((sum, v) => sum + (v.payment?.amountPaid || 0), 0);

  const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const printReceiptForVisit = (visitId: string) => {
    const visit = visits.find(v => v.id === visitId);
    if (!visit?.payment || visit.payment.status !== 'paid') {
      toast.error('Receipt is only available for paid transactions');
      return;
    }

    const patient = getPatient(visit.patientId);
    const paidAt = visit.payment.paidAt ? new Date(visit.payment.paidAt) : null;
    const receiptNo = `${visit.payment.id}-${visit.id}`;

    const lines = visit.payment.items
      .map(i => `<tr><td>${escapeHtml(i.description)}</td><td style="text-align:right;">₵${i.amount.toFixed(2)}</td></tr>`)
      .join('');

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Receipt ${escapeHtml(receiptNo)}</title>
    <style>
      :root { color-scheme: light; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif; margin: 0; padding: 24px; color: #0b0c0e; }
      .card { max-width: 720px; margin: 0 auto; border: 1px solid #e6e6e6; border-radius: 12px; padding: 20px; }
      .row { display: flex; justify-content: space-between; gap: 12px; }
      .muted { color: #5b6068; font-size: 12px; }
      h1 { font-size: 18px; margin: 0 0 8px; }
      h2 { font-size: 14px; margin: 16px 0 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { padding: 8px 0; border-bottom: 1px solid #efefef; font-size: 13px; }
      th { text-align: left; color: #5b6068; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; }
      .total { font-weight: 700; font-size: 14px; }
      .spacer { height: 12px; }
      @media print { body { padding: 0; } .card { border: 0; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="row">
        <div>
          <h1>MedVault-Central</h1>
          <div class="muted">University Hospital EHR</div>
        </div>
        <div style="text-align:right;">
          <div class="muted">Receipt</div>
          <div style="font-weight:700;">${escapeHtml(receiptNo)}</div>
        </div>
      </div>

      <div class="spacer"></div>
      <div class="row">
        <div>
          <div class="muted">Patient</div>
          <div style="font-weight:600;">${escapeHtml(patient?.name ?? '—')}</div>
          <div class="muted">${escapeHtml(patient?.id ?? visit.patientId)}</div>
        </div>
        <div style="text-align:right;">
          <div class="muted">Paid At</div>
          <div style="font-weight:600;">${escapeHtml(paidAt ? `${paidAt.toLocaleDateString()} ${paidAt.toLocaleTimeString()}` : '—')}</div>
          <div class="muted">Method: ${escapeHtml((visit.payment.method ?? '—').replace('_', ' '))}</div>
        </div>
      </div>

      <h2>Items</h2>
      <table>
        <thead>
          <tr><th>Description</th><th style="text-align:right;">Amount</th></tr>
        </thead>
        <tbody>
          ${lines}
          <tr>
            <td class="total">Total</td>
            <td class="total" style="text-align:right;">₵${visit.payment.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="muted">Amount Paid</td>
            <td class="muted" style="text-align:right;">₵${visit.payment.amountPaid.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="spacer"></div>
      <div class="muted">Thank you.</div>
    </div>
    <script>
      window.addEventListener('load', () => { window.focus(); window.print(); });
    </script>
  </body>
</html>`;

    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      toast.error('Popup blocked. Allow popups to print receipts.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  const openPayment = (visitId: string) => {
    setSelectedVisitId(visitId);
    setPaymentMethod('');
    setAmountReceived('');
    setPaymentOpen(true);
  };

  const markAsPaid = () => {
    if (!selectedVisitId || !paymentMethod) return;
    const visit = visits.find(v => v.id === selectedVisitId);
    const amount = Number(amountReceived) || visit?.payment?.totalAmount || 0;

    setVisits(prev => prev.map(v => v.id === selectedVisitId ? {
      ...v,
      payment: v.payment ? {
        ...v.payment,
        status: 'paid' as const,
        method: paymentMethod as 'cash' | 'mobile_money' | 'card',
        amountPaid: amount,
        paidAt: new Date().toISOString(),
      } : v.payment,
    } : v));
    setPaymentOpen(false);
    const patient = visit ? getPatient(visit.patientId) : null;
    toast.success(`Payment received from ${patient?.name ?? 'patient'}`, {
      description: `GHS ${amount.toFixed(2)} via ${paymentMethod.replace('_', ' ')}`,
    });
  };

  return (
    <DashboardLayout sidebarLinks={sidebarLinks} searchPlaceholder="Search patients...">
      <div className="space-y-6">
        <div>
          <h1 className="text-[24px] font-medium tracking-[0.2px] text-foreground">Cashier</h1>
          <p className="text-sm text-muted-foreground">Process payments and print receipts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-warning/20">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-warning/10 p-3"><Clock className="h-6 w-6 text-warning" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">₵{totalPending.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total Pending Today ({pendingPayments.length} patients)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/20">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-success/10 p-3"><CheckCircle className="h-6 w-6 text-success" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">₵{totalCollected.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total Collected Today ({paidToday.length} transactions)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        {activeView === 'pending' && (
          <Card>
            <CardHeader><CardTitle>Pending Payments</CardTitle></CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No pending payments.</p>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map(v => {
                    const p = getPatient(v.patientId);
                    return (
                      <div
                        key={v.id}
                        className="rounded-xl border border-border/60 bg-card p-4 shadow-ray-ring flex items-center justify-between transition-opacity cursor-pointer hover:opacity-60"
                        onClick={() => openPayment(v.id)}
                      >
                        <div>
                          <p className="font-medium text-foreground">{p?.name}</p>
                          <p className="text-xs text-muted-foreground">{p?.id}</p>
                          <p className="text-xs text-muted-foreground mt-1">{v.payment?.items.map(i => i.description).join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-foreground">₵{(v.payment?.totalAmount || 0).toFixed(2)}</p>
                          <span className="rounded-full bg-warning/10 text-warning px-2.5 py-0.5 text-xs font-medium">Pending</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Today's Transactions */}
        {activeView === 'transactions' && (
          <Card>
            <CardHeader><CardTitle>Today's Transactions</CardTitle></CardHeader>
            <CardContent>
              {paidToday.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No transactions today.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Time</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {paidToday.map(v => {
                      const p = getPatient(v.patientId);
                      return (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{p?.name}</TableCell>
                          <TableCell className="font-bold">₵{(v.payment?.amountPaid || 0).toFixed(2)}</TableCell>
                          <TableCell className="capitalize text-muted-foreground">{v.payment?.method?.replace('_', ' ')}</TableCell>
                          <TableCell className="text-muted-foreground">{v.payment?.paidAt ? new Date(v.payment.paidAt).toLocaleTimeString() : '—'}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => printReceiptForVisit(v.id)}>
                              <Printer className="h-3 w-3" /> Receipt
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

        {activeView === 'receipts' && (
          <Card>
            <CardHeader><CardTitle>Print Receipts</CardTitle></CardHeader>
            <CardContent>
              <p className="py-12 text-center text-muted-foreground">Select a paid transaction to print an official receipt.</p>
            </CardContent>
          </Card>
        )}

        {/* Payment Modal */}
        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Process Payment</DialogTitle></DialogHeader>
            {(() => {
              const visit = visits.find(v => v.id === selectedVisitId);
              const patient = visit ? getPatient(visit.patientId) : null;
              return (
                <div className="space-y-4 pt-2">
                  {patient && (
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 shadow-ray-ring">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.id}</p>
                    </div>
                  )}

                  {/* Breakdown */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Breakdown</p>
                    {visit?.payment?.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.description}</span>
                        <span className="font-medium">₵{item.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm border-t border-border/60 pt-2 font-bold">
                      <span>Total</span>
                      <span>₵{(visit?.payment?.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'cash', label: 'Cash', icon: <Wallet className="h-5 w-5" /> },
                        { value: 'mobile_money', label: 'MoMo', icon: <Smartphone className="h-5 w-5" /> },
                        { value: 'card', label: 'Card', icon: <CreditCard className="h-5 w-5" /> },
                      ].map(m => (
                        <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                          className={`rounded-xl border p-3 flex flex-col items-center gap-1 shadow-ray-ring transition-opacity ${
                            paymentMethod === m.value
                              ? 'border-border/80 bg-muted/30 text-foreground opacity-100'
                              : 'border-border/60 bg-card text-muted-foreground hover:opacity-60'
                          }`}
                          type="button">
                          {m.icon}
                          <span className="text-xs font-medium">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Amount Received (GHS)</Label>
                    <Input type="number" placeholder={`${(visit?.payment?.totalAmount || 0).toFixed(2)}`} value={amountReceived} onChange={e => setAmountReceived(e.target.value)} />
                  </div>

                  <Button
                    onClick={markAsPaid}
                    disabled={!paymentMethod}
                    variant="outline"
                    className="w-full gap-2 border-[hsla(151,59%,59%,0.25)] bg-[hsla(151,59%,59%,0.12)] text-success"
                  >
                    <CheckCircle className="h-5 w-5" /> Mark as Paid
                  </Button>

                  {visit?.payment?.status === 'paid' && (
                    <Button variant="outline" className="w-full gap-2" onClick={() => selectedVisitId && printReceiptForVisit(selectedVisitId)}>
                      <Printer className="h-4 w-4" /> Print Official Receipt
                    </Button>
                  )}
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

        <UserAnalytics roleField="all" title="Cashier Activity Overview" />
      </div>
    </DashboardLayout>
  );
};

export default CashierDashboard;
