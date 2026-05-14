import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-[#0A0B10] border border-gray-200 dark:border-white/[0.06] shadow-sm dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] text-gray-500 hover:text-gray-900 dark:text-[#8F94A3] dark:hover:text-[#E2E8F0] transition-colors focus:outline-none"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: isDark ? 0 : 1, 
          opacity: isDark ? 0 : 1,
          rotate: isDark ? -90 : 0
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="w-[18px] h-[18px]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ 
          scale: isDark ? 1 : 0, 
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : 90
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="w-[18px] h-[18px]" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
