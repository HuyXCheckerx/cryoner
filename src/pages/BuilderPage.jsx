import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, ShieldCheck, FileCheck, KeyRound, Combine, Code, CheckCircle, ShieldQuestion, ScanLine } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const modules = [
  { id: 'scraper', title: 'Scraper Parser', description: 'Extract data from search engines using dorks.', icon: Search },
  { id: 'parser', title: 'Parser', description: 'Parse data with custom rules and proxies.', icon: ScanLine },
  { id: 'vulnerability', title: 'Vulnerability Scanner', description: 'Scan websites for common vulnerabilities (SQLi, XSS, etc.).', icon: ShieldCheck },
  { id: 'dorks-checker', title: 'Dorks Checker', description: 'Validate and check the effectiveness of your dorks.', icon: FileCheck },
  { id: 'dumper', title: 'Dumper', description: 'Extract data from databases and websites.', icon: Combine },
  { id: 'dehasher', title: 'Dehasher', description: 'Tools for decrypting various hash types.', icon: KeyRound },
  { id: 'antipublic', title: 'Antipublic Checker', description: 'Check combolists against public databases.', icon: ShieldQuestion },
];

const BuilderPage = ({ variants, transition }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectModule = (moduleId) => {
    setSelectedModule(moduleId);
  };

  const handleNext = () => {
    if (selectedModule) {
      if(selectedModule === 'code_injector'){
         toast({
          title: "Module Not Implemented",
          description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
          variant: "destructive",
        });
        return;
      }
      navigate(`/builder/configure/${selectedModule}`);
    } else {
      toast({
        title: "No Module Selected",
        description: "Please select a module to continue.",
        variant: "destructive",
      });
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
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
          <h1 className="text-3xl font-bold text-slate-100">Create New Task</h1>
          <p className="text-sm text-slate-400">Choose a module to start building your task.</p>
        </div>
        <div className="flex items-center space-x-2">
            <Button 
                onClick={handleNext} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9"
                disabled={!selectedModule}
            >
                Next <ArrowRight size={16} className="ml-2" />
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onClick={() => handleSelectModule(module.id)}
          >
            <Card 
              className={`glassmorphism-card h-full flex flex-col transition-all duration-200 ease-in-out cursor-pointer
                ${selectedModule === module.id ? 'border-primary shadow-primary/30 scale-105' : 'border-slate-800 hover:border-slate-700'}
              `}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <module.icon size={36} className={selectedModule === module.id ? "text-primary" : "text-slate-500"} />
                    {selectedModule === module.id && <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="text-lg font-semibold text-slate-100 mb-1">{module.title}</CardTitle>
                <CardDescription className="text-xs text-slate-400">{module.description}</CardDescription>
              </CardContent>
              <div className={`p-4 pt-0 flex justify-end ${selectedModule === module.id ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                    <CheckCircle size={14}/>
                  </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuilderPage;