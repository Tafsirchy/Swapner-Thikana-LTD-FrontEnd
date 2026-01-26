'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Projects', href: '/projects' },
    { name: 'Agents', href: '/agents' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'Dashboard', href: '/dashboard' });
  }

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isDashboard
          ? 'bg-royal-deep/90 backdrop-blur-md py-3 shadow-lg border-b border-brand-gold/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-container flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Swapner Thikana" className="h-[43px] w-auto" />
        </Link>

        {/* Desktop Navigation - Hidden on Dashboard */}
        {!isDashboard && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-100 hover:text-brand-gold transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isDashboard && (
            <>
              <button className="p-2 text-zinc-100 hover:text-brand-gold transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 text-zinc-100 hover:text-brand-gold transition-colors">
                <Heart size={20} />
              </button>
            </>
          )}
          
          {isAuthenticated ? (
            <button
               onClick={logout}
               className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/50 text-red-500 font-semibold text-sm hover:bg-red-500 hover:text-white transition-all"
            >
               <User size={16} />
               Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold text-royal-deep font-semibold text-sm hover:bg-brand-gold-light transition-colors shadow-lg shadow-brand-gold/10 active:scale-95 duration-150"
            >
              <User size={16} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button - Hidden on Dashboard (Dashboard has its own sidebar) */}
        {!isDashboard && (
          <button
            className="md:hidden text-brand-gold p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && !isDashboard && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[60px] bg-royal-deep/98 z-40 md:hidden flex flex-col p-8 gap-6 backdrop-blur-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-semibold text-zinc-100 hover:text-brand-gold border-b border-brand-gold/10 pb-4"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold text-center text-lg active:scale-95 duration-150"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full py-4 rounded-xl bg-brand-gold text-royal-deep font-bold text-center text-lg active:scale-95 duration-150"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </Link>
              )}
              <div className="flex justify-center gap-8 py-4">
                <Search className="text-brand-gold" size={24} />
                <Heart className="text-brand-gold" size={24} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
