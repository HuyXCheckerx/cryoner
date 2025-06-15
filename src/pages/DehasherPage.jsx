import React, { useState } from 'react';
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

const hashTypes = [
  { value: 'auto', label: 'Auto-Detect Hash Type' },
  { value: 'md5', label: 'MD5' },
  { value: 'sha1', label: 'SHA-1' },
  { value: 'sha256', label: 'SHA-256' },
  { value: 'sha512', label: 'SHA-512' },
  { value: 'bcrypt', label: 'bcrypt (Slow)' },
  { value: 'wordpress', label: 'WordPress (phpass)'},
];

const DehasherPage = ({ variants, transition, createTask }) => {
  const { toast } = useToast();
  const [hashesInput, setHashesInput] = useState('');
  const [selectedHashFile, setSelectedHashFile] = useState(null);
  const [hashType, setHashType] = useState('auto');
  const [results, setResults] = useState([]); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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

    const mockDehash = (hash) => {
      return new Promise(resolve => {
        setTimeout(() => {
          if (Math.random() > 0.3) {
            resolve({ hash, plain: `decrypted_${hash.substring(0,5)}`, status: 'found' });
          } else {
            resolve({ hash, plain: null, status: 'not_found' });
          }
        }, Math.random() * 100 + 50); 
      });
    };

    for (let i = 0; i < inputHashes.length; i++) {
        const hash = inputHashes[i];
        const result = await mockDehash(hash);
        setResults(prev => [...prev, result]);
        setProgress(((i + 1) / inputHashes.length) * 100);
    }

    setIsProcessing(false);
    toast({ title: "Dehashing Complete", description: `Processed ${inputHashes.length} hashes.` });
  };

  const handleCopyResult = (text) => {
    navigator.clipboard.writeText(text);
    toast({title: "Copied!", description: "Decrypted text copied to clipboard."});
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
                <Button variant="ghost" size="sm" onClick={() => { setResults([]); setHashesInput(''); setSelectedHashFile(null);}} disabled={isProcessing || results.length === 0} className="text-xs text-slate-400 hover:text-slate-100">
                    <ListRestart size={14} className="mr-1.5"/> Clear Results
                </Button>
            </div>
            <CardDescription className="text-slate-400 text-xs">Plain text versions of successfully decrypted hashes.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto pr-2 space-y-2">
            {results.length === 0 && !isProcessing && (
              <div className="text-center py-10 text-slate-500">
                <KeyRound size={36} className="mx-auto mb-3 opacity-50" />
                <p>Results will appear here once dehashing is complete.</p>
              </div>
            )}
            {results.map((result, index) => (
              <motion.div 
                key={index} 
                className="p-3 bg-slate-800/50 rounded-md border border-slate-700/50 flex justify-between items-center text-sm font-mono"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: index * 0.05}}
              >
                <div className="truncate mr-2">
                    <span className="text-slate-500 block text-xs truncate" title={result.hash}>Hash: {result.hash}</span>
                    {result.status === 'found' && <span className="text-green-400 block truncate" title={result.plain}>Plain: {result.plain}</span>}
                    {result.status === 'not_found' && <span className="text-red-400 block">Plain: Not Found</span>}
                    {result.status === 'error' && <span className="text-orange-400 block">Plain: Error</span>}
                </div>
                {result.status === 'found' && result.plain && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary flex-shrink-0" onClick={() => handleCopyResult(result.plain)}>
                        <Copy size={14}/>
                    </Button>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DehasherPage;