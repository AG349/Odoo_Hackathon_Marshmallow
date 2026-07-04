import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { Eye, EyeOff, Lock, Mail, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ name?: string; email?: string; password?: string }>({});

  // Password strength analysis
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: 'No password', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, text: 'Too Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, text: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, text: 'Good Strength', color: 'bg-indigo-400' };
      case 4:
        return { score: 100, text: 'Excellent Strength', color: 'bg-emerald-500' };
      default:
        return { score: 10, text: 'Invalid', color: 'bg-rose-500' };
    }
  };

  const strength = getPasswordStrength();

  const validate = () => {
    const tempErrors: typeof error = {};
    if (!name) tempErrors.name = 'Full name is required';
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast('Registration Requested', 'Your request has been submitted to the HR admin for approval.', 'success');
      navigate('/otp'); // Forward to OTP flow to simulate onboarding
    }, 1500);
  };

  return (
    <div className="flex h-screen w-screen bg-background items-center justify-center p-6 select-none overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-1">
            <Shield className="h-6.5 w-6.5" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Request Account</h2>
          <p className="text-xs text-muted-foreground">Submit a register request to the operations department.</p>
        </div>

        <Card className="border border-border shadow-premium">
          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={error.name}
                leftIcon={<User className="h-4 w-4" />}
              />

              <Input
                label="Corporate Email"
                placeholder="sarah.j@aurora.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error.email}
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Input
                label="Secure Password"
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

              {/* Password strength visualizer */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground">Strength Check</span>
                    <span className="uppercase text-indigo-400">{strength.text}</span>
                  </div>
                  <Progress value={strength.score} indicatorColor={strength.color} className="h-1.5" />
                </div>
              )}

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Go back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Register;
