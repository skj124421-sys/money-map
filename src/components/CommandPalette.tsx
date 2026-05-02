import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, LayoutDashboard, ReceiptText, Calculator, TrendingUp, CreditCard, Target, Briefcase, MessageSquare, Plus, Download, LogOut, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { Transaction } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any) => void;
  onAddTransaction: () => void;
  onExport: () => void;
  onLogout: () => void;
  transactions: Transaction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onAddTransaction, 
  onExport, 
  onLogout,
  transactions 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigations = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', category: 'Navigation' },
    { icon: ReceiptText, label: 'View Ledger', id: 'transactions', category: 'Navigation' },
    { icon: Calculator, label: 'SIP Architect', id: 'sip', category: 'Navigation' },
    { icon: TrendingUp, label: 'Market Pulse', id: 'markets', category: 'Navigation' },
    { icon: CreditCard, label: 'Credit Health', id: 'credit', category: 'Navigation' },
    { icon: Briefcase, label: 'Global Portfolio', id: 'portfolio', category: 'Navigation' },
  ];

  const actions = [
    { icon: Plus, label: 'New Transaction Entry', action: onAddTransaction, category: 'Actions' },
    { icon: Download, label: 'Export Data to CSV', action: onExport, category: 'Actions' },
    { icon: LogOut, label: 'Terminate Session', action: onLogout, category: 'Actions', className: 'text-red-500' },
  ];

  const filteredTransactions = transactions
    .filter(t => t.description.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map(t => ({
      icon: t.type === 'income' ? TrendingUp : ArrowRight,
      label: `${t.description} - ${t.amount}`,
      category: 'Recent Records',
      action: () => {
        onNavigate('transactions');
        onClose();
      }
    }));

  const results = [
    ...navigations.filter(n => n.label.toLowerCase().includes(query.toLowerCase())),
    ...actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase())),
    ...filteredTransactions
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    }
    if (e.key === 'Enter') {
      const selected = results[selectedIndex];
      if (selected) {
        if ('action' in selected && selected.action) {
          selected.action();
        } else if ('id' in selected) {
          onNavigate(selected.id);
        }
        onClose();
      }
    }
  }, [results, selectedIndex, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setSelectedIndex(0);
      setQuery('');
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-[#0D0D0D] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative z-10 pointer-events-auto"
          >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <Command className="w-5 h-5 text-white/30" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search transactions, navigation or commands..."
                className="w-full bg-transparent border-none outline-none text-lg font-medium text-white placeholder:text-white/10"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <span className="text-[10px] font-black uppercase text-white/40">ESC</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.reduce((acc: any[], curr) => {
                    if (acc.length === 0 || acc[acc.length - 1].category !== curr.category) {
                      acc.push({ isHeader: true, label: curr.category, key: `header-${curr.category}` });
                    }
                    acc.push(curr);
                    return acc;
                  }, []).map((item, i) => {
                    if (item.isHeader) {
                      return (
                        <div key={item.key} className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                          {item.label}
                        </div>
                      );
                    }

                    const isSelected = results.indexOf(item) === selectedIndex;
                    return (
                      <div
                        key={`${item.label}-${i}`}
                        onClick={() => {
                          if (item.action) item.action();
                          else if (item.id) onNavigate(item.id);
                          onClose();
                        }}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 group",
                          isSelected ? "bg-white text-black" : "hover:bg-white/5 text-white/60"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className={cn("w-4 h-4", isSelected ? "text-black" : "text-white/20 group-hover:text-white")} />
                          <span className="text-sm font-bold tracking-tight">{item.label}</span>
                        </div>
                        <ArrowRight className={cn("w-4 h-4 opacity-0 transition-all", isSelected ? "opacity-100 translate-x-0" : "-translate-x-4")} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-white/10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white/40">No records matching "{query}"</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/10">Try refined search parameters</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black">↑↓</kbd>
                    <span className="text-[9px] font-bold text-white/20 uppercase">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black">ENTER</kbd>
                    <span className="text-[9px] font-bold text-white/20 uppercase">Select</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-emerald-400/20">
                 <span className="text-[9px] font-black uppercase tracking-widest">Enhanced Indexing</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
