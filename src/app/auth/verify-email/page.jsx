'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your dream address...');

  useEffect(() => {
    const runVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await api.auth.verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.');
      }
    };

    runVerification();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-deep px-4 py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-10 text-center shadow-2xl">
          <div className="flex justify-center mb-10">
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="shwapner Thikana" width={120} height={60} className="h-[60px] w-auto object-contain" />
            </Link>
          </div>

          {status === 'verifying' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Loader2 size={60} className="text-brand-gold animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">Verifying...</h2>
              <p className="text-zinc-400">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 size={64} className="text-brand-emerald" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">Welcome Home!</h2>
              <p className="text-zinc-400 leading-relaxed">{message}</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
              >
                Sign In to Your Account
                <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <XCircle size={64} className="text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">Verification Failed</h2>
              <p className="text-zinc-400 leading-relaxed">{message}</p>
              <div className="flex flex-col gap-4">
                <Link
                  href="/auth/register"
                  className="w-full py-4 bg-white/5 border border-white/10 text-zinc-100 font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95"
                >
                  Back to Registration
                </Link>
                <Link
                  href="/"
                  className="text-brand-gold hover:underline text-sm font-medium"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-royal-deep flex items-center justify-center">
        <Loader2 size={40} className="text-brand-gold animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
