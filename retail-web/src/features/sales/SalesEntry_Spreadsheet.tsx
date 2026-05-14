import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  User, 
  FileText, 
  Calendar, 
  Save, 
  X, 
  PauseCircle,
  Plus
} from 'lucide-react';

// Dummy data type for the grid
interface LineItem {
  id: string;
  barcode: string;
  sourceCode: string;
  productCode: string;
  color: string;
  isIndividual: boolean;
  category: string;
  size: string;
  mrp: number;
  selPrice: number;
  discount: number;
  hsn: string;
  taxDesc: string;
  taxAmt: number;
  qty: number;
  amount: number;
}

const SalesEntry: React.FC = () => {
  // State for header
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const docNo = "SAL-2026-0001";
  const docDate = new Date().toISOString().split('T')[0];

  // Dummy line items for visualization
  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1', barcode: '890123456789', sourceCode: 'SC-101', productCode: 'PRD-TSHIRT', color: 'Black', 
      isIndividual: false, category: 'Apparel', size: 'M', mrp: 1200, selPrice: 999, discount: 201, 
      hsn: '6109', taxDesc: 'GST 5%', taxAmt: 50, qty: 2, amount: 1998
    }
  ]);

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
              <h1 className="text-[20px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">Sales Entry</h1>
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
              className="w-full bg-gray-50 dark:bg-[#0A0B10] border border-gray-300 dark:border-white/[0.06] text-gray-900 dark:text-[#F3F4F6] text-[14px] font-bold rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
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
              placeholder="Search mobile number..."
              className="w-full bg-gray-50 dark:bg-[#0A0B10] border border-gray-300 dark:border-white/[0.06] text-gray-900 dark:text-[#F3F4F6] text-[14px] font-bold rounded-lg px-3 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400 dark:placeholder-[#4B5563] shadow-sm"
            />
            <button className="absolute right-2 top-[30px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 p-1.5 rounded hover:bg-indigo-600 hover:text-white transition-colors">
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
                    <button className="text-gray-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
                      <X className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Active Input Row - Styled with high contrast */}
              <tr className="bg-indigo-50/50 dark:bg-indigo-500/[0.02] border-y-2 border-indigo-100 dark:border-transparent relative">
                {/* Visual indicator for active row */}
                <td className="px-3 py-2 text-[13px] font-bold text-indigo-600 dark:text-indigo-400 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                  {items.length + 1}
                </td>
                <td className="px-2 py-2">
                  <input type="text" placeholder="Scan Barcode..." autoFocus className="w-[140px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-indigo-500/30 text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white font-bold placeholder-gray-400 shadow-sm" />
                </td>
                <td className="px-2 py-2"><input type="text" className="w-[100px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white shadow-sm font-medium" /></td>
                <td className="px-2 py-2"><input type="text" className="w-[100px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white shadow-sm font-medium" /></td>
                <td className="px-2 py-2"><input type="text" className="w-[100px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white shadow-sm font-medium" /></td>
                <td className="px-2 py-2"><input type="text" className="w-[80px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white shadow-sm font-medium" /></td>
                <td className="px-2 py-2"><input type="text" className="w-[60px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white shadow-sm font-medium" /></td>
                <td className="px-2 py-2 text-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-indigo-600 focus:ring-indigo-500" /></td>
                <td className="px-2 py-2"><input type="number" className="w-[80px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right text-gray-900 dark:text-white shadow-sm font-medium" /></td>
                <td className="px-2 py-2"><input type="number" className="w-[80px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right text-gray-900 dark:text-white shadow-sm font-bold" /></td>
                <td className="px-2 py-2"><input type="number" className="w-[80px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right text-rose-600 font-bold shadow-sm" /></td>
                <td className="px-2 py-2"><input type="text" className="w-[80px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[13px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white shadow-sm font-medium" /></td>
                <td className="px-2 py-2"><input type="text" className="w-[100px] bg-gray-100 dark:bg-[#08090E]/50 border border-gray-200 dark:border-transparent text-[13px] px-2.5 py-1.5 rounded-md outline-none text-gray-500 font-medium cursor-not-allowed" readOnly /></td>
                <td className="px-2 py-2"><input type="number" className="w-[80px] bg-gray-100 dark:bg-[#08090E]/50 border border-gray-200 dark:border-transparent text-[13px] px-2.5 py-1.5 rounded-md outline-none text-right text-gray-500 font-medium cursor-not-allowed" readOnly /></td>
                <td className="px-2 py-2"><input type="number" defaultValue="1" className="w-[60px] bg-white dark:bg-[#08090E] border border-gray-300 dark:border-white/[0.06] text-[14px] px-2.5 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right text-gray-900 dark:text-white font-extrabold shadow-sm" /></td>
                <td className="px-2 py-2"><input type="text" className="w-[100px] bg-indigo-50 dark:bg-[#08090E]/50 border border-indigo-200 dark:border-transparent text-[14px] px-2.5 py-1.5 rounded-md outline-none text-right text-indigo-700 dark:text-gray-500 font-extrabold cursor-not-allowed" readOnly /></td>
                <td className="px-2 py-2 text-center">
                  <button className="p-1.5 bg-indigo-600 dark:bg-indigo-500/20 text-white dark:text-indigo-400 rounded hover:bg-indigo-700 dark:hover:bg-indigo-500/30 transition-colors shadow-sm">
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>
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
              <p className="text-[22px] font-black text-gray-900 dark:text-white">2.00</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 dark:text-[#8F94A3] uppercase tracking-wider mb-1">Gross Amount</p>
              <p className="text-[22px] font-black text-gray-900 dark:text-[#E2E8F0]">₹2,400.00</p>
            </div>
            <div>
              <p className="text-[12px] font-bold text-rose-500 dark:text-rose-400/80 uppercase tracking-wider mb-1">Discount</p>
              <p className="text-[22px] font-black text-rose-600 dark:text-rose-400">-₹201.00</p>
            </div>
            <div className="pl-8 border-l-2 border-gray-200 dark:border-white/[0.08]">
              <p className="text-[12px] font-extrabold text-emerald-600 dark:text-emerald-500/80 uppercase tracking-wider mb-1">Net Payable</p>
              <p className="text-[32px] font-black text-emerald-600 dark:text-emerald-400 leading-none">₹1,998.00</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="px-6 py-3.5 flex items-center gap-2 text-[14px] font-bold text-gray-700 dark:text-[#A1A1AA] bg-gray-100 dark:bg-white/[0.02] hover:bg-gray-200 dark:hover:bg-white/[0.05] border border-gray-300 dark:border-white/[0.05] rounded-xl transition-all shadow-sm">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button className="px-6 py-3.5 flex items-center gap-2 text-[14px] font-bold text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-300 dark:border-amber-500/20 rounded-xl transition-all shadow-sm">
              <PauseCircle className="w-4 h-4" /> Hold Sale
            </button>
            <button className="px-10 py-3.5 flex items-center gap-2 text-[16px] font-black text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl shadow-[0_4px_15px_rgba(79,70,229,0.3)] dark:shadow-[0_4px_15px_rgba(99,102,241,0.4)] transition-all transform hover:-translate-y-0.5">
              <Save className="w-5 h-5" /> Complete Sale
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SalesEntry;
