'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Heart, Search, Settings, 
  Menu, X, Building2, PlusCircle, Users, FileText, 
  BarChart3, Bell, MessageSquare, ChevronDown, ChevronUp, Info, LogOut, Home
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

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
    { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Role-based Navigation
  const getNavLinks = () => {
    switch (user?.role) {
      case 'agent':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { name: 'My Listings', href: '/dashboard/properties', icon: Building2 },
          { name: 'Add Property', href: '/dashboard/properties/add', icon: PlusCircle },
          { name: 'My Leads', href: '/dashboard/leads', icon: Users },
          { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
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
          { name: 'Seller Inquiries', href: '/dashboard/admin/seller-inquiries', icon: Users },
          { name: 'Leads Pipeline', href: '/dashboard/leads', icon: BarChart3 },
          { name: 'Reviews', href: '/dashboard/admin/reviews', icon: MessageSquare },
          { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
          { name: 'Blogs', href: '/dashboard/admin/blogs', icon: FileText },
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
          fixed top-0 left-0 bottom-0 w-72 bg-zinc-900 border-r border-white/5 
          z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden px-6 pt-6 pb-2 flex items-center justify-between">
            <span className="font-bold text-xl text-zinc-100">Dashboard</span>
            <button onClick={toggleSidebar} className="text-zinc-400 p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Desktop Logo (Restored since Navbar is gone) */}
          <div className="hidden lg:flex items-center gap-3 px-8 pt-6 pb-2">
             <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image src="/logo.png" alt="shwapner Thikana" width={40} height={40} className="h-8 w-auto object-contain" />
             </Link>
             <span className="font-bold text-2xl text-zinc-100 tracking-wide font-cinzel">Dashboard</span>
          </div>

          <div className="flex flex-col h-full">
            <div className="px-4 pt-6 pb-2 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              <div className="flex items-center gap-3 px-4 py-4 mb-8 bg-white/5 rounded-2xl border border-white/5 mt-2">
                <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-royal-deep font-bold text-lg">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold truncate">{user?.name}</h4>
                  <span className="text-xs text-brand-gold uppercase tracking-wider font-bold">{user?.role}</span>
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
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm group ${
                            isAnySubActive && !isExpanded
                              ? 'bg-brand-gold/10 text-brand-gold' 
                              : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <link.icon size={18} className={isAnySubActive ? 'text-brand-gold' : 'text-zinc-500 group-hover:text-zinc-300'} />
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
                                        : 'text-zinc-500 hover:text-zinc-300'
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
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm group ${
                        isActive 
                          ? 'bg-brand-gold text-royal-deep font-bold shadow-lg shadow-brand-gold/20' 
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                      }`}
                    >
                      <link.icon size={18} className={isActive ? 'text-royal-deep' : 'text-zinc-500 group-hover:text-zinc-300'} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="px-4 pb-20 space-y-2 border-t border-white/5 pt-4 relative z-10 bg-zinc-900">
               <button
                type="button"
                onClick={() => logout?.()}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm text-zinc-400 hover:bg-red-500/10 hover:text-red-500 group"
              >
                <LogOut size={18} className="text-zinc-500 group-hover:text-red-500" />
                Logout
              </button>

               <Link
                href="/"
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100 group"
              >
                <Home size={18} className="text-zinc-500 group-hover:text-zinc-300" />
                Back to Home
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content - Converted to Window Scroll */}
        <main className="flex-1 flex flex-col min-w-0 min-h-screen lg:ml-72 pt-0">
          {/* Topbar (Mobile Only) */}
          <header className="lg:hidden h-16 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between px-4">
            <button onClick={toggleSidebar} className="text-zinc-400">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="shwapner Thikana" width={120} height={40} className="h-8 w-auto object-contain" />
            </Link>
            <div className="w-6"></div> {/* Spacer for balance */}
          </header>

          <div className="p-4 lg:p-8 relative flex-1">
            {/* Top Header (Desktop) - Only show on Overview page */}
            {pathname === '/dashboard' && (
              <header className="hidden lg:flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                 <div>
                    <h1 className="text-4xl font-bold text-zinc-100">Overview</h1>
                    <p className="text-zinc-400 text-lg mt-2">Welcome back, {user?.name}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <button className="p-3 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-brand-gold transition-colors relative">
                       <Bell size={20} />
                       <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                 </div>
              </header>
            )}

            {children}
          </div>

          {/* Dashboard Copyright Footer */}
          <div className="py-6 text-center text-xs text-zinc-600 border-t border-white/5">
              &copy; 2024 shwapner Thikana Ltd.
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
