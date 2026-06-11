import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Sunrise,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  isPositive, 
  colorClass 
}: { 
  title: string, 
  value: string, 
  change: string, 
  icon: React.ReactNode, 
  isPositive: boolean,
  colorClass: string
}) => (
  <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-3xl p-6 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
    {/* Soft top highlight */}
    <div className="absolute top-0 left-0 w-full h-[1px] hidden dark:block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none"></div>
    
    {/* Hover glow effect */}
    <div className={`absolute top-[-50%] right-[-20%] w-[160px] h-[160px] rounded-full blur-[45px] pointer-events-none transition-all duration-500 opacity-20 dark:opacity-10 group-hover:scale-125 ${colorClass}`}></div>

    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-gray-400 dark:text-[#8F94A3] text-[11px] font-black tracking-widest uppercase mb-2.5">{title}</p>
        <h3 className="text-gray-900 dark:text-white text-[32px] font-[1000] tracking-tight mb-2 leading-none">{value}</h3>
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${
            isPositive 
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
          }`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> : <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />}
            {change}
          </span>
          <span className="text-slate-400 dark:text-white/30 text-[11px] font-bold">vs last week</span>
        </div>
      </div>
      <div className="w-12 h-12 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.08] rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:rotate-6">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('Admin');
  const [activeTab, setActiveTab] = useState('7D');

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    if (storedName) setUserName(storedName);
  }, []);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return { text: 'Good Morning', icon: <Sunrise className="w-6 h-6 stroke-[2.2] text-amber-500 animate-pulse" /> };
    if (hrs < 17) return { text: 'Good Afternoon', icon: <Sun className="w-6 h-6 stroke-[2.2] text-orange-500 animate-pulse" /> };
    if (hrs < 22) return { text: 'Good Evening', icon: <Sunset className="w-6 h-6 stroke-[2.2] text-indigo-400 animate-pulse" /> };
    return { text: 'Good Night', icon: <Moon className="w-6 h-6 stroke-[2.2] text-violet-400 animate-pulse" /> };
  };

  const greeting = getGreeting();

  // Format today's date
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Static Data for Premium SVG Line Chart
  const chartData = [
    { label: 'Mon', value: 18000, x: 50, y: 190 },
    { label: 'Tue', value: 24000, x: 130, y: 150 },
    { label: 'Wed', value: 19000, x: 210, y: 180 },
    { label: 'Thu', value: 28450, x: 290, y: 120 },
    { label: 'Fri', value: 38900, x: 370, y: 60 },
    { label: 'Sat', value: 31000, x: 450, y: 100 },
    { label: 'Sun', value: 35000, x: 530, y: 80 }
  ];

  // SVG Drawing helpers
  const points = chartData.map(d => `${d.x},${d.y}`).join(' ');
  const closedPoints = `50,230 ${points} 530,230`;

  // Static Recent Transactions Data with Indian Rupees
  const recentTransactions = [
    { id: '#9662', customer: 'Walk-in Customer', time: '10 Mins Ago', amount: '₹4,032.00', status: 'Completed', type: 'UPI' },
    { id: '#9661', customer: 'Abhishek Singh', time: '1 Hour Ago', amount: '₹12,450.00', status: 'Completed', type: 'Cash' },
    { id: '#9660', customer: 'Rahul Sharma', time: '3 Hours Ago', amount: '₹2,520.00', status: 'Draft', type: 'Card' },
    { id: '#9659', customer: 'Walk-in Customer', time: 'Yesterday', amount: '₹1,890.00', status: 'Completed', type: 'UPI' },
    { id: '#9658', customer: 'Priya Patel', time: 'Yesterday', amount: '₹8,920.00', status: 'Completed', type: 'UPI' }
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-16 flex-1 min-h-0 overflow-y-auto custom-scrollbar w-full">
      
      {/* Page Header */}
      <div className="bg-white/70 dark:bg-[#0B0C12]/80 backdrop-blur-xl border border-white/40 dark:border-white/[0.05] rounded-3xl p-6 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 mt-4 relative overflow-hidden group">
        {/* Soft decorative glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.08] flex items-center justify-center shadow-inner">
            {greeting.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-2 py-0.5 rounded-lg text-indigo-600 dark:text-indigo-400 font-black tracking-widest uppercase">
                {greeting.text}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-400 font-bold ml-1">{getFormattedDate()}</span>
            </div>
            <h1 className="text-[26px] font-black text-gray-900 dark:text-white tracking-tight leading-tight mt-1.5">
              Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent font-extrabold">{userName}</span>
            </h1>
            <p className="text-gray-500 dark:text-[#8F94A3] text-[13px] font-semibold mt-1">
              Here's what's happening with your store's sales and activity today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button className="px-4 py-2.5 bg-white dark:bg-[#121212]/50 border-2 border-slate-200 dark:border-white/[0.08] text-gray-700 dark:text-white/80 text-[13px] font-black rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95">
            Export Report
          </button>
          <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-[13px] font-black rounded-xl transition-all shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95">
            New Transaction
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value="₹1,24,563.00" 
          change="12.5%" 
          icon={<TrendingUp className="w-5 h-5 stroke-[2.5]" />} 
          isPositive={true} 
          colorClass="bg-indigo-500"
        />
        <StatCard 
          title="Total Orders" 
          value="1,423" 
          change="8.2%" 
          icon={<ShoppingBag className="w-5 h-5 stroke-[2.5]" />} 
          isPositive={true} 
          colorClass="bg-emerald-500"
        />
        <StatCard 
          title="New Customers" 
          value="324" 
          change="4.1%" 
          icon={<Users className="w-5 h-5 stroke-[2.5]" />} 
          isPositive={true} 
          colorClass="bg-amber-500"
        />
        <StatCard 
          title="Active Expenses" 
          value="₹12,450.00" 
          change="2.4%" 
          icon={<CreditCard className="w-5 h-5 stroke-[2.5]" />} 
          isPositive={false} 
          colorClass="bg-rose-500"
        />
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-3xl p-6 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[18px] font-black text-gray-900 dark:text-white tracking-tight">Sales Analytics</h2>
              <p className="text-[12px] font-semibold text-slate-400">Track and analyze revenue performance</p>
            </div>
            {/* Chart Filter Tabs */}
            <div className="flex bg-slate-100 dark:bg-white/[0.03] p-1 border border-slate-200 dark:border-white/[0.08] rounded-xl">
              {['7D', '1M', '3M', '1Y'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg tracking-wider transition-all ${
                    activeTab === tab 
                      ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="relative w-full h-[280px] flex items-center justify-center select-none bg-slate-50/50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03] rounded-2xl p-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 260">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="60" x2="550" y2="60" stroke="#94A3B8" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="120" x2="550" y2="120" stroke="#94A3B8" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="180" x2="550" y2="180" stroke="#94A3B8" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="230" x2="550" y2="230" stroke="#94A3B8" strokeOpacity="0.15" strokeWidth="1.5" />

              {/* Gradient Area Fill */}
              <polygon points={closedPoints} fill="url(#chartGlow)" />

              {/* Line Path */}
              <polyline
                fill="none"
                stroke="#6366F1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />

              {/* Data Points */}
              {chartData.map((d, i) => (
                <g key={i} className="group/dot cursor-pointer">
                  {/* Glowing Outer Dot */}
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r="9"
                    className="fill-indigo-500/20 opacity-0 group-hover/dot:opacity-100 transition-all duration-300"
                  />
                  {/* Central Dot */}
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r="4"
                    fill="#FFF"
                    stroke="#6366F1"
                    strokeWidth="3.5"
                    className="transition-all duration-300 group-hover/dot:r-5"
                  />
                  {/* Tooltip on Hover */}
                  <g className="opacity-0 group-hover/dot:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <rect
                      x={d.x - 35}
                      y={d.y - 35}
                      width="70"
                      height="24"
                      rx="6"
                      fill="#0B0C12"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                    />
                    <text
                      x={d.x}
                      y={d.y - 20}
                      fill="#FFF"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ₹{(d.value / 1000).toFixed(1)}k
                    </text>
                  </g>
                </g>
              ))}

              {/* Chart Labels */}
              {chartData.map((d, i) => (
                <text
                  key={i}
                  x={d.x}
                  y="250"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              ))}

              {/* Y Axis Labels */}
              <text x="35" y="64" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="end">40k</text>
              <text x="35" y="124" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="end">25k</text>
              <text x="35" y="184" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="end">10k</text>
            </svg>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-3xl p-6 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between transition-all duration-300">
          <div className="mb-4">
            <h2 className="text-[18px] font-black text-gray-900 dark:text-white tracking-tight">Recent Transactions</h2>
            <p className="text-[12px] font-semibold text-slate-400">Live feed of retail sales invoices</p>
          </div>

          {/* Transactions Feed list */}
          <div className="flex-1 flex flex-col gap-3.5 my-2">
            {recentTransactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/[0.03] group hover:bg-indigo-50/10 dark:hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-black text-slate-900 dark:text-white">{tx.customer}</span>
                      <span className="text-[10px] font-black text-slate-400">({tx.id})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400">{tx.time}</span>
                      <span className="text-[8px] bg-slate-200 dark:bg-white/10 px-1 py-0.2 rounded font-black uppercase text-slate-500 dark:text-slate-400">{tx.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[13px] font-black text-slate-900 dark:text-white block">{tx.amount}</span>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${
                    tx.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Link */}
          <button className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 text-[12px] font-black rounded-2xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]">
            View Sales Register <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
