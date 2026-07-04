import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockLeaveBalances, mockActivities } from '../../data/mockData';
import { 
  Play, 
  Square, 
  Calendar, 
  TrendingUp, 
  PlaneTakeoff
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Attendance Check-In States
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [workSeconds, setWorkSeconds] = useState(0);

  // Timer effect for work hours tracking
  useEffect(() => {
    let interval: any = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setWorkSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn]);

  if (!user) return null;

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(formatted);
    setCheckOutTime(null);
    setWorkSeconds(0);
    toast('Check-In Successful', `Recorded check-in at ${formatted}.`, 'success');
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCheckOutTime(formatted);
    toast('Check-Out Successful', `Recorded check-out at ${formatted}.`, 'info');
  };

  // Convert seconds to hours:minutes:seconds
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Stats
  const leaveBalance = mockLeaveBalances[user.id] || [];
  const weeklyWorkTrend = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 9.1 },
    { day: 'Thu', hours: 8.6 },
    { day: 'Fri', hours: isCheckedIn ? 4.5 + workSeconds / 3600 : 0 }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-premium">
        <div className="space-y-2">
          <Badge variant="outline" className="border-white/30 text-white font-bold bg-white/10 uppercase tracking-widest text-[9px] px-3 py-1">
            Core UX Team
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Good morning, {user.name}</h1>
          <p className="text-white/80 text-xs md:text-sm max-w-md font-medium leading-relaxed">
            Welcome back! You have 1 pending review meeting today and your H1 performance reviews are active.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="bg-white/10 border-white/20 hover:bg-white/25 text-white text-xs font-bold rounded-xl h-10 px-4">
            Request Leave
          </Button>
          <Button variant="secondary" size="sm" className="bg-white text-slate-900 border-white hover:bg-white/90 text-xs font-bold rounded-xl h-10 px-4">
            View Payslips
          </Button>
        </div>
      </div>

      {/* Main grids: Attendance controls & Leave breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Attendance card */}
        <Card className="lg:col-span-1 border border-border">
          <CardHeader>
            <CardTitle>Attendance Tracker</CardTitle>
            <CardDescription>Log daily checkout cycles with running timers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Visual clock display */}
            <div className="text-center py-6 bg-secondary/30 rounded-2xl border border-border/40 space-y-2">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Elapsed Work Hours</span>
              <p className="text-4xl font-black font-mono tracking-tight text-foreground select-all">
                {isCheckedIn ? formatTimer(workSeconds) : '00:00:00'}
              </p>
              <div className="flex justify-center gap-3.5 text-xs text-muted-foreground pt-1.5 font-medium select-none">
                <span>In: {checkInTime || '--:--'}</span>
                <span>•</span>
                <span>Out: {checkOutTime || '--:--'}</span>
              </div>
            </div>

            {/* Checkin / Checkout action triggers */}
            <div className="flex gap-3">
              {!isCheckedIn ? (
                <Button 
                  onClick={handleCheckIn} 
                  className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold"
                  variant="primary"
                >
                  <Play className="h-4.5 w-4.5" />
                  <span>Check In Today</span>
                </Button>
              ) : (
                <Button 
                  onClick={handleCheckOut} 
                  className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold"
                  variant="destructive"
                >
                  <Square className="h-4.5 w-4.5" />
                  <span>Check Out Now</span>
                </Button>
              )}
            </div>

            {/* Working Hours analytics bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Shift Progress</span>
                <span className="text-foreground">{isCheckedIn ? Math.min(100, Math.floor((workSeconds / 28800) * 100)) : 0}%</span>
              </div>
              <Progress value={isCheckedIn ? Math.min(100, (workSeconds / 28800) * 100) : 0} className="h-2" />
              <p className="text-[10px] text-muted-foreground/80 leading-relaxed pt-1.5">Standard workspace shifts are calibrated at 8.00 work hours daily.</p>
            </div>

          </CardContent>
        </Card>

        {/* Leave Balances Grid */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader>
            <CardTitle>Absence & Leave Balances</CardTitle>
            <CardDescription>Available days for calendar year 2026.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {leaveBalance.slice(0, 3).map((l) => (
              <div key={l.type} className="p-4 bg-secondary/30 rounded-2xl border border-border/50 space-y-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">{l.type} Leave</p>
                  <p className="text-2xl font-black text-foreground mt-1.5">{l.available} <span className="text-xs font-semibold text-muted-foreground">Available</span></p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Used</span>
                    <span>{l.used} of {l.total} days</span>
                  </div>
                  <Progress value={(l.used / l.total) * 100} indicatorColor="bg-indigo-500" className="h-1.5" />
                </div>
              </div>
            ))}
            
            {/* Quick Summary list */}
            <div className="col-span-2 sm:col-span-3 border-t border-border/30 pt-4 mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <PlaneTakeoff className="h-4 w-4 text-muted-foreground/60" />
                <span>Next planned vacation: July 10th - Hawaii</span>
              </span>
              <Badge variant="status" status="pending">Pending HR Review</Badge>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Grid: Charts & Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly hours chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Worked Hours Trend</CardTitle>
              <CardDescription>Performance tracking for current weekly cycles.</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+2.4h vs last week</span>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyWorkTrend}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Holidays / Calendar events */}
        <Card>
          <CardHeader>
            <CardTitle>Corporate Holidays</CardTitle>
            <CardDescription>Upcoming corporate days off.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="flex items-center gap-3.5 border-b border-border/10 pb-3.5">
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Independence Day</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">July 4, 2026 • Friday</p>
              </div>
              <Badge variant="outline" className="ml-auto text-[9px]">National</Badge>
            </div>

            <div className="flex items-center gap-3.5 border-b border-border/10 pb-3.5">
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Labor Day</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">September 7, 2026 • Monday</p>
              </div>
              <Badge variant="outline" className="ml-auto text-[9px]">Corporate</Badge>
            </div>

            <div className="flex items-center gap-3.5 border-b border-border/10 pb-3.5">
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Thanksgiving Break</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">November 26, 2026 • Thursday</p>
              </div>
              <Badge variant="outline" className="ml-auto text-[9px]">National</Badge>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Bottom widgets: activities */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Stream</CardTitle>
          <CardDescription>Recent team events happening across departments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockActivities.slice(0, 3).map((act) => (
            <div key={act.id} className="flex items-center justify-between border-b border-border/10 pb-3 last:border-0 last:pb-0 text-xs">
              <div className="flex items-center gap-3">
                <img src={act.employeeAvatar} alt={act.employeeName} className="h-8 w-8 rounded-full object-cover" />
                <div>
                  <p className="text-foreground">
                    <span className="font-bold">{act.employeeName}</span> {act.action} <span className="font-semibold text-primary">{act.target}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{act.time}</p>
                </div>
              </div>
              <Badge variant="secondary" className="uppercase text-[9px] tracking-wider">{act.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};
export default EmployeeDashboard;
