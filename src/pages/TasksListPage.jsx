import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import StatusBadge from '@/components/StatusBadge';
import { ListChecks, Filter, Search, Eye, Trash2, Play, Pause, PlusCircle, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const moduleOptions = ["All Modules", "Scraper Parser", "Vulnerability Scanner", "Dorks Checker", "Dumper", "Dehasher"];
const statusOptions = ["All Statuses", "Pending", "Queued", "Running", "Completed", "Failed"];

const TasksListPage = ({ variants, transition, tasks, deleteTask, updateTask }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('All Modules');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortConfig, setSortConfig] = useState({ key: 'created', direction: 'descending' });
  const { toast } = useToast();

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(task => selectedModule === 'All Modules' || task.module === selectedModule)
      .filter(task => selectedStatus === 'All Statuses' || task.status === selectedStatus)
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
  }, [tasks, searchTerm, selectedModule, selectedStatus, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (taskId) => {
    if (window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      deleteTask(taskId);
      toast({ title: "Task Deleted", description: `Task ${taskId} has been removed.`, variant: "destructive" });
    }
  };

  const handleToggleStatus = (task) => {
    if (task.status === 'Running') {
      updateTask(task.id, { status: 'Pending' });
      toast({ title: "Task Paused", description: `Task ${task.id} has been paused.` });
    } else if (task.status === 'Pending' || task.status === 'Queued') {
      updateTask(task.id, { status: 'Running' });
      toast({ title: "Task Resumed", description: `Task ${task.id} is now running.` });
    }
  };

  const SortableHeader = ({ children, columnKey }) => {
    const isActive = sortConfig.key === columnKey;
    const iconDirection = sortConfig.direction === 'ascending' ? 'asc' : 'desc';
    return (
        <th scope="col" className="table-header-cell cursor-pointer hover:bg-slate-700/50" onClick={() => requestSort(columnKey)}>
            <div className="flex items-center">
                {children}
                {isActive && <ArrowUpDown size={14} className={`ml-1.5 text-primary opacity-70 ${iconDirection === 'desc' ? 'rotate-180' : '' }`} />}
            </div>
        </th>
    );
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className="h-full flex flex-col p-6 md:p-8 bg-slate-950 overflow-y-auto"
    >
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center"><ListChecks size={28} className="mr-3 text-primary" />All Tasks</h1>
            <p className="text-sm text-slate-400">Monitor and manage your parsing, scanning, and dumping operations.</p>
        </div>
        <Link to="/builder">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <PlusCircle size={18} className="mr-2"/> New Task
            </Button>
        </Link>
      </header>

      <Card className="glassmorphism-card mb-6">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200 flex items-center"><Filter size={18} className="mr-2 text-primary"/>Filter & Sort Tasks</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search by Task Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/70 border-slate-700 focus:border-primary text-sm"
            />
          </div>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="bg-slate-800/70 border-slate-700 text-slate-300 focus:border-primary text-sm">
              <SelectValue placeholder="Filter by module..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
              {moduleOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="bg-slate-800/70 border-slate-700 text-slate-300 focus:border-primary text-sm">
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
              {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <div className="bg-slate-900/70 rounded-lg shadow-xl border border-slate-800 overflow-hidden flex-grow">
        <div className="overflow-x-auto h-full">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800/50 sticky top-0 z-10">
              <tr>
                <SortableHeader columnKey="id">Task ID</SortableHeader>
                <SortableHeader columnKey="name">Task Name</SortableHeader>
                <SortableHeader columnKey="module">Module</SortableHeader>
                <SortableHeader columnKey="status">Status</SortableHeader>
                <SortableHeader columnKey="progress">Progress</SortableHeader>
                <SortableHeader columnKey="results">Results</SortableHeader>
                <SortableHeader columnKey="created">Created</SortableHeader>
                <th scope="col" className="table-header-cell text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="table-row-hover">
                  <td className="table-body-cell font-mono text-primary/80">{task.id}</td>
                  <td className="table-body-cell font-medium text-slate-200">{task.name}</td>
                  <td className="table-body-cell">{task.module}</td>
                  <td className="table-body-cell">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="table-body-cell">
                    <div className="flex items-center">
                      <Progress value={task.progress} className="w-20 h-1.5 mr-2 bg-slate-700" indicatorClassName={task.status === 'Failed' ? 'bg-destructive' : 'bg-primary'} />
                      <span className="text-xs text-slate-400">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="table-body-cell text-right font-mono text-slate-300">{Object.values(task.results).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0).toLocaleString()}</td>
                  <td className="table-body-cell text-xs text-slate-400">{new Date(task.created).toLocaleDateString()}</td>
                  <td className="table-body-cell text-center">
                    <div className="flex items-center justify-center space-x-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to={`/task/${task.id}`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary">
                              <Eye size={14} />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>View Details</p></TooltipContent>
                      </Tooltip>
                      {(task.status === 'Running' || task.status === 'Pending' || task.status === 'Queued') && (
                         <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-yellow-400" onClick={() => handleToggleStatus(task)}>
                                {task.status === 'Running' ? <Pause size={14} /> : <Play size={14} />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>{task.status === 'Running' ? 'Pause Task' : 'Resume Task'}</p></TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-destructive" onClick={() => handleDeleteClick(task.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>Delete Task</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
               {filteredTasks.length === 0 && (
                <tr>
                    <td colSpan="8" className="text-center py-10 text-slate-500 font-roboto-mono">
                        No tasks match your criteria.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default TasksListPage;