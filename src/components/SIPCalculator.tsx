import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import { 
  TrendingUp, Info, Target, Calculator, RefreshCw, 
  ArrowRight, Settings2, ShieldCheck, ChevronDown, 
  ChevronUp, GraduationCap, Home, Palmtree, Zap,
  Coins, Scale, Trophy, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

type CalcMode = 'sip' | 'lumpsum';

interface GoalPreset {
  id: string;
  label: string;
  icon: any;
  defaultAmount: number;
  defaultYears: number;
  message: string;
}

const GOALS: GoalPreset[] = [
  { id: 'custom', label: 'General Wealth', icon: Coins, defaultAmount: 5000, defaultYears: 15, message: 'Building a rainy day fund' },
  { id: 'retirement', label: 'Early Retirement', icon: Palmtree, defaultAmount: 25000, defaultYears: 25, message: 'Financial freedom roadmap' },
  { id: 'education', label: 'Higher Education', icon: GraduationCap, defaultAmount: 15000, defaultYears: 12, message: 'Planning for the future' },
  { id: 'home', label: 'New Home', icon: Home, defaultAmount: 40000, defaultYears: 8, message: 'Downpayment calculation' },
];

export const SIPCalculator: React.FC = () => {
  const [mode, setMode] = useState<CalcMode>('sip');
  const [activeGoal, setActiveGoal] = useState('custom');
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [stepUp, setStepUp] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [restoredToast, setRestoredToast] = useState<string | null>(null);

  const stats = useMemo(() => {
    let yearlyData = [];
    let currentWealth = 0;
    let totalInvested = 0;
    let currentSip = amount;

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        if (mode === 'sip') {
          totalInvested += currentSip;
          currentWealth = (currentWealth + currentSip) * (1 + rate / 12 / 100);
        } else if (mode === 'lumpsum' && y === 1 && m === 1) {
          totalInvested = amount;
          currentWealth = amount;
        } else if (mode === 'lumpsum') {
          currentWealth = currentWealth * (1 + rate / 12 / 100);
        }
      }
      
      yearlyData.push({
        year: `Year ${y}`,
        wealth: Math.round(currentWealth),
        invested: Math.round(totalInvested),
      });

      if (mode === 'sip') currentSip = currentSip * (1 + stepUp / 100);
    }

    const returns = currentWealth - totalInvested;
    const realValue = currentWealth / Math.pow(1 + inflation / 100, years);

    return {
      yearlyData,
      totalWealth: currentWealth,
      totalInvested,
      returns,
      realValue,
      growthMultiplier: currentWealth / (totalInvested || 1)
    };
  }, [mode, amount, rate, years, stepUp, inflation]);

  return (
    <div className="space-y-12 pb-24">
      {/* Restored Toast */}
      <AnimatePresence>
        {restoredToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-emerald-500 text-black rounded-full"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{restoredToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Sparkles className="w-48 h-48" />
        </div>
        
        <div className="space-y-4 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Financial Freedom Forecast</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">
            You could have <br /> 
            <span className="text-emerald-400">{formatCurrency(stats.totalWealth)}</span>
          </h1>
          <p className="text-white/40 text-sm font-medium">
             by saving <span className="text-white">{formatCurrency(amount)}</span> {mode === 'sip' ? 'monthly' : 'once'} for {years} years.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 relative z-10">
          <div className="space-y-2 text-center md:text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Strategy Mode</div>
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setMode('sip')}
                className={cn("px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", mode === 'sip' ? "bg-white text-black" : "text-white/40 hover:text-white")}
              >
                SIP
              </button>
              <button 
                onClick={() => setMode('lumpsum')}
                className={cn("px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", mode === 'lumpsum' ? "bg-white text-black" : "text-white/40 hover:text-white")}
              >
                Lump
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-4 space-y-8">
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/20 pl-2">Step 1: Choose Your Goal</h3>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => {
                    setActiveGoal(goal.id);
                    setAmount(goal.defaultAmount);
                    setYears(goal.defaultYears);
                  }}
                  className={cn(
                    "p-5 rounded-3xl border text-left transition-all",
                    activeGoal === goal.id ? "bg-white text-black border-white" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  )}
                >
                  <goal.icon className={cn("w-5 h-5 mb-4", activeGoal === goal.id ? "text-black" : "text-emerald-400")} />
                  <div className="text-[10px] font-black uppercase tracking-wider">{goal.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/20 border-b border-white/5 pb-4">Step 2: Adjust Parameters</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Monthly Save</label>
                <div className="text-lg font-black">{formatCurrency(amount)}</div>
              </div>
              <input 
                type="range" min="500" max="100000" step="500" value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  setActiveGoal('custom');
                }}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Years to Invest</label>
                <div className="text-lg font-black">{years} Years</div>
              </div>
              <input 
                type="range" min="1" max="40" step="1" value={years}
                onChange={(e) => {
                  setYears(Number(e.target.value));
                  setActiveGoal('custom');
                }}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Expected Returns (%)</label>
                <div className="text-lg font-black">{rate}%</div>
              </div>
              <input 
                type="range" min="5" max="30" step="0.5" value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="pt-4">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                {showAdvanced ? 'Hide Expert Settings' : 'Expert Analysis Settings'}
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 pt-6 overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-white/20">
                        <span>Annual Salary Hike (%)</span>
                        <span className="text-white">{stepUp}%</span>
                      </div>
                      <input type="range" min="0" max="30" value={stepUp} onChange={(e) => setStepUp(Number(e.target.value))} className="w-full h-1 bg-white/5" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-white/20">
                        <span>Inflation (%)</span>
                        <span className="text-white">{inflation}%</span>
                      </div>
                      <input type="range" min="0" max="15" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="w-full h-1 bg-white/5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[3rem] space-y-6 flex flex-col items-center text-center">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Capital Composition</h4>
                 <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Invested', value: stats.totalInvested },
                            { name: 'Profit', value: stats.returns },
                          ]}
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#ffffff10" />
                          <Cell fill="#10b981" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Invested</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Wealth Gained</span>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[3rem] flex flex-col justify-between">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Power Multiplier</h4>
                    <div className="text-5xl font-black tracking-tight text-blue-400">{stats.growthMultiplier.toFixed(1)}x</div>
                 </div>
                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                   Your money grows over <span className="text-white">{stats.growthMultiplier.toFixed(1)} times</span> its original value.
                 </p>
              </div>
           </div>

           <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black tracking-tight">Growth Visualization</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-400" />
                       <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Net Worth</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-white/20" />
                       <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Invested</span>
                    </div>
                 </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.yearlyData}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#ffffff20' }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0D0D0D', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="wealth" stroke="#10b981" strokeWidth={3} fill="url(#chartGrad)" />
                    <Area type="monotone" dataKey="invested" stroke="#ffffff20" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

            <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] space-y-4">
               <div className="flex items-center gap-3">
                 <Zap className="w-5 h-5 text-amber-500" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500">Inflation Insight</h4>
               </div>
               <p className="text-xs text-white/40 leading-relaxed font-medium">
                 In {years} years, <span className="text-white">{formatCurrency(stats.totalWealth)}</span> will have the same purchasing power as <span className="text-white">{formatCurrency(stats.realValue)}</span> today.
               </p>
            </div>

           <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Pro Tips for {years} Years</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { icon: <ShieldCheck className="w-4 h-4" />, text: "Automate SIPs to avoid emotional timing errors." },
                   { icon: <TrendingUp className="w-4 h-4" />, text: "Increase contributions annually to beat inflation." },
                   { icon: <Scale className="w-4 h-4" />, text: "Rebalance your portfolio once a year." },
                   { icon: <Palmtree className="w-4 h-4" />, text: "Compound interest is back-loaded. Stay patient." },
                 ].map((tip, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="text-emerald-400 mt-0.5">{tip.icon}</div>
                      <p className="text-[10px] text-white/30 font-medium leading-relaxed">{tip.text}</p>
                   </div>
                 ))}
              </div>
           </div>

          <div className="p-10 bg-emerald-500 rounded-[3rem] text-black space-y-6 flex flex-col sm:flex-row items-center justify-between group">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-2xl font-black tracking-tight">Strategy Finalized</h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Ready to start your {activeGoal} goal?</p>
            </div>
            <div className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3">
              Lock Strategy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
