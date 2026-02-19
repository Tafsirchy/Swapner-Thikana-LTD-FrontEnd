'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Home, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const UnsubscribeContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing unsubscribe token.');
        return;
      }

      try {
        const response = await api.newsletter.unsubscribe(token);
        setStatus('success');
        setMessage(response.data.message || 'You have been successfully unsubscribed.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Unsubscription failed. The link may have expired.');
      }
    };

    handleUnsubscribe();
  }, [token]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
            <h1 className="text-2xl font-cinzel text-white">Processing Request...</h1>
            <p className="text-zinc-400">Removing your email from our luxury distribution list.</p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-cinzel text-white">Unsubscribed</h1>
              <p className="text-zinc-400">{message}</p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
              <Link 
                href="/" 
                className="flex-1 px-6 py-3 bg-brand-gold text-royal-deep rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-gold-light transition-colors"
              >
                <Home size={18} />
                Return Home
              </Link>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-cinzel text-white">Request Failed</h1>
              <p className="text-zinc-400">{message}</p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
              <Link 
                href="/contact" 
                className="flex-1 px-6 py-3 border border-white/10 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/" 
                className="flex-1 px-6 py-3 bg-zinc-900 text-zinc-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Website
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UnsubscribePage = () => {
  return (
    <div className="min-h-screen bg-black pt-20">
      <Suspense fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-black">
          <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
};

export default UnsubscribePage;
