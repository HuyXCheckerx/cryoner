import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, ScanLine, Play, Loader2 } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { Progress } from '@/components/ui/progress';

const SEARCH_ENGINES = [
  { label: 'Google Proxyless PRE2.5', value: 'google-proxyless', pro: true },
  { label: 'Bing', value: 'bing' },
  { label: 'Yandex', value: 'yandex' },
  { label: 'DuckDuckGo', value: 'duckduckgo' },
];

const IS_PRO_USER = true; // Assume user is PRO

// Animated count up hook
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

const ParserPage = ({ variants, transition, createTask }) => {
  const { toast } = useToast();
  const [dataFile, setDataFile] = useState(null);
  const [proxiesFile, setProxiesFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsingRules, setParsingRules] = useState('');
  const [selectedEngine, setSelectedEngine] = useState(SEARCH_ENGINES[0].value);
  const [stats, setStats] = useState({
    linesParsedPerMin: 0,
    cpuUsage: 0,
    proxyPerformance: 0,
    totalLines: 0,
    elapsed: 0,
    validLinks: 0,
    filteredLinks: 0,
    progress: 0,
    antipublicLinks: 0,
    totalLinksRate: 0,
    antipublicLinksRate: 0,
    dorkRate: 0,
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [linesHistory, setLinesHistory] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [linksHistory, setLinksHistory] = useState([]);
  const [antipublicLinksHistory, setAntipublicLinksHistory] = useState([]);
  const [dorkRateHistory, setDorkRateHistory] = useState([]);
  const [totalDorkUsedHistory, setTotalDorkUsedHistory] = useState([]);

  const linesCount = useCountUp(stats.linesParsedPerMin);
  const cpuCount = useCountUp(stats.cpuUsage);
  const linksPerSecondDisplay = useCountUp(stats.currentNewTotalLinksPerSec || 0);
  const antipublicLinksDisplay = useCountUp(stats.antipublicLinks || 0);
  const dorkRateDisplay = useCountUp(stats.dorkRate || 0);
  const totalLinesCount = useCountUp(stats.totalLines);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setStats(prev => {
        // Simulate stats
        const newDorkPerSec = Math.floor(Math.random() * 100 + 100); // 100-200 DORK / SECOND
        const newCPU = Math.floor(Math.random() * 30 + 40); // 40-70%

        const currentNewTotalLinksPerSec = Math.floor(Math.random() * 20000 + 30000); // 30k-50k links per second
        const currentNewValidLinksPerSec = Math.floor(currentNewTotalLinksPerSec * (0.8 + Math.random() * 0.2)); // 80-100% valid of new total
        const currentNewFilteredLinksPerSec = currentNewTotalLinksPerSec - currentNewValidLinksPerSec;

        const currentNewAntipublicPerSec = Math.floor(currentNewValidLinksPerSec * (0.3 + Math.random() * 0.1)); // 30-40% of new valid links

        const newDorkRateValue = currentNewTotalLinksPerSec / newDorkPerSec; // Calculated Links / Dork

        const newTotalLines = prev.totalLines + newDorkPerSec; // Cumulative total dork used
        const newProgress = Math.min(prev.progress + (newDorkPerSec / 100000), 1); // Progress based on Dorks

        // Update history arrays (store per-second rates for plotting)
        setLinesHistory(h => ([...h.slice(-19), { value: newDorkPerSec }]));
        setCpuHistory(h => ([...h.slice(-19), { value: newCPU }]));
        setLinksHistory(h => ([...h.slice(-19), { value: currentNewTotalLinksPerSec }]));
        setAntipublicLinksHistory(h => ([...h.slice(-19), { value: currentNewAntipublicPerSec }]));
        setDorkRateHistory(h => ([...h.slice(-19), { value: newDorkRateValue }]));
        setTotalDorkUsedHistory(h => ([...h.slice(-19), { value: newTotalLines }]));

        return {
          linesParsedPerMin: newDorkPerSec,
          cpuUsage: newCPU,
          proxyPerformance: prev.proxyPerformance,
          totalLines: newTotalLines,
          elapsed: prev.elapsed + 1,
          // Cumulative totals for display in graph cards
          totalLinks: prev.totalLinks + currentNewTotalLinksPerSec,
          validLinks: prev.validLinks + currentNewValidLinksPerSec,
          filteredLinks: prev.filteredLinks + currentNewFilteredLinksPerSec,
          antipublicLinks: prev.antipublicLinks + currentNewAntipublicPerSec,
          currentNewTotalLinksPerSec: currentNewTotalLinksPerSec,
          progress: newProgress,
          dorkRate: newDorkRateValue,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleDataFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setDataFile(file);
      toast({ title: "Data File Selected", description: `${file.name} ready for parsing.` });
    }
  };
  
  const handleProxiesFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProxiesFile(file);
      toast({ title: "Proxies File Selected", description: `${file.name} ready.` });
    }
  };

  const handleStartTask = async () => {
    if (!dataFile) {
      toast({ title: "No Data File Provided", description: "Please upload a data file.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setIsSimulating(true);
    createTask({
        name: `Parse task for ${dataFile.name}`,
        module: 'Parser',
        type: 'parser',
        status: 'Running',
        results: { linesParsed: 0, dataPoints: 0, parseSpeed: 0 },
        graphs: { cpuUsage: [], proxyPerformance: [] },
        settings: { source: dataFile.name, proxies: proxiesFile?.name || "None", rules: parsingRules ? 'Custom' : 'Default', engine: selectedEngine }
    });
    toast({ title: "Parser Task Started", description: `Parsing ${dataFile.name}. Check the Tasks page for progress.` });
    setTimeout(() => {
        setIsProcessing(false);
        setIsSimulating(false);
        setDataFile(null);
        setProxiesFile(null);
        setParsingRules('');
        setStats({
          linesParsedPerMin: 0,
          cpuUsage: 0,
          proxyPerformance: 0,
          totalLines: 0,
          elapsed: 0,
          totalLinks: 0,
          validLinks: 0,
          filteredLinks: 0,
          antipublicLinks: 0,
          progress: 0,
          dorkRate: 0,
          currentNewTotalLinksPerSec: 0,
        });
        // Reset histories as well
        setLinesHistory([]);
        setCpuHistory([]);
        setLinksHistory([]);
        setAntipublicLinksHistory([]);
        setDorkRateHistory([]);
        setTotalDorkUsedHistory([]);
    }, 1500 * 60); // Simulate 1.5 min task
  };

  const graphConfigs = [
    {
      label: 'DORK / SECOND',
      value: linesCount,
      history: linesHistory,
      key: 'lines',
    },
    {
      label: 'LINKS / SECOND',
      value: linksPerSecondDisplay,
      history: linksHistory,
      key: 'links-per-second',
    },
    {
      label: 'CPU USAGE',
      value: cpuCount + '%',
      history: cpuHistory,
      key: 'cpu',
    },
    {
      label: 'ANTIPUBLIC / LINKS',
      value: antipublicLinksDisplay,
      history: antipublicLinksHistory,
      key: 'antipublic-links',
    },
    {
      label: 'LINKS / DORK',
      value: dorkRateDisplay.toFixed(0) + ' links/dork ',
      history: dorkRateHistory,
      key: 'dork-link-rate',
    },
    {
      label: 'AMOUNT OF DORK USED',
      value: totalLinesCount,
      history: totalDorkUsedHistory,
      key: 'total-dork-used',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="h-full flex flex-col p-6 md:p-8 bg-background overflow-y-auto"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center">
          <ScanLine size={28} className="mr-3 text-primary" /> Parser Module
        </h1>
        <p className="text-sm text-slate-400">Configure and start a new data parsing task.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
        <Card className="glassmorphism-card h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200">Task Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataFile" className="text-sm font-medium text-slate-300 mb-1 block">Upload Data File</Label>
              <input type="file" id="dataFile" onChange={handleDataFileChange} accept=".txt" className="hidden" disabled={isProcessing} />
              <Button variant="outline" className="w-full justify-start text-left border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-400 h-10 text-sm" onClick={() => document.getElementById('dataFile').click()} disabled={isProcessing}>
                  <UploadCloud size={16} className="mr-2 text-slate-500" />
                  {dataFile ? dataFile.name : "Upload data file (.txt)"}
              </Button>
            </div>

            <div>
              <Label htmlFor="proxiesFile" className="text-sm font-medium text-slate-300 mb-1 block">Upload Proxies (Optional)</Label>
              <input type="file" id="proxiesFile" onChange={handleProxiesFileChange} accept=".txt" className="hidden" disabled={isProcessing} />
              <Button variant="outline" className="w-full justify-start text-left border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-400 h-10 text-sm" onClick={() => document.getElementById('proxiesFile').click()} disabled={isProcessing}>
                  <UploadCloud size={16} className="mr-2 text-slate-500" />
                  {proxiesFile ? proxiesFile.name : "Upload proxies file (.txt)"}
              </Button>
            </div>

             <div>
                <Label htmlFor="parsingRules" className="text-sm font-medium text-slate-300 mb-1 block">Parsing Rules (Optional)</Label>
                <Textarea id="parsingRules" value={parsingRules} onChange={e => setParsingRules(e.target.value)} placeholder="Define custom parsing logic, e.g., regex captures." className="bg-slate-800/70 border-slate-700 focus:border-primary text-sm min-h-[120px]" disabled={isProcessing}/>
             </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-300 mb-1 block">Search Engine</Label>
              <div className="flex gap-2 mt-1">
                {SEARCH_ENGINES.map(engine => (
                  <button
                    key={engine.value}
                    type="button"
                    onClick={() => setSelectedEngine(engine.value)}
                    disabled={engine.pro && !IS_PRO_USER}
                    className={`px-6 py-2.5 rounded-full shadow-md border transition-all duration-300 ease-out text-sm font-semibold
                      ${selectedEngine === engine.value ? 'bg-primary text-primary-foreground ring-2 ring-primary/60 scale-105' : 'bg-card text-muted-foreground border-border hover:bg-accent/10 hover:scale-105'}
                      ${engine.pro ? 'relative' : ''}
                      ${engine.pro && !IS_PRO_USER ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {engine.label}
                    {engine.pro && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">PRO</span>
                    )}
                  </button>
                ))}
              </div>
              {selectedEngine === 'google-proxyless' && IS_PRO_USER && (
                <span className="text-xs text-primary font-semibold mt-1 inline-block">PRO feature enabled</span>
              )}
            </div>
            
            <Button onClick={handleStartTask} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2" disabled={isProcessing || !dataFile}>
              {isProcessing ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Play size={16} className="mr-2"/>}
              {isProcessing ? 'Starting Task...' : 'Start Parsing Task'}
            </Button>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="w-full flex flex-col gap-8"
        >
          <div className="flex flex-wrap gap-8">
            {graphConfigs.map(cfg => (
              <motion.div
                key={cfg.key}
                whileHover={{ scale: 1.03 }}
                className="rounded-xl bg-[#18191c] shadow p-6 flex flex-col flex-1 min-w-[240px] transition-all duration-300 ease-out"
              >
                <div className="mb-1">
                  <span className="text-3xl font-bold text-white">{typeof cfg.value === 'number' ? cfg.value.toLocaleString() : cfg.value}</span>
                </div>
                <span className="text-xs text-muted-foreground tracking-widest uppercase mb-2">{cfg.label}</span>
                <div className="w-full h-24">
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
          <div className="w-full flex flex-col md:flex-row justify-between items-center mt-8 gap-2">
            <div className="w-full md:w-2/3">
              <div className="text-xs text-muted-foreground mb-1 flex justify-between">
                <span>DORK PROGRESS</span>
                <span className="font-bold text-foreground">{Math.round(stats.progress * 1000) / 10}%</span>
              </div>
              <Progress value={stats.progress * 100} className="h-5 rounded-full bg-secondary shadow-lg" />
            </div>
            <div className="text-xs text-muted-foreground mt-2 md:mt-0 md:ml-4">
              <span className="font-bold text-foreground">{totalLinesCount.toLocaleString()}</span> lines •
              <span className="font-bold text-foreground ml-2">{Math.floor(stats.elapsed / 60)}:{(stats.elapsed % 60).toString().padStart(2, '0')}</span> elapsed
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ParserPage;