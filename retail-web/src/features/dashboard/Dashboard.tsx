import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard 
} from 'lucide-react';

const StatCard = ({ title, value, change, icon, isPositive }: { title: string, value: string, change: string, icon: React.ReactNode, isPositive: boolean }) => (
  <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-[20px] p-6 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.02)] relative overflow-hidden group transition-colors duration-300">
    {/* Soft top highlight */}
    <div className="absolute top-0 left-0 w-full h-[1px] hidden dark:block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none"></div>
    
    {/* Hover glow effect */}
    <div className="absolute top-[-50%] right-[-20%] w-[150px] h-[150px] bg-indigo-50 dark:bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors duration-500"></div>

    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-gray-500 dark:text-[#8F94A3] text-[13px] font-semibold tracking-wide uppercase mb-2">{title}</p>
        <h3 className="text-gray-900 dark:text-white text-[28px] font-bold tracking-tight mb-2 dark:drop-shadow-sm">{value}</h3>
        <div className="flex items-center gap-1.5">
          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? '+' : ''}{change}
          </span>
          <span className="text-gray-400 dark:text-[#6B7280] text-[12px] font-medium">vs last week</span>
        </div>
      </div>
      <div className="w-12 h-12 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] rounded-2xl flex items-center justify-center shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    // How Front-End binding works (Learning moment):
    // After login, we can fetch real user data from our backend using the token we stored.
    // For now, we simulate grabbing the username from the token payload or localStorage if we had stored it.
    // In a real app: fetch('/api/user/me', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight dark:drop-shadow-sm mb-1">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-500 dark:text-[#8F94A3] text-[14px] font-medium">
            Here's what's happening with your stores today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] text-gray-700 dark:text-[#E2E8F0] text-[13px] font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors shadow-sm dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            Export Report
          </button>
          <button className="px-4 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white text-[13px] font-semibold rounded-xl transition-colors shadow-md dark:shadow-[0_4px_15px_rgba(99,102,241,0.4)]">
            New Transaction
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value="$124,563.00" 
          change="12.5%" 
          icon={<TrendingUp className="w-5 h-5" />} 
          isPositive={true} 
        />
        <StatCard 
          title="Total Orders" 
          value="1,423" 
          change="8.2%" 
          icon={<ShoppingBag className="w-5 h-5" />} 
          isPositive={true} 
        />
        <StatCard 
          title="New Customers" 
          value="324" 
          change="4.1%" 
          icon={<Users className="w-5 h-5" />} 
          isPositive={true} 
        />
        <StatCard 
          title="Active Expenses" 
          value="$12,450.00" 
          change="-2.4%" 
          icon={<CreditCard className="w-5 h-5" />} 
          isPositive={false} 
        />
      </div>

      {/* Placeholder for Charts / Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-[24px] p-6 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] min-h-[400px] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
           <div className="absolute top-0 left-0 w-full h-[1px] hidden dark:block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none"></div>
           <p className="text-gray-400 dark:text-[#6B7280] font-medium">Sales Chart Area (To be implemented)</p>
        </div>
        <div className="bg-white dark:bg-[#0B0C12] border border-gray-200 dark:border-white/[0.05] rounded-[24px] p-6 shadow-md dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] min-h-[400px] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
           <div className="absolute top-0 left-0 w-full h-[1px] hidden dark:block bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none"></div>
           <p className="text-gray-400 dark:text-[#6B7280] font-medium">Recent Activity Area</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
