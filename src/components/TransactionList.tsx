import React from 'react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {transactions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-20 text-center text-white/10 font-black uppercase tracking-[0.4em] text-[10px] border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]"
            >
              No records in ledger
            </motion.div>
          ) : (
            transactions.map((t, index) => (
              <motion.div
                key={t.id}
                layout
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ 
                  delay: Math.min(index * 0.04, 0.4), 
                  duration: 0.6, 
                  ease: [0.23, 1, 0.32, 1] 
                }}
                className="flex items-center justify-between p-7 bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/0 group-hover:bg-emerald-500/40 transition-all duration-500" />
                
                <div className="flex items-center gap-8 relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center font-black text-black text-2xl transition-all duration-700 group-hover:rounded-full group-hover:rotate-[15deg] group-hover:scale-110",
                    t.type === 'income' ? "bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.2)]" : "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                  )}>
                    {t.description.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-white/90 tracking-tight transition-all duration-500 truncate group-hover:text-white">{t.description}</div>
                    <div className="flex items-center gap-3 mt-1.5 opacity-40 group-hover:opacity-60 transition-opacity">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#10B981]">{t.category}</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">{format(new Date(t.date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10 text-right relative z-10">
                  <div className="transition-transform duration-500 group-hover:-translate-x-2">
                    <div className={cn(
                      "text-xl md:text-2xl font-black tracking-tighter",
                      t.type === 'income' ? "text-emerald-400" : "text-white"
                    )}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                    </div>
                    <div className="text-[9px] uppercase font-black text-white/20 tracking-[0.3em] mt-1 transition-colors group-hover:text-emerald-500/40">Verified Tx.</div>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    {onEdit && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(t); }}
                        className="p-4 bg-white/5 text-white/40 hover:text-white hover:bg-emerald-500 rounded-2xl transition-all shadow-xl active:scale-90"
                        title="Modify Entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                        className="p-4 bg-white/5 text-white/40 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-xl active:scale-90"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
