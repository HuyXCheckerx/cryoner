import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, CheckCircle, Search, Globe, Settings, Save, XCircle, Aperture, UploadCloud, FileText } from 'lucide-react';

const searchEngines = [
  { id: 'google', name: 'Google', icon: Aperture },
  { id: 'aol', name: 'AOL', icon: Aperture },
  { id: 'bing', name: 'Bing', icon: Aperture },
  { id: 'baidu', name: 'Baidu', icon: Aperture },
  { id: 'ask', name: 'Ask', icon: Aperture },
  { id: 'naver', name: 'NAVER', icon: Aperture },
  { id: 'yahoo', name: 'Yahoo!', icon: Aperture },
  { id: 'yandex', name: 'Yandex', icon: Aperture },
];

const moduleConfigDetails = {
  scraper: { title: "Scraper Task Configuration", description: "Set up your dork scraping parameters." },
  parser: { title: "Parser Task Configuration", description: "Set up your data parsing parameters." },
  vulnerability: { title: "Vulnerability Scan Configuration", description: "Configure the vulnerability scanning details." },
  'dorks-checker': { title: "Dorks Checker Configuration", description: "Set parameters for checking your dorks." },
  dumper: { title: "Dumper Task Configuration", description: "Configure data dumping targets and methods." },
  dehasher: { title: "Dehasher Task Configuration", description: "Set up your hash decryption task." },
  antipublic: { title: "Antipublic Check Configuration", description: "Configure your combolist check." },
};

const FileInputButton = ({ label, onFileSelect, selectedFileName }) => {
  const inputRef = useRef(null);
  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium text-slate-300 mb-1 block">{label}</Label>
      <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept=".txt" />
      <Button variant="outline" onClick={handleClick} className="w-full justify-start text-left border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-400 h-10 text-sm">
        <UploadCloud size={16} className="mr-2 text-slate-500" />
        {selectedFileName ? <span className="truncate text-slate-200">{selectedFileName}</span> : `Upload ${label.toLowerCase()} (.txt)`}
      </Button>
    </div>
  );
};

