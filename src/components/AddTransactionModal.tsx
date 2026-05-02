import React, { useState } from 'react';
import { TransactionCategory } from '../types';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface AddTransactionModalProps {
  onClose: () => void;
  onAdd: (data: { description: string; amount: number; category: TransactionCategory; type: 'income' | 'expense'; date: string }) => void;
}

const CATEGORIES: TransactionCategory[] = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Housing', 'Services', 'Income', 'Other'];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food' as TransactionCategory,
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    onAdd({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#141414] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-6 md:p-10 space-y-8 my-auto max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">New Entry</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                formData.type === 'expense' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                formData.type === 'income' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              Income
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Label</label>
            <input
              type="text"
              required
              placeholder="ENTRY DESCRIPTION..."
              className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm placeholder:text-white/20 transition-all font-bold text-white uppercase tracking-widest"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-lg font-black placeholder:text-white/20 transition-all text-white"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Date</label>
              <input
                type="date"
                required
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm font-bold transition-all text-white inverted-scheme appearance-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Category</label>
            <select
              className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm font-bold transition-all text-white appearance-none uppercase tracking-widest"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#141414]">{cat.toUpperCase()}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-[#E5E5E5] transition-all shadow-xl active:scale-[0.98]"
          >
            Confirm Entry
          </button>
        </form>
      </motion.div>
    </div>
  );
};
