import { useState, useMemo, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { EditTransactionModal } from './components/EditTransactionModal';
import { EditHoldingModal } from './components/EditHoldingModal';
import { BudgetManager } from './components/BudgetManager';
import { SIPCalculator } from './components/SIPCalculator';
import { Markets } from './components/MarketTracker';
import { CreditScore } from './components/CreditScore';
import { LayoutDashboard, ReceiptText, Plus, Landmark, PiggyBank, Search, Target, TrendingUp, Calculator, Wallet, CreditCard, Briefcase, User as UserIcon, LogOut, Quote, Zap, ShieldCheck } from 'lucide-react';
import { Portfolio } from './components/Portfolio';
import { CommandPalette } from './components/CommandPalette';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Transaction, Budget, Holding, User, TransactionCategory } from './types';
import { Login } from './components/Login';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('moneymap_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetConfig, setBudgetConfig] = useState<Budget[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'sip' | 'markets' | 'credit' | 'portfolio'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navItems = useMemo(() => [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'transactions', label: 'Ledger', icon: ReceiptText },
    { id: 'sip', label: 'SIP Calc', icon: Calculator },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'credit', label: 'Credit', icon: CreditCard },
    { id: 'budgets', label: 'Targets', icon: Target },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  ], []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tRes, bRes, hRes] = await Promise.all([
          fetch(`/api/transactions/${user.id}`),
          fetch(`/api/budgets/${user.id}`),
          fetch(`/api/holdings/${user.id}`)
        ]);

        const tData = await tRes.json();
        const bData = await bRes.json();
        const hData = await hRes.json();

        setTransactions(tData || []);
        setBudgetConfig(bData || []);
        setHoldings(hData || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('moneymap_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('moneymap_user');
    setIsProfileOpen(false);
  };

  const handleAddTransaction = async (data: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newTransaction = { 
      ...data, 
      id: Math.random().toString(36).substring(2, 11), 
      userId: user.id
    };
    
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      if (res.ok) {
        setTransactions([newTransaction as Transaction, ...transactions]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHolding = async (data: Omit<Holding, 'id' | 'userId'>) => {
    if (!user) return;
    const newHolding = {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      userId: user.id,
      lastUpdated: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/holdings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHolding)
      });
      if (res.ok) {
        setHoldings([...holdings, newHolding as Holding]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setTransactions(transactions.map(t => t.id === id ? { ...t, ...data } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHolding = async (id: string, data: Partial<Holding>) => {
    try {
      const res = await fetch(`/api/holdings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setHoldings(holdings.map(h => h.id === id ? { ...h, ...data } : h));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHolding = async (id: string) => {
    try {
      const res = await fetch(`/api/holdings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHoldings(holdings.filter(h => h.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTransactions(transactions.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBudget = async (category: TransactionCategory, limit: number) => {
    if (!user) return;
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, category, limit })
      });
      if (res.ok) {
        setBudgetConfig(prev => {
          const index = prev.findIndex(b => b.category === category);
          if (index > -1) {
            const next = [...prev];
            next[index] = { ...next[index], limit };
            return next;
          }
          return [...prev, { category, limit }];
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.value, 0);
    return {
      balance: (totalIncome - totalExpenses) + totalPortfolioValue,
      totalIncome,
      totalExpenses,
      portfolioValue: totalPortfolioValue
    };
  }, [transactions, holdings]);

  const budgetsWithSpent = useMemo(() => {
    return budgetConfig.map(b => {
      const spent = transactions
        .filter(t => t.category === b.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
  }, [transactions, budgetConfig]);

  const handleExportCSV = () => {
    const csv = transactions.map(t => `${t.date},${t.description},${t.amount},${t.category},${t.type}`).join('\n');
    const blob = new Blob([`Date,Description,Amount,Category,Type\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'money_map_export.csv';
    a.click();
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-full bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col md:flex-row overflow-hidden selection:bg-white selection:text-black focus-visible:outline-none">
      <CommandPalette 
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onAddTransaction={() => setIsModalOpen(true)}
        onExport={handleExportCSV}
        onLogout={handleLogout}
        transactions={transactions}
      />
      {/* Sidebar Navigation */}
      <nav id="sidebar" className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col justify-between shrink-0 z-20 bg-[#0A0A0A]">
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Money Map.</div>
          </motion.div>

          <div className="flex flex-col gap-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 text-left group",
                  activeTab === item.id 
                    ? "text-white" 
                    : "text-white/40 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-500",
                  activeTab === item.id ? "bg-white text-black scale-110" : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div 
          id="sidebar-footer" 
          className="mt-auto pt-8 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsProfileOpen(true)}
        >
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl border-dashed cursor-pointer hover:bg-white/10 transition-colors">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 font-bold">Member Tier</div>
            <div className="text-sm font-bold flex items-center justify-between">
              Elite
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-12 py-10 flex flex-col relative w-full">
        <header className="mb-12 md:mb-16 shrink-0 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4">
                <div className="text-[10px] md:text-[12px] uppercase tracking-[0.3em] font-bold text-white/50">Total Net Worth</div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400">Money Map</div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter -ml-1 md:-ml-2 break-all drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                ₹{(summary?.balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h1>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-between lg:justify-end gap-3 self-center lg:self-end">
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button 
                    onClick={() => setIsPaletteOpen(true)}
                    className="pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black tracking-widest text-white/40 hover:border-emerald-500/30 transition-all outline-none flex items-center gap-4 group"
                  >
                    <Search className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400 transition-colors" />
                    <span>CMD CENTER</span>
                    <span className="text-[7px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-black">⌘ K</span>
                  </button>
                </div>

                {(activeTab === 'dashboard' || activeTab === 'transactions') && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3.5 bg-emerald-500 text-black rounded-2xl shadow-xl hover:bg-white transition-all active:scale-95 group"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Entry</span>
                  </button>
                )}
                
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group shrink-0"
                >
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <UserIcon className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        <section id="content-body" className="grid grid-cols-1 xl:grid-cols-3 gap-12 flex-1 pt-6">
          <div className={cn(
            "transition-all duration-700",
            activeTab === 'dashboard' ? "xl:col-span-2" : "xl:col-span-3"
          )}>
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Dashboard summary={summary} transactions={transactions} budgets={budgetsWithSpent} />
                </motion.div>
              )}
              {activeTab === 'transactions' && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h2 className="text-xl font-bold tracking-tight">Ledger Records</h2>
                      <button 
                        onClick={handleExportCSV}
                        className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                      >
                        Export CSV
                      </button>
                    </div>
                    <TransactionList 
                      transactions={filteredTransactions} 
                      onDelete={handleDeleteTransaction} 
                      onEdit={setEditingTransaction}
                    />
                  </div>
                </motion.div>
              )}
              {activeTab === 'sip' && (
                <motion.div
                  key="sip"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <SIPCalculator />
                </motion.div>
              )}
              {activeTab === 'markets' && (
                <motion.div
                  key="markets"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Markets />
                </motion.div>
              )}
              {activeTab === 'credit' && (
                <motion.div
                  key="credit"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <CreditScore />
                </motion.div>
              )}
              {activeTab === 'budgets' && (
                <motion.div
                  key="budgets"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <BudgetManager 
                    budgets={budgetsWithSpent} 
                    onUpdateBudget={handleUpdateBudget} 
                  />
                </motion.div>
              )}
              {activeTab === 'portfolio' && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Portfolio 
                    holdings={holdings} 
                    onEdit={setEditingHolding}
                    onAddHolding={handleAddHolding}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden xl:flex flex-col gap-8"
            >
              <div className="p-8 bg-[#0A0A0A] border border-indigo-500/20 text-white rounded-[2.5rem] space-y-6 relative overflow-hidden group shadow-2xl">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">System Objective</div>
                    <h4 className="text-xl font-black leading-tight tracking-tighter">Your capital, decoded for peak performance.</h4>
                  </div>
                  <p className="text-[10px] font-bold leading-relaxed opacity-40 uppercase tracking-widest">
                    Every transaction is a data point in your journey towards financial sovereignty.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-3 relative z-10 border-t border-white/5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400/60" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Protocol Verified</span>
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden group shrink-0">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
                <div className="relative z-10 space-y-6">
                  <Quote className="w-5 h-5 text-emerald-400 opacity-40" />
                  <p className="text-xl font-black tracking-tighter italic leading-snug">
                    "Wealth is not about having a lot of money; it's about options."
                  </p>
                  <div className="space-y-1">
                    <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Directive</div>
                    <div className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Master the map, secure the alpha.</div>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-white/5 border-dashed rounded-[2.5rem] flex flex-col items-center text-center gap-4 group hover:bg-white/[0.02] transition-colors">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Terminal Status</div>
                  <div className="text-xs font-black">All Nodes Active</div>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* Professional Footer */}
        <footer className="mt-24 pt-12 border-t border-white/5 pb-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4 col-span-2">
              <div className="text-sm font-black tracking-tighter uppercase">Money Map.</div>
              <p className="text-[10px] font-bold text-white/40 leading-relaxed max-w-xs uppercase tracking-widest">
                High-frequency financial terminal for the modern enterprise. Secure, distributed, and immutable by design.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-[9px] font-black uppercase tracking-[0.3em]">Legal</div>
              <ul className="space-y-2">
                <li className="text-[9px] font-bold text-white/40 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Privacy Protocol</li>
                <li className="text-[9px] font-bold text-white/40 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Terms of Access</li>
                <li className="text-[9px] font-bold text-white/40 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Cookie Policy</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="text-[9px] font-black uppercase tracking-[0.3em]">Security</div>
              <ul className="space-y-2">
                <li className="text-[9px] font-bold text-white/40 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Compliance v4</li>
                <li className="text-[9px] font-bold text-white/40 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Node Status</li>
                <li className="text-[9px] font-bold text-white/40 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Audit Logs</li>
              </ul>
            </div>
          </div>
          <div className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10 text-center">
            © 2026 MoneyMap Intelligence Systems • Sovereign Encryption Enabled
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <AddTransactionModal 
            onClose={() => setIsModalOpen(false)} 
            onAdd={handleAddTransaction} 
          />
        )}
        {editingTransaction && (
          <EditTransactionModal 
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            onUpdate={handleUpdateTransaction}
          />
        )}
        {editingHolding && (
          <EditHoldingModal 
            holding={editingHolding}
            onClose={() => setEditingHolding(null)}
            onUpdate={handleUpdateHolding}
            onDelete={handleDeleteHolding}
          />
        )}
        {isProfileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsProfileOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0D0D0D] border border-white/10 p-10 rounded-[3rem] w-full max-w-lg space-y-8 relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 p-2">
                  <div className="w-full h-full rounded-full bg-emerald-400 flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-black" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">{user?.name}</h2>
                  <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-lg font-black text-emerald-400">Verified</div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Tier</div>
                  <div className="text-lg font-black text-amber-400">Elite</div>
                </div>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={handleLogout}
                  className="flex justify-between items-center p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group text-red-500"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
                  </div>
                  <span className="opacity-40">→</span>
                </div>
              </div>

              <button 
                onClick={() => setIsProfileOpen(false)}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest"
              >
                Return to Terminal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
