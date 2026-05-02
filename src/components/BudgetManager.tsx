import React, { useState } from 'react';
import { Budget, TransactionCategory } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { Save, Plus, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BudgetManagerProps {
  budgets: (Budget & { spent: number })[];
  onUpdateBudget: (category: TransactionCategory, limit: number) => void;
}

const CATEGORIES: TransactionCategory[] = [
  'Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Services', 'Income', 'Other'
];

export const BudgetManager: React.FC<BudgetManagerProps> = ({ budgets, onUpdateBudget }) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState<TransactionCategory>('Other');
  const [newLimit, setNewLimit] = useState('');

  const handleSave = (category: TransactionCategory) => {
    const val = parseFloat(tempValue);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(category, val);
    }
    setEditing(null);
  };

  const handleAddNew = () => {
    const val = parseFloat(newLimit);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(newCategory, val);
      setIsAdding(false);
      setNewLimit('');
    }
  };

  const availableCategories = CATEGORIES.filter(
    cat => !budgets.find(b => b.category === cat)
  );

  const daysRemaining = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Spending Limits</h2>
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/30">Target Controls • {daysRemaining} Days Left</div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex px-3 py-1 bg-white/5 border border-white/10 rounded-full items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Smart Optimization: ON</span>
          </div>
          {availableCategories.length > 0 && (
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all font-mono"
            >
              <Plus className="w-3 h-3" />
              {isAdding ? 'Cancel' : 'Add Target'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-white transition-colors appearance-none"
                  >
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-black">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Monthly Limit (₹)</label>
                  <input 
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
              <button 
                onClick={handleAddNew}
                className="w-full py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-3 h-3" />
                Initialize Target
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const isEditing = editing === budget.category;
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          
          return (
            <motion.div 
              key={budget.category}
              layout
              className={cn(
                "p-8 border rounded-[32px] space-y-6 group transition-all relative overflow-hidden",
                percentage > 100 
                  ? "bg-rose-500/5 border-rose-500/20" 
                  : "bg-white/5 border-white/5 hover:border-white/10"
              )}
            >
              {percentage > 100 && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">
                  Limit Breach
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center",
                    percentage > 100 ? "bg-rose-500/20 text-rose-500" : "bg-white/5 text-white/40"
                  )}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/40">{budget.category}</div>
                    <div className="text-lg font-bold">{formatCurrency(budget.limit)}</div>
                  </div>
                </div>
                
                {isEditing ? (
                  <button 
                    onClick={() => handleSave(budget.category)}
                    className="p-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setEditing(budget.category);
                      setTempValue(budget.limit.toString());
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-all underline underline-offset-4"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <input 
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-white transition-colors"
                    placeholder="Set new limit..."
                    autoFocus
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/40">Utilization</span>
                      <span className={cn(percentage > 100 ? "text-rose-500" : "text-white")}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          percentage > 100 ? "bg-rose-500" : "bg-emerald-500"
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                     <div className="space-y-0.5">
                        <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Remaining</div>
                        <div className={cn("text-xs font-bold", remaining < 0 ? "text-rose-500" : "text-white/60")}>
                           {remaining < 0 ? '-' : ''}{formatCurrency(Math.abs(remaining))}
                        </div>
                     </div>
                     {percentage <= 100 && (
                        <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic pt-2">
                           Safe Margin
                        </div>
                     )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
