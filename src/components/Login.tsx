import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, LifeBuoy } from 'lucide-react';
import { cn } from '../lib/utils';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.1),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-black rounded-2xl mb-6 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">MoneyMap</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Financial Intelligence</p>
        </div>

        <div className="bg-[#141414] border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="ENTER YOUR NAME"
                    className="w-full pl-12 pr-6 py-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-emerald-500 text-sm font-bold placeholder:text-white/10 uppercase tracking-widest transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-6 py-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-emerald-500 text-sm font-bold placeholder:text-white/10 transition-all font-mono"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-emerald-500 text-sm font-bold placeholder:text-white/10 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-black text-red-500 uppercase tracking-widest text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Create Profile' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              {isRegister ? 'Already have access?' : 'Request new profile'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
