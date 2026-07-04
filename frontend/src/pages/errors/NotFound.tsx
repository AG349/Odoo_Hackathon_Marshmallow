import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-6 bg-background text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md space-y-6"
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-sm mb-2">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-sans tracking-tight">404 Error</h1>
          <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
            The page you are looking for does not exist or has been shifted.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="primary" className="h-10 text-xs font-bold rounded-xl px-5">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
export default NotFound;
