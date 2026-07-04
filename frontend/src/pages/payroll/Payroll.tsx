import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockPayroll } from '../../data/mockData';
import type { PayrollRecord } from '../../types';
import { 
  BadgeDollarSign, 
  Download, 
  Printer, 
  ArrowUpRight, 
  Scale, 
  Send,
  Building
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const Payroll: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';

  // State
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayroll);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  if (!user) return null;

  // Filter records based on role
  const displayRecords = isAdmin 
    ? payrollRecords 
    : payrollRecords.filter(r => r.employeeId === user.id);

  // Stats calculation
  const personalRecords = payrollRecords.filter(r => r.employeeId === user.id);
  const currentSlip = personalRecords[0] || payrollRecords[0];

  const companyMonthlyTotal = payrollRecords
    .filter(r => r.month === 'June')
    .reduce((sum, r) => sum + r.netSalary, 0);

  const averageStaffPay = companyMonthlyTotal / payrollRecords.filter(r => r.month === 'June').length;

  const handleDownload = (record: PayrollRecord) => {
    toast('Downloading Payslip', `Generating ${record.month}_${record.year}_Payslip.pdf. Check your downloads directory.`, 'success');
  };

  const handleOpenPayslip = (record: PayrollRecord) => {
    setSelectedPayslip(record);
    setIsPayslipOpen(true);
  };

  const handleProcessBatch = () => {
    setIsProcessingBatch(true);
    setTimeout(() => {
      setPayrollRecords(prev => prev.map(r => 
        r.status === 'Processing' ? { ...r, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] } : r
      ));
      setIsProcessingBatch(false);
      toast('Payroll Released', 'June 2026 payroll batch has been approved and paid.', 'success');
    }, 1500);
  };

  // Recharts color palette
  const COLORS = ['#6366f1', '#f59e0b', '#f43f5e'];

  // Personal salary breakdown data
  const personalBreakdown = currentSlip ? [
    { name: 'Base Pay', value: currentSlip.baseSalary },
    { name: 'Allowances', value: currentSlip.allowances.housing + currentSlip.allowances.transport + currentSlip.allowances.medical },
    { name: 'Deductions', value: currentSlip.deductions.tax + currentSlip.deductions.providentFund + currentSlip.deductions.insurance }
  ] : [];

  return (
    <div className="space-y-6 select-none">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {isAdmin ? 'Corporate Payroll Center' : 'Compensation & Payslips'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isAdmin ? 'Audit payroll cost logs and authorize batch transfers.' : 'View monthly pay summaries, allowances, and download payslips.'}
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            className="flex items-center gap-2 text-xs font-bold rounded-xl h-10"
            onClick={handleProcessBatch}
            isLoading={isProcessingBatch}
          >
            <Send className="h-4 w-4" />
            <span>Process June Batch</span>
          </Button>
        )}
      </div>

      {/* Summary KPI Cards */}
      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Monthly Budget</p>
              <p className="text-2xl font-black text-foreground mt-0.5">${companyMonthlyTotal.toLocaleString()}</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <BadgeDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Average Staff Yield</p>
              <p className="text-2xl font-black text-foreground mt-0.5">${averageStaffPay.toFixed(0)}/mo</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Processing status</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="status" status="processing" className="font-extrabold px-3.5 py-0.5">Ready for Release</Badge>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Last Net Salary</p>
              <p className="text-2xl font-black text-foreground mt-0.5">${currentSlip?.netSalary.toLocaleString()}</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Monthly Deductions</p>
              <p className="text-2xl font-black text-rose-500 mt-0.5">
                -${(currentSlip?.deductions.tax + currentSlip?.deductions.providentFund + currentSlip?.deductions.insurance).toLocaleString()}
              </p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
              <BadgeDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Annual Earnings Yield</p>
              <p className="text-2xl font-black text-foreground mt-0.5">$115,000</p>
            </div>
          </Card>
        </div>
      )}

      {/* Main Breakdown Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table list payslips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{isAdmin ? 'Batch Transfer History' : 'Monthly Payslip Logs'}</CardTitle>
            <CardDescription>Records of monthly pay structures released.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold pb-2 uppercase tracking-wider">
                  {isAdmin && <th className="py-3">Employee</th>}
                  <th className="py-3">Pay Cycle</th>
                  <th>Base Pay</th>
                  <th>Net Yield</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {displayRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-secondary/20 transition-colors">
                    {isAdmin && (
                      <td className="py-3 flex items-center gap-2.5">
                        <img src={record.employeeAvatar} alt={record.employeeName} className="h-7 w-7 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-foreground">{record.employeeName}</p>
                          <p className="text-[9px] text-muted-foreground leading-none">{record.employeeRole}</p>
                        </div>
                      </td>
                    )}
                    <td className="py-3 font-semibold text-foreground">{record.month} {record.year}</td>
                    <td className="text-muted-foreground font-medium">${record.baseSalary.toLocaleString()}/mo</td>
                    <td className="font-bold text-foreground">${record.netSalary.toLocaleString()}/mo</td>
                    <td>
                      <Badge variant="status" status={record.status}>{record.status}</Badge>
                    </td>
                    <td className="text-right flex items-center justify-end gap-2.5 py-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-[11px] font-bold rounded-lg flex items-center gap-1.5"
                        onClick={() => handleOpenPayslip(record)}
                      >
                        <span>View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-lg flex items-center justify-center"
                        onClick={() => handleDownload(record)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recharts payroll allocation */}
        <Card>
          <CardHeader>
            <CardTitle>{isAdmin ? 'Budget Distribution' : 'Gross Allocation'}</CardTitle>
            <CardDescription>Salary component breakdown metrics.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {!isAdmin ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personalBreakdown}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    {personalBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col gap-5 justify-center h-full text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Base Cash Allocations</span>
                    <span className="text-indigo-500">$34,800/mo</span>
                  </div>
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Allowances & Bonuses</span>
                    <span className="text-amber-500">$5,400/mo</span>
                  </div>
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Legal / Tax Overheads</span>
                    <span className="text-rose-500">$2,200/mo</span>
                  </div>
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Interactive Printable Payslip Modal */}
      <Dialog
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        title="Payslip Breakdown Statement"
        description="Verify monthly allowances, deductions, and tax yields."
        className="max-w-xl"
      >
        {selectedPayslip && (
          <div className="space-y-5 text-xs select-none p-2 border border-border/40 rounded-2xl bg-secondary/10">
            
            {/* Header info */}
            <div className="flex justify-between border-b border-border/80 pb-4">
              <div>
                <p className="font-extrabold text-sm text-foreground">AURORA INC.</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">New York Headquarters</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">PAYSLIP STATEMENT</p>
                <p className="text-[10px] text-indigo-500 font-mono mt-0.5">#{selectedPayslip.id}</p>
              </div>
            </div>

            {/* Staff parameters */}
            <div className="grid grid-cols-2 gap-4 border-b border-border/40 pb-4">
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-muted-foreground">Employee Name</p>
                <p className="font-bold text-foreground">{selectedPayslip.employeeName}</p>
                <p className="text-muted-foreground">{selectedPayslip.employeeRole}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-muted-foreground">Payment Cycle</p>
                <p className="font-bold text-foreground">{selectedPayslip.month} {selectedPayslip.year}</p>
                <p className="text-muted-foreground">Release Date: {selectedPayslip.paymentDate || 'Processing'}</p>
              </div>
            </div>

            {/* Ledger breakdown */}
            <div className="grid grid-cols-2 gap-6 pb-2">
              
              {/* Earnings Column */}
              <div className="space-y-2">
                <h4 className="font-bold text-[10px] uppercase text-indigo-500 border-b border-indigo-500/20 pb-1">Earnings</h4>
                <div className="flex justify-between">
                  <span>Base Salary</span>
                  <span className="font-bold">${selectedPayslip.baseSalary}</span>
                </div>
                <div className="flex justify-between">
                  <span>Housing Allowance</span>
                  <span>+${selectedPayslip.allowances.housing}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Allowance</span>
                  <span>+${selectedPayslip.allowances.transport}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus yield</span>
                  <span>+${selectedPayslip.bonus || 0}</span>
                </div>
              </div>

              {/* Deductions Column */}
              <div className="space-y-2">
                <h4 className="font-bold text-[10px] uppercase text-rose-500 border-b border-rose-500/20 pb-1">Deductions</h4>
                <div className="flex justify-between">
                  <span>Income Tax</span>
                  <span className="text-rose-500">-${selectedPayslip.deductions.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provident Fund</span>
                  <span className="text-rose-500">-${selectedPayslip.deductions.providentFund}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical Insurance</span>
                  <span className="text-rose-500">-${selectedPayslip.deductions.insurance}</span>
                </div>
              </div>

            </div>

            {/* Net Total Summary */}
            <div className="bg-secondary/60 p-4 border border-border/80 rounded-xl flex items-center justify-between mt-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Net Payout</p>
                <p className="text-sm font-semibold text-muted-foreground mt-0.5">Transferred to authorized bank</p>
              </div>
              <p className="text-2xl font-black text-foreground">${selectedPayslip.netSalary.toLocaleString()}</p>
            </div>

            {/* Printable bottom actions */}
            <div className="flex gap-2 justify-end pt-3 border-t border-border/40">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 rounded-xl flex items-center gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="h-9 rounded-xl flex items-center gap-1.5 font-bold"
                onClick={() => handleDownload(selectedPayslip)}
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            </div>

          </div>
        )}
      </Dialog>

    </div>
  );
};
export default Payroll;
