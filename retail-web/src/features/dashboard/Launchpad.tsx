import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAVIGATION_REGISTRY } from '../../config/navigation';
import type { NavItem, NavGroup } from '../../config/navigation';
import { 
  Search, 
  Star, 
  ArrowRight, 
  LayoutGrid, 
  Compass, 
  Bookmark
} from 'lucide-react';

const Launchpad: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedRoutes, setPinnedRoutes] = useState<string[]>([]);

  // Load pinned routes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rsoft_pinned_routes');
    if (saved) {
      setPinnedRoutes(JSON.parse(saved));
    }
  }, []);

  // Save pinned routes and trigger sidebar reload
  const togglePin = (path: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid navigating when clicking the star
    
    let updated: string[];
    if (pinnedRoutes.includes(path)) {
      updated = pinnedRoutes.filter(r => r !== path);
    } else {
      updated = [...pinnedRoutes, path];
    }
    
    setPinnedRoutes(updated);
    localStorage.setItem('rsoft_pinned_routes', JSON.stringify(updated));
    
    // Notify AppLayout sidebar to refresh pinned items list
    window.dispatchEvent(new Event('rsoft_pinned_routes_changed'));
  };

  // Find NavItem details by path for quick access rendering
  const getNavItemByPath = (path: string): NavItem | null => {
    for (const group of NAVIGATION_REGISTRY) {
      const found = group.items.find(i => i.path === path);
      if (found) return found;
    }
    return null;
  };

  // Filter groups and items based on search input
  const filteredRegistry = NAVIGATION_REGISTRY.map(group => {
    const matchedItems = group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return {
      ...group,
      items: matchedItems
    };
  }).filter(group => group.items.length > 0);

  // Animation configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.1 } }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto pb-16 flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-8 bg-transparent">
      
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-950 dark:text-indigo-400 uppercase tracking-[0.3em]">
            <Compass className="w-3.5 h-3.5" />
            <span>Navigation Portal</span>
          </div>
          <h1 className="text-[30px] font-[1000] text-gray-900 dark:text-white tracking-tight leading-none mt-1">
            Module Launchpad
          </h1>
          <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mt-2">
            Search and navigate across all master directories, transactions, and POS reporting modules.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4.5 h-4.5 text-gray-400 dark:text-white/20 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:border-indigo-500/50 dark:hover:border-white/[0.15] text-gray-900 dark:text-white text-[13px] font-bold rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* ── Pinned Quick Access Section ──────────────────────────────── */}
      {pinnedRoutes.length > 0 && searchQuery === '' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-[11px] font-black uppercase text-indigo-900 dark:text-indigo-400 tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Quick Access (Pinned Modules)</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pinnedRoutes.map(path => {
              const item = getNavItemByPath(path);
              if (!item) return null;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => navigate(item.path)}
                  className="relative p-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 hover:from-indigo-500/10 hover:to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/30 rounded-2xl shadow-sm cursor-pointer flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                      <Icon className="w-4.5 h-4.5 stroke-[2.2px]" />
                    </div>
                    <div>
                      <h4 className="text-[13.5px] font-[900] text-gray-900 dark:text-white leading-tight">{item.label}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-wider mt-0.5">{item.path.slice(1)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => togglePin(item.path, e)}
                      className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                      title="Unpin"
                    >
                      <Star className="w-4 h-4 fill-amber-500" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── All Modules Grid ─────────────────────────────────────────── */}
      {filteredRegistry.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl opacity-60">
          <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-3" />
          <h3 className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-wider">No matching modules found</h3>
          <p className="text-[12px] font-bold text-slate-400 max-w-xs mx-auto mt-1">Refine your search parameters to locate directories.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredRegistry.map((group: NavGroup) => {
            const GroupIcon = group.icon;
            return (
              <motion.div 
                key={group.id} 
                variants={itemVariants}
                className="bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-lg relative overflow-hidden flex flex-col group/card"
              >
                {/* Header Strip */}
                <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
                
                {/* Card Title */}
                <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 bg-slate-50/50 dark:bg-white/[0.01]">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                    <GroupIcon className="w-4.5 h-4.5 stroke-[2.2px]" />
                  </div>
                  <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">
                    {group.label}
                  </h3>
                  <span className="text-[10px] bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-white/30 px-2 py-0.5 rounded-full font-bold ml-auto">
                    {group.items.length} Forms
                  </span>
                </div>

                {/* Card Body - Forms List */}
                <div className="p-4 flex-1 flex flex-col gap-2">
                  {group.items.map(item => {
                    const ItemIcon = item.icon;
                    const isPinned = pinnedRoutes.includes(item.path);
                    return (
                      <div
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className="p-3 bg-slate-50/30 hover:bg-indigo-50/60 dark:bg-transparent dark:hover:bg-white/[0.02] border border-transparent hover:border-slate-100 dark:hover:border-white/5 rounded-xl cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1 mr-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.05] group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-500 dark:text-white/40 transition-colors flex-shrink-0">
                            <ItemIcon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-[900] text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{item.label}</h4>
                            <p className="text-[11px] text-slate-400 dark:text-white/20 mt-0.5 leading-normal">{item.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => togglePin(item.path, e)}
                            title={isPinned ? "Unpin from sidebar" : "Pin to sidebar"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isPinned 
                                ? 'text-amber-500 hover:bg-amber-500/10' 
                                : 'text-slate-300 dark:text-white/10 hover:text-amber-500 hover:bg-amber-500/10'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${isPinned ? 'fill-amber-500' : ''}`} />
                          </button>
                          <ArrowRight className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

    </div>
  );
};

export default Launchpad;
