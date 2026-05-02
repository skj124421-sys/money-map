import React, { useState } from 'react';
import { Holding } from '../types';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface EditHoldingModalProps {
  holding: Holding;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Holding>) => void;
  onDelete: (id: string) => void;
}

const ASSET_TYPES = ['Equity', 'Mutual Fund', 'Digital Asset', 'Physical'];

export const EditHoldingModal: React.FC<EditHoldingModalProps> = ({ holding, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    assetName: holding.assetName,
    assetType: holding.assetType,
    value: holding.value.toString(),
    investedValue: (holding.investedValue || holding.value).toString(),
    units: holding.units.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assetName || !formData.value) return;
    onUpdate(holding.id, {
      ...formData,
      value: parseFloat(formData.value),
      investedValue: parseFloat(formData.investedValue),
      units: parseFloat(formData.units),
      lastUpdated: new Date().toISOString()
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
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Edit Holding</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Asset Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Reliance Industries"
              className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm font-bold text-white uppercase tracking-widest"
              value={formData.assetName}
              onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Asset Type</label>
            <select
              className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm font-bold text-white appearance-none uppercase tracking-widest"
              value={formData.assetType}
              onChange={(e) => setFormData({ ...formData, assetType: e.target.value as any })}
            >
              {ASSET_TYPES.map(type => (
                <option key={type} value={type} className="bg-[#141414]">{type.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Current Value</label>
              <input
                type="number"
                required
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm font-bold text-white"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Invested Amnt</label>
              <input
                type="number"
                required
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm font-bold text-white"
                value={formData.investedValue}
                onChange={(e) => setFormData({ ...formData, investedValue: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-widest ml-1">Units (Optional)</label>
            <input
              type="number"
              className="w-full p-5 bg-white/5 rounded-2xl border border-white/5 focus:ring-1 focus:ring-white text-sm font-bold text-white"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to remove this holding?')) {
                  onDelete(holding.id);
                  onClose();
                }
              }}
              className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Liquidate
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl"
            >
              Update Asset
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
