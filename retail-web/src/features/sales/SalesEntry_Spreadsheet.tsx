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
  Edit,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  FolderOpen,
  FilePlus,
  Tag
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
    savedInvoicesList,
    items,
    totalQty,
    grossAmount,
    totalDiscount,
    netPayable,
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
    isSaving,
    cgstAmount,
    sgstAmount,
    igstAmount
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

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-[1920px] mx-auto">

      {/* 1. Header Section (Customer & Doc Info) */}
      <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-t-2xl p-5 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Sales Entry (Classic View)</h1>
                <StatusBadge />
              </div>
              <p className="text-[13px] font-medium text-gray-500 dark:text-[#8F94A3]">Create new POS transaction in classic spreadsheet layout</p>
            </div>
          </div>
          <HeaderActions />
        </div>

        {/* Flex Wrapping Input Row */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-3 shadow-inner">
          
          {/* Doc No */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Doc No.
            </span>
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-white/[0.05] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-slate-900 dark:text-white shadow-sm flex items-center gap-2 min-h-[38px]">
              <span className="text-indigo-600 dark:text-indigo-400">#</span>
              <span>{docNo}</span>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-1 min-w-[140px] relative">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Date
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && setShowDatePicker(prev => !prev)}
                disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
                className={`w-full px-3 py-1.5 bg-white dark:bg-white/[0.05] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-slate-900 dark:text-white shadow-sm outline-none flex items-center justify-between gap-2 focus:border-indigo-500 min-h-[38px] ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10'}`}
              >
                <span>{docDate ? new Date(docDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Select Date'}</span>
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </button>
              <AnimatePresence>
                {showDatePicker && (
                  <CustomDatePickerPopover onClose={() => setShowDatePicker(false)} alignClass="absolute top-full left-0 mt-2" />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Customer Mobile Search */}
          <div className="flex-1 flex flex-col gap-1 min-w-[200px] relative">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Customer Mobile
            </span>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search mobile number..."
                value={mobileNumber}
                onChange={(e) => handleMobileChange(e.target.value)}
                readOnly={formMode === 'VIEW' || formMode === 'LOCKED'}
                onFocus={() => formMode !== 'VIEW' && formMode !== 'LOCKED' && searchResults.length > 0 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className={`w-full px-4 py-1.5 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-black dark:text-white focus:border-indigo-600 dark:focus:border-indigo-400 transition-all shadow-inner outline-none placeholder-slate-300 min-h-[38px] ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed bg-slate-50 dark:bg-white/[0.01]' : ''}`}
              />
              <button disabled={formMode === 'VIEW' || formMode === 'LOCKED'} className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-700 ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Search className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {showResults && (
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Customer Name */}
          <div className="flex-[0.8] flex flex-col gap-1 min-w-[180px]">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Customer Name
            </span>
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

          {/* Salesman */}
          <div className="flex-[1.2] flex flex-col gap-1 min-w-[280px] relative">
            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider ml-1 flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5px]" /> Salesman
            </span>
            <div className="relative group">
              <input
                type="text"
                placeholder="Type salesman name to search..."
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
                className={`w-full px-4 py-1.5 bg-white dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-[1000] text-black dark:text-white focus:border-indigo-600 dark:focus:border-indigo-400 transition-all shadow-inner outline-none placeholder-slate-300 min-h-[38px] ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-70 cursor-not-allowed bg-slate-50 dark:bg-white/[0.01]' : ''}`}
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
          </div>


        </div>

        {/* Scanning Command Bar */}
        <div className="bg-white dark:bg-white/[0.03] border-2 border-indigo-100 dark:border-white/[0.08] rounded-2xl p-2 flex items-center gap-4 shadow-lg shadow-indigo-500/5 mt-4">
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

      {/* 2. Main Data Grid (Transaction Details) */}
      <div className="flex-1 bg-white dark:bg-[#0B0C12] border-x border-gray-200 dark:border-white/[0.05] overflow-hidden flex flex-col relative z-0 shadow-sm">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1800px] border-spacing-0">
            <thead className="sticky top-0 z-10 shadow-[0_8px_30px_rgb(79,70,229,0.15)]">
              <tr>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">#</th>
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
                <th className="px-4 py-3 text-[11px] font-[1000] text-rose-200 uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Disc.</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-emerald-100 uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Rate</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">HSN</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Tax Desc</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-indigo-100 uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Tax Amt</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Qty</th>
                <th className="px-4 py-3 text-[11px] font-[1000] text-white uppercase tracking-wider text-right bg-indigo-600 dark:bg-indigo-900 border-r border-indigo-500/30">Net Amount</th>
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
                  <td className="px-4 py-2.5 text-[13px] font-bold text-slate-900 dark:text-slate-100 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{item.selPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 border-r border-slate-100 dark:border-white/[0.03] text-right">
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
                  <td className="px-4 py-2.5 text-[13px] font-bold text-rose-600 dark:text-rose-400 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{item.discount.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-[13px] font-bold text-slate-900 dark:text-slate-100 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{(item.selPrice - item.discount).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.hsn}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-white/[0.03]">{item.taxDesc}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{item.taxAmt.toFixed(2)}</td>
                  <td className="px-4 py-2 border-r border-slate-100 dark:border-white/[0.03] text-right">
                    {formMode !== 'VIEW' && formMode !== 'LOCKED' ? (
                      <div className="flex items-center justify-end w-full">
                        <input
                          type="number"
                          value={item.qty === 0 ? '' : item.qty}
                          disabled={item.isIndividual}
                          onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
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
                  <td className="px-4 py-2.5 text-[14px] font-bold text-indigo-600 dark:text-indigo-400 text-right border-r border-slate-100 dark:border-white/[0.03]">₹{(item.amount + (item.taxAmt || 0)).toFixed(2)}</td>
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
      <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-b-2xl p-5 shadow-[0_-4px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="flex items-center justify-between">

          {/* Summary Calculations */}
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
                    <Tag className="w-3 h-3 text-rose-500" /> Bulk %
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
                    <Tag className="w-3 h-3 text-rose-500" /> Bulk Amt
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleNewSale}
              className="px-6 py-3 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-black hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all flex items-center gap-2 text-slate-600 dark:text-white/60 whitespace-nowrap"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleCompleteSale}
              disabled={formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving}
              className={`px-10 py-3 bg-indigo-600 text-white rounded-xl text-[14px] font-[1000] shadow-xl shadow-indigo-600/30 hover:-translate-y-1 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all flex items-center gap-2.5 whitespace-nowrap ${formMode === 'VIEW' || formMode === 'LOCKED' || items.length === 0 || isSaving ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}
            >
              <CheckCircle2 className="w-5 h-5" /> {isSaving ? 'Completing...' : 'Complete Sale'}
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
    </div>
  );
};

export default SalesEntry;
