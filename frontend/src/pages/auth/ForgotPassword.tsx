import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Mail, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email format is invalid');
      return;
    }
    setError('');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast('Verification Sent', 'A verification OTP has been dispatched to your email.', 'info');
      navigate('/otp');
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
            <KeyRound className="h-6.5 w-6.5" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Recover Credentials</h2>
          <p className="text-xs text-muted-foreground">Receive a verification link/code to re-authenticate your profile.</p>
        </div>

        <Card className="border border-border shadow-premium">
          <CardContent className="pt-6">
            <form onSubmit={handleRecover} className="space-y-4">
              <Input
                label="Registered Email Address"
                placeholder="name@aurora.io"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                error={error}
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Request Verification Code
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Remembered password?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Go back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default ForgotPassword;
