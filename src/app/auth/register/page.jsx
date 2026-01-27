'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer'
  });
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      toast.success('Registration successful! Please check your email for verification.');
      router.push('/auth/login');
    } else {
      toast.error(result.error || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-deep px-4 py-24 relative overflow-hidden">
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
                <Image src="/logo.png" alt="shwapner Thikana" width={120} height={60} className="h-[60px] w-auto object-contain" />
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">Create Account</h2>
            <p className="text-zinc-400 text-sm mt-2">Join our exclusive real estate community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
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
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Phone Number</label>
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
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
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

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
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
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                    formData.role === 'customer' 
                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' 
                    : 'border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10'
                  }`}
                >
                  <UserCircle size={18} />
                  <span className="text-sm font-semibold">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'agent' })}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                    formData.role === 'agent' 
                    ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' 
                    : 'border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10'
                  }`}
                >
                  <Building size={18} />
                  <span className="text-sm font-semibold">Agent</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1 pb-2">
              <input type="checkbox" required className="w-4 h-4 rounded border-brand-gold/20 bg-zinc-900 text-brand-gold focus:ring-brand-gold" />
              <p className="text-[11px] text-zinc-500">
                I agree to the <Link href="#" className="text-brand-gold">Terms of Service</Link> and <Link href="#" className="text-brand-gold">Privacy Policy</Link>.
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

          <p className="text-center text-zinc-500 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-gold font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Simple Building icon fallback since it wasn't imported
const Building = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M8 10h.01" />
    <path d="M16 10h.01" />
    <path d="M8 14h.01" />
    <path d="M16 14h.01" />
  </svg>
);

export default RegisterPage;
