import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BottomTaskBar from '@/components/BottomTaskBar';
import useLocalStorage from '@/hooks/useLocalStorage';

import DashboardPage from '@/pages/DashboardPage.jsx';
import BuilderPage from '@/pages/BuilderPage.jsx';
import TaskConfigPage from '@/pages/TaskConfigPage.jsx';
import TaskDetailPage from '@/pages/TaskDetailPage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';
import TasksListPage from '@/pages/TasksListPage.jsx';
import DumperPage from '@/pages/DumperPage.jsx';
import DehasherPage from '@/pages/DehasherPage.jsx';
import AntipublicPage from '@/pages/AntipublicPage.jsx';
import ParserPage from '@/pages/ParserPage.jsx';
import MachinesPage from '@/pages/MachinesPage.jsx';
import FilesPage from '@/pages/FilesPage.jsx';
import HistoryPage from '@/pages/HistoryPage.jsx';

const mockTasksData = [
  { 
    id: 'TSK001', 
    name: "Google Dork Scan", 
    module: 'Scraper Parser', 
    type: 'scraper', 
    status: 'Completed', 
    progress: 100, 
    results: { totalLinks: 12530, valid: 12530, filtered: 10000, dorkPerMinute: 3000, filterPerMinute: 21100 }, 
    created: '2025-06-10T10:00:00Z', 
    duration: '2m 15s', 
    timeRemaining: '0m 0s', 
    graphs: { 
      dorkSpeed: Array.from({length: 10}, (_, i) => ({ name: `${i*15}s`, speed: Math.floor(Math.random() * 1000) + 1000 })), 
      filterSpeed: Array.from({length: 10}, (_, i) => ({ name: `${i*15}s`, speed: Math.floor(Math.random() * 5000) + 10000 })) 
    }, 
    settings: { pages: 10, country: 'US', engine: 'Google', antipublic: true, keywords: true } 
  },
  { 
    id: 'TSK002', 
    name: "WordPress Vulnerability Check", 
    module: 'Vulnerability Scanner', 
    type: 'vulnerability', 
    status: 'Running', 
    progress: 65, 
    results: { totalLinks: 4, testedPerMinute: 960, vulnerabilitiesFound: 4, vulnerabilities: [{ type: 'Oracle', count: 1 }, { type: 'SQL Server', count: 3 }] }, 
    created: '2025-06-11T14:30:00Z', 
    duration: '1h 30m (est.)', 
    timeRemaining: '30m 0s', 
    graphs: { 
      testedSpeed: Array.from({length: 10}, (_, i) => ({ name: `${i*30}s`, speed: Math.floor(Math.random() * 500) + 700 })),
      vulnerabilityDistribution: [{ name: 'SQLi', value: 250 }, { name: 'XSS', value: 150 }, { name: 'RCE', value: 50 }]
    }, 
    settings: { scanTypes: ['SQL', 'XSS'], fullScan: { 'SQL': true, 'XSS': false } } 
  },
  {
    id: 'TSK004', name: "SQLi Database Dump", module: 'Dumper', type: 'dumper', status: 'Failed', progress: 30, created: '2025-06-12T10:00:00Z',
    results: { rowsDumped: 1520, tablesFound: 8, dumpSpeed: 50, databasesFound: 5, columnsFound: 120, adminsFound: 3 },
    duration: '0m 45s', timeRemaining: 'N/A',
    graphs: {
      dumpSpeed: Array.from({length: 5}, (_, i) => ({ name: `${i*10}s`, speed: Math.floor(Math.random() * 50) + 50 })),
      dataComposition: [{ name: 'Users', value: 450 }, { name: 'Emails', value: 450 }, { name: 'Passwords', value: 400 }, { name: 'Sessions', value: 220 }],
      foundItems: [{ name: 'Databases', count: 5 }, { name: 'Tables', count: 45 }, { name: 'Columns', count: 210 }, { name: 'Admins', count: 3 }],
      proxyBandwidth: Array.from({length: 5}, (_, i) => ({ name: `${i*10}s`, mbps: Math.floor(Math.random() * 50) + 20 }))
    },
    settings: { target: '198.51.100.2', method: 'Blind SQLi' }
  },
  {
    id: 'TSK005', name: "Bulk URL Dehash", module: 'Dehasher', type: 'dehasher', status: 'Completed', progress: 100, created: '2025-06-12T11:00:00Z',
    results: { totalHashes: 10000, cracked: 7800, notFound: 2200, crackSpeed: 12000 },
    duration: '5m 30s', timeRemaining: '0m 0s',
    graphs: {
      crackSpeed: Array.from({length: 6}, (_, i) => ({ name: `${i}m`, speed: Math.floor(Math.random() * 5000) + 8000 })),
      hashTypes: [{ name: 'MD5', value: 5000 }, { name: 'SHA-1', value: 2500 }, { name: 'bcrypt', value: 300 }],
      proxyBandwidth: Array.from({length: 6}, (_, i) => ({ name: `${i}m`, mbps: Math.floor(Math.random() * 50) + 100 }))
    },
    settings: { source: 'Imported file', hashType: 'Auto-Detect' }
  },
  {
    id: 'TSK006', name: "Combolist Check", module: 'Antipublic Checker', type: 'antipublic', status: 'Completed', progress: 100, created: '2025-06-13T09:00:00Z',
    results: { totalLines: 50000, publicLines: 12500, privateLines: 37500, checkSpeed: 80000 },
    duration: '3m 45s', timeRemaining: '0m 0s',
    graphs: {
      checkSpeed: Array.from({length: 4}, (_, i) => ({ name: `${i}m`, speed: Math.floor(Math.random() * 30000) + 60000 })),
      publicity: [{ name: 'Public', value: 12500 }, { name: 'Private', value: 37500 }],
    },
    settings: { source: 'combo_list_final.txt' }
  },
  {
    id: 'TSK007', name: 'Website Data Parsing', module: 'Parser', type: 'parser', status: 'Running', progress: 45, created: '2025-06-13T12:00:00Z',
    results: { linesParsed: 150000, dataPointsExtracted: 450000, parseSpeed: 5000 }, duration: '10m (est.)', timeRemaining: '5m 30s',
    graphs: {
      cpuUsage: Array.from({length: 6}, (_, i) => ({ name: `${i}m`, usage: Math.floor(Math.random() * 30) + 20 })),
      proxyPerformance: [{ name: 'Success', count: 18500 }, { name: 'Failed', count: 1500 }]
    },
    settings: { source: 'data_list.txt', rules: 'Custom Ruleset v2' }
  }
];

