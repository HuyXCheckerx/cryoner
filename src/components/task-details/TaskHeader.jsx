import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Edit3 } from 'lucide-react';

const TaskHeader = ({ task, onCopyId, onRename }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
    <div>
      <Link to="/tasks" className="inline-flex items-center text-sm text-primary hover:underline mb-1.5">
        <ArrowLeft size={16} className="mr-1" /> Back to All Tasks
      </Link>
      <h1 className="text-3xl font-bold text-slate-100 flex items-center">
        {task.name} <span className="text-xl text-slate-500 ml-2 font-normal">- {task.module}</span>
      </h1>
    </div>
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={onCopyId} className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200">
        <Copy size={14} className="mr-2" /> Copy Task ID
      </Button>
      <Button variant="outline" size="sm" onClick={() => onRename(task.id)} className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200">
        <Edit3 size={14} className="mr-2" /> Rename Task
      </Button>
    </div>
  </div>
);

export default TaskHeader;