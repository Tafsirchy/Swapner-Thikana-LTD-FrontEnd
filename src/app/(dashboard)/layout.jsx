'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Heart, Search, Settings, 
  Menu, X, Building2, PlusCircle, Users, FileText, 
  BarChart3, Bell, MessageSquare
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
          { name: 'Properties', href: '/dashboard/admin/properties', icon: Building2 },
          { name: 'Projects', href: '/dashboard/admin/projects', icon: Building2 },
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
      <div className="min-h-screen max-container flex font-sans text-zinc-100 pt-20">
        
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
          fixed lg:static top-20 left-0 h-[calc(100vh-80px)] w-72 bg-zinc-900/50 border-r border-white/5 
          z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden p-8 flex items-center justify-between">
             {/* Mobile Logo only */}
             <Image src="/logo.png" alt="shwapner Thikana" width={160} height={40} className="h-10 w-auto" />
            <button onClick={toggleSidebar} className="text-zinc-400">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col h-full">
            <div className="px-4 py-6 flex-1 overflow-y-auto min-h-0">
              <div className="flex items-center gap-3 px-4 py-4 mb-8 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-royal-deep font-bold text-lg">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold truncate">{user?.name}</h4>
                  <span className="text-xs text-brand-gold uppercase tracking-wider font-bold">{user?.role}</span>
                </div>
              </div>

              <nav className="space-y-1 mb-4">
                {links.map((link) => {
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

            <div className="p-6 text-center text-xs text-zinc-600">
              &copy; 2024 shwapner Thikana Ltd.
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Topbar (Mobile Only) */}
          <header className="lg:hidden h-16 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between px-4">
            <button onClick={toggleSidebar} className="text-zinc-400">
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg">Dashboard</span>
            <div className="w-8"></div> {/* Spacer */}
          </header>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
            {/* Top Header (Desktop) */}
            <header className="hidden lg:flex items-center justify-between mb-8 pb-6 border-b border-white/5">
               <div>
                  <h1 className="text-2xl font-bold text-zinc-100">Overview</h1>
                  <p className="text-zinc-400 text-sm">Welcome back, {user?.name}</p>
               </div>
               <div className="flex items-center gap-4">
                  <button className="p-3 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-brand-gold transition-colors relative">
                     <Bell size={20} />
                     <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
               </div>
            </header>

            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
