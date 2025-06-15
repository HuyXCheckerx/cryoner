import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Clock, ArrowLeft } from 'lucide-react';

import TaskHeader from '@/components/task-details/TaskHeader';
import TaskControls from '@/components/task-details/TaskControls';
import OverviewContent from '@/components/task-details/overview/OverviewContent';
import SettingsContent from '@/components/task-details/SettingsContent';

const TaskDetailPage = ({ variants, transition, tasks, updateTask, deleteTask }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const foundTask = tasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
    }
    setIsLoading(false);
  }, [taskId, tasks]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(task.id);
    toast({ title: "Task ID Copied!", description: `${task.id} copied to clipboard.` });
  };

  const handleRename = (id) => {
    const newName = prompt("Enter new task name:", task.name);
    if (newName) {
      updateTask(id, { name: newName });
      toast({ title: "Task Renamed", description: `Task has been renamed to "${newName}".` });
    }
  };

  const handleStop = (id) => {
    updateTask(id, { status: 'Completed', progress: 100 });
    toast({ title: "Task Stopped", description: `Task ${id} has been stopped and marked as completed.` });
  };

  const handleDownload = (id) => {
    toast({ title: "Preparing Download", description: `Results for task ${id} are being prepared.` });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete task ${id}?`)) {
      deleteTask(id);
      toast({ title: "Task Deleted", description: `Task ${id} has been deleted.`, variant: "destructive" });
      navigate('/tasks');
    }
  };

  const renderProgressCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400">Progress</CardTitle></CardHeader>
        <CardContent>
          <Progress value={task.progress} className="h-3 bg-slate-700 mb-1" indicatorClassName={task.status === 'Failed' ? 'bg-destructive' : 'bg-primary'} />
          <p className="text-xs text-slate-400 text-right">{task.progress}% complete</p>
        </CardContent>
      </Card>
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400">Time Remaining</CardTitle></CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-slate-200">{task.timeRemaining}</p>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Clock size={48} className="text-primary animate-spin" />
          <p className="mt-2 text-slate-400">Loading task details...</p>
        </motion.div>
      </div>
    );
  }

  if (!task) {
    return (
      <motion.div
        className="h-full flex flex-col items-center justify-center text-center p-6"
        initial="initial" animate="in" exit="out" variants={variants} transition={transition}
      >
        <AlertTriangle size={64} className="text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Task Not Found</h1>
        <p className="text-slate-400 mb-6">The task with ID <span className="font-mono text-primary">{taskId}</span> could not be found.</p>
        <Link to="/tasks">
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tasks
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className="h-full flex flex-col p-6 md:p-8 bg-slate-950 overflow-y-auto"
    >
      <TaskHeader task={task} onCopyId={handleCopyId} onRename={handleRename} />
      
      <Tabs defaultValue="overview" className="flex-grow flex flex-col">
        <TaskControls task={task} onStop={handleStop} onDownload={handleDownload} onDelete={handleDelete} />
        <div className="flex-grow">
          <TabsContent value="overview" className="mt-0 h-full">
            <OverviewContent task={task} renderProgressCards={renderProgressCards} />
          </TabsContent>
          <TabsContent value="settings" className="mt-0 h-full">
            <SettingsContent task={task} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default TaskDetailPage;