import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3, Trash2, X, Check, AlertCircle, RefreshCw,
  Users, Search, Phone, Mail, MapPin, FileText,
  ChevronDown, ChevronUp, UserPlus, Filter,
  Calendar, Shield, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useCustomerLogic, GST_TYPES, GENDER_OPTIONS } from './useCustomerLogic';
import type { CustomerDto } from './useCustomerLogic';

// ─── Shared Styles ────────────────────────────────────────────────────────────

const inputClass = (hasError?: boolean) =>
  `w-full bg-slate-50 dark:bg-white/[0.03] border-2 ${hasError ? 'border-rose-300 dark:border-rose-500/40' : 'border-slate-100 dark:border-white/[0.1]'} text-gray-900 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner placeholder:text-slate-300 dark:placeholder:text-white/15`;

// ─── Small Reusable Sub-Components ────────────────────────────────────────────

const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 mt-2">
    {icon}
    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/30">{label}</span>
    <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.04]" />
  </div>
);

const DetailRow = ({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-[10px] font-bold text-slate-400 dark:text-white/25 uppercase tracking-wide shrink-0 mt-0.5">{label}</span>
    <span className={`text-[12px] font-extrabold text-right ${highlight
      ? 'text-blue-600 dark:text-blue-400 font-mono tracking-wider'
      : 'text-slate-700 dark:text-white/70'
      }`}>
      {value || '—'}
    </span>
  </div>
);

const FormField = ({ label, children, error, span = 1 }: { label: string; children: React.ReactNode; error?: string; span?: number }) => (
  <div className={`space-y-1.5 ${span === 2 ? 'col-span-1 md:col-span-2' : span === 3 ? 'col-span-1 md:col-span-3' : ''}`}>
    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-white/30 ml-1">{label}</label>
    {children}
    {error && (
      <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1 ml-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CustomerMaster: React.FC = () => {
  const logic = useCustomerLogic();

  return (
    <div className="p-8 flex-1 min-h-0 overflow-hidden flex flex-col gap-6 bg-transparent">

      {/* ── Toast Notification ──────────────────────────────────────── */}
      <AnimatePresence>
        {logic.notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border ${logic.notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}
          >
            {logic.notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-[13px] font-black">{logic.notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header Card ──────────────────────────────────────────────── */}
      <HeaderCard logic={logic} />

      {/* ── Customer List ────────────────────────────────────────────── */}
      <CustomerList logic={logic} />

      {/* ── Create / Edit Modal ──────────────────────────────────────── */}
      <CustomerFormModal logic={logic} />
    </div>
  );
};

// ─── Header Card ──────────────────────────────────────────────────────────────

const HeaderCard = ({ logic }: { logic: ReturnType<typeof useCustomerLogic> }) => (
  <div className="relative bg-white dark:bg-[#0f0f12] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col">
    <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

    {/* Top Row: Title, Stats & New Button */}
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-6 pt-5 pb-3 border-b border-slate-100 dark:border-white/[0.04]">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
              <Users className="w-5 h-5 stroke-[2.5px]" />
            </div>
          </div>
          <div>
            <h1 className="text-[17px] font-[1000] tracking-tight text-slate-900 dark:text-white leading-none">Customer Master</h1>
            <p className="text-[12px] font-medium text-slate-500 dark:text-white/40 mt-1">Manage customer profiles, contact details &amp; GST information</p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-lg text-slate-600 dark:text-white/50">
            Total: <strong className="text-slate-800 dark:text-white">{logic.stats.total}</strong>
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/20 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400">
            Active: <strong className="text-emerald-800 dark:text-emerald-300">{logic.stats.active}</strong>
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 dark:bg-blue-500/10 border border-blue-200/20 dark:border-blue-500/20 rounded-lg text-blue-700 dark:text-blue-400">
            GST: <strong className="text-blue-800 dark:text-blue-300">{logic.stats.withGST}</strong>
          </span>
        </div>
      </div>

      <button
        onClick={logic.handleOpenCreate}
        id="btn-new-customer"
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-[900] text-[13px] shadow-lg shadow-cyan-500/30 transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap self-start sm:self-auto"
      >
        <UserPlus className="w-4 h-4" /> New Customer
      </button>
    </div>

    {/* Bottom Row: Search & Filter Controls */}
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 py-3 bg-slate-50/30 dark:bg-white/[0.01]">
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
        <input
          type="text"
          id="customer-search"
          placeholder="Search by name, code, mobile, email, GST..."
          value={logic.searchQuery}
          onChange={(e) => logic.setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-[13px] font-semibold rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-white"
        />
        {logic.searchQuery && (
          <button
            onClick={() => logic.setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px] font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter & Sort */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={() => logic.setShowInactive(p => !p)}
          className={`px-3 py-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl border transition-all shadow-sm ${logic.showInactive
            ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
            : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-white/50 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
        >
          <Filter className="w-3.5 h-3.5" />
          {logic.showInactive ? 'Showing All' : 'Active Only'}
        </button>

        {(['customerName', 'customerCode'] as const).map(field => (
          <button
            key={field}
            onClick={() => logic.toggleSort(field)}
            className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all shadow-sm flex items-center gap-1 ${logic.sortField === field
              ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400'
              : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-white/50 hover:text-blue-600'
              }`}
          >
            {field === 'customerName' ? 'Name' : 'Code'}
            {logic.sortField === field && (logic.sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const CustomerList = ({ logic }: { logic: ReturnType<typeof useCustomerLogic> }) => {
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!observerTarget.current || !logic.hasMore || logic.isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          logic.loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [logic.hasMore, logic.isLoading, logic.loadMore]);

  return (
    <div className="flex-1 bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-0">
      {logic.filteredCustomers.length === 0 && logic.isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 opacity-60">
          <RefreshCw className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
          <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">Loading customers...</p>
        </div>
      ) : logic.error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
          <h3 className="text-[16px] font-black text-slate-700 dark:text-white/80 uppercase tracking-wider">Error Loading Data</h3>
          <p className="text-[12px] font-bold text-slate-400 max-w-sm mt-1">{logic.error}</p>
          <button onClick={() => logic.fetchCustomers(1, false)} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-[12px] rounded-xl">Retry</button>
        </div>
      ) : logic.filteredCustomers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
          <Users className="w-16 h-16 text-slate-300 dark:text-white/10 mb-4" />
          <h3 className="text-[16px] font-black text-slate-700 dark:text-white/70 uppercase tracking-wider">
            {logic.customers.length === 0 ? 'No Customers Yet' : 'No Matching Customers'}
          </h3>
          <p className="text-[12px] font-bold text-slate-400 max-w-xs mt-1">
            {logic.customers.length === 0
              ? 'Create your first customer to get started.'
              : `No customers match your search: "${logic.searchQuery}"`}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-2.5">
          {logic.filteredCustomers.map((c) => (
            <CustomerCard key={c.customerId} customer={c} logic={logic} />
          ))}

          {logic.hasMore && (
            <div ref={observerTarget} className="flex justify-center p-4">
              <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CustomerCard = ({ customer: c, logic }: { customer: CustomerDto; logic: ReturnType<typeof useCustomerLogic> }) => {
  const isExpanded = logic.expandedId === c.customerId;

  return (
    <div
      className={`flex flex-col shrink-0 rounded-2xl border overflow-hidden transition-all duration-350 bg-white dark:bg-[#0f0f12] ${c.customerDeActive
        ? 'border-slate-200 dark:border-white/[0.05] opacity-50'
        : isExpanded
          ? 'border-cyan-300 dark:border-cyan-500/30 shadow-lg shadow-cyan-500/[0.05]'
          : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] hover:shadow-md'
        }`}
    >
      {/* Card Header */}
      <div
        onClick={() => logic.setExpandedId(isExpanded ? null : c.customerId)}
        className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 md:h-[72px] overflow-visible cursor-pointer select-none bg-slate-50/40 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        {/* Left: Avatar + Name + Status */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${logic.getAvatarColor(c.customerName)} flex items-center justify-center text-white text-[13px] font-[1000] shadow-sm flex-shrink-0`}>
            {logic.getInitials(c.customerName)}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-[900] text-slate-800 dark:text-white truncate">{c.customerName}</span>
              {c.customerCode && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.05] text-[9px] font-black text-slate-500 dark:text-white/40 border border-slate-200/50 dark:border-white/[0.06] shrink-0">
                  {c.customerCode}
                </span>
              )}
              {c.customerDeActive ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20 shrink-0">
                  Inactive
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 shrink-0">
                  Active
                </span>
              )}
            </div>
            {c.customerNickName && (
              <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 truncate mt-0.5">
                aka {c.customerNickName}
              </span>
            )}
          </div>
        </div>

        {/* Middle: Quick Info Chips */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {c.customerMobileNo && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-white/40">
              <Phone className="w-3.5 h-3.5 text-cyan-500" />
              <span>{c.customerMobileNo}</span>
            </div>
          )}
          {c.customerEmailID && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-white/40">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span className="truncate max-w-[160px]">{c.customerEmailID}</span>
            </div>
          )}
          {c.customerGstNo && (
            <div className="hidden xl:flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[9px] border border-blue-100 dark:border-blue-500/10">
                GST
              </span>
            </div>
          )}
          {c.customerLocation && (
            <div className="hidden xl:flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-white/30">
              <MapPin className="w-3 h-3 text-violet-500" />
              <span className="truncate max-w-[100px]">{c.customerLocation}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => logic.handleOpenEdit(c)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/15 text-slate-500 dark:text-white/50 hover:text-cyan-700 dark:hover:text-cyan-300 rounded-lg transition-all text-[11px] font-black border border-slate-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-500/30 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
          {!c.customerDeActive && (
            <button
              onClick={() => logic.handleDeactivate(c.customerId)}
              className="p-1.5 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all border border-slate-200 dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-500/20 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => logic.setExpandedId(isExpanded ? null : c.customerId)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all ml-1"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-350 ${isExpanded ? 'rotate-180 text-cyan-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Detail Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-150 dark:border-white/[0.04]">
              <div className="p-5 bg-slate-50/30 dark:bg-[#121216]/20 grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Contact Info */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#121215] border border-slate-100 dark:border-white/[0.04] flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">Contact Information</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <DetailRow label="Mobile" value={c.customerMobileNo} />
                    <DetailRow label="Alt. Mobile" value={c.customerMobileNo2} />
                    <DetailRow label="Email" value={c.customerEmailID} />
                    <DetailRow label="Gender" value={c.customerGender} />
                  </div>
                </div>

                {/* Address */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#121215] border border-slate-100 dark:border-white/[0.04] flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">Address</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <DetailRow label="Address 1" value={c.customerAddress1} />
                    <DetailRow label="Address 2" value={c.customerAddress2} />
                    <DetailRow label="Address 3" value={c.customerAddress3} />
                    <DetailRow label="Pincode" value={c.customerPincode} />
                    <DetailRow label="Location" value={c.customerLocation} />
                  </div>
                </div>

                {/* Tax & Dates */}
                <div className="p-4 rounded-xl bg-white dark:bg-[#121215] border border-slate-100 dark:border-white/[0.04] flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">Tax & Important Dates</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <DetailRow label="GSTIN" value={c.customerGstNo} highlight />
                    <DetailRow label="PAN" value={c.customerPanNo} highlight />
                    <DetailRow label="GST Type" value={GST_TYPES.find(g => g.value === c.customerGstType)?.label} />
                    <DetailRow label="Birthday" value={logic.formatDate(c.customerBirthDate)} />
                    <DetailRow label="Anniversary" value={logic.formatDate(c.customerAnnDate)} />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {c.customerRemarks && (
                <div className="px-5 pb-4 -mt-1">
                  <div className="px-4 py-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/[0.03] border border-amber-200/30 dark:border-amber-500/10 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-slate-600 dark:text-white/50">{c.customerRemarks}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Create / Edit Modal ──────────────────────────────────────────────────────


const CustomerFormModal = ({ logic }: { logic: ReturnType<typeof useCustomerLogic> }) => (
  <AnimatePresence>
    {logic.isModalOpen && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => logic.setIsModalOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                {logic.editingId ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              </div>
              <h3 className="text-[18px] font-[1000] text-slate-800 dark:text-white">
                {logic.editingId ? 'Edit Customer' : 'New Customer'}
              </h3>
            </div>
            <button
              onClick={() => logic.setIsModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={logic.handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 p-6 min-h-0">

            {/* Section: Basic Info */}
            <SectionLabel icon={<Users className="w-4 h-4 text-cyan-500" />} label="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Customer Name *" error={logic.formErrors.customerName} span={2}>
                <input
                  ref={logic.nameInputRef}
                  type="text"
                  id="input-customer-name"
                  value={logic.form.customerName}
                  onChange={(e) => logic.setField('customerName', e.target.value)}
                  placeholder="Full name of the customer"
                  className={inputClass(!!logic.formErrors.customerName)}
                />
              </FormField>
              <FormField label="Customer Code">
                <input
                  type="text"
                  id="input-customer-code"
                  value={logic.form.customerCode}
                  onChange={(e) => logic.setField('customerCode', e.target.value)}
                  placeholder="e.g. CUST001"
                  className={inputClass()}
                />
              </FormField>
              <FormField label="Nick Name">
                <input
                  type="text"
                  value={logic.form.customerNickName}
                  onChange={(e) => logic.setField('customerNickName', e.target.value)}
                  placeholder="Short name / alias"
                  className={inputClass()}
                />
              </FormField>
              <FormField label="Gender">
                <select
                  value={logic.form.customerGender}
                  onChange={(e) => logic.setField('customerGender', e.target.value)}
                  className={inputClass()}
                >
                  <option value="">— Select —</option>
                  {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormField>
              <FormField label="Deactivated">
                <div className="flex items-center gap-3 h-[42px]">
                  <button
                    type="button"
                    onClick={() => logic.setField('customerDeActive', !logic.form.customerDeActive)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-black transition-all ${logic.form.customerDeActive
                      ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      }`}
                  >
                    {logic.form.customerDeActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {logic.form.customerDeActive ? 'Deactivated' : 'Active'}
                  </button>
                </div>
              </FormField>
            </div>

            {/* Section: Contact */}
            <SectionLabel icon={<Phone className="w-4 h-4 text-emerald-500" />} label="Contact Details" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Mobile Number" error={logic.formErrors.customerMobileNo}>
                <input
                  type="text"
                  id="input-customer-mobile"
                  value={logic.form.customerMobileNo}
                  onChange={(e) => logic.setField('customerMobileNo', e.target.value)}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className={inputClass(!!logic.formErrors.customerMobileNo)}
                />
              </FormField>
              <FormField label="Alt. Mobile" error={logic.formErrors.customerMobileNo2}>
                <input
                  type="text"
                  value={logic.form.customerMobileNo2}
                  onChange={(e) => logic.setField('customerMobileNo2', e.target.value)}
                  placeholder="Secondary number"
                  maxLength={10}
                  className={inputClass(!!logic.formErrors.customerMobileNo2)}
                />
              </FormField>
              <FormField label="Email" error={logic.formErrors.customerEmailID}>
                <input
                  type="email"
                  id="input-customer-email"
                  value={logic.form.customerEmailID}
                  onChange={(e) => logic.setField('customerEmailID', e.target.value)}
                  placeholder="email@example.com"
                  className={inputClass(!!logic.formErrors.customerEmailID)}
                />
              </FormField>
            </div>

            {/* Section: Address */}
            <SectionLabel icon={<MapPin className="w-4 h-4 text-violet-500" />} label="Address" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Address Line 1" span={2}>
                <input
                  type="text"
                  value={logic.form.customerAddress1}
                  onChange={(e) => logic.setField('customerAddress1', e.target.value)}
                  placeholder="Street address"
                  className={inputClass()}
                />
              </FormField>
              <FormField label="Location">
                <input
                  type="text"
                  value={logic.form.customerLocation}
                  onChange={(e) => logic.setField('customerLocation', e.target.value)}
                  placeholder="Area / Locality"
                  className={inputClass()}
                />
              </FormField>
              <FormField label="Address Line 2">
                <input
                  type="text"
                  value={logic.form.customerAddress2}
                  onChange={(e) => logic.setField('customerAddress2', e.target.value)}
                  placeholder="Landmark, Building..."
                  className={inputClass()}
                />
              </FormField>
              <FormField label="Address Line 3">
                <input
                  type="text"
                  value={logic.form.customerAddress3}
                  onChange={(e) => logic.setField('customerAddress3', e.target.value)}
                  placeholder="City, State..."
                  className={inputClass()}
                />
              </FormField>
              <FormField label="Pincode" error={logic.formErrors.customerPincode}>
                <input
                  type="text"
                  value={logic.form.customerPincode}
                  onChange={(e) => logic.setField('customerPincode', e.target.value)}
                  placeholder="6-digit"
                  maxLength={6}
                  className={inputClass(!!logic.formErrors.customerPincode)}
                />
              </FormField>
            </div>

            {/* Section: Tax Details */}
            <SectionLabel icon={<Shield className="w-4 h-4 text-blue-500" />} label="Tax & Compliance" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="GSTIN" error={logic.formErrors.customerGstNo}>
                <input
                  type="text"
                  id="input-customer-gst"
                  value={logic.form.customerGstNo}
                  onChange={(e) => logic.setField('customerGstNo', e.target.value.toUpperCase())}
                  placeholder="15-character GSTIN"
                  maxLength={15}
                  className={`${inputClass(!!logic.formErrors.customerGstNo)} uppercase`}
                />
              </FormField>
              <FormField label="PAN Number" error={logic.formErrors.customerPanNo}>
                <input
                  type="text"
                  value={logic.form.customerPanNo}
                  onChange={(e) => logic.setField('customerPanNo', e.target.value.toUpperCase())}
                  placeholder="10-character PAN"
                  maxLength={10}
                  className={`${inputClass(!!logic.formErrors.customerPanNo)} uppercase`}
                />
              </FormField>
              <FormField label="GST Type">
                <select
                  value={logic.form.customerGstType ?? ''}
                  onChange={(e) => logic.setField('customerGstType', e.target.value === '' ? null : parseInt(e.target.value))}
                  className={inputClass()}
                >
                  <option value="">— Select —</option>
                  {GST_TYPES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </FormField>
            </div>

            {/* Section: Important Dates */}
            <SectionLabel icon={<Calendar className="w-4 h-4 text-amber-500" />} label="Important Dates" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Birth Date">
                <input
                  type="date"
                  value={logic.form.customerBirthDate || ''}
                  onChange={(e) => logic.setField('customerBirthDate', e.target.value || null)}
                  className={inputClass()}
                />
              </FormField>
              <FormField label="Anniversary Date">
                <input
                  type="date"
                  value={logic.form.customerAnnDate || ''}
                  onChange={(e) => logic.setField('customerAnnDate', e.target.value || null)}
                  className={inputClass()}
                />
              </FormField>
            </div>

            {/* Section: Remarks */}
            <SectionLabel icon={<FileText className="w-4 h-4 text-slate-400" />} label="Remarks" />
            <div>
              <textarea
                value={logic.form.customerRemarks}
                onChange={(e) => logic.setField('customerRemarks', e.target.value)}
                placeholder="Additional notes about this customer..."
                rows={3}
                className={`${inputClass()} resize-none`}
              />
            </div>

            {/* Submit Block */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/5 shrink-0 sticky bottom-0 bg-white dark:bg-[#121212] pb-1">
              <button
                type="button"
                onClick={() => logic.setIsModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-[12px] hover:bg-slate-200 transition-all text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={logic.isSaving}
                className="flex-[2] py-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-black text-[12px] flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logic.isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {logic.isSaving ? 'Saving...' : (logic.editingId ? 'Update Customer' : 'Create Customer')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default CustomerMaster;
