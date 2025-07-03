import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import StatusBadge from '@/components/StatusBadge';
import { Server, PlusCircle, Trash2, RefreshCw, Wifi, WifiOff, Edit3, Search, Terminal } from 'lucide-react';

const mockMachines = [
  { id: 'MACHINE001', name: 'Primary Bot', ip: '1**.***.*.**', status: 'Online', tasks: 5, type: 'Dedicated Server', location: 'Frankfurt, DE' },
  { id: 'MACHINE002', name: 'BOTNET cluster', ip: '1**.***.*.*', status: 'Online', tasks: 2, type: 'VPS', location: 'New York, US' },
  { id: 'MACHINE003', name: 'Extra1', ip: '**.***.*.**', status: 'Offline', tasks: 0, type: 'Residential Proxy Node', location: 'London, UK' },
  { id: 'MACHINE004', name: 'Extra2', ip: '2**.***.*.**', status: 'Error', tasks: 1, type: 'Local Machine', location: 'User Office' },
  { id: 'MACHINE005', name: 'Extra3', ip: '1**.***.*.***', status: 'Online', tasks: 0, type: 'VPS', location: 'Singapore, SG' },
];

const MachinesPage = ({ variants, transition }) => {
  const [machines, setMachines] = useState(mockMachines);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMachines = machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.ip.includes(searchTerm) ||
    machine.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    if (status === 'Online') return <Wifi size={16} className="text-green-500" />;
    if (status === 'Offline') return <WifiOff size={16} className="text-slate-500" />;
    return <WifiOff size={16} className="text-red-500" />; // Error or other
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
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Server size={28} className="mr-3 text-primary" /> Machine Management
          </h1>
          <p className="text-sm text-slate-400">Oversee and control your distributed botnet and processing nodes.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <PlusCircle size={18} className="mr-2" /> Add New Machine
        </Button>
      </header>

      <Card className="glassmorphism-card mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search machines by name, IP, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/70 border-slate-700 focus:border-primary text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMachines.map(machine => (
          <Card key={machine.id} className="glassmorphism-card hover:border-primary/50 transition-all duration-200 flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-primary truncate" title={machine.name}>{machine.name}</CardTitle>
                  <CardDescription className="text-xs text-slate-500">{machine.id} - {machine.type}</CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1.5 bg-slate-700/30 rounded">
                     {getStatusIcon(machine.status)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>{machine.status}</p></TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-sm flex-grow">
              <div className="flex justify-between">
                <span className="text-slate-400">IP Address:</span>
                <span className="font-mono text-slate-200">{machine.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200">{machine.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Tasks:</span>
                <span className="font-semibold text-primary">{machine.tasks}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={machine.status} />
              </div>
            </CardContent>
            <div className="border-t border-slate-800/60 p-3 flex justify-end space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                        <Terminal size={16} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>Open Console</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-yellow-400">
                        <RefreshCw size={16} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>Restart Node</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive">
                        <Trash2 size={16} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>Remove Machine</p></TooltipContent>
              </Tooltip>
            </div>
          </Card>
        ))}
        {filteredMachines.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-10 text-slate-500">
                <Server size={40} className="mx-auto mb-3 opacity-50" />
                <p>No machines match your search criteria.</p>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default MachinesPage;