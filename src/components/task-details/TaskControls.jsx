import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StopCircle, Download, Trash2 } from 'lucide-react';

const TaskControls = ({ task, onStop, onDownload, onDelete }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
    <TabsList className="bg-slate-800/70 border border-slate-700/50">
      <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-primary">Overview</TabsTrigger>
      <TabsTrigger value="settings" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-primary">Settings</TabsTrigger>
    </TabsList>
    <div className="flex space-x-2">
      {task.status === 'Running' && (
        <Button variant="destructive" size="sm" onClick={() => onStop(task.id)}>
          <StopCircle size={16} className="mr-2" /> Stop
        </Button>
      )}
      <Button variant="outline" size="sm" className="text-primary border-primary/70 hover:bg-primary/10" onClick={() => onDownload(task.id)}>
        <Download size={16} className="mr-2" /> Download
      </Button>
      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={() => onDelete(task.id)}>
        <Trash2 size={16} className="mr-2" /> Delete
      </Button>
    </div>
  </div>
);

export default TaskControls;