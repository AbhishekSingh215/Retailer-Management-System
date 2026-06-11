import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, CheckCircle2, CreditCard } from 'lucide-react';

interface PaymentType {
  id: number;
  name: string;
}

interface SettlePaymentPanelProps {
  formMode: string;
  paymentTypes: PaymentType[];
  paymentAmounts: Record<number, number>;
  setPaymentAmounts: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  netPayable: number;
  setIsPaymentModalOpen: (open: boolean) => void;
  saveToBackend: (mode: string) => Promise<any> | void;
  isSaving: boolean;
  isCredit: boolean;
  setIsCredit: (val: boolean) => void;
}

export const SettlePaymentPanel: React.FC<SettlePaymentPanelProps> = ({
  formMode,
  paymentTypes,
  paymentAmounts,
  setPaymentAmounts,
  netPayable,
  setIsPaymentModalOpen,
  saveToBackend,
  isSaving,
  isCredit,
  setIsCredit
}) => {
  const isReadOnly = formMode === 'LOCKED' || formMode === 'VIEW';

  const rawTypes = paymentTypes && paymentTypes.length > 0 ? paymentTypes : [];

  const visiblePaymentTypes = rawTypes.filter(pt => {
    const name = pt.name.toLowerCase();
    return name !== 'debitnote' && name !== 'discount' && name !== 'creditnote';
  });

  const [activePaymentModes, setActivePaymentModes] = useState<number[]>([]);

  // Synchronize active modes based on paymentAmounts and paymentTypes (appending only, preventing zero-value modes from hiding)
  useEffect(() => {
    const active: number[] = [...activePaymentModes];
    let changed = false;

    Object.keys(paymentAmounts).forEach(key => {
      const id = Number(key);
      if (paymentAmounts[id] > 0 && !active.includes(id)) {
        active.push(id);
        changed = true;
      }
    });

    if (active.length === 0) {
      const cashType = visiblePaymentTypes.find(t => t.name.toLowerCase().includes('cash'));
      if (cashType) {
        active.push(cashType.id);
        changed = true;
      } else if (visiblePaymentTypes.length > 0) {
        active.push(visiblePaymentTypes[0].id);
        changed = true;
      }
    }

    if (changed) {
      setActivePaymentModes(Array.from(new Set(active)));
    }
  }, [paymentAmounts, visiblePaymentTypes]);

  const paymentModesInfo = visiblePaymentTypes.map(pt => {
    const name = pt.name.toLowerCase();

    let color = 'text-blue-500 dark:text-blue-400';
    let activeStyle = 'border-blue-200/20 bg-blue-50/50 dark:bg-blue-950/10';
    let badgeStyle = 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-500/30 dark:text-blue-400 shadow-blue-500/10';
    let placeholder = `Enter details for ${pt.name}...`;

    if (name.includes('cash')) {
      color = 'text-emerald-500 dark:text-emerald-400';
      activeStyle = 'border-emerald-200/20 bg-emerald-50/50 dark:bg-emerald-950/10';
      badgeStyle = 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-400 shadow-emerald-500/10';
      placeholder = 'Ready for retail transactions.';
    } else if (name.includes('upi')) {
      color = 'text-violet-500 dark:text-violet-400';
      activeStyle = 'border-violet-200/20 bg-violet-50/50 dark:bg-violet-950/10';
      badgeStyle = 'bg-violet-50 border-violet-300 text-violet-700 dark:bg-violet-950/40 dark:border-violet-500/30 dark:text-violet-400 shadow-violet-500/10';
      placeholder = 'Future UPI Txn Ref ID...';
    } else if (name.includes('card')) {
      color = 'text-indigo-500 dark:text-indigo-400';
      activeStyle = 'border-indigo-200/20 bg-indigo-50/50 dark:bg-indigo-950/10';
      badgeStyle = 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-500/30 dark:text-indigo-400 shadow-indigo-500/10';
      placeholder = 'Future Card Auth Code...';
    } else if (name.includes('advance')) {
      color = 'text-amber-500 dark:text-amber-400';
      activeStyle = 'border-amber-200/20 bg-amber-50/50 dark:bg-amber-950/10';
      badgeStyle = 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-500/30 dark:text-amber-400 shadow-amber-500/10';
      placeholder = 'Future Advance Voucher Ref...';
    } else if (name.includes('bank')) {
      color = 'text-blue-500 dark:text-blue-400';
      activeStyle = 'border-blue-200/20 bg-blue-50/50 dark:bg-blue-950/10';
      badgeStyle = 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-500/30 dark:text-blue-400 shadow-blue-500/10';
      placeholder = 'Future Cheque/UTR Number...';
    }

    return {
      id: pt.id,
      label: pt.name,
      value: paymentAmounts[pt.id] || 0,
      setter: (val: number) => {
        setPaymentAmounts(prev => ({
          ...prev,
          [pt.id]: val
        }));
      },
      color,
      activeStyle,
      badgeStyle,
      placeholder
    };
  });

  const totalPaid = visiblePaymentTypes.reduce((sum, pt) => sum + (paymentAmounts[pt.id] || 0), 0);
  const remaining = Math.max(0, netPayable - totalPaid);
  const isPaymentValid = isCredit
    ? (totalPaid <= netPayable + 0.01)
    : (Math.abs(totalPaid - netPayable) < 0.01);

  const adjustAmountsOnChange = (changedModeId: number, newVal: number) => {
    if (isCredit) {
      setPaymentAmounts(prev => ({ ...prev, [changedModeId]: newVal }));
      return;
    }
    const nextAmounts = { ...paymentAmounts };
    nextAmounts[changedModeId] = newVal;

    const otherActiveIds = activePaymentModes.filter(id => id !== changedModeId);
    const otherSum = otherActiveIds.reduce((sum, id) => sum + (nextAmounts[id] || 0), 0);
    const proposedTotal = newVal + otherSum;
    let diff = Number((netPayable - proposedTotal).toFixed(2));

    if (diff > 0) {
      const cashMode = visiblePaymentTypes.find(t => t.name.toLowerCase().includes('cash'));
      if (cashMode && otherActiveIds.includes(cashMode.id)) {
        nextAmounts[cashMode.id] = Number(((nextAmounts[cashMode.id] || 0) + diff).toFixed(2));
      } else if (otherActiveIds.length > 0) {
        const targetId = otherActiveIds[0];
        nextAmounts[targetId] = Number(((nextAmounts[targetId] || 0) + diff).toFixed(2));
      } else if (cashMode) {
        nextAmounts[cashMode.id] = diff;
        setActivePaymentModes(prev => Array.from(new Set([...prev, cashMode.id])));
      }
    } else if (diff < 0) {
      let excessToSubtract = Math.abs(diff);
      const sortedOtherIds = [...otherActiveIds].sort((a, b) => {
        const nameA = visiblePaymentTypes.find(t => t.id === a)?.name.toLowerCase() || '';
        const nameB = visiblePaymentTypes.find(t => t.id === b)?.name.toLowerCase() || '';
        if (nameA.includes('cash')) return -1;
        if (nameB.includes('cash')) return 1;
        return 0;
      });

      for (const id of sortedOtherIds) {
        const val = nextAmounts[id] || 0;
        if (val > 0) {
          const sub = Math.min(val, excessToSubtract);
          nextAmounts[id] = Number((val - sub).toFixed(2));
          excessToSubtract = Number((excessToSubtract - sub).toFixed(2));
          if (excessToSubtract <= 0.005) break;
        }
      }
    }

    setPaymentAmounts(nextAmounts);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0d0d0d] text-slate-800 dark:text-slate-100 text-left">
      {/* Header */}
      <div className="h-20 border-b border-slate-150 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02] px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-0.5">Settle Payment</span>
            <h3 className="text-[18px] font-[1000] text-gray-900 dark:text-white tracking-tight leading-none">Split Payment Modes</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPaymentModalOpen(false)}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Summary Dashboard Banner */}
      <div className="p-6 bg-slate-50 dark:bg-white/[0.01] border-b border-slate-150 dark:border-white/[0.05] grid grid-cols-3 gap-4 text-center shrink-0">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Net Payable</span>
          <span className="text-[16px] font-[1000] text-indigo-600 dark:text-indigo-400">
            ₹{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="space-y-1 border-x border-slate-200 dark:border-white/10">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Total Paid</span>
          <span className={`text-[16px] font-[1000] ${Math.abs(totalPaid - netPayable) < 0.01 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-350'}`}>
            ₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Remaining</span>
          <span className={`text-[16px] font-[1000] ${remaining > 0.01 ? 'text-rose-500 font-black' : 'text-emerald-500 font-black'}`}>
            ₹{remaining.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Credit Terms Banner */}
      <div className="mx-6 mt-4 p-4 rounded-2xl border border-slate-150 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="text-[12px] font-[800] text-gray-900 dark:text-white leading-tight">Allow Credit Sale</h4>
            <p className="text-[10px] text-slate-400 dark:text-white/40 leading-snug mt-0.5">
              {isCredit 
                ? "Customer can make a partial payment. Remaining balance goes to outstanding credit."
                : "Full payment of the net payable amount is required."}
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={isReadOnly}
          onClick={() => setIsCredit(!isCredit)}
          className={`w-10 h-6 rounded-full p-0.5 transition-all duration-300 flex items-center shrink-0 ${
            isCredit ? 'bg-rose-500' : 'bg-slate-300 dark:bg-white/20'
          } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
              isCredit ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Toggle Badges Container */}
      <div className="px-6 py-4 flex flex-wrap gap-2 justify-center border-b border-slate-100 dark:border-white/[0.05] shrink-0 bg-slate-50/50 dark:bg-white/[0.01]">
        {paymentModesInfo.map((mode) => {
          const isActive = activePaymentModes.includes(mode.id);
          return (
            <button
              key={mode.id}
              type="button"
              disabled={isReadOnly}
              onClick={() => {
                const isCash = mode.label.toLowerCase().includes('cash');
                const cashMode = paymentModesInfo.find(m => m.label.toLowerCase().includes('cash'));

                if (isActive) {
                  if (!isCash) {
                    if (cashMode) {
                      cashMode.setter(Number(((cashMode.value || 0) + mode.value).toFixed(2)));
                    }
                    mode.setter(0);
                    setActivePaymentModes(prev => prev.filter(id => id !== mode.id));
                  }
                } else {
                  if (activePaymentModes.length === 1) {
                    paymentModesInfo.forEach(m => {
                      if (m.id !== mode.id) {
                        m.setter(0);
                      }
                    });
                    mode.setter(netPayable);
                  } else {
                    mode.setter(0);
                  }
                  setActivePaymentModes(prev => [...prev, mode.id]);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 active:scale-95 ${isActive
                ? mode.badgeStyle
                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:border-indigo-400'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-white/20'}`}></span>
              {mode.label}
              {isActive && mode.value > 0 && (
                <span className="ml-1 text-[8px] font-bold opacity-80">
                  ₹{mode.value.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Payment Fields Grid (Accordion Mode) */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
        {paymentModesInfo.filter(mode => activePaymentModes.includes(mode.id)).map((mode) => {
          const rem = netPayable - totalPaid;
          return (
            <div key={mode.id} className={`flex flex-col gap-3 p-4 border rounded-2xl transition-all ${mode.activeStyle}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${mode.color} bg-current`}></span>
                  <span className={`text-[12px] font-black tracking-tight ${mode.color}`}>{mode.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Fill remaining amount button (hidden when credit enabled) */}
                  {!isReadOnly && !isCredit && rem > 0.01 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newVal = Number(((mode.value || 0) + rem).toFixed(2));
                        mode.setter(newVal);
                      }}
                      className="p-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all"
                      title="+ Fill"
                    >
                      + Fill
                    </button>
                  )}

                  {/* Remove mode button (except for cash) */}
                  {!isReadOnly && !mode.label.toLowerCase().includes('cash') && (
                    <button
                      type="button"
                      onClick={() => {
                        const cashMode = paymentModesInfo.find(m => m.label.toLowerCase().includes('cash'));
                        if (cashMode) {
                          cashMode.setter(Number(((cashMode.value || 0) + mode.value).toFixed(2)));
                        }
                        mode.setter(0);
                        setActivePaymentModes(prev => prev.filter(id => id !== mode.id));
                      }}
                      className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 dark:text-rose-400 rounded-lg transition-all"
                      title="Remove mode"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    readOnly={isReadOnly}
                    value={mode.value || ''}
                    onChange={(e) => {
                      if (isReadOnly) return;
                      const val = parseFloat(e.target.value);
                      const cleanedVal = isNaN(val) ? 0 : val;
                      adjustAmountsOnChange(mode.id, cleanedVal);
                    }}
                    className={`w-full border rounded-xl pl-7 pr-3 py-1.5 text-[13px] font-[1000] focus:outline-none focus:ring-2 text-right shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black dark:text-white ${isReadOnly ? 'bg-slate-50 dark:bg-white/[0.01] cursor-not-allowed border-slate-100 dark:border-white/[0.05] focus:ring-0 focus:border-slate-100' : 'bg-white dark:bg-[#151518] border-slate-200 dark:border-white/[0.1] focus:border-indigo-500 focus:ring-indigo-500/20'}`}
                  />
                </div>

                {/* Future reference / detail field placeholder */}
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    placeholder={mode.placeholder}
                    className="w-full bg-slate-50/50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.05] rounded-xl px-3 py-1.5 text-[11px] font-medium text-slate-400 dark:text-white/20 outline-none cursor-not-allowed select-none italic"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-slate-50/50 dark:bg-[#121215] border-t border-slate-100 dark:border-white/[0.08] flex gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setIsPaymentModalOpen(false)}
          className="flex-1 py-3 rounded-xl font-bold text-[12px] text-slate-500 dark:text-white/60 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all"
        >
          {isReadOnly ? 'Close Panel' : 'Back to Cart'}
        </button>
        {!isReadOnly && (
          <button
            type="button"
            onClick={() => {
              saveToBackend('LOCKED');
            }}
            disabled={!isPaymentValid || isSaving}
            className={`flex-[1.5] py-3 rounded-xl font-[1000] text-[12px] text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 ${isPaymentValid && !isSaving
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'
              : 'bg-slate-300 dark:bg-white/5 text-slate-400 dark:text-white/20 cursor-not-allowed shadow-none'
              }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Complete Payment'}
          </button>
        )}
      </div>
    </div>
  );
};
