import React from 'react';
import { cn } from '../../utils';
import { motion } from 'framer-motion';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorColor?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  indicatorColor = 'bg-primary', 
  className, 
  ...props 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-secondary border border-border/10", className)}
      {...props}
    >
      <motion.div
        className={cn("h-full w-full flex-1 transition-all", indicatorColor)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};
