'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from './NotificationBell';
import LiquidButton from '../shared/LiquidButton';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftNav = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
  ];

  const rightNav = [
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
          { name: 'Agents', href: '/about/agents' },
          { name: 'Newsletter', href: '/about/newsletter' }
        ]
      }
    },
    { name: 'Contact Us', href: '/contact' },
  ];

  if (isAuthenticated) {
    rightNav.push({ name: 'Dashboard', href: '/dashboard' });
  }

  const isDashboard = pathname.startsWith('/dashboard');
  const isDetailsPage = pathname.includes('/properties/') || pathname.includes('/projects/');

  const renderNavLink = (link) => {
    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

    if (link.hasDropdown) {
      return (
        <div 
          key={link.name}
          className="relative h-full flex items-center"
          onMouseEnter={() => setIsAboutOpen(true)}
          onMouseLeave={() => setIsAboutOpen(false)}
        >
          <Link
            href={link.href}
            className={`text-sm tracking-widest uppercase font-cinzel font-medium transition-colors relative group py-2 flex items-center gap-1 ${
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
                className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
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
                          className="text-zinc-400 hover:text-white transition-colors text-sm font-cinzel font-medium whitespace-nowrap flex items-center group/sub"
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
                          className="text-zinc-400 hover:text-white transition-colors text-sm font-cinzel font-medium whitespace-nowrap flex items-center group/sub"
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
        className={`text-sm tracking-widest uppercase font-cinzel font-medium transition-colors relative group py-2 ${
          isActive ? 'text-brand-gold' : 'text-zinc-100 hover:text-brand-gold'
        }`}
      >
        {link.name}
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}></span>
      </Link>
    );
  };

  // Hide Navbar on dashboard as per user request
  if (pathname.startsWith('/dashboard')) return null;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDashboard ? 'py-2' : 'py-3 md:py-0'
      } ${
        isScrolled || isDashboard || isDetailsPage
          ? 'bg-royal-deep/90 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}
    >
      {/* Utility Bar - Absolute Top Right */}
      {!isDashboard && (
        <div className="absolute top-5 right-4 z-50 hidden md:flex items-center gap-4">
           {/* Utility Icons */}
           {/* Utility Icons */}
           <div className="relative">
             <button 
               onClick={() => setIsSearchOpen(!isSearchOpen)}
               className={`transition-colors relative group ${isSearchOpen ? 'text-brand-gold' : 'text-zinc-100 hover:text-brand-gold'}`}
             >
               <Search size={18} />
               <span className="sr-only">Search</span>
             </button>

             <AnimatePresence>
               {isSearchOpen && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                   transition={{ duration: 0.15 }}
                   className="absolute right-0 mt-4 w-48 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                 >
                   <Link 
                     href="/properties" 
                     className="block px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors font-cinzel tracking-wider"
                     onClick={() => setIsSearchOpen(false)}
                   >
                     PROPERTIES
                   </Link>
                   <Link 
                     href="/projects" 
                     className="block px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors font-cinzel tracking-wider border-t border-white/5"
                     onClick={() => setIsSearchOpen(false)}
                   >
                     PROJECTS
                   </Link>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

           <Link href={user ? "/dashboard/saved" : "/auth/login"} className="text-zinc-100 hover:text-brand-gold transition-colors relative group">
             <Heart size={18} />
             {user?.savedProperties?.length > 0 && (
               <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-gold text-royal-deep text-[9px] font-bold rounded-full flex items-center justify-center">
                 {user.savedProperties.length}
               </span>
             )}
           </Link>
           
           {/* Notification Bell */}
           {user && <NotificationBell />}

           {/* Auth Button */}
           {isAuthenticated ? (
            <LiquidButton
               onClick={logout}
               baseColor="bg-red-500/10"
               liquidColor="fill-red-500/20"
               className="!px-4 !py-1.5 border border-red-500/30 !text-red-400 !text-xs !font-semibold uppercase tracking-wider"
               rounded="rounded-full"
            >
               <User size={14} />
               Logout
            </LiquidButton>
          ) : (
            <LiquidButton
              href="/auth/login"
              baseColor="bg-brand-gold/10"
              liquidColor="fill-brand-gold/30"
              className="!px-4 !py-1.5 border border-brand-gold/30 !text-brand-gold !text-xs !font-bold uppercase tracking-wider"
              rounded="rounded-full"
            >
              <User size={14} />
              Login
            </LiquidButton>
          )}
        </div>
      )}

      {/* Main Navigation Container */}
      <div className="max-container h-full flex justify-center px-4 relative">
        
        {/* Mobile: Logo Centered, Menu Icon Left */}
        {!isDashboard && (
          <div className="md:hidden w-full flex justify-between items-center">
             <button
               className="text-brand-gold p-2"
               onClick={() => setIsOpen(!isOpen)}
               aria-label={isOpen ? "Close Menu" : "Open Menu"}
             >
               {isOpen ? <X size={28} /> : <Menu size={28} />}
             </button>
            
            <Link href="/" className="flex items-center absolute left-1/2 -translate-x-1/2">
                <Image src="/logo.png" alt="shwapner Thikana" width={110} height={64} className="h-14 w-auto object-contain" />
            </Link>

            {/* Mobile Search/Cart Placeholder for balance */}
            <div className="w-10"></div>
          </div>
        )}

        {/* Desktop: Centered Split Navigation */}
        {!isDashboard && (
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] py-2 items-end w-full">
            
            {/* Left Nav - Aligned Left */}
            <div className="flex items-center gap-8 justify-start">
               {leftNav.map(renderNavLink)}
            </div>

            {/* Centered Logo */}
            <div className="flex justify-center">
              <Link href="/" className="hover:scale-105 transition-transform duration-300">
                  <Image src="/logo.png" alt="shwapner Thikana" width={160} height={90} className="h-24 w-auto object-contain drop-shadow-2xl" />
              </Link>
            </div>

            {/* Right Nav - Aligned Right */}
            <div className="flex items-center gap-8 justify-end">
               {rightNav.map(renderNavLink)}
            </div>

          </div>
        )}

        {/* Dashboard Logo View (Keep simple) */}
        {isDashboard && (
           <Link href="/" className="hidden md:flex items-center mr-auto">
               <Image src="/logo.png" alt="shwapner Thikana" width={96} height={56} className="h-12 w-auto object-contain" />
           </Link>
        )}
      </div>

      {/* Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {isOpen && !isDashboard && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }} // Slide from left for hamburger
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-full left-0 w-full h-[calc(100vh-100%)] bg-royal-deep/98 z-40 md:hidden flex flex-col p-8 gap-6 backdrop-blur-xl overflow-y-auto border-t border-white/5"
          >
            {[...leftNav, ...rightNav].map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              if (link.hasDropdown) {
                return (
                  <div key={link.name} className="flex flex-col gap-4">
                    <span className="text-xl font-bold text-brand-gold italic border-b border-brand-gold/20 pb-2">{link.name}</span>
                    <div className="grid grid-cols-1 gap-y-3 pl-4">
                      {[...link.dropdownItems.left, ...link.dropdownItems.right].map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="text-base font-medium text-zinc-300 hover:text-brand-gold py-1 flex items-center gap-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/50"></div>
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
                  className={`text-xl font-semibold border-b border-white/5 pb-4 transition-colors ${
                    isActive ? 'text-brand-gold' : 'text-zinc-100 hover:text-brand-gold'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
               {/* Mobile Utilities */}
              {isAuthenticated ? (
                <LiquidButton
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  baseColor="bg-red-500/10"
                  liquidColor="fill-red-500/20"
                  className="w-full !py-4 !text-red-500 !text-lg !font-bold"
                >
                  Sign Out
                </LiquidButton>
              ) : (
                <LiquidButton
                  href="/auth/login"
                  className="w-full !py-4 !text-lg !font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </LiquidButton>
              )}
               <div className="flex justify-center gap-8 py-4 text-zinc-400">
                  <div className="flex flex-col items-center gap-2">
                     <Search size={24} />
                     <span className="text-xs uppercase tracking-widest">Search</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <Heart size={24} />
                     <span className="text-xs uppercase tracking-widest">Wishlist</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
