import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck2, 
  CalendarClock, 
  DollarSign, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  UserCircle2,
  Briefcase
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast('Logged Out', 'You have been successfully logged out.', 'info');
    navigate('/login');
  };

  // Define navigation links based on user role
  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck2 },
    { name: 'Leave Tracker', path: '/leave', icon: CalendarClock },
    { name: 'Payroll Admin', path: '/payroll', icon: DollarSign },
  ];

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/employee/profile', icon: UserCircle2 },
    { name: 'Attendance Logs', path: '/attendance', icon: CalendarCheck2 },
    { name: 'Leave Requests', path: '/leave', icon: CalendarClock },
    { name: 'My Payslips', path: '/payroll', icon: DollarSign },
  ];

  const links = user.role === 'admin' ? adminLinks : employeeLinks;
  
  const bottomLinks = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '78px' : '260px' }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "relative hidden md:flex flex-col h-screen border-r border-border/80 bg-card select-none text-card-foreground",
        className
      )}
    >
      {/* Header Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border/40 shrink-0">
        <Link to="/" className="flex items-center gap-3 font-bold text-lg tracking-wider text-foreground">
          <div className="bg-primary/10 rounded-xl p-2 text-primary flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-extrabold"
            >
              AURORA
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "group flex items-center gap-4 px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform duration-200")} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.name}
                </motion.span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-border/30 my-4" />

        {bottomLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "group flex items-center gap-4 px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile area */}
      <div className="p-4 border-t border-border/40 shrink-0">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-4 px-3.5 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>

      {/* Collapse Trigger Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-20 bg-card border border-border h-7 w-7 rounded-full flex items-center justify-center shadow-md text-muted-foreground hover:text-foreground z-10"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </motion.aside>
  );
};
