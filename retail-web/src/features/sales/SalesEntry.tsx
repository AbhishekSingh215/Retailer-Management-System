import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  User,
  FileText,
  Calendar,
  X,
  PauseCircle,
  Barcode,
  Tag,
  Hash,
  Store,
  CheckCircle2,
  LayoutDashboard,
  FileSpreadsheet,
  Trash2,
  FolderOpen,
  FilePlus,
  Edit,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useSalesLogic } from './useSalesLogic';
import { LoadInvoiceModal } from './components/LoadInvoiceModal';

const SalesEntry: React.FC = () => {
  const {
    mobileNumber,
    customerName,
    docNo,
    docDate,
    setDocDate,
    formMode,
    setFormMode,
    isHistoryOpen,
    setIsHistoryOpen,
    historySearch,
    setHistorySearch,
    items,
    setItems,
    savedInvoicesList,
    popup,
    setPopup,
    viewMode,
    setViewMode,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    cartSearch,
    setCartSearch,
    barcodeInput,
    setBarcodeInput,
    isScanningItem,
    isDetailsOpen,
    setIsDetailsOpen,
    totalQty,
    grossAmount,
    totalDiscount,
    netPayable,
    subtotalExclTax,
    cgstAmount,
    sgstAmount,
    igstAmount,
    lastScannedItem,
    filteredItems,
    classicScrollRef,
    fetchHistory,
    handleNewSale,
    handleLoadInvoice,
    handleSaveInvoice,
    handleCompleteSale,
    handleCustomerSelect,
    handleMobileChange,
    handleBarcodeScan,
    handleRemoveItem,
    handleUpdateQty,
    handleUpdateItemDiscountPercent,
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
    isSaving
  } = useSalesLogic();

  const totalTaxAmt = cgstAmount + sgstAmount + igstAmount;

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

  const LayoutToggle = () => (
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
    </div>
  );

  const TotalsFooter = () => (
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
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Tax Amt</span>
          <span className="text-[18px] font-[1000] text-indigo-500 leading-none" title={`CGST: ₹${cgstAmount.toFixed(2)} | SGST: ₹${sgstAmount.toFixed(2)} | IGST: ₹${igstAmount.toFixed(2)}`}>
            ₹{totalTaxAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Net Payable</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-black text-emerald-600 leading-none">₹</span>
            <span className="text-[36px] font-[1000] text-emerald-600 leading-none tracking-tighter">{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        {(formMode === 'NEW' || formMode === 'EDIT') && (
          <>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
            <div className="flex flex-col gap-0.5 w-[85px] -mt-1">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 justify-center">
                <Tag className="w-3.5 h-3.5 text-rose-500" /> Bulk %
              </span>
              <div className="relative mt-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={globalDiscountPercent || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    handleApplyGlobalDiscountPercent(isNaN(val) ? 0 : val);
                  }}
                  disabled={false}
                  className="w-full pl-2 pr-6 py-1 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[14px] font-[1000] text-center text-rose-600 dark:text-rose-400 focus:outline-none focus:border-rose-500 transition-all h-8 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-[1000] text-slate-400 pointer-events-none">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 w-[90px] -mt-1">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 justify-center">
                <Tag className="w-3.5 h-3.5 text-rose-500" /> Bulk Amt
              </span>
              <div className="relative mt-1">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={globalDiscountAmount || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    handleApplyGlobalDiscountAmount(isNaN(val) ? 0 : val);
                  }}
                  disabled={false}
                  className="w-full pl-5 pr-2 py-1 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[14px] font-[1000] text-center text-rose-600 dark:text-rose-400 focus:outline-none focus:border-rose-500 transition-all h-8 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-[1000] text-slate-400 pointer-events-none">₹</span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={handleNewSale} className="px-6 py-3 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-black hover:bg-slate-200 transition-all flex items-center gap-2 text-slate-600 dark:text-white/60">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          onClick={handleCompleteSale}
          disabled={formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving}
          className={`px-10 py-3 bg-indigo-600 text-white rounded-xl text-[14px] font-[1000] shadow-xl shadow-indigo-600/30 hover:-translate-y-1 hover:bg-indigo-700 transition-all flex items-center gap-2.5 ${formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}
        >
          <CheckCircle2 className="w-5 h-5" /> {isSaving ? 'Completing...' : 'Complete Sale (F10)'}
        </button>
      </div>
    </div>
  );

  const renderClassicView = () => (
    <div className="flex flex-col h-full gap-2 p-3 pt-0 overflow-hidden bg-transparent">
      <div className="flex justify-end pt-1">
        <LayoutToggle />
      </div>

      {/* Classic Header & Scanning Section - Compressed for Max Grid Space */}
      <div className="flex flex-col gap-2 shrink-0 relative z-[50]">
        {/* Row 1: Invoice & Customer Info - SLIM VERSION */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-3 flex flex-wrap items-center gap-4 shadow-sm shrink-0">
          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Doc No.</span>
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-white/[0.05] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-slate-900 dark:text-white shadow-sm flex items-center gap-2 min-h-[38px]">
              <span className="text-indigo-600 dark:text-indigo-400">#</span>
              <span>{docNo}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Date</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && setShowDatePicker(prev => !prev)}
                disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                className={`w-full px-3 py-1.5 bg-white dark:bg-white/[0.05] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-slate-955 dark:text-white shadow-sm outline-none flex items-center justify-between gap-2 focus:border-indigo-500 min-h-[38px] ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10'}`}
              >
                <span>{docDate ? new Date(docDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select Date'}</span>
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </button>
              <AnimatePresence>
                {showDatePicker && viewMode === 'classic' && (
                  <CustomDatePickerPopover onClose={() => setShowDatePicker(false)} alignClass="absolute top-full left-0 mt-2" />
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2"><Search className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Customer Mobile</span>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                value={mobileNumber}
                onChange={(e) => handleMobileChange(e.target.value)}
                readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
                onFocus={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && searchResults.length > 0 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className={`w-full px-4 py-1.5 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-black dark:text-white focus:border-indigo-600 dark:focus:border-indigo-400 transition-all shadow-inner outline-none placeholder-slate-300 ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed bg-slate-50 dark:bg-white/[0.01]' : ''}`}
              />
              <button disabled={formMode === 'VIEW' || formMode === 'LOCKED'} className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-700 ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-50 cursor-not-allowed' : ''}`}><Search className="w-3.5 h-3.5" /></button>

              <AnimatePresence>
                {showResults && viewMode === 'classic' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar"
                  >
                    {searchResults.map((customer) => (
                      <button
                        key={customer.id}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex-[0.8] flex flex-col gap-1 min-w-[180px]">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2"><User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Customer Name</span>
            <div className="px-4 py-1.5 bg-emerald-50/50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center justify-between shadow-sm min-h-[38px]">
              <div className="flex items-center gap-2 min-w-0">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className={`text-[13px] font-[1000] truncate ${customerName ? "text-emerald-950 dark:text-emerald-300" : "text-slate-400 dark:text-white/30"}`}>
                  {customerName || 'Walk-in Customer'}
                </span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse flex-shrink-0"></div>
            </div>
          </div>

          <div className="flex-[2.2] flex flex-col gap-1 min-w-[480px] relative">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Salesman
            </span>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Type name to search..."
                  value={salesmanSearch}
                  onChange={(e) => {
                    setSalesmanSearch(e.target.value);
                    if (purSalesmanId) {
                      setPurSalesmanId(null);
                    }
                    setIsSalesmanDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (formMode !== 'VIEW' && formMode !== 'LOCKED') {
                      setIsSalesmanDropdownOpen(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSalesmanDropdownOpen(false), 200);
                  }}
                  readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
                  className={`w-full px-4 py-1.5 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-black dark:text-white focus:border-indigo-600 dark:focus:border-indigo-400 transition-all shadow-inner outline-none placeholder-slate-300 ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed bg-slate-50 dark:bg-white/[0.01]' : ''}`}
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

              {/* Dynamic Status Badge */}
              <StatusBadge />

              {/* Action Buttons (New, Load, Save) */}
              <HeaderActions />
            </div>
          </div>
        </div>

        {/* Row 2: Scanning Command Bar - EVEN SLIMMER */}
        <div className="bg-white dark:bg-white/[0.03] border-2 border-indigo-100 dark:border-white/[0.08] rounded-2xl p-2 flex items-center gap-4 shadow-lg shadow-indigo-500/5">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
              <span className="text-[11px] font-[1000] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center bg-indigo-600 text-white rounded-lg text-[9px]">1</div>
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
                className={`w-full px-5 py-2 bg-slate-50 dark:bg-white/[0.05] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[14px] font-[1000] text-black dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all shadow-inner placeholder:text-slate-300 ${isScanningItem ? 'opacity-50' : ''}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">Enter to Bind</span>
                <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 border-l-2 border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Qty</span>
                <span className="text-[16px] font-[1000] text-slate-900 dark:text-white leading-none">{totalQty.toFixed(2)}</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-100 dark:bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Amount</span>
                <span className="text-[16px] font-[1000] text-indigo-600 dark:text-indigo-400 leading-none">{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classic Wide Grid Table - Now fills all remaining space */}
      <div className="flex-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-0">
        <div ref={classicScrollRef} className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar min-h-0 bg-white dark:bg-transparent">
          <table className="w-full min-w-[1800px] border-collapse text-left border-spacing-0">
            <thead className="sticky top-0 z-10 shadow-[0_8px_30px_rgb(79,70,229,0.15)]">
              <tr className="border-b-0">
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-200 uppercase tracking-widest w-16 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">#</th>
                {formMode !== 'VIEW' && formMode !== 'LOCKED' && (
                  <th className="px-6 py-4 text-[11px] font-[1000] text-white uppercase tracking-widest w-24 text-center bg-indigo-800 dark:bg-indigo-950 border-r border-indigo-500/30">Actions</th>
                )}
                <th className="px-6 py-4 text-[11px] font-[1000] text-white uppercase tracking-widest w-48 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Barcode</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-40 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Source Code</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-white uppercase tracking-widest flex-1 bg-indigo-700 dark:bg-indigo-950 border-r border-indigo-600/30">Product Description</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-40 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Category</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-32 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Color</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-24 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Size</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-24 text-center bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Indiv</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-24 text-center bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Qty</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-36 text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">MRP</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-emerald-300 uppercase tracking-widest w-36 text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Sel Price</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-rose-300 uppercase tracking-widest w-24 text-right pr-[33px] bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Disc %</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-rose-300 uppercase tracking-widest w-36 text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Disc.</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-emerald-200 uppercase tracking-widest w-36 text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Rate</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-32 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">HSN</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-40 bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Tax Desc</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-indigo-100 uppercase tracking-widest w-36 text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Tax Amt</th>
                <th className="px-6 py-4 text-[11px] font-[1000] text-white uppercase tracking-widest w-40 text-right bg-indigo-800 dark:bg-indigo-950">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-white/[0.03]">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10 transition-all group even:bg-slate-50/30 dark:even:bg-white/[0.01]">
                  <td className="px-6 py-5 text-[12px] font-[1000] text-slate-400 dark:text-white/10 group-hover:text-indigo-600 transition-colors">{index + 1}</td>
                  {formMode !== 'VIEW' && formMode !== 'LOCKED' && (
                    <td className="px-6 py-5 text-center bg-indigo-50/20 dark:bg-indigo-500/5 border-r border-indigo-100 dark:border-white/5">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:scale-110 transition-all shadow-sm mx-auto flex items-center justify-center"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  <td className="px-6 py-5 text-[14px] font-[1000] text-black dark:text-white group-hover:text-indigo-800 transition-colors tracking-tighter">{item.barcode}</td>
                  <td className="px-6 py-5 text-[12px] font-[900] text-slate-500">{item.sourceCode}</td>
                  <td className="px-6 py-5 text-[15.5px] font-[1000] text-indigo-950 dark:text-indigo-300 tracking-tight leading-tight">{item.productCode}</td>
                  <td className="px-6 py-5 text-[12px] font-[1000] text-slate-700 uppercase tracking-wide">{item.category}</td>
                  <td className="px-6 py-5 text-[12px] font-[1000] text-slate-700">{item.color}</td>
                  <td className="px-6 py-5 text-[12px] font-[1000] text-slate-700">{item.size}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                      <div 
                        className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 flex items-center ${item.isIndividual ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'} cursor-not-allowed`}
                        title={item.isIndividual ? 'Individual Item' : 'Standard Pack Item'}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 transform ${item.isIndividual ? 'translate-x-3.5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                      {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                        <input
                          type="number"
                          value={item.qty === 0 ? '' : item.qty}
                          disabled={item.isIndividual}
                          onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                          className={`w-20 px-3 py-1 bg-white dark:bg-white/[0.05] border-2 ${item.isIndividual ? 'border-slate-200 dark:border-white/[0.05] opacity-50 cursor-not-allowed' : 'border-slate-400 dark:border-white/[0.1] focus:border-indigo-500'} rounded-xl text-[14px] font-[1000] text-center text-black dark:text-white shadow-md focus:outline-none`}
                          min="1"
                        />
                      ) : (
                        <span className="px-4 py-2 bg-white dark:bg-white/[0.05] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[14px] font-[1000] text-black dark:text-white shadow-md">
                          {item.qty}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[14px] font-[900] text-slate-500 text-right whitespace-nowrap">₹{item.mrp.toLocaleString()}</td>
                  <td className="px-6 py-5 text-[15px] font-[1000] text-emerald-800 dark:text-emerald-400 text-right whitespace-nowrap">₹{item.selPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                      <div className="flex items-center justify-end w-full">
                        <div className="inline-flex items-center justify-between border border-slate-200 dark:border-white/[0.1] rounded-lg bg-slate-50 dark:bg-white/[0.02] px-2 py-1 w-[80px] focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                          <input
                            type="number"
                            value={item.selPrice > 0 ? (item.discount === 0 ? '' : ((item.discount / item.selPrice) * 100).toFixed(2).replace(/\.00$/, '')) : ''}
                            onChange={(e) => handleUpdateItemDiscountPercent(item.id, Number(e.target.value))}
                            className="w-full text-right bg-transparent border-0 p-0 focus:ring-0 focus:outline-none font-bold text-[13px] text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-slate-350 dark:placeholder-white/20"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0"
                          />
                          <span className="text-[13px] font-bold text-slate-400 dark:text-slate-500 ml-1 select-none">%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block text-[13px] font-bold text-slate-750 dark:text-slate-200 pr-[9px]">
                        {item.selPrice > 0 ? ((item.discount / item.selPrice) * 100).toFixed(2) : '0.00'}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-[14px] font-[1000] text-rose-700 text-right whitespace-nowrap">-₹{item.discount.toLocaleString()}</td>
                  <td className="px-6 py-5 text-[15px] font-[1000] text-emerald-800 dark:text-emerald-400 text-right whitespace-nowrap">₹{(item.selPrice - item.discount).toLocaleString()}</td>
                  <td className="px-6 py-5 text-[12px] font-[900] text-slate-600">{item.hsn}</td>
                  <td className="px-6 py-5 text-[12px] font-[900] text-slate-600">{item.taxDesc}</td>
                  <td className="px-6 py-5 text-[13px] font-[900] text-slate-600 text-right whitespace-nowrap">₹{item.taxAmt.toLocaleString()}</td>
                  <td className="px-6 py-5 text-[19px] font-[1000] text-indigo-950 dark:text-indigo-200 text-right whitespace-nowrap bg-indigo-100/40 dark:bg-indigo-500/10 border-l border-indigo-200/50">₹{(item.amount + (item.taxAmt || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-full mx-auto overflow-hidden bg-transparent">
      {/* Body Area: Expands to fill all space except footer */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'classic' ? renderClassicView() : (
          <div className="h-full overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-0 h-full overflow-hidden">

              {/* LEFT COLUMN: PRODUCT ENTRY */}
              <div className="w-full lg:flex-[2.5] flex flex-col gap-0 overflow-y-auto custom-scrollbar border-r border-slate-200 dark:border-white/[0.08] bg-slate-50/30 dark:bg-transparent">

                <div className="p-4 pb-0 shrink-0 flex justify-end">
                  <LayoutToggle />
                </div>

                {/* --- Header Section (Customer & Doc Info) --- */}
                <div className="px-6 py-2 shrink-0 relative z-[50]">
                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 shadow-sm backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-[12.5px] font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">Customer Details</h2>
                          <StatusBadge />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 dark:bg-white/[0.05] rounded-lg border border-slate-100 dark:border-white/[0.08] flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 stroke-[2.5px]" />
                          <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 tracking-tight">{docNo}</span>
                        </div>
                        <div className="relative flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && setShowDatePicker(prev => !prev)}
                            disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                            className={`flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight shadow-sm ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all'}`}
                          >
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{docDate ? new Date(docDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select Date'}</span>
                          </button>
                          <AnimatePresence>
                            {showDatePicker && viewMode === 'modern' && (
                              <CustomDatePickerPopover onClose={() => setShowDatePicker(false)} alignClass="absolute top-full right-0 mt-2" />
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="hidden md:block h-6 w-[1px] bg-slate-200 dark:bg-white/10 mx-1"></div>
                        <HeaderActions />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                      <div className="space-y-1 relative group col-span-1 md:col-span-3">
                        <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 stroke-[2.5px]" /> Mobile
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => handleMobileChange(e.target.value)}
                            readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
                            onFocus={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && searchResults.length > 0 && setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            placeholder="Search..."
                            className={`w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-[1000] rounded-xl px-4 py-1.5 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed bg-slate-100 dark:bg-white/[0.01]' : ''}`}
                          />
                          {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}

                          {/* Search Results Dropdown */}
                          <AnimatePresence>
                            {showResults && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar"
                              >
                                {searchResults.map((customer) => (
                                  <button
                                    key={customer.id}
                                    onClick={() => handleCustomerSelect(customer)}
                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] border-b border-slate-100 dark:border-white/[0.05] last:border-0 transition-colors flex justify-between items-center group"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-[14px] font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{customer.name}</span>
                                      <span className="text-[11px] font-bold text-slate-400">{customer.mobile}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Points</span>
                                      <span className="text-[12px] font-black text-slate-700 dark:text-white/60">{customer.loyaltyPoints}</span>
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-1 col-span-1 md:col-span-4 relative">
                        <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 stroke-[2.5px]" /> Salesman
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type name to search..."
                            value={salesmanSearch}
                            onChange={(e) => {
                              setSalesmanSearch(e.target.value);
                              if (purSalesmanId) {
                                setPurSalesmanId(null);
                              }
                              setIsSalesmanDropdownOpen(true);
                            }}
                            onFocus={() => {
                              if (formMode !== 'VIEW' && formMode !== 'LOCKED') {
                                setIsSalesmanDropdownOpen(true);
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => setIsSalesmanDropdownOpen(false), 200);
                            }}
                            readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
                            className={`w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-[1000] rounded-xl px-4 py-1.5 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed bg-slate-100 dark:bg-white/[0.01]' : ''}`}
                          />
                          <AnimatePresence>
                            {isSalesmanDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl z-[100] overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar"
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
                      </div>


                      <div className="space-y-1 col-span-1 md:col-span-5">
                        <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 stroke-[2.5px]" /> Customer Name
                        </label>
                        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-xl px-4 py-1.5 flex items-center justify-between shadow-sm min-h-[38px] w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            <span className={`text-[13px] font-[1000] truncate ${customerName ? "text-emerald-950 dark:text-emerald-300" : "text-slate-400 dark:text-white/30"}`}>
                              {customerName || 'Walk-in Customer'}
                            </span>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse flex-shrink-0"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Product Entry Section --- */}
                <div className="px-6 py-2 flex-1 flex flex-col min-h-0">
                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 shadow-sm flex-1 flex flex-col backdrop-blur-xl overflow-hidden">
                    <div className="mb-4 shrink-0 flex flex-col gap-2">
                      <div className="flex items-center gap-2 ml-1">
                        <div className="w-4 h-4 flex items-center justify-center bg-indigo-600 text-white rounded text-[8px] font-black">1</div>
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Scancode</span>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <Barcode className="h-5 w-5 text-indigo-400 dark:text-blue-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input
                          type="text"
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                          onKeyDown={handleBarcodeScan}
                          disabled={isScanningItem}
                          placeholder={isScanningItem ? "Searching..." : "Scan Barcode or Search..."}
                          className={`w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[14px] font-extrabold rounded-2xl pl-12 pr-24 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner ${isScanningItem ? 'animate-pulse' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-start overflow-hidden">
                      {lastScannedItem ? (
                        <div className="border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-white/[0.02] flex flex-col h-full animate-in fade-in duration-300">
                          <div className="bg-slate-50/50 dark:bg-white/[0.02] p-4 border-b border-slate-100 dark:border-white/[0.08] flex flex-col gap-3 shrink-0">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[8px] font-extrabold rounded-full uppercase tracking-[0.2em]">
                                  <Tag className="w-2.5 h-2.5" /> Last Scanned Product
                                </div>
                                <h3 className="text-[16px] font-extrabold text-gray-900 dark:text-white tracking-tight">{lastScannedItem.productCode}</h3>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] font-extrabold text-gray-400 dark:text-white/20 uppercase tracking-[0.25em] mb-1 block">Standard MRP</span>
                                <div className="bg-indigo-600 px-3 py-1 rounded-lg shadow-lg shadow-indigo-600/20">
                                  <p className="text-[15px] font-extrabold text-white leading-none">₹{lastScannedItem.mrp.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <div title="Product Barcode" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                                <Barcode className="w-3 h-3 text-indigo-500" /> {lastScannedItem.barcode}
                              </div>
                              <div title="Internal Source Code" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                                <Hash className="w-3 h-3 text-indigo-500" /> {lastScannedItem.sourceCode}
                              </div>
                              <div title="Product Category" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                                <Store className="w-3 h-3 text-indigo-500" /> {lastScannedItem.category}
                              </div>
                              <div title="Color & Size" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 border border-white/20"></span> {lastScannedItem.color} / {lastScannedItem.size}
                              </div>
                              <div title="HSN Code" className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg text-[10px] font-black text-emerald-600 cursor-help transition-colors hover:border-emerald-400">
                                HSN: {lastScannedItem.hsn}
                              </div>
                              <div title="Tax Description" className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-50 cursor-help transition-colors hover:border-indigo-400">
                                Tax: {lastScannedItem.taxDesc}
                              </div>
                              <div title="Product Sale Mode" className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-lg text-[10px] font-black text-amber-600 cursor-help">
                                <CheckCircle2 className="w-3 h-3" /> Indiv: {lastScannedItem.isIndividual ? 'YES' : 'NO'}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">Quantity</label>
                                <input
                                  type="number"
                                  min="1"
                                  disabled={lastScannedItem.isIndividual}
                                  value={lastScannedItem.qty}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    handleUpdateQty(lastScannedItem.id, val);
                                  }}
                                  className={`w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[15px] font-bold rounded-xl px-4 py-0 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-center transition-all shadow-inner h-[46px] ${lastScannedItem.isIndividual ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">Discount</label>
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Discount % */}
                                  <div className="relative flex items-center bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.1] rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner h-[46px]">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      placeholder="0"
                                      value={lastScannedItem.selPrice > 0 ? (lastScannedItem.discount === 0 ? '' : Number(((lastScannedItem.discount / lastScannedItem.selPrice) * 100).toFixed(2))) : ''}
                                      onChange={(e) => {
                                        const pct = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                                        const discVal = (lastScannedItem.selPrice * pct) / 100;
                                        const amount = (lastScannedItem.selPrice - discVal) * lastScannedItem.qty;
                                        const rate = lastScannedItem.taxRate || 0;
                                        const taxAmt = (amount * rate) / 100;
                                        setItems(prev => prev.map(item => item.id === lastScannedItem.id ? { ...item, discount: discVal, amount, taxAmt } : item));
                                      }}
                                      className="w-full h-full bg-transparent border-0 text-right pr-8 pl-3 p-0 font-bold text-[15px] text-slate-800 dark:text-slate-100 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-slate-350 dark:placeholder-white/20"
                                    />
                                    <span className="absolute right-3 text-[13px] font-bold text-slate-400 select-none">%</span>
                                  </div>

                                  {/* Discount ₹ */}
                                  <div className="relative flex items-center bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.1] rounded-xl focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-inner h-[46px]">
                                    <span className="absolute left-3 text-[13px] font-bold text-slate-400 select-none">₹</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max={lastScannedItem.selPrice}
                                      placeholder="0.00"
                                      value={lastScannedItem.discount || ''}
                                      onChange={(e) => {
                                        const discVal = Math.max(0, Math.min(lastScannedItem.selPrice, parseFloat(e.target.value) || 0));
                                        const amount = (lastScannedItem.selPrice - discVal) * lastScannedItem.qty;
                                        const rate = lastScannedItem.taxRate || 0;
                                        const taxAmt = (amount * rate) / 100;
                                        setItems(prev => prev.map(item => item.id === lastScannedItem.id ? { ...item, discount: discVal, amount, taxAmt } : item));
                                      }}
                                      className="w-full h-full bg-transparent border-0 text-right pr-3 pl-8 p-0 font-bold text-[15px] text-rose-600 dark:text-rose-400 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-slate-350 dark:placeholder-white/20"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">Final Price</label>
                                <div className="w-full bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[15px] font-bold rounded-xl px-4 py-0 text-center shadow-inner flex items-center justify-center h-[46px]">
                                  ₹{lastScannedItem.selPrice.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 pt-2 shrink-0">
                            <div className="w-full py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[13px] font-extrabold rounded-xl border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center gap-2 shadow-sm">
                              <CheckCircle2 className="w-4 h-4" /> Item Active in Current Sale (₹{lastScannedItem.amount.toLocaleString()})
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-slate-200 dark:border-white/[0.08] rounded-2xl p-12 text-center shadow-sm bg-white dark:bg-white/[0.02] flex flex-col items-center justify-center h-full opacity-60">
                          <Barcode className="w-16 h-16 text-slate-300 dark:text-white/20 mb-4 animate-pulse" />
                          <h3 className="text-[16px] font-black text-slate-700 dark:text-white/70 mb-1 uppercase tracking-wider">No Item Selected</h3>
                          <p className="text-[12px] font-bold text-slate-400 max-w-xs">Scan a barcode or type a product code in the input above to load live inventory details.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              {/* RIGHT COLUMN: RECEIPT (MODERN) */}
              <div className="w-full lg:flex-[1.2] bg-white dark:bg-[#0d0d0d] flex flex-col overflow-hidden relative z-10">

                {/* Pro-Header */}
                <div className="px-6 py-5 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[12px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Current Sale</h3>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-extrabold border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-widest">
                      {items.length} Items
                    </div>
                  </div>

                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search in cart..."
                      value={cartSearch}
                      onChange={(e) => setCartSearch(e.target.value)}
                      className="w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.1] rounded-xl pl-9 pr-4 py-2 text-[11px] font-semibold outline-none focus:bg-white dark:focus:bg-white/[0.05] focus:border-indigo-400 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/[0.05] flex text-[9px] font-extrabold text-gray-400 dark:text-white/20 uppercase tracking-[0.25em] shrink-0">
                  <div className="w-8">#</div>
                  <div className="flex-1">Item Description</div>
                  <div className="w-16 text-center">Qty</div>
                  <div className="w-24 text-right">Amount</div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 p-10 text-center">
                      <ShoppingCart className="w-12 h-12 mb-4" />
                      <p className="text-[12px] font-black uppercase tracking-widest leading-relaxed">No matching items found</p>
                    </div>
                  ) : (
                    filteredItems.map((item, index) => (
                      <div key={item.id} className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.03] hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors group relative flex items-center gap-3">
                        <div className="w-8 text-[11px] font-bold text-slate-300 dark:text-white/10">{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-tight truncate">{item.productCode}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold text-indigo-500/70 uppercase tracking-wider">{item.barcode}</span>
                            <span className="text-[9px] font-semibold text-slate-400 uppercase">{item.size}/{item.color}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold text-slate-300 dark:text-white/20 line-through">₹{item.mrp.toLocaleString()}</span>
                            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">₹{item.selPrice.toLocaleString()} / unit</span>
                          </div>
                        </div>
                        <div className="w-16 text-center">
                          <div className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-white/[0.05] rounded-lg text-[12px] font-black text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/[0.05]">
                            {item.qty}
                          </div>
                        </div>
                        <div className="w-24 text-right flex flex-col items-end">
                          <p className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-none">₹{item.amount.toLocaleString()}</p>
                        </div>
                        {formMode !== 'VIEW' && formMode !== 'LOCKED' && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                            <button onClick={() => handleRemoveItem(item.id)} className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-[#080808] border-t border-slate-200 dark:border-white/[0.1] shrink-0">
                  <AnimatePresence>
                    {isDetailsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-3 border-b border-slate-100 dark:border-white/5">
                          <div className="flex justify-between items-center text-[12px] font-bold text-gray-500 dark:text-white/40">
                            <span>Subtotal (Excl. Tax)</span>
                            <span className="text-gray-900 dark:text-white font-black">₹{subtotalExclTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="bg-slate-100/50 dark:bg-white/[0.02] p-3 rounded-xl space-y-2">
                            {cgstAmount > 0 && (
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>CGST</span>
                                <span>₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            )}
                            {sgstAmount > 0 && (
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>SGST</span>
                                <span>₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            )}
                            {igstAmount > 0 && (
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>IGST</span>
                                <span>₹{igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            )}
                            {cgstAmount === 0 && sgstAmount === 0 && igstAmount === 0 && (
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>GST 0%</span>
                                <span>₹0.00</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-4 pt-0">
                    {/* Compact Summary Row */}
                    <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 mb-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty</span>
                        <span className="text-[14px] font-black text-slate-700 dark:text-white/80">{totalQty.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross</span>
                        <span className="text-[14px] font-black text-slate-700 dark:text-white/80">₹{grossAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-right">Savings</span>
                        <span className="text-[14px] font-black text-rose-600 dark:text-rose-400 text-right">-₹{totalDiscount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest text-right">Tax</span>
                        <span className="text-[14px] font-black text-indigo-650 dark:text-indigo-400 text-right">₹{totalTaxAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em]">Net Payable</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[16px] font-black text-emerald-600 dark:text-emerald-400">₹</span>
                          <span className="text-[36px] font-[1000] text-emerald-600 dark:text-emerald-400 leading-none tracking-tighter">{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {(formMode === 'NEW' || formMode === 'EDIT') && (
                          <>
                            <div className="flex flex-col w-[85px] -mt-1">
                              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-center flex items-center gap-1 justify-center">
                                <Tag className="w-3.5 h-3.5 text-rose-500" /> Bulk %
                              </span>
                              <div className="relative mt-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="0"
                                  value={globalDiscountPercent || ''}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    handleApplyGlobalDiscountPercent(isNaN(val) ? 0 : val);
                                  }}
                                  disabled={false}
                                  className="w-full pl-2 pr-6 py-1 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[14px] font-[1000] text-center text-rose-600 dark:text-rose-400 focus:outline-none focus:border-rose-500 transition-all h-8 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-[1000] text-slate-400 pointer-events-none">%</span>
                              </div>
                            </div>
                            <div className="flex flex-col w-[90px] -mt-1">
                              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-center flex items-center gap-1 justify-center">
                                <Tag className="w-3.5 h-3.5 text-rose-500" /> Bulk Amt
                              </span>
                              <div className="relative mt-1">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={globalDiscountAmount || ''}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    handleApplyGlobalDiscountAmount(isNaN(val) ? 0 : val);
                                  }}
                                  disabled={false}
                                  className="w-full pl-5 pr-2 py-1 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[14px] font-[1000] text-center text-rose-600 dark:text-rose-400 focus:outline-none focus:border-rose-500 transition-all h-8 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-[1000] text-slate-400 pointer-events-none">₹</span>
                              </div>
                            </div>
                          </>
                        )}
                        <button
                          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                          className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all h-8 flex items-center justify-center"
                        >
                          {isDetailsOpen ? 'Hide' : 'Details'}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleNewSale} className="flex-1 py-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/10 rounded-xl font-black text-[12px] flex items-center justify-center gap-2 transition-all">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        onClick={handleCompleteSale}
                        disabled={formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving}
                        className={`flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-[1000] text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 ${formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}`}
                      >
                        <CheckCircle2 className="w-4 h-4" /> {isSaving ? 'Completing...' : 'Complete Sale'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {viewMode === 'classic' && TotalsFooter()}

      {/* --- SALES REGISTER / HISTORY MODAL (F3) --- */}
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

      {/* Notification Modal */}
      <AnimatePresence>
        {popup.isOpen && (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesEntry;
