import React from 'react';
import {
  ShoppingCart,
  Search,
  User,
  FileText,
  Calendar,
  Save,
  X,
  PauseCircle,
  Edit
} from 'lucide-react';
import { useSalesLogic } from './useSalesLogic';

const SalesEntry: React.FC = () => {
  const {
    mobileNumber,
    setMobileNumber,
    customerName,
    docNo,
    docDate,
    setDocDate,
    formMode,
    setFormMode,
    items,
    totalQty,
    grossAmount,
    totalDiscount,
    netPayable,
    handleNewSale,
    handleCompleteSale,
    handleSaveInvoice,
    handleRemoveItem
  } = useSalesLogic();

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
                <h1 className="text-[20px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Sales Entry</h1>
                {formMode === 'VIEW' && (
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/80 rounded-md text-[10px] font-extrabold uppercase tracking-widest border border-slate-200 dark:border-white/10">LOCKED (VIEW)</span>
                )}
                {formMode === 'EDIT' && (
                  <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-extrabold uppercase tracking-widest border border-amber-200 dark:border-amber-500/20 animate-pulse">EDITED</span>
                )}
                {formMode === 'LOCKED' && (
                  <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-md text-[10px] font-extrabold uppercase tracking-widest border border-rose-200 dark:border-rose-500/20">LOCKED</span>
                )}
              </div>
              <p className="text-[13px] font-medium text-gray-500 dark:text-[#8F94A3]">Create new POS transaction</p>
            </div>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Doc No (Read Only) */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-700 dark:text-[#A1A1AA] flex items-center gap-1.5 uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5" /> Document No.
            </label>
            <input
              type="text"
              value={docNo}
              readOnly
              className="w-full bg-gray-100 dark:bg-[#0A0B10]/50 border border-gray-200 dark:border-white/[0.03] text-gray-500 dark:text-[#8F94A3] text-[14px] font-bold rounded-lg px-3 py-2.5 cursor-not-allowed outline-none"
            />
          </div>

          {/* Doc Date */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-700 dark:text-[#A1A1AA] flex items-center gap-1.5 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5" /> Date
            </label>
            <input
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
              className={`w-full bg-gray-50 dark:bg-[#0A0B10] border border-gray-300 dark:border-white/[0.06] text-gray-900 dark:text-[#F3F4F6] text-[14px] font-bold rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Customer Mobile Search */}
          <div className="space-y-1.5 relative group">
            <label className="text-[12px] font-bold text-gray-700 dark:text-[#A1A1AA] flex items-center gap-1.5 uppercase tracking-wide">
              <Search className="w-3.5 h-3.5" /> Customer Mobile
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              disabled={formMode === 'VIEW' || formMode === 'LOCKED'}
              placeholder="Search mobile number..."
              className={`w-full bg-gray-50 dark:bg-[#0A0B10] border border-gray-300 dark:border-white/[0.06] text-gray-900 dark:text-[#F3F4F6] text-[14px] font-bold rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400 dark:placeholder-[#4B5563] shadow-sm ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            <button disabled={formMode === 'VIEW' || formMode === 'LOCKED'} className="absolute right-2 top-[30px] bg-indigo-100 dark:bg-indigo-50/20 text-indigo-700 dark:text-indigo-400 p-1.5 rounded hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-700 dark:text-[#A1A1AA] flex items-center gap-1.5 uppercase tracking-wide">
              <User className="w-3.5 h-3.5" /> Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              readOnly
              className="w-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[14px] font-bold rounded-lg px-3 py-2.5 outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Data Grid (Transaction Details) */}
      <div className="flex-1 bg-white dark:bg-[#0B0C12] border-x border-gray-200 dark:border-white/[0.05] overflow-hidden flex flex-col relative z-0 shadow-sm">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1800px]">
            <thead className="sticky top-0 bg-gray-100 dark:bg-[#08090E] border-y-2 border-gray-200 dark:border-white/[0.05] z-10">
              <tr>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">#</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">Barcode</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">Source Code</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">Product Code</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">Category</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">Color</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">Size</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-center">Indiv.</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-right">MRP</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-right">Sel Price</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-right">Disc.</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">HSN</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider">Tax Desc</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-right">Tax Amt</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-right">Qty</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-right">Amount</th>
                <th className="px-3 py-3 text-[11px] font-extrabold text-gray-700 dark:text-[#8F94A3] uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/[0.02]">

              {/* Existing Items */}
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 dark:hover:bg-white/[0.01] transition-colors group">
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-500 dark:text-[#6B7280]">{index + 1}</td>
                  <td className="px-3 py-2 text-[13px] font-bold text-gray-900 dark:text-[#E2E8F0]">{item.barcode}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA]">{item.sourceCode}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA]">{item.productCode}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA]">{item.category}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA]">{item.color}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA]">{item.size}</td>
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" checked={item.isIndividual} readOnly className="w-4 h-4 rounded border-gray-400 dark:border-white/10 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA] text-right">₹{item.mrp.toFixed(2)}</td>
                  <td className="px-3 py-2 text-[13px] font-bold text-gray-900 dark:text-[#E2E8F0] text-right">₹{item.selPrice.toFixed(2)}</td>
                  <td className="px-3 py-2 text-[13px] font-bold text-rose-600 dark:text-rose-400 text-right">₹{item.discount.toFixed(2)}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA]">{item.hsn}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA]">{item.taxDesc}</td>
                  <td className="px-3 py-2 text-[13px] font-medium text-gray-700 dark:text-[#A1A1AA] text-right">₹{item.taxAmt.toFixed(2)}</td>
                  <td className="px-3 py-2 text-[14px] font-bold text-gray-900 dark:text-[#E2E8F0] text-right">{item.qty}</td>
                  <td className="px-3 py-2 text-[14px] font-bold text-indigo-700 dark:text-indigo-400 text-right">₹{item.amount.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => handleRemoveItem(item.id)} disabled={formMode === 'VIEW' || formMode === 'LOCKED'} className="text-gray-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed">
                      <X className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}


            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Footer Section (Summary & Actions) */}
      <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-b-2xl p-5 shadow-[0_-4px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="flex items-center justify-between">

          {/* Summary Calculations */}
          <div className="flex gap-10">
            <div>
              <p className="text-[12px] font-bold text-gray-500 dark:text-[#8F94A3] uppercase tracking-wider mb-1">Total Qty</p>
              <p className="text-[22px] font-black text-gray-900 dark:text-white">{totalQty.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 dark:text-[#8F94A3] uppercase tracking-wider mb-1">Gross Amount</p>
              <p className="text-[22px] font-black text-gray-900 dark:text-[#E2E8F0]">₹{grossAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-rose-500 dark:text-rose-400/80 uppercase tracking-wider mb-1">Discount</p>
              <p className="text-[22px] font-black text-rose-600 dark:text-rose-400">-₹{totalDiscount.toLocaleString()}</p>
            </div>
            <div className="pl-8 border-l-2 border-gray-200 dark:border-white/[0.08]">
              <p className="text-[12px] font-extrabold text-emerald-600 dark:text-emerald-500/80 uppercase tracking-wider mb-1">Net Payable</p>
              <p className="text-[32px] font-black text-emerald-600 dark:text-emerald-400 leading-none">₹{netPayable.toLocaleString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button onClick={handleNewSale} className="px-6 py-3.5 flex items-center gap-2 text-[14px] font-bold text-gray-700 dark:text-[#A1A1AA] bg-gray-100 dark:bg-white/[0.02] hover:bg-gray-200 dark:hover:bg-white/[0.05] border border-gray-300 dark:border-white/[0.05] rounded-xl transition-all shadow-sm">
              <X className="w-4 h-4" /> Cancel
            </button>
            {formMode === 'VIEW' ? (
              <button onClick={() => setFormMode('EDIT')} className="px-6 py-3.5 flex items-center gap-2 text-[14px] font-bold text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-300 dark:border-amber-500/20 rounded-xl transition-all shadow-sm">
                <Edit className="w-4 h-4" /> Edit Record
              </button>
            ) : (
              <button onClick={handleSaveInvoice} disabled={formMode === 'LOCKED'} className={`px-6 py-3.5 flex items-center gap-2 text-[14px] font-bold text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-300 dark:border-amber-500/20 rounded-xl transition-all shadow-sm ${formMode === 'LOCKED' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <PauseCircle className="w-4 h-4" /> Hold Sale / Save
              </button>
            )}
            <button onClick={handleCompleteSale} disabled={formMode === 'VIEW' || formMode === 'LOCKED'} className={`px-10 py-3.5 flex items-center gap-2 text-[16px] font-black text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl shadow-[0_4px_15px_rgba(79,70,229,0.3)] dark:shadow-[0_4px_15px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5 ${formMode === 'VIEW' || formMode === 'LOCKED' ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}`}>
              <Save className="w-5 h-5" /> Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesEntry;
