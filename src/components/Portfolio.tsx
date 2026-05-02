import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  TrendingUp, 
  PieChart as PieIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Gem, 
  Info, 
  Activity, 
  MoreVertical,
  ChevronRight,
  ArrowRight,
  Target,
  BarChart3,
  Calendar,
  Zap,
  Edit2,
  Plus,
  Search
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Holding } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
interface PortfolioProps {
  holdings: Holding[];
  onEdit?: (holding: Holding) => void;
  onAddHolding?: (holding: Omit<Holding, 'id' | 'userId'>) => void;
}

const TYPE_COLORS: Record<string, string> = {
  'Equity': '#10B981',
  'Mutual Fund': '#3B82F6',
  'Digital Asset': '#F59E0B',
  'Physical': '#A855F7',
};

const TYPE_ICONS: Record<string, any> = {
  'Equity': TrendingUp,
  'Mutual Fund': Briefcase,
  'Digital Asset': Gem,
  'Physical': PieIcon,
};

// Mock performance data based on current holdings
const generatePerformanceData = (currentValue: number) => {
  const data = [];
  const startValue = currentValue * 0.8;
  for (let i = 0; i < 7; i++) {
    data.push({
      date: `Week ${i + 1}`,
      value: startValue + (currentValue - startValue) * (i / 6) * (0.9 + Math.random() * 0.2)
    });
  }
  return data;
};

