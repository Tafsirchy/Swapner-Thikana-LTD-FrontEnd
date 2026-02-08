'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import LiquidButton from '@/components/shared/LiquidButton';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setIsVisible(latest > 0.7);
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: [0, -8, 0] 
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 }
          }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <LiquidButton
            onClick={scrollToTop}
            rounded="rounded-full"
            baseColor="bg-brand-gold"
            liquidColor="fill-white/20"
            px="px-0"
            py="py-0"
            className="w-14 h-14 !p-0 shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.6)] !flex !items-center !justify-center"
            aria-label="Back to top"
          >
            <ArrowUp size={24} strokeWidth={2.5} className="text-royal-deep" />
          </LiquidButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
