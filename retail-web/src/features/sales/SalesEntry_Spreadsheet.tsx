import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  User,
  FileText,
  Calendar,
  X,
  PauseCircle,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  FolderOpen,
  FilePlus,
  Tag,
  Plus,
  Maximize2,
  Minimize2,
  Trash2,
  Printer,
  Loader2
} from 'lucide-react';
import { useSalesLogic } from './useSalesLogic';
import { LoadInvoiceModal } from './components/LoadInvoiceModal';
import { SettlePaymentPanel } from './components/SettlePaymentPanel';
import { SalesPopupNotification } from './components/SalesPopupNotification';
import { ReportSelectionModal } from './components/ReportSelectionModal';

const SalesEntry: React.FC = () => {
  const customerNameInputRef = React.useRef<HTMLInputElement>(null);
  const [newCustomerNameInput, setNewCustomerNameInput] = React.useState('');
  const [isHeaderExpanded, setIsHeaderExpanded] = React.useState(true);
  const [isTableMaximized, setIsTableMaximized] = React.useState(false);

  const {
    mobileNumber,
    customerName,
    setCustomerName,
    remarks,
    setRemarks,
    docNo,
    docDate,
    setDocDate,
    formMode,
    setFormMode,
    isHistoryOpen,
    setIsHistoryOpen,
    historySearch,
    setHistorySearch,
    savedInvoicesList,
    items,
    totalQty,
    grossAmount,
    totalDiscount,
    netPayable,
    roundOff,
    searchResults,
    showResults,
    setShowResults,
    barcodeInput,
    setBarcodeInput,
    isScanningItem,
    fetchHistory,
    handleNewSale,
    handleLoadInvoice,
    handleSaveInvoice,
    handlePreviewInvoice,
    handleCompleteSale,
    handleCustomerSelect,
    handleMobileChange,
    handleBarcodeScan,
    handleRemoveItem,
    handleUpdateQty,
    handleUpdateItemDiscountPercent,
    handleUpdateItemDiscount,
    handleUpdateItemSelPrice,
    purSalesmanId,
    setPurSalesmanId,
    salesmenList,
    salesmanSearch,
    setSalesmanSearch,
    isSalesmanDropdownOpen,
    setIsSalesmanDropdownOpen,
    historyPage,
    hasMoreHistory,
    isLoadingHistory,
    totalHistoryRecords,
    globalDiscountPercent,
    handleApplyGlobalDiscountPercent,
    globalDiscountAmount,
    handleApplyGlobalDiscountAmount,
    loadingInvoiceId,
    isSaving,
    paymentAmounts,
    setPaymentAmounts,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    isCredit,
    setIsCredit,
    paymentTypes,
    saveToBackend,
    popup,
    setPopup,
    customReports,
    isReportModalOpen,
    setIsReportModalOpen,
    handleSelectReport,
    loadingReportNo,
    isPreviewLoading
  } = useSalesLogic();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTableMaximized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (items.length === 1 && isHeaderExpanded) {
      setIsHeaderExpanded(false);
    }
  }, [items.length]);

  // --- CUSTOM DATE PICKER STATE & COMPONENT ---

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [pickerMonth, setPickerMonth] = React.useState(() => {
    const d = docDate ? new Date(docDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  React.useEffect(() => {
    if (docDate) {
      const d = new Date(docDate);
      setPickerMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [docDate]);

  const formatDateStr = (y: number, m: number, d: number) => {
    const dateObj = new Date(y, m, d);
    const yr = dateObj.getFullYear();
    const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
    const da = String(dateObj.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  const getCalendarDays = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, dateStr: formatDateStr(year, month - 1, prevMonthDays - i) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, dateStr: formatDateStr(year, month, i) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, dateStr: formatDateStr(year, month + 1, i) });
    }
    return days;
  };

  const CustomDatePickerPopover = ({ onClose, alignClass = "absolute top-full left-0 mt-2" }: { onClose: () => void, alignClass?: string }) => {
    const days = getCalendarDays(pickerMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const todayStr = formatDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`${alignClass} w-80 bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/[0.12] rounded-3xl p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1, 1))}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-center text-slate-600 dark:text-white/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-white/[0.08]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[14px] font-[1000] text-slate-900 dark:text-white tracking-tight">
            {monthNames[pickerMonth.getMonth()]} {pickerMonth.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 1))}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-center text-slate-600 dark:text-white/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200 dark:border-white/[0.08]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => (
            <span key={w} className="text-[10px] font-[1000] text-slate-400 dark:text-white/40 uppercase tracking-wider py-1">
              {w}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((d, idx) => {
            const isSelected = d.dateStr === docDate;
            const isToday = d.dateStr === todayStr;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDocDate(d.dateStr);
                  onClose();
                }}
                className={`h-9 w-full rounded-xl text-[12px] font-[1000] flex items-center justify-center transition-all ${isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105 z-10'
                  : isToday
                    ? 'border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-slate-50 dark:hover:bg-white/5'
                    : d.isCurrentMonth
                      ? 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      : 'text-slate-300 dark:text-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                  }`}
              >
                {d.day}
              </button>
            );
          })}
        </div>

        {/* Footer Quick Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/[0.08] pt-3 mt-2">
          <button
            type="button"
            onClick={() => {
              setDocDate(todayStr);
              onClose();
            }}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[11px] font-[1000] transition-all border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => {
              const yest = new Date();
              yest.setDate(yest.getDate() - 1);
              setDocDate(formatDateStr(yest.getFullYear(), yest.getMonth(), yest.getDate()));
              onClose();
            }}
            className="px-3 py-1.5 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-600 dark:text-white/80 rounded-xl text-[11px] font-[1000] transition-all border border-slate-200 dark:border-white/[0.08] shadow-sm"
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-[11px] font-[1000] transition-all border border-rose-100 dark:border-rose-500/20 shadow-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  };

  // --- REUSABLE COMPONENTS ---

  const StatusBadge = () => {
    if (formMode === 'NEW') {
      return (
        <div className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-500/20 shadow-sm flex items-center gap-1.5 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">NEW</span>
        </div>
      );
    }
    if (formMode === 'EDIT') {
      return (
        <div className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-500/20 shadow-sm flex items-center gap-1.5 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
          <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">EDITED</span>
        </div>
      );
    }
    if (formMode === 'VIEW') {
      return (
        <div className="px-3 py-1 bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-white/80 rounded-xl border border-slate-200 dark:border-white/[0.1] shadow-sm flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.6)]"></div>
          <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">LOCKED (VIEW)</span>
        </div>
      );
    }
    return (
      <div className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-500/20 shadow-sm flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
        <span className="text-[11px] font-[1000] uppercase tracking-widest leading-none">LOCKED</span>
      </div>
    );
  };

  const HeaderActions = () => (
    <div className="flex items-center gap-2 ml-auto">
      <button
        onClick={handleNewSale}
        className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-[12px] font-[1000] flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap"
        title="Start New Sale (F2)"
      >
        <FilePlus className="w-4 h-4" /> <span className="hidden sm:inline">New (F2)</span>
      </button>
      <button
        onClick={() => setIsHistoryOpen(true)}
        className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-white/80 rounded-xl border border-slate-200 dark:border-white/[0.1] text-[12px] font-[1000] flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap"
        title="Load Past Invoices (F3)"
      >
        <FolderOpen className="w-4 h-4" /> <span className="hidden sm:inline">Load (F3)</span>
      </button>

      <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-1"></div>

      {formMode === 'VIEW' ? (
        <button
          onClick={() => setFormMode('EDIT')}
          className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-500/30 text-[12px] font-[1000] flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap animate-pulse"
          title="Edit Invoice"
        >
          <Edit className="w-4 h-4" /> <span>Edit</span>
        </button>
      ) : (
        <button
          onClick={handleSaveInvoice}
          disabled={formMode === 'LOCKED' || items.length === 0 || isSaving}
          className={`px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/30 text-[12px] font-[1000] flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap ${formMode === 'LOCKED' || items.length === 0 || isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Save as Draft (F12)"
        >
          <PauseCircle className="w-4 h-4" /> <span>{isSaving ? 'Saving...' : 'Save as Draft'}</span>
        </button>
      )}

      <button
        onClick={handlePreviewInvoice}
        disabled={items.length === 0 || isSaving || isPreviewLoading || formMode === 'EDIT'}
        className={`px-3.5 py-1.5 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-xl border border-cyan-200 dark:border-cyan-500/30 text-[12px] font-[1000] flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap ${items.length === 0 || isSaving || isPreviewLoading || formMode === 'EDIT' ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Preview Report"
      >
        {isPreviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
        <span>{isPreviewLoading ? 'Loading...' : 'Preview'}</span>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-[1920px] mx-auto">

      {/* 1. Header Section (Customer & Doc Info) */}
      <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-t-2xl p-3.5 shadow-sm dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[16px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Sales Entry (Classic View)</h1>
                <StatusBadge />
              </div>
              <p className="text-[11.5px] font-medium text-gray-500 dark:text-[#8F94A3]">Create new POS transaction in classic spreadsheet layout</p>
            </div>
          </div>
          <HeaderActions />
        </div>

        {/* ── Customer Info Bar ── */}
        <div className="flex items-stretch gap-0 bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] rounded-2xl overflow-hidden shadow-sm">

          {/* Doc No */}
          <div className="flex flex-col justify-center px-3.5 py-1.5 min-w-[110px] shrink-0 border-r border-slate-200 dark:border-white/[0.07]">
            <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
              <FileText className="w-2.5 h-2.5" /> Doc No.
            </span>
            <span className="text-[12.5px] font-[1000] text-slate-800 dark:text-white leading-none">
              <span className="text-indigo-500 dark:text-indigo-400">#</span>{docNo}
            </span>
          </div>

          {/* Date */}
          <div className="flex flex-col justify-center px-3.5 py-1.5 min-w-[140px] shrink-0 border-r border-slate-200 dark:border-white/[0.07] relative">
            <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" /> Date
            </span>
            <button
              type="button"
              onClick={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && setShowDatePicker(prev => !prev)}
              disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
              className={`text-[12.5px] font-[1000] text-slate-800 dark:text-white text-left flex items-center gap-1.5 leading-none group ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-60 cursor-not-allowed' : 'hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer'}`}
            >
              {docDate ? new Date(docDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select Date'}
              <Calendar className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <AnimatePresence>
              {showDatePicker && (
                <CustomDatePickerPopover onClose={() => setShowDatePicker(false)} alignClass="absolute top-full left-0 mt-2 z-[200]" />
              )}
            </AnimatePresence>
          </div>

          {/* Customer Mobile */}
          <div className="flex flex-col justify-center px-3.5 py-1.5 w-[200px] shrink-0 border-r border-slate-200 dark:border-white/[0.07] relative"
            onBlur={(e) => {
              if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) return;
              setShowResults(false);
            }}
          >
            <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
              <Search className="w-2.5 h-2.5" /> Mobile
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search number..."
                value={mobileNumber}
                onChange={(e) => handleMobileChange(e.target.value)}
                readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
                onFocus={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && setShowResults(true)}
                className={`w-full bg-transparent border-0 p-0 text-[12.5px] font-[1000] text-black dark:text-white outline-none placeholder-slate-300 dark:placeholder-white/20 leading-none pr-5 ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              <button
                disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                className={`absolute right-0 p-0.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-700 transition-all ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Search className="w-3 h-3" />
              </button>
            </div>
            <AnimatePresence>
              {showResults && mobileNumber.trim().length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar"
                >
                  {searchResults.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => handleCustomerSelect(customer)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] border-b border-slate-100 dark:border-white/[0.05] last:border-0 transition-colors flex justify-between items-center group"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{customer.name}</span>
                        <span className="text-[10px] font-bold text-slate-400">{customer.mobile}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-700 dark:text-white/60">{customer.loyaltyPoints}</span>
                    </button>
                  ))}
                  <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.05]">
                    <span className="text-[11px] font-[1000] text-indigo-600 dark:text-indigo-400 block mb-1.5 uppercase tracking-wider">New Customer</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Customer Name..."
                        value={newCustomerNameInput}
                        onChange={(e) => setNewCustomerNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newCustomerNameInput.trim()) {
                              setCustomerName(newCustomerNameInput.trim());
                              setShowResults(false);
                              setNewCustomerNameInput('');
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[11px] font-bold text-black dark:text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCustomerNameInput.trim()) {
                            setCustomerName(newCustomerNameInput.trim());
                            setShowResults(false);
                            setNewCustomerNameInput('');
                          }
                        }}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-[1000] transition-all flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3 h-3" /> Map Name
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Customer Name */}
          <div className="flex flex-col justify-center px-3.5 py-1.5 flex-1 min-w-[150px] border-r border-slate-200 dark:border-white/[0.07]">
            <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
              <User className="w-2.5 h-2.5 text-emerald-500" /> Customer Name
            </span>
            {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
              <input
                ref={customerNameInputRef}
                type="text"
                placeholder="Walk-in Customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-transparent border-0 p-0 text-[12.5px] font-[1000] focus:ring-0 focus:outline-none text-emerald-700 dark:text-emerald-300 placeholder-slate-300 dark:placeholder-white/20 outline-none leading-none"
              />
            ) : (
              <span className={`text-[12.5px] font-[1000] truncate leading-none ${customerName ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-300 dark:text-white/20'}`}>
                {customerName || 'Walk-in Customer'}
              </span>
            )}
          </div>

          {/* Salesman */}
          <div className="flex flex-col justify-center px-3.5 py-1.5 w-[200px] shrink-0 border-r border-slate-200 dark:border-white/[0.07] relative">
            <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
              <UserCheck className="w-2.5 h-2.5 text-indigo-500" /> Salesman
            </span>
            <input
              type="text"
              placeholder="Search salesman..."
              value={salesmanSearch}
              onChange={(e) => {
                setSalesmanSearch(e.target.value);
                if (purSalesmanId) setPurSalesmanId(null);
                setIsSalesmanDropdownOpen(true);
              }}
              onFocus={() => { if (formMode !== 'VIEW' && formMode !== 'LOCKED') setIsSalesmanDropdownOpen(true); }}
              onBlur={() => { setTimeout(() => setIsSalesmanDropdownOpen(false), 200); }}
              readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
              className={`w-full bg-transparent border-0 p-0 text-[12.5px] font-[1000] text-indigo-700 dark:text-indigo-300 outline-none placeholder-slate-300 dark:placeholder-white/20 leading-none ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            <AnimatePresence>
              {isSalesmanDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar"
                >
                  {salesmenList
                    .filter(s =>
                      (s.name && s.name.toLowerCase().includes((salesmanSearch || '').toLowerCase())) ||
                      (s.code && s.code.toLowerCase().includes((salesmanSearch || '').toLowerCase()))
                    )
                    .map((salesman) => (
                      <button
                        key={salesman.id}
                        type="button"
                        onClick={() => {
                          setPurSalesmanId(salesman.id);
                          setSalesmanSearch(salesman.name);
                          setIsSalesmanDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] border-b border-slate-100 dark:border-white/[0.05] last:border-0 transition-colors flex justify-between items-center group"
                      >
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{salesman.name}</span>
                          {salesman.code && <span className="text-[11px] font-bold text-slate-400">{salesman.code}</span>}
                        </div>
                      </button>
                    ))
                  }
                  {salesmenList.filter(s =>
                    (s.name && s.name.toLowerCase().includes((salesmanSearch || '').toLowerCase())) ||
                    (s.code && s.code.toLowerCase().includes((salesmanSearch || '').toLowerCase()))
                  ).length === 0 && (
                    <div className="px-4 py-3 text-slate-400 text-[12px] font-bold">No salesmen found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Remarks */}
          <div className="flex flex-col justify-center px-3.5 py-1.5 flex-1 min-w-[150px] border-r border-slate-200 dark:border-white/[0.07]">
            <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
              <FileText className="w-2.5 h-2.5" /> Remarks
            </span>
            <input
              type="text"
              placeholder="Billing remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
              className={`w-full bg-transparent border-0 p-0 text-[12.5px] font-[1000] text-slate-700 dark:text-slate-200 outline-none placeholder-slate-300 dark:placeholder-white/20 leading-none ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* CNote Adjust Toggle */}
          <div className="flex flex-col justify-center items-center px-4 py-1.5 shrink-0 gap-1">
            <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none">CNote</span>
            <button
              type="button"
              onClick={() => setIsHeaderExpanded(prev => !prev)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/50 transition-all active:scale-95"
              title={isHeaderExpanded ? 'Collapse' : 'Expand'}
            >
              {isHeaderExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>


        {/* Scanning Command Bar */}
        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl py-1 px-3 flex items-center gap-3.5 shadow-md mt-3 shrink-0">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
              <span className="text-[10.5px] font-[1000] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 flex items-center justify-center bg-indigo-600 text-white rounded text-[8px] font-black">1</div>
                Scancode
              </span>
            </div>
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Scan Barcode or Type Product Code..."
                autoFocus
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeScan}
                disabled={isScanningItem}
                className={`w-full px-4 py-1 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-black dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-300 min-h-[32px] ${isScanningItem ? 'opacity-50' : ''}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">Enter to Bind</span>
                <button className="p-0.5 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 border-l border-slate-150 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Qty</span>
                <span className="text-[14px] font-[1000] text-slate-900 dark:text-white leading-none">{totalQty.toFixed(2)}</span>
              </div>
              <div className="w-[1px] h-5 bg-slate-100 dark:bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Amount</span>
                <span className="text-[14px] font-[1000] text-indigo-600 dark:text-indigo-400 leading-none">₹{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="w-[1px] h-5 bg-slate-100 dark:bg-white/10"></div>
            <button
              type="button"
              onClick={() => setIsTableMaximized(true)}
              className="p-1.5 bg-slate-50 dark:bg-white/[0.05] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-600 dark:text-white/60 hover:text-indigo-600 dark:hover:text-white transition-all active:scale-95 flex items-center justify-center"
              title="Maximize Scan Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Data Grid (Transaction Details) */}
      <div className="flex-1 bg-white dark:bg-[#0B0C12] border-x border-gray-200 dark:border-white/[0.05] overflow-hidden flex flex-col relative z-0 shadow-sm">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1800px] border-spacing-0">
            <thead className="sticky top-0 z-10 shadow-[0_8px_30px_rgb(79,70,229,0.15)]">
              <tr>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">
                  <button
                    type="button"
                    onClick={() => setIsTableMaximized(true)}
                    className="p-1 bg-indigo-700 dark:bg-indigo-850 hover:bg-indigo-550 dark:hover:bg-indigo-750 text-white rounded transition-all active:scale-95 flex items-center justify-center mx-auto"
                    title="Maximize Screen"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Barcode</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Source Code</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Product Code</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Category</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Color</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Size</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider text-center bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Indiv.</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">MRP</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Sel Price</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-rose-200 uppercase tracking-wider text-right pr-[25px] bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Disc %</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-rose-200 uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Disc Amt</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-emerald-100 uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Rate</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Net Amount</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">HSN</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Tax Desc</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Tax Amt</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Qty</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-rose-200 uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Per Disc</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider text-center bg-indigo-800 dark:bg-indigo-950">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/[0.02] bg-white dark:bg-transparent">

              {/* Cart Items */}
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-white/[0.02] border-b border-slate-100 dark:border-white/[0.05] transition-colors group">
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-white/[0.03]">{index + 1}</td>
                  <td className="px-4 py-2.5 text-[13px] font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-white/[0.03]">{item.barcode}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.sourceCode}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.productCode}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.category}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.color}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.size}</td>
                  <td className="px-4 py-2.5 text-center border-r border-slate-100 dark:border-white/[0.03]">
                    <div className="flex justify-center">
                      <div
                        className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 flex items-center ${item.isIndividual ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'} cursor-not-allowed`}
                        title={item.isIndividual ? 'Individual Item' : 'Standard Pack Item'}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 transform ${item.isIndividual ? 'translate-x-3.5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{item.mrp.toFixed(2)}</td>
                  <td className="px-4 py-2 border-r border-slate-100 dark:border-white/[0.03] text-right">
                    {item.isNoStockChecking && formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                      <div className="flex items-center justify-end w-full">
                        <div className="inline-flex items-center justify-between border border-amber-300 dark:border-amber-500/30 rounded-lg bg-amber-50 dark:bg-amber-500/10 px-2 py-1 w-[100px] focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
                          <span className="text-[13px] font-bold text-amber-500 mr-1 select-none">₹</span>
                          <input
                            type="number"
                            value={item.selPrice}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => handleUpdateItemSelPrice(item.id, Number(e.target.value))}
                            onKeyDown={(e) => {
                              if (['e', 'E', '+', '-'].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="w-full text-right bg-transparent border-0 p-0 focus:ring-0 focus:outline-none font-bold text-[13px] text-amber-700 dark:text-amber-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-slate-350 dark:placeholder-white/20"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            title="Editable — No Stock Check item"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100">₹{item.selPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100 dark:border-white/[0.03] text-right">
                    {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                      <div className="flex items-center justify-end w-full">
                        <div className="inline-flex items-center justify-between border border-slate-200 dark:border-white/[0.1] rounded-lg bg-slate-50 dark:bg-white/[0.02] px-2 py-1 w-[90px] focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all">
                          <input
                            type="number"
                            value={item.rowDiscountPercent !== undefined ? Math.round(item.rowDiscountPercent * 100) / 100 : ''}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => handleUpdateItemDiscountPercent(item.id, Number(e.target.value))}
                            onKeyDown={(e) => {
                              if (['e', 'E', '+', '-'].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="w-full text-right bg-transparent border-0 p-0 focus:ring-0 focus:outline-none font-bold text-[13px] text-rose-600 dark:text-rose-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-slate-350 dark:placeholder-white/20"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                          />
                          <span className="text-[13px] font-bold text-rose-500 ml-1 select-none">%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block text-[13px] font-bold text-slate-750 dark:text-slate-200 pr-[9px]">
                        {item.rowDiscountPercent !== undefined ? item.rowDiscountPercent.toFixed(2) : '0.00'}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100 dark:border-white/[0.03] text-right bg-rose-50/10 dark:bg-rose-500/[0.02]">
                    {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                      <div className="flex items-center justify-end w-full">
                        <div className="inline-flex items-center justify-between border border-slate-200 dark:border-white/[0.1] rounded-lg bg-slate-50 dark:bg-white/[0.02] px-2 py-1 w-[110px] focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all">
                          <span className="text-[13px] font-bold text-rose-500 mr-1 select-none">₹</span>
                          <input
                            type="number"
                            value={item.rowDiscount !== undefined ? Math.round((item.rowDiscount * item.qty) * 100) / 100 : 0}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => handleUpdateItemDiscount(item.id, Number(e.target.value) / item.qty)}
                            onKeyDown={(e) => {
                              if (['e', 'E', '+', '-'].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="w-full text-right bg-transparent border-0 p-0 focus:ring-0 focus:outline-none font-bold text-[13px] text-rose-600 dark:text-rose-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-slate-350 dark:placeholder-white/20"
                            min="0"
                            max={item.selPrice * item.qty}
                            step="0.01"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block text-[13px] font-bold text-rose-600 dark:text-rose-400 pr-[9px]">
                        ₹{((item.rowDiscount || 0) * item.qty).toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[13px] font-bold text-slate-900 dark:text-slate-100 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{(item.selPrice - (item.rowDiscount || 0)).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-[14px] font-bold text-indigo-600 dark:text-indigo-400 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{((item.selPrice - (item.rowDiscount || 0)) * item.qty).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.hsn}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.taxDesc}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{item.taxAmt.toFixed(2)}</td>
                  <td className="px-4 py-2 border-r border-slate-100 dark:border-white/[0.03] text-right">
                    {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                      <div className="flex items-center justify-end w-full">
                        <input
                          type="number"
                          value={item.qty}
                          onFocus={(e) => e.target.select()}
                          disabled={item.isIndividual}
                          onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                          onKeyDown={(e) => {
                            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (isNaN(val) || val <= 0) {
                              handleUpdateQty(item.id, 1);
                            }
                          }}
                          className={`w-20 text-right bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2 py-1 font-bold text-[13px] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${item.isIndividual ? 'opacity-50 cursor-not-allowed' : ''}`}
                          min="1"
                        />
                      </div>
                    ) : (
                      <span className="inline-block text-[14px] font-bold text-slate-900 dark:text-slate-100 pr-[9px]">
                        {item.qty}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100 dark:border-white/[0.03] text-right">
                    <span className="inline-block text-[13px] font-bold text-rose-600 dark:text-rose-400 pr-[9px]">
                      ₹{(item.discount - (item.rowDiscount || 0)).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                      className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
                    >
                      <X className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {items.length === 0 && (
                <tr>
                  <td colSpan={17} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center text-slate-400 border border-slate-100 dark:border-white/[0.05] shadow-inner">
                        <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Your Cart is Empty</h3>
                        <p className="text-[12px] text-slate-500 dark:text-[#8F94A3] mt-0.5">Scan barcodes or search products to begin</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Footer Section (Summary & Actions) */}
      <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-b-2xl py-2.5 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] z-10 relative shrink-0">
        <div className="flex items-center justify-between">

          {/* Summary Calculations */}
          <div className="flex gap-5 items-center">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Qty</span>
              <span className="text-[15px] font-[1000] text-gray-900 dark:text-white leading-none">{totalQty.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Amt</span>
              <span className="text-[15px] font-[1000] text-gray-900 dark:text-white leading-none">₹{grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Item Disc</span>
              <span className="text-[15px] font-[1000] text-rose-500 leading-none">-₹{totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1.5"></div>
            <div className="flex flex-col gap-0.5 w-[115px] -mt-1">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 justify-center whitespace-nowrap">
                <Tag className="w-3 h-3 text-rose-500" /> Bill Disc %
              </span>
              <div className="relative mt-0.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={globalDiscountPercent ? Math.round(globalDiscountPercent * 100) / 100 : 0}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    handleApplyGlobalDiscountPercent(isNaN(val) ? 0 : val);
                  }}
                  disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                  className="w-full pl-2 pr-6 py-0.5 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-center text-rose-600 dark:text-rose-400 focus:outline-none focus:border-rose-500 transition-all h-7 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-70 disabled:cursor-not-allowed"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-[1000] text-slate-400 pointer-events-none">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 w-[115px] -mt-1">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 justify-center whitespace-nowrap">
                <Tag className="w-3 h-3 text-rose-500" /> Bill Disc Amt
              </span>
              <div className="relative mt-0.5">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={globalDiscountAmount ? Math.round(globalDiscountAmount * 100) / 100 : 0}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    handleApplyGlobalDiscountAmount(isNaN(val) ? 0 : val);
                  }}
                  disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                  className="w-full pl-5 pr-2 py-0.5 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-center text-rose-600 dark:text-rose-400 focus:outline-none focus:border-rose-500 transition-all h-7 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-70 disabled:cursor-not-allowed"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-[1000] text-slate-400 pointer-events-none">₹</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1.5"></div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Round Off</span>
              <span className={`text-[15px] font-[1000] leading-none ${roundOff > 0 ? 'text-emerald-600 dark:text-emerald-400' : roundOff < 0 ? 'text-rose-500' : 'text-slate-500 dark:text-white'}`}>
                {roundOff > 0 ? '+' : roundOff < 0 ? '-' : ''}₹{Math.abs(roundOff).toFixed(2)}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1.5"></div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Net Amount</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[14px] font-black text-emerald-600 leading-none">₹</span>
                <span className="text-[26px] font-[1000] text-emerald-600 leading-none tracking-tighter">{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleNewSale}
              className="px-4 py-2 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[12px] font-black hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all flex items-center gap-1.5 text-slate-600 dark:text-white/60 whitespace-nowrap"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleCompleteSale}
              disabled={formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving}
              className={`px-6 py-2 bg-indigo-600 text-white rounded-xl text-[13px] font-[1000] shadow-xl shadow-indigo-600/30 hover:-translate-y-1 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all flex items-center gap-2 whitespace-nowrap ${formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}
            >
              <CheckCircle2 className="w-4.5 h-4.5" /> {isSaving ? 'Completing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice History Modal */}
      <LoadInvoiceModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        searchQuery={historySearch}
        onSearchChange={setHistorySearch}
        invoicesList={savedInvoicesList}
        onSelectInvoice={handleLoadInvoice}
        onRefresh={() => fetchHistory(1, historySearch, false)}
        onLoadMore={() => fetchHistory(historyPage + 1, historySearch, true)}
        hasMore={hasMoreHistory}
        isLoading={isLoadingHistory}
        totalRecords={totalHistoryRecords}
        loadingInvoiceId={loadingInvoiceId}
      />

      {/* Split Payment Drawer */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[150] overflow-hidden text-slate-800 dark:text-slate-100">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#0f0f11] shadow-2xl flex flex-col border-l border-slate-200 dark:border-white/[0.08]"
            >
              <SettlePaymentPanel
                formMode={formMode}
                paymentTypes={paymentTypes}
                paymentAmounts={paymentAmounts}
                setPaymentAmounts={setPaymentAmounts}
                netPayable={netPayable}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
                saveToBackend={saveToBackend}
                isSaving={isSaving}
                isCredit={isCredit}
                setIsCredit={setIsCredit}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Maximized Scan Mode Overlay */}
      {createPortal(
        <AnimatePresence>
          {isTableMaximized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-slate-950 dark:bg-black p-6 flex flex-col gap-4 text-white overflow-hidden"
            >
              {/* Header / Info bar */}
              <div className="flex items-center justify-between shrink-0 bg-white/[0.04] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-black uppercase tracking-wider">Maximized Scan Mode</span>
                  <span className="text-white/40 text-xs">Press <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[10px] font-mono">ESC</kbd> to return to standard view</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Total Qty</span>
                    <span className="text-xl font-black text-white leading-none">{totalQty.toFixed(2)}</span>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Total Amount</span>
                    <span className="text-xl font-black text-emerald-400 leading-none">₹{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10"></div>
                  <button
                    type="button"
                    onClick={() => setIsTableMaximized(false)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl text-xs font-black text-white transition-all active:scale-95"
                  >
                    <Minimize2 className="w-4 h-4" /> Exit Fullscreen
                  </button>
                </div>
              </div>

              {/* Scan code Input Bar inside maximized view */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-300">
                  <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center bg-indigo-600 text-white rounded-lg text-[9px]">1</div>
                    Scancode
                  </span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    ref={(el) => {
                      if (el && isTableMaximized) el.focus();
                    }}
                    placeholder="Scan Barcode or Type Product Code..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={handleBarcodeScan}
                    disabled={isScanningItem}
                    className={`w-full px-5 py-2.5 bg-white/5 border-2 border-white/10 rounded-xl text-[14px] font-black text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner placeholder:text-white/20 ${isScanningItem ? 'opacity-50' : ''}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/30">
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Enter to Bind</span>
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar min-h-0 bg-transparent">
                  <table className="w-full min-w-[1800px] border-collapse text-left border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-slate-950 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-300 uppercase tracking-widest w-16 border-r border-white/10">#</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-widest w-48 border-r border-white/10">Barcode</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-40 border-r border-white/10">Source Code</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-widest flex-1 border-r border-white/10 bg-slate-900/20">Product Code</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-40 border-r border-white/10">Category</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-32 border-r border-white/10">Color</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-24 border-r border-white/10">Size</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-24 text-center border-r border-white/10">Indiv.</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-36 text-right border-r border-white/10">MRP</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-emerald-300 uppercase tracking-widest w-36 text-right border-r border-white/10">Sel Price</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-rose-300 uppercase tracking-widest w-24 text-right pr-[25px] border-r border-white/10">Disc %</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-rose-300 uppercase tracking-widest w-36 text-right border-r border-white/10">Disc Amt</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-emerald-200 uppercase tracking-widest w-36 text-right border-r border-white/10">Rate</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-widest w-40 text-right border-r border-white/10">Net Amount</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-32 border-r border-white/10">HSN</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-40 border-r border-white/10">Tax Desc</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-36 text-right border-r border-white/10">Tax Amt</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-widest w-24 text-right border-r border-white/10">Qty</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-rose-300 uppercase tracking-widest w-36 text-right border-r border-white/10">Per Disc</th>
                        <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-widest w-24 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                      {items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-4 py-3.5 text-[12px] font-black text-white/30 border-r border-white/5">{index + 1}</td>
                          <td className="px-4 py-3.5 text-[13px] font-bold text-white/90 border-r border-white/5">{item.barcode}</td>
                          <td className="px-4 py-3.5 text-[12px] font-bold text-white/50 border-r border-white/5">{item.sourceCode}</td>
                          <td className="px-4 py-3.5 text-[13px] font-bold text-white/90 border-r border-white/5">{item.productCode}</td>
                          <td className="px-4 py-3.5 text-[12px] font-bold text-white/70 border-r border-white/5 uppercase">{item.category}</td>
                          <td className="px-4 py-3.5 text-[12px] font-bold text-white/70 border-r border-white/5">{item.color}</td>
                          <td className="px-4 py-3.5 text-[12px] font-bold text-white/70 border-r border-white/5">{item.size}</td>
                          <td className="px-4 py-3.5 text-center border-r border-white/5">
                            <div className="flex justify-center">
                              <div className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 flex items-center ${item.isIndividual ? 'bg-indigo-500' : 'bg-white/10'} cursor-not-allowed`}>
                                <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 transform ${item.isIndividual ? 'translate-x-3.5' : 'translate-x-0'}`} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-[13px] font-bold text-white/60 text-right border-r border-white/5">₹{item.mrp.toFixed(2)}</td>
                          <td className="px-4 py-3 border-r border-white/5 text-right">
                            {item.isNoStockChecking && formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                              <div className="flex items-center justify-end w-full">
                                <div className="inline-flex items-center justify-between border border-amber-500/30 rounded-lg bg-amber-500/10 px-2 py-0.5 w-[100px] focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
                                  <span className="text-[12px] font-bold text-amber-400 mr-1 select-none">₹</span>
                                  <input
                                    type="number"
                                    value={item.selPrice}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleUpdateItemSelPrice(item.id, Number(e.target.value))}
                                    onKeyDown={(e) => {
                                      if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="w-full text-right bg-transparent border-0 p-0 focus:ring-0 focus:outline-none font-bold text-[12px] text-amber-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[13px] font-bold text-slate-100">₹{item.selPrice.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 border-r border-white/5 text-right">
                            {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                              <div className="flex items-center justify-end w-full">
                                <div className="inline-flex items-center justify-between border border-white/10 rounded-lg bg-white/5 px-2 py-0.5 w-[90px] focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all">
                                  <input
                                    type="number"
                                    value={item.rowDiscountPercent !== undefined ? Math.round(item.rowDiscountPercent * 100) / 100 : ''}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleUpdateItemDiscountPercent(item.id, Number(e.target.value))}
                                    onKeyDown={(e) => {
                                      if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="w-full text-right bg-transparent border-0 p-0 focus:ring-0 focus:outline-none font-bold text-[12px] text-rose-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    placeholder="0"
                                  />
                                  <span className="text-[12px] font-bold text-rose-400 ml-1 select-none">%</span>
                                </div>
                              </div>
                            ) : (
                              <span className="inline-block text-[12px] font-bold text-white/80 pr-[9px]">
                                {item.rowDiscountPercent !== undefined ? item.rowDiscountPercent.toFixed(2) : '0.00'}%
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 border-r border-white/5 text-right bg-rose-500/[0.02]">
                            {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                              <div className="flex items-center justify-end w-full">
                                <div className="inline-flex items-center justify-between border border-white/10 rounded-lg bg-white/5 px-2 py-0.5 w-[110px] focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all">
                                  <span className="text-[12px] font-bold text-rose-400 mr-1 select-none">₹</span>
                                  <input
                                    type="number"
                                    value={item.rowDiscount !== undefined ? Math.round((item.rowDiscount * item.qty) * 100) / 100 : 0}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => handleUpdateItemDiscount(item.id, Number(e.target.value) / item.qty)}
                                    onKeyDown={(e) => {
                                      if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                      }
                                    }}
                                    className="w-full text-right bg-transparent border-0 p-0 focus:ring-0 focus:outline-none font-bold text-[12px] text-rose-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="0"
                                    max={item.selPrice * item.qty}
                                    step="0.01"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="inline-block text-[12px] font-bold text-rose-400 pr-[9px]">
                                ₹{((item.rowDiscount || 0) * item.qty).toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-[13px] font-bold text-slate-100 text-right border-r border-white/5">₹{(item.selPrice - (item.rowDiscount || 0)).toFixed(2)}</td>
                          <td className="px-4 py-3.5 text-[14px] font-bold text-indigo-300 text-right border-r border-white/5">₹{((item.selPrice - (item.rowDiscount || 0)) * item.qty).toFixed(2)}</td>
                          <td className="px-4 py-3.5 text-[12px] font-bold text-white/50 border-r border-white/5">{item.hsn}</td>
                          <td className="px-4 py-3.5 text-[12px] font-bold text-white/50 border-r border-white/5">{item.taxDesc}</td>
                          <td className="px-4 py-3.5 text-[12px] font-bold text-white/60 text-right border-r border-white/5">₹{item.taxAmt.toFixed(2)}</td>

                          {/* Qty Column */}
                          <td className="px-4 py-3.5 border-r border-white/5 text-right">
                            {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                              <div className="flex items-center justify-end w-full">
                                <input
                                  type="number"
                                  value={item.qty}
                                  onFocus={(e) => e.target.select()}
                                  disabled={item.isIndividual}
                                  onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                                  onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const val = Number(e.target.value);
                                    if (isNaN(val) || val <= 0) {
                                      handleUpdateQty(item.id, 1);
                                    }
                                  }}
                                  className={`w-20 text-right bg-white/5 border border-white/20 rounded-lg px-2 py-0.5 font-bold text-[12px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${item.isIndividual ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  min="1"
                                />
                              </div>
                            ) : (
                              <span className="inline-block text-[14px] font-bold text-white/80 pr-[9px]">
                                {item.qty}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 border-r border-white/5 text-right">
                            <span className="inline-block text-[12px] font-bold text-rose-400 pr-[9px]">
                              ₹{(item.discount - (item.rowDiscount || 0)).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-600 hover:text-white rounded-lg text-rose-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Popup Notification inside maximized view */}
              <SalesPopupNotification popup={popup} setPopup={setPopup} />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <ReportSelectionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reports={customReports}
        onSelectReport={handleSelectReport}
        loadingReportNo={loadingReportNo}
      />
    </div>
  );
};

export default SalesEntry;
