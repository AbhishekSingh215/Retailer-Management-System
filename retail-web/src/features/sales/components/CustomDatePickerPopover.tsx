import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const formatDateStr = (y: number, m: number, d: number) => {
  const dateObj = new Date(y, m, d);
  const yr = dateObj.getFullYear();
  const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
  const da = String(dateObj.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
};

export const getCalendarDays = (monthDate: Date) => {
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

interface CustomDatePickerPopoverProps {
  onClose: () => void;
  alignClass?: string;
  docDate: string;
  setDocDate: (dateStr: string) => void;
  pickerMonth: Date;
  setPickerMonth: (d: Date) => void;
}

export const CustomDatePickerPopover: React.FC<CustomDatePickerPopoverProps> = ({
  onClose,
  alignClass = "absolute top-full left-0 mt-2",
  docDate,
  setDocDate,
  pickerMonth,
  setPickerMonth
}) => {
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
        <div className="flex items-center">
          <select
            value={pickerMonth.getMonth()}
            onChange={(e) => setPickerMonth(new Date(pickerMonth.getFullYear(), parseInt(e.target.value), 1))}
            className="bg-transparent text-[14px] font-[1000] text-slate-900 dark:text-white tracking-tight outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 rounded px-1.5 py-0.5 transition-colors"
          >
            {monthNames.map((m, i) => (
              <option key={m} value={i} className="text-black">{m}</option>
            ))}
          </select>
          <select
            value={pickerMonth.getFullYear()}
            onChange={(e) => setPickerMonth(new Date(parseInt(e.target.value), pickerMonth.getMonth(), 1))}
            className="bg-transparent text-[14px] font-[1000] text-slate-900 dark:text-white tracking-tight outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 rounded px-1.5 py-0.5 transition-colors"
          >
            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 30 + i).map(y => (
              <option key={y} value={y} className="text-black">{y}</option>
            ))}
          </select>
        </div>
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
