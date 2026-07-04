import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Eye, EyeOff, Lock, Mail, Shield, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const tempErrors: typeof error = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email format is invalid';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent, selectedRole?: 'admin' | 'employee') => {
    e.preventDefault();
    
    // Quick role login short-circuit
    if (selectedRole) {
      setIsLoading(true);
      const targetEmail = selectedRole === 'admin' ? 'alex.rivera@aurora.io' : 'sarah.j@aurora.io';
      await login(targetEmail, selectedRole);
      setIsLoading(false);
      toast('Login Successful', `Welcome back, ${selectedRole === 'admin' ? 'Alex' : 'Sarah'}!`, 'success');
      navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
      return;
    }

    if (!validate()) return;

    setIsLoading(true);
    try {
      // Check if it's admin or employee based on email
      const isHR = email.includes('admin') || email.includes('alex');
      const role = isHR ? 'admin' : 'employee';
      
      const success = await login(email, role);
      if (success) {
        toast('Login Successful', 'You have successfully signed in.', 'success');
        navigate(role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
      } else {
        toast('Authentication Failed', 'Invalid credentials.', 'error');
      }
    } catch (err) {
      toast('Error', 'An unexpected error occurred during login.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      
      {/* Left side: Premium Animated Brand Hero */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-950 p-12 relative overflow-hidden select-none">
        
        {/* Abstract Glowing Canvas */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-slate-950" />
        
        {/* Flowing Grid SVG */}
        <svg className="absolute inset-0 w-full h-full stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" x="-1" y="-1">
              <path d="M.5 40V.5H40" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating gradient circles */}
        <div className="absolute top-1/4 right-1/4 h-80 w-80 bg-purple-600/30 rounded-full blur-[100px] pulsing-glow" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 bg-indigo-600/20 rounded-full blur-[100px] pulsing-glow animate-delay-2000" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-white/10 rounded-xl p-2 text-white flex items-center justify-center backdrop-blur-md border border-white/10">
            <Shield className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-wider">AURORA HR</span>
        </div>

        {/* Interactive mock stats showcase */}
        <div className="relative z-10 flex flex-col gap-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs text-indigo-300 font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Version 2.4 Now Live</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Premium People Management Software.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Unifying payroll, attendance tracking, leave request timelines, and workforce analytics in a stunning dark-theme aesthetic interface.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-lg flex items-center gap-4"
          >
            <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Enterprise Ready</p>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">Fully secured with biometric check-in/out and granular role permissions.</p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] text-slate-500 flex justify-between">
          <span>© 2026 Aurora Inc. All rights reserved.</span>
          <a href="#" className="hover:text-indigo-400 transition-colors">Security Policy</a>
        </div>

      </div>

      {/* Right side: Login Interactive Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-6 md:p-12 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-xs text-muted-foreground">Sign in to your Aurora dashboard to continue.</p>
          </div>

          <Card className="border border-border shadow-premium">
            <CardContent className="pt-6">
              
              {/* Quick Login Assist Selector */}
              <div className="mb-6 p-4 rounded-xl bg-secondary/40 border border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Demo Accounts Quick Login</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="h-9 text-[11px] font-bold rounded-lg"
                    onClick={(e) => handleLogin(e, 'admin')}
                  >
                    HR / Admin Login
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="h-9 text-[11px] font-bold rounded-lg"
                    onClick={(e) => handleLogin(e, 'employee')}
                  >
                    Employee Login
                  </Button>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Corporate Email Address"
                  placeholder="name@aurora.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error.email}
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error.password}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    showPassword ? (
                      <EyeOff className="h-4 w-4" onClick={() => setShowPassword(false)} />
                    ) : (
                      <Eye className="h-4 w-4" onClick={() => setShowPassword(true)} />
                    )
                  }
                />

                <div className="flex items-center justify-between text-xs select-none">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>Remember this machine</span>
                  </label>
                  <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
                    Forgot secret keys?
                  </Link>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Authenticate & Enter
                </Button>
              </form>

              {/* Social Login Separator */}
              <div className="relative my-6 select-none">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/80" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground font-semibold">Or security protocols</span>
                </div>
              </div>

              {/* Mock Biometrics buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="secondary" className="h-10 text-xs rounded-xl flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.864 0-8.8-3.927-8.8-8.8s3.936-8.8 8.8-8.8c2.225 0 4.237.804 5.808 2.136L20.9 1.25C18.6 0.25 15.6 0 12.24 0 6.64 0 2 4.64 2 10.286s4.64 10.285 10.24 10.285c5.84 0 10.16-4.102 10.16-10.285 0-.693-.08-1.372-.24-2.001H12.24z"/></svg>
                  <span>Google Key</span>
                </Button>
                <Button type="button" variant="secondary" className="h-10 text-xs rounded-xl flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.12 0 .61.05 1.07-.05.65-.08 1.19-.51 1.74-1.28z"/></svg>
                  <span>Apple Single</span>
                </Button>
              </div>

            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            Don't have a secure pass?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Request credentials here
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
};
export default Login;
