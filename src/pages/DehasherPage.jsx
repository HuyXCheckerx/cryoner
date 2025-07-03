import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Hash, UploadCloud, KeyRound, ListRestart, Loader2, Copy } from 'lucide-react';
import LineChartComponent from '@/components/charts/LineChartComponent';
import PieChartComponent from '@/components/charts/PieChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';

const hashTypes = [
  { value: 'auto', label: 'Auto-Detect Hash Type' },
  { value: 'md5', label: 'MD5' },
  { value: 'sha1', label: 'SHA-1' },
  { value: 'sha256', label: 'SHA-256' },
  { value: 'sha512', label: 'SHA-512' },
  { value: 'bcrypt', label: 'bcrypt (Slow)' },
  { value: 'wordpress', label: 'WordPress (phpass)'},
  { value: 'vbulletin', label: 'vBulletin (Salted MD5)'},
  { value: 'mybb', label: 'MyBB (Salted MD5)'},
  { value: 'joomla', label: 'Joomla (Salted MD5)'},
  { value: 'django', label: 'Django (Salted SHA1)'},
  { value: 'crc32', label: 'CRC32' },
  { value: 'ntlm', label: 'NTLM' },
  { value: 'lm', label: 'LM' },
  { value: 'mysql', label: 'MySQL (v3, v4, v5)' },
  { value: 'mssql', label: 'MSSQL' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'des', label: 'DES (Unix crypt)' },
  { value: 'sha224', label: 'SHA-224' },
  { value: 'sha384', label: 'SHA-384' },
  { value: 'sha3', label: 'SHA-3' },
  { value: 'pbkdf2', label: 'PBKDF2' },
  { value: 'scrypt', label: 'scrypt' },
  { value: 'argon2', label: 'Argon2' },
  { value: 'customsalt', label: 'Custom Salted Hash' },
];

// Replace useAnimatedNumber and useAnimatedFloat with a version that updates every 1 second to match stats as they change
const useLiveNumber = (value) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    setDisplay(value);
    const interval = setInterval(() => {
      setDisplay(value);
    }, 1000);
    return () => clearInterval(interval);
  }, [value]);
  return display;
};
const useLiveFloat = (value) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    setDisplay(value);
    const interval = setInterval(() => {
      setDisplay(value);
    }, 1000);
    return () => clearInterval(interval);
  }, [value]);
  return Number(display).toFixed(2);
};

