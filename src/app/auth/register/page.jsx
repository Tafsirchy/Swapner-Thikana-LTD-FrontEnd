'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import EmailVerificationModal from '@/components/auth/EmailVerificationModal';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  
  const { register, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Fix 8: Redirect already-authenticated users away from the register page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // While auth state is loading OR user is authenticated (redirect pending),
  // render nothing so the register form never flashes on screen
  if (loading || isAuthenticated) {
    return <div className="min-h-screen bg-royal-deep" />;
  }

  const passwordStrength = useMemo(() => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score <= 1) return { score, label: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Good', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'text-brand-emerald', bg: 'bg-brand-emerald' };
  }, [formData.password]);

  const passwordsMatch = formData.password && formData.confirmPassword 
    ? formData.password === formData.confirmPassword 
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordStrength.score <= 1) {
      toast.error('Please use a stronger password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Create payload without confirmPassword
    const registerData = { ...formData };
    delete registerData.confirmPassword;
    
    const result = await register(registerData);
    
    if (result.success) {
      // Store email and show verification modal instead of redirecting
      setRegisteredEmail(formData.email);
      setShowVerificationModal(true);
      toast.success('Registration successful!');
      
      // Show warning if email wasn't sent
      if (result.emailSent === false) {
        toast.error('Verification email could not be sent. Please use the resend button.', {
          duration: 6000,
        });
      }
    } else {
      toast.error(result.error || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    // Navigate to login when modal is closed
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-deep px-4 pt-24 md:pt-40 pb-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-emerald/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-8">
              <Link href="/" className="inline-block">
                <Image src="/logo-new.webp" alt="Shwapner Thikana" width={120} height={60} className="h-[60px] w-auto object-contain" />
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">Create Account</h2>
            <p className="text-zinc-400 text-sm mt-2">Join our exclusive real estate community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel"
                    required
                    placeholder="+880 1234..."
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Strength Indicator */}
                {formData.password && (
                  <div className="mt-1 flex items-center gap-2 px-1">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                        className={`h-full ${passwordStrength.bg}`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-gold transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-brand-gold/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder:text-zinc-600"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center gap-1.5 px-1">
                    {passwordsMatch ? (
                      <><CheckCircle2 size={12} className="text-brand-emerald" /> <span className="text-[10px] text-brand-emerald font-semibold uppercase">Matched</span></>
                    ) : (
                      <><XCircle size={12} className="text-red-500" /> <span className="text-[10px] text-red-500 font-semibold uppercase">No Match</span></>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1 pb-2 pt-2">
              <input type="checkbox" required className="w-4 h-4 rounded border-brand-gold/20 bg-zinc-900 text-brand-gold focus:ring-brand-gold cursor-pointer" />
              <p className="text-xs text-zinc-500">
                I agree to the <Link href="/terms-of-service" className="text-brand-gold">Terms of Service</Link> and <Link href="/privacy-policy" className="text-brand-gold">Privacy Policy</Link>.
              </p>
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
                  Register Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-zinc-500">Or join with</span>
            </div>
          </div>

          <div className="w-full">
            <a 
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`}
              className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-xl transition-all text-sm font-medium text-zinc-100"
            >
              <svg size={18} viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.28.81-.56z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </a>
          </div>

          <p className="text-center text-zinc-500 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-gold font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Email Verification Modal */}
      <EmailVerificationModal 
        isOpen={showVerificationModal}
        onClose={handleCloseModal}
        userEmail={registeredEmail}
      />
    </div>
  );
};

export default RegisterPage;
