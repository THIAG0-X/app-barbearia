import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'cancelled';
  className?: string;
}

const labels: Record<string, string> = {
  pending: 'Pendente',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      status === 'pending' && 'bg-accent/20 text-accent-foreground',
      status === 'completed' && 'bg-green-100 text-green-800',
      status === 'cancelled' && 'bg-destructive/10 text-destructive',
      className
    )}
  >
    {labels[status]}
  </span>
);

export default StatusBadge;
