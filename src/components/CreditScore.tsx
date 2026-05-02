import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, TrendingUp, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export const CreditScore: React.FC = () => {
  const [score, setScore] = useState(784);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setScore(prev => prev + Math.floor(Math.random() * 5));
      setIsRefreshing(false);
    }, 2000);
  };

  const getScoreColor = (s: number) => {
    if (s >= 750) return 'text-emerald-400';
    if (s >= 650) return 'text-amber-400';
    return 'text-rose-500';
  };

  const getScoreBg = (s: number) => {
    if (s >= 750) return 'bg-emerald-500/10';
    if (s >= 650) return 'bg-amber-500/10';
    return 'bg-rose-500/10';
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Credit Vitality</h2>
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/30">CRIF • EXPERIAN • EQUIFAX</div>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10",
            isRefreshing ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-black"
          )}
        >
          {isRefreshing ? 'Scanning Nodes...' : 'Instant Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: The Dial */}
        <div className="lg:col-span-4 flex flex-col items-center gap-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="100"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="628"
                className="text-white/5"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="100"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray="628"
                initial={{ strokeDashoffset: 628 }}
                animate={{ 
                  strokeDashoffset: 628 - (score / 900) * 628,
                  opacity: isRefreshing ? [1, 0.4, 1] : 1
                }}
                transition={{ 
                  strokeDashoffset: { duration: 2, ease: "easeOut" },
                  opacity: { repeat: Infinity, duration: 1 }
                }}
                className={getScoreColor(score)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Current Score</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={score}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-7xl font-black tabular-nums"
                >
                  {score}
                </motion.span>
              </AnimatePresence>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", getScoreColor(score))}>Excellent</span>
            </div>
          </div>
          
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
              <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Utilization</div>
              <div className="text-sm font-black">12%</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
              <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Debt-to-Income</div>
              <div className="text-sm font-black">24%</div>
            </div>
          </div>
        </div>

        {/* Right Col: Details & Actions */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 bg-[#0D0D0D] border border-white/5 rounded-[40px] space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("p-4 rounded-2xl", getScoreBg(score))}>
                  <ShieldCheck className={cn("w-6 h-6", getScoreColor(score))} />
                </div>
                <div>
                  <div className="text-base font-black tracking-tight">Security Protocol: Active</div>
                  <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">Global Ranking • Tier 1 Alpha</div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0D0D0D] bg-white/10 flex items-center justify-center text-[8px] font-black">
                    {i === 1 ? 'A+' : i === 2 ? 'AAA' : 'S'}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Positive Factors</div>
                <div className="space-y-2">
                  {[
                    { label: 'Payment History', value: 'On Time', icon: CheckCircle2, color: 'text-emerald-400' },
                    { label: 'Credit Mix', value: 'Diverse', icon: Zap, color: 'text-blue-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("w-4 h-4", item.color)} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{item.label}</span>
                      </div>
                      <span className="text-xs font-black">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Improvement Protocol</div>
                <div className="space-y-2">
                   <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-3 group hover:bg-rose-500/10 transition-colors cursor-help">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <div className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">Increase credit limit on card ending in ...4020</div>
                   </div>
                   <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">Maintain &lt;10% utilization for 3 cycles</div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => {
                const report = `
MONEY MAP BUREAU REPORT
----------------------
Name: Arjun Singh
Score: ${score}
Health: Excellent
Global Ranking: Top 4%
              `;
                const blob = new Blob([report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'bureau_report.txt';
                a.click();
              }}
              className="flex-1 py-6 bg-white text-black rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 group"
            >
              Analyze Full Bureau Report
              <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
