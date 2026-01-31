'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, X, ArrowRight, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { subscribeToCompare, removeFromCompare, clearCompare } from '@/utils/compareStore';
import Image from 'next/image';

const CompareBar = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToCompare((list) => {
      setSelectedItems(list);
    });
    return unsubscribe;
  }, []);

  if (selectedItems.length === 0) return null;

  const handleCompare = () => {
    const ids = selectedItems.map(item => item._id).join(',');
    router.push(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] pointer-events-none px-4">
      <div className="max-container mx-auto">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="pointer-events-auto relative glass-extreme border-brand-gold/20 rounded-[2rem] p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Left: Info */}
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {selectedItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="relative w-14 h-14 rounded-2xl border-4 border-royal-deep overflow-hidden shadow-lg group"
                >
                  <Image
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFromCompare(item._id)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="hidden sm:block">
              <h4 className="text-zinc-100 font-bold mb-0.5">
                {selectedItems.length} {selectedItems.length === 1 ? 'Item' : 'Items'} Selected
              </h4>
              <p className="text-zinc-400 text-xs tracking-wider uppercase font-medium">Ready for comparison</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={clearCompare}
              className="px-6 py-3.5 rounded-2xl border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 transition-all text-sm flex items-center gap-2 hover:text-red-300 whitespace-nowrap shadow-lg shadow-red-500/5"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear All</span>
            </button>
            <button
              onClick={handleCompare}
              disabled={selectedItems.length < 2}
              className="flex-1 md:flex-none px-10 py-3.5 bg-brand-gold text-royal-deep rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-light transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Layers size={18} />
              Compare Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Badge (only if many items) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-royal-deep text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-brand-gold/20 border-2 border-royal-deep whitespace-nowrap md:hidden">
            {selectedItems.length} / 4 Selected
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .glass-extreme {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CompareBar;
