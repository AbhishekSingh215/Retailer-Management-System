import React from 'react';
import { 
  FilePlus, 
  FolderOpen, 
  Edit, 
  Save, 
  X, 
  CheckCircle2, 
  LayoutDashboard, 
  FileSpreadsheet 
} from 'lucide-react';

interface LayoutToggleProps {
  viewMode: 'modern' | 'classic';
  setViewMode: (mode: 'modern' | 'classic') => void;
}

export const LayoutToggle: React.FC<LayoutToggleProps> = ({ viewMode, setViewMode }) => (
  <div className="flex bg-slate-100/50 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/[0.1] shadow-inner backdrop-blur-md">
    <button
      onClick={() => setViewMode('modern')}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'modern' ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <LayoutDashboard className="w-3.5 h-3.5" /> Modern
    </button>
    <button
      onClick={() => setViewMode('classic')}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'classic' ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <FileSpreadsheet className="w-3.5 h-3.5" /> Classic
    </button>
  </div>
);

interface StatusBadgeProps {
  formMode: 'NEW' | 'EDIT' | 'VIEW' | 'LOCKED';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ formMode }) => {
  if (formMode === 'NEW') {
    return (
      <div className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-500/20 shadow-sm flex items-center gap-1.5 animate-pulse select-none pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
        <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">NEW</span>
      </div>
    );
  }
  if (formMode === 'EDIT') {
    return (
      <div className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-500/20 shadow-sm flex items-center gap-1.5 animate-pulse select-none pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
        <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">EDITED</span>
      </div>
    );
  }
  if (formMode === 'VIEW') {
    return (
      <div className="px-3 py-1 bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-white/80 rounded-xl border border-slate-200 dark:border-white/[0.1] shadow-sm flex items-center gap-1.5 select-none pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.6)]"></div>
        <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">LOCKED (VIEW)</span>
      </div>
    );
  }
  return (
    <div className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-500/20 shadow-sm flex items-center gap-1.5 select-none pointer-events-none">
      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
      <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">LOCKED</span>
    </div>
  );
};

interface HeaderActionsProps {
  formMode: 'NEW' | 'EDIT' | 'VIEW' | 'LOCKED';
  setFormMode: (mode: 'NEW' | 'EDIT' | 'VIEW' | 'LOCKED') => void;
  handleNewSale: () => void;
  setIsHistoryOpen: (open: boolean) => void;
  handleSaveInvoice: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  formMode, 
  setFormMode, 
  handleNewSale, 
  setIsHistoryOpen, 
  handleSaveInvoice 
}) => (
  <div className="flex items-center gap-2 ml-auto select-none">
    <button
      onClick={handleNewSale}
      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-[11px] font-[1000] flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
      title="Start New Sale (F2)"
    >
      <FilePlus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">New (F2)</span>
    </button>
    <button
      onClick={() => setIsHistoryOpen(true)}
      className="px-3 py-1.5 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-white/80 rounded-xl border border-slate-200 dark:border-white/[0.1] text-[11px] font-[1000] flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
      title="Load Past Invoices (F3)"
    >
      <FolderOpen className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Load (F3)</span>
    </button>
    {formMode === 'VIEW' ? (
      <button
        onClick={() => setFormMode('EDIT')}
        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl border border-amber-500 text-[11px] font-[1000] flex items-center gap-1.5 transition-all shadow-sm shadow-amber-600/20 active:scale-95"
        title="Edit Record"
      >
        <Edit className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
      </button>
    ) : (
      <button
        onClick={handleSaveInvoice}
        disabled={formMode === 'LOCKED'}
        className={`px-3 py-1.5 rounded-xl border text-[11px] font-[1000] flex items-center gap-1.5 transition-all shadow-sm ${formMode === 'LOCKED' ? 'bg-slate-100 dark:bg-white/[0.02] text-slate-400 border-slate-200 dark:border-white/[0.05] opacity-50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-600/20 active:scale-95'}`}
        title="Save as Draft (F12)"
      >
        <Save className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Save as Draft (F12)</span>
      </button>
    )}
  </div>
);

interface TotalsFooterProps {
  totalQty: number;
  grossAmount: number;
  totalDiscount: number;
  netPayable: number;
  formMode: 'NEW' | 'EDIT' | 'VIEW' | 'LOCKED';
  handleNewSale: () => void;
  handleCompleteSale: () => void;
}

export const TotalsFooter: React.FC<TotalsFooterProps> = ({ 
  totalQty, 
  grossAmount, 
  totalDiscount, 
  netPayable, 
  formMode, 
  handleNewSale, 
  handleCompleteSale 
}) => (
  <div className="bg-white dark:bg-[#080808] border-t border-slate-200 dark:border-white/[0.1] px-8 py-4 flex justify-between items-center shadow-[0_-15px_40px_rgba(0,0,0,0.05)] shrink-0 z-20">
    <div className="flex gap-10 items-center">
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Qty</span>
        <span className="text-[18px] font-[1000] text-gray-900 dark:text-white leading-none">{totalQty.toFixed(2)}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Amt</span>
        <span className="text-[18px] font-[1000] text-gray-900 dark:text-white leading-none">₹{grossAmount.toLocaleString()}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Disc.</span>
        <span className="text-[18px] font-[1000] text-rose-500 leading-none">-₹{totalDiscount.toLocaleString()}</span>
      </div>
      <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Net Payable</span>
        <div className="flex items-baseline gap-1">
          <span className="text-[16px] font-black text-emerald-600 leading-none">₹</span>
          <span className="text-[36px] font-[1000] text-emerald-600 leading-none tracking-tighter">{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
    <div className="flex gap-3">
      <button onClick={handleNewSale} className="px-6 py-3 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-black hover:bg-slate-200 transition-all flex items-center gap-2 text-slate-600 dark:text-white/60">
        <X className="w-4 h-4" /> Cancel
      </button>
      <button onClick={handleCompleteSale} disabled={formMode === 'VIEW' || formMode === 'LOCKED'} className={`px-10 py-3 bg-indigo-600 text-white rounded-xl text-[14px] font-[1000] shadow-xl shadow-indigo-600/30 hover:-translate-y-1 hover:bg-indigo-700 transition-all flex items-center gap-2.5 ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}>
        <CheckCircle2 className="w-5 h-5" /> Complete Sale (F10)
      </button>
    </div>
  </div>
);
