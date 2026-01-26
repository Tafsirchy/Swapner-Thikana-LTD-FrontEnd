'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }

    if (!loading && isAuthenticated && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      router.push('/unauthorized');
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-royal-deep">
        <Loader2 size={48} className="text-brand-gold animate-spin" />
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
