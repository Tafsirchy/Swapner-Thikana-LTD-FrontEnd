'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import logger from '@/utils/logger';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const EmailVerificationModal = ({ isOpen, onClose, userEmail }) => {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [message, setMessage] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const router = useRouter();

  // Removed polling to save server resources and prevent abuse
  // User should click the link in the email to verify
  // useEffect(() => {
  //   if (!isOpen || verificationStatus !== 'pending') return;
  //   const checkInterval = setInterval(async () => { ... }, 3000);
  //   return () => clearInterval(checkInterval);
  // }, [isOpen, verificationStatus]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Redirect countdown after success
  useEffect(() => {
    if (verificationStatus === 'success' && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verificationStatus === 'success' && redirectCountdown === 0) {
      router.push('/auth/login');
    }
  }, [verificationStatus, redirectCountdown, router]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return;

    // Validate email before sending
    if (!userEmail || !userEmail.trim()) {
      setMessage('Email address is missing. Please try registering again.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsResending(true);
    try {
      logger.log('Resending verification email to:', userEmail);
      await api.auth.resendVerification({ email: userEmail });
      setResendCooldown(60); // 60 seconds cooldown
      setMessage('Verification email sent! Please check your inbox.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      logger.error('Email verification failed', err);
      toast.error(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    // Only allow closing after successful verification
    if (verificationStatus === 'success') {
      router.push('/auth/login');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[6000] flex items-start md:items-center justify-center p-4 pt-28 md:pt-4 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-full max-w-sm bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Close Button - only show after successful verification */}
            {verificationStatus === 'success' && (
              <button 
                onClick={handleClose}
                className="absolute top-6 right-6 z-30 p-2 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
              >
                <X size={18} />
              </button>
            )}

            <div className="p-8 md:p-8 text-center space-y-6 md:space-y-4">
              {/* Icon */}
              <div className="flex justify-center">
                {verificationStatus === 'pending' && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 md:w-14 h-16 md:h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 shadow-[0_0_20px_rgba(196,158,103,0.15)]"
                  >
                    <Mail size={32} className="text-brand-gold md:w-6 md:h-6" />
                  </motion.div>
                )}
                {verificationStatus === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 md:w-14 h-16 md:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  >
                    <CheckCircle2 size={32} className="text-emerald-500 md:w-6 md:h-6" />
                  </motion.div>
                )}
              </div>

              {/* Content based on status */}
              {verificationStatus === 'pending' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-xl font-bold text-zinc-100 mb-2 font-cinzel tracking-wider">Verify Your Email</h2>
                    <p className="text-zinc-400 text-sm md:text-xs leading-relaxed max-w-[280px] mx-auto">
                      We've sent a verification link to:
                    </p>
                    <p className="text-brand-gold font-bold mt-2 text-sm break-all bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 inline-block">{userEmail || '(No email provided)'}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-4 space-y-4 md:space-y-2 text-left">
                    <div className="flex items-start gap-4 md:gap-3">
                      <div className="w-8 md:w-6 h-8 md:h-6 rounded-xl md:rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-gold/20">
                        <span className="text-brand-gold font-bold text-sm md:text-xs">1</span>
                      </div>
                      <p className="text-zinc-300 text-[13px] md:text-xs leading-snug">Check your email inbox <span className="text-zinc-500">(and spam folder)</span></p>
                    </div>
                    <div className="flex items-start gap-4 md:gap-3">
                      <div className="w-8 md:w-6 h-8 md:h-6 rounded-xl md:rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-gold/20">
                        <span className="text-brand-gold font-bold text-sm md:text-xs">2</span>
                      </div>
                      <p className="text-zinc-300 text-[13px] md:text-xs leading-snug">Click the verification link in the email</p>
                    </div>
                    <div className="flex items-start gap-4 md:gap-3">
                      <div className="w-8 md:w-6 h-8 md:h-6 rounded-xl md:rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-gold/20">
                        <span className="text-brand-gold font-bold text-sm md:text-xs">3</span>
                      </div>
                      <p className="text-zinc-300 text-[13px] md:text-xs leading-snug">Return here to see confirmation</p>
                    </div>
                  </div>

                  {message && (
                    <motion.div style={{ marginTop: '1.5rem' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-400 text-xs font-medium"
                    >
                      {message}
                    </motion.div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleResendEmail}
                      disabled={resendCooldown > 0 || isResending}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 border border-white/10 text-zinc-100 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest active:scale-[0.98]"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : resendCooldown > 0 ? (
                        <>
                          <Clock size={18} />
                          Resend in {resendCooldown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw size={18} />
                          Resend Verification Email
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {verificationStatus === 'success' && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100 mb-2">Welcome Aboard! 🎉</h2>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Your email has been verified successfully.
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <p className="text-emerald-400 text-xs font-medium">
                      Redirecting to login page in <span className="font-bold text-base">{redirectCountdown}</span> seconds...
                    </p>
                  </div>

                  <button
                    onClick={() => router.push('/auth/login')}
                    className="w-full py-3 bg-brand-gold hover:bg-brand-gold-light text-royal-deep font-bold rounded-lg transition-all shadow-lg shadow-brand-gold/20 text-sm"
                  >
                    Sign In Now
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmailVerificationModal;