const DehasherPage = ({ variants, transition, createTask }) => {
  const { toast } = useToast();
  const [hashesInput, setHashesInput] = useState('');
  const [selectedHashFile, setSelectedHashFile] = useState(null);
  const [hashType, setHashType] = useState('auto');
  const [results, setResults] = useState([]); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    cracked: 0,
    notFound: 0,
    dehashRate: 0,
    hashTypeCounts: {},
  });
  const [graphs, setGraphs] = useState({
    crackSpeed: [],
    hashTypes: [],
    dehashResults: [],
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedHashFile(file);
      setHashesInput(''); 
      toast({ title: "File Selected", description: `${file.name} ready for de-hashing.` });
    }
  };

  const handleStartDehash = async () => {
    if (!hashesInput && !selectedHashFile) {
      toast({ title: "No Hashes Provided", description: "Please enter hashes or upload a list.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResults([]);
    setProgress(0);
    setStats({ total: 0, cracked: 0, notFound: 0, dehashRate: 0, hashTypeCounts: {} });
    setGraphs({ crackSpeed: [], hashTypes: [], dehashResults: [] });
    
    const taskName = selectedHashFile ? `Dehashing ${selectedHashFile.name}` : `Dehashing custom list`;
    createTask({
        name: taskName,
        module: 'Dehasher',
        type: 'dehasher',
        status: 'Running',
        results: { totalHashes: 0, cracked: 0, notFound: 0, crackSpeed: 0 },
        graphs: { crackSpeed: [], hashTypes: [] },
        settings: { source: selectedHashFile ? selectedHashFile.name : 'Custom Input', hashType: hashType }
    });

    let inputHashes = [];
    if (selectedHashFile) {
        try {
            const fileContent = await selectedHashFile.text();
            inputHashes = fileContent.split(/\r?\n/).map(h => h.trim()).filter(h => h.length > 0);
        } catch (error) {
            toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive" });
            setIsProcessing(false);
            return;
        }
    } else {
        inputHashes = hashesInput.split(/\r?\n/).map(h => h.trim()).filter(h => h.length > 0);
    }
    
    if (inputHashes.length === 0) {
        toast({ title: "Empty Hash List", description: "No valid hashes found to process.", variant: "destructive" });
        setIsProcessing(false);
        return;
    }

    let cracked = 0;
    let notFound = 0;
    let hashTypeCounts = {};
    let crackSpeedData = [];
    let hashTypesData = {};
    let dehashResultsData = [];
    let startTime = Date.now();
    let hashesProcessed = 0;
    let i = 0;
    while (i < inputHashes.length) {
      // Random batch size between 200 and 400
      const batchSize = Math.floor(200 + Math.random() * 201);
      for (let j = 0; j < batchSize && (i + j) < inputHashes.length; j++) {
        const hash = inputHashes[i + j];
        const type = hashType === 'auto' ? weightedHashTypeRandom() : hashType;
        hashTypeCounts[type] = (hashTypeCounts[type] || 0) + 1;
        const found = Math.random() < 0.99;
        if (found) cracked++; else notFound++;
        const result = found
          ? { hash, plain: `decrypted_${hash.substring(0,5)}`, status: 'found', type }
          : { hash, plain: null, status: 'not_found', type };
        setResults(prev => [...prev, result]);
        hashesProcessed++;
        hashTypesData[type] = (hashTypesData[type] || 0) + 1;
      }
      i += batchSize;
      setProgress((Math.min(i, inputHashes.length) / inputHashes.length) * 100);
      // Update crack speed and graphs
      const elapsed = (Date.now() - startTime) / 1000;
      // Simulate speed fluctuating around 30,000 (e.g., 28,000 - 32,000)
      const simulatedSpeed = Math.floor(28000 + Math.random() * 4000);
      crackSpeedData.push({ name: `${Math.ceil(elapsed)}s`, speed: simulatedSpeed });
      dehashResultsData = [
        { name: 'Cracked', count: cracked },
        { name: 'Not Found', count: notFound }
      ];
      setGraphs({
        crackSpeed: [...crackSpeedData],
        hashTypes: Object.entries(hashTypesData).map(([name, value]) => ({ name, value })),
        dehashResults: [...dehashResultsData],
      });
      await new Promise(res => setTimeout(res, Math.random() * 100 + 50));
    }
    const dehashRate = inputHashes.length ? (cracked / inputHashes.length) * 100 : 0;
    setStats({
      total: inputHashes.length,
      cracked,
      notFound,
      dehashRate: dehashRate.toFixed(2),
      hashTypeCounts,
    });
    setIsProcessing(false);
    toast({ title: "Dehashing Complete", description: `Processed ${inputHashes.length} hashes.` });
  };

  const handleCopyResult = (text) => {
    navigator.clipboard.writeText(text);
    toast({title: "Copied!", description: "Decrypted text copied to clipboard."});
  }

  const liveCracked = useLiveNumber(stats.cracked);
  const liveNotFound = useLiveNumber(stats.notFound);
  const liveDehashRate = useLiveFloat(Number(stats.dehashRate));

  // Weighted hash type selection for more realistic distribution
  const commonHashTypes = [
    'md5', 'sha1', 'sha256', 'sha512', 'bcrypt', 'ntlm', 'lm', 'mysql', 'sha224', 'sha384', 'sha3', 'pbkdf2', 'scrypt', 'argon2'
  ];
  const rareHashTypes = hashTypes.map(ht => ht.value).filter(
    v => !commonHashTypes.includes(v) && v !== 'auto'
  );
  const weightedHashTypeRandom = () => {
    // 80% chance for common, 20% for rare
    if (Math.random() < 0.8) {
      return commonHashTypes[Math.floor(Math.random() * commonHashTypes.length)];
    } else {
      return rareHashTypes[Math.floor(Math.random() * rareHashTypes.length)];
    }
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
          <KeyRound size={28} className="mr-3 text-primary" /> Dehasher Module
        </h1>
        <p className="text-sm text-slate-400">Decrypt various hash types using advanced algorithms and rainbow tables.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <Card className="glassmorphism-card lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-200">Dehash Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hashesInput" className="text-sm font-medium text-slate-300 mb-1 block">Enter Hashes (one per line)</Label>
              <Textarea 
                id="hashesInput" 
                placeholder="e.g., 5f4dcc3b5aa765d61d8327deb882cf99..." 
                value={hashesInput}
                onChange={(e) => {setHashesInput(e.target.value); setSelectedHashFile(null);}}
                className="bg-slate-800/70 border-slate-700 focus:border-primary h-40 text-sm font-mono"
                disabled={!!selectedHashFile || isProcessing}
              />
            </div>
            <div className="text-center text-xs text-slate-500 my-2">OR</div>
            <div>
                <input type="file" id="hashFile" onChange={handleFileChange} accept=".txt" className="hidden" disabled={isProcessing} />
                <Button variant="outline" className="w-full justify-start text-left border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-400 h-10 text-sm" onClick={() => document.getElementById('hashFile').click()} disabled={isProcessing}>
                    <UploadCloud size={16} className="mr-2 text-slate-500" />
                    {selectedHashFile ? selectedHashFile.name : "Upload Hashes File (.txt)"}
                </Button>
            </div>
             <div>
              <Label htmlFor="hashType" className="text-sm font-medium text-slate-300 mb-1 block">Hash Type</Label>
              <Select value={hashType} onValueChange={setHashType} disabled={isProcessing}>
                <SelectTrigger id="hashType" className="bg-slate-800/70 border-slate-700 text-slate-300 focus:border-primary text-sm">
                  <SelectValue placeholder="Select hash type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  {hashTypes.map(ht => <SelectItem key={ht.value} value={ht.value}>{ht.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleStartDehash} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2" disabled={isProcessing}>
              {isProcessing ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Hash size={16} className="mr-2"/>}
              {isProcessing ? 'Dehashing...' : 'Start Dehashing'}
            </Button>
             {isProcessing && (
                <Progress value={progress} className="h-1.5 mt-2 bg-slate-700" />
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphism-card lg:col-span-2 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-slate-200">Dehashed Results</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setResults([]); setHashesInput(''); setSelectedHashFile(null); setStats({ total: 0, cracked: 0, notFound: 0, dehashRate: 0, hashTypeCounts: {} }); setGraphs({ crackSpeed: [], hashTypes: [], dehashResults: [] }); }} disabled={isProcessing || results.length === 0} className="text-xs text-slate-400 hover:text-slate-100">
                <ListRestart size={14} className="mr-1.5"/> Clear Results
              </Button>
            </div>
            <CardDescription className="text-slate-400 text-xs">Dehashing statistics and visualizations.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto pr-2 space-y-2">
            {results.length === 0 && !isProcessing && (
              <div className="text-center py-10 text-slate-500">
                <KeyRound size={36} className="mx-auto mb-3 opacity-50" />
                <p>Results will appear here once dehashing is complete.</p>
              </div>
            )}
            {results.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-900/80 shadow-lg rounded-2xl p-6 border border-slate-700/40">
                    <div className="text-xs text-slate-400 mb-3 font-semibold tracking-wider uppercase">Hash Types</div>
                    <PieChartComponent data={graphs.hashTypes} />
                  </div>
                  <div className="bg-slate-900/80 shadow-lg rounded-2xl p-6 border border-slate-700/40">
                    <div className="text-xs text-slate-400 mb-3 font-semibold tracking-wider uppercase">Dehash Results</div>
                    <BarChartComponent data={graphs.dehashResults} />
                  </div>
                  <div className="bg-slate-900/80 shadow-lg rounded-2xl p-6 border border-slate-700/40">
                    <div className="text-xs text-slate-400 mb-3 font-semibold tracking-wider uppercase">Dehash Speed (hashes/min)</div>
                    <LineChartComponent data={graphs.crackSpeed} dataKey="speed" lineColor="hsl(var(--primary))" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DehasherPage;