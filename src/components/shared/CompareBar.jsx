'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, X, ArrowRight, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { subscribeToCompare, removeFromCompare, clearCompare } from '@/utils/compareStore';
import SmartImage from '@/components/shared/SmartImage';

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
    <div className="fixed bottom-4 left-0 right-0 z-[1000] pointer-events-none px-4">
      <div className="max-container mx-auto">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="pointer-events-auto relative glass-extreme border-brand-gold/20 rounded-2xl md:rounded-[2rem] p-3 md:p-6 shadow-2xl flex items-center justify-between gap-4 md:gap-6"
        >
          {/* Left: Info & Thumbnails */}
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <div className="flex -space-x-3 md:-space-x-4 shrink-0">
              {selectedItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-2 md:border-4 border-royal-deep overflow-hidden shadow-lg group"
                >
                  <SmartImage
                    src={(() => {
                      const img = item.images?.[0];
                      if (!img) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop';
                      if (typeof img === 'object') return img.url || img.original || img.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop';
                      return img;
                    })()}
                    alt={item.title || 'Property'}
                    fill
                    className="object-cover"
                  />

                  <button
                    onClick={() => removeFromCompare(item._id)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    aria-label={`Remove ${item.title || 'item'} from compare`}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="hidden sm:block truncate">
              <h4 className="text-zinc-100 font-bold mb-0.5 text-sm md:text-base">
                {selectedItems.length} {selectedItems.length === 1 ? 'Item' : 'Items'} Selected
              </h4>
              <p className="text-zinc-500 text-[10px] tracking-wider uppercase font-bold italic">Ready for comparison</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button
              onClick={clearCompare}
              className="p-3.5 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl border border-red-500/20 text-red-500/70 font-bold hover:bg-red-500/10 transition-all text-xs flex items-center gap-2 hover:text-red-400 shadow-lg shadow-red-500/5"
              title="Clear All"
              aria-label="Clear all comparison items"
            >
              <Trash2 size={16} />
              <span className="hidden md:inline">Clear All</span>
            </button>
            <button
              onClick={handleCompare}
              disabled={selectedItems.length < 2}
              className="px-5 md:px-10 py-3.5 bg-brand-gold text-royal-deep rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm uppercase tracking-widest shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="md:hidden bg-royal-deep/10 px-2 py-0.5 rounded text-[10px]">{selectedItems.length}</span>
              <Layers size={18} className="hidden sm:block" />
              <span className="hidden sm:inline">Compare Now</span>
              <span className="sm:hidden">Compare</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
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
