import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

const INDICES = [
  { name: 'NIFTY 50', value: '22,419.65', change: '+276.45', pct: '+1.24%', trend: 'up' },
  { name: 'SENSEX', value: '73,738.45', change: '+861.18', pct: '+1.18%', trend: 'up' },
  { name: 'BANK NIFTY', value: '47,286.30', change: '-214.45', pct: '-0.45%', trend: 'down' },
  { name: 'FIN NIFTY', value: '21,142.15', change: '+32.10', pct: '+0.15%', trend: 'up' },
];

const SECTORS = [
  { name: 'Banking', change: '+1.2%' },
  { name: 'IT', change: '-0.5%' },
  { name: 'Pharma', change: '+2.1%' },
  { name: 'Energy', change: '+0.8%' },
  { name: 'Consumer', change: '+0.4%' },
  { name: 'Auto', change: '-1.1%' },
];

const Sparkline = ({ trend }: { trend: 'up' | 'down' }) => (
  <svg className="w-16 h-8 overflow-visible" viewBox="0 0 100 40">
    <path
      d={trend === 'up' 
        ? "M0,35 Q10,32 20,28 T40,25 T60,18 T80,12 T100,5" 
        : "M0,5 Q10,8 20,12 T40,15 T60,22 T80,28 T100,35"}
      fill="none"
      stroke={trend === 'up' ? '#10b981' : '#ef4444'}
      strokeWidth="2"
      strokeLinecap="round"
      className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
    />
  </svg>
);

const MAIN_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, pct: '+1.2%' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3845.20, pct: '+0.8%' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530.10, pct: '-0.3%' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1085.60, pct: '+1.5%' },
  { symbol: 'INFY', name: 'Infosys', price: 1420.30, pct: '+2.1%' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1210.45, pct: '+0.5%' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 775.20, pct: '+0.9%' },
  { symbol: 'ITC', name: 'ITC Limited', price: 435.60, pct: '-0.4%' },
  { symbol: 'LICI', name: 'LIC of India', price: 920.15, pct: '+1.1%' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2345.80, pct: '+0.2%' },
];

interface MarketsProps {}

export const Markets: React.FC<MarketsProps> = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 sm:px-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight">Top Blue Chips</h2>
          <p className="text-[10px] items-center flex gap-2 font-black uppercase tracking-[0.3em] text-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
            Live Market Feed
          </p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Active Stocks..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/10"
          />
        </div>
      </div>

      {/* Indices Bar */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max">
          {INDICES.map((idx) => (
            <motion.div 
              key={idx.name}
              whileHover={{ y: -4 }}
              className="w-56 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">{idx.name}</span>
                <Sparkline trend={idx.trend as 'up' | 'down'} />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-black tabular-nums tracking-tighter">{idx.value}</div>
                <div className={cn(
                  "text-[10px] font-bold flex items-center gap-1",
                  idx.trend === 'up' ? "text-emerald-400" : "text-red-500"
                )}>
                  {idx.change} ({idx.pct})
                  {idx.trend === 'up' ? <TrendingUp className="w-2 h-2" /> : <TrendingDown className="w-2 h-2" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stock Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
            Equity Assets
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          </h3>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Global Mainstay Selection</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAIN_STOCKS.map((stock, i) => (
            <motion.div 
              key={stock.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all group flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[10px] text-white/40 shrink-0">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black tracking-tight truncate">{stock.symbol}</div>
                  <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest truncate">{stock.name}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-black tracking-tighter">{formatCurrency(stock.price)}</div>
                  <div className={cn(
                    "text-[10px] font-bold",
                    stock.pct.startsWith('+') ? "text-emerald-400" : "text-red-500"
                  )}>{stock.pct}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
