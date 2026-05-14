import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Store, 
  LayoutDashboard, 
  PackageSearch, 
  Users, 
  Settings,
  X,
  ArrowRight
} from 'lucide-react';

// Define the searchable forms/routes
const ROUTES = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'General' },
  { id: 'sales', label: 'Sales Entry', path: '/sales', icon: Store, category: 'Transactions' },
  { id: 'customers', label: 'Customers Database', path: '/customers', icon: Users, category: 'General' },
  { id: 'settings', label: 'System Settings', path: '/settings', icon: Settings, category: 'General' },
];

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter routes based on search query
  const filteredRoutes = ROUTES.filter(route => 
    route.label.toLowerCase().includes(query.toLowerCase()) || 
    route.category.toLowerCase().includes(query.toLowerCase())
  );

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation inside the palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredRoutes.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && filteredRoutes.length > 0) {
        e.preventDefault();
        navigate(filteredRoutes[selectedIndex].path);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredRoutes, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-[15vh] z-[101]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-[600px] bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              
              {/* Search Header */}
              <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <Search className="w-5 h-5 text-gray-400 dark:text-[#6B7280] mr-3" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search for forms, pages, or tools..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-[#F3F4F6] text-[16px] placeholder-gray-400 dark:placeholder-[#4B5563]"
                />
                <button 
                  onClick={onClose}
                  className="px-2 py-1 bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/[0.1] text-gray-500 dark:text-[#8F94A3] text-[12px] font-semibold rounded-md transition-colors"
                >
                  ESC
                </button>
              </div>

              {/* Results List */}
              <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                {filteredRoutes.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-[#8F94A3] text-[14px]">
                    No results found for "{query}"
                  </div>
                ) : (
                  filteredRoutes.map((route, index) => {
                    const Icon = route.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={route.id}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => {
                          navigate(route.path);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-150 ${
                          isSelected 
                            ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' 
                            : 'text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-gray-100 dark:bg-white/[0.05]'}`}>
                            <Icon className="w-[18px] h-[18px]" />
                          </div>
                          <div className="text-left">
                            <p className="text-[14px] font-semibold">{route.label}</p>
                            <p className="text-[12px] text-gray-400 dark:text-[#6B7280]">{route.category}</p>
                          </div>
                        </div>
                        {isSelected && <ArrowRight className="w-4 h-4 opacity-50" />}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-[#08090E] border-t border-gray-100 dark:border-white/[0.05] flex items-center gap-4 text-[12px] text-gray-500 dark:text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded font-sans">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded font-sans">↓</kbd>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded font-sans">Enter</kbd>
                  <span>to select</span>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
