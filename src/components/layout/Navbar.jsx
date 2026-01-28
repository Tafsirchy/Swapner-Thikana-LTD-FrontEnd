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

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { 
      name: 'About', 
      href: '/about',
      hasDropdown: true,
      dropdownItems: {
        left: [
          { name: 'Our Magazines', href: '/about/magazines' },
          { name: 'Our Agencies', href: '/about/agencies' },
          { name: 'Our History', href: '/about/history' }
        ],
        right: [
          { name: 'Management', href: '/about/management' },
          { name: 'Agents', href: '/agents' },
          { name: 'Newsletter', href: '/about/newsletter' }
        ]
      }
    },
    { name: 'Contact Us', href: '/contact' },
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
              
              if (link.hasDropdown) {
                return (
                  <div 
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsAboutOpen(true)}
                    onMouseLeave={() => setIsAboutOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-colors relative group py-2 flex items-center gap-1 ${
                        isActive || isAboutOpen ? 'text-brand-gold' : 'text-zinc-100 hover:text-brand-gold'
                      }`}
                    >
                      {link.name}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {isAboutOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
                        >
                          <div className="bg-royal-deep/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl min-w-[500px] flex gap-12 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl"></div>
                            
                            {/* Left Column */}
                            <div className="flex-1">
                              <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">Experience</h4>
                              <div className="flex flex-col gap-4">
                                {link.dropdownItems.left.map((sub) => (
                                  <Link 
                                    key={sub.name} 
                                    href={sub.href}
                                    className="text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap flex items-center group/sub"
                                  >
                                    <span className="w-0 group-hover/sub:w-2 h-px bg-brand-gold mr-0 group-hover/sub:mr-2 transition-all"></span>
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px bg-white/5 self-stretch"></div>

                            {/* Right Column */}
                            <div className="flex-1">
                              <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-2">Network</h4>
                              <div className="flex flex-col gap-4">
                                {link.dropdownItems.right.map((sub) => (
                                  <Link 
                                    key={sub.name} 
                                    href={sub.href}
                                    className="text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap flex items-center group/sub"
                                  >
                                    <span className="w-0 group-hover/sub:w-2 h-px bg-brand-gold mr-0 group-hover/sub:mr-2 transition-all"></span>
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

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
            className="fixed inset-0 top-[60px] bg-royal-deep/98 z-40 md:hidden flex flex-col p-8 gap-6 backdrop-blur-xl overflow-y-auto"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              if (link.hasDropdown) {
                return (
                  <div key={link.name} className="flex flex-col gap-4">
                    <span className="text-2xl font-bold text-brand-gold italic">{link.name}</span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 pl-4">
                      {[...link.dropdownItems.left, ...link.dropdownItems.right].map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="text-lg font-medium text-zinc-300 hover:text-brand-gold py-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

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
