import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-transparent min-h-[70vh]">
      
      {/* Animated Glowing Error Sign */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-indigo-500/20 blur-[30px] rounded-full animate-pulse"></div>
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 flex items-center justify-center shadow-2xl text-white">
          <AlertCircle className="w-12 h-12 stroke-[2.2px]" />
        </div>
      </motion.div>

      {/* Spacing / Typography */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-md space-y-3"
      >
        <h1 className="text-[44px] font-[1000] tracking-tighter text-indigo-950 dark:text-white leading-none">
          404
        </h1>
        <h2 className="text-[20px] font-black text-slate-800 dark:text-slate-200 tracking-tight">
          Lost in Space?
        </h2>
        <p className="text-[13.5px] font-bold text-slate-700 dark:text-white/40 leading-relaxed">
          The quadrant you are trying to reach does not exist or has been relocated in this store database.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 mt-8 z-10"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-gray-900 dark:text-white text-[12.5px] font-black rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Home className="w-4 h-4 text-indigo-500" />
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/launchpad')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-[12.5px] font-black rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 hover:-translate-y-0.5"
        >
          <Compass className="w-4 h-4" />
          Go to Launchpad
        </button>
      </motion.div>
      
    </div>
  );
};

export default NotFound;
