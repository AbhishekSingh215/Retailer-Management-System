import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Clipboard, Check, AlertCircle, RefreshCw, Layers, Info, Tag, ChevronDown, Search } from 'lucide-react';
import { API_BASE_URL } from '../../config/apiConfig';

interface TaxRateData {
  taxId: number;
  taxDescription: string;
  taxDeactive: boolean;
  taxRate: number;
  taxCgst: number;
  taxSgst: number;
  taxIgst: number;
  taxUgst: number;
  taxType: number;
}

interface HsnDetailDto {
  hsdId: number;
  hsdSlabAmount: number;
  hsdLowerSlabTax1: number;
  hsdLowerSlabTax2: number;
  hsdSlabTax1: number;
  hsdSlabTax2: number;
  hsdWefDate?: string;
  isDeactive: boolean;
}

interface HsnData {
  hsnId: number;
  hsnCode: string;
  hsnDescription: string;
  hsnDeactive: boolean;
  hsnWefDate?: string;
  hsnWefToDate?: string;
  slabs: HsnDetailDto[];
}

const HsnMaster: React.FC = () => {
  const [hsnList, setHsnList] = useState<HsnData[]>([]);
  const [taxes, setTaxes] = useState<TaxRateData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [hsnCode, setHsnCode] = useState('');
  const [hsnDescription, setHsnDescription] = useState('');
  const [hsnDeactive, setHsnDeactive] = useState(false);
  const [hsnWefDate, setHsnWefDate] = useState('');
  const [hsnWefToDate, setHsnWefToDate] = useState('');
  const [slabs, setSlabs] = useState<HsnDetailDto[]>([]);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Accordion State
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  const toggleExpand = (hsnId: number) => {
    setExpandedIds(prev => ({
      ...prev,
      [hsnId]: !prev[hsnId]
    }));
  };

  const isAnyExpanded = Object.values(expandedIds).some(v => v);

  const toggleAll = () => {
    if (isAnyExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<number, boolean> = {};
      hsnList.forEach(h => {
        next[h.hsnId] = true;
      });
      setExpandedIds(next);
    }
  };

  const fetchHsnList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/Hsn`);
      if (!res.ok) throw new Error("Failed to load HSN records.");
      const data = await res.json();
      setHsnList(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTaxes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/TaxMaster`);
      if (res.ok) {
        const data = await res.json();
        setTaxes(data.filter((t: any) => !t.taxDeactive));
      }
    } catch (err) {
      console.error("Failed to load tax rate dropdown profiles:", err);
    }
  };

  useEffect(() => {
    fetchHsnList();
    fetchTaxes();
  }, []);

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, message: msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setHsnCode('');
    setHsnDescription('');
    setHsnDeactive(false);
    setHsnWefDate(new Date().toISOString().split('T')[0]);
    setHsnWefToDate('');
    setSlabs([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h: HsnData) => {
    setEditingId(h.hsnId);
    setHsnCode(h.hsnCode || '');
    setHsnDescription(h.hsnDescription || '');
    setHsnDeactive(h.hsnDeactive || false);
    setHsnWefDate(h.hsnWefDate ? h.hsnWefDate.split('T')[0] : '');
    setHsnWefToDate(h.hsnWefToDate ? h.hsnWefToDate.split('T')[0] : '');
    setSlabs(h.slabs.map(s => ({
      ...s,
      hsdWefDate: s.hsdWefDate ? s.hsdWefDate.split('T')[0] : undefined
    })));
    setIsModalOpen(true);
  };

  const handleAddSlab = () => {
    const newSlab: HsnDetailDto = {
      hsdId: 0,
      hsdSlabAmount: 0,
      hsdLowerSlabTax1: 0,
      hsdLowerSlabTax2: 0,
      hsdSlabTax1: taxes[0]?.taxId || 0,
      hsdSlabTax2: taxes[0]?.taxId || 0,
      isDeactive: false
    };
    setSlabs([...slabs, newSlab]);
  };

  const handleRemoveSlab = (idx: number) => {
    setSlabs(slabs.filter((_, i) => i !== idx));
  };

  const handleSlabChange = (idx: number, field: keyof HsnDetailDto, val: any) => {
    setSlabs(slabs.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hsnCode.trim() || !hsnDescription.trim()) {
      showNotification('error', 'HSN Code and Description are required');
      return;
    }

    const payload = {
      hsnId: editingId || 0,
      hsnCode,
      hsnDescription,
      hsnDeactive,
      hsnWefDate: hsnWefDate ? new Date(hsnWefDate).toISOString() : null,
      hsnWefToDate: hsnWefToDate ? new Date(hsnWefToDate).toISOString() : null,
      slabs: slabs.map(s => ({
        ...s,
        hsdWefDate: s.hsdWefDate ? new Date(s.hsdWefDate).toISOString() : null
      }))
    };

    try {
      const url = editingId ? `${API_BASE_URL}/Hsn/${editingId}` : `${API_BASE_URL}/Hsn`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Server rejected HSN data.");

      showNotification('success', editingId ? 'HSN code updated!' : 'HSN code created!');
      setIsModalOpen(false);
      fetchHsnList();
    } catch (err: any) {
      showNotification('error', err.message || 'Operation failed.');
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!window.confirm("Are you sure you want to deactivate this HSN code?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/Hsn/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to deactivate HSN.");
      showNotification('success', 'HSN code deactivated.');
      fetchHsnList();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };


  const filteredHsnList = hsnList.filter(h => {

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (h.hsnCode || '').toLowerCase().includes(q) ||
      (h.hsnDescription || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 flex-1 min-h-0 overflow-hidden flex flex-col gap-6 bg-transparent">

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border ${notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}
          >
            {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-[13px] font-black">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header Card ──────────────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-[#0f0f12] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />
        
        {/* Top Row: Title, Stats & New HSN Button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-6 pt-5 pb-3 border-b border-slate-100 dark:border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-violet-500/30">
                  <Clipboard className="w-5 h-5 stroke-[2.5px]" />
                </div>
              </div>
              <div>
                <h1 className="text-[17px] font-[1000] tracking-tight text-slate-900 dark:text-white leading-none">HSN Master</h1>
                <p className="text-[12px] font-medium text-slate-500 dark:text-white/40 mt-1">Product HSN codes, tax classifications &amp; slab thresholds</p>
              </div>
            </div>

            {/* Stats badges inside title block */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-lg text-slate-600 dark:text-white/50">
                Total: <strong className="text-slate-800 dark:text-white">{hsnList.length}</strong>
              </span>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/20 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400">
                Active: <strong className="text-emerald-800 dark:text-emerald-300">{hsnList.filter(h => !h.hsnDeactive).length}</strong>
              </span>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-violet-50 dark:bg-violet-500/10 border border-violet-200/20 dark:border-violet-500/20 rounded-lg text-violet-700 dark:text-violet-400">
                Slabs: <strong className="text-violet-800 dark:text-violet-300">{hsnList.reduce((a, h) => a + (h.slabs?.length || 0), 0)}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-xl font-[900] text-[13px] shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New HSN Code
          </button>
        </div>

        {/* Bottom Row: Search & Toggle Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 py-3 bg-slate-50/30 dark:bg-white/[0.01]">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
            <input
              type="text"
              placeholder="Search by HSN Code or Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-[13px] font-semibold rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px] font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Toggle All Button */}
          <button
            onClick={toggleAll}
            className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-white/50 hover:text-violet-600 dark:hover:text-violet-400 rounded-xl transition-all shadow-sm text-center"
          >
            {isAnyExpanded ? 'Collapse All Slabs' : 'Expand All Slabs'}
          </button>
        </div>
      </div>

      {/* ── Data Cards ──────────────────────────────────────────────── */}
      <div className="flex-1 bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 opacity-60">
            <RefreshCw className="w-10 h-10 text-violet-500 animate-spin mb-3" />
            <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">Loading HSN records...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <h3 className="text-[16px] font-black text-slate-700 dark:text-white/80 uppercase tracking-wider">Error Loading Data</h3>
            <p className="text-[12px] font-bold text-slate-400 max-w-sm mt-1">{error}</p>
            <button onClick={fetchHsnList} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-[12px] rounded-xl">Retry</button>
          </div>
        ) : hsnList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
            <Clipboard className="w-16 h-16 text-slate-300 dark:text-white/10 mb-4" />
            <h3 className="text-[16px] font-black text-slate-700 dark:text-white/70 uppercase tracking-wider">No HSN Records</h3>
            <p className="text-[12px] font-bold text-slate-400 max-w-xs mt-1">Create an HSN entry and register slab structures to bind products.</p>
          </div>
        ) : filteredHsnList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
            <Clipboard className="w-16 h-16 text-slate-300 dark:text-white/10 mb-4" />
            <h3 className="text-[16px] font-black text-slate-700 dark:text-white/70 uppercase tracking-wider">No Matching Records</h3>
            <p className="text-[12px] font-bold text-slate-400 max-w-xs mt-1">No HSN codes match your search query: "{searchQuery}"</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
            {filteredHsnList.map((h, i) => {
              const isExpanded = !!expandedIds[h.hsnId];
              return (
                <motion.div
                  key={h.hsnId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className={`flex flex-col rounded-2xl border overflow-hidden transition-all duration-350 bg-white dark:bg-[#0f0f12] ${h.hsnDeactive
                    ? 'border-slate-200 dark:border-white/[0.05] opacity-60'
                    : isExpanded
                      ? 'border-violet-300 dark:border-violet-500/30 shadow-lg shadow-violet-500/[0.03]'
                      : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] hover:shadow-md'
                    }`}
                >
                  {/* CARD HEADER (Always visible, click to toggle) */}
                  <div
                    onClick={() => toggleExpand(h.hsnId)}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 cursor-pointer select-none bg-slate-50/40 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Left: Code, Description & Status */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-[12px] font-[1000] tracking-wide shadow-sm shadow-violet-500/20 shrink-0">
                        {h.hsnCode}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-[900] text-slate-800 dark:text-white truncate">
                            {h.hsnDescription}
                          </span>
                          {h.hsnDeactive ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20 shrink-0">
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Slabs Preview & WEF Date */}
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end ml-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">WEF Date:</span>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-white/50">
                          {h.hsnWefDate
                            ? new Date(h.hsnWefDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Slabs:</span>
                        {h.slabs && h.slabs.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {h.slabs.map((s, sIdx) => {
                              const tax = taxes.find(tx => tx.taxId === s.hsdSlabTax1);
                              return (
                                <span
                                  key={s.hsdId || sIdx}
                                  className="px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-extrabold text-[9px] border border-violet-100 dark:border-violet-500/10"
                                >
                                  {tax ? `${tax.taxRate}%` : '0%'}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 italic">None</span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions and Chevron Toggle */}
                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenEdit(h)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-500/15 text-slate-500 dark:text-white/50 hover:text-violet-700 dark:hover:text-violet-300 rounded-lg transition-all text-[11px] font-black border border-slate-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      {!h.hsnDeactive && (
                        <button
                          onClick={() => handleDeactivate(h.hsnId)}
                          className="p-1.5 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all border border-slate-200 dark:border-white/10 hover:border-rose-200 dark:hover:border-rose-500/20 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleExpand(h.hsnId)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all ml-1"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-350 ${isExpanded ? 'rotate-180 text-violet-500' : ''
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED CONTENT (Slabs panel) */}
                  {isExpanded && (
                    <div className="border-t border-slate-150 dark:border-white/[0.04]">
                      <div className="p-4 bg-slate-50/30 dark:bg-[#121216]/20 max-h-[260px] overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          {h.slabs && h.slabs.length > 0 ? (
                            <div className="flex flex-col gap-3">
                              <div className="grid grid-cols-1 gap-2.5">
                                {h.slabs.map((s, sIdx) => {
                                  const tax1 = taxes.find(tx => tx.taxId === s.hsdSlabTax1);
                                  const tax2 = taxes.find(tx => tx.taxId === s.hsdSlabTax2);

                                  return (
                                    <div
                                      key={s.hsdId || sIdx}
                                      className="relative group bg-white dark:bg-[#121215] border border-slate-100 dark:border-white/[0.04] hover:border-violet-100 dark:hover:border-violet-500/10 rounded-xl p-3.5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                                    >
                                      {/* Left: Slab sequence and Threshold */}
                                      <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-black border border-indigo-200/30 dark:border-indigo-500/10">
                                          {String(sIdx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">Threshold Limit</span>
                                          <div className="flex items-center gap-1 mt-0.5">
                                            <Tag className="w-3 h-3 text-indigo-500/70" />
                                            <span className="text-[12px] font-[900] text-slate-700 dark:text-white/80">
                                              {s.hsdSlabAmount === 0 ? (
                                                <span className="text-slate-500 dark:text-white/40 italic font-bold">No Limit (Default)</span>
                                              ) : (
                                                <span>Up to ₹{s.hsdSlabAmount.toLocaleString('en-IN')}</span>
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right: CGST/SGST and IGST cards */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 md:max-w-[85%]">
                                        {/* Local Tax */}
                                        <div className="p-2.5 rounded-lg bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-emerald-500/10 dark:border-emerald-500/5 flex flex-col justify-between gap-0.5">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-1">
                                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                              Local Intrastate
                                            </span>
                                            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-500/15 px-1.5 py-0.5 rounded-md">
                                              {tax1 ? `${tax1.taxRate}%` : '0%'}
                                            </span>
                                          </div>
                                          <div className="mt-0.5">
                                            <p className="text-[10.5px] font-extrabold text-slate-700 dark:text-white/80 truncate">
                                              {tax1 ? tax1.taxDescription : 'No Tax'}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5 text-[8.5px] font-bold text-slate-400 dark:text-white/30">
                                              <span>CGST: {tax1?.taxCgst ?? 0}%</span>
                                              <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-white/10" />
                                              <span>SGST: {tax1?.taxSgst ?? 0}%</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Interstate Tax */}
                                        <div className="p-2.5 rounded-lg bg-amber-500/[0.02] dark:bg-amber-500/[0.01] border border-amber-500/10 dark:border-amber-500/5 flex flex-col justify-between gap-0.5">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-600/80 dark:text-amber-400/80 flex items-center gap-1">
                                              <span className="w-1 h-1 rounded-full bg-amber-500" />
                                              Interstate IGST
                                            </span>
                                            <span className="text-[9px] font-black text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-500/15 px-1.5 py-0.5 rounded-md">
                                              {tax2 ? `${tax2.taxRate}%` : '0%'}
                                            </span>
                                          </div>
                                          <div className="mt-0.5">
                                            <p className="text-[10.5px] font-extrabold text-slate-700 dark:text-white/80 truncate">
                                              {tax2 ? tax2.taxDescription : 'No Tax'}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5 text-[8.5px] font-bold text-slate-400 dark:text-white/30">
                                              <span>IGST: {tax2?.taxIgst ?? 0}%</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-6 gap-3 bg-white dark:bg-transparent rounded-xl border border-dashed border-slate-200 dark:border-white/10 opacity-50">
                              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              <span className="text-[11px] font-bold text-slate-400 dark:text-white/30 italic">No slabs configured — defaults to 0% tax</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (

          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-2xl p-6 overflow-hidden z-10 flex flex-col gap-4 max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5 shrink-0">
                <h3 className="text-[18px] font-[1000] uppercase text-slate-800 dark:text-white">
                  {editingId ? 'Edit HSN Configuration' : 'Create HSN Configuration'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 pr-1 min-h-0">
                {/* HSN Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">HSN Code</label>
                    <input
                      type="text"
                      value={hsnCode}
                      onChange={(e) => setHsnCode(e.target.value)}
                      placeholder="e.g. 62"
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Description</label>
                    <input
                      type="text"
                      value={hsnDescription}
                      onChange={(e) => setHsnDescription(e.target.value)}
                      placeholder="e.g. Garments & Apparel"
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">WEF Date</label>
                    <input
                      type="date"
                      value={hsnWefDate}
                      onChange={(e) => setHsnWefDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 shrink-0">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">WEF To Date (Optional)</label>
                    <input
                      type="date"
                      value={hsnWefToDate}
                      onChange={(e) => setHsnWefToDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <input
                      type="checkbox"
                      id="hsnDeactiveCheck"
                      checked={hsnDeactive}
                      onChange={(e) => setHsnDeactive(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                    />
                    <label htmlFor="hsnDeactiveCheck" className="text-[12px] font-black text-slate-700 dark:text-white/80 cursor-pointer select-none">
                      Deactivate HSN Code
                    </label>
                  </div>
                </div>

                {/* Slabs Setup */}
                <div className="flex-1 flex flex-col gap-3 min-h-[250px] overflow-hidden border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.01]">
                  <div className="flex justify-between items-center shrink-0">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-500" /> HSN details slabs structures
                    </span>
                    <button
                      type="button"
                      onClick={handleAddSlab}
                      className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-[11px] font-[1000] rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Slab
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-1">
                    {slabs.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 py-10">
                        <Info className="w-10 h-10 text-slate-300 dark:text-white/10 mb-2" />
                        <p className="text-[11px] font-bold text-slate-400 max-w-xs">No slabs added. Products mapped to this HSN will resolve to 0% tax by default.</p>
                      </div>
                    ) : (
                      slabs.map((slab, idx) => (
                        <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] p-3.5 rounded-xl shadow-sm relative group/row animate-in slide-in-from-top-1">

                          {/* Slab Limit */}
                          <div className="flex flex-col gap-1 w-full md:w-36">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Slab Limit Amount</label>
                            <input
                              type="number"
                              value={slab.hsdSlabAmount}
                              onChange={(e) => handleSlabChange(idx, 'hsdSlabAmount', parseFloat(e.target.value) || 0)}
                              placeholder="0 (For fallback)"
                              className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-[12px] font-black text-slate-800 dark:text-white"
                            />
                          </div>

                          {/* Intrastate Tax */}
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Local Tax (CGST/SGST)</label>
                            <select
                              value={slab.hsdSlabTax1}
                              onChange={(e) => handleSlabChange(idx, 'hsdSlabTax1', parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-slate-800 dark:text-white"
                            >
                              {taxes.map(t => (
                                <option key={t.taxId} value={t.taxId}>
                                  {t.taxDescription} ({t.taxRate}%)
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Interstate Tax */}
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Interstate Tax (IGST)</label>
                            <select
                              value={slab.hsdSlabTax2}
                              onChange={(e) => handleSlabChange(idx, 'hsdSlabTax2', parseInt(e.target.value) || 0)}
                              className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-slate-800 dark:text-white"
                            >
                              {taxes.map(t => (
                                <option key={t.taxId} value={t.taxId}>
                                  {t.taxDescription} ({t.taxRate}%)
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Slab WEF Date */}
                          <div className="flex flex-col gap-1 w-full md:w-32">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Slab WEF Date</label>
                            <input
                              type="date"
                              value={slab.hsdWefDate || ''}
                              onChange={(e) => handleSlabChange(idx, 'hsdWefDate', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 dark:text-white"
                            />
                          </div>

                          {/* Lower Slab Fields */}
                          <div className="flex items-center gap-1.5 mt-4 md:mt-0">
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                id={`slabDeactive-${idx}`}
                                checked={slab.isDeactive}
                                onChange={(e) => handleSlabChange(idx, 'isDeactive', e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                              />
                              <label htmlFor={`slabDeactive-${idx}`} className="text-[10px] font-black text-rose-500 cursor-pointer select-none">Deactive</label>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveSlab(idx)}
                              className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 hover:bg-rose-100 rounded-lg hover:scale-105 transition-all"
                              title="Delete Slab"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Submit Block */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-[12px] hover:bg-slate-200 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[12px] flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <Check className="w-4 h-4" /> Save Configuration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )
        }
      </AnimatePresence >
    </div >
  );
};

export default HsnMaster;
