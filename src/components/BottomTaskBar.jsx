import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, Loader, CheckCircle } from 'lucide-react';

const BottomTaskBar = ({ task, onClearTask }) => {
  if (!task) return null;

  const isCompleted = task.progress >= 100;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-20 right-0 bg-slate-800/80 backdrop-blur-md border-t border-slate-700/70 shadow-2xl z-50 px-6 py-3 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3 flex-grow min-w-0">
        {isCompleted ? (
          <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
        ) : (
          <Loader size={20} className="text-primary animate-spin flex-shrink-0" />
        )}
        <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate" title={task.name}>
                {isCompleted ? "Task Completed:" : "Running:"} {task.name}
            </p>
            <Progress value={task.progress} className="h-1.5 mt-1 bg-slate-700" indicatorClassName={isCompleted ? "bg-green-500" : "bg-primary"} />
        </div>
        <span className="text-xs text-slate-400 font-mono ml-2 flex-shrink-0">{task.progress}%</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClearTask}
        className="ml-4 text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 h-8 w-8"
      >
        <X size={18} />
      </Button>
    </motion.div>
  );
};

export default BottomTaskBar;