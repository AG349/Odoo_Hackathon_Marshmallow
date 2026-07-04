import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Fingerprint, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const OTP: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [seconds, setSeconds] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Count down resend timer
  useEffect(() => {
    const timer = seconds > 0 && setInterval(() => setSeconds(seconds - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [seconds]);

  const handleChange = (index: number, val: string) => {
    // Only accept numeric inputs
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Jump to next input if filled
    if (val && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace logic
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setSeconds(59);
    setOtp(['', '', '', '']);
    toast('Code Sent', 'A fresh 4-digit verification code has been dispatched.', 'info');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    
    if (code.length < 4) {
      toast('Verification Error', 'Please complete the 4-digit security code.', 'error');
      return;
    }

    setIsLoading(true);
    // Simulate API checks
    setTimeout(async () => {
      setIsLoading(false);
      // Automatically logs in user as standard Employee for testing purposes
      await login('sarah.j@aurora.io', 'employee');
      toast('Identity Verified', 'Welcome aboard your secure dashboard.', 'success');
      navigate('/employee/dashboard');
    }, 1200);
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
            <Fingerprint className="h-6.5 w-6.5" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Identity Verification</h2>
          <p className="text-xs text-muted-foreground">We sent a 4-digit numeric code. Please check your inbox.</p>
        </div>

        <Card className="border border-border shadow-premium">
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="space-y-6">
              
              {/* Numeric blocks */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    ref={(el) => { inputsRef.current[index] = el; }}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-xl font-bold rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Verify & Proceed
                </Button>

                {/* Resend and Counter controls */}
                <div className="flex items-center justify-center text-xs font-medium">
                  {seconds > 0 ? (
                    <span className="text-muted-foreground">
                      Resend link locks for <span className="text-foreground font-semibold">{seconds}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="flex items-center gap-1.5 text-primary hover:underline font-semibold focus:outline-none"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Resend Verification Code</span>
                    </button>
                  )}
                </div>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default OTP;
