import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, ScanLine, Play, Loader2 } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const ParserPage = ({ variants, transition, createTask }) => {
  const { toast } = useToast();
  const [dataFile, setDataFile] = useState(null);
  const [proxiesFile, setProxiesFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsingRules, setParsingRules] = useState('');

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
    
    createTask({
        name: `Parse task for ${dataFile.name}`,
        module: 'Parser',
        type: 'parser',
        status: 'Running',
        results: { linesParsed: 0, dataPoints: 0, parseSpeed: 0 },
        graphs: { cpuUsage: [], proxyPerformance: [] },
        settings: { source: dataFile.name, proxies: proxiesFile?.name || "None", rules: parsingRules ? 'Custom' : 'Default' }
    });

    toast({ title: "Parser Task Started", description: `Parsing ${dataFile.name}. Check the Tasks page for progress.` });
    
    setTimeout(() => {
        setIsProcessing(false);
        setDataFile(null);
        setProxiesFile(null);
        setParsingRules('');
    }, 1500);
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
          <ScanLine size={28} className="mr-3 text-primary" /> Parser Module
        </h1>
        <p className="text-sm text-slate-400">Configure and start a new data parsing task.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
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
            
            <Button onClick={handleStartTask} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2" disabled={isProcessing || !dataFile}>
              {isProcessing ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Play size={16} className="mr-2"/>}
              {isProcessing ? 'Starting Task...' : 'Start Parsing Task'}
            </Button>
          </CardContent>
        </Card>

        <Card className="glassmorphism-card flex flex-col items-center justify-center text-center p-6">
            <ScanLine size={48} className="text-primary mb-4" />
            <h2 className="text-xl font-bold text-slate-100 mb-2">Advanced Parsing Engine</h2>
            <p className="text-slate-400 max-w-sm">
                Our engine supports complex rulesets and high-speed processing with or without proxies. 
                Configure your task here or use the <span className="font-semibold text-primary">Builder</span> for more advanced options.
            </p>
        </Card>
      </div>
    </motion.div>
  );
};

export default ParserPage;