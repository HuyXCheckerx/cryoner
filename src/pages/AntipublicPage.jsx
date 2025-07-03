import React, { useState, useEffect } from 'react';
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
  const [checkStartTime, setCheckStartTime] = useState(null);
  const [checkDuration, setCheckDuration] = useState(null);
  const [processedLines, setProcessedLines] = useState(0);
  const [checkSpeed, setCheckSpeed] = useState(0);

  // Check for existing progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('antipublicProgress');
    const savedStartTime = localStorage.getItem('antipublicStartTime');
    const savedDuration = localStorage.getItem('antipublicDuration');
    const savedFile = localStorage.getItem('antipublicFile');
    const savedResults = localStorage.getItem('antipublicResults');
    const savedProcessedLines = localStorage.getItem('antipublicProcessedLines');

    if (savedProgress && savedStartTime && savedDuration) {
      const startTime = parseInt(savedStartTime);
      const duration = parseInt(savedDuration);
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);

      if (progressPercent < 100) {
        // Resume the check
        setIsProcessing(true);
        setProgress(progressPercent);
        setCheckStartTime(startTime);
        setCheckDuration(duration);
        setProcessedLines(parseInt(savedProcessedLines || '0'));
        
        if (savedFile) {
          const fileData = JSON.parse(savedFile);
          setCombolistFile(new File([fileData.content], fileData.name, { type: 'text/plain' }));
        }

        // Continue the interval
        const interval = setInterval(() => {
          const currentElapsed = Date.now() - startTime;
          const currentProgress = Math.min((currentElapsed / duration) * 100, 100);
          
          setProgress(currentProgress);
          localStorage.setItem('antipublicProgress', currentProgress.toString());
          
          if (currentProgress >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            
            // Complete the check with 5M lines and 3.22% public
            const totalLines = 5000000;
            const publicPercentage = 0.0322; // 3.22%
            const privatePercentage = 1 - publicPercentage;
            const publicCount = Math.floor(totalLines * publicPercentage);
            const privateCount = totalLines - publicCount;
            
            const finalResults = {
              public: publicCount,
              private: privateCount,
              total: totalLines
            };
            
            setResults(finalResults);
            localStorage.setItem('antipublicResults', JSON.stringify(finalResults));
            localStorage.removeItem('antipublicProgress');
            localStorage.removeItem('antipublicStartTime');
            localStorage.removeItem('antipublicDuration');
            localStorage.removeItem('antipublicFile');
            localStorage.removeItem('antipublicProcessedLines');
            
            toast({ title: "Check Complete", description: "Finished checking 5M line database." });
          }
        }, 100);
      } else if (savedResults) {
        // Show completed results
        setResults(JSON.parse(savedResults));
        if (savedFile) {
          const fileData = JSON.parse(savedFile);
          setCombolistFile(new File([fileData.content], fileData.name, { type: 'text/plain' }));
        }
      }
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCombolistFile(file);
      setResults(null);
      setProcessedLines(0);
      setCheckSpeed(0);
      // Clear any existing progress when new file is selected
      localStorage.removeItem('antipublicProgress');
      localStorage.removeItem('antipublicStartTime');
      localStorage.removeItem('antipublicDuration');
      localStorage.removeItem('antipublicFile');
      localStorage.removeItem('antipublicResults');
      localStorage.removeItem('antipublicProcessedLines');
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
    setProcessedLines(0);
    
    // Simulate 5 million line database
    const totalLines = 5000000;
    
    // Save file data to localStorage
    const fileData = {
      name: combolistFile.name,
      content: "5M line database simulation"
    };
    localStorage.setItem('antipublicFile', JSON.stringify(fileData));
    
    createTask({
        name: `Antipublic check for ${combolistFile.name}`,
        module: 'Antipublic Checker',
        type: 'antipublic',
        status: 'Running',
        results: { totalLines: totalLines, public: 0, private: 0, checkSpeed: 0 },
        graphs: { checkSpeed: [], publicity: [] },
        settings: { source: combolistFile.name }
    });

    // Calculate total duration (45-60 seconds for 5M lines)
    const totalDuration = (Math.random() * 15000) + 45000; // 45-60 seconds in milliseconds
    const startTime = Date.now();
    
    // Save progress data to localStorage
    setCheckStartTime(startTime);
    setCheckDuration(totalDuration);
    localStorage.setItem('antipublicStartTime', startTime.toString());
    localStorage.setItem('antipublicDuration', totalDuration.toString());
    localStorage.setItem('antipublicProgress', '0');
    localStorage.setItem('antipublicProcessedLines', '0');
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
      
      // Calculate processed lines based on progress
      const currentProcessedLines = Math.floor((progressPercent / 100) * totalLines);
      const currentSpeed = Math.floor(currentProcessedLines / (elapsed / 1000)); // lines per second
      
      setProgress(progressPercent);
      setProcessedLines(currentProcessedLines);
      setCheckSpeed(currentSpeed);
      localStorage.setItem('antipublicProgress', progressPercent.toString());
      localStorage.setItem('antipublicProcessedLines', currentProcessedLines.toString());
      
      if (progressPercent >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        
        // Calculate results with exactly 3.22% public
        const publicPercentage = 0.0322; // 3.22%
        const privatePercentage = 1 - publicPercentage; // 96.78%
        
        const publicCount = Math.floor(totalLines * publicPercentage);
        const privateCount = totalLines - publicCount;
        
        const finalResults = {
            public: publicCount,
            private: privateCount,
            total: totalLines
        };
        
        setResults(finalResults);
        localStorage.setItem('antipublicResults', JSON.stringify(finalResults));
        
        // Clean up localStorage
        localStorage.removeItem('antipublicProgress');
        localStorage.removeItem('antipublicStartTime');
        localStorage.removeItem('antipublicDuration');
        localStorage.removeItem('antipublicFile');
        localStorage.removeItem('antipublicProcessedLines');
        
        toast({ title: "Check Complete", description: `Finished checking 5M line database.` });
      }
    }, 100); // Update every 100ms for smoother progress
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
                <div className="space-y-2">
                    <Progress value={progress} className="h-1.5 bg-slate-700" />
                    <div className="text-xs text-slate-400 space-y-1">
                        <p>Processed: {processedLines.toLocaleString()} / 5,000,000 lines</p>
                        <p>Speed: {checkSpeed.toLocaleString()} lines/sec</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphism-card lg:col-span-2 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-slate-200">Check Results</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { 
                    setResults(null); 
                    setCombolistFile(null);
                    setIsProcessing(false);
                    setProgress(0);
                    setProcessedLines(0);
                    setCheckSpeed(0);
                    // Clear localStorage
                    localStorage.removeItem('antipublicProgress');
                    localStorage.removeItem('antipublicStartTime');
                    localStorage.removeItem('antipublicDuration');
                    localStorage.removeItem('antipublicFile');
                    localStorage.removeItem('antipublicResults');
                    localStorage.removeItem('antipublicProcessedLines');
                }} disabled={isProcessing || !results} className="text-xs text-slate-400 hover:text-slate-100">
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
                    <p>Checking 5M line database...</p>
                    <p className="text-sm mt-2">{processedLines.toLocaleString()} / 5,000,000 lines processed</p>
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
                        <p className="text-sm text-red-400">Private Lines: <span className="font-bold">{results.private.toLocaleString()} ({((results.private / results.total) * 100).toFixed(2)}%)</span></p>
                        <p className="text-sm text-green-400">Public Lines: <span className="font-bold">{results.public.toLocaleString()} ({((results.public / results.total) * 100).toFixed(2)}%)</span></p>
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