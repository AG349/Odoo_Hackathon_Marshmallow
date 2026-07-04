import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../context/ToastContext';
import { 
  mockEmployees, 
  mockLeaveRequests, 
  mockDepartmentStats,
  mockAttendanceTrend,
  mockEmployeeGrowth,
  mockLeaveStats 
} from '../../data/mockData';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FolderOpen, 
  CreditCard,
  Check,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  
  // States for Leave Approval Actions
  const [leaves, setLeaves] = useState(mockLeaveRequests);
  const [selectedLeave, setSelectedLeave] = useState<typeof mockLeaveRequests[0] | null>(null);
  const [comment, setComment] = useState('');
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);

  // Stats calculation
  const totalEmployees = mockEmployees.length;
  const presentCount = 8; // dummy
  const absentCount = 2; // dummy
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const totalDepartments = mockDepartmentStats.length;
  const totalPayroll = mockEmployees.reduce((sum, e) => sum + e.salary, 0);

  const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

  const handleOpenAction = (leave: typeof mockLeaveRequests[0]) => {
    setSelectedLeave(leave);
    setComment('');
    setIsApprovalOpen(true);
  };

  const handleResolveLeave = (status: 'Approved' | 'Rejected') => {
    if (!selectedLeave) return;

    setLeaves(prev => prev.map(l => 
      l.id === selectedLeave.id 
        ? { ...l, status, comments: comment || `Status updated by Admin.` } 
        : l
    ));

    toast(
      `Leave ${status}`, 
      `Request from ${selectedLeave.employeeName} has been ${status.toLowerCase()} successfully.`,
      status === 'Approved' ? 'success' : 'error'
    );
    setIsApprovalOpen(false);
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Overview Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time indicators, pending operations, and workforce metrics.</p>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        <Card hoverEffect className="p-4 md:p-6 flex flex-col gap-2">
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Total Employees</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight mt-1">{totalEmployees}</p>
          </div>
        </Card>

        <Card hoverEffect className="p-4 md:p-6 flex flex-col gap-2">
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Present Today</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight mt-1">{presentCount}</p>
          </div>
        </Card>

        <Card hoverEffect className="p-4 md:p-6 flex flex-col gap-2">
          <div className="h-10 w-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Absent Today</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight mt-1">{absentCount}</p>
          </div>
        </Card>

        <Card hoverEffect className="p-4 md:p-6 flex flex-col gap-2">
          <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Pending Leaves</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight mt-1">{pendingLeaves}</p>
          </div>
        </Card>

        <Card hoverEffect className="p-4 md:p-6 flex flex-col gap-2">
          <div className="h-10 w-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Departments</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight mt-1">{totalDepartments}</p>
          </div>
        </Card>

        <Card hoverEffect className="p-4 md:p-6 flex flex-col gap-2">
          <div className="h-10 w-10 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Payroll Load</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight mt-1">${(totalPayroll / 12 / 1000).toFixed(0)}k/mo</p>
          </div>
        </Card>

      </div>

      {/* Main Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Daily checklist logs for the current week.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAttendanceTrend}>
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="Present" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Headcount Growth</CardTitle>
            <CardDescription>Cumulative staff count over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockEmployeeGrowth}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Category Stats Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Breakdown of personnel count by department.</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockDepartmentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {mockDepartmentStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-1/2 space-y-2">
              {mockDepartmentStats.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground font-bold">{item.count} staff</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Types Distribution</CardTitle>
            <CardDescription>Leaves applied by category this month.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockLeaveStats} layout="vertical">
                <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Grid for Table list actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leave Approval Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leave Approval Panel</CardTitle>
            <CardDescription>Incoming staff absence requests requiring action.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-bold pb-2 uppercase tracking-wider">
                  <th className="py-3">Employee</th>
                  <th>Leave Type</th>
                  <th>Timeline</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {leaves.filter(l => l.status === 'Pending').map((request) => (
                  <tr key={request.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 flex items-center gap-3">
                      <img src={request.employeeAvatar} alt={request.employeeName} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-foreground">{request.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground">{request.employeeRole}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-indigo-500 dark:text-indigo-400">{request.type}</td>
                    <td className="text-muted-foreground">{request.startDate} to {request.endDate}</td>
                    <td className="font-bold">{request.days} days</td>
                    <td>
                      <Badge variant="status" status={request.status}>{request.status}</Badge>
                    </td>
                    <td className="text-right">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 text-[11px] font-bold rounded-lg"
                        onClick={() => handleOpenAction(request)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
                {leaves.filter(l => l.status === 'Pending').length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-muted-foreground">No pending requests requiring approval.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent Hires */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Joins</CardTitle>
            <CardDescription>Latest profiles onboarded into directories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockEmployees.slice(0, 4).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between border-b border-border/10 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={employee.avatar} alt={employee.name} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{employee.name}</p>
                    <p className="text-[10px] text-muted-foreground">{employee.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-[10px]">{employee.department}</Badge>
                  <p className="text-[9px] text-muted-foreground mt-1">Joined {employee.joinDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* Inline Approval Action Dialog */}
      <Dialog
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        title="Review Leave Application"
        description="Verify details and add comment before processing action."
      >
        {selectedLeave && (
          <div className="space-y-4 text-xs select-none">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 flex items-center gap-3">
              <img src={selectedLeave.employeeAvatar} alt={selectedLeave.employeeName} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-sm text-foreground">{selectedLeave.employeeName}</p>
                <p className="text-xs text-muted-foreground">{selectedLeave.employeeRole}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Reason</p>
              <p className="text-foreground leading-relaxed p-3.5 bg-card border border-border rounded-xl font-medium">"{selectedLeave.reason}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Leave Type</p>
                <Badge variant="outline" className="font-bold text-xs px-3 py-1">{selectedLeave.type}</Badge>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Duration</p>
                <span className="font-bold text-sm">{selectedLeave.days} Work Days</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Reviewer Comment</label>
              <textarea
                placeholder="Write comments/reasons..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[80px] p-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="flex gap-2.5 justify-end pt-3">
              <Button 
                variant="destructive" 
                className="flex items-center gap-1.5"
                onClick={() => handleResolveLeave('Rejected')}
              >
                <X className="h-4 w-4" />
                <span>Reject</span>
              </Button>
              <Button 
                variant="primary" 
                className="flex items-center gap-1.5"
                onClick={() => handleResolveLeave('Approved')}
              >
                <Check className="h-4 w-4" />
                <span>Approve</span>
              </Button>
            </div>
          </div>
        )}
      </Dialog>

    </div>
  );
};
export default AdminDashboard;
