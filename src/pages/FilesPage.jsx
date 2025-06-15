import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Folder, FileText, Download, Trash2, Search, PlusCircle, UploadCloud, ArrowLeft, Home } from 'lucide-react';

const initialFileSystem = [
  { id: 'root_results', name: 'Results', type: 'folder', path: '/', parent: null, children: ['res_001', 'res_002', 'res_003', 'folder_dorks'] },
  { id: 'root_configs', name: 'Configurations', type: 'folder', path: '/', parent: null, children: ['conf_001'] },
  { id: 'root_logs', name: 'Logs', type: 'folder', path: '/', parent: null, children: ['log_001', 'log_002'] },
  { id: 'res_001', name: 'scraped_dorks_2025-06-10.txt', type: 'file', size: '1.2MB', date: '2025-06-10', parent: 'root_results' },
  { id: 'res_002', name: 'vulnerabilities_report_alpha.json', type: 'file', size: '350KB', date: '2025-06-09', parent: 'root_results' },
  { id: 'res_003', name: 'dumped_db_main.sql.gz', type: 'file', size: '15.8GB', date: '2025-06-08', parent: 'root_results' },
  { id: 'folder_dorks', name: 'Google Dorks', type: 'folder', path: '/Results/', parent: 'root_results', children: ['gdork_001'] },
  { id: 'gdork_001', name: 'finance_keywords_dorks.txt', type: 'file', size: '50KB', date: '2025-06-07', parent: 'folder_dorks' },
  { id: 'conf_001', name: 'default_scraper_config.json', type: 'file', size: '2KB', date: '2025-06-01', parent: 'root_configs' },
  { id: 'log_001', name: 'system_log_2025-06-11.log', type: 'file', size: '5MB', date: '2025-06-11', parent: 'root_logs' },
  { id: 'log_002', name: 'error_log_2025-06-10.log', type: 'file', size: '800KB', date: '2025-06-10', parent: 'root_logs' },
];

const FilesPage = ({ variants, transition }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [fileSystem, setFileSystem] = useState(initialFileSystem); // In a real app, this would be fetched/managed

  const getCurrentFolderId = () => {
    if (currentPath === '/') return null;
    // Find the folder ID based on currentPath (simplified)
    const segments = currentPath.split('/').filter(s => s);
    let parentId = null;
    for (const segment of segments) {
        const folder = fileSystem.find(item => item.parent === parentId && item.name === segment && item.type === 'folder');
        if (!folder) return null; // Should not happen with valid paths
        parentId = folder.id;
    }
    return parentId;
  }

  const currentFolderId = getCurrentFolderId();
  
  const currentItems = fileSystem.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isInCurrentFolder = item.parent === currentFolderId;
    return matchesSearch && isInCurrentFolder;
  }).sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  const navigateToFolder = (folderName) => {
    setCurrentPath(prev => prev === '/' ? `/${folderName}/` : `${prev}${folderName}/`);
  };

  const navigateUp = () => {
    if (currentPath === '/') return;
    const segments = currentPath.split('/').filter(s => s);
    segments.pop();
    setCurrentPath(segments.length > 0 ? `/${segments.join('/')}/` : '/');
  };
  
  const navigateHome = () => setCurrentPath('/');


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
            <Folder size={28} className="mr-3 text-primary" /> File Manager
          </h1>
          <p className="text-sm text-slate-400">Browse, download, and manage your generated reports and data files.</p>
        </div>
        <div className="flex space-x-2">
            <Button variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-slate-100">
                <UploadCloud size={16} className="mr-2"/> Upload File
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <PlusCircle size={18} className="mr-2"/> New Folder
            </Button>
        </div>
      </header>

      <Card className="glassmorphism-card flex-grow flex flex-col overflow-hidden">
        <CardHeader className="border-b border-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={navigateHome} disabled={currentPath === '/'} className="h-9 w-9 text-slate-400 hover:text-primary disabled:opacity-50">
                    <Home size={18}/>
                </Button>
                <Button variant="ghost" size="icon" onClick={navigateUp} disabled={currentPath === '/'} className="h-9 w-9 text-slate-400 hover:text-primary disabled:opacity-50">
                    <ArrowLeft size={18}/>
                </Button>
                <span className="text-sm text-slate-300 font-mono truncate" title={currentPath}>Current Path: {currentPath}</span>
            </div>
            <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                type="text"
                placeholder="Search current folder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/70 border-slate-700 focus:border-primary text-sm h-9"
                />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800/50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="table-header-cell w-12 text-center">Type</th>
                <th scope="col" className="table-header-cell">Name</th>
                <th scope="col" className="table-header-cell text-right">Size</th>
                <th scope="col" className="table-header-cell text-right">Date Modified</th>
                <th scope="col" className="table-header-cell text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {currentItems.map((item) => (
                <tr key={item.id} className="table-row-hover">
                  <td className="table-body-cell text-center">
                    {item.type === 'folder' ? <Folder size={18} className="text-yellow-400 mx-auto" /> : <FileText size={18} className="text-sky-400 mx-auto" />}
                  </td>
                  <td 
                    className={`table-body-cell font-medium ${item.type === 'folder' ? 'text-slate-200 cursor-pointer hover:text-primary' : 'text-slate-300'}`}
                    onClick={() => item.type === 'folder' && navigateToFolder(item.name)}
                  >
                    {item.name}
                  </td>
                  <td className="table-body-cell text-right text-xs text-slate-400 font-mono">{item.size || '-'}</td>
                  <td className="table-body-cell text-right text-xs text-slate-400">{item.date || '-'}</td>
                  <td className="table-body-cell text-center">
                    <div className="flex items-center justify-center space-x-0.5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary">
                                    <Download size={14} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>Download</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-destructive">
                                <Trash2 size={14} />
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 text-xs"><p>Delete</p></TooltipContent>
                        </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-500">
                        {searchTerm ? 'No files or folders match your search.' : 'This folder is empty.'}
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FilesPage;