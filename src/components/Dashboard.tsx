import React from 'react';
import { 
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import { Transaction, Budget } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight, Quote, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  summary: {
    balance: number;
    totalIncome: number;
    totalExpenses: number;
  };
  transactions: Transaction[];
  budgets: (Budget & { spent: number })[];
}

const COLORS = ['#FFFFFF', '#3B82F6', '#FB923C', '#A855F7', '#10B981', '#FF4444'];

export const Dashboard: React.FC<DashboardProps> = ({ summary, transactions, budgets }) => {
  const categoryData = budgets.map(b => ({ name: b.category, value: b.spent }));

  return (
    <div className="space-y-16">
      {/* Primary Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-emerald-500/20 transition-all group"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Liquidity Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tighter">84</span>
            <span className="text-[10px] font-black text-emerald-400">OPTIMAL</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500/40 w-[84%]" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-8 bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-blue-500/20 transition-all group"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Monthly Burn</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tighter">12%</span>
            <span className="text-[10px] font-black text-blue-400">DECEL.</span>
          </div>
          <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic">vs last 30 days</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-amber-500/20 transition-all group"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Savings Velocity</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tighter">₹24k</span>
            <span className="text-[10px] font-black text-amber-400">HIGH</span>
          </div>
          <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic">Proj. Month End</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-purple-500/20 transition-all group overflow-hidden"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Tax Liability</div>
          <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
            <span className="text-3xl font-black tracking-tighter italic">Low</span>
            <span className="text-[10px] font-black text-purple-400 leading-none">SHIELDED</span>
          </div>
          <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic">Current FY</div>
        </motion.div>
      </div>

      {/* Stats Grid - Inbound/Outbound */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: 'Inbound Capital', value: summary.totalIncome, icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
          { label: 'Outbound Capital', value: summary.totalExpenses, icon: ArrowDownRight, color: 'text-[#FF4444]', bg: 'bg-[#FF4444]/5' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="p-10 bg-white/[0.03] border border-white/5 rounded-[40px] space-y-3 group hover:bg-white/[0.05] hover:border-emerald-500/10 transition-all duration-700 cursor-pointer overflow-hidden relative"
          >
            <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000", item.color.replace('text-', 'bg-'))} />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">{item.label}</span>
              <div className={cn("p-3 rounded-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110", item.bg)}>
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-white relative z-10 transition-transform duration-700 group-hover:translate-x-1">
              {formatCurrency(item.value)}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Allocations (formerly Spending by Category) */}
        <div id="spending-chart" className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold tracking-tight">Allocations</h3>
          </div>
          <div className="h-64 bg-white/5 rounded-[40px] border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F5', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Categories</span>
            <span className="text-2xl font-black">{categoryData.length}</span>
          </div>
        </div>
      </div>

      {/* Budgets (Allocations list style) */}
        <div id="budget-progress" className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold tracking-tight">Targets</h3>
          </div>
          <div className="space-y-8">
            {budgets.slice(0, 4).map((budget) => {
              const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
              return (
                <div key={budget.category} className="space-y-3">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/40">
                    <span>{budget.category}</span>
                    <span className="text-white">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className={cn(
                        "h-full rounded-full transition-colors",
                        percentage > 90 ? "bg-[#FF4444]" : "bg-white"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Live Intelligence Feed Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <h3 className="text-xl font-bold tracking-tight uppercase">Live Intelligence Feed</h3>
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Global Market Pulse</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              tag: "REVENUE INSIGHT",
              title: "Dividend Yields Hit 5-Year High in Energy Sector",
              source: "Money Map Intel",
              time: "2m ago"
            },
            { 
              tag: "MARKET ALPHA",
              title: "Blue-Chip Volatility Index Signals Bullish Correction",
              source: "Global Desk",
              time: "14m ago"
            },
            { 
              tag: "TAX SHADOW",
              title: "New Capital Gains Regulation: Impact Analysis Pending",
              source: "Compliance Hub",
              time: "48m ago"
            },
            { 
              tag: "ASSET CLASS",
              title: "Gold Reserves Strengthening Amid Institutional Shift",
              source: "Liquidity Daily",
              time: "1h ago"
            }
          ].map((news, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col justify-between group hover:bg-white/[0.04] transition-all cursor-pointer h-[180px]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-lg">{news.tag}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{news.time}</span>
                </div>
                <h4 className="text-lg font-black tracking-tight leading-snug group-hover:text-emerald-400 transition-colors uppercase italic pr-4">
                  "{news.title}"
                </h4>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <Sparkles className="w-3 h-3 text-white/20" />
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{news.source}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