export const Portfolio: React.FC<PortfolioProps> = ({ holdings, onEdit, onAddHolding }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const stats = useMemo(() => {
    const totalCurrent = holdings.reduce((sum, item) => sum + item.value, 0);
    const totalInvested = holdings.reduce((sum, item) => sum + (item.investedValue || item.value), 0);
    const absoluteProfit = totalCurrent - totalInvested;
    const percentageProfit = totalInvested > 0 ? (absoluteProfit / totalInvested) * 100 : 0;

    const filteredHoldings = holdings.filter(h => 
      h.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.assetType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const allocation = holdings.reduce((acc: any[], item) => {
      const existing = acc.find(a => a.name === item.assetType);
      if (existing) {
        existing.value += item.value;
      } else {
        acc.push({ name: item.assetType, value: item.value, color: TYPE_COLORS[item.assetType] || '#CBD5E1' });
      }
      return acc;
    }, []);

    // Risk Analysis
    const riskScore = Math.min(100, Math.max(0, 100 - (holdings.length * 5)));
    const topAsset = holdings.length > 0 
      ? holdings.reduce((prev, current) => (prev.value > current.value) ? prev : current)
      : null;
    const concentrationRisk = (totalCurrent > 0 && topAsset) ? (topAsset.value / totalCurrent) > 0.5 : false;

    const performanceData = generatePerformanceData(totalCurrent);

    return { 
      totalCurrent, 
      totalInvested, 
      absoluteProfit, 
      percentageProfit, 
      allocation, 
      performanceData,
      riskScore,
      concentrationRisk,
      topAsset,
      filteredHoldings
    };
  }, [holdings, searchQuery]);

  return (
    <div className="space-y-8 pb-32">
      {/* Risk Alert Banner */}
      <AnimatePresence>
        {stats.concentrationRisk && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Info className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                Concentration Alert: <span className="text-white text-xs">{stats.topAsset?.assetName}</span> is more than 50% of your total net worth. Consider rebalancing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Value Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col justify-between min-h-[250px] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Portfolio Net Worth</div>
              <h2 className="text-5xl font-black tracking-tighter font-mono">
                {formatCurrency(stats.totalCurrent).split('.')[0]}
                <span className="text-xl opacity-20">.00</span>
              </h2>
            </div>
            <div className="flex flex-col items-end gap-2">
               <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                 <Activity className="w-6 h-6 text-emerald-400" />
               </div>
               <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/40">Real-time sync</div>
            </div>
          </div>

          <div className="relative z-10 flex gap-8 items-end">
            <div className="space-y-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20">Total P&L</div>
              <div className={cn(
                "text-xl font-black font-mono",
                stats.absoluteProfit >= 0 ? "text-emerald-400" : "text-red-500"
              )}>
                {stats.absoluteProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(stats.absoluteProfit))}
              </div>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="space-y-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20">Returns</div>
              <div className={cn(
                "text-xl font-black font-mono",
                stats.percentageProfit >= 0 ? "text-emerald-400" : "text-red-500"
              )}>
                {stats.percentageProfit >= 0 ? '+' : ''}{stats.percentageProfit.toFixed(2)}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Growth Trend Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">7D Performance</div>
            <div className="px-2 py-0.5 bg-emerald-500/10 rounded-full text-emerald-400 text-[8px] font-black uppercase tracking-widest">Optimal</div>
          </div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.performanceData}>
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="#10b98110" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20">
            <Calendar className="w-3 h-3" />
            Snapshot: Week 1-7
          </div>
        </motion.div>

        {/* Allocation Mini Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col justify-between"
        >
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Diversification Index</div>
          <div className="flex items-center justify-center h-28 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.allocation} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value" stroke="none">
                    {stats.allocation.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', color: '#fff' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <div className="text-xs font-black">{stats.riskScore}</div>
                <div className="text-[6px] font-black uppercase text-white/20">Points</div>
             </div>
          </div>
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-white/40">Risk Factor</span>
            <span className={cn(stats.riskScore > 70 ? "text-emerald-400" : "text-amber-400")}>
              {stats.riskScore > 70 ? 'Optimal' : 'Medium'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* AI Intelligence & Asset List Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Assets Explorer */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
              <Zap className="w-3 h-3 text-emerald-400" />
              Active Assets
            </h3>
            <div className="flex flex-wrap items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
                  <Search className="w-3 h-3 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search node..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-32"
                  />
               </div>
               <button 
                onClick={() => onAddHolding?.({ assetName: '', assetType: 'Equity', value: 0, investedValue: 0, units: 0, lastUpdated: new Date().toISOString() })}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-emerald-400 transition-all font-mono text-[10px] font-black uppercase tracking-widest"
               >
                 <Plus className="w-3 h-3" />
                 Deploy Capital
               </button>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {[...stats.filteredHoldings].sort((a, b) => b.value - a.value).map((item, i) => {
                const Icon = TYPE_ICONS[item.assetType] || Briefcase;
                const profitValue = item.value - (item.investedValue || item.value);
                const profitPct = item.investedValue ? (profitValue / item.investedValue) * 100 : 0;
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      delay: Math.min(i * 0.05, 0.5),
                      duration: 0.6,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    className="group flex flex-col md:flex-row md:items-center p-6 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-emerald-500/20 transition-all cursor-pointer gap-6"
                  >
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className={cn("w-6 h-6", item.assetType === 'Equity' ? 'text-emerald-400' : 'text-white/40')} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-black tracking-tight truncate pr-2 uppercase italic">"{item.assetName}"</div>
                        <div className="flex items-center gap-2">
                           <div className="px-1.5 py-0.5 bg-white/5 rounded text-[7px] font-black uppercase tracking-widest text-white/40">{item.assetType}</div>
                           <span className="text-[10px] font-bold text-white/20 whitespace-nowrap">{item.units} Units</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-32 flex flex-col justify-center">
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/10 mb-2">Weight</div>
                      <div className="flex items-center gap-2">
                         <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.value / stats.totalCurrent) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-emerald-400/40" 
                            />
                         </div>
                         <span className="text-xs font-black font-mono w-8 text-right shrink-0">{Math.round((item.value / stats.totalCurrent) * 100)}%</span>
                      </div>
                    </div>

                    <div className="w-full md:w-40 text-left md:text-right">
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/10 mb-2">Holdings</div>
                      <div className="text-base font-black font-mono whitespace-nowrap">{formatCurrency(item.value)}</div>
                    </div>

                    <div className="w-full md:w-48 flex items-center justify-between md:justify-end gap-3">
                      <div className="text-left md:text-right flex-1">
                        <div className="text-[9px] font-black uppercase tracking-widest text-white/10 mb-1">Absolute P&L</div>
                        <div className={cn(
                          "text-xs font-bold font-mono py-1 rounded",
                          profitPct >= 0 ? "text-emerald-400" : "text-rose-500"
                        )}>
                          {profitPct >= 0 ? '▲' : '▼'} {Math.abs(profitPct).toFixed(2)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }}
                            className="p-2.5 bg-white/5 rounded-xl border border-white/5 hover:bg-emerald-500 hover:text-black transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {stats.filteredHoldings.length === 0 && (
              <div className="p-20 text-center border border-dashed border-white/5 rounded-[2.5rem]">
                 <div className="text-xs font-black uppercase tracking-[0.3em] text-white/20 italic">No matching nodes found in directory</div>
              </div>
            )}
          </div>
        </div>

        {/* Strategic Roadmap (formerly sidebar) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] relative overflow-hidden group min-h-[400px] flex flex-col backdrop-blur-xl">
             <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black tracking-tight uppercase italic">Portfolio Summary</h3>
                   <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-emerald-500/20 transition-all">
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Total Classes</div>
                      <div className="text-xl font-black">{holdings.length} Active Nodes</div>
                   </div>
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-rose-500/20 transition-all">
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Realized Gains</div>
                      <div className={cn("text-xl font-black", stats.absoluteProfit >= 0 ? "text-emerald-400" : "text-rose-500")}>
                        {stats.absoluteProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(stats.absoluteProfit))}
                      </div>
                   </div>
                   <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl text-center">
                      <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2">Asset Quality</div>
                      <div className="text-sm font-black text-emerald-400">PRIME GRADE</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] flex items-center justify-between group cursor-help transition-all hover:bg-indigo-500/10">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                   <Target className="w-5 h-5" />
                </div>
                <div className="text-left">
                   <div className="text-[9px] font-black uppercase tracking-widest text-white/20">Target Status</div>
                   <div className="text-xs font-black text-indigo-400">Retirement Strategy: ON TRACK</div>
                </div>
             </div>
             <ChevronRight className="w-4 h-4 text-indigo-400/20 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Strategic Rebalance CTA */}
      <div className="p-8 md:p-12 bg-white text-black rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 group overflow-hidden relative mx-1">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000 hidden md:block">
          <BarChart3 className="w-64 h-64" />
        </div>
        
        <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full border border-black/10">
              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest">Priority Rebalance Available</span>
           </div>
           <h3 className="text-2xl md:text-4xl font-black tracking-tighter leading-tight md:leading-none">Portfolio Drift Detected.</h3>
           <p className="text-xs md:text-sm font-medium opacity-60">
             Your current allocation is drifting from your optimal risk-parity model. Recalibrate now to lock in gains.
           </p>
        </div>
        
        <div className="flex flex-col items-center gap-4 relative z-10 w-full md:w-auto">
          <button className="w-full md:w-auto px-8 md:px-12 py-5 md:py-6 bg-black text-white rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 shadow-xl shadow-black/20 group/btn">
            Execute Recalibration
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
          </button>
          <div className="text-[8px] font-black uppercase tracking-widest opacity-20">Last checked: Just now</div>
        </div>
      </div>
    </div>
  );
};


