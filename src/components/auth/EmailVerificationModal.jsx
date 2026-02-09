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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close Button - only show after successful verification */}
            {verificationStatus === 'success' && (
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-30 p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
              >
                <X size={16} />
              </button>
            )}

            <div className="p-6 text-center space-y-4">
              {/* Icon */}
              <div className="flex justify-center">
                {verificationStatus === 'pending' && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-14 h-14 rounded-xl bg-brand-gold/10 flex items-center justify-center"
                  >
                    <Mail size={28} className="text-brand-gold" />
                  </motion.div>
                )}
                {verificationStatus === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center"
                  >
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </motion.div>
                )}
              </div>

              {/* Content based on status */}
              {verificationStatus === 'pending' && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100 mb-2">Verify Your Email</h2>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      We've sent a verification link to:
                    </p>
                    <p className="text-brand-gold font-bold mt-1.5 text-sm break-all">{userEmail || '(No email provided)'}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-brand-gold font-bold text-xs">1</span>
                      </div>
                      <p className="text-zinc-300 text-xs">Check your email inbox (and spam folder)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-brand-gold font-bold text-xs">2</span>
                      </div>
                      <p className="text-zinc-300 text-xs">Click the verification link in the email</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-brand-gold font-bold text-xs">3</span>
                      </div>
                      <p className="text-zinc-300 text-xs">Return here to see confirmation</p>
                    </div>
                  </div>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-emerald-400 text-xs"
                    >
                      {message}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <button
                      onClick={handleResendEmail}
                      disabled={resendCooldown > 0 || isResending}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:opacity-50 border border-white/10 text-zinc-100 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : resendCooldown > 0 ? (
                        <>
                          <Clock size={16} />
                          Resend in {resendCooldown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw size={16} />
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
