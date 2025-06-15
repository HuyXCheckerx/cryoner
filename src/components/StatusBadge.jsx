import React from 'react';
import { cn } from '@/lib/utils';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    running: 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    queued: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border',
        statusStyles[status.toLowerCase()] || 'bg-slate-600/20 text-slate-300 border-slate-600/30'
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;