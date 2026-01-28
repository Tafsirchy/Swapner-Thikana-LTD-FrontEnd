'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
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
          ? 'bg-royal-deep/90 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-container flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="shwapner Thikana" width={96} height={56} className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation - Hidden on Dashboard */}
        {!isDashboard && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative group ${
                    isActive ? 'text-brand-gold' : 'text-zinc-100 hover:text-brand-gold'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
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
          
          {/* Notification Bell - Always visible when logged in */}
          {user && <NotificationBell />}

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
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-2xl font-semibold border-b border-brand-gold/10 pb-4 transition-colors ${
                    isActive ? 'text-brand-gold' : 'text-zinc-100 hover:text-brand-gold'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-auto flex flex-col gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold text-center text-lg active:scale-95 duration-150"
                  aria-label="Sign Out"
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
