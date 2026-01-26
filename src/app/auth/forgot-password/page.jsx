'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.auth.forgotPassword(email);
      setIsSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-deep px-4 py-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-10">
              <Link href="/" className="inline-block">
                <img src="/logo.png" alt="shwapner Thikana" className="h-[60px] w-auto" />
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">Reset Password</h2>
            <p className="text-zinc-400 text-sm mt-2">
              {isSent 
                ? "We've sent a luxury reset link to your email." 
                : "Enter your email to receive a password reset link."}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-[0.98] shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-royal-deep/30 border-t-royal-deep rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Reset Link
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-sm">
                Check your email (including spam folder) for the reset link. It will expire in 10 minutes.
              </div>
              <button 
                onClick={() => setIsSent(false)}
                className="text-brand-gold hover:underline text-sm font-medium"
              >
                Didn&apos;t receive it? Try again
              </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-brand-gold transition-colors text-sm">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
