import React from 'react';
import { cn, getStatusColor } from '../../utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'status';
  status?: string; // Optional helper for automatic color coding
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', status, children, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // Variants
        variant === 'default' && "border-transparent bg-primary text-primary-foreground shadow-sm",
        variant === 'secondary' && "border-transparent bg-secondary text-secondary-foreground",
        variant === 'outline' && "text-foreground border-border",
        variant === 'success' && "border-transparent bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
        variant === 'warning' && "border-transparent bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20",
        variant === 'danger' && "border-transparent bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20",
        variant === 'status' && status && getStatusColor(status),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
