import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import StatusBadge from '@/components/StatusBadge';
import { DatabaseZap, UploadCloud, Play, Download, ArrowRight, Server, Settings, Target, Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Area } from 'recharts';

function useCountUp(value, duration = 500) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const start = ref.current;
    const end = value;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = end;
    }
    requestAnimationFrame(animate);
  }, [value, duration]);
  return display;
}

const DumperPage = ({ variants, transition, createTask }) => {
  const { toast } = useToast();
  const [targets, setTargets] = useState('');
  const [selectedTargetFile, setSelectedTargetFile] = useState(null);
  const [dumpMethod, setDumpMethod] = useState('auto_detect');
  const [currentDump, setCurrentDump] = useState(null);
  const [stats, setStats] = useState({
    rowsDumpedPerMin: 0,
    cpuUsage: 0,
    dumpSpeed: 0,
    totalRows: 0,
    elapsed: 0,
    tablesFound: 0,
    progress: 0,
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [rowsHistory, setRowsHistory] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [tablesHistory, setTablesHistory] = useState([]);

  const rowsCount = useCountUp(stats.rowsDumpedPerMin);
  const cpuCount = useCountUp(stats.cpuUsage);
  const speedDisplay = useCountUp(stats.dumpSpeed);
  const tablesDisplay = useCountUp(stats.tablesFound);
  const totalRowsCount = useCountUp(stats.totalRows);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setStats(prev => {
        // Simulate stats
        const newRowsPerMin = Math.floor(Math.random() * 10000 + 20000); // 20k-30k rows/min
        const newCPU = Math.floor(Math.random() * 30 + 40); // 40-70%
        const newSpeed = Math.floor(Math.random() * 100 + 200); // 200-300 MB/min
        const newTables = prev.tablesFound + Math.floor(Math.random() * 2);
        const newTotalRows = prev.totalRows + newRowsPerMin;
        const newProgress = Math.min(prev.progress + (newRowsPerMin / 1000000), 1);
        setRowsHistory(h => ([...h.slice(-19), { value: newRowsPerMin }]));
        setCpuHistory(h => ([...h.slice(-19), { value: newCPU }]));
        setSpeedHistory(h => ([...h.slice(-19), { value: newSpeed }]));
        setTablesHistory(h => ([...h.slice(-19), { value: newTables }]));
        return {
          rowsDumpedPerMin: newRowsPerMin,
          cpuUsage: newCPU,
          dumpSpeed: newSpeed,
          totalRows: newTotalRows,
          elapsed: prev.elapsed + 1,
          tablesFound: newTables,
          progress: newProgress,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const graphConfigs = [
    {
      label: 'ROWS / MIN',
      value: rowsCount,
      history: rowsHistory,
      key: 'rows',
    },
    {
      label: 'DUMP SPEED (MB/MIN)',
      value: speedDisplay,
      history: speedHistory,
      key: 'speed',
    },
    {
      label: 'CPU USAGE',
      value: cpuCount + '%',
      history: cpuHistory,
      key: 'cpu',
    },
    {
      label: 'TABLES FOUND',
      value: tablesDisplay,
      history: tablesHistory,
      key: 'tables',
    },
    {
      label: 'TOTAL ROWS',
      value: totalRowsCount,
      history: [{ value: totalRowsCount }],
      key: 'total-rows',
    },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedTargetFile(file);
      setTargets('');
      toast({ title: "File Selected", description: `${file.name} ready for upload.` });
    }
  };

  const handleStartDump = () => {
    if (!targets && !selectedTargetFile) {
      toast({ title: "No Targets", description: "Please enter target URLs/IPs or upload a list.", variant: "destructive" });
      return;
    }
    const taskName = selectedTargetFile ? `Dumping from ${selectedTargetFile.name}` : `Dumping custom targets`;
    
    createTask({
        name: taskName,
        module: 'Dumper',
        type: 'dumper',
        status: 'Running',
        results: { rowsDumped: 0, tablesFound: 0, dumpSpeed: 0 },
        graphs: { dumpSpeed: [], dataComposition: [] },
        settings: { target: selectedTargetFile ? selectedTargetFile.name : 'Custom List', method: dumpMethod }
    });

    setCurrentDump({ name: taskName, progress: 0, status: 'Queued' });
    setIsSimulating(true);
    setStats({
      rowsDumpedPerMin: 0,
      cpuUsage: 0,
      dumpSpeed: 0,
      totalRows: 0,
      elapsed: 0,
      tablesFound: 0,
      progress: 0,
    });
    setRowsHistory([]);
    setCpuHistory([]);
    setSpeedHistory([]);
    setTablesHistory([]);
    
    let progress = 0;
    setCurrentDump(prev => ({...prev, status: 'Running'}));
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setCurrentDump(prev => ({...prev, progress, status: 'Completed'}));
        setIsSimulating(false);
        toast({ title: "Dump Completed!", description: `${taskName} finished successfully.` });
      } else {
        setCurrentDump(prev => ({...prev, progress, status: 'Running'}));
      }
    }, 700);
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center">
          <DatabaseZap size={28} className="mr-3 text-primary" /> Data Dumper Module
        </h1>
        <p className="text-sm text-slate-400">Automate data extraction from various sources.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glassmorphism-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200 flex items-center"><Settings size={18} className="mr-2 text-primary"/>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targets" className="text-sm font-medium text-slate-300 mb-1 block">Target List (URLs/IPs, one per line)</Label>
              <Textarea 
                id="targets" 
                placeholder="e.g., http://example.com/wp--4" 
                value={targets}
                onChange={(e) => {setTargets(e.target.value); setSelectedTargetFile(null);}}
                className="bg-slate-800/70 border-slate-700 focus:border-primary h-32 text-sm"
                disabled={!!selectedTargetFile}
              />
            </div>
            <div className="text-center text-xs text-slate-500 my-2">OR</div>
            <div>
                <input type="file" id="targetFile" onChange={handleFileChange} accept=".txt" className="hidden" />
                <Button variant="outline" className="w-full justify-start text-left border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-400 h-10 text-sm" onClick={() => document.getElementById('targetFile').click()}>
                    <UploadCloud size={16} className="mr-2 text-slate-500" />
                    {selectedTargetFile ? selectedTargetFile.name : "Upload Target File (.txt)"}
                </Button>
            </div>
             <div>
              <Label htmlFor="dumpMethod" className="text-sm font-medium text-slate-300 mb-1 block">Dumping Method</Label>
              <Select value={dumpMethod} onValueChange={setDumpMethod}>
                <SelectTrigger id="dumpMethod" className="bg-slate-800/70 border-slate-700 text-slate-300 focus:border-primary text-sm">
                  <SelectValue placeholder="Choose method" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="auto_detect">Auto-Detect</SelectItem>
                  <SelectItem value="sqli_union">SQLi (Union-based)</SelectItem>
                  <SelectItem value="sqli_error">SQLi (Error-based)</SelectItem>
                  <SelectItem value="wp_creds">WordPress Credentials</SelectItem>
                  <SelectItem value="cpanel_backup">cPanel Backup Exploit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleStartDump} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2" disabled={!!currentDump && currentDump.status === 'Running'}>
              {currentDump?.status === 'Running' ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Play size={16} className="mr-2"/>}
              {currentDump?.status === 'Running' ? 'Dumping...' : 'Start Dump'}
            </Button>
          </CardContent>
        </Card>

        <Card className="glassmorphism-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200 flex items-center"><Target size={18} className="mr-2 text-primary"/>Live Dump Overview</CardTitle>
            <CardDescription className="text-slate-400 text-xs">Monitor current dumping operations and view results.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stats and Graphs Section */}
            <div className="flex flex-wrap gap-8 mb-8">
              {graphConfigs.map(cfg => (
                <motion.div
                  key={cfg.key}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-xl bg-[#18191c] shadow p-6 flex flex-col flex-1 min-w-[200px] transition-all duration-300 ease-out"
                >
                  <div className="mb-1">
                    <span className="text-3xl font-bold text-white">{typeof cfg.value === 'number' ? cfg.value.toLocaleString() : cfg.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground tracking-widest uppercase mb-2">{cfg.label}</span>
                  <div className="w-full h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cfg.history} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`whiteArea-${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fff" stopOpacity={0.18} />
                            <stop offset="100%" stopColor="#fff" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="none" fill={`url(#whiteArea-${cfg.key})`} fillOpacity={1} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#fff"
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={true}
                          strokeLinecap="round"
                          style={{ filter: 'drop-shadow(0 0 6px #fff)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Progress Bar and Time */}
            {currentDump ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-slate-200 truncate" title={currentDump.name}>{currentDump.name}</p>
                    <StatusBadge status={currentDump.status}/>
                </div>
                <Progress value={currentDump.progress} className="h-2 bg-slate-700" indicatorClassName={currentDump.status === 'Failed' ? 'bg-destructive' : 'bg-primary'} />
                <div className="flex justify-between text-xs text-slate-400">
                    <span>Progress: {currentDump.progress}%</span>
                    <span>Status: {currentDump.status}</span>
                </div>
                <div className="w-full flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
                  <div className="w-full md:w-2/3">
                    <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                      <span>DUMP PROGRESS</span>
                      <span className="font-bold text-foreground">{Math.round(stats.progress * 1000) / 10}%</span>
                    </div>
                    <Progress value={stats.progress * 100} className="h-5 rounded-full bg-secondary shadow-lg" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 md:mt-0 md:ml-4">
                    <span className="font-bold text-foreground">{totalRowsCount.toLocaleString()}</span> rows •
                    <span className="font-bold text-foreground ml-2">{Math.floor(stats.elapsed / 60)}:{(stats.elapsed % 60).toString().padStart(2, '0')}</span> elapsed
                  </div>
                </div>
                {currentDump.status === 'Completed' && (
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-md border border-slate-700">
                        <h4 className="font-semibold text-slate-100 mb-2">Dump Results:</h4>
                        <p className="text-sm text-green-400">Successfully extracted 5.5 GB of data.</p>
                        <p className="text-xs text-slate-400 mt-1">Contains: User credentials, Database tables, System logs.</p>
                        <Button variant="outline" size="sm" className="mt-3 text-primary border-primary/70 hover:bg-primary/10">
                            <Download size={14} className="mr-2"/> Download Dump Archive
                        </Button>
                    </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <Server size={40} className="mx-auto text-slate-600 mb-3" />
                <p className="text-slate-500">No active dump operation.</p>
                <p className="text-xs text-slate-600">Configure and start a new dump to see live progress.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DumperPage;