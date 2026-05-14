import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  User,
  FileText,
  Calendar,
  Save,
  X,
  PauseCircle,
  Plus,
  Barcode,
  Tag,
  Hash,
  Store,
  CheckCircle2,
  LayoutDashboard,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  mobile: string;
  loyaltyPoints: number;
}

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

  // Dummy line items for visualization (Cart)
  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1', barcode: '890123456789', sourceCode: 'SC-101', productCode: 'Premium Cotton T-Shirt', color: 'Black',
      isIndividual: false, category: 'Apparel', size: 'M', mrp: 1200, selPrice: 999, discount: 201,
      hsn: '6109', taxDesc: 'GST 5%', taxAmt: 50, qty: 2, amount: 1998
    },
    {
      id: '2', barcode: '890123456790', sourceCode: 'SC-102', productCode: 'Denim Jeans Slim Fit', color: 'Blue',
      isIndividual: false, category: 'Apparel', size: '32', mrp: 2500, selPrice: 2200, discount: 300,
      hsn: '6203', taxDesc: 'GST 12%', taxAmt: 264, qty: 1, amount: 2200
    }
  ]);

  // State for Layout Toggle
  const [viewMode, setViewMode] = useState<'modern' | 'classic'>('modern');

  // Customer Search States
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Ref for classic table scroll reset
  const classicScrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll when switching to classic view
  useEffect(() => {
    if (viewMode === 'classic' && classicScrollRef.current) {
      classicScrollRef.current.scrollLeft = 0;
    }
  }, [viewMode]);

  // Real-time Customer Search Logic
  useEffect(() => {
    const searchCustomer = async () => {
      if (mobileNumber.length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        // Correct port from your launchSettings.json
        const response = await fetch(`https://localhost:7289/api/customer/search?query=${mobileNumber}`);
        const data = await response.json();

        setSearchResults(data);
        setShowResults(data.length > 0);
      } catch (error) {
        console.error('Customer search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchCustomer, 300);
    return () => clearTimeout(timer);
  }, [mobileNumber]);

  const handleCustomerSelect = (customer: Customer) => {
    setMobileNumber(customer.mobile);
    setCustomerName(customer.name);
    setShowResults(false);
  };

  // State for cart search
  const [cartSearch, setCartSearch] = useState('');

  // Filtered items for display
  const filteredItems = items.filter(item =>
    item.productCode.toLowerCase().includes(cartSearch.toLowerCase()) ||
    item.barcode.includes(cartSearch)
  );

  // Current scanned item state (Input Form)
  const [barcodeInput, setBarcodeInput] = useState('');

  // State for bill details popover
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  const TotalsFooter = () => (
    <div className="bg-white dark:bg-[#080808] border-t border-slate-200 dark:border-white/[0.1] px-8 py-4 flex justify-between items-center shadow-[0_-15px_40px_rgba(0,0,0,0.05)] shrink-0 z-20">
      <div className="flex gap-10 items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Qty</span>
          <span className="text-[18px] font-[1000] text-gray-900 dark:text-white leading-none">2.00</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Amt</span>
          <span className="text-[18px] font-[1000] text-gray-900 dark:text-white leading-none">₹3,700</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Disc.</span>
          <span className="text-[18px] font-[1000] text-rose-500 leading-none">-₹501</span>
        </div>
        <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Net Payable</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[16px] font-black text-emerald-600 leading-none">₹</span>
            <span className="text-[36px] font-[1000] text-emerald-600 leading-none tracking-tighter">3,198.00</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-3 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-black hover:bg-slate-200 transition-all flex items-center gap-2 text-slate-600 dark:text-white/60">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button className="px-10 py-3 bg-indigo-600 text-white rounded-xl text-[14px] font-[1000] shadow-xl shadow-indigo-600/30 hover:-translate-y-1 hover:bg-indigo-700 transition-all flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5" /> Complete Sale (F10)
        </button>
      </div>
    </div>
  );

  const renderClassicView = () => (
    <div className="flex flex-col h-full gap-2 p-3 pt-0 overflow-hidden bg-transparent">
      <div className="flex justify-end pt-1">
        <LayoutToggle />
      </div>

      {/* Classic Single-Row Header (Inputs) */}
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-sm shrink-0 relative z-[50]">
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><FileText className="w-3 h-3" /> Doc No.</span>
          <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-white/[0.05] border border-slate-100 dark:border-white/[0.1] rounded-xl text-[13px] font-black text-slate-500">{docNo}</div>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</span>
          <div className="px-4 py-2.5 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[13px] font-black text-slate-700 dark:text-white/80">{docDate}</div>
        </div>
        <div className="flex-1 flex flex-col gap-1.5 min-w-[250px]">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Search className="w-3 h-3" /> Customer Mobile</span>
          <div className="relative">
            <input
              type="text"
              placeholder="Search mobile..."
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="w-full px-5 py-2.5 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[14px] font-black focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder-slate-300"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-600/20"><Search className="w-4 h-4" /></button>

            {isSearching && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Search Results Dropdown (Classic View) */}
            <AnimatePresence>
              {showResults && viewMode === 'classic' && (
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
        <div className="flex-[1.5] flex flex-col gap-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><User className="w-3 h-3" /> Customer Name</span>
          <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-[14px] font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            {customerName}
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Classic Wide Grid Table - Now fills all remaining space */}
      <div className="flex-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-0">
        <div ref={classicScrollRef} className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar min-h-0">
          <table className="w-full min-w-[1800px] border-collapse text-left">
            <thead className="sticky top-0 bg-slate-50/95 dark:bg-[#0d0d0d]/95 backdrop-blur-md z-10">
              <tr className="border-b border-slate-200 dark:border-white/[0.1]">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">#</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48">Barcode</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Source Code</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest flex-1">Product Description</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Category</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Color</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Size</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">Indiv</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">Qty</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">MRP</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">Sel Price</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">Disc.</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">HSN</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Tax Desc</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">Tax Amt</th>
                <th className="px-6 py-3 text-[10px] font-black text-indigo-500 uppercase tracking-widest w-36 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03]">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-3 text-[12px] font-black text-slate-300 dark:text-white/10 group-hover:text-indigo-400 transition-colors">{index + 1}</td>
                  <td className="px-6 py-3 text-[13px] font-black text-slate-700 dark:text-white/80">{item.barcode}</td>
                  <td className="px-6 py-3 text-[12px] font-bold text-slate-400">{item.sourceCode}</td>
                  <td className="px-6 py-3 text-[13px] font-[1000] text-indigo-600 dark:text-indigo-400">{item.productCode}</td>
                  <td className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">{item.category}</td>
                  <td className="px-6 py-3 text-[12px] font-bold text-slate-500">{item.color}</td>
                  <td className="px-6 py-3 text-[12px] font-bold text-slate-500">{item.size}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center">
                      <input type="checkbox" checked={item.isIndividual} readOnly className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500/20" />
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[13px] font-black text-slate-700 dark:text-white/80">
                        {item.qty}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-[13px] font-bold text-slate-400 text-right">₹{item.mrp.toFixed(0)}</td>
                  <td className="px-6 py-3 text-[14px] font-black text-gray-900 dark:text-white text-right">₹{item.selPrice.toFixed(0)}</td>
                  <td className="px-6 py-3 text-[13px] font-black text-rose-500 text-right">-₹{item.discount.toFixed(0)}</td>
                  <td className="px-6 py-3 text-[12px] font-bold text-slate-400">{item.hsn}</td>
                  <td className="px-6 py-3 text-[12px] font-bold text-slate-400">{item.taxDesc}</td>
                  <td className="px-6 py-3 text-[13px] font-bold text-slate-500 text-right">₹{item.taxAmt.toFixed(0)}</td>
                  <td className="px-6 py-3 text-[15px] font-[1000] text-indigo-600 dark:text-indigo-400 text-right">₹{item.amount.toFixed(0)}</td>
                </tr>
              ))}
              {/* Pro Scan Row */}
              <tr className="bg-indigo-50/30 dark:bg-indigo-500/5">
                <td className="px-6 py-4 text-[13px] font-black text-indigo-300 dark:text-indigo-500/30">{items.length + 1}</td>
                <td colSpan={15} className="px-6 py-1">
                  <div className="flex items-center gap-4">
                    <Barcode className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <input type="text" placeholder="Scan Barcode or Product Name..." className="flex-1 bg-transparent border-0 outline-none text-[15px] font-black text-indigo-600 placeholder-indigo-300 focus:placeholder-indigo-200" autoFocus />
                  </div>
                </td>
              </tr>
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

                <div className="p-4 pb-0 shrink-0">
                  <LayoutToggle />
                </div>

                {/* --- Header Section (Customer & Doc Info) --- */}
                <div className="px-6 py-2 shrink-0 relative z-[50]">
                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 shadow-sm backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-[15px] font-black text-gray-900 dark:text-white tracking-tight leading-tight">Customer Details</h2>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/[0.05] rounded-lg border border-slate-100 dark:border-white/[0.08]">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-[12px] font-black text-slate-600 dark:text-white/60 tracking-tight">{docNo}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-[12px] font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{docDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1 relative group col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-white/30 flex items-center gap-2 uppercase tracking-[0.2em] ml-1">
                          <Search className="w-3 h-3" /> Mobile Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            placeholder="Search mobile..."
                            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[14px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all"
                          />
                          {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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

                      <div className="space-y-1 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-white/30 flex items-center gap-2 uppercase tracking-[0.2em] ml-1">
                          <User className="w-3 h-3" /> Customer Name
                        </label>
                        <div className="w-full bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[14px] font-black rounded-xl px-4 py-2.5 flex items-center justify-between">
                          <span>{customerName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Product Entry Section --- */}
                <div className="px-6 py-2 flex-1 flex flex-col min-h-0">
                  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 shadow-sm flex-1 flex flex-col backdrop-blur-xl overflow-hidden">
                    <div className="mb-4 shrink-0">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <Barcode className="h-6 w-6 text-indigo-400 dark:text-blue-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input
                          type="text"
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                          placeholder="Scan Barcode or Search..."
                          className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/[0.1] text-gray-900 dark:text-white text-[16px] font-black rounded-2xl pl-14 pr-24 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-start overflow-hidden">
                      <div className="border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-white/[0.02] flex flex-col h-full">
                        <div className="bg-slate-50/50 dark:bg-white/[0.02] p-4 border-b border-slate-100 dark:border-white/[0.08] flex flex-col gap-3 shrink-0">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-black rounded-full uppercase tracking-wider">
                                <Tag className="w-2.5 h-2.5" /> Selected Product
                              </div>
                              <h3 className="text-[17px] font-black text-gray-900 dark:text-white tracking-tight">Premium Cotton T-Shirt</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] mb-1 block">Standard MRP</span>
                              <div className="bg-indigo-600 px-3 py-1 rounded-lg shadow-lg">
                                <p className="text-[16px] font-black text-white leading-none">₹1,200</p>
                              </div>
                            </div>
                          </div>

                          {/* Full Metadata Row - Same data as Classic Table */}
                          <div className="flex flex-wrap gap-2">
                            <div title="Product Barcode" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                              <Barcode className="w-3 h-3 text-indigo-500" /> 890123456789
                            </div>
                            <div title="Internal Source Code" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                              <Hash className="w-3 h-3 text-indigo-500" /> SC-101
                            </div>
                            <div title="Product Category" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                              <Store className="w-3 h-3 text-indigo-500" /> Apparel
                            </div>
                            <div title="Color & Size" className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] rounded-lg text-[10px] font-bold text-slate-500 dark:text-white/60 cursor-help transition-colors hover:border-indigo-400">
                              <span className="w-2 h-2 rounded-full bg-black border border-white/20"></span> Black / M
                            </div>
                            <div title="HSN Code (Harmonized System of Nomenclature)" className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg text-[10px] font-black text-emerald-600 cursor-help transition-colors hover:border-emerald-400">
                              HSN: 6109
                            </div>
                            <div title="Tax Description & Calculated Amount" className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-500 cursor-help transition-colors hover:border-indigo-400">
                              Tax: GST 5% (₹50)
                            </div>
                            <div title="Product Sale Mode" className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-lg text-[10px] font-black text-amber-600 cursor-help">
                              <CheckCircle2 className="w-3 h-3" /> Indiv: NO
                            </div>
                          </div>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">Quantity</label>
                              <input
                                type="number"
                                defaultValue="1"
                                className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[18px] font-black rounded-xl px-4 py-3.5 outline-none focus:border-indigo-500 text-center transition-all shadow-inner"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">Discount (₹)</label>
                              <input
                                type="number"
                                defaultValue="201"
                                className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.1] text-rose-600 dark:text-rose-400 text-[18px] font-black rounded-xl px-4 py-3.5 outline-none focus:border-rose-500 text-center transition-all shadow-inner"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-black text-gray-500 dark:text-white/40 uppercase tracking-widest ml-1">Final Price</label>
                              <div className="w-full bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[18px] font-black rounded-xl px-4 py-3.5 text-center shadow-inner">
                                ₹999.00
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 pt-2 shrink-0">
                          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[16px] font-black rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]">
                            <Plus className="w-5 h-5 stroke-[3px]" /> Add to Sale (₹999.00)
                          </button>
                        </div>
                      </div>
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
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <h3 className="text-[14px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Current Sale</h3>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[12px] font-black border border-indigo-100 dark:border-indigo-500/20">
                      {items.length} Items
                    </div>
                  </div>

                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search in cart (Name, Code, Barcode)..."
                      value={cartSearch}
                      onChange={(e) => setCartSearch(e.target.value)}
                      className="w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.1] rounded-xl pl-9 pr-4 py-2.5 text-[12px] font-bold outline-none focus:bg-white dark:focus:bg-white/[0.05] focus:border-indigo-400 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100/80 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/[0.05] flex text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] shrink-0">
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
                        <div className="w-8 text-[11px] font-black text-slate-300 dark:text-white/10">{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-black text-gray-900 dark:text-white leading-tight truncate">{item.productCode}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-indigo-500/70 uppercase">{item.barcode}</span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase">{item.size}/{item.color}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-300 dark:text-white/20 line-through">₹{item.mrp}</span>
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">₹{item.selPrice} / unit</span>
                          </div>
                        </div>
                        <div className="w-16 text-center">
                          <div className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-white/[0.05] rounded-lg text-[12px] font-black text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/[0.05]">
                            {item.qty}
                          </div>
                        </div>
                        <div className="w-24 text-right flex flex-col items-end">
                          <p className="text-[14px] font-black text-gray-900 dark:text-white leading-none">₹{item.amount.toFixed(0)}</p>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                          <button className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-all">
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                            <span className="text-gray-900 dark:text-white font-black">₹3,700.00</span>
                          </div>
                          <div className="bg-slate-100/50 dark:bg-white/[0.02] p-3 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span>CGST (2.5%)</span>
                              <span>₹157.00</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span>SGST (2.5%)</span>
                              <span>₹157.00</span>
                            </div>
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
                        <span className="text-[14px] font-black text-slate-700 dark:text-white/80">2.00</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross</span>
                        <span className="text-[14px] font-black text-slate-700 dark:text-white/80">₹3,700</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-right">Savings</span>
                        <span className="text-[14px] font-black text-rose-600 dark:text-rose-400 text-right">-₹501</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em]">Net Payable</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[16px] font-black text-emerald-600 dark:text-emerald-400">₹</span>
                          <span className="text-[36px] font-[1000] text-emerald-600 dark:text-emerald-400 leading-none tracking-tighter">3,198.00</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        {isDetailsOpen ? 'Hide' : 'Details'}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-white/10 rounded-xl font-black text-[12px] flex items-center justify-center gap-2 transition-all">
                        <PauseCircle className="w-3.5 h-3.5" /> Hold
                      </button>
                      <button className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-[1000] text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                        <CheckCircle2 className="w-4 h-4" /> Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {viewMode === 'classic' && <TotalsFooter />}
    </div>
  );
};

export default SalesEntry;
