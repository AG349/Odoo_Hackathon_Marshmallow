import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatTime(timeString: string): string {
  return timeString; // Simple forwarder for mock formatted strings
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
    case 'present':
    case 'approved':
    case 'paid':
      return 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20';
    case 'on leave':
    case 'half day':
    case 'pending':
    case 'processing':
      return 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20';
    case 'absent':
    case 'rejected':
    case 'on hold':
    case 'suspended':
      return 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
}
