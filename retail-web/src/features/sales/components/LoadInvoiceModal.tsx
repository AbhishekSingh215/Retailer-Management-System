import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, X, Search, RefreshCw, FileText, Lock, User } from 'lucide-react';
import type { SavedInvoice } from '../useSalesLogic';

interface LoadInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  invoicesList: SavedInvoice[];
  onSelectInvoice: (inv: SavedInvoice) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  totalRecords: number;
  loadingInvoiceId: number | null;
}

export const LoadInvoiceModal: React.FC<LoadInvoiceModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  invoicesList,
  onSelectInvoice,
  onRefresh,
  onLoadMore,
  hasMore,
  isLoading,
  totalRecords,
  loadingInvoiceId
}) => {
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'DRAFT' | 'LOCKED'>('ALL');

  const filteredInvoicesList = invoicesList.filter(inv => {
    if (statusFilter === 'DRAFT') return inv.status === 'EDIT';
    if (statusFilter === 'LOCKED') return inv.status === 'LOCKED';
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/[0.1] rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/[0.08] flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[18px] font-[1000] text-gray-900 dark:text-white tracking-tight leading-none mb-1">Sales Register & History</h3>
                  <p className="text-[12px] font-bold text-slate-400 dark:text-white/40">Load, view, or edit existing invoices in the system</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loadingInvoiceId !== null}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Toolbar */}
            <div className="p-6 border-b border-slate-100 dark:border-white/[0.05] flex gap-4 items-center bg-white dark:bg-[#121212] shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Doc No, Customer Name, or Mobile..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-gray-900 dark:text-white outline-none focus:border-indigo-500 transition-all shadow-inner"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[12px] font-bold text-slate-400">
                  Showing {filteredInvoicesList.length} of {totalRecords} Invoices
                </div>
                <button
                  onClick={onRefresh}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-600 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-white/[0.1] transition-all flex items-center gap-1.5 text-[11px] font-[1000] active:scale-95"
                  title="Refresh List from Server"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="px-8 py-3 bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/[0.05] flex gap-2 shrink-0">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-1.5 rounded-xl text-[11px] font-[1000] uppercase tracking-widest transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                All Invoices ({invoicesList.length})
              </button>
              <button
                onClick={() => setStatusFilter('DRAFT')}
                className={`px-4 py-1.5 rounded-xl text-[11px] font-[1000] uppercase tracking-widest transition-all ${
                  statusFilter === 'DRAFT'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/10'
                    : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                Drafts ({invoicesList.filter(i => i.status === 'EDIT').length})
              </button>
              <button
                onClick={() => setStatusFilter('LOCKED')}
                className={`px-4 py-1.5 rounded-xl text-[11px] font-[1000] uppercase tracking-widest transition-all ${
                  statusFilter === 'LOCKED'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10'
                    : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                Completed ({invoicesList.filter(i => i.status === 'LOCKED').length})
              </button>
            </div>

            {/* Modal List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/30 dark:bg-transparent">
              <div className="grid grid-cols-1 gap-4">
                {filteredInvoicesList.map((inv) => (
                  <div
                    key={inv.docNo}
                    className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 hover:border-indigo-500 dark:hover:border-indigo-500/50 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-[1000] text-[14px] border border-slate-200 dark:border-white/[0.1] group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-[16px] font-[1000] text-gray-900 dark:text-white tracking-tight">{inv.docNo}</h4>
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-[1000] bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/[0.1]">{inv.docDate}</span>
                          {inv.status === 'LOCKED' ? (
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-[1000] bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center gap-1" title="Finalized & Locked Invoice">
                              <Lock className="w-3 h-3" /> LOCKED
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-[1000] bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1" title="Unsaved Draft / Hold Invoice">
                              <FileText className="w-3 h-3" /> DRAFT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[13px] font-bold text-slate-500 dark:text-white/60">
                          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-500" /> {inv.customerName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-white/5">
                      <div className="flex flex-col md:items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items / Amount</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[13px] font-[1000] text-indigo-600 dark:text-indigo-400">{inv.totalQty ?? inv.items.length} items</span>
                          <span className="text-[18px] font-[1000] text-gray-900 dark:text-white">₹{(inv.netAmount ?? inv.items.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        disabled={loadingInvoiceId !== null}
                        className={`px-6 py-3 font-[1000] text-[13px] rounded-xl transition-all flex items-center gap-2 ${
                          loadingInvoiceId === inv.purId
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 cursor-wait"
                            : loadingInvoiceId !== null
                              ? "bg-slate-150 dark:bg-white/[0.01] text-slate-400 border border-slate-200 dark:border-white/[0.05] cursor-not-allowed opacity-50"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95"
                        }`}
                      >
                        {loadingInvoiceId === inv.purId ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Select / Load"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-indigo-600 dark:text-indigo-400 font-[1000] text-[13px] transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    {isLoading ? 'Loading...' : 'Load More Invoices'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
