import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Dashboard';
  const segment = pathname.split('/')[1];
  if (!segment) return 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
};

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="flex-shrink-0 h-16 bg-slate-900/50 backdrop-blur-lg border-b border-slate-800/50 flex items-center px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden mr-4 text-slate-400 hover:text-primary">
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:inline-flex text-slate-400 hover:text-primary">
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      <div className="ml-4">
        <h1 className="text-lg font-semibold text-slate-200">{pageTitle}</h1>
      </div>
    </header>
  );
};

export default Header;