import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { mockAttendanceRecords } from '../../data/mockData';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  MapPin
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const Attendance: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // State
  const logs = mockAttendanceRecords;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Stats calculation
  const totalDays = logs.length;
  const presentDays = logs.filter(l => l.status === 'Present').length;
  const halfDays = logs.filter(l => l.status === 'Half Day').length;
  const absentDays = logs.filter(l => l.status === 'Absent').length;
  
  const presentRate = ((presentDays + halfDays * 0.5) / totalDays) * 100;
  const averageHours = logs.reduce((sum, l) => sum + (l.workingHours || 0), 0) / (presentDays + halfDays || 1);

  // Recharts attendance chart data
  const chartsData = logs.slice(0, 7).reverse().map(l => ({
    date: l.date.substring(5), // MM-DD
    hours: l.workingHours || 0
  }));

  // Filtering for Admin view
  const allStaffLogs = [
    { id: '1', name: 'Sarah Jenkins', role: 'Software Engineer', date: '2026-07-03', checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'Present', hours: 8.75 },
    { id: '2', name: 'Marcus Chen', role: 'Product Designer', date: '2026-07-03', checkIn: '08:52 AM', checkOut: '05:00 PM', status: 'Present', hours: 8.13 },
    { id: '3', name: 'Emily Watson', role: 'QA Lead', date: '2026-07-03', checkIn: '--:--', checkOut: '--:--', status: 'Leave', hours: 0 },
    { id: '4', name: 'David Kojo', role: 'DevOps Engineer', date: '2026-07-03', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: 9.00 },
    { id: '5', name: 'Sophia Martinez', role: 'Sales Executive', date: '2026-07-03', checkIn: '09:15 AM', checkOut: '01:00 PM', status: 'Half Day', hours: 3.75 },
    { id: '6', name: 'Jordan Finch', role: 'Software Engineer', date: '2026-07-03', checkIn: '--:--', checkOut: '--:--', status: 'Absent', hours: 0 }
  ];

  const filteredStaffLogs = allStaffLogs.filter(log => {
    const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {isAdmin ? 'Staff Attendance Logs' : 'My Attendance Portal'}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isAdmin ? 'Monitor real-time checkout sheets and status logs.' : 'Audit your working hours, checklist logs, and history sheets.'}
        </p>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Present Frequency</p>
            <p className="text-xl font-bold tracking-tight mt-0.5">{isAdmin ? '86%' : `${presentRate.toFixed(0)}%`}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Average Shift</p>
            <p className="text-xl font-bold tracking-tight mt-0.5">{isAdmin ? '8.4 hours' : `${averageHours.toFixed(2)}h/day`}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Half Days Logged</p>
            <p className="text-xl font-bold tracking-tight mt-0.5">{isAdmin ? '3 this week' : `${halfDays} days`}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Absences</p>
            <p className="text-xl font-bold tracking-tight mt-0.5">{isAdmin ? '2 today' : `${absentDays} days`}</p>
          </div>
        </Card>
      </div>

      {/* Grid: Charts and logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Logs Table Area */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Attendance Log Sheet</CardTitle>
              <CardDescription>
                {isAdmin ? 'Latest logs across departments.' : 'Your checkout records for the past 10 working days.'}
              </CardDescription>
            </div>
            
            {/* Filter controls */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3.5 bg-secondary text-xs rounded-xl border border-border/80 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            
            {!isAdmin ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground font-semibold pb-2 uppercase">
                    <th className="py-3">Log Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="text-right">Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {logs.filter(l => statusFilter === 'All' || l.status === statusFilter).map((log) => (
                    <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 font-semibold text-foreground">{log.date}</td>
                      <td className="text-muted-foreground font-medium">{log.checkIn || '--:--'}</td>
                      <td className="text-muted-foreground font-medium">{log.checkOut || '--:--'}</td>
                      <td className="font-bold">{log.workingHours ? `${log.workingHours} hours` : '0.0h'}</td>
                      <td>
                        <Badge variant="status" status={log.status}>{log.status}</Badge>
                      </td>
                      <td className="text-right text-muted-foreground/60">
                        <MapPin className="h-3.5 w-3.5 inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="space-y-4">
                
                {/* Search query input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-muted-foreground/60">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search personnel logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-xs focus:outline-none"
                  />
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground font-semibold pb-2 uppercase">
                      <th className="py-3">Employee</th>
                      <th>Log Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Hours</th>
                      <th className="text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredStaffLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 font-bold text-foreground">{log.name}</td>
                        <td className="text-muted-foreground font-semibold">{log.date}</td>
                        <td className="text-muted-foreground">{log.checkIn}</td>
                        <td className="text-muted-foreground">{log.checkOut}</td>
                        <td className="font-bold">{log.hours > 0 ? `${log.hours}h` : '--'}</td>
                        <td className="text-right">
                          <Badge variant="status" status={log.status}>{log.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Analytics charts */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Hours Analytics</CardTitle>
            <CardDescription>Graph logs of recent active working days.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData}>
                <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

    </div>
  );
};
export default Attendance;
