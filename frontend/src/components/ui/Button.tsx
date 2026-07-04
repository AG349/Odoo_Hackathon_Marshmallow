import React from 'react';
import { cn } from '../../utils';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseClass = cn(
      "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
      // Variants
      variant === 'primary' && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
      variant === 'outline' && "border border-border bg-transparent hover:bg-secondary text-foreground",
      variant === 'destructive' && "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
      variant === 'ghost' && "hover:bg-secondary hover:text-foreground text-muted-foreground",
      variant === 'link' && "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto",
      // Sizes
      size === 'sm' && "h-9 px-3 text-xs rounded-lg",
      size === 'md' && "h-11 px-5 text-sm",
      size === 'lg' && "h-12 px-6 text-base rounded-2xl",
      size === 'icon' && "h-10 w-10 p-0 rounded-lg",
      className
    );

    const buttonContent = (
      <>
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </>
    );

    return (
      <motion.button
        ref={ref as any}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={baseClass}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
