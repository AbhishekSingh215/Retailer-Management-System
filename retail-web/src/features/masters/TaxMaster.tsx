import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Percent, Check, AlertCircle, RefreshCw } from 'lucide-react';
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

const TaxMaster: React.FC = () => {
  const [taxes, setTaxes] = useState<TaxRateData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [description, setDescription] = useState('');
  const [overallRate, setOverallRate] = useState<number>(0);
  const [cgst, setCgst] = useState<number>(0);
  const [sgst, setSgst] = useState<number>(0);
  const [igst, setIgst] = useState<number>(0);
  const [ugst, setUgst] = useState<number>(0);
  const [taxType, setTaxType] = useState<number>(0); // 0 = Intrastate, 1 = Interstate, 2 = Composite/Zero
  const [deactive, setDeactive] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTaxes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/TaxMaster`);
      if (!res.ok) throw new Error("Failed to load tax rates.");
      const data = await res.json();
      setTaxes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, message: msg });
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto-calculate components based on overall rate
  const handleOverallRateChange = (val: number) => {
    setOverallRate(val);
    setCgst(val / 2);
    setSgst(val / 2);
    setIgst(val);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setDescription('');
    setOverallRate(0);
    setCgst(0);
    setSgst(0);
    setIgst(0);
    setUgst(0);
    setTaxType(0);
    setDeactive(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TaxRateData) => {
    setEditingId(t.taxId);
    setDescription(t.taxDescription || '');
    setOverallRate(t.taxRate);
    setCgst(t.taxCgst);
    setSgst(t.taxSgst);
    setIgst(t.taxIgst);
    setUgst(t.taxUgst);
    setTaxType(t.taxType || 0);
    setDeactive(t.taxDeactive || false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showNotification('error', 'Description is required');
      return;
    }

    const payload = {
      taxId: editingId || 0,
      taxDescription: description,
      taxDeactive: deactive,
      taxRate: overallRate,
      taxCgst: cgst,
      taxSgst: sgst,
      taxIgst: igst,
      taxUgst: ugst,
      taxType: taxType
    };

    try {
      const url = editingId ? `${API_BASE_URL}/TaxMaster/${editingId}` : `${API_BASE_URL}/TaxMaster`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Server rejected request.");
      
      showNotification('success', editingId ? 'Tax rate updated successfully!' : 'Tax rate created successfully!');
      setIsModalOpen(false);
      fetchTaxes();
    } catch (err: any) {
      showNotification('error', err.message || 'Operation failed.');
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!window.confirm("Are you sure you want to deactivate this tax rate?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/TaxMaster/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to deactivate.");
      showNotification('success', 'Tax rate deactivated.');
      fetchTaxes();
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="p-8 flex-1 min-h-0 overflow-hidden flex flex-col gap-6 bg-transparent">

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border ${
              notification.type === 'success' 
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
      <div className="relative bg-white dark:bg-[#0f0f12] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        {/* Subtle top-edge gradient accent */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-6 pt-5 pb-4">
          {/* Left: icon + title + subtitle */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                <Percent className="w-5 h-5 stroke-[2.5px]" />
              </div>
            </div>
            <div>
              <h1 className="text-[17px] font-[1000] tracking-tight text-slate-900 dark:text-white leading-none">Tax Master</h1>
              <p className="text-[12px] font-medium text-slate-500 dark:text-white/40 mt-1">GST tax rate profiles — CGST, SGST &amp; IGST</p>
            </div>
          </div>

          {/* Right: live stats + CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Stats chips */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex flex-col items-center px-4 py-2 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl">
                <span className="text-[18px] font-[1000] text-slate-800 dark:text-white leading-none">{taxes.length}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mt-0.5">Total</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                <span className="text-[18px] font-[1000] text-emerald-600 dark:text-emerald-400 leading-none">{taxes.filter(t => !t.taxDeactive).length}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/70 mt-0.5">Active</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                <span className="text-[18px] font-[1000] text-rose-500 dark:text-rose-400 leading-none">{taxes.filter(t => t.taxDeactive).length}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-400/70 mt-0.5">Inactive</span>
              </div>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-[900] text-[13px] shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Tax Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────── */}
      <div className="flex-1 bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 opacity-60">
            <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
            <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">Loading tax profiles...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <h3 className="text-[16px] font-black text-slate-700 dark:text-white/80 uppercase tracking-wider">Error Loading Data</h3>
            <p className="text-[12px] font-bold text-slate-400 max-w-sm mt-1">{error}</p>
            <button onClick={fetchTaxes} className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-[12px] rounded-xl">Retry</button>
          </div>
        ) : taxes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
            <Percent className="w-16 h-16 text-slate-300 dark:text-white/10 mb-4" />
            <h3 className="text-[16px] font-black text-slate-700 dark:text-white/70 uppercase tracking-wider">No Tax Profiles</h3>
            <p className="text-[12px] font-bold text-slate-400 max-w-xs mt-1">Create a tax rate component to initialize POS tax slabs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full border-collapse text-left">
              <thead>
                {/* Gradient header strip */}
                <tr className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/70 w-[7%]">#</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/70 w-[25%]">Description</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/90 text-right w-[9%]">Rate</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-blue-200 text-right w-[9%]">CGST</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-blue-200 text-right w-[9%]">SGST</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-amber-200 text-right w-[9%]">IGST</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-purple-200 text-right w-[9%]">UGST</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/70 text-center w-[12%]">Type</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/70 text-center w-[9%]">Status</th>
                  <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/70 text-center w-[12%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taxes.map((t, i) => (
                  <tr
                    key={t.taxId}
                    className={`group transition-all duration-150 border-b border-slate-100 dark:border-white/[0.04] ${
                      i % 2 === 0
                        ? 'bg-white dark:bg-transparent'
                        : 'bg-slate-50/60 dark:bg-white/[0.01]'
                    } hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.05]`}
                  >
                    {/* ID */}
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-black text-slate-400 dark:text-white/25">#{t.taxId}</span>
                    </td>
                    {/* Description */}
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] font-[900] text-slate-800 dark:text-white">{t.taxDescription}</span>
                    </td>
                    {/* Overall Rate */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="inline-flex items-center justify-center min-w-[42px] px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[13px] font-[1000]">
                        {t.taxRate}%
                      </span>
                    </td>
                    {/* CGST */}
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-[13px] font-black ${ t.taxCgst > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-white/20' }`}>
                        {t.taxCgst > 0 ? `${t.taxCgst}%` : '—'}
                      </span>
                    </td>
                    {/* SGST */}
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-[13px] font-black ${ t.taxSgst > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-white/20' }`}>
                        {t.taxSgst > 0 ? `${t.taxSgst}%` : '—'}
                      </span>
                    </td>
                    {/* IGST */}
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-[13px] font-black ${ t.taxIgst > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-300 dark:text-white/20' }`}>
                        {t.taxIgst > 0 ? `${t.taxIgst}%` : '—'}
                      </span>
                    </td>
                    {/* UGST */}
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-[13px] font-black ${ t.taxUgst > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-300 dark:text-white/20' }`}>
                        {t.taxUgst > 0 ? `${t.taxUgst}%` : '—'}
                      </span>
                    </td>
                    {/* Type Badge */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        t.taxType === 0
                          ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                          : t.taxType === 1
                          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                          : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-white/40 border border-slate-200 dark:border-white/10'
                      }`}>
                        {t.taxType === 0 ? 'Intrastate' : t.taxType === 1 ? 'Interstate' : 'Zero/Exempt'}
                      </span>
                    </td>
                    {/* Status Badge */}
                    <td className="px-4 py-3.5 text-center">
                      {t.taxDeactive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />Active
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/15 text-slate-500 dark:text-white/50 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg transition-all text-[11px] font-black border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        {!t.taxDeactive && (
                          <button
                            onClick={() => handleDeactivate(t.taxId)}
                            className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
                            title="Deactivate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-2xl p-6 overflow-hidden z-10 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-[18px] font-[1000] uppercase text-slate-800 dark:text-white">
                  {editingId ? 'Edit Tax Profile' : 'Create Tax Profile'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. GST 18% or IGST 5%"
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Overall Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={overallRate || ''}
                      onChange={(e) => handleOverallRateChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Tax Type</label>
                    <select
                      value={taxType}
                      onChange={(e) => setTaxType(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-950 dark:text-white text-[13px] font-extrabold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value={0}>Intrastate (CGST/SGST)</option>
                      <option value={1}>Interstate (IGST)</option>
                      <option value={2}>Composite/Zero/Exempt</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Tax Components breakdown</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">CGST (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cgst || ''}
                        onChange={(e) => setCgst(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-[13px] font-bold rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">SGST (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={sgst || ''}
                        onChange={(e) => setSgst(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-[13px] font-bold rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">IGST (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={igst || ''}
                        onChange={(e) => setIgst(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-[13px] font-bold rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">UGST (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={ugst || ''}
                        onChange={(e) => setUgst(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-[13px] font-bold rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <input
                    type="checkbox"
                    id="deactiveCheck"
                    checked={deactive}
                    onChange={(e) => setDeactive(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <label htmlFor="deactiveCheck" className="text-[12px] font-black text-slate-700 dark:text-white/80 cursor-pointer select-none">
                    Deactivate this tax profile
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaxMaster;
