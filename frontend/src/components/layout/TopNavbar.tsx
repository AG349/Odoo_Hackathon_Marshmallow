import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { mockNotifications } from '../../data/mockData';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  LogOut,
  LayoutDashboard,
  Users,
  CalendarCheck2,
  CalendarClock,
  DollarSign,
  Settings,
  UserCircle2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const TopNavbar: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast('Notifications Cleared', 'All notifications marked as read.', 'success');
  };

  const handleRoleSwitch = () => {
    switchRole();
    toast('Role Switched', `You are now logged in as ${user.role === 'admin' ? 'Employee' : 'Admin'}.`, 'success');
    navigate(user.role === 'admin' ? '/employee/dashboard' : '/admin/dashboard');
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast('Logged Out', 'You have been successfully logged out.', 'info');
    navigate('/login');
  };

  // Pathnames parser for breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const routeTo = `/${paths.slice(0, index + 1).join('/')}`;
      const isLast = index === paths.length - 1;
      const formattedName = path
        .replace('-', ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      return (
        <React.Fragment key={routeTo}>
          <span className="text-muted-foreground/60 mx-1.5 font-medium">/</span>
          {isLast ? (
            <span className="text-foreground font-semibold truncate max-w-[120px] sm:max-w-none">{formattedName}</span>
          ) : (
            <Link to={routeTo} className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              {formattedName}
            </Link>
          )}
        </React.Fragment>
      );
    });
  };

  const activeLinks = user.role === 'admin' ? [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck2 },
    { name: 'Leave Tracker', path: '/leave', icon: CalendarClock },
    { name: 'Payroll Admin', path: '/payroll', icon: DollarSign },
  ] : [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/employee/profile', icon: UserCircle2 },
    { name: 'Attendance Logs', path: '/attendance', icon: CalendarCheck2 },
    { name: 'Leave Requests', path: '/leave', icon: CalendarClock },
    { name: 'My Payslips', path: '/payroll', icon: DollarSign },
  ];

  return (
    <header className="relative flex items-center justify-between h-16 px-4 md:px-8 border-b border-border/40 bg-card/60 backdrop-blur-md select-none w-full shrink-0 z-40">
      
      {/* Left side: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            HRMS
          </Link>
          {getBreadcrumbs()}
        </div>
      </div>

      {/* Center/Search bar mock */}
      <div className="hidden md:flex relative w-64 max-w-xs">
        <span className="absolute left-3 top-3 text-muted-foreground/60">
          <Search className="h-4 w-4" />
        </span>
        <input 
          type="text" 
          placeholder="Search tools, actions..." 
          className="w-full h-10 pl-9 pr-12 rounded-xl border border-border/70 bg-secondary/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/80 transition-all"
        />
        <kbd className="absolute right-3 top-3 h-4 bg-card border border-border/80 px-1.5 text-[9px] text-muted-foreground rounded flex items-center font-sans pointer-events-none select-none">
          ⌘K
        </kbd>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Quick Role Switcher Chip */}
        <button
          onClick={handleRoleSwitch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Switch to {user.role === 'admin' ? 'Employee' : 'Admin'}</span>
        </button>

        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
        >
          {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2.5 rounded-xl border border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-card animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-32px)] rounded-2xl border border-border bg-card p-4 shadow-premium dark:shadow-dark-premium z-50 text-left"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border/50">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-primary hover:underline focus:outline-none"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto mt-2 space-y-2 divide-y divide-border/20">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">No new notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={cn("pt-2 first:pt-0", !n.read && "font-medium")}>
                          <p className="text-xs font-semibold text-foreground">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{n.description}</p>
                          <span className="text-[9px] text-muted-foreground/60">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl focus:outline-none hover:opacity-90 transition-opacity"
          >
            <Avatar src={user.avatar} name={user.name} size="sm" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2.5 shadow-premium dark:shadow-dark-premium z-50 text-left"
                >
                  <div className="px-3.5 py-2.5 border-b border-border/40 mb-1.5">
                    <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <Badge variant="secondary" className="mt-1.5 uppercase text-[9px] tracking-wider font-extrabold px-2 py-0.5">
                      {user.role}
                    </Badge>
                  </div>
                  
                  <Link 
                    to={user.role === 'admin' ? '/admin/dashboard' : '/employee/profile'} 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center px-3.5 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    View Account
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center px-3.5 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Settings
                  </Link>
                  
                  <div className="border-t border-border/30 my-1.5" />
                  
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Mobile menu navigation drawer overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-start">
            
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[85vw] h-full bg-card border-r border-border p-6 shadow-2xl flex flex-col justify-between z-10"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-border/40">
                  <span className="font-extrabold text-foreground tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">AURORA</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <nav className="mt-6 space-y-1.5">
                  {activeLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                  <div className="border-t border-border/30 my-4" />
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all",
                      location.pathname === '/settings' 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                    <span>Settings</span>
                  </Link>
                </nav>
              </div>

              <div className="border-t border-border/40 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </header>
  );
};