const mockHistoryData = [
  { id: 'EVT001', timestamp: '2025-06-11T14:45:00Z', type: 'Task Started', module: 'Scraper Parser', message: 'Task TSK002 initiated by user.', details: { taskId: 'TSK002', user: 'Admin' }, level: 'info' },
  { id: 'EVT002', timestamp: '2025-06-11T11:05:00Z', type: 'Task Completed', module: 'Dehasher', message: 'Task DHK001 completed.', details: { taskId: 'DHK001', found: 320, total: 500 }, level: 'success' },
];

const App = () => {
  const location = useLocation();
  const [tasks, setTasks] = useLocalStorage('tasks', mockTasksData);
  const [activityLogs, setActivityLogs] = useLocalStorage('activityLogs', mockHistoryData);
  const [activeTask, setActiveTask] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const addLog = (logEntry) => {
    const newLog = {
      id: `EVT${String(activityLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      ...logEntry,
    };
    setActivityLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const createTask = (taskData) => {
    const newTask = {
      id: `TSK${String(tasks.length + 1).padStart(3, '0')}`,
      status: 'Queued',
      progress: 0,
      created: new Date().toISOString(),
      ...taskData,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    addLog({ type: 'Task Created', message: `Task ${newTask.name} created.`, details: { taskId: newTask.id }, level: 'info' });
    startNewTask(newTask.name);
  };

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, ...updates } : task));
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    addLog({ type: 'Task Deleted', message: `Task ${taskId} deleted.`, details: { taskId }, level: 'warning' });
  };

  useEffect(() => {
    const runningTask = tasks.find(t => t.status === 'Running');
    if (runningTask && runningTask.progress < 100) {
      const intervalId = setInterval(() => {
        updateTask(runningTask.id, { progress: Math.min(100, runningTask.progress + 5) });
        if (runningTask.progress >= 95) {
            updateTask(runningTask.id, { status: 'Completed', progress: 100 });
            addLog({ type: 'Task Completed', message: `Task ${runningTask.name} completed.`, details: { taskId: runningTask.id }, level: 'success' });
            if(activeTask?.name === runningTask.name) {
                setActiveTask(prev => ({...prev, progress: 100}));
            }
        }
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [tasks, activeTask]);

  const startNewTask = (taskName) => {
    setActiveTask({ name: taskName, progress: 0 });
  };
  const clearActiveTask = () => {
    setActiveTask(null);
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex selection:bg-emerald-500 selection:text-white">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>}
        <main className={`flex-1 flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-60' : 'ml-0'}`}>
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<DashboardPage variants={pageVariants} transition={pageTransition} tasks={tasks} activityLogs={activityLogs} />} />
                <Route path="/builder" element={<BuilderPage variants={pageVariants} transition={pageTransition} />} />
                <Route path="/builder/configure/:moduleType" element={<TaskConfigPage variants={pageVariants} transition={pageTransition} createTask={createTask} tasks={tasks} />} />
                <Route path="/task/:taskId" element={<TaskDetailPage variants={pageVariants} transition={pageTransition} tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />} />
                <Route path="/tasks" element={<TasksListPage variants={pageVariants} transition={pageTransition} tasks={tasks} deleteTask={deleteTask} updateTask={updateTask} />} />
                <Route path="/dumper" element={<DumperPage variants={pageVariants} transition={pageTransition} createTask={createTask} />} />
                <Route path="/dehasher" element={<DehasherPage variants={pageVariants} transition={pageTransition} createTask={createTask} />} />
                <Route path="/antipublic" element={<AntipublicPage variants={pageVariants} transition={pageTransition} createTask={createTask} />} />
                <Route path="/parser" element={<ParserPage variants={pageVariants} transition={pageTransition} createTask={createTask} />} />
                <Route path="/machines" element={<MachinesPage variants={pageVariants} transition={pageTransition} />} />
                <Route path="/files" element={<FilesPage variants={pageVariants} transition={pageTransition} />} />
                <Route path="/history" element={<HistoryPage variants={pageVariants} transition={pageTransition} activityLogs={activityLogs} />} />
                <Route path="/settings" element={<SettingsPage variants={pageVariants} transition={pageTransition} />} />
              </Routes>
            </AnimatePresence>
          </div>
          <Toaster />
          {activeTask && <BottomTaskBar task={activeTask} onClearTask={clearActiveTask} />}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default App;