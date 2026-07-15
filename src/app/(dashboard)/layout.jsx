'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Heart, Search, Settings, 
  Menu, X, Building2, PlusCircle, Users, FileText, 
  BarChart3, Bell, MessageSquare, ChevronDown, ChevronUp, Info, LogOut, Home, Map, User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SmartImage from '@/components/shared/SmartImage';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import SmartImage from '@/components/shared/SmartImage';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState(['about']);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
  const toggleExpand = (name) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const commonCustomerLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Saved Searches', href: '/dashboard/saved-searches', icon: Search },
    { name: 'Wishlist', href: '/dashboard/saved', icon: Heart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Role-based Navigation
  const getNavLinks = () => {
    switch (user?.role) {
      case 'agent':
        return [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Add Property', href: '/dashboard/properties/add', icon: PlusCircle },
          { name: 'Add Project', href: '/dashboard/projects/add', icon: PlusCircle },
          { name: 'My Projects', href: '/dashboard/projects', icon: Building2 },
          { name: 'My Properties', href: '/dashboard/properties', icon: Building2 },
          { name: 'My Leads', href: '/dashboard/leads', icon: Users },
          { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
          { name: 'Saved Searches', href: '/dashboard/saved-searches', icon: Search },
          { name: 'Wishlist', href: '/dashboard/saved', icon: Heart },
          { name: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { name: 'Users', href: '/dashboard/admin/users', icon: Users },
          { name: 'About CMS', id: 'about', icon: Info, isCollapsible: true, subLinks: [
            { name: 'Magazines', href: '/dashboard/admin/magazines' },
            { name: 'Agencies', href: '/dashboard/admin/agencies' },
            { name: 'History', href: '/dashboard/admin/about/history' },
            { name: 'Management', href: '/dashboard/admin/management' },
            { name: 'Agents', href: '/dashboard/admin/agents' },
            { name: 'Newsletter', href: '/dashboard/admin/about/newsletter' },
          ]},
          {name: 'Properties', href: '/dashboard/admin/properties', icon: Building2 },
          { name: 'Projects', href: '/dashboard/admin/projects', icon: Building2 },
          { name: 'Master Plan', href: '/dashboard/admin/master-plan', icon: Map },
          { name: 'Seller Inquiries', href: '/dashboard/admin/seller-inquiries', icon: Users },
          { name: 'Leads Pipeline', href: '/dashboard/leads', icon: BarChart3 },
          { name: 'Reviews', href: '/dashboard/admin/reviews', icon: MessageSquare },
          { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
          { name: 'Blogs', href: '/dashboard/admin/blogs', icon: FileText },
          { name: 'Saved Searches', href: '/dashboard/saved-searches', icon: Search },
          { name: 'Wishlist', href: '/dashboard/saved', icon: Heart },
          { name: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'management':
        return [
          { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
          { name: 'About CMS', id: 'about', icon: Info, isCollapsible: true, subLinks: [
            { name: 'Magazines', href: '/dashboard/admin/magazines' },
            { name: 'Agencies', href: '/dashboard/admin/agencies' },
            { name: 'History', href: '/dashboard/admin/about/history' },
            { name: 'Management', href: '/dashboard/admin/management' },
            { name: 'Agents', href: '/dashboard/admin/agents' },
          ]},
          { name: 'Properties', href: '/dashboard/admin/properties', icon: Building2 },
          { name: 'Projects', href: '/dashboard/admin/projects', icon: Building2 },
          { name: 'Master Plan', href: '/dashboard/admin/master-plan', icon: Map },
          { name: 'Leads Pipeline', href: '/dashboard/leads', icon: BarChart3 },
          { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
          { name: 'Saved Searches', href: '/dashboard/saved-searches', icon: Search },
          { name: 'Wishlist', href: '/dashboard/saved', icon: Heart },
          { name: 'Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'customer':
      default:
        return commonCustomerLinks;
    }
  };

  const links = getNavLinks();

  return (
    <ProtectedRoute>
      <div className="min-h-screen max-container flex font-sans text-zinc-100">
        
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 bottom-0 w-[85vw] sm:w-72 bg-zinc-900 border-r border-white/5 
          z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden px-6 pt-6 pb-2 flex items-center justify-between">
            <span className="font-bold text-xl text-zinc-100">Dashboard</span>
            <button 
              onClick={toggleSidebar} 
              className="text-zinc-400 p-2 hover:bg-white/5 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close Sidebar"
            >
              <X size={24} />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 px-8 pt-8 pb-2">
             <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
                <div className="w-10 h-10 relative">
                   <SmartImage 
                      src="/logo-new.webp" 
                      alt="Shwapner Thikana" 
                      fill 
                      priority 
                      className="object-contain" 
                   />
                </div>
             </Link>
             <span className="font-bold text-xl text-zinc-100 tracking-widest font-cinzel uppercase border-l border-white/10 pl-4 py-1">Dashboard</span>
          </div>

          <div className="flex flex-col h-full">
            <div className="px-3 sm:px-4 pt-2 pb-2 flex-1 overflow-y-auto min-h-0 custom-scrollbar" data-lenis-prevent>
              <div className="flex items-center gap-4 px-4 py-4 mb-6 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl border border-white/10 shadow-xl group hover:border-brand-gold/30 transition-all duration-300">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-gold flex items-center justify-center text-royal-deep font-bold text-lg sm:text-xl shadow-lg shadow-brand-gold/20 group-hover:scale-105 transition-transform overflow-hidden relative">
                    {user?.avatar || user?.image ? (
                      <SmartImage 
                        src={user.avatar || user.image} 
                        alt={user.name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full z-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-100 font-cinzel tracking-wider uppercase leading-tight truncate-two-lines" title={user?.name}>
                    {user?.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-brand-gold/20">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="space-y-1 mb-2">
                {links.map((link) => {
                  if (link.subLinks) {
                    const isExpanded = expandedItems.includes(link.id);
                    const isAnySubActive = link.subLinks.some(sub => pathname === sub.href);
                    
                    return (
                      <div key={link.id} className="space-y-1">
                        <button
                          onClick={() => toggleExpand(link.id)}
                          aria-expanded={isExpanded}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 sm:py-3.5 rounded-xl transition-all font-medium text-sm group ${
                            isAnySubActive && !isExpanded
                              ? 'bg-brand-gold/10 text-brand-gold' 
                              : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <link.icon size={18} className={isAnySubActive ? 'text-brand-gold' : 'text-zinc-400 group-hover:text-zinc-300'} />
                            {link.name}
                          </div>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-11 space-y-1"
                            >
                              {link.subLinks.map((sub) => {
                                const isSubActive = pathname === sub.href;
                                return (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-4 py-2 rounded-lg transition-all text-sm ${
                                      isSubActive 
                                        ? 'text-brand-gold font-bold' 
                                        : 'text-zinc-400 hover:text-zinc-300'
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 sm:py-3.5 rounded-xl transition-all font-medium text-sm group ${
                        isActive 
                          ? 'bg-brand-gold text-royal-deep font-bold shadow-lg shadow-brand-gold/20' 
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                      }`}
                    >
                      <link.icon size={18} className={isActive ? 'text-royal-deep' : 'text-zinc-400 group-hover:text-zinc-300'} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="px-4 mb-2 pb-20 space-y-2 border-t border-white/5 pt-4 relative z-10 bg-zinc-900">
               <button
                type="button"
                onClick={() => logout?.()}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-500 group"
              >
                <LogOut size={18} className="text-zinc-400 group-hover:text-red-500" />
                Logout
              </button>

               <Link
                href="/"
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100 group"
              >
                <Home size={18} className="text-zinc-400 group-hover:text-zinc-300" />
                Back to Home
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content - Converted to Window Scroll */}
        <main className="flex-1 flex flex-col min-w-0 min-h-screen lg:ml-72 pt-0">
          {/* Topbar (Mobile Only) */}
          <header className="lg:hidden h-20 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-50">
            <button 
              onClick={toggleSidebar} 
              className="text-zinc-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open Sidebar"
            >
              <Menu size={26} />
            </button>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <SmartImage 
                   src="/logo-new.webp" 
                   alt="Shwapner Thikana" 
                   fill 
                   priority 
                   noBg
                   className="object-contain" 
                />
              </div>
              <span className="font-bold text-lg text-zinc-100 font-cinzel tracking-widest uppercase">Dashboard</span>
            </Link>
            <div className="w-6"></div>
          </header>

          <ErrorBoundary 
            title="Dashboard Error"
            message="We encountered an error loading this dashboard page. Please try refreshing or contact support if the problem persists."
          >
            <div className="p-3.5 sm:p-4 lg:p-8 relative flex-1">
              {/* Top Header (Desktop) - Only show on Overview page */}
              {pathname === '/dashboard' && (
                <DashboardPageHeader 
                  title="Overview"
                  subtitle={`Welcome back, ${user?.name}`}
                  className="flex"
                />
              )}

              {children}
            </div>

            {/* Dashboard Copyright Footer */}
            <div className="py-6 text-center text-xs text-zinc-600 border-t border-white/5">
                &copy; 2026 Shwapner Thikana Ltd.
            </div>
          </ErrorBoundary>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
