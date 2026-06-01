import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export interface PopupState {
  isOpen: boolean;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  subMessage?: string;
  confirmAction?: () => void;
  confirmLabel?: string;
  discardAction?: () => void;
  discardLabel?: string;
  cancelLabel?: string;
}

interface SalesPopupNotificationProps {
  popup: PopupState;
  setPopup: React.Dispatch<React.SetStateAction<PopupState>>;
}

export const SalesPopupNotification: React.FC<SalesPopupNotificationProps> = ({ popup, setPopup }) => {
  if (!popup.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/[0.1] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          <div className={`p-6 border-b border-slate-100 dark:border-white/[0.08] flex items-center gap-4 ${popup.type === 'error' ? 'bg-rose-50/50 dark:bg-rose-500/10' :
            popup.type === 'warning' ? 'bg-amber-50/50 dark:bg-amber-500/10' :
              popup.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-500/10' :
                'bg-indigo-50/50 dark:bg-indigo-500/10'
            }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${popup.type === 'error' ? 'bg-rose-600 shadow-rose-500/30' :
              popup.type === 'warning' ? 'bg-amber-500 shadow-amber-500/30' :
                popup.type === 'success' ? 'bg-emerald-600 shadow-emerald-500/30' :
                  'bg-indigo-600 shadow-indigo-500/30'
              }`}>
              {popup.type === 'error' ? <AlertTriangle className="w-6 h-6 stroke-[2.5]" /> :
                popup.type === 'warning' ? <AlertCircle className="w-6 h-6 stroke-[2.5]" /> :
                  popup.type === 'success' ? <CheckCircle2 className="w-6 h-6 stroke-[2.5]" /> :
                    <Info className="w-6 h-6 stroke-[2.5]" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${popup.type === 'error' ? 'text-rose-600 dark:text-rose-400' :
                popup.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                  popup.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-indigo-600 dark:text-indigo-400'
                }`}>
                {popup.type.toUpperCase()} NOTIFICATION
              </span>
              <h3 className="text-[18px] font-[1000] text-gray-900 dark:text-white tracking-tight leading-tight truncate">{popup.title}</h3>
            </div>
            <button
              onClick={() => setPopup(prev => ({ ...prev, isOpen: false }))}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all self-start"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-4 bg-white dark:bg-[#151515]">
            <p className="text-[15px] font-extrabold text-slate-700 dark:text-white/80 leading-relaxed">
              {popup.message}
            </p>
            {popup.subMessage && (
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl">
                <p className="text-[13px] font-bold text-slate-500 dark:text-white/60 leading-relaxed">
                  {popup.subMessage}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.08] flex justify-end gap-3 shrink-0">
            {popup.confirmAction || popup.discardAction ? (
              <>
                <button
                  onClick={() => setPopup(prev => ({ ...prev, isOpen: false, confirmAction: undefined, discardAction: undefined }))}
                  className="px-6 py-3 rounded-xl font-bold text-[14px] text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all"
                >
                  {popup.cancelLabel || 'Cancel'}
                </button>
                {popup.discardAction && (
                  <button
                    onClick={() => {
                      popup.discardAction?.();
                      setPopup(prev => ({ ...prev, isOpen: false, confirmAction: undefined, discardAction: undefined }));
                    }}
                    className="px-6 py-3 rounded-xl font-[1000] text-[14px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-all shadow-sm active:scale-95"
                  >
                    {popup.discardLabel || 'Leave / Discard'}
                  </button>
                )}
                {popup.confirmAction && (
                  <button
                    onClick={() => {
                      popup.confirmAction?.();
                      setPopup(prev => ({ ...prev, isOpen: false, confirmAction: undefined, discardAction: undefined }));
                    }}
                    className={`px-8 py-3 rounded-xl font-[1000] text-[14px] text-white shadow-xl transition-all active:scale-95 ${popup.type === 'error' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30' :
                      popup.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' :
                        popup.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' :
                          'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                      }`}
                  >
                    {popup.confirmLabel || 'Save Record'}
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setPopup(prev => ({ ...prev, isOpen: false }))}
                className={`px-8 py-3 rounded-xl font-[1000] text-[14px] text-white shadow-xl transition-all active:scale-95 ${popup.type === 'error' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30' :
                  popup.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' :
                    popup.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' :
                      'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                  }`}
              >
                Understood / Close
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