const TaskConfigPage = ({ variants, transition, createTask, tasks }) => {
  const { moduleType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editingTaskId = queryParams.get('taskId');

  const config = moduleConfigDetails[moduleType] || { title: "Task Configuration", description: "Configure your task." };

  const [taskName, setTaskName] = useState(`${config.title.split(' ')[0]} Task`);
  const [keywordsFile, setKeywordsFile] = useState(null);
  const [proxiesFile, setProxiesFile] = useState(null);
  const [pageTypesFile, setPageTypesFile] = useState(null);
  const [parametersFile, setParametersFile] = useState(null);
  const [selectedEngines, setSelectedEngines] = useState(['google']);
  const [amountToGenerate, setAmountToGenerate] = useState(25000);
  const [savingLocation, setSavingLocation] = useState('local_default');
  const [parsingRules, setParsingRules] = useState('');

  useEffect(() => {
    if (editingTaskId) {
      const taskToEdit = tasks.find(t => t.id === editingTaskId);
      if (taskToEdit) {
        setTaskName(taskToEdit.name);
      }
    }
  }, [editingTaskId, tasks]);

  const handleToggleEngine = (engineId) => {
    setSelectedEngines(prev => prev.includes(engineId) ? prev.filter(id => id !== engineId) : [...prev, engineId]);
  };

  const handleStartTask = () => {
    if (!taskName) {
      toast({ title: "Task Name Required", description: "Please provide a name for your task.", variant: "destructive" });
      return;
    }

    let taskPayload = {
        name: taskName,
        module: config.title.replace(' Configuration', ''),
        type: moduleType,
        status: 'Running',
        results: {},
        graphs: {},
        settings: {},
    };

    if (moduleType === 'scraper') {
        if (selectedEngines.length === 0) {
          toast({ title: "No Search Engine", description: "Please select at least one search engine.", variant: "destructive" });
          return;
        }
        if (!keywordsFile) {
          toast({ title: "Keywords File Missing", description: "Please upload a keywords.txt file.", variant: "destructive" });
          return;
        }
        taskPayload.settings = {
            engines: selectedEngines,
            amount: amountToGenerate,
            location: savingLocation,
            keywordsFile: keywordsFile.name,
        };
    } else if (moduleType === 'antipublic') {
        if (!keywordsFile) { // Re-using keywordsFile for combolist
          toast({ title: "Combolist File Missing", description: "Please upload a combolist file.", variant: "destructive" });
          return;
        }
        taskPayload.settings = { source: keywordsFile.name };
        taskPayload.results = { totalLines: 0, public: 0, private: 0, checkSpeed: 0 };
        taskPayload.graphs = { checkSpeed: [], publicity: [] };
    } else if (moduleType === 'parser') {
      if (!keywordsFile) {
        toast({ title: "Data File Missing", description: "Please upload a data file to parse.", variant: "destructive" });
        return;
      }
      taskPayload.settings = {
        source: keywordsFile.name,
        proxies: proxiesFile?.name || 'None',
        rules: parsingRules ? 'Custom' : 'Default',
      };
      taskPayload.results = { linesParsed: 0, dataPoints: 0, parseSpeed: 0 };
      taskPayload.graphs = { cpuUsage: [], proxyPerformance: [] };
    }
    
    createTask(taskPayload);

    toast({
      title: "Task Creation Initiated",
      description: `Starting ${taskName}.`,
    });
    navigate('/tasks'); 
  };
  
  const renderScraperConfig = () => (
    <>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FileInputButton label="Keywords" onFileSelect={setKeywordsFile} selectedFileName={keywordsFile?.name} />
          <FileInputButton label="Page Types" onFileSelect={setPageTypesFile} selectedFileName={pageTypesFile?.name} />
          <FileInputButton label="Parameters" onFileSelect={setParametersFile} selectedFileName={parametersFile?.name} />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-300 mb-2 block">Targeted search engine</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {searchEngines.map(engine => (
              <Button key={engine.id} variant="outline" onClick={() => handleToggleEngine(engine.id)} className={`h-auto py-3 flex flex-col items-center justify-center transition-all duration-150 ${selectedEngines.includes(engine.id) ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-700/50'}`}>
                <engine.icon size={20} className="mb-1.5"/>
                <span className="text-xs font-medium">{engine.name}</span>
                {selectedEngines.includes(engine.id) && <CheckCircle size={12} className="absolute top-1.5 right-1.5 text-primary"/>}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="amountToGenerate" className="text-sm font-medium text-slate-300 mb-1 block">Amount to generate</Label>
            <Input id="amountToGenerate" type="number" value={amountToGenerate} onChange={e => setAmountToGenerate(Number(e.target.value))} placeholder="e.g., 10000" className="bg-slate-800/70 border-slate-700 focus:border-primary text-sm" />
          </div>
          <div>
            <Label htmlFor="savingLocation" className="text-sm font-medium text-slate-300 mb-1 block">Saving location</Label>
              <Select value={savingLocation} onValueChange={setSavingLocation}>
              <SelectTrigger id="savingLocation" className="bg-slate-800/70 border-slate-700 text-slate-300 focus:border-primary text-sm">
                <SelectValue placeholder="Choose saving location..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectItem value="local_default">Local Default Folder</SelectItem>
                <SelectItem value="cloud_storage">Cloud Storage</SelectItem>
                <SelectItem value="custom_path">Custom Path</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
    </>
  );

  const renderAntipublicConfig = () => (
     <FileInputButton label="Combolist" onFileSelect={setKeywordsFile} selectedFileName={keywordsFile?.name} />
  );

  const renderParserConfig = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileInputButton label="Data File" onFileSelect={setKeywordsFile} selectedFileName={keywordsFile?.name} />
        <FileInputButton label="Proxies" onFileSelect={setProxiesFile} selectedFileName={proxiesFile?.name} />
      </div>
      <div>
        <Label htmlFor="parsingRules" className="text-sm font-medium text-slate-300 mb-1 block">Parsing Rules (Optional)</Label>
        <Textarea id="parsingRules" value={parsingRules} onChange={e => setParsingRules(e.target.value)} placeholder="e.g., capture group `(.+)` after `email:`" className="bg-slate-800/70 border-slate-700 focus:border-primary text-sm min-h-[100px]" />
      </div>
    </>
  );

  const renderContent = () => {
    switch(moduleType) {
        case 'scraper':
            return renderScraperConfig();
        case 'antipublic':
            return renderAntipublicConfig();
        case 'parser':
            return renderParserConfig();
        default:
            return <p className="text-slate-500 text-center">Configuration for this module is not yet available.</p>;
    }
  };


  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className="h-full flex flex-col p-6 md:p-8 bg-slate-950 overflow-y-auto items-center justify-center"
    >
      <Card className="glassmorphism-card w-full max-w-2xl shadow-2xl shadow-black/40">
        <CardHeader className="border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/builder" className="inline-flex items-center text-sm text-primary hover:underline mb-1">
                <ArrowLeft size={16} className="mr-1" /> Back to Builder
              </Link>
              <CardTitle className="text-2xl font-bold text-slate-100">{editingTaskId ? 'Edit Task' : config.title}</CardTitle>
              <CardDescription className="text-slate-400">{config.description}</CardDescription>
            </div>
            <Settings size={24} className="text-slate-500" />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="taskName" className="text-sm font-medium text-slate-300 mb-1 block">Task Name</Label>
            <Input id="taskName" value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="e.g., My First Scraper Task" className="bg-slate-800/70 border-slate-700 focus:border-primary text-sm" />
          </div>
          
          {renderContent()}
          
          <Button onClick={handleStartTask} className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-primary-foreground font-semibold text-lg py-3 mt-2" size="lg">
            {editingTaskId ? 'Update Task' : 'Start Task'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskConfigPage;