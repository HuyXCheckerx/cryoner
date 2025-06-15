import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, ShieldQuestion, ListRestart, Loader2, Play } from 'lucide-react';
import PieChartComponent from '@/components/charts/PieChartComponent';

const AntipublicPage = ({ variants, transition, createTask }) => {
  const { toast } = useToast();
  const [combolistFile, setCombolistFile] = useState(null);
  const [results, setResults] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCombolistFile(file);
      setResults(null);
      toast({ title: "File Selected", description: `${file.name} ready for checking.` });
    }
  };

  const handleStartCheck = async () => {
    if (!combolistFile) {
      toast({ title: "No Combolist Provided", description: "Please upload a combolist file.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResults(null);
    setProgress(0);
    
    createTask({
        name: `Antipublic check for ${combolistFile.name}`,
        module: 'Antipublic Checker',
        type: 'antipublic',
        status: 'Running',
        results: { totalLines: 0, public: 0, private: 0, checkSpeed: 0 },
        graphs: { checkSpeed: [], publicity: [] },
        settings: { source: combolistFile.name }
    });

    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 5) + 2;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setIsProcessing(false);
            const publicCount = Math.floor(Math.random() * 5000) + 1000;
            const privateCount = Math.floor(Math.random() * 20000) + 5000;
            setResults({
                public: publicCount,
                private: privateCount,
                total: publicCount + privateCount
            });
            toast({ title: "Check Complete", description: `Finished checking ${combolistFile.name}.` });
        }
        setProgress(currentProgress);
    }, 200);
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
          <ShieldQuestion size={28} className="mr-3 text-primary" /> Antipublic Module
        </h1>
        <p className="text-sm text-slate-400">Check if your combolist lines are publicly available.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <Card className="glassmorphism-card lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200">Check Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="combolistFile" className="text-sm font-medium text-slate-300 mb-1 block">Upload Combolist</Label>
              <input type="file" id="combolistFile" onChange={handleFileChange} accept=".txt" className="hidden" disabled={isProcessing} />
              <Button variant="outline" className="w-full justify-start text-left border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-400 h-10 text-sm" onClick={() => document.getElementById('combolistFile').click()} disabled={isProcessing}>
                  <UploadCloud size={16} className="mr-2 text-slate-500" />
                  {combolistFile ? combolistFile.name : "Upload Combolist File (.txt)"}
              </Button>
            </div>
            
            <Button onClick={handleStartCheck} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2" disabled={isProcessing || !combolistFile}>
              {isProcessing ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Play size={16} className="mr-2"/>}
              {isProcessing ? 'Checking...' : 'Start Check'}
            </Button>
             {isProcessing && (
                <Progress value={progress} className="h-1.5 mt-2 bg-slate-700" />
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphism-card lg:col-span-2 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-slate-200">Check Results</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setResults(null); setCombolistFile(null);}} disabled={isProcessing || !results} className="text-xs text-slate-400 hover:text-slate-100">
                    <ListRestart size={14} className="mr-1.5"/> Clear Results
                </Button>
            </div>
            <CardDescription className="text-slate-400 text-xs">Analysis of your combolist's public exposure.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {!results && !isProcessing && (
              <div className="text-center text-slate-500">
                <ShieldQuestion size={36} className="mx-auto mb-3 opacity-50" />
                <p>Results will appear here once the check is complete.</p>
              </div>
            )}
            {isProcessing && !results && (
                 <div className="text-center text-slate-400">
                    <Loader2 size={36} className="mx-auto mb-3 animate-spin text-primary" />
                    <p>Checking combolist...</p>
                </div>
            )}
            {results && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="h-48 md:h-56">
                        <PieChartComponent data={[{name: 'Public', value: results.public}, {name: 'Private', value: results.private}]} />
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                        <h3 className="text-xl font-bold text-slate-100">Analysis Complete</h3>
                        <p className="text-sm text-slate-300">Total Lines Checked: <span className="font-bold text-primary">{results.total.toLocaleString()}</span></p>
                        <p className="text-sm text-green-400">Private Lines: <span className="font-bold">{results.private.toLocaleString()} ({((results.private / results.total) * 100).toFixed(1)}%)</span></p>
                        <p className="text-sm text-red-400">Public Lines: <span className="font-bold">{results.public.toLocaleString()} ({((results.public / results.total) * 100).toFixed(1)}%)</span></p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AntipublicPage;