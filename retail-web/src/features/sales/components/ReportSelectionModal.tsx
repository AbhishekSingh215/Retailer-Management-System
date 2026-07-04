import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, FileText, ArrowRight, Loader2 } from 'lucide-react';

interface ReportSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: any[];
  onSelectReport: (report: any) => void;
  loadingReportNo: number | null;
}

export const ReportSelectionModal: React.FC<ReportSelectionModalProps> = ({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  loadingReportNo
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.97, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 400 }}
            className="bg-white/90 dark:bg-[#07080c]/90 border border-slate-200/50 dark:border-white/[0.05] rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] w-full max-w-[390px] overflow-hidden flex flex-col relative backdrop-blur-xl"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-cyan-500/10 to-transparent dark:from-cyan-500/5 pointer-events-none" />

            {/* Modal Header */}
            <div className="px-6 pt-6 pb-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/15 shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15.5px] font-[1000] text-slate-800 dark:text-white tracking-tight leading-none mb-1 font-sans">
                    Select Invoice Report
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-wider">
                    Print Formats
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loadingReportNo !== null}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of reports */}
            <div className="px-6 pb-6 pt-2 space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar z-10">
              {reports.map((rep) => {
                const isLoading = loadingReportNo === rep.rctNo;
                const isAnyLoading = loadingReportNo !== null;

                return (
                  <button
                    key={rep.rctNo}
                    disabled={isAnyLoading}
                    onClick={() => onSelectReport(rep)}
                    className={`w-full text-left rounded-xl p-3 border transition-all duration-200 flex items-center justify-between gap-4 relative overflow-hidden group ${
                      isLoading
                        ? "bg-cyan-500/10 dark:bg-cyan-500/5 border-cyan-500/40"
                        : isAnyLoading
                        ? "bg-slate-50/50 dark:bg-white/[0.01] border-slate-150/40 dark:border-white/[0.02] opacity-40 cursor-not-allowed"
                        : "bg-white/50 dark:bg-white/[0.01] border-slate-150 dark:border-white/[0.04] hover:border-cyan-500/40 dark:hover:border-cyan-550/30 hover:bg-slate-50/80 dark:hover:bg-white/[0.02] cursor-pointer hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center min-w-0 relative z-10">
                      {isLoading ? (
                        <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center shadow-sm shrink-0">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center text-cyan-600 dark:text-cyan-400 border border-slate-200/50 dark:border-white/[0.05] group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all duration-250 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      <div className="ml-3.5 min-w-0">
                        <h4 className="text-[13px] font-[1000] text-slate-800 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight mb-1">
                          {rep.rctDesc}
                        </h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-cyan-600/80 dark:text-cyan-400/80">
                          {rep.rctFileName}
                        </span>
                      </div>
                    </div>

                    {!isLoading && !isAnyLoading && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-350 dark:text-white/20 group-hover:text-cyan-550 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer Banner */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-150/60 dark:border-white/[0.04] flex items-center justify-between text-[9px] font-bold text-slate-400 dark:text-white/20 z-10 uppercase tracking-widest">
              <span>Auto Drive Scanner</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
