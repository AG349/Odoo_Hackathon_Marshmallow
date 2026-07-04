import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  ShieldCheck, 
  Sun, 
  Moon
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Profile Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Notifications states
  const [leaveNotify, setLeaveNotify] = useState(true);
  const [payrollNotify, setPayrollNotify] = useState(true);
  const [systemNotify, setSystemNotify] = useState(false);

  // Security states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast('Profile Saved', 'Your system preferences have been updated.', 'success');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast('Form Incomplete', 'Please fill in all password fields.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('Mismatch Error', 'New passwords do not match.', 'error');
      return;
    }
    
    toast('Password Changed', 'Your account credentials have been updated securely.', 'success');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">Configure your workspace theme, security keys, and communication alerts.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto justify-start border-none">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile settings</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span>Theme settings</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Security keys</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Manage your name and contact variables.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Registered Corporate Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="primary" className="h-10 text-xs font-bold rounded-xl mt-2">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Theme preferences */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Themes</CardTitle>
              <CardDescription>Select your desired UI backdrop theme color.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              
              {/* Light Mode Selector Card */}
              <button
                type="button"
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-5 rounded-2xl border text-left flex flex-col gap-4 transition-all ${
                  theme === 'light' 
                    ? 'border-primary ring-2 ring-primary/20 bg-card' 
                    : 'border-border bg-secondary/20 hover:bg-secondary/40'
                }`}
              >
                <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Light Theme</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Clean white, slate outlines, soft colors.</p>
                </div>
              </button>

              {/* Dark Mode Selector Card */}
              <button
                type="button"
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-5 rounded-2xl border text-left flex flex-col gap-4 transition-all ${
                  theme === 'dark' 
                    ? 'border-primary ring-2 ring-primary/20 bg-card' 
                    : 'border-border bg-secondary/20 hover:bg-secondary/40'
                }`}
              >
                <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Dark Theme</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Deep carbons, glowing indigo accents, dark slate layers.</p>
                </div>
              </button>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Notification settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you receive HR event alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              
              <div className="flex items-center justify-between p-3.5 bg-secondary/20 border border-border/60 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-foreground">Leave Requests Statuses</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Notify when absence requests are processed.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={leaveNotify} 
                  onChange={(e) => setLeaveNotify(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-secondary/20 border border-border/60 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-foreground">Payroll Releases</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Notify when monthly payslips are generated.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={payrollNotify} 
                  onChange={(e) => setPayrollNotify(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-secondary/20 border border-border/60 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-foreground">System updates</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Alerts regarding operations policy audits.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={systemNotify} 
                  onChange={(e) => setSystemNotify(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Security credentials change */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Passwords</CardTitle>
              <CardDescription>Update corporate password variables.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSecurity} className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="primary" className="h-10 text-xs font-bold rounded-xl mt-2">
                  Update Password Keys
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

    </div>
  );
};
export default Settings;
