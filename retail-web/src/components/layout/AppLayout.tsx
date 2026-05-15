import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Store, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ChevronDown,
  CircleDot,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import { CommandPalette } from '../CommandPalette';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Standard Top-Level Link
const SidebarItem = ({ icon, label, isActive, isExpanded, onClick }: { icon: React.ReactNode, label: string, isActive?: boolean, isExpanded: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    title={!isExpanded ? label : undefined}
    className={`w-full flex items-center ${isExpanded ? 'px-4' : 'justify-center px-0'} py-3.5 rounded-2xl transition-all duration-300 relative group ${
      isActive 
        ? 'bg-indigo-600 dark:bg-white/[0.08] text-white dark:text-white shadow-lg shadow-indigo-600/20 dark:shadow-none' 
        : 'text-gray-500 dark:text-white/40 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-white/[0.04]'
    }`}
  >
    <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
      {icon}
    </div>
    {isExpanded && (
      <span className="ml-3 text-[14px] font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100 w-auto">
        {label}
      </span>
    )}
    {isActive && !isExpanded && (
      <div className="absolute right-0 w-1 h-6 bg-white dark:bg-indigo-500 rounded-l-full"></div>
    )}
  </button>
);

// Nested Link
const SidebarSubItem = ({ icon, label, isActive, isExpanded, onClick }: { icon?: React.ReactNode, label: string, isActive?: boolean, isExpanded: boolean, onClick?: () => void }) => {
  if (!isExpanded) return null;
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-xl transition-all duration-300 relative group ${
        isActive 
          ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-black shadow-sm' 
          : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-indigo-50/30 dark:hover:bg-white/[0.02]'
      }`}
    >
      <div className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-white/20 group-hover:text-gray-500'}`}>
        {icon ? icon : <CircleDot className="w-2.5 h-2.5 stroke-[3.5px]" />}
      </div>
      <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">{label}</span>
      {isActive && (
        <div className="absolute left-6 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.8)] animate-pulse"></div>
      )}
    </button>
  );
};

