import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Dialog } from '../../components/ui/Dialog';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockLeaveBalances, mockLeaveRequests } from '../../data/mockData';
import type { LeaveRequest, LeaveType } from '../../types';
import { 
  Clock, 
  Plus, 
  CheckCircle
} from 'lucide-react';

export const LeaveManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.role === 'admin';

  // State
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Leave Form States
  const [type, setType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const leaveBalance = mockLeaveBalances[user.id] || [];

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast('Form Incomplete', 'Please fill in all dates and request reasoning.', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);

      const newRequest: LeaveRequest = {
        id: `LR0${requests.length + 1}`,
        employeeId: user.id,
        employeeName: user.name,
        employeeAvatar: user.avatar,
        employeeRole: user.role === 'admin' ? 'HR Manager' : 'Software Engineer',
        type,
        startDate,
        endDate,
        status: 'Pending',
        reason,
        days,
        appliedDate: new Date().toISOString().split('T')[0]
      };

      setRequests(prev => [newRequest, ...prev]);
      toast('Request Filed', `Leave request for ${days} days filed with HR Operations.`, 'success');
      setIsApplyOpen(false);
      
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
    }, 1200);
  };

  // Filter requests based on user role
  const displayRequests = isAdmin 
    ? requests 
    : requests.filter(r => r.employeeId === user.id);

  return (
    <div className="space-y-6 select-none">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {isAdmin ? 'Corporate Leave Management' : 'Absence & Leave Center'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isAdmin ? 'Approve, review, or edit employee leave timelines.' : 'File request sheets, check available balances, and audit history.'}
          </p>
        </div>

        {!isAdmin && (
          <Button
            variant="primary"
            className="flex items-center gap-2 text-xs font-bold rounded-xl"
            onClick={() => setIsApplyOpen(true)}
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Apply For Leave</span>
          </Button>
        )}
      </div>

      {/* Leave balance widgets for Employees */}
      {!isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leaveBalance.slice(0, 4).map((balance) => (
            <Card key={balance.type} className="p-4 flex flex-col justify-between h-32 hover:shadow-premium transition-shadow duration-300">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{balance.type} Leave</p>
                <p className="text-2xl font-black text-foreground mt-1">{balance.available} days</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>Used: {balance.used} days</span>
                  <span>Total: {balance.total}d</span>
                </div>
                <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(balance.used / balance.total) * 100}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Main Request Logs panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{isAdmin ? 'All Active Leave Logs' : 'My Absence Log History'}</CardTitle>
            <CardDescription>Archive records of leave requests filed.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold pb-2 uppercase tracking-wider">
                  {isAdmin && <th className="py-3">Staff</th>}
                  <th className="py-3">Leave Type</th>
                  <th>Timeline Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th className="text-right">Actions / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {displayRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                    {isAdmin && (
                      <td className="py-3 flex items-center gap-2.5">
                        <img src={req.employeeAvatar} alt={req.employeeName} className="h-7 w-7 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-foreground">{req.employeeName}</p>
                          <p className="text-[9px] text-muted-foreground leading-none">{req.employeeRole}</p>
                        </div>
                      </td>
                    )}
                    <td className="py-3 font-semibold text-primary">{req.type}</td>
                    <td className="text-muted-foreground font-medium">{req.startDate} to {req.endDate}</td>
                    <td className="font-bold">{req.days} days</td>
                    <td>
                      <Badge variant="status" status={req.status}>{req.status}</Badge>
                    </td>
                    <td className="text-right font-medium text-muted-foreground truncate max-w-[150px]">
                      {req.comments || req.reason}
                    </td>
                  </tr>
                ))}
                {displayRequests.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-6 text-muted-foreground">No absence history recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Dynamic timeline flow */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Milestones</CardTitle>
            <CardDescription>Visual tracker representing leave review stages.</CardDescription>
          </CardHeader>
          <CardContent className="relative pl-6 space-y-6">
            <div className="absolute left-3 top-2 bottom-2 w-[1.5px] bg-border" />
            
            <div className="relative space-y-1">
              <div className="absolute -left-[18.5px] top-1.5 h-3.5 w-3.5 rounded-full border border-card bg-emerald-500 flex items-center justify-center text-white">
                <CheckCircle className="h-2.5 w-2.5" />
              </div>
              <div className="pl-4">
                <h4 className="text-xs font-bold text-foreground">Step 1: Request Submitted</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Application filed via employee portal.</p>
              </div>
            </div>

            <div className="relative space-y-1">
              <div className="absolute -left-[18.5px] top-1.5 h-3.5 w-3.5 rounded-full border border-card bg-primary flex items-center justify-center text-white">
                <Clock className="h-2.5 w-2.5" />
              </div>
              <div className="pl-4">
                <h4 className="text-xs font-bold text-foreground">Step 2: Department Review</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Managers verify sprint deliverables and team schedules.</p>
              </div>
            </div>

            <div className="relative space-y-1">
              <div className="absolute -left-[18.5px] top-1.5 h-3.5 w-3.5 rounded-full border border-card bg-slate-300 dark:bg-zinc-700" />
              <div className="pl-4">
                <h4 className="text-xs font-bold text-muted-foreground">Step 3: HR Board Resolution</h4>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Final contract validation and payroll updates.</p>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Apply Leave dialog */}
      <Dialog
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="File Leave Request"
        description="Fill in dates to submit an official leave request."
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs select-none">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as LeaveType)}
              className="w-full h-11 px-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Annual">Annual Vacation</option>
              <option value="Sick">Medical Leave</option>
              <option value="Study">Study/Certification Leave</option>
              <option value="Paternity">Paternity Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Unpaid">Unpaid Personal Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Reasoning</label>
            <textarea
              placeholder="Provide reason details (e.g. family wedding)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-[90px] p-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex gap-2 justify-end pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsApplyOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              File Request
            </Button>
          </div>

        </form>
      </Dialog>

    </div>
  );
};
export default LeaveManagement;
