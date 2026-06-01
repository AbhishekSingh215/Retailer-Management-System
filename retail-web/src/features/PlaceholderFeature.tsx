import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION_REGISTRY } from '../config/navigation';
import type { NavItem } from '../config/navigation';
import { 
  Plus, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  Info, 
  Star,
  Search,
  Settings as SettingsIcon,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const PlaceholderFeature: React.FC = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const [pinned, setPinned] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Modal & Search Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ──────── MOCK DATABASE STATES ────────
  const [customerDb, setCustomerDb] = useState([
    { id: 1, name: 'Abhishek Singh', phone: '+91 98765 43210', email: 'abhishek@example.com', tier: 'Gold', points: 450 },
    { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@example.com', tier: 'Silver', points: 150 },
    { id: 3, name: 'Rohan Verma', phone: '+91 76543 21098', email: 'rohan@example.com', tier: 'Platinum', points: 1200 },
  ]);

  const [productDb, setProductDb] = useState([
    { id: 1, barcode: '8901234567890', name: 'Premium Basmati Rice 5kg', category: 'Foodgrains', mrp: 12.50, stock: 45 },
    { id: 2, barcode: '8909876543210', name: 'Organic Sunflower Oil 1L', category: 'Oils', mrp: 4.99, stock: 120 },
    { id: 3, barcode: '8901112223334', name: 'Whole Wheat Atta 10kg', category: 'Flour', mrp: 8.75, stock: 12 },
  ]);

  const [supplierDb, setSupplierDb] = useState([
    { id: 1, company: 'RSOFT Distributors', contact: 'Suresh Kumar', phone: '+91 99999 88888', balance: 1450.00 },
    { id: 2, company: 'Apex Logistics', contact: 'Anil Gupta', phone: '+91 88888 77777', balance: 0.00 },
    { id: 3, company: 'Global Food Products', contact: 'Amit Patel', phone: '+91 77777 66666', balance: 5820.00 },
  ]);

  const [employeeDb, setEmployeeDb] = useState([
    { id: 1, name: 'Arjun Kapoor', role: 'Clerk', shift: 'Day Shift', status: 'Active' },
    { id: 2, name: 'Meera Rao', role: 'Cashier', shift: 'Evening Shift', status: 'Active' },
    { id: 3, name: 'Vikram Singh', role: 'Store Manager', shift: 'General Shift', status: 'Active' },
  ]);

  const [storeDb, setStoreDb] = useState([
    { id: 1, name: 'Downtown Outlet', location: 'Sector 15, Block B', type: 'Main Outlet', terminalIp: '192.168.1.10', status: 'Online' },
    { id: 2, name: 'Airport Plaza Store', location: 'Terminal 2 Departure', type: 'Express Kiosk', terminalIp: '192.168.2.20', status: 'Online' },
    { id: 3, name: 'Warehouse Hub', location: 'Industrial Area Phase 1', type: 'Storage Depot', terminalIp: '192.168.3.15', status: 'Offline' },
  ]);

  const [purchaseDb, setPurchaseDb] = useState([
    { id: 1, invoiceNo: 'PUR-2026-001', supplier: 'Global Food Products', date: '2026-05-20', total: 3450.00, status: 'Paid' },
    { id: 2, invoiceNo: 'PUR-2026-002', supplier: 'RSOFT Distributors', date: '2026-05-22', total: 1200.00, status: 'Pending' },
    { id: 3, invoiceNo: 'PUR-2026-003', supplier: 'Apex Logistics', date: '2026-05-23', total: 450.00, status: 'Paid' },
  ]);

  const [returnDb, setReturnDb] = useState([
    { id: 1, returnNo: 'RET-2026-001', origInvoice: 'INV-2026-8941', reason: 'Damaged Packaging', amount: 12.50, status: 'Approved' },
    { id: 2, returnNo: 'RET-2026-002', origInvoice: 'INV-2026-8950', reason: 'Wrong Product Sent', amount: 4.99, status: 'Processing' },
  ]);

  const [adjustmentDb, setAdjustmentDb] = useState([
    { id: 1, product: 'Premium Basmati Rice 5kg', type: 'Wastage (Damaged)', quantity: -2, reason: 'Moisture in warehouse corridor' },
    { id: 2, product: 'Organic Sunflower Oil 1L', type: 'Audit Correction', quantity: +5, reason: 'Double inward scanning' },
  ]);

  // Form Fields State
  const [formFields, setFormFields] = useState<Record<string, any>>({});

  useEffect(() => {
    // Search registry for current path
    let itemFound: NavItem | null = null;
    for (const group of NAVIGATION_REGISTRY) {
      const match = group.items.find(item => item.path === location.pathname);
      if (match) {
        itemFound = match;
        break;
      }
    }
    setActiveItem(itemFound);
    setIsModalOpen(false);
    setSearchQuery('');
    setFormFields({});

    // Read initial pinned state
    const pinnedRoutes = JSON.parse(localStorage.getItem('rsoft_pinned_routes') || '[]');
    setPinned(pinnedRoutes.includes(location.pathname));
  }, [location.pathname]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const togglePin = () => {
    const pinnedRoutes = JSON.parse(localStorage.getItem('rsoft_pinned_routes') || '[]');
    let updated: string[] = [];
    if (pinned) {
      updated = pinnedRoutes.filter((r: string) => r !== location.pathname);
      showNotification('success', `${activeItem?.label} unpinned from sidebar`);
    } else {
      updated = [...pinnedRoutes, location.pathname];
      showNotification('success', `${activeItem?.label} pinned to sidebar`);
    }
    localStorage.setItem('rsoft_pinned_routes', JSON.stringify(updated));
    setPinned(!pinned);
    
    // Fire custom event to sync sidebar
    window.dispatchEvent(new Event('rsoft_pinned_routes_changed'));
  };

  if (!activeItem) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Feature Not Found</h2>
        <p className="text-gray-400 mt-2">The route does not map to any registered feature.</p>
      </div>
    );
  }

  const IconComponent = activeItem.icon;

  // ──────── CRUD FORM HANDLER ────────
  const handleAddMockRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now();

    if (activeItem.id === 'customer-master') {
      const name = formFields.name || 'Jane Doe';
      const phone = formFields.phone || '+91 90000 11111';
      const email = formFields.email || 'jane@example.com';
      const tier = formFields.tier || 'Silver';
      const points = parseInt(formFields.points) || 100;
      setCustomerDb(prev => [...prev, { id, name, phone, email, tier, points }]);
      showNotification('success', 'Mock customer registered successfully.');
    } 
    else if (activeItem.id === 'product-master') {
      const barcode = formFields.barcode || '8908888777766';
      const name = formFields.name || 'New Mock Product';
      const category = formFields.category || 'General';
      const mrp = parseFloat(formFields.mrp) || 9.99;
      const stock = parseInt(formFields.stock) || 50;
      setProductDb(prev => [...prev, { id, barcode, name, category, mrp, stock }]);
      showNotification('success', 'Mock product added to listings.');
    }
    else if (activeItem.id === 'supplier-master') {
      const company = formFields.company || 'QuickSupplies Ltd';
      const contact = formFields.contact || 'John Carter';
      const phone = formFields.phone || '+91 91111 22222';
      const balance = parseFloat(formFields.balance) || 0.00;
      setSupplierDb(prev => [...prev, { id, company, contact, phone, balance }]);
      showNotification('success', 'Mock supplier added.');
    }
    else if (activeItem.id === 'employee-master') {
      const name = formFields.name || 'Sarah Connor';
      const role = formFields.role || 'Cashier';
      const shift = formFields.shift || 'General Shift';
      const status = 'Active';
      setEmployeeDb(prev => [...prev, { id, name, role, shift, status }]);
      showNotification('success', 'Mock employee hired.');
    }
    else if (activeItem.id === 'store-master') {
      const name = formFields.name || 'North Hub Outlet';
      const location = formFields.location || 'Block C, Highway Plaza';
      const type = formFields.type || 'Retail Outlet';
      const terminalIp = formFields.terminalIp || '192.168.4.10';
      const status = 'Online';
      setStoreDb(prev => [...prev, { id, name, location, type, terminalIp, status }]);
      showNotification('success', 'Mock outlet terminal added.');
    }
    else if (activeItem.id === 'purchase-entry') {
      const invoiceNo = formFields.invoiceNo || 'PUR-2026-999';
      const supplier = formFields.supplier || 'RSOFT Distributors';
      const date = new Date().toISOString().split('T')[0];
      const total = parseFloat(formFields.total) || 120.00;
      const status = formFields.status || 'Pending';
      setPurchaseDb(prev => [...prev, { id, invoiceNo, supplier, date, total, status }]);
      showNotification('success', 'Purchase invoice saved.');
    }
    else if (activeItem.id === 'sales-return' || activeItem.id === 'purchase-return') {
      const returnNo = activeItem.id === 'sales-return' ? `SRT-2026-${id.toString().slice(-4)}` : `PRT-2026-${id.toString().slice(-4)}`;
      const origInvoice = formFields.origInvoice || 'INV-2026-1000';
      const reason = formFields.reason || 'Slightly Scratched';
      const amount = parseFloat(formFields.amount) || 15.00;
      const status = 'Approved';
      setReturnDb(prev => [...prev, { id, returnNo, origInvoice, reason, amount, status }]);
      showNotification('success', 'Return adjustment logged.');
    }
    else if (activeItem.id === 'stock-adjustment') {
      const product = formFields.product || 'Organic Sunflower Oil 1L';
      const type = formFields.type || 'Wastage (Damaged)';
      const quantity = parseInt(formFields.quantity) || -1;
      const reason = formFields.reason || 'Damp storage';
      setAdjustmentDb(prev => [...prev, { id, product, type, quantity, reason }]);
      showNotification('success', 'Stock physical adjustment recorded.');
    }

    setIsModalOpen(false);
    setFormFields({});
  };

  const handleRemoveRecord = (id: number) => {
    if (activeItem.id === 'customer-master') setCustomerDb(prev => prev.filter(r => r.id !== id));
    else if (activeItem.id === 'product-master') setProductDb(prev => prev.filter(r => r.id !== id));
    else if (activeItem.id === 'supplier-master') setSupplierDb(prev => prev.filter(r => r.id !== id));
    else if (activeItem.id === 'employee-master') setEmployeeDb(prev => prev.filter(r => r.id !== id));
    else if (activeItem.id === 'store-master') setStoreDb(prev => prev.filter(r => r.id !== id));
    else if (activeItem.id === 'purchase-entry') setPurchaseDb(prev => prev.filter(r => r.id !== id));
    else if (activeItem.id === 'sales-return' || activeItem.id === 'purchase-return') setReturnDb(prev => prev.filter(r => r.id !== id));
    else if (activeItem.id === 'stock-adjustment') setAdjustmentDb(prev => prev.filter(r => r.id !== id));
    
    showNotification('success', 'Simulated entry deleted.');
  };

  const isSettings = activeItem.id.includes('settings');
  const isReports = activeItem.id.startsWith('reports');

  return (
    <div className="p-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-transparent">
      
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

      {/* Floating Simulator Disclaimer */}
      <div className="flex items-center gap-2.5 px-5 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p className="text-[12px] font-bold">
          <span className="font-extrabold uppercase mr-1">Prototype Sandbox:</span>
          This feature ({activeItem.label}) is currently simulated in-memory. Add, edit, or delete items to experience POS workflow behavior.
        </p>
      </div>

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-[#0f0f12] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-6 pt-5 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                <IconComponent className="w-5 h-5 stroke-[2.5px]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-[1000] tracking-tight text-slate-900 dark:text-white leading-none">{activeItem.label}</h1>
                <button 
                  onClick={togglePin}
                  title={pinned ? "Unpin from sidebar" : "Pin to sidebar"}
                  className={`p-1 rounded-lg transition-colors ${pinned ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 dark:text-white/20 hover:text-amber-500'}`}
                >
                  <Star className={`w-4 h-4 ${pinned ? 'fill-amber-500' : ''}`} />
                </button>
              </div>
              <p className="text-[12px] font-medium text-slate-500 dark:text-white/40 mt-1">{activeItem.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSettings && !isReports && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-[900] text-[13px] shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> New Entry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content blocks ─────────────────────────────────────── */}
      
      {/* CASE A: REPORTS PAGES */}
      {isReports && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Daily Target</span>
                <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mt-1">$4,500.00</h3>
                <span className="text-[11px] font-bold text-emerald-500 inline-flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 84% Completed
                </span>
              </div>
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Weekly Revenue</span>
                <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mt-1">$28,941.50</h3>
                <span className="text-[11px] font-bold text-emerald-500 inline-flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.3% YoY
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">System Audits</span>
                <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mt-1">0 Pending</h3>
                <span className="text-[11px] font-bold text-slate-400 inline-flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Integrity Clean
                </span>
              </div>
              <div className="w-12 h-12 bg-violet-500/10 text-violet-500 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest">Simulated Ledger Entries</h3>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-2.5">Date</th>
                    <th>Ref ID</th>
                    <th>Account Category</th>
                    <th className="text-right">Transaction Size</th>
                    <th className="text-center">Integrity Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-800 dark:text-slate-300">
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-3">2026-05-23</td>
                    <td><span className="text-[11px] font-black text-slate-400">#TR-90412</span></td>
                    <td>Counter A Sales</td>
                    <td className="text-right text-emerald-500">+$1,425.00</td>
                    <td className="text-center"><span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-lg">Settled</span></td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-3">2026-05-23</td>
                    <td><span className="text-[11px] font-black text-slate-400">#TR-90408</span></td>
                    <td>Supplier Inward</td>
                    <td className="text-right text-rose-500">-$450.00</td>
                    <td className="text-center"><span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-lg">Settled</span></td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-3">2026-05-22</td>
                    <td><span className="text-[11px] font-black text-slate-400">#TR-90390</span></td>
                    <td>POS Terminal Float</td>
                    <td className="text-right text-indigo-500">+$250.00</td>
                    <td className="text-center"><span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-lg">Settled</span></td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-3">2026-05-21</td>
                    <td><span className="text-[11px] font-black text-slate-400">#TR-90288</span></td>
                    <td>Store Electricity Utility</td>
                    <td className="text-right text-rose-500">-$1,100.00</td>
                    <td className="text-center"><span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-lg">Settled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CASE B: SETTINGS PAGES */}
      {isSettings && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-white/5">General Configuration Parameters</h3>
            
            <div className="space-y-4 text-[13px] font-bold text-slate-800 dark:text-slate-300">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div>
                  <p>Cloud Server Sync Frequency</p>
                  <span className="text-[11px] text-slate-400">Auto backup of POS transactions to remote storage</span>
                </div>
                <select className="bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-gray-900 dark:text-white text-[12px] rounded-lg px-2.5 py-1">
                  <option>Every 5 minutes</option>
                  <option>Hourly</option>
                  <option>Daily at Midnight</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div>
                  <p>Receipt Base Currency Symbol</p>
                  <span className="text-[11px] text-slate-400">Currency rendered on print invoice drafts</span>
                </div>
                <input type="text" defaultValue="$ (USD)" className="w-24 text-center bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-gray-900 dark:text-white text-[12px] rounded-lg py-1 px-2" />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div>
                  <p>Enable Loyalty System Integration</p>
                  <span className="text-[11px] text-slate-400">Accumulate customer ledger loyalty percentage points</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div>
                  <p>Offline Database Fallback</p>
                  <span className="text-[11px] text-slate-400">Switch to localized cache storage during internet loss</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div>
                  <p>Two-Factor Manager PIN Lockout</p>
                  <span className="text-[11px] text-slate-400">Force passcode validation on invoice void operations</span>
                </div>
                <input type="checkbox" className="w-4 h-4 cursor-pointer" />
              </div>
            </div>

            <button 
              onClick={() => showNotification('success', 'Simulated settings saved locally.')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[12px] font-black shadow-lg shadow-indigo-600/20"
            >
              Save System State
            </button>
          </div>

          <div className="bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-[12px] font-black uppercase text-slate-400 tracking-wider">Configuration Support</h4>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">How do adjustments sync?</p>
                  <p className="text-[11px] text-slate-400 mt-1">Adjustments save locally instantly and enqueue in a queue that updates the server once connected.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <SettingsIcon className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">Where are keys configured?</p>
                  <p className="text-[11px] text-slate-400 mt-1">Api connections, database connections and client keys are set inside the server environment files.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CASE C: MOCK TABLES (CRUD forms) */}
      {!isSettings && !isReports && (
        <div className="flex-1 bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-0">
          
          {/* Internal Table Filters */}
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-white/[0.01]">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search simulated entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] rounded-xl text-[12px] outline-none focus:border-indigo-500 text-gray-900 dark:text-white"
              />
            </div>
            <div className="text-[11px] font-bold text-slate-400">
              Showing {
                activeItem.id === 'customer-master' ? customerDb.length :
                activeItem.id === 'product-master' ? productDb.length :
                activeItem.id === 'supplier-master' ? supplierDb.length :
                activeItem.id === 'employee-master' ? employeeDb.length :
                activeItem.id === 'store-master' ? storeDb.length :
                activeItem.id === 'purchase-entry' ? purchaseDb.length :
                activeItem.id === 'sales-return' || activeItem.id === 'purchase-return' ? returnDb.length :
                adjustmentDb.length
              } sandbox records
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white">
                  
                  {activeItem.id === 'customer-master' && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Customer Name</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Contact Phone</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Email Address</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Membership Tier</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">Loyalty Points</th>
                    </>
                  )}

                  {activeItem.id === 'product-master' && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">UPC Barcode</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Product Name</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Stock Category</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">MRP Cost</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Qty in Stock</th>
                    </>
                  )}

                  {activeItem.id === 'supplier-master' && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Company Name</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Primary Contact</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Contact Phone</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">Outstanding Bal</th>
                    </>
                  )}

                  {activeItem.id === 'employee-master' && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Staff Name</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Role Type</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Allocated Shift</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                    </>
                  )}

                  {activeItem.id === 'store-master' && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Outlet Name</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Physical Location</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Terminal Type</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Register IP Address</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Connection</th>
                    </>
                  )}

                  {activeItem.id === 'purchase-entry' && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Invoice Number</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Supplier Vendor</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Invoice Date</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">Inward Total</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Payment Status</th>
                    </>
                  )}

                  {(activeItem.id === 'sales-return' || activeItem.id === 'purchase-return') && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Return Reference</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Original Bill</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Reason for Return</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">Refund Value</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Approval State</th>
                    </>
                  )}

                  {activeItem.id === 'stock-adjustment' && (
                    <>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-[10%]">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Product Item Name</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Adjustment Category</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Quantity Delta</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Explanation Reason</th>
                    </>
                  )}

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-bold text-slate-800 dark:text-slate-300">
                
                {/* 1. CUSTOMERS LOOP */}
                {activeItem.id === 'customer-master' && customerDb.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.phone.includes(searchQuery)).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.name}</td>
                    <td className="px-4 py-3.5">{row.phone}</td>
                    <td className="px-4 py-3.5 text-slate-400">{row.email}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                        row.tier === 'Platinum' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        row.tier === 'Gold' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>{row.tier}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-indigo-500 font-extrabold">{row.points} pts</td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

                {/* 2. PRODUCTS LOOP */}
                {activeItem.id === 'product-master' && productDb.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.barcode.includes(searchQuery)).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">{row.barcode}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.name}</td>
                    <td className="px-4 py-3.5">{row.category}</td>
                    <td className="px-4 py-3.5 text-right text-indigo-500 font-extrabold">${row.mrp.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg ${row.stock <= 15 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-white/[0.05]'}`}>
                        {row.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

                {/* 3. SUPPLIERS LOOP */}
                {activeItem.id === 'supplier-master' && supplierDb.filter(r => r.company.toLowerCase().includes(searchQuery.toLowerCase()) || r.contact.toLowerCase().includes(searchQuery.toLowerCase())).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.company}</td>
                    <td className="px-4 py-3.5">{row.contact}</td>
                    <td className="px-4 py-3.5 text-slate-400">{row.phone}</td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-indigo-500">${row.balance.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

                {/* 4. EMPLOYEES LOOP */}
                {activeItem.id === 'employee-master' && employeeDb.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.role.toLowerCase().includes(searchQuery.toLowerCase())).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.name}</td>
                    <td className="px-4 py-3.5">{row.role}</td>
                    <td className="px-4 py-3.5 text-slate-400">{row.shift}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-0.5 rounded-lg uppercase tracking-wider font-extrabold">Active</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

                {/* 5. STORES LOOP */}
                {activeItem.id === 'store-master' && storeDb.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase())).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.name}</td>
                    <td className="px-4 py-3.5 text-slate-400">{row.location}</td>
                    <td className="px-4 py-3.5">{row.type}</td>
                    <td className="px-4 py-3.5 font-mono text-[11px]">{row.terminalIp}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-wider border ${
                        row.status === 'Online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                      }`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

                {/* 6. PURCHASES LOOP */}
                {activeItem.id === 'purchase-entry' && purchaseDb.filter(r => r.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) || r.supplier.toLowerCase().includes(searchQuery.toLowerCase())).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.invoiceNo}</td>
                    <td className="px-4 py-3.5">{row.supplier}</td>
                    <td className="px-4 py-3.5 text-slate-400">{row.date}</td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-indigo-500">${row.total.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-lg border font-black uppercase tracking-wider ${
                        row.status === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

                {/* 7. RETURNS LOOP */}
                {(activeItem.id === 'sales-return' || activeItem.id === 'purchase-return') && returnDb.filter(r => r.returnNo.toLowerCase().includes(searchQuery.toLowerCase()) || r.origInvoice.toLowerCase().includes(searchQuery.toLowerCase())).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.returnNo}</td>
                    <td className="px-4 py-3.5 font-mono text-[12px]">{row.origInvoice}</td>
                    <td className="px-4 py-3.5 text-slate-400">{row.reason}</td>
                    <td className="px-4 py-3.5 text-right font-extrabold text-rose-500">${row.amount.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-black uppercase tracking-wider ${
                        row.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

                {/* 8. ADJUSTMENTS LOOP */}
                {activeItem.id === 'stock-adjustment' && adjustmentDb.filter(r => r.product.toLowerCase().includes(searchQuery.toLowerCase())).map(row => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/[0.03]">
                    <td className="px-4 py-3.5 text-slate-400 font-black">#{row.id}</td>
                    <td className="px-4 py-3.5 text-slate-900 dark:text-white font-[900]">{row.product}</td>
                    <td className="px-4 py-3.5 text-slate-400">{row.type}</td>
                    <td className="px-4 py-3.5 text-center font-extrabold">
                      <span className={`px-2 py-0.5 rounded-lg text-[11px] ${row.quantity < 0 ? 'bg-rose-500/15 text-rose-600' : 'bg-emerald-500/15 text-emerald-600'}`}>
                        {row.quantity > 0 ? `+${row.quantity}` : row.quantity} units
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 italic font-medium">{row.reason}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => handleRemoveRecord(row.id)} className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal for adding records */}
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
                <h3 className="text-[17px] font-[1000] uppercase text-slate-800 dark:text-white">
                  Add Sandbox {activeItem.label} Entry
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMockRecord} className="space-y-4 text-left">
                
                {/* A. Customer Form Fields */}
                {activeItem.id === 'customer-master' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Customer Full Name</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all" placeholder="e.g. Ramesh Dev" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Mobile Phone Number</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all" placeholder="e.g. +91 94444 55555" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Loyalty Tier</label>
                        <select onChange={(e) => setFormFields(f => ({ ...f, tier: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-950 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500">
                          <option value="Silver">Silver Member</option>
                          <option value="Gold">Gold Member</option>
                          <option value="Platinum">Platinum Member</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Initial Points</label>
                        <input type="number" onChange={(e) => setFormFields(f => ({ ...f, points: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" defaultValue="100" />
                      </div>
                    </div>
                  </>
                )}

                {/* B. Product Form Fields */}
                {activeItem.id === 'product-master' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Item Title Name</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. Corn Flakes 500g" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">GTIN Barcode UPC</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, barcode: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. 890456123789" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">MRP Retail Price ($)</label>
                        <input type="number" step="0.01" required onChange={(e) => setFormFields(f => ({ ...f, mrp: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="0.00" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Opening Stock Quantity</label>
                        <input type="number" required onChange={(e) => setFormFields(f => ({ ...f, stock: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="10" />
                      </div>
                    </div>
                  </>
                )}

                {/* C. Supplier Form Fields */}
                {activeItem.id === 'supplier-master' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Supplier Company</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, company: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. PepsiCo Distributors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Contact Person Name</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, contact: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. John Carter" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Contact Phone</label>
                        <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="+91 99999 00000" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Outstanding Balance ($)</label>
                        <input type="number" onChange={(e) => setFormFields(f => ({ ...f, balance: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" defaultValue="0.00" />
                      </div>
                    </div>
                  </>
                )}

                {/* D. Other general forms */}
                {activeItem.id === 'employee-master' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Staff Full Name</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. Ramesh Lal" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Assigned Role</label>
                        <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, role: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="e.g. Cashier" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Operational Shift</label>
                        <select onChange={(e) => setFormFields(f => ({ ...f, shift: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-950 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none">
                          <option>General Shift (09:00 - 18:00)</option>
                          <option>Morning Shift (07:00 - 15:00)</option>
                          <option>Evening Shift (15:00 - 23:00)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeItem.id === 'store-master' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Store / Outlet Name</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. Airport Kiosk Store" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Location Address</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, location: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="e.g. Floor 2 Departure Gate 4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Register IP Terminal</label>
                        <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, terminalIp: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="192.168.1.10" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Outlet Category</label>
                        <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, type: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="e.g. Retail POS Outlet" />
                      </div>
                    </div>
                  </>
                )}

                {activeItem.id === 'purchase-entry' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Purchase Invoice Ref #</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, invoiceNo: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. PUR-2026-904" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Supplier Vendor</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, supplier: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. RSOFT Distributors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Invoice Net Value ($)</label>
                        <input type="number" step="0.01" required onChange={(e) => setFormFields(f => ({ ...f, total: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="0.00" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Settlement Status</label>
                        <select onChange={(e) => setFormFields(f => ({ ...f, status: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-955 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none">
                          <option value="Paid">Fully Settled (Paid)</option>
                          <option value="Pending">Outstanding Balance (Pending)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {(activeItem.id === 'sales-return' || activeItem.id === 'purchase-return') && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Original Invoice Ref #</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, origInvoice: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. INV-2026-8941" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Reason for Return</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, reason: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. Expired Shelf Date" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Refund Amount Credit ($)</label>
                      <input type="number" step="0.01" required onChange={(e) => setFormFields(f => ({ ...f, amount: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="0.00" />
                    </div>
                  </>
                )}

                {activeItem.id === 'stock-adjustment' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Product Item Name</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, product: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. Whole Wheat Atta 10kg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Adjustment Type</label>
                        <select onChange={(e) => setFormFields(f => ({ ...f, type: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-955 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none">
                          <option value="Wastage (Damaged)">Wastage (Damaged)</option>
                          <option value="Audit Correction">Audit Correction</option>
                          <option value="Wastage (Expired)">Wastage (Expired)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Quantity Delta (positive/negative)</label>
                        <input type="number" required onChange={(e) => setFormFields(f => ({ ...f, quantity: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none" placeholder="e.g. -2 or +5" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Detailed Explanation Reason</label>
                      <input type="text" required onChange={(e) => setFormFields(f => ({ ...f, reason: e.target.value }))} className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.1] text-gray-900 dark:text-white text-[13px] font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500" placeholder="e.g. Mice damaged sack packaging" />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-[12px] hover:bg-slate-200 transition-all text-center">
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[12px] flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:scale-95">
                    <Check className="w-4 h-4" /> Save Entry to Sandbox
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

export default PlaceholderFeature;