// Collapsible Group
const SidebarGroup = ({ icon, label, isActive, isOpenInitially, isExpanded, children }: { icon: React.ReactNode, label: string, isActive?: boolean, isOpenInitially?: boolean, isExpanded: boolean, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially || false);

  return (
    <div className="flex flex-col gap-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        title={!isExpanded ? label : undefined}
        className={`w-full flex items-center ${isExpanded ? 'px-4 justify-between' : 'px-0 justify-center'} py-3.5 rounded-2xl transition-all duration-300 group ${
          (isActive || (isOpen && isExpanded))
            ? 'bg-slate-50 dark:bg-white/[0.04] text-gray-900 dark:text-white' 
            : 'text-gray-500 dark:text-white/40 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50/50 dark:hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex items-center">
          <div className={`${(isActive || (isOpen && isExpanded)) ? 'text-indigo-600 dark:text-white scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
            {icon}
          </div>
          {isExpanded && (
            <span className="ml-3 text-[14px] font-bold tracking-wide whitespace-nowrap">{label}</span>
          )}
        </div>
        {isExpanded && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 opacity-30" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {(isOpen && isExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden flex flex-col gap-0.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActivePath = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => paths.some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-transparent dark:bg-[#080808] text-gray-900 dark:text-white font-sans flex relative z-0 overflow-hidden transition-colors duration-300">
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      

      
      

      {/* Light Theme Rich Blue/Violet/Purple Canvas */}
      <div 
        className="fixed top-0 left-0 w-[100%] h-[100%] pointer-events-none z-[-1] block dark:hidden"
        style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #d8b4fe 100%)' }}
      ></div>
{/* Pure Premium Background Glow */}
      <div 
        className="fixed top-0 left-0 w-[100%] h-[100%] pointer-events-none mix-blend-screen opacity-60 z-[-1] hidden dark:block"
        style={{ background: 'radial-gradient(circle at 15% 0%, rgba(59, 130, 246, 0.12) 0%, transparent 50%), radial-gradient(circle at 85% 100%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)' }}
      ></div>

      {/* Auto-Collapsing Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarExpanded ? 240 : 80 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className="h-screen bg-slate-50/95 dark:bg-[#0d0d0d]/95 backdrop-blur-2xl border-r border-slate-200 dark:border-white/[0.08] flex flex-col relative z-20 shadow-2xl transition-colors duration-300"
      >
        {/* Brand Area */}
        <div className={`p-8 pb-10 flex items-center ${isSidebarExpanded ? 'gap-4' : 'justify-center'} transition-all`}>
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-[18px] shadow-xl shadow-indigo-500/30">
            <Store className="w-6 h-6 text-white" />
          </div>
          {isSidebarExpanded && (
            <div className="flex flex-col">
              <span className="text-[22px] font-[1000] tracking-tighter text-gray-900 dark:text-white leading-none">RSOFT</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Enterprise</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 flex flex-col gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar ${isSidebarExpanded ? 'px-6' : 'px-4'}`}>
          <SidebarItem 
            icon={<LayoutDashboard className="w-[22px] h-[22px] stroke-[2.5px]" />} 
            label="Dashboard" 
            isActive={isActivePath('/dashboard')} 
            isExpanded={isSidebarExpanded}
            onClick={() => navigate('/dashboard')}
          />

          <SidebarGroup 
            icon={<ShoppingCart className="w-[22px] h-[22px] stroke-[2.5px]" />} 
            label="Transactions"
            isActive={isGroupActive(['/sales'])}
            isOpenInitially={isGroupActive(['/sales'])}
            isExpanded={isSidebarExpanded}
          >
            <SidebarSubItem 
              label="Sales Entry" 
              isActive={isActivePath('/sales')} 
              isExpanded={isSidebarExpanded}
              onClick={() => navigate('/sales')} 
            />
          </SidebarGroup>

          <SidebarItem icon={<Users className="w-[22px] h-[22px] stroke-[2.5px]" />} label="Customers" isExpanded={isSidebarExpanded} />
          <SidebarItem icon={<Settings className="w-[22px] h-[22px] stroke-[2.5px]" />} label="Settings" isExpanded={isSidebarExpanded} />
        </nav>

        {/* Bottom User Area */}
        <div className={`p-6 border-t border-slate-100 dark:border-white/[0.08] mt-auto ${!isSidebarExpanded && 'flex justify-center'}`}>
          <SidebarItem icon={<LogOut className="w-[22px] h-[22px] stroke-[2.5px]" />} label="Sign Out" isExpanded={isSidebarExpanded} onClick={handleLogout} />
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">
        
        {/* Top Header - Matched to Sidebar for consistency */}
        <header className="h-[76px] border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#0d0d0d] backdrop-blur-3xl flex items-center justify-between px-10 z-20 transition-all duration-300">
          
          <div className="flex items-center gap-8 flex-1">
            {/* Page Identity / Breadcrumbs */}
            <div className="hidden xl:flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">
                <span>Transactions</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10"></span>
              </div>
              <h1 className="text-[18px] font-black text-gray-900 dark:text-white tracking-tight leading-none mt-1">
                Sales Entry
              </h1>
            </div>

            <div className="flex-1 flex items-center max-w-[480px]">
               <button 
                 onClick={() => setIsCommandPaletteOpen(true)}
                 className="flex items-center gap-4 px-6 py-2.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-white/[0.15] hover:bg-white rounded-2xl transition-all group w-full shadow-inner"
               >
                 <Search className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors" />
                 <span className="text-[14px] font-bold text-gray-400 dark:text-white/30 flex-1 text-left group-hover:text-gray-600 group-hover:dark:text-white/60">Search everywhere...</span>
                 <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                   <kbd className="px-2 py-1 text-[10px] font-black text-gray-500 dark:text-white bg-white dark:bg-white/[0.1] rounded-lg border border-slate-200 dark:border-white/[0.1]">CTRL</kbd>
                   <kbd className="px-2 py-1 text-[10px] font-black text-gray-500 dark:text-white bg-white dark:bg-white/[0.1] rounded-lg border border-slate-200 dark:border-white/[0.1]">K</kbd>
                 </div>
               </button>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
               <ThemeToggle />
               <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/[0.03] text-gray-400 dark:text-white/40 hover:text-indigo-600 dark:hover:text-white hover:bg-white transition-all shadow-sm group">
                 <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0d0d0d]"></span>
               </button>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/[0.1]"></div>
            
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-black text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">Admin User</p>
                <p className="text-[11px] font-black text-gray-400 dark:text-white/30 uppercase tracking-widest mt-0.5">Store Manager</p>
              </div>
              <div className="w-11 h-11 rounded-[18px] bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-all">
                <span className="text-white text-[15px] font-black">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Removed forced padding to allow full-screen modules */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>

      </main>
    </div>
  );
};

export default AppLayout;
